import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ExternalBlob, UserRole, type VideoEntry } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPublicFeedVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoEntry[]>({
    queryKey: ["publicFeedVideos"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getPublicFeedVideos() as Promise<VideoEntry[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyVideos() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  return useQuery<VideoEntry[]>({
    queryKey: ["myVideos"],
    queryFn: async () => {
      if (!actor) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getMyVideos() as Promise<VideoEntry[]>;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useGetUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVideoEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      bibleReference,
      videoBlob,
    }: {
      id: string;
      title: string;
      description: string | null;
      bibleReference: string | null;
      videoBlob: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addVideoEntry(
        id,
        title,
        description,
        bibleReference,
        videoBlob,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["myVideos"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedVideos"] });
    },
  });
}

export function useDeleteVideoEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteVideoEntry(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["myVideos"] });
      queryClient.invalidateQueries({ queryKey: ["publicFeedVideos"] });
    },
  });
}
