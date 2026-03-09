import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import type { VideoEntry } from "../backend";
import { VideoCard } from "./VideoCard";

interface VideoGalleryProps {
  videos: VideoEntry[];
  isLoading: boolean;
  onSelectVideo: (video: VideoEntry) => void;
}

export function VideoGallery({
  videos,
  isLoading,
  onSelectVideo,
}: VideoGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          <div key={i} className="illuminated-card rounded-xl overflow-hidden">
            <Skeleton className="aspect-video bg-muted" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <Skeleton className="h-3 w-1/2 bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <motion.div
        data-ocid="gallery.empty_state"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-24 px-8 text-center"
      >
        <div className="illuminated-card rounded-2xl p-10 max-w-sm w-full">
          {/* Decorative ornament */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center border border-accent/30">
                <BookOpen className="w-9 h-9 text-primary" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent/30 border border-accent/50" />
            </div>
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Your Journal Awaits
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            No videos yet. Start by uploading your first Bible study session and
            build a beautiful record of your spiritual journey.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
            <div className="w-8 h-px bg-border" />
            <span className="font-serif italic">Begin your record</span>
            <div className="w-8 h-px bg-border" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {videos.map((video, index) => (
        <VideoCard
          key={video.id}
          video={video}
          index={index + 1}
          onClick={() => onSelectVideo(video)}
        />
      ))}
    </div>
  );
}
