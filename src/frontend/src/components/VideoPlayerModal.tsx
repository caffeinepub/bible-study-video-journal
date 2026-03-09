import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Loader2, Trash2, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { VideoEntry } from "../backend";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDeleteVideoEntry } from "../hooks/useQueries";
import { formatNanoDateTime } from "../utils/formatDate";

interface VideoPlayerModalProps {
  video: VideoEntry | null;
  userRole: UserRole | undefined;
  onClose: () => void;
}

export function VideoPlayerModal({
  video,
  userRole,
  onClose,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { identity } = useInternetIdentity();
  const deleteEntry = useDeleteVideoEntry();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;
  const callerPrincipal = identity?.getPrincipal().toString();
  const isOwner = video
    ? callerPrincipal === video.uploadedBy.toString()
    : false;
  const canDelete = isAdmin || isOwner;

  useEffect(() => {
    if (!video) {
      setVideoUrl(null);
      setShowDeleteConfirm(false);
      return;
    }
    const url = video.videoBlob.getDirectURL();
    setVideoUrl(url);
  }, [video]);

  const handleDelete = async () => {
    if (!video) return;
    try {
      await deleteEntry.mutateAsync(video.id);
      toast.success("Video removed from your journal");
      onClose();
    } catch {
      toast.error("Failed to delete video. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            data-ocid="player.dialog"
            className="relative z-10 w-full max-w-3xl illuminated-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div className="flex-1 pr-4">
                <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                  {video.title}
                </h2>
                {video.bibleReference && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <BookOpen className="w-4 h-4 text-accent-foreground/70" />
                    <span className="font-serif italic text-sm text-muted-foreground">
                      {video.bibleReference}
                    </span>
                  </div>
                )}
              </div>
              <Button
                data-ocid="player.close_button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted flex-shrink-0"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Video player */}
            <div className="bg-foreground/5 aspect-video">
              {videoUrl ? (
                // biome-ignore lint/a11y/useMediaCaption: user-uploaded personal video
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  autoPlay={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
              )}
            </div>

            {/* Details & actions */}
            <div className="p-5">
              {video.description && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {video.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="gap-1.5 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatNanoDateTime(video.uploadDate)}
                  </Badge>
                  <Badge variant="outline" className="gap-1.5 text-xs">
                    <User className="w-3 h-3" />
                    {video.uploadedBy.toString().slice(0, 8)}&hellip;
                  </Badge>
                </div>

                {isAuthenticated && canDelete && (
                  <div className="flex items-center gap-2">
                    {showDeleteConfirm ? (
                      <>
                        <span className="text-xs text-muted-foreground">
                          Remove this video?
                        </span>
                        <Button
                          data-ocid="player.confirm_button"
                          variant="destructive"
                          size="sm"
                          onClick={handleDelete}
                          disabled={deleteEntry.isPending}
                          className="gap-1.5"
                        >
                          {deleteEntry.isPending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : null}
                          Confirm
                        </Button>
                        <Button
                          data-ocid="player.cancel_button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={deleteEntry.isPending}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        data-ocid="player.delete_button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
