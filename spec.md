# Bible Study Video Journal

## Current State
- "Scripture Journal" tab shows only videos uploaded by the admin/host (filtered by `getPublicFeedVideos` which checks `isAdmin(uploadedBy)`)
- "My Studies" tab shows only the signed-in user's own videos
- Upload is restricted to authenticated, non-guest users, but the upload button only appears on the "My Studies" tab
- Public cannot see community uploads

## Requested Changes (Diff)

### Add
- A community public feed that shows ALL uploaded videos from all users
- Uploader identity on each video card in the community feed
- Upload button accessible from the community/public feed tab

### Modify
- `getPublicFeedVideos()` backend method: return ALL videos, not just admin-uploaded ones
- Upload button visibility: show on the public feed tab when authenticated
- Video cards in community feed show uploader info (shortened principal or "You" for own videos)
- Hero text updated to reflect community sharing

### Remove
- Admin-only filter on the public feed

## Implementation Plan
1. Backend: update `getPublicFeedVideos()` to return all videos (remove admin filter)
2. Frontend: show upload button on the public/community tab, not just "My Studies"
3. Frontend: add uploader info on video cards
4. Frontend: update hero description text to reflect community-sharing nature
