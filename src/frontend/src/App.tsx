import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookMarked,
  BookOpen,
  Loader2,
  LogIn,
  LogOut,
  Upload,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { VideoEntry } from "./backend";
import { UserRole } from "./backend";
import { UploadModal } from "./components/UploadModal";
import { VideoGallery } from "./components/VideoGallery";
import { VideoPlayerModal } from "./components/VideoPlayerModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetMyVideos,
  useGetPublicFeedVideos,
  useGetUserRole,
} from "./hooks/useQueries";

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);
  const [activeTab, setActiveTab] = useState("scripture-journal");
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const callerPrincipal = identity?.getPrincipal().toString();

  const { data: publicVideos = [], isLoading: publicLoading } =
    useGetPublicFeedVideos();
  const { data: myVideos = [], isLoading: myVideosLoading } = useGetMyVideos();
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
                  Community Bible Study Platform
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
                  <AnimatePresence>
                    {canUpload && (
                      <motion.div
                        key="upload-btn"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          data-ocid="nav.upload_button"
                          onClick={() => setUploadOpen(true)}
                          size="sm"
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        >
                          <Upload className="w-4 h-4" />
                          <span className="hidden sm:inline">Share Study</span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-accent-foreground/60" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Community Archive
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                Bible Study
                <br />
                <span className="font-serif italic font-normal text-muted-foreground">
                  Video Journal
                </span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse Bible study sessions shared by the community below, or
                sign in to share your own.
              </p>

              {/* Decorative verse */}
              <div className="mt-6">
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
                  className="mt-6 flex justify-center"
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
                    Sign in to Share Your Study
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <main className="container mx-auto px-4 py-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <TabsList className="bg-muted/60 border border-border">
                <TabsTrigger
                  data-ocid="tabs.scripture-journal.tab"
                  value="scripture-journal"
                  className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Scripture Journal</span>
                </TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger
                    data-ocid="tabs.my-studies.tab"
                    value="my-studies"
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>My Studies</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Upload button inline for Scripture Journal tab on authenticated users */}
              <AnimatePresence>
                {canUpload && activeTab === "scripture-journal" && (
                  <motion.div
                    key="upload-feed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="sm:hidden"
                  >
                    <Button
                      data-ocid="gallery.upload_button"
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadOpen(true)}
                      className="gap-2 border-accent/40 hover:bg-accent/10"
                    >
                      <Upload className="w-4 h-4" />
                      Share
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scripture Journal Tab — community public feed */}
            <TabsContent value="scripture-journal" className="mt-0">
              <div className="mb-4">
                <p className="text-base text-muted-foreground">
                  {!publicLoading && publicVideos.length > 0
                    ? `${publicVideos.length} ${
                        publicVideos.length === 1 ? "session" : "sessions"
                      } shared by the community`
                    : "Community Bible study sessions"}
                </p>
              </div>
              <VideoGallery
                videos={publicVideos}
                isLoading={publicLoading}
                onSelectVideo={setSelectedVideo}
                callerPrincipal={callerPrincipal}
                emptyMessage="No sessions shared yet. Sign in and be the first to share your Bible study!"
              />
            </TabsContent>

            {/* My Studies Tab — personal archive */}
            {isAuthenticated && (
              <TabsContent value="my-studies" className="mt-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-base text-muted-foreground">
                    {!myVideosLoading && myVideos.length > 0
                      ? `${myVideos.length} ${
                          myVideos.length === 1 ? "recording" : "recordings"
                        } in your archive`
                      : "Your personal study recordings"}
                  </p>
                  {canUpload && (
                    <Button
                      data-ocid="my-studies.upload_button"
                      size="sm"
                      variant="outline"
                      onClick={() => setUploadOpen(true)}
                      className="gap-2 border-accent/40 hover:bg-accent/10"
                    >
                      <Upload className="w-4 h-4" />
                      Share New Study
                    </Button>
                  )}
                </div>
                <VideoGallery
                  videos={myVideos}
                  isLoading={myVideosLoading}
                  onSelectVideo={setSelectedVideo}
                  callerPrincipal={callerPrincipal}
                  emptyMessage="You haven't shared any studies yet. Hit 'Share New Study' to contribute to the community."
                />
              </TabsContent>
            )}
          </Tabs>
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
