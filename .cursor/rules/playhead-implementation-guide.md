# 매우 부드럽고 정확한 Playhead 구현 가이드

> OpenCut 비디오 편집기의 Timeline Playhead 구현 분석 및 최적화 가이드

## 목차

1. [개요](#개요)
2. [핵심 아키텍처](#핵심-아키텍처)
3. [고정밀 시간 측정 시스템](#고정밀-시간-측정-시스템)
4. [프레임 기반 렌더링 최적화](#프레임-기반-렌더링-최적화)
5. [픽셀 완벽 위치 계산](#픽셀-완벽-위치-계산)
6. [상태 관리 최적화](#상태-관리-최적화)
7. [스마트 뷰포트 관리](#스마트-뷰포트-관리)
8. [사용자 인터랙션 정밀도](#사용자-인터랙션-정밀도)
9. [시각적 피드백 시스템](#시각적-피드백-시스템)
10. [성능 최적화 전략](#성능-최적화-전략)
11. [에러 처리 및 안정성](#에러-처리-및-안정성)
12. [구현 체크리스트](#구현-체크리스트)

---

## 개요

매우 부드럽고 정확한 playhead를 구현하기 위해서는 **정밀한 시간 측정**, **최적화된 렌더링**, **스마트한 상태 관리**, **정확한 사용자 인터랙션**이 모두 조화롭게 작동해야 합니다.

### 핵심 목표

- ⚡ **60fps 부드러운 애니메이션**: 끊김 없는 자연스러운 움직임
- 🎯 **마이크로초 정밀도**: frame-accurate 편집 지원
- 🔄 **실시간 동기화**: 비디오 프리뷰와 완벽한 싱크
- 📱 **반응형 인터랙션**: 지연 없는 즉시 피드백

---

## 핵심 아키텍처

```mermaid
graph TD
    A[PlaybackStore] --> B[Timer System]
    B --> C[performance.now()]
    C --> D[requestAnimationFrame]
    D --> E[State Update]
    E --> F[Playhead Component]
    F --> G[Position Calculation]
    G --> H[Auto Scroll]
    H --> I[Visual Rendering]
```

### 주요 컴포넌트

- **PlaybackStore**: 중앙집중식 재생 상태 관리
- **useTimelinePlayhead**: Playhead 동작 로직
- **TimelinePlayhead**: UI 렌더링 컴포넌트
- **Timer System**: 고정밀 시간 업데이트

---

## 고정밀 시간 측정 시스템

### 1. Performance.now() 기반 정확한 시간 측정

```typescript
// ✅ 정확한 델타 시간 계산
const now = performance.now();
const delta = (now - lastUpdate) / 1000; // 밀리초 → 초 변환
lastUpdate = now;

const newTime = state.currentTime + delta * state.speed;
```

**핵심 특징:**

- **마이크로초 정밀도**: 0.001ms 단위 측정
- **단조성 보장**: 시스템 시계 조정에 무관
- **상대적 시간**: 페이지 로딩 기준점으로 일관성 유지

### 2. Date.now()와의 차이점

| 특성               | Date.now()        | performance.now() |
| ------------------ | ----------------- | ----------------- |
| **기준점**         | Unix epoch (1970) | 페이지 로딩 시점  |
| **정밀도**         | 1ms               | 0.001ms           |
| **시계 조정 영향** | 영향 받음 ❌      | 영향 없음 ✅      |
| **단조성**         | 보장 안됨 ❌      | 단조 증가 ✅      |

### 3. 속도 보상 시스템

```typescript
// 재생 속도에 따른 정확한 시간 진행
const newTime = state.currentTime + delta * state.speed;

// 속도 범위 제한
const newSpeed = Math.max(0.1, Math.min(2.0, speed));
```

---

## 프레임 기반 렌더링 최적화

### 1. RequestAnimationFrame 활용

```typescript
const updateTime = () => {
  const state = store();
  if (state.isPlaying && state.currentTime < state.duration) {
    // 시간 업데이트 로직
    const now = performance.now();
    const delta = (now - lastUpdate) / 1000;
    lastUpdate = now;

    const newTime = state.currentTime + delta * state.speed;
    state.setCurrentTime(newTime);

    // 비디오 요소와 동기화
    window.dispatchEvent(new CustomEvent("playback-update", { detail: { time: newTime } }));
  }
  playbackTimer = requestAnimationFrame(updateTime);
};
```

### 2. 부드러운 애니메이션을 위한 필수 요소

**🎬 60fps 동기화**

- 브라우저 refresh rate와 완벽 동기화
- VSync 활용으로 티어링 방지
- 높은 refresh rate 모니터(120Hz, 144Hz) 대응

**⚡ 적응적 프레임 처리**

- 성능이 낮은 기기에서도 부드러운 동작
- 프레임 드롭 시 자동 보상
- 탭 비활성화 시 자동 최적화

**🚫 프레임 스킵 방지**

- 무거운 작업 중에도 타이머 정확성 유지
- UI 블로킹 없는 비동기 처리
- 메인 스레드 최적화

### 3. 타이머 생명주기 관리

```typescript
// 타이머 시작
const startTimer = (store: () => PlaybackStore) => {
  if (playbackTimer) cancelAnimationFrame(playbackTimer);
  let lastUpdate = performance.now();
  playbackTimer = requestAnimationFrame(updateTime);
};

// 타이머 정지
const stopTimer = () => {
  if (playbackTimer) {
    cancelAnimationFrame(playbackTimer);
    playbackTimer = null;
  }
};
```

---

## 픽셀 완벽 위치 계산

### 1. 정밀한 좌표 매핑

```typescript
// 정확한 픽셀 위치 계산
const leftPosition = trackLabelsWidth + playheadPosition * TIMELINE_CONSTANTS.PIXELS_PER_SECOND * zoomLevel;

// 시간-픽셀 변환 상수
TIMELINE_CONSTANTS = {
  PIXELS_PER_SECOND: 50, // 1초 = 50픽셀
};
```

### 2. Sub-pixel 정확도

```css
/* GPU 가속 활용한 정밀 위치 */
.playhead {
  transform: translateX(123.456px); /* 소수점 단위 정밀도 */
  will-change: transform; /* GPU 가속 힌트 */
}
```

### 3. Zoom Level 보상

```typescript
// 확대/축소 시에도 정확한 계산
const pixelPosition = timeInSeconds * PIXELS_PER_SECOND * zoomLevel;

// 줌 레벨별 적응
const ZOOM_LEVELS = [0.25, 0.5, 1, 1.5, 2, 3, 4];
```

### 4. Frame Snapping 정밀도

```typescript
// 프레임 단위 정확한 스냅핑
export function snapTimeToFrame(time: number, fps: number): number {
  if (fps <= 0) return time;
  const frame = Math.round(time * fps);
  return frame / fps;
}

// 다양한 FPS 지원
const FPS_PRESETS = [24, 25, 30, 60, 120];
```

---

## 상태 관리 최적화

### 1. Zustand Store 기반 중앙집중식 관리

```typescript
export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  // 핵심 상태
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  speed: 1.0,

  // 액션들
  play: () => {
    set({ isPlaying: true });
    startTimer(get);
  },

  seek: (time: number) => {
    const clampedTime = Math.max(0, Math.min(duration, time));
    set({ currentTime: clampedTime });
    // 즉시 이벤트 발생으로 동기화
    window.dispatchEvent(
      new CustomEvent("playback-seek", {
        detail: { time: clampedTime },
      })
    );
  },
}));
```

### 2. 효율적 상태 업데이트

**🎯 최소한의 리렌더링**

```typescript
// 선택적 상태 구독
const currentTime = usePlaybackStore((state) => state.currentTime);
const isPlaying = usePlaybackStore((state) => state.isPlaying);
```

**📦 Batched Updates**

- React 18의 automatic batching 활용
- 동시 상태 변경의 일괄 처리
- 불필요한 중간 렌더링 방지

**🔄 Event-driven 동기화**

```typescript
// 커스텀 이벤트로 외부 요소와 동기화
window.dispatchEvent(
  new CustomEvent("playback-update", {
    detail: { time: newTime },
  })
);
window.dispatchEvent(
  new CustomEvent("playback-seek", {
    detail: { time: clampedTime },
  })
);
```

---

## 스마트 뷰포트 관리

### 1. 자동 스크롤 시스템

```typescript
// 예측적 스크롤로 부드러운 UX
useEffect(() => {
  const playheadPx = playheadPosition * 50 * zoomLevel;
  const viewportWidth = rulerViewport.clientWidth;

  // 100px 버퍼로 미리 스크롤
  if (playheadPx < rulerViewport.scrollLeft + 100 || playheadPx > rulerViewport.scrollLeft + viewportWidth - 100) {
    const desiredScroll = Math.max(0, Math.min(scrollMax, playheadPx - viewportWidth / 2));
    rulerViewport.scrollLeft = tracksViewport.scrollLeft = desiredScroll;
  }
}, [playheadPosition, zoomLevel]);
```

### 2. 동기화된 멀티 뷰포트

**📏 Ruler & Tracks 동기화**

- 수평 스크롤 완벽 동기화
- 동시 업데이트로 어긋남 방지

**📊 수직 스크롤 관리**

- Track labels와 tracks 영역 동기화
- 스크롤 이벤트 중복 방지

### 3. 성능 최적화된 스크롤

```typescript
// 직접 scrollLeft 조작으로 부드러운 스크롤
rulerViewport.scrollLeft = tracksViewport.scrollLeft = desiredScroll;

// Intersection Observer로 뷰포트 변화 감지
const observer = new IntersectionObserver(callback, options);
```

---

## 사용자 인터랙션 정밀도

### 1. 스크러빙 기능

```typescript
const handleScrub = useCallback(
  (e: MouseEvent | React.MouseEvent) => {
    const ruler = rulerRef.current;
    if (!ruler) return;

    // 정확한 좌표 변환
    const rect = ruler.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rawTime = Math.max(0, Math.min(duration, x / (50 * zoomLevel)));

    // 프레임 단위 스냅핑
    const projectFps = useProjectStore.getState().activeProject?.fps || 30;
    const time = snapTimeToFrame(rawTime, projectFps);

    setScrubTime(time);
    seek(time); // 실시간 프리뷰 업데이트
  },
  [duration, zoomLevel, seek, rulerRef]
);
```

### 2. 정확한 인터랙션 요소

**⚡ 실시간 피드백**

- 드래그 중 즉시 비디오 프리뷰 업데이트
- 지연 없는 시각적 반응
- 부드러운 스크러빙 경험

**🎯 정밀한 좌표 변환**

- 마우스 좌표를 정확한 시간으로 변환
- 줌 레벨과 스크롤 위치 고려
- Sub-pixel 정확도 유지

**🎬 Frame-accurate 선택**

- 프레임 단위로 정확한 시간 선택
- 편집 작업의 정밀도 보장
- 다양한 FPS 지원

### 3. 마우스 이벤트 최적화

```typescript
// 전역 마우스 이벤트로 정확한 추적
useEffect(() => {
  if (!isScrubbing) return;

  const onMouseMove = (e: MouseEvent) => {
    handleScrub(e);
  };

  const onMouseUp = () => {
    setIsScrubbing(false);
    if (scrubTime !== null) seek(scrubTime);
    setScrubTime(null);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}, [isScrubbing, scrubTime, seek, handleScrub]);
```

---

## 시각적 피드백 시스템

### 1. CSS 최적화

```tsx
<div
  ref={playheadRef}
  className="absolute pointer-events-auto z-[150]"
  style={{
    left: `${leftPosition}px`,
    top: 0,
    height: `${totalHeight}px`,
    width: "2px",
  }}
  onMouseDown={handlePlayheadMouseDown}
>
  {/* 세로 라인 */}
  <div className="absolute left-0 w-0.5 cursor-col-resize h-full bg-foreground" />

  {/* 상단 원형 표시 */}
  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 shadow-sm bg-foreground border-foreground" />
</div>
```

### 2. GPU 가속 애니메이션

```css
.playhead {
  /* GPU 가속 활용 */
  transform: translateX(var(--playhead-position));
  will-change: transform;

  /* 하드웨어 가속 힌트 */
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### 3. 반응형 디자인

**📱 다양한 화면 크기 대응**

- 모바일부터 4K 디스플레이까지
- DPI 독립적 렌더링
- 터치 인터랙션 지원

**🎨 테마 대응**

- 다크/라이트 모드 자동 적응
- 색상 대비 접근성 준수
- 스냅핑 상태 시각적 피드백

---

## 성능 최적화 전략

### 1. 메모리 관리

```typescript
// 적절한 클린업
const stopTimer = () => {
  if (playbackTimer) {
    cancelAnimationFrame(playbackTimer);
    playbackTimer = null;
  }
};

// 컴포넌트 언마운트 시 정리
useEffect(() => {
  return () => {
    stopTimer();
  };
}, []);
```

### 2. 이벤트 리스너 최적화

```typescript
// Passive 이벤트 리스너 사용
window.addEventListener("wheel", handleWheel, { passive: false });

// 이벤트 위임 활용
document.addEventListener("click", handleGlobalClick);

// 적절한 디바운싱
const debouncedSeek = useMemo(
  () => debounce(seek, 16), // 60fps에 맞춘 디바운싱
  [seek]
);
```

### 3. 렌더링 최적화

```typescript
// React.memo로 불필요한 리렌더링 방지
const TimelinePlayhead = React.memo(({ currentTime, duration, ... }) => {
  // ...
});

// useMemo로 무거운 계산 캐싱
const playheadPosition = useMemo(() => {
  return isScrubbing && scrubTime !== null ? scrubTime : currentTime;
}, [isScrubbing, scrubTime, currentTime]);

// useCallback으로 함수 안정화
const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsScrubbing(true);
  handleScrub(e);
}, [handleScrub]);
```

---

## 에러 처리 및 안정성

### 1. 경계 조건 처리

```typescript
// 시간 값 범위 검증
const seek = (time: number) => {
  const { duration } = get();
  const clampedTime = Math.max(0, Math.min(duration, time));
  set({ currentTime: clampedTime });
};

// FPS 검증
export function snapTimeToFrame(time: number, fps: number): number {
  if (fps <= 0) return time; // Fallback for invalid FPS
  const frame = Math.round(time * fps);
  return frame / fps;
}

// Null 안전성
const ruler = rulerRef.current;
if (!ruler) return;
```

### 2. Fallback 메커니즘

```typescript
// API 실패 시 기본값 사용
const projectFps = projectStore.activeProject?.fps || 30;

// DOM 요소 안전 접근
const rulerViewport = rulerScrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;

if (!rulerViewport || !tracksViewport) return;
```

### 3. 타입 안전성

```typescript
// TypeScript 인터페이스 정의
interface UseTimelinePlayheadProps {
  currentTime: number;
  duration: number;
  zoomLevel: number;
  seek: (time: number) => void;
  // ...
}

// 런타임 타입 검증
if (typeof time !== "number" || isNaN(time)) {
  console.warn("Invalid time value:", time);
  return;
}
```

---

## 구현 체크리스트

### ✅ 필수 구현 요소

**⏱️ 시간 측정 시스템**

- [ ] `performance.now()` 기반 고정밀 시간 측정
- [ ] `requestAnimationFrame` 타이머 구현
- [ ] 재생 속도 보상 로직
- [ ] 정확한 델타 시간 계산

**🎨 렌더링 최적화**

- [ ] GPU 가속 CSS 애니메이션
- [ ] React.memo 최적화
- [ ] useMemo/useCallback 활용
- [ ] 선택적 상태 구독

**📐 위치 계산**

- [ ] 정확한 시간-픽셀 변환
- [ ] Zoom level 보상
- [ ] Frame snapping 구현
- [ ] Sub-pixel 정밀도

**🖱️ 사용자 인터랙션**

- [ ] 정밀한 스크러빙 기능
- [ ] 실시간 프리뷰 업데이트
- [ ] 전역 마우스 이벤트 처리
- [ ] 터치 인터랙션 지원

**📱 뷰포트 관리**

- [ ] 자동 스크롤 시스템
- [ ] 멀티 뷰포트 동기화
- [ ] 성능 최적화된 스크롤
- [ ] 반응형 레이아웃

**🛡️ 안정성 & 에러 처리**

- [ ] 경계값 검증
- [ ] Null 안전성 검사
- [ ] Fallback 메커니즘
- [ ] 메모리 누수 방지

### 🎯 고급 최적화

**⚡ 성능 향상**

- [ ] Web Workers 활용 (무거운 계산)
- [ ] Virtual scrolling (대용량 프로젝트)
- [ ] Debouncing/Throttling 적절한 적용
- [ ] Bundle size 최적화

**🎮 사용자 경험**

- [ ] 키보드 단축키 지원
- [ ] 접근성 (a11y) 준수
- [ ] 다국어 지원
- [ ] 커스텀 테마 지원

**🔧 개발자 경험**

- [ ] TypeScript 완벽 지원
- [ ] 단위 테스트 작성
- [ ] 성능 프로파일링
- [ ] 문서화 완료

---

## 결론

매우 부드럽고 정확한 playhead 구현은 **정밀한 시간 측정**, **최적화된 렌더링**, **스마트한 상태 관리**, **정확한 사용자 인터랙션**의 완벽한 조화가 필요합니다.

OpenCut의 현재 구조는 이러한 핵심 요소들을 잘 갖추고 있으며, 각 컴포넌트가 명확한 역할 분담을 통해 전체적으로 부드럽고 정확한 playhead 동작을 구현하고 있습니다.

이 가이드를 통해 더욱 정교하고 성능 최적화된 playhead 시스템을 구축할 수 있을 것입니다.

---

_© 2024 OpenCut Video Editor - Playhead Implementation Guide_
