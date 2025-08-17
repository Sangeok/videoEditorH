// remotion/compositions/VideoEditor.tsx
import {
  AbsoluteFill,
  getInputProps,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import React from 'react';

interface VideoEditorProps {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: Array<{
      id: string;
      text: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
      color: string;
      fontFamily: string;
      startTime: number;
      endTime: number;
    }>;
    mediaElement: Array<any>;
    audioElement: Array<any>;
  };
}

export const VideoEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inputProps = getInputProps() as unknown as VideoEditorProps | undefined;

  // 로깅 추가
  console.log('VideoEditor frame:', frame, 'fps:', fps);
  console.log('VideoEditor inputProps:', JSON.stringify(inputProps, null, 2));

  if (!inputProps) {
    console.log('VideoEditor: No input data provided');
    return (
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <div
          style={{
            color: 'white',
            fontSize: 24,
            textAlign: 'center',
            paddingTop: '40%',
          }}
        >
          No input data provided
        </div>
      </AbsoluteFill>
    );
  }

  const currentTime = frame / fps;

  // 텍스트 요소 로깅
  console.log(
    `VideoEditor currentTime: ${currentTime}s, textElements:`,
    inputProps.media?.textElement?.length || 0,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 텍스트 요소 렌더링 */}
      {inputProps.media?.textElement?.map((textEl) => {
        // 현재 시간이 텍스트 요소의 표시 시간 범위 내에 있는지 확인
        if (currentTime >= textEl.startTime && currentTime <= textEl.endTime) {
          return (
            <div
              key={textEl.id}
              style={{
                position: 'absolute',
                left: textEl.x,
                top: textEl.y,
                width: textEl.width,
                height: textEl.height,
                fontSize: textEl.fontSize,
                color: textEl.color,
                fontFamily: textEl.fontFamily,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {textEl.text}
            </div>
          );
        }
        return null;
      })}

      {/* 개발 정보 표시 */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          color: 'white',
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        Frame: {frame} | Time: {currentTime.toFixed(2)}s | Project:{' '}
        {inputProps.project?.name}
      </div>
    </AbsoluteFill>
  );
};
