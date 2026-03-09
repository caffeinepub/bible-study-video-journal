import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ExternalBlob, UserRole, type VideoEntry } from "../backend";
import { useActor } from "./useActor";

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
    },
  });
}
