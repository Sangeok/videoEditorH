# SmartGuide 기능 명세서

> DraggableText 컴포넌트 드래그 시 정렬 가이드라인 표시 기능
>
> 작성일: 2025-10-02
>
> 버전: 1.0.0

---

## 목차

1. [개요](#1-개요)
2. [현재 시스템 분석](#2-현재-시스템-분석)
3. [기능 명세](#3-기능-명세)
4. [아키텍처 설계](#4-아키텍처-설계)
5. [구현 계획](#5-구현-계획)
6. [성능 고려사항](#6-성능-고려사항)
7. [향후 확장](#7-향후-확장)

---

## 1. 개요

### 1.1 목적

사용자가 텍스트 요소를 드래그할 때 **시각적 가이드라인**을 표시하여:
- 캔버스 중앙 정렬 지원
- 다른 텍스트 요소와의 정렬 감지
- 직관적인 UX 제공

**주의**: 본 명세는 **가이드라인 표시만** 구현하며, 스냅(자동 정렬) 기능은 포함하지 않습니다.

### 1.2 범위

**포함 사항**:
- ✅ 수평/수직 가이드라인 표시
- ✅ 캔버스 중앙 정렬 감지
- ✅ 다른 텍스트 요소와의 경계 정렬 감지
- ✅ 실시간 가이드라인 업데이트

**제외 사항**:
- ❌ 스냅(Snap) 기능
- ❌ 가이드라인 커스터마이징
- ❌ 이미지/비디오 요소와의 정렬

---

## 2. 현재 시스템 분석

### 2.1 컴포넌트 구조

```
Player (Remotion Player Wrapper)
└── Composition
    └── SequenceItem
        └── DraggableText
            ├── useDragText (드래그 로직)
            └── useTextEdit (편집 로직)
```

### 2.2 좌표 시스템

**Composition 좌표계** (실제 비디오 해상도):
- Width: 1080px
- Height: 1920px

**Display 좌표계** (화면 표시 크기):
- Width: 225px
- Height: 400px (1920/1080 * 225)

**좌표 변환**:
```typescript
// PLAYER_CONFIG.SCALE_X = 1080 / 225 = 4.8
// PLAYER_CONFIG.SCALE_Y = 1920 / 400 = 4.8

// Display → Composition
compositionX = displayX * PLAYER_CONFIG.SCALE_X
compositionY = displayY * PLAYER_CONFIG.SCALE_Y
```

### 2.3 드래그 구현 (useDragText)

**현재 흐름**:
```typescript
1. handleMouseDown → dragState.isDragging = true
2. handleMouseMove → 델타 계산 → updateTextElement
3. handleMouseUp → dragState 초기화
```

**좌표 업데이트**:
```typescript
const deltaX = e.clientX - dragState.initialClientX;
const deltaY = e.clientY - dragState.initialClientY;

const newPosX = dragState.initialCanvasX + deltaX * PLAYER_CONFIG.SCALE_X;
const newPosY = dragState.initialCanvasY + deltaY * PLAYER_CONFIG.SCALE_Y;

updateTextElement(elementId, { positionX: newPosX, positionY: newPosY });
```

### 2.4 기존 가이드라인 참고 (SnapGuideIndicator)

**타임라인용 가이드라인**:
```typescript
// useSnapGuideStore.ts
interface SnapGuideState {
  isVisible: boolean;
  xPositionPx: number | null;
}

// SnapGuideIndicator.tsx
<div
  style={{
    transform: `translateX(${xPositionPx}px)`,
    background: "#9370DB",
    width: "1px",
    height: "100%",
  }}
/>
```

---

## 3. 기능 명세

### 3.1 가이드라인 표시 조건

#### 3.1.1 수직 가이드라인 (Vertical Guide)

**표시 조건**:
- 드래그 중인 텍스트의 **수평 중심**이 캔버스 수평 중심과 정렬될 때
- 드래그 중인 텍스트의 **좌측 경계**가 다른 텍스트의 좌측 경계와 정렬될 때
- 드래그 중인 텍스트의 **우측 경계**가 다른 텍스트의 우측 경계와 정렬될 때
- 드래그 중인 텍스트의 **수평 중심**이 다른 텍스트의 수평 중심과 정렬될 때

**허용 오차**: ±5px (Composition 좌표 기준)

#### 3.1.2 수평 가이드라인 (Horizontal Guide)

**표시 조건**:
- 드래그 중인 텍스트의 **수직 중심**이 캔버스 수직 중심과 정렬될 때
- 드래그 중인 텍스트의 **상단 경계**가 다른 텍스트의 상단 경계와 정렬될 때
- 드래그 중인 텍스트의 **하단 경계**가 다른 텍스트의 하단 경계와 정렬될 때
- 드래그 중인 텍스트의 **수직 중심**이 다른 텍스트의 수직 중심과 정렬될 때

**허용 오차**: ±5px (Composition 좌표 기준)

### 3.2 정렬 감지 알고리즘

#### 3.2.1 캔버스 중앙 정렬

```typescript
// 캔버스 중심점
const CANVAS_CENTER_X = PLAYER_CONFIG.COMPOSITION_WIDTH / 2;  // 540px
const CANVAS_CENTER_Y = PLAYER_CONFIG.COMPOSITION_HEIGHT / 2; // 960px

// 텍스트 중심점 계산
const textCenterX = element.positionX + element.width / 2;
const textCenterY = element.positionY + element.height / 2;

// 중앙 정렬 감지
const isAlignedCenterX = Math.abs(textCenterX - CANVAS_CENTER_X) <= THRESHOLD;
const isAlignedCenterY = Math.abs(textCenterY - CANVAS_CENTER_Y) <= THRESHOLD;
```

#### 3.2.2 다른 요소와의 정렬

```typescript
// 모든 텍스트 요소 순회
for (const otherElement of allTextElements) {
  if (otherElement.id === draggedElement.id) continue;

  // 좌측 경계 정렬
  if (Math.abs(draggedElement.positionX - otherElement.positionX) <= THRESHOLD) {
    guides.push({ type: 'vertical', position: otherElement.positionX });
  }

  // 우측 경계 정렬
  const draggedRight = draggedElement.positionX + draggedElement.width;
  const otherRight = otherElement.positionX + otherElement.width;
  if (Math.abs(draggedRight - otherRight) <= THRESHOLD) {
    guides.push({ type: 'vertical', position: otherRight });
  }

  // 수평 중심 정렬
  const draggedCenterX = draggedElement.positionX + draggedElement.width / 2;
  const otherCenterX = otherElement.positionX + otherElement.width / 2;
  if (Math.abs(draggedCenterX - otherCenterX) <= THRESHOLD) {
    guides.push({ type: 'vertical', position: otherCenterX });
  }

  // 상단/하단/수직 중심 정렬 (동일 로직)
}
```

### 3.3 가이드라인 시각적 명세

#### 3.3.1 스타일

**색상**: `#9370DB` (보라색, 기존 SnapGuide와 동일)

**크기**:
- 수직 가이드: `width: 1px`, `height: 100%` (캔버스 전체 높이)
- 수평 가이드: `height: 1px`, `width: 100%` (캔버스 전체 너비)

**투명도**: `opacity: 0.9`

**그림자**: `box-shadow: 0 0 0 1px rgba(147,112,219,0.6)`

**레이어**: `z-index: 999` (드래그 중인 텍스트 아래, 다른 요소 위)

#### 3.3.2 애니메이션

**등장/사라짐**: 즉시 표시/숨김 (애니메이션 없음)

**이유**: 드래그 중 실시간 계산으로 인한 성능 고려

### 3.4 UX 동작

```
[사용자가 텍스트 드래그 시작]
  ↓
[마우스 이동]
  ↓
[정렬 감지 계산 (매 mousemove 이벤트)]
  ↓
[가이드라인 업데이트]
  ├─ 정렬 조건 충족 → 가이드라인 표시
  └─ 정렬 조건 미충족 → 가이드라인 숨김
  ↓
[마우스 놓기]
  ↓
[모든 가이드라인 숨김]
```

---

## 4. 아키텍처 설계

### 4.1 상태 관리 (Zustand Store)

#### useSmartGuideStore

```typescript
// features/editFeatures/model/store/useSmartGuideStore.ts

interface Guide {
  id: string;
  type: 'vertical' | 'horizontal';
  position: number; // Composition 좌표계 (px)
  alignmentType: 'canvas-center' | 'element-left' | 'element-right' |
                 'element-center' | 'element-top' | 'element-bottom';
}

interface SmartGuideState {
  /** 활성화된 가이드라인 목록 */
  guides: Guide[];

  /** 가이드라인 표시 여부 (전역 토글) */
  isEnabled: boolean;
}

interface SmartGuideActions {
  /** 가이드라인 추가/업데이트 */
  setGuides: (guides: Guide[]) => void;

  /** 모든 가이드라인 제거 */
  clearGuides: () => void;

  /** 가이드라인 기능 활성화/비활성화 */
  setEnabled: (enabled: boolean) => void;
}

export type SmartGuideStore = SmartGuideState & SmartGuideActions;

export const useSmartGuideStore = create<SmartGuideStore>((set) => ({
  guides: [],
  isEnabled: true,

  setGuides: (guides) => set({ guides }),
  clearGuides: () => set({ guides: [] }),
  setEnabled: (enabled) => set({ isEnabled: enabled }),
}));
```

### 4.2 컴포넌트 구조

#### 4.2.1 SmartGuideOverlay

```typescript
// features/editFeatures/ui/player/ui/_component/SmartGuideOverlay/ui/SmartGuideOverlay.tsx

interface SmartGuideOverlayProps {
  // Player 컴포넌트에서 전달받을 props (없음)
}

/**
 * Player 내부에 렌더링되는 가이드라인 오버레이
 * - 절대 위치 (absolute) 레이아웃
 * - pointer-events: none (클릭 이벤트 통과)
 * - Composition 좌표계 기준으로 가이드라인 렌더링
 */
export default function SmartGuideOverlay() {
  const { guides, isEnabled } = useSmartGuideStore();
  const { COMPOSITION_WIDTH, COMPOSITION_HEIGHT, PLAYER_DISPLAY_WIDTH } = PLAYER_CONFIG;

  if (!isEnabled || guides.length === 0) return null;

  // Composition → Display 변환 비율
  const scaleX = PLAYER_DISPLAY_WIDTH / COMPOSITION_WIDTH;
  const scaleY = PLAYER_DISPLAY_HEIGHT / COMPOSITION_HEIGHT;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    >
      {guides.map((guide) => (
        <div
          key={guide.id}
          style={{
            position: 'absolute',
            background: '#9370DB',
            opacity: 0.9,
            boxShadow: '0 0 0 1px rgba(147,112,219,0.6)',
            ...(guide.type === 'vertical'
              ? {
                  left: `${guide.position * scaleX}px`,
                  top: 0,
                  width: '1px',
                  height: '100%',
                }
              : {
                  top: `${guide.position * scaleY}px`,
                  left: 0,
                  width: '100%',
                  height: '1px',
                }),
          }}
        />
      ))}
    </div>
  );
}
```

#### 4.2.2 Player 컴포넌트 수정

```diff
// features/editFeatures/ui/player/ui/Player.tsx

+ import SmartGuideOverlay from "./_component/SmartGuideOverlay/ui/SmartGuideOverlay";

  return (
-   <RemotionPlayer
-     ref={playerController.playerRef}
-     component={Composition}
-     // ... props
-   />
+   <div style={{ position: 'relative' }}>
+     <RemotionPlayer
+       ref={playerController.playerRef}
+       component={Composition}
+       // ... props
+     />
+     <SmartGuideOverlay />
+   </div>
  );
```

### 4.3 드래그 로직 확장 (useDragText)

#### 4.3.1 정렬 감지 유틸리티

```typescript
// features/editFeatures/ui/player/ui/_component/Composition/ui/_component/SequenceItem/ui/_component/DraggableText/model/alignmentDetector.ts

interface ElementBounds {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

interface AlignmentResult {
  guides: Guide[];
}

export class AlignmentDetector {
  private threshold: number;

  constructor(threshold: number = 5) {
    this.threshold = threshold;
  }

  /**
   * 드래그 중인 요소의 정렬 가이드 계산
   */
  detectAlignment(
    draggedElement: TextElement,
    allElements: TextElement[],
    canvasWidth: number,
    canvasHeight: number
  ): AlignmentResult {
    const guides: Guide[] = [];
    const draggedBounds = this.calculateBounds(draggedElement);

    // 캔버스 중앙 정렬
    guides.push(...this.detectCanvasAlignment(draggedBounds, canvasWidth, canvasHeight));

    // 다른 요소와의 정렬
    for (const otherElement of allElements) {
      if (otherElement.id === draggedElement.id) continue;
      const otherBounds = this.calculateBounds(otherElement);
      guides.push(...this.detectElementAlignment(draggedBounds, otherBounds));
    }

    return { guides: this.deduplicateGuides(guides) };
  }

  private calculateBounds(element: TextElement): ElementBounds {
    return {
      id: element.id,
      left: element.positionX,
      right: element.positionX + element.width,
      top: element.positionY,
      bottom: element.positionY + element.height,
      centerX: element.positionX + element.width / 2,
      centerY: element.positionY + element.height / 2,
      width: element.width,
      height: element.height,
    };
  }

  private detectCanvasAlignment(
    bounds: ElementBounds,
    canvasWidth: number,
    canvasHeight: number
  ): Guide[] {
    const guides: Guide[] = [];
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    // 수평 중심 정렬
    if (Math.abs(bounds.centerX - canvasCenterX) <= this.threshold) {
      guides.push({
        id: `canvas-center-x`,
        type: 'vertical',
        position: canvasCenterX,
        alignmentType: 'canvas-center',
      });
    }

    // 수직 중심 정렬
    if (Math.abs(bounds.centerY - canvasCenterY) <= this.threshold) {
      guides.push({
        id: `canvas-center-y`,
        type: 'horizontal',
        position: canvasCenterY,
        alignmentType: 'canvas-center',
      });
    }

    return guides;
  }

  private detectElementAlignment(
    draggedBounds: ElementBounds,
    otherBounds: ElementBounds
  ): Guide[] {
    const guides: Guide[] = [];

    // 수직 가이드 (좌측, 우측, 중심)
    if (Math.abs(draggedBounds.left - otherBounds.left) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-left`,
        type: 'vertical',
        position: otherBounds.left,
        alignmentType: 'element-left',
      });
    }

    if (Math.abs(draggedBounds.right - otherBounds.right) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-right`,
        type: 'vertical',
        position: otherBounds.right,
        alignmentType: 'element-right',
      });
    }

    if (Math.abs(draggedBounds.centerX - otherBounds.centerX) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-center-x`,
        type: 'vertical',
        position: otherBounds.centerX,
        alignmentType: 'element-center',
      });
    }

    // 수평 가이드 (상단, 하단, 중심)
    if (Math.abs(draggedBounds.top - otherBounds.top) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-top`,
        type: 'horizontal',
        position: otherBounds.top,
        alignmentType: 'element-top',
      });
    }

    if (Math.abs(draggedBounds.bottom - otherBounds.bottom) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-bottom`,
        type: 'horizontal',
        position: otherBounds.bottom,
        alignmentType: 'element-bottom',
      });
    }

    if (Math.abs(draggedBounds.centerY - otherBounds.centerY) <= this.threshold) {
      guides.push({
        id: `${otherBounds.id}-center-y`,
        type: 'horizontal',
        position: otherBounds.centerY,
        alignmentType: 'element-center',
      });
    }

    return guides;
  }

  private deduplicateGuides(guides: Guide[]): Guide[] {
    const uniqueGuides = new Map<string, Guide>();
    for (const guide of guides) {
      uniqueGuides.set(guide.id, guide);
    }
    return Array.from(uniqueGuides.values());
  }
}
```

#### 4.3.2 useDragText 수정

```diff
// features/editFeatures/ui/player/ui/_component/Composition/ui/_component/SequenceItem/ui/_component/DraggableText/model/useDragText.ts

+ import { useSmartGuideStore } from "@/features/editFeatures/model/store/useSmartGuideStore";
+ import { AlignmentDetector } from "./alignmentDetector";
+ import { PLAYER_CONFIG } from "@/features/editFeatures/ui/player/config/playerConfig";

  export const useDragText = ({
    elementId,
    currentCanvasX,
    currentCanvasY,
    isPlaying,
    isEditing,
  }: UseDragTextProps) => {
    const { updateTextElement } = useMediaStore();
+   const { setGuides, clearGuides } = useSmartGuideStore();
+   const allTextElements = useMediaStore((state) => state.media.textElement);
    const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
+   const alignmentDetector = useMemo(() => new AlignmentDetector(5), []);

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!dragState.isDragging || isEditing) return;

        const deltaX = e.clientX - dragState.initialClientX;
        const deltaY = e.clientY - dragState.initialClientY;

        const newPosX = dragState.initialCanvasX + deltaX * PLAYER_CONFIG.SCALE_X;
        const newPosY = dragState.initialCanvasY + deltaY * PLAYER_CONFIG.SCALE_Y;

+       // 현재 드래그 중인 요소의 위치 업데이트 (임시)
+       const currentElement = allTextElements.find((el) => el.id === elementId);
+       if (currentElement) {
+         const draggedElement = {
+           ...currentElement,
+           positionX: newPosX,
+           positionY: newPosY,
+         };
+
+         // 정렬 감지 및 가이드라인 업데이트
+         const { guides } = alignmentDetector.detectAlignment(
+           draggedElement,
+           allTextElements,
+           PLAYER_CONFIG.COMPOSITION_WIDTH,
+           PLAYER_CONFIG.COMPOSITION_HEIGHT
+         );
+         setGuides(guides);
+       }

        updateTextElement(elementId, {
          positionX: newPosX,
          positionY: newPosY,
        });
      },
-     [dragState, updateTextElement, elementId, isEditing]
+     [dragState, updateTextElement, elementId, isEditing, allTextElements, alignmentDetector, setGuides]
    );

    const handleMouseUp = useCallback(() => {
      setDragState(INITIAL_DRAG_STATE);
+     clearGuides();
-   }, []);
+   }, [clearGuides]);

    // ... rest of the code
  };
```

---

## 5. 구현 계획

### 5.1 구현 순서

**Phase 1: 기반 구조 (1-2일)**
1. ✅ useSmartGuideStore 생성
2. ✅ Guide 타입 정의
3. ✅ SmartGuideOverlay 컴포넌트 생성 (더미 가이드)
4. ✅ Player에 SmartGuideOverlay 통합

**Phase 2: 정렬 감지 로직 (2-3일)**
1. ✅ AlignmentDetector 클래스 구현
2. ✅ 캔버스 중앙 정렬 감지
3. ✅ 요소 간 정렬 감지 (좌/우/중심, 상/하/중심)
4. ✅ 유닛 테스트 작성

**Phase 3: 드래그 통합 (1-2일)**
1. ✅ useDragText에 정렬 감지 추가
2. ✅ 드래그 중 가이드라인 업데이트
3. ✅ 드래그 종료 시 가이드라인 제거
4. ✅ 성능 최적화 (throttle/debounce)

**Phase 4: 테스트 및 개선 (1-2일)**
1. ✅ 시각적 테스트 (다양한 시나리오)
2. ✅ 버그 수정 및 엣지 케이스 처리
3. ✅ 코드 리뷰 및 리팩토링

**총 예상 기간**: 5-9일

### 5.2 체크리스트

#### 코드 구현
- [ ] useSmartGuideStore 생성
- [ ] SmartGuideOverlay 컴포넌트 구현
- [ ] AlignmentDetector 클래스 구현
- [ ] useDragText 수정
- [ ] Player 컴포넌트 수정

#### 테스트
- [ ] AlignmentDetector 유닛 테스트
- [ ] 가이드라인 표시 테스트 (캔버스 중앙)
- [ ] 가이드라인 표시 테스트 (요소 정렬)
- [ ] 성능 테스트 (다수 요소)

#### 문서화
- [ ] 코드 주석 추가
- [ ] README 업데이트 (기능 설명)
- [ ] 사용자 가이드 작성 (선택사항)

---

## 6. 성능 고려사항

### 6.1 병목 지점

**문제**: `handleMouseMove` 이벤트가 초당 60-120회 발생하여 정렬 감지 계산이 과도하게 실행될 수 있음

**영향**:
- CPU 사용량 증가
- 드래그 지연 (lag)
- 가이드라인 깜빡임

### 6.2 최적화 전략

#### 6.2.1 Throttle 적용

```typescript
import { throttle } from "lodash-es";

const throttledUpdateGuides = useMemo(
  () =>
    throttle((guides: Guide[]) => {
      setGuides(guides);
    }, 16), // 약 60fps
  [setGuides]
);
```

#### 6.2.2 요소 필터링

```typescript
// 화면 밖 요소 제외
const visibleElements = allTextElements.filter((el) => {
  return (
    el.positionX + el.width > 0 &&
    el.positionX < PLAYER_CONFIG.COMPOSITION_WIDTH &&
    el.positionY + el.height > 0 &&
    el.positionY < PLAYER_CONFIG.COMPOSITION_HEIGHT
  );
});
```

#### 6.2.3 메모이제이션

```typescript
const alignmentDetector = useMemo(() => new AlignmentDetector(5), []);
```

### 6.3 성능 목표

- **드래그 응답 시간**: < 16ms (60fps)
- **정렬 감지 계산**: < 5ms
- **가이드라인 렌더링**: < 8ms
- **메모리 사용량**: < 10MB 증가

---

## 7. 향후 확장

### 7.1 스냅(Snap) 기능

**현재 명세는 가이드라인 표시만 구현하지만, 향후 스냅 기능 추가를 대비한 설계**

#### 확장 포인트

**useSmartGuideStore 확장**:
```typescript
interface SmartGuideState {
  guides: Guide[];
  isEnabled: boolean;
  isSnapEnabled: boolean; // 스냅 기능 활성화 여부
  snapThreshold: number;   // 스냅 감도 (px)
}
```

**AlignmentDetector 확장**:
```typescript
interface AlignmentResult {
  guides: Guide[];
  snapPosition?: { x: number; y: number }; // 스냅 대상 좌표
}
```

**useDragText 수정**:
```typescript
if (isSnapEnabled && snapPosition) {
  // 스냅된 좌표로 덮어쓰기
  newPosX = snapPosition.x;
  newPosY = snapPosition.y;
}
```

### 7.2 가이드라인 커스터마이징

**설정 UI**:
- 가이드라인 색상 변경
- 투명도 조절
- 허용 오차 조정

**구현 방향**:
```typescript
interface SmartGuideSettings {
  color: string;
  opacity: number;
  threshold: number;
}

// useSmartGuideStore에 settings 추가
```

### 7.3 다른 요소 타입 지원

**확장 대상**:
- 이미지 요소 (MediaElement type="image")
- 비디오 요소 (MediaElement type="video")

**구현 방향**:
```typescript
// alignmentDetector.ts
detectAlignment(
  draggedElement: TextElement | MediaElement,
  allElements: (TextElement | MediaElement)[],
  // ...
)
```

### 7.4 고급 정렬 감지

**추가 정렬 타입**:
- 등간격 정렬 (균등 분배)
- 그리드 정렬 (8px, 16px 단위)
- 가이드라인 기반 정렬 (사용자 정의 가이드)

---

## 8. 참고 자료

### 8.1 파일 경로

**State Management**:
- `src/features/editFeatures/model/store/useSmartGuideStore.ts` (신규)
- `src/features/editFeatures/model/store/useSnapGuideStore.ts` (참고용)

**Components**:
- `src/features/editFeatures/ui/player/ui/_component/SmartGuideOverlay/ui/SmartGuideOverlay.tsx` (신규)
- `src/features/editFeatures/ui/player/ui/Player.tsx` (수정)
- `src/features/editFeatures/ui/player/ui/_component/Composition/ui/_component/SequenceItem/ui/_component/DraggableText/ui/DraggableText.tsx` (참고)

**Logic**:
- `src/features/editFeatures/ui/player/ui/_component/Composition/ui/_component/SequenceItem/ui/_component/DraggableText/model/useDragText.ts` (수정)
- `src/features/editFeatures/ui/player/ui/_component/Composition/ui/_component/SequenceItem/ui/_component/DraggableText/model/alignmentDetector.ts` (신규)

**Config**:
- `src/features/editFeatures/ui/player/config/playerConfig.ts`

### 8.2 기존 코드 참고

- `useSnapGuideStore` → SmartGuide의 상태 관리 패턴 참고
- `SnapGuideIndicator` → 가이드라인 렌더링 방식 참고
- `useDragText` → 드래그 로직 및 좌표 변환 참고

### 8.3 외부 라이브러리

**사용 가능**:
- `lodash-es` (throttle, debounce)
- `zustand` (상태 관리)

**사용 불가** (프로젝트 미포함):
- React DnD
- 기타 드래그 앤 드롭 라이브러리

---

## 9. FAQ

### Q1: 왜 스냅 기능을 포함하지 않나요?

**A**: 본 명세는 단계적 구현을 목표로 하며, 먼저 사용자에게 시각적 피드백을 제공한 후 스냅 기능을 추가하는 것이 안전합니다. 또한, 스냅 기능은 사용자 선호도에 따라 활성화/비활성화할 수 있어야 하므로 별도 단계로 분리했습니다.

### Q2: 허용 오차 5px는 어떻게 결정되었나요?

**A**:
- Composition 좌표계 기준 5px = Display 좌표계 약 1px
- 너무 작으면 정렬 감지가 어렵고, 너무 크면 부정확함
- 기존 디자인 도구(Figma, Sketch)의 기본값 참고

### Q3: 성능 문제가 발생하면 어떻게 하나요?

**A**:
1. Throttle 주기 조정 (16ms → 32ms)
2. 요소 필터링 강화 (화면 밖 제외)
3. 가이드라인 수 제한 (최대 4개)
4. Web Worker로 정렬 계산 오프로드 (고급)

### Q4: 가이드라인이 너무 많이 표시되면?

**A**:
- 우선순위 정렬: 캔버스 중앙 > 요소 중심 > 요소 경계
- 가이드라인 수 제한 (예: 최대 4개)
- 중복 제거 로직 강화

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 사항 |
|------|------|-----------|
| 1.0.0 | 2025-10-02 | 초안 작성 |

---

## 부록 A: 좌표 시스템 다이어그램

```
[Composition 좌표계]             [Display 좌표계]
┌─────────────────┐             ┌──────┐
│                 │             │      │
│   1080 x 1920   │  ────────>  │ 225  │
│                 │   SCALE_X   │  x   │
│   (실제 해상도)   │   SCALE_Y   │ 400  │
│                 │             │      │
└─────────────────┘             └──────┘
      (px)                        (px)
```

## 부록 B: 정렬 타입 시각화

```
수직 가이드 (Vertical Guide)
│
│   [Text A]        [Text B]
│      │               │
└──────┴───────────────┴────── (좌측 경계 정렬)

        │               │
   [Text A]        [Text B]
        │               │
────────┴───────────────┴────── (중심 정렬)

                        │
           [Text A] [Text B]
                        │
────────────────────────┴────── (우측 경계 정렬)


수평 가이드 (Horizontal Guide)
────  [Text A]  ────  [Text B]  ──── (상단 경계 정렬)

        [Text A]
        ─────────────────────────── (중심 정렬)
                [Text B]

                [Text A]
────────────────────────────────── (하단 경계 정렬)
        [Text B]
```

---

**문서 끝**
