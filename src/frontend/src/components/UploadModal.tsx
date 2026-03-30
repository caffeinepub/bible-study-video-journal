import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddVideoEntry } from "../hooks/useQueries";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export function UploadModal({ open, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [bibleReference, setBibleReference] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addEntry = useAddVideoEntry();

  const resetForm = useCallback(() => {
    setTitle("");
    setBibleReference("");
    setDescription("");
    setSelectedFile(null);
    setUploadProgress(0);
    setIsDragging(false);
  }, []);

  const handleClose = useCallback(() => {
    if (addEntry.isPending) return;
    resetForm();
    onClose();
  }, [addEntry.isPending, resetForm, onClose]);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title for your study.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a video file to upload.");
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
        (pct) => {
          setUploadProgress(pct);
        },
      );

      const id = crypto.randomUUID();
      await addEntry.mutateAsync({
        id,
        title: title.trim(),
        description: description.trim() || null,
        bibleReference: bibleReference.trim() || null,
        videoBlob: blob,
      });

      toast.success("Your Bible study has been shared with the community!");
      resetForm();
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      toast.error(msg);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            data-ocid="upload.dialog"
            className="relative z-10 w-full max-w-lg illuminated-card rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  Share a Study Session
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add your Bible reading or study video to the community
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                disabled={addEntry.isPending}
                className="rounded-full hover:bg-muted"
                aria-label="Close upload dialog"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form scrollable */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="upload-title" className="text-sm font-medium">
                    Study Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="upload.input"
                    id="upload-title"
                    placeholder="e.g. Morning devotion \u2014 Psalm 23"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={addEntry.isPending}
                    required
                    className="bg-background/60"
                  />
                </div>

                {/* Bible reference */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="upload-reference"
                    className="text-sm font-medium"
                  >
                    Bible Passage
                    <span className="text-muted-foreground font-normal ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    data-ocid="upload.search_input"
                    id="upload-reference"
                    placeholder="e.g. John 3:16, Romans 8:28-39"
                    value={bibleReference}
                    onChange={(e) => setBibleReference(e.target.value)}
                    disabled={addEntry.isPending}
                    className="bg-background/60"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="upload-description"
                    className="text-sm font-medium"
                  >
                    Notes
                    <span className="text-muted-foreground font-normal ml-1">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    data-ocid="upload.textarea"
                    id="upload-description"
                    placeholder="Share what you learned or felt during this session..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={addEntry.isPending}
                    rows={3}
                    className="bg-background/60 resize-none"
                  />
                </div>

                {/* File dropzone */}
                <div className="space-y-1.5">
                  <span className="text-sm font-medium">
                    Video File <span className="text-destructive">*</span>
                  </span>
                  <label
                    data-ocid="upload.dropzone"
                    htmlFor="video-file-input"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={[
                      "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 block",
                      isDragging
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/60 hover:bg-muted/40",
                      addEntry.isPending
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "",
                    ].join(" ")}
                  >
                    <input
                      ref={fileInputRef}
                      id="video-file-input"
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] ?? null)
                      }
                      disabled={addEntry.isPending}
                    />

                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <Video className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-xs">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Drop your video here
                          </p>
                          <p className="text-xs text-muted-foreground">
                            or click to browse &mdash; MP4, MOV, WebM, etc.
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Upload progress */}
                {addEntry.isPending && (
                  <div data-ocid="upload.loading_state" className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                      </span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 flex-shrink-0">
                <Button
                  data-ocid="upload.cancel_button"
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={addEntry.isPending}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="upload.submit_button"
                  type="submit"
                  disabled={
                    addEntry.isPending || !title.trim() || !selectedFile
                  }
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {addEntry.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {addEntry.isPending ? "Sharing..." : "Share with Community"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
