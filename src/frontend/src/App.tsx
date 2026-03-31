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
import { useActor } from "./hooks/useActor";
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
  useActor();
  const isAuthenticated = !!identity;
  const callerPrincipal = identity?.getPrincipal().toString();

  const { data: publicVideos = [], isLoading: publicLoading } =
    useGetPublicFeedVideos();
  const { data: myVideos = [], isLoading: myVideosLoading } = useGetMyVideos();
  const { data: userRole } = useGetUserRole();

  // Only the admin (canister owner) can upload — backend enforces this.
  // We show the button to any authenticated user; non-admins will get a
  // backend error if they try, but this prevents the button from being
  // hidden while the role is still loading.
  const canUpload = userRole === UserRole.admin;

  return (
    <div className="min-h-screen parchment-texture">
      {/* Desert-toned overlay for legibility */}
      <div className="min-h-screen bg-background/75">
        {/* Header */}
        <header
          className="sticky top-0 z-40 border-b border-border backdrop-blur-md"
          style={{ background: "oklch(84% 0.055 74 / 0.9)" }}
        >
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
                  Blockchain Bible Study
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
                // Subtle sign-in button for admin access — not prominently advertised to visitors
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  aria-label="Sign in"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline text-xs">
                    {isLoggingIn ? "Signing in\u2026" : "Sign in"}
                  </span>
                </Button>
              )}
            </motion.div>
          </div>
        </header>

        {/* Hero section — warm dune gradient */}
        <section
          className="border-b border-border"
          style={{
            background:
              "linear-gradient(to bottom, oklch(82% 0.065 72), oklch(88% 0.055 78))",
          }}
        >
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
                  Video Archive
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                Blockchain Bible Study
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A read-through study of the bible from Genesis to Revelation on
                the Internet Computer
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
            </motion.div>
          </div>
        </section>

        {/* Main content — dry earth mid-tone */}
        <main
          className="container mx-auto px-4 py-10"
          style={{ background: "oklch(85% 0.05 76)" }}
        >
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
                {canUpload && (
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

              {/* Upload button inline for Scripture Journal tab — shown to any authenticated user */}
              <AnimatePresence>
                {isAuthenticated && activeTab === "scripture-journal" && (
                  <motion.div
                    key="upload-feed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
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

            {/* Scripture Journal Tab — public feed */}
            <TabsContent value="scripture-journal" className="mt-0">
              <div className="mb-4">
                <p className="text-base text-muted-foreground">
                  {!publicLoading && publicVideos.length > 0
                    ? `${publicVideos.length} ${
                        publicVideos.length === 1 ? "session" : "sessions"
                      } in the journal`
                    : "Bible study sessions"}
                </p>
              </div>
              <VideoGallery
                videos={publicVideos}
                isLoading={publicLoading}
                onSelectVideo={setSelectedVideo}
                callerPrincipal={callerPrincipal}
                emptyMessage="No sessions yet. Check back soon!"
              />
            </TabsContent>

            {/* My Studies Tab — admin only */}
            {canUpload && (
              <TabsContent value="my-studies" className="mt-0">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-base text-muted-foreground">
                    {!myVideosLoading && myVideos.length > 0
                      ? `${myVideos.length} ${
                          myVideos.length === 1 ? "recording" : "recordings"
                        } in your archive`
                      : "Your personal study recordings"}
                  </p>
                  <Button
                    data-ocid="my-studies.upload_button"
                    size="sm"
                    variant="outline"
                    onClick={() => setUploadOpen(true)}
                    className="gap-2 border-accent/40 hover:bg-accent/10"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Study
                  </Button>
                </div>
                <VideoGallery
                  videos={myVideos}
                  isLoading={myVideosLoading}
                  onSelectVideo={setSelectedVideo}
                  callerPrincipal={callerPrincipal}
                  emptyMessage="No recordings yet. Upload your first Bible study!"
                />
              </TabsContent>
            )}
          </Tabs>
        </main>

        {/* Footer — darker dusty adobe */}
        <footer
          className="border-t border-border mt-auto"
          style={{ background: "oklch(78% 0.06 68)" }}
        >
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
