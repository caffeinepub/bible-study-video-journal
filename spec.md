# Bible Study Video Journal

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A video upload page where the user can upload videos of their Bible study/reading sessions
- Video listing/gallery page to view all uploaded videos
- Video player to watch uploaded videos
- Metadata per video: title, description, date uploaded, optional Bible passage/reference
- Authorization so only the owner can upload/manage videos
- Blob storage for video files

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select `blob-storage` and `authorization` Caffeine components
2. Generate Motoko backend with:
   - Video metadata store (title, description, Bible reference, blob ID, upload date)
   - CRUD operations: upload video metadata, list videos, delete video
   - Authorization-gated mutations
3. Frontend:
   - Home/gallery page: grid of uploaded videos with title, Bible reference, date
   - Upload form: title, optional Bible passage reference, optional description, video file picker
   - Video player modal/page to watch a selected video
   - Empty state when no videos exist
   - Delete button per video (owner only)
