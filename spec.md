# Bible Study Video Journal

## Current State
Single shared video store. Any authenticated (non-guest) user can upload videos. `getAllVideos()` returns all videos from all users in one pool. Admin and users share the same gallery view.

## Requested Changes (Diff)

### Add
- `getMyVideos()` backend method: returns only videos uploaded by the calling principal
- `getPublicFeedVideos()` backend method: returns only videos uploaded by admin users (the host's study chain)
- Two-tab UI on the home page:
  - "Scripture Journal" tab (public, visible to all): shows only the host/admin's videos via `getPublicFeedVideos()`
  - "My Studies" tab (visible only when authenticated): shows the caller's own videos via `getMyVideos()`
- Upload button context: when on "My Studies" tab, uploads go to the user's own chain
- Each user's uploads stay isolated from the host's public feed

### Modify
- `getAllVideos()` remains for admin use; public feed switches to `getPublicFeedVideos()`
- Nav header subtitle updated to reflect the community-oriented purpose
- Hero section text updated to reflect that visitors can browse the host's studies or start their own
- Empty states customized per tab

### Remove
- Nothing removed

## Implementation Plan
1. Add `getMyVideos()` to main.mo (filter videoEntries by caller principal)
2. Add `getPublicFeedVideos()` to main.mo (filter by admin principal)
3. Update backend.d.ts to include both new methods
4. Add tab navigation to App.tsx: "Scripture Journal" and "My Studies"
5. Wire "Scripture Journal" tab to `getPublicFeedVideos()` hook
6. Wire "My Studies" tab to `getMyVideos()` hook (only shown when authenticated)
7. Customize empty states per tab
8. Ensure upload always adds to the caller's own collection (existing `addVideoEntry` already ties to `uploadedBy = caller`)
