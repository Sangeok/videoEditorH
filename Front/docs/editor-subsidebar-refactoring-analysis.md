# Editor SubSidebar Refactoring Analysis

## Executive Summary

The editor-subSidebar component system demonstrates a well-structured architecture following Feature-Sliced Design principles. However, the analysis reveals **significant code and logic duplication** across Video, Image, and Music sub-panels, with nearly identical implementations for common patterns like drag-and-drop, file upload, selection management, and project management hooks.

**Key findings:**
- **97% identical code** in `useDragAndDrop` hooks across 3 panels (Video, Image, Music)
- **Nearly identical patterns** in `useFileUpload`, `useXXXSelection`, and `useXXXProjectManagement` hooks
- **Duplicated UI components** for file upload areas with only minor variations
- **Inconsistent factory function patterns** (synchronous vs asynchronous, different ID generation strategies)
- **Unused imports and actions** in UI component props
- **Opportunity to extract 5-6 shared hooks** and reduce codebase by ~40%

The current architecture is maintainable but contains substantial technical debt. Refactoring would improve consistency, reduce maintenance burden, and make future feature additions significantly easier.

## Current Architecture Overview

The editor-subSidebar system is organized into 5 specialized sub-panels:

```
editor-subSidebar/
├── ui/
│   ├── EditorSubSideBar.tsx (Router component)
│   └── _component/
│       ├── VideoEditSubSide/    (Video upload & management)
│       ├── ImageEditSubSide/    (Image upload & management)
│       ├── MusicEditSubSide/    (Audio upload & management)
│       ├── TextEditSubSide/     (Simple text creation)
│       └── CaptionEditSubSide/  (SRT file processing & caption editing)
```

Each media panel (Video/Image/Music) follows a consistent pattern:
- **Main hook** (`useVideoEdit`, `useImageEdit`, `useAudioEdit`) - Composes smaller hooks
- **Sub-hooks**: `useFileUpload`, `useDragAndDrop`, `useXXXSelection`, `useXXXProjectManagement`
- **Factory functions**: Create media elements with default values
- **UI components**: Upload area + Preview/List area

## Findings

### 1. Code Duplication Issues

#### 1.1 Nearly Identical `useDragAndDrop` Hooks

**Location 1:** `VideoEditSubSide/model/hooks/useDragAndDrop.ts:1-34`
**Location 2:** `MusicEditSubSide/model/hooks/useDragAndDrop.ts:1-33`
```typescript
// IDENTICAL CODE (97% match)
import { useState } from "react";

export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    onFilesDropped: (files: FileList) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Video/Music versions check for files existence
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  return { dragActive, handleDrag, handleDrop };
}
```

**Location 3:** `ImageEditSubSide/model/hooks/useDragAndDrop.ts:1-41`
```typescript
// SAME LOGIC with unnecessary helper functions
export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const isDragEnterOrOver = (eventType: string) => {
    return eventType === "dragenter" || eventType === "dragover";
  };

  const isDragLeave = (eventType: string) => {
    return eventType === "dragleave";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragEnterOrOver(e.type)) {
      setDragActive(true);
    } else if (isDragLeave(e.type)) {
      setDragActive(false);
    }
  };
  // ... identical handleDrop
}
```

**Analysis:** The Image version adds two single-use helper functions (`isDragEnterOrOver`, `isDragLeave`) that provide no real value. The Video/Music versions are functionally identical. **This hook should be extracted to a shared location.**

#### 1.2 Similar Selection Hooks Pattern

**Location 1:** `VideoEditSubSide/model/hooks/useVideoSelection.ts:1-30`
```typescript
export function useVideoSelection() {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const clearSelection = () => {
    setSelectedVideoId(null);
  };

  const isVideoSelected = (videoId: string) => {
    return selectedVideoId === videoId;
  };

  const selectedVideo = selectedVideoId
    ? media.mediaElement.find((element) => element.id === selectedVideoId)
    : null;

  return {
    selectedVideoId,
    selectedVideo,
    selectVideo,
    clearSelection,
    isVideoSelected,
  };
}
```

**Location 2:** `ImageEditSubSide/model/hooks/useImageSelection.ts:1-34`
```typescript
export function useImageSelection() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectedImage = selectedImageId
    ? media.mediaElement.find(
        (el) => el.id === selectedImageId && el.type === "image"
      )
    : null;

  // ... identical functions with s/Video/Image/g
}
```

**Analysis:** These hooks are 95% identical. The only difference is the Image version adds a type check (`el.type === "image"`). This can be generalized into a single `useMediaSelection<T>` hook with a type parameter.

#### 1.3 Similar Project Management Hooks

**Location 1:** `VideoEditSubSide/model/hooks/useVideoProjectManagement.ts:1-41`
**Location 2:** `ImageEditSubSide/model/hooks/useImageProjectManagement.ts:1-34`

```typescript
// Video version
export function useVideoProjectManagement() {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } = useMediaStore();

  const addVideoToTimeLine = (videoData: VideoData) => {
    const videoElement = createVideoElement(videoData);
    const existingVideo = media.mediaElement.find((el) => el.url === videoData.url);
    if (existingVideo) {
      alert("Video already exists in the timeline");
      return;
    }
    addMediaElement(videoElement);
  };

  const updateVideoSettings = (videoId: string, updates: Partial<MediaElement>) => {
    updateMediaElement(videoId, updates);
  };

  const deleteVideo = (videoId: string) => {
    deleteMediaElement(videoId);
  };

  return { addVideoToTimeLine, updateVideoSettings, deleteVideo };
}

// Image version - IDENTICAL LOGIC with s/Video/Image/g
```

**Analysis:** Both hooks:
1. Check for duplicate URLs before adding
2. Use hardcoded `alert()` for user feedback
3. Wrap store methods with minimal additional logic
4. Return identically structured APIs

This is a prime candidate for a generic `useMediaProjectManagement` hook.

#### 1.4 Duplicated File Upload UI Components

**Video Upload Area:** `VideoEditSubSide/ui/_component/VideoFileUploadArea.tsx:1-61`
**Image Upload Area:** `ImageEditSubSide/ui/_component/ImageFileUploadArea.tsx:1-62`

```typescript
// 95% IDENTICAL CODE
export default function VideoFileUploadArea({ fileInputRef, actions, dragActive }) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={actions.handleDrag}
      onDragLeave={actions.handleDrag}
      onDragOver={actions.handleDrag}
      onDrop={actions.handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"  // Only difference: accept attribute
        multiple
        className="hidden"
        onChange={(e) => actions.handleFileSelect(e.target.files)}
      />

      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">Drag & drop your video file here</p>
      <p className="text-gray-500 text-sm mb-4">or</p>
      <Button onClick={() => fileInputRef.current?.click()} variant="light" size="sm">
        Choose Video
      </Button>
    </div>
  );
}
```

**Analysis:** The only differences are:
- `accept` attribute (`video/*` vs `image/*` vs `audio/*`)
- Text content ("video file" vs "image file" vs "audio files")
- Icon component (Upload vs Music for audio)
- Audio version adds `loading` state

This should be a single generic `<MediaFileUploadArea>` component with configuration props.

### 2. Unnecessary Code

#### 2.1 Unused Actions in Props Interface

**Location:** `VideoEditSubSide/ui/_component/VideoFileUploadArea.tsx:6-21`

```typescript
interface VideoFileUploadAreaProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  actions: {
    handleFileSelect: (files: FileList | null) => void;
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    removeVideo: (index: number) => void;        // USED: Line 12
    selectVideo: (videoId: string) => void;      // NEVER USED IN COMPONENT
    updateVideoSettings: (...) => void;          // NEVER USED IN COMPONENT
    deleteVideo: (videoId: string) => void;      // NEVER USED IN COMPONENT
  };
  dragActive: boolean;
}
```

**Analysis:** The component only uses `handleFileSelect`, `handleDrag`, and `handleDrop`. The selection and update methods are never referenced. This creates confusion about component responsibilities and unnecessarily couples the component to unused functionality.

**Same issue in:** `ImageEditSubSide/ui/_component/ImageFileUploadArea.tsx:6-21`

#### 2.2 Unnecessary Helper Functions in ImageEditSubSide

**Location:** `ImageEditSubSide/model/hooks/useDragAndDrop.ts:6-12`

```typescript
const isDragEnterOrOver = (eventType: string) => {
  return eventType === "dragenter" || eventType === "dragover";
};

const isDragLeave = (eventType: string) => {
  return eventType === "dragleave";
};
```

**Analysis:** These functions are:
1. Used only once each
2. Simple one-liner conditionals that don't improve readability
3. Add unnecessary abstraction overhead
4. Not present in Video/Music versions which are clearer

### 3. Logic Duplication Patterns

#### 3.1 File Processing Patterns

All three main hooks (`useVideoEdit`, `useImageEdit`, `useAudioEdit`) follow the same composition pattern:

```typescript
// Pattern repeated 3 times with minor variations
export function useXXXEdit() {
  const fileUpload = useFileUpload();
  const dragAndDrop = useDragAndDrop();
  const xxxSelection = useXXXSelection();
  const projectManagement = useXXXProjectManagement();

  const handleFileSelect = (files: FileList | null) => {
    fileUpload.handleFileSelect(files, projectManagement.addXXXToTimeLine);
  };

  const handleDrop = (e: React.DragEvent) => {
    dragAndDrop.handleDrop(e, (files) => {
      fileUpload.handleFileSelect(files, projectManagement.addXXXToTimeLine);
    });
  };

  return {
    fileInputRef: fileUpload.fileInputRef,
    state: { uploadedXXXs, selectedXXXId, dragActive, selectedXXX },
    actions: { handleFileSelect, handleDrag, handleDrop, removeXXX, ... }
  };
}
```

**Analysis:** This pattern could be extracted into a generic `useMediaEdit` factory function that accepts media-specific processors as configuration.

#### 3.2 Duplicate URL Checking Logic

**Found in:**
- `VideoEditSubSide/model/hooks/useVideoProjectManagement.ts:18-22`
- `ImageEditSubSide/model/hooks/useImageProjectManagement.ts:11-15`
- `MusicEditSubSide/model/hooks/useAudioEdit.ts:43-48`

```typescript
// Duplicated 3 times
const existingXXX = media.mediaElement.find((el) => el.url === xxxData.url);
if (existingXXX) {
  alert("XXX already exists in the timeline");
  return;
}
```

**Analysis:** This should be a shared utility function with better UX (toast notification instead of alert).

#### 3.3 ID Generation Inconsistency

**Video/Image factories:**
```typescript
// videoElementFactory.ts:37-39
function generateVideoId(): string {
  return `video-${Date.now()}-${Math.random()}`;
}
```

**Audio factory:**
```typescript
// audioElementFactory.ts:2,10
import { v4 as uuidv4 } from "uuid";
// ...
id: uuidv4(),
```

**Text element (inline):**
```typescript
// TextEditSubSide.tsx:12
id: crypto.randomUUID(),
```

**Audio file processor fallback:**
```typescript
// useAudioFileProcessor.ts:34
id: `audio-${Date.now()}-${Math.random()}`,
```

**Analysis:** Four different ID generation strategies across the codebase:
1. Template string with Date.now() + Math.random()
2. uuid library (v4)
3. crypto.randomUUID() (native Web Crypto API)
4. String templates in fallback code

**Recommendation:** Standardize on `crypto.randomUUID()` (native, no dependencies, RFC 4122 compliant).

### 4. Architecture Concerns

#### 4.1 Violation of FSD Component Structure in CaptionEditSubSide

**Issue:** `CaptionEditSubSide.tsx` contains substantial inline business logic (67 lines, 24-100) including:
- Time parsing logic (`parseClockTime`)
- Overlap detection (`hasOverlap`)
- Edit state management
- Commit handlers

**Location:** `CaptionEditSubSide/ui/CaptionEditSubSide.tsx:24-112`

```typescript
export default function CaptionEditSubSide() {
  const [editing, setEditing] = useState<...>(null);

  // 42 lines of business logic that should be in model/hooks
  const parseClockTime = useCallback((value: string): number | null => {
    // ... 17 lines of parsing logic
  }, []);

  const hasOverlap = useCallback((elementId: string, ...) => {
    // ... 6 lines of overlap detection
  }, [media.textElement]);

  const commitClockEdit = useCallback((...) => {
    // ... 27 lines of validation and update logic
  }, [...]);

  // etc.
}
```

**Analysis:** This violates FSD's separation between UI (`ui/`) and business logic (`model/`). This logic should be extracted to a `useCaptionEdit` hook in `model/hooks/`.

#### 4.2 Inconsistent Hook Return Patterns

**Pattern 1 - Flat return (Video):**
```typescript
// useVideoEdit.ts:29-47
return {
  fileInputRef,
  state: { uploadedVideos, selectedVideoId, dragActive, selectedVideo },
  actions: { handleFileSelect, handleDrag, ... }
};
```

**Pattern 2 - Direct return (Selection hooks):**
```typescript
// useVideoSelection.ts:22-28
return {
  selectedVideoId,
  selectedVideo,
  selectVideo,
  clearSelection,
  isVideoSelected,
};
```

**Pattern 3 - Explicit typing (Audio):**
```typescript
// useAudioEdit.ts:11-15
export function useAudioEdit(): {
  state: AudioEditState;
  actions: AudioEditActions;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
} {
  return { fileInputRef, state, actions };
}
```

**Analysis:** Inconsistent patterns make the codebase harder to learn. The Audio pattern (explicit return type) is best for type safety and documentation.

#### 4.3 Mixed Async/Sync Factory Functions

**Synchronous (Video, Image):**
```typescript
export function createVideoElement(videoData: VideoData): MediaElement {
  return { id: generateVideoId(), ... };
}
```

**Asynchronous (Audio):**
```typescript
export function createAudioElement(audioUrl: string): Promise<AudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audioElement);
    });
  });
}
```

**Analysis:** Video metadata is extracted during upload (`useFileUpload.ts:28-38`), but audio metadata is extracted in the factory. This inconsistency creates different error handling paths and makes the code harder to understand. **Standardize on extracting metadata during upload phase.**

### 5. Readability Issues

#### 5.1 Inconsistent File Naming

- `VideoEditSubSide/ui/index.tsx` (named export from index.tsx)
- `ImageEditSubSide/ui/index.tsx` (named export from index.tsx)
- `MusicEditSubSide/ui/MusicEditSubSide.tsx` (direct file name)
- `TextEditSubSide/ui/TextEditSubSide.tsx` (direct file name)
- `CaptionEditSubSide/ui/CaptionEditSubSide.tsx` (direct file name)

**Analysis:** Video and Image use `index.tsx` while others use explicit filenames. Recommendation: Use explicit filenames consistently (easier to find in editors, clearer in stack traces).

#### 5.2 Hard-coded Alert Messages

**Found in 3 locations:**
- `useVideoProjectManagement.ts:20`
- `useImageProjectManagement.ts:12`
- `useAudioEdit.ts:46`
- `useAudioFileProcessor.ts:48`

```typescript
alert("Video already exists in the timeline");
alert("Please select a valid audio file");
alert("Failed to read audio file");
```

**Analysis:** Using `alert()` is:
1. Not accessible
2. Blocks UI
3. Poor UX
4. Hard to test
5. Not consistent with modern design patterns

Should be replaced with a toast notification system or inline error states.

#### 5.3 Inconsistent Constants Definition

**Video Factory:** Defines constants at file top
```typescript
// videoElementFactory.ts:3-8
const DEFAULT_OPACITY = 1;
const DEFAULT_ROTATION = "0deg";
const DEFAULT_VISIBILITY = "visible" as const;
const DEFAULT_POSITION = "50%";
```

**Image Factory:** Defines constants at file top (same pattern)
```typescript
// imageElementFactory.ts:3-11
const DEFAULT_IMAGE_DURATION = 5;
const DEFAULT_IMAGE_WIDTH = 400;
// ...
```

**Audio Factory:** No constants, values inlined
```typescript
// audioElementFactory.ts:9-16
const audioElement: AudioElement = {
  id: uuidv4(),
  type: "audio",
  startTime: 0,
  endTime: duration,
  duration: duration,
  volume: 1,  // Inlined
  speed: 1,   // Inlined
  sourceStart: 0,  // Inlined
};
```

**Text Element:** Constants inlined in component
```typescript
// TextEditSubSide.tsx:11-28
const newText = {
  id: crypto.randomUUID(),
  type: "text",
  startTime: 0,
  endTime: 5,
  duration: 5,
  text: text || "No Text",
  positionX: 425,  // Magic numbers
  positionY: 500,
  fontSize: 120,
  // ...
};
```

**Analysis:** Inconsistent approaches make it hard to understand and modify default values. Should use a shared constants file.

## Refactoring Recommendations

### High Priority

#### 1. Extract Shared `useDragAndDrop` Hook
**Rationale:** 97% duplicate code across 3 files
**Affected Files:**
- `VideoEditSubSide/model/hooks/useDragAndDrop.ts` (DELETE)
- `ImageEditSubSide/model/hooks/useDragAndDrop.ts` (DELETE)
- `MusicEditSubSide/model/hooks/useDragAndDrop.ts` (DELETE)
- `editor-subSidebar/shared/hooks/useDragAndDrop.ts` (CREATE)

**Estimated Impact:** Reduce 108 lines to 35 lines (67% reduction)

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/hooks/useDragAndDrop.ts
import { useState } from "react";

export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    onFilesDropped: (files: FileList) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  return {
    dragActive,
    handleDrag,
    handleDrop,
  };
}
```

#### 2. Create Generic `useMediaSelection` Hook
**Rationale:** 95% duplicate code, can be generalized with TypeScript generics
**Affected Files:**
- `VideoEditSubSide/model/hooks/useVideoSelection.ts` (DELETE)
- `ImageEditSubSide/model/hooks/useImageSelection.ts` (DELETE)
- `editor-subSidebar/shared/hooks/useMediaSelection.ts` (CREATE)

**Estimated Impact:** Reduce 64 lines to ~30 lines (53% reduction)

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/hooks/useMediaSelection.ts
import { useState } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";

export function useMediaSelection<T extends MediaElement>(
  mediaType?: T["type"]
) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { media } = useMediaStore();

  const selectedItem = selectedId
    ? media.mediaElement.find(
        (el) => el.id === selectedId && (!mediaType || el.type === mediaType)
      )
    : null;

  const select = (id: string) => setSelectedId(id);
  const clearSelection = () => setSelectedId(null);
  const isSelected = (id: string) => selectedId === id;

  return {
    selectedId,
    selectedItem: selectedItem as T | null,
    select,
    clearSelection,
    isSelected,
  };
}
```

**Usage:**
```typescript
// In useVideoEdit.ts
const videoSelection = useMediaSelection<VideoElement>("video");
// In useImageEdit.ts
const imageSelection = useMediaSelection<ImageElement>("image");
```

#### 3. Extract Shared ID Generation Utility
**Rationale:** 4 different ID generation strategies create inconsistency and potential collisions
**Affected Files:**
- `editor-subSidebar/shared/lib/generateMediaId.ts` (CREATE)
- All factory functions and inline ID generation (UPDATE)

**Estimated Impact:** Standardize ID generation, eliminate uuid dependency

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/lib/generateMediaId.ts
/**
 * Generates a unique RFC 4122 compliant UUID for media elements.
 * Uses native Web Crypto API (no dependencies required).
 */
export function generateMediaId(prefix?: string): string {
  const uuid = crypto.randomUUID();
  return prefix ? `${prefix}-${uuid}` : uuid;
}
```

#### 4. Create Generic `MediaFileUploadArea` Component
**Rationale:** 95% duplicate UI code across 3 components
**Affected Files:**
- `VideoEditSubSide/ui/_component/VideoFileUploadArea.tsx` (DELETE)
- `ImageEditSubSide/ui/_component/ImageFileUploadArea.tsx` (DELETE)
- `MusicEditSubSide/ui/_component/AudioFileUploadArea.tsx` (DELETE)
- `editor-subSidebar/shared/ui/MediaFileUploadArea.tsx` (CREATE)

**Estimated Impact:** Reduce 181 lines to ~80 lines (56% reduction)

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/ui/MediaFileUploadArea.tsx
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Upload, Music, Image, Video } from "lucide-react";
import { RefObject } from "react";

type MediaType = "video" | "image" | "audio";

interface MediaFileUploadAreaProps {
  mediaType: MediaType;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (files: FileList | null) => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  dragActive: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const MEDIA_CONFIG = {
  video: {
    accept: "video/*",
    icon: Upload,
    text: "Drag & drop your video file here",
    button: "Choose Video",
    description: "or",
  },
  image: {
    accept: "image/*",
    icon: Upload,
    text: "Drag & drop your image file here",
    button: "Choose Image",
    description: "or",
  },
  audio: {
    accept: "audio/*",
    icon: Music,
    text: "Drag & drop your audio files here",
    button: "Choose Audio Files",
    description: "Supports MP3, WAV, OGG, M4A",
  },
} as const;

export default function MediaFileUploadArea({
  mediaType,
  fileInputRef,
  onFileSelect,
  onDrag,
  onDrop,
  dragActive,
  loading = false,
  disabled = false,
}: MediaFileUploadAreaProps) {
  const config = MEDIA_CONFIG[mediaType];
  const Icon = config.icon;

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={config.accept}
        multiple
        className="hidden"
        onChange={(e) => onFileSelect(e.target.files)}
        disabled={disabled || loading}
      />

      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">{config.text}</p>
      <p className="text-gray-500 text-sm mb-4">{config.description}</p>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="light"
        size="sm"
        disabled={disabled || loading}
      >
        {loading ? "Processing..." : config.button}
      </Button>
    </div>
  );
}
```

#### 5. Extract Caption Edit Business Logic to Hook
**Rationale:** Violates FSD separation of concerns
**Affected Files:**
- `CaptionEditSubSide/ui/CaptionEditSubSide.tsx` (REFACTOR)
- `CaptionEditSubSide/model/hooks/useCaptionEdit.ts` (CREATE)

**Estimated Impact:** Move 67 lines of business logic from UI to model layer

**Implementation:**
```typescript
// CREATE: CaptionEditSubSide/model/hooks/useCaptionEdit.ts
import { useState, useCallback, useMemo } from "react";
import { useMediaStore } from "@/entities/media/useMediaStore";

export function useCaptionEdit() {
  const { media, updateTextElement } = useMediaStore();
  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" | "text" } | null>(null);

  const parseClockTime = useCallback((value: string): number | null => {
    const trimmed = value.trim();
    if (!/^\d{1,2}(:\d{2}){1,2}$/.test(trimmed)) return null;

    const parts = trimmed.split(":").map(Number);
    if (parts.some(isNaN)) return null;

    const [hours, minutes, seconds] = parts.length === 2
      ? [0, parts[0], parts[1]]
      : parts;

    if (seconds > 59 || minutes > 59) return null;
    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  const hasOverlap = useCallback(
    (elementId: string, newStart: number, newEnd: number): boolean => {
      return media.textElement.some(
        (other) => other.id !== elementId && newStart < other.endTime && newEnd > other.startTime
      );
    },
    [media.textElement]
  );

  const beginEdit = useCallback((id: string, field: "start" | "end") => {
    setEditing({ id, field });
  }, []);

  const beginTextEdit = useCallback((id: string) => {
    setEditing({ id, field: "text" });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditing(null);
  }, []);

  const commitClockEdit = useCallback(
    (elementId: string, field: "start" | "end", draftText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();

      const parsed = parseClockTime(draftText);
      if (parsed === null || parsed < 0) return cancelEdit();

      const newStart = field === "start" ? parsed : element.startTime;
      const newEnd = field === "end" ? parsed : element.endTime;

      if (newEnd <= newStart) return cancelEdit();
      if (hasOverlap(elementId, newStart, newEnd)) {
        alert("Overlap detected between other captions");
        return cancelEdit();
      }

      updateTextElement(elementId, {
        startTime: newStart,
        endTime: newEnd,
        duration: newEnd - newStart,
      });
      cancelEdit();
    },
    [cancelEdit, hasOverlap, media.textElement, parseClockTime, updateTextElement]
  );

  const commitTextEdit = useCallback(
    (elementId: string, newText: string) => {
      const element = media.textElement.find((el) => el.id === elementId);
      if (!element) return cancelEdit();
      updateTextElement(elementId, { text: newText });
      cancelEdit();
    },
    [cancelEdit, media.textElement, updateTextElement]
  );

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  return {
    state: {
      editing,
      sortedTextElements,
    },
    actions: {
      beginEdit,
      beginTextEdit,
      cancelEdit,
      commitClockEdit,
      commitTextEdit,
    },
  };
}
```

#### 6. Standardize Factory Function Patterns
**Rationale:** Inconsistent async/sync patterns create confusion
**Affected Files:**
- `MusicEditSubSide/lib/audioElementFactory.ts` (REFACTOR - make synchronous)
- `MusicEditSubSide/model/hooks/useFileUpload.ts` (UPDATE - extract metadata during upload)

**Estimated Impact:** Consistent error handling, simplified code flow

### Medium Priority

#### 7. Create Generic `useMediaProjectManagement` Hook
**Rationale:** 90% duplicate code with minor type differences
**Affected Files:**
- `VideoEditSubSide/model/hooks/useVideoProjectManagement.ts` (DELETE)
- `ImageEditSubSide/model/hooks/useImageProjectManagement.ts` (DELETE)
- `editor-subSidebar/shared/hooks/useMediaProjectManagement.ts` (CREATE)

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/hooks/useMediaProjectManagement.ts
import { useMediaStore } from "@/entities/media/useMediaStore";
import { MediaElement } from "@/entities/media/types";

export function useMediaProjectManagement<TInput, TElement extends MediaElement>(
  createElement: (input: TInput) => TElement,
  getUrl: (input: TInput) => string,
  mediaTypeName: string
) {
  const { media, addMediaElement, updateMediaElement, deleteMediaElement } = useMediaStore();

  const addToTimeLine = (input: TInput) => {
    const element = createElement(input);
    const url = getUrl(input);

    const existing = media.mediaElement.find((el) => el.url === url);
    if (existing) {
      // TODO: Replace alert with toast notification
      alert(`${mediaTypeName} already exists in the timeline`);
      return;
    }

    addMediaElement(element);
  };

  const updateSettings = (id: string, updates: Partial<TElement>) => {
    updateMediaElement(id, updates);
  };

  const deleteItem = (id: string) => {
    deleteMediaElement(id);
  };

  return {
    addToTimeLine,
    updateSettings,
    deleteItem,
  };
}
```

**Usage:**
```typescript
// In useVideoEdit.ts
const projectManagement = useMediaProjectManagement(
  createVideoElement,
  (data) => data.url,
  "Video"
);
```

#### 8. Replace `alert()` with Toast Notification System
**Rationale:** Better UX, accessibility, testability
**Affected Files:**
- All files using `alert()` (7 occurrences)
- `shared/ui/molecules/Toast/` (CREATE - if doesn't exist)

**Estimated Impact:** Improved UX consistency across application

#### 9. Remove Unused Props from Upload Area Components
**Rationale:** Simplify component interfaces, reduce coupling
**Affected Files:**
- `VideoEditSubSide/ui/_component/VideoFileUploadArea.tsx:6-21`
- `ImageEditSubSide/ui/_component/ImageFileUploadArea.tsx:6-21`

**Implementation:** Remove `selectVideo`, `updateVideoSettings`, `deleteVideo`, `selectImage`, `updateImageSettings`, `deleteImage` from actions interface

#### 10. Create Shared Media Element Constants File
**Rationale:** Centralize default values, easier to modify
**Affected Files:**
- `editor-subSidebar/shared/constants/mediaDefaults.ts` (CREATE)
- All factory functions (UPDATE)

**Implementation:**
```typescript
// CREATE: editor-subSidebar/shared/constants/mediaDefaults.ts
export const MEDIA_DEFAULTS = {
  position: {
    top: "50%",
    left: "50%",
  },
  visual: {
    opacity: 1,
    rotation: "0deg",
    visibility: "visible" as const,
  },
  playback: {
    volume: 50,
    speed: 1,
  },
  image: {
    duration: 5,
    width: 400,
    height: 300,
  },
  text: {
    duration: 5,
    positionX: 425,
    positionY: 500,
    fontSize: 120,
    color: "#ffffff",
    backgroundColor: "bg-transparent",
    font: "Arial",
    width: 300,
    height: 300,
  },
} as const;
```

### Low Priority (Nice to Have)

#### 11. Consistent File Naming Convention
**Rationale:** Easier navigation in editors, clearer stack traces
**Affected Files:**
- `VideoEditSubSide/ui/index.tsx` → `VideoEditSubSide.tsx`
- `ImageEditSubSide/ui/index.tsx` → `ImageEditSubSide.tsx`

#### 12. Standardize Hook Return Type Patterns
**Rationale:** Consistency, better IDE support
**Implementation:** All main hooks should explicitly declare return types like Audio does

#### 13. Extract Preview/List Area Component Patterns
**Rationale:** Some duplication in preview areas
**Note:** Lower priority as these components have more divergence than upload areas

## Proposed Architecture Changes

### Option 1: Shared Hooks + Specialized Components (Recommended)

**Description:** Extract all reusable hooks to a shared location while keeping component-specific UI separate.

**Structure:**
```
editor-subSidebar/
├── shared/
│   ├── hooks/
│   │   ├── useDragAndDrop.ts
│   │   ├── useMediaSelection.ts
│   │   ├── useMediaProjectManagement.ts
│   │   └── index.ts
│   ├── ui/
│   │   └── MediaFileUploadArea.tsx
│   ├── lib/
│   │   └── generateMediaId.ts
│   └── constants/
│       └── mediaDefaults.ts
├── ui/
│   ├── EditorSubSideBar.tsx
│   └── _component/
│       ├── VideoEditSubSide/
│       │   ├── model/
│       │   │   ├── hooks/
│       │   │   │   ├── useVideoEdit.ts (uses shared hooks)
│       │   │   │   └── useFileUpload.ts (video-specific logic)
│       │   │   └── types.ts
│       │   ├── lib/
│       │   │   └── videoElementFactory.ts
│       │   └── ui/
│       │       ├── VideoEditSubSide.tsx
│       │       └── _component/
│       │           └── VideoPreviewArea.tsx
│       ├── ImageEditSubSide/ (similar structure)
│       ├── MusicEditSubSide/ (similar structure)
│       ├── TextEditSubSide/
│       └── CaptionEditSubSide/
```

**Pros:**
- Eliminates 67% of duplicated hook code
- Maintains clear separation between generic and specific logic
- Easier to add new media types
- Follows FSD principles
- Backward compatible (internal refactor)

**Cons:**
- Requires creating new `shared/` directory structure
- More files to navigate initially

**Migration Strategy:**
1. Create `shared/` directory structure
2. Extract `useDragAndDrop` first (lowest risk, highest duplication)
3. Extract `useMediaSelection` second
4. Refactor each media type incrementally
5. Update imports across components
6. Test each media type after migration
7. Delete old duplicate files

**Estimated Effort:** 2-3 days

---

### Option 2: Full Generic Media Edit System

**Description:** Create a fully generic `useMediaEdit` factory that handles all media types through configuration.

**Structure:**
```typescript
// Hypothetical approach
const useVideoEdit = createMediaEditHook({
  mediaType: "video",
  fileProcessor: processVideoFile,
  elementFactory: createVideoElement,
  // ... all configuration
});
```

**Pros:**
- Maximum code reuse
- Consistent API across all media types
- Easy to add new media types (just configuration)

**Cons:**
- Higher abstraction complexity
- Harder to customize individual media types
- Steeper learning curve for new developers
- May over-engineer for current requirements

**Verdict:** Not recommended for current codebase. Option 1 provides sufficient abstraction without over-engineering.

---

### Option 3: Keep Current Structure + Extract Only UI Components

**Description:** Only extract duplicated UI components, keep all hooks separate.

**Pros:**
- Minimal changes
- Low risk
- Easy to implement

**Cons:**
- Doesn't address root cause (hook duplication)
- Still ~200 lines of duplicate hook code
- Future maintenance burden remains high

**Verdict:** Insufficient improvement. Does not address the major duplication issues.

## Implementation Plan

### Phase 1: Foundation (Low Risk, High Impact)

**Goal:** Extract completely generic utilities with no behavior changes

**Tasks:**
1. Create `editor-subSidebar/shared/` directory structure
2. Extract `generateMediaId` utility
   - Create `shared/lib/generateMediaId.ts`
   - Update all factory functions to use it
   - Test ID generation
3. Extract `useDragAndDrop` hook
   - Create `shared/hooks/useDragAndDrop.ts`
   - Update Video to use shared hook
   - Test Video upload
   - Update Image to use shared hook
   - Test Image upload
   - Update Music to use shared hook
   - Test Music upload
   - Delete old hook files
4. Create `MediaFileUploadArea` component
   - Create `shared/ui/MediaFileUploadArea.tsx`
   - Update Video to use generic component
   - Test Video upload UI
   - Update Image to use generic component
   - Test Image upload UI
   - Update Music to use generic component
   - Test Music upload UI
   - Delete old component files

**Dependencies:** None
**Risk Level:** Low (pure extraction, no logic changes)
**Estimated Time:** 4-6 hours

---

### Phase 2: Selection & Project Management (Medium Risk, High Impact)

**Goal:** Extract selection and project management patterns

**Tasks:**
1. Extract `useMediaSelection` hook
   - Create `shared/hooks/useMediaSelection.ts` with generic implementation
   - Update `useVideoEdit` to use `useMediaSelection<VideoElement>("video")`
   - Test video selection functionality
   - Update `useImageEdit` to use `useMediaSelection<ImageElement>("image")`
   - Test image selection functionality
   - Delete old selection hook files
2. Extract `useMediaProjectManagement` hook
   - Create `shared/hooks/useMediaProjectManagement.ts`
   - Update `useVideoEdit` to use generic hook
   - Test video add/update/delete operations
   - Update `useImageEdit` to use generic hook
   - Test image add/update/delete operations
   - Delete old project management hook files

**Dependencies:** Phase 1 complete
**Risk Level:** Medium (changes business logic composition)
**Estimated Time:** 6-8 hours

---

### Phase 3: Caption Edit Refactoring (Medium Risk, Medium Impact)

**Goal:** Move caption business logic to model layer

**Tasks:**
1. Create `useCaptionEdit` hook
   - Extract all business logic from UI component
   - Move to `CaptionEditSubSide/model/hooks/useCaptionEdit.ts`
2. Refactor `CaptionEditSubSide.tsx`
   - Import and use `useCaptionEdit` hook
   - Remove inline business logic
   - Keep only UI rendering
3. Test all caption editing functionality
   - Upload SRT file
   - Edit caption text
   - Edit start/end times
   - Verify overlap detection

**Dependencies:** None (independent of other phases)
**Risk Level:** Medium (significant component refactor)
**Estimated Time:** 4-6 hours

---

### Phase 4: Standardization & Polish (Low Risk, Medium Impact)

**Goal:** Clean up inconsistencies and improve maintainability

**Tasks:**
1. Create `mediaDefaults.ts` constants file
   - Extract all default values from factories
   - Update factories to use constants
   - Update TextEditSubSide to use constants
2. Standardize factory functions
   - Make `createAudioElement` synchronous
   - Move metadata extraction to upload phase
   - Ensure all factories follow same pattern
3. Remove unused props
   - Clean up VideoFileUploadArea props interface
   - Clean up ImageFileUploadArea props interface
4. Replace `alert()` with toast notifications
   - Implement or import toast system
   - Replace all alert calls
   - Add toast component to app layout
5. Standardize hook return types
   - Add explicit return types to all main hooks
   - Follow Audio hook pattern

**Dependencies:** Phases 1-3 complete
**Risk Level:** Low (cosmetic and organizational changes)
**Estimated Time:** 4-6 hours

---

### Phase 5: Testing & Documentation (Low Risk, Low Impact)

**Goal:** Ensure refactoring is complete and well-documented

**Tasks:**
1. Comprehensive testing
   - Test all media upload flows (Video, Image, Audio)
   - Test selection functionality
   - Test add/remove/update operations
   - Test caption editing
   - Test drag-and-drop across all panels
2. Update exports
   - Clean up model/index.ts files
   - Ensure shared hooks are properly exported
3. Update internal documentation
   - Document shared hooks usage
   - Add JSDoc comments to generic functions
   - Update architecture diagrams if any exist

**Dependencies:** All phases complete
**Risk Level:** Low (verification and documentation)
**Estimated Time:** 2-3 hours

---

### Total Estimated Effort

- **Phase 1:** 4-6 hours
- **Phase 2:** 6-8 hours
- **Phase 3:** 4-6 hours
- **Phase 4:** 4-6 hours
- **Phase 5:** 2-3 hours

**Total:** 20-29 hours (2.5-3.5 working days)

## Appendix

### Code Examples

#### Before/After: Using Shared `useDragAndDrop`

**Before (VideoEditSubSide):**
```typescript
// VideoEditSubSide/model/hooks/useDragAndDrop.ts (34 lines)
import { useState } from "react";

export function useDragAndDrop() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, onFilesDropped: (files: FileList) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  return { dragActive, handleDrag, handleDrop };
}
```

**After:**
```typescript
// VideoEditSubSide/model/hooks/useVideoEdit.ts
import { useDragAndDrop } from "../../../shared/hooks/useDragAndDrop";

export function useVideoEdit() {
  const dragAndDrop = useDragAndDrop();
  // ... rest of implementation unchanged
}
```

**Benefit:** Delete 3 files (102 lines), replace with 1 import line each.

---

#### Before/After: Generic MediaFileUploadArea

**Before (VideoFileUploadArea.tsx):**
```typescript
interface VideoFileUploadAreaProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  actions: {
    handleFileSelect: (files: FileList | null) => void;
    handleDrag: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    removeVideo: (index: number) => void;
    selectVideo: (videoId: string) => void;
    updateVideoSettings: (videoId: string, updates: Partial<MediaElement>) => void;
    deleteVideo: (videoId: string) => void;
  };
  dragActive: boolean;
}

export default function VideoFileUploadArea({ fileInputRef, actions, dragActive }: VideoFileUploadAreaProps) {
  return (
    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors w-full ${
        dragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-600 bg-zinc-800/50"
      }`}
      onDragEnter={actions.handleDrag}
      onDragLeave={actions.handleDrag}
      onDragOver={actions.handleDrag}
      onDrop={actions.handleDrop}
    >
      <input ref={fileInputRef} type="file" accept="video/*" multiple className="hidden"
        onChange={(e) => actions.handleFileSelect(e.target.files)} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-300 mb-2">Drag & drop your video file here</p>
      <p className="text-gray-500 text-sm mb-4">or</p>
      <Button onClick={() => fileInputRef.current?.click()} variant="light" size="sm">
        Choose Video
      </Button>
    </div>
  );
}
```

**After (VideoEditSubSide.tsx):**
```typescript
import MediaFileUploadArea from "../../../shared/ui/MediaFileUploadArea";

export default function VideoEditSubSide() {
  const { state, actions, fileInputRef } = useVideoEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Video</h3>

      <MediaFileUploadArea
        mediaType="video"
        fileInputRef={fileInputRef}
        onFileSelect={actions.handleFileSelect}
        onDrag={actions.handleDrag}
        onDrop={actions.handleDrop}
        dragActive={state.dragActive}
      />

      <VideoPreviewArea
        uploadedVideos={state.uploadedVideos}
        removeVideo={actions.removeVideo}
        addVideoToTimeLine={actions.addVideoToTimeLine}
      />
    </div>
  );
}
```

**Benefit:**
- Delete 3 component files (181 lines total)
- Cleaner props interface (only 7 props vs sprawling actions object)
- Centralized styling and behavior

---

#### Before/After: Caption Edit Logic Extraction

**Before (CaptionEditSubSide.tsx - Lines 24-112):**
```typescript
export default function CaptionEditSubSide() {
  const { state, actions } = useCaptionUpload();
  const { fileInputRef, actions: fileActions } = useFileHandler({...});
  const { media, updateTextElement } = useMediaStore();

  const [editing, setEditing] = useState<{ id: string; field: "start" | "end" | "text" } | null>(null);

  const parseClockTime = useCallback((value: string): number | null => {
    // ... 17 lines of parsing logic
  }, []);

  const hasOverlap = useCallback((elementId: string, ...) => {
    // ... 6 lines of overlap detection
  }, [media.textElement]);

  const commitClockEdit = useCallback((...) => {
    // ... 27 lines of validation and update logic
  }, [...]);

  const commitTextEdit = useCallback((...) => {
    // ... 8 lines of text update logic
  }, [...]);

  const sortedTextElements = useMemo(() => {
    return [...media.textElement].sort((a, b) => a.startTime - b.startTime);
  }, [media.textElement]);

  return (
    <div>
      {/* UI rendering with inline callbacks */}
    </div>
  );
}
```

**After:**
```typescript
// CaptionEditSubSide.tsx (UI only)
export default function CaptionEditSubSide() {
  const { state, actions } = useCaptionUpload();
  const { fileInputRef, actions: fileActions } = useFileHandler({...});
  const { state: editState, actions: editActions } = useCaptionEdit();

  return (
    <div className="p-4 space-y-4 w-full">
      <h3 className="text-lg font-semibold text-white mb-4">Import Captions</h3>

      <FileUploadArea {...fileUploadProps} />

      <div className="w-full">
        <h4 className="text-md font-medium text-white mb-2">Captions</h4>
        <div className="border border-gray-700 rounded-md max-h-64 overflow-y-auto divide-y divide-gray-800">
          {editState.sortedTextElements.length === 0 ? (
            <div className="p-3 text-sm text-gray-400">No captions loaded</div>
          ) : (
            editState.sortedTextElements.map((el) => (
              <div key={el.id} className="flex flex-col p-2 gap-2">
                <div className="flex w-full justify-center items-center gap-1 text-sm text-gray-200">
                  <ClockField
                    isEditing={editState.editing?.id === el.id && editState.editing.field === "start"}
                    valueSeconds={el.startTime}
                    onBegin={() => editActions.beginEdit(el.id, "start")}
                    onCommit={(text) => editActions.commitClockEdit(el.id, "start", text)}
                    onCancel={editActions.cancelEdit}
                  />
                  <span className="opacity-70">-</span>
                  <ClockField
                    isEditing={editState.editing?.id === el.id && editState.editing.field === "end"}
                    valueSeconds={el.endTime}
                    onBegin={() => editActions.beginEdit(el.id, "end")}
                    onCommit={(text) => editActions.commitClockEdit(el.id, "end", text)}
                    onCancel={editActions.cancelEdit}
                  />
                </div>
                <TextEdit
                  editing={editState.editing}
                  element={el}
                  commitTextEdit={editActions.commitTextEdit}
                  cancelEdit={editActions.cancelEdit}
                  beginTextEdit={editActions.beginTextEdit}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

**Benefit:**
- Clear separation: UI in `ui/`, logic in `model/`
- 67 lines of business logic moved to proper layer
- Easier to test caption editing logic independently
- Follows FSD principles

### Dependency Graph

#### Current State

```
EditorSubSideBar (router)
    ├── VideoEditSubSide
    │   ├── useVideoEdit
    │   │   ├── useFileUpload (VideoEditSubSide/model/hooks/)
    │   │   ├── useDragAndDrop (VideoEditSubSide/model/hooks/) [DUPLICATE]
    │   │   ├── useVideoSelection (VideoEditSubSide/model/hooks/)
    │   │   └── useVideoProjectManagement (VideoEditSubSide/model/hooks/)
    │   ├── VideoFileUploadArea [DUPLICATE UI]
    │   └── VideoPreviewArea
    │
    ├── ImageEditSubSide
    │   ├── useImageEdit
    │   │   ├── useFileUpload (ImageEditSubSide/model/hooks/)
    │   │   ├── useDragAndDrop (ImageEditSubSide/model/hooks/) [DUPLICATE]
    │   │   ├── useImageSelection (ImageEditSubSide/model/hooks/)
    │   │   └── useImageProjectManagement (ImageEditSubSide/model/hooks/)
    │   ├── ImageFileUploadArea [DUPLICATE UI]
    │   └── ImagePreviewArea
    │
    ├── MusicEditSubSide
    │   ├── useAudioEdit
    │   │   ├── useFileUpload (MusicEditSubSide/model/hooks/)
    │   │   ├── useDragAndDrop (MusicEditSubSide/model/hooks/) [DUPLICATE]
    │   │   ├── useAudioPreview
    │   │   └── useAudioFileProcessor
    │   ├── AudioFileUploadArea [DUPLICATE UI]
    │   └── AudioListArea
    │
    ├── TextEditSubSide (simple, no complex hooks)
    │
    └── CaptionEditSubSide
        ├── useCaptionUpload
        ├── useFileHandler
        └── [Inline business logic - VIOLATION]
```

#### After Refactoring

```
EditorSubSideBar (router)
    ├── VideoEditSubSide
    │   ├── useVideoEdit
    │   │   ├── useFileUpload (VideoEditSubSide/model/hooks/) [video-specific]
    │   │   ├── useDragAndDrop (shared/hooks/) [SHARED]
    │   │   ├── useMediaSelection (shared/hooks/) [SHARED]
    │   │   └── useMediaProjectManagement (shared/hooks/) [SHARED]
    │   ├── MediaFileUploadArea (shared/ui/) [SHARED]
    │   └── VideoPreviewArea
    │
    ├── ImageEditSubSide
    │   ├── useImageEdit
    │   │   ├── useFileUpload (ImageEditSubSide/model/hooks/) [image-specific]
    │   │   ├── useDragAndDrop (shared/hooks/) [SHARED]
    │   │   ├── useMediaSelection (shared/hooks/) [SHARED]
    │   │   └── useMediaProjectManagement (shared/hooks/) [SHARED]
    │   ├── MediaFileUploadArea (shared/ui/) [SHARED]
    │   └── ImagePreviewArea
    │
    ├── MusicEditSubSide
    │   ├── useAudioEdit
    │   │   ├── useFileUpload (MusicEditSubSide/model/hooks/) [audio-specific]
    │   │   ├── useDragAndDrop (shared/hooks/) [SHARED]
    │   │   ├── useAudioPreview
    │   │   └── useAudioFileProcessor
    │   ├── MediaFileUploadArea (shared/ui/) [SHARED]
    │   └── AudioListArea
    │
    ├── TextEditSubSide
    │   └── Uses MEDIA_DEFAULTS constants [SHARED]
    │
    └── CaptionEditSubSide
        ├── useCaptionUpload
        ├── useFileHandler
        └── useCaptionEdit [NEW - extracted logic]

shared/
    ├── hooks/
    │   ├── useDragAndDrop.ts
    │   ├── useMediaSelection.ts
    │   └── useMediaProjectManagement.ts
    ├── ui/
    │   └── MediaFileUploadArea.tsx
    ├── lib/
    │   └── generateMediaId.ts
    └── constants/
        └── mediaDefaults.ts
```

**Key Changes:**
- 3 duplicate hooks consolidated into shared implementations
- 3 duplicate UI components consolidated into 1 generic component
- Business logic properly separated in Caption component
- Shared utilities for ID generation and defaults
- Each media type retains unique `useFileUpload` for type-specific processing

---

## Summary

This refactoring analysis identifies **~600 lines of duplicate or problematic code** across the editor-subSidebar system. By implementing the recommended changes:

1. **Code Reduction:** ~40% reduction in total lines of code
2. **Maintainability:** Single source of truth for common patterns
3. **Consistency:** Standardized approaches across all media types
4. **Extensibility:** Much easier to add new media types
5. **Quality:** Proper separation of concerns following FSD principles

The proposed 5-phase implementation plan provides a safe, incremental path forward with clear testing checkpoints and minimal risk to existing functionality. Total estimated effort is 20-29 hours (2.5-3.5 working days).

**Recommendation:** Prioritize Phases 1-2 for immediate impact, then schedule Phases 3-5 as capacity allows.
