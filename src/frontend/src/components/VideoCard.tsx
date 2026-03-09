import { BookOpen, Calendar, Play } from "lucide-react";
import { motion } from "motion/react";
import type { VideoEntry } from "../backend";
import { formatNanoDate } from "../utils/formatDate";

interface VideoCardProps {
  video: VideoEntry;
  index: number;
  onClick: () => void;
}

export function VideoCard({ video, index, onClick }: VideoCardProps) {
  const ocid = `gallery.item.${index}`;

  return (
    <motion.article
      data-ocid={ocid}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Play ${video.title}`}
    >
      <div className="illuminated-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-parchment">
        {/* Thumbnail area */}
        <div className="relative bg-gradient-to-br from-amber-100 to-amber-200 aspect-video flex items-center justify-center overflow-hidden">
          {/* Decorative radial */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, oklch(38% 0.09 50) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-accent/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
          {/* Gold corner ornaments */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-accent/50" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-accent/50" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-accent/50" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-accent/50" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-base font-semibold text-foreground line-clamp-2 leading-snug mb-2">
            {video.title}
          </h3>

          {video.bibleReference && (
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-accent-foreground/70 flex-shrink-0" />
              <span className="text-xs font-serif italic text-muted-foreground">
                {video.bibleReference}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              {formatNanoDate(video.uploadDate)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
