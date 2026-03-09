import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  BookMarked,
  BookOpen,
  Loader2,
  LogIn,
  LogOut,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { VideoEntry } from "./backend";
import { UserRole } from "./backend";
import { UploadModal } from "./components/UploadModal";
import { VideoGallery } from "./components/VideoGallery";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetAllVideos, useGetUserRole } from "./hooks/useQueries";

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: videos = [], isLoading: videosLoading } = useGetAllVideos();
  const { data: userRole } = useGetUserRole();

  const canUpload = isAuthenticated && userRole !== UserRole.guest;

  return (
    <div className="min-h-screen parchment-texture">
      {/* Parchment overlay for legibility */}
      <div className="min-h-screen bg-background/70">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            {/* Logo + title */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-accent/40 flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground leading-none">
                  Scripture Journal
                </h1>
                <p className="text-xs text-muted-foreground">
                  Your Bible study video archive
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {isInitializing ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : isAuthenticated ? (
                <>
                  {canUpload && (
                    <Button
                      data-ocid="nav.upload_button"
                      onClick={() => setUploadOpen(true)}
                      size="sm"
                      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Upload Video</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-2 border-border hover:border-primary/40"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {isLoggingIn ? "Signing in\u2026" : "Sign in"}
                </Button>
              )}
            </motion.div>
          </div>
        </header>

        {/* Hero section */}
        <section className="border-b border-border bg-gradient-to-b from-background/60 to-transparent">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Personal Archive
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                Your Bible Study
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  Video Journal
                </span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Capture and revisit your moments of study, reflection, and
                discovery in God&#39;s word. Every session recorded is a step in
                your spiritual journey.
              </p>

              {/* Decorative verse */}
              <div className="mt-6 pl-4 border-l-2 border-accent/50">
                <p className="font-serif italic text-sm text-muted-foreground">
                  &#8220;Thy word is a lamp unto my feet, and a light unto my
                  path.&#8221;
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  &#8212; Psalm 119:105
                </p>
              </div>

              {!isAuthenticated && !isInitializing && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={login}
                    disabled={isLoggingIn}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    Sign in to Upload Videos
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <main className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Study Sessions
              </h2>
              {!videosLoading && videos.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {videos.length}{" "}
                  {videos.length === 1 ? "recording" : "recordings"} in your
                  journal
                </p>
              )}
            </div>
            {isAuthenticated && canUpload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadOpen(true)}
                className="gap-2 border-accent/40 hover:bg-accent/10 sm:hidden"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            )}
          </div>

          <VideoGallery
            videos={videos}
            isLoading={videosLoading}
            onSelectVideo={setSelectedVideo}
          />
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background/60 mt-auto">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" />
              <span className="font-serif italic">Scripture Journal</span>
            </div>
            <p>
              &copy; {new Date().getFullYear()}. Built with{" "}
              <span aria-label="love">&#9829;</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <VideoPlayerModal
        video={selectedVideo}
        userRole={userRole}
        onClose={() => setSelectedVideo(null)}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
