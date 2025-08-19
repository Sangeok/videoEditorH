// remotion/compositions/VideoEditor.tsx
import {
  AbsoluteFill,
  getInputProps,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  Audio,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import React from 'react';

interface TextElement {
  id: string;
  type: string;
  startTime: number;
  endTime: number;
  duration: number;
  text: string;
  positionX: number;
  positionY: number;
  fontSize: number;
  animation: string;
  textColor: string;
  backgroundColor: string;
  font: string;
  width: number;
  height: number;
  maxWidth?: string;
  whiteSpace?: string;
}

interface MediaElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'video' | 'image' | 'audio';
  url?: string;
  width?: number;
  height?: number;
  opacity?: number;
  rotate?: string;
  visibility?: 'visible' | 'hidden';
  top?: number | string;
  left?: number | string;
  fadeIn?: boolean;
  fadeOut?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  volume?: number;
  speed?: number;
}

interface AudioElement {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'audio';
  url: string;
  volume: number;
  speed: number;
}

interface VideoEditorProps {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: TextElement[];
    mediaElement: MediaElement[];
    audioElement: AudioElement[];
  };
}

const TextSequence: React.FC<{ textElement: TextElement; fps: number }> = ({
  textElement,
  fps,
}) => {
  const fromFrame = Math.floor(textElement.startTime * fps);
  const durationInFrames = Math.floor(
    (textElement.endTime - textElement.startTime) * fps,
  );

  return (
    <Sequence
      key={textElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Text: ${textElement.text.substring(0, 20)}...`}
    >
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: `${textElement.positionX}px`,
            top: `${textElement.positionY}px`,
            width: 'fit-content',
            height: 'auto',
            maxWidth: textElement?.maxWidth ? textElement?.maxWidth : '',
            display: 'inline-block',
            padding: '10px',
            whiteSpace: textElement?.whiteSpace
              ? textElement?.whiteSpace
              : 'nowrap',
            borderRadius: '4px',
            boxSizing: 'border-box',
            textAlign: 'center',
            fontSize: `${textElement.fontSize}px`,
            fontFamily: textElement.font,
            color: textElement.textColor,
            backgroundColor: textElement.backgroundColor,
          }}
        >
          {textElement.text}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

const ImageSequence: React.FC<{ mediaElement: MediaElement; fps: number }> = ({
  mediaElement,
  fps,
}) => {
  const fromFrame = Math.floor(mediaElement.startTime * fps);
  const durationInFrames = Math.floor(
    (mediaElement.endTime - mediaElement.startTime) * fps,
  );

  const ImageWithFade = () => {
    const frame = useCurrentFrame();
    let opacity = 1;

    if (mediaElement.fadeIn) {
      const fadeInFrames = Math.floor(
        (mediaElement.fadeInDuration || 0.5) * fps,
      );
      opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    if (mediaElement.fadeOut) {
      const fadeOutFrames = Math.floor(
        (mediaElement.fadeOutDuration || 0.5) * fps,
      );
      const fadeOutStartFrame = durationInFrames - fadeOutFrames;
      const fadeOutOpacity = interpolate(
        frame,
        [fadeOutStartFrame, durationInFrames],
        [1, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      );
      opacity = Math.min(opacity, fadeOutOpacity);
    }

    return (
      <AbsoluteFill
        style={{
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
        }}
      >
        <Img
          style={{
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          src={mediaElement.url || ''}
          alt={'image'}
        />
      </AbsoluteFill>
    );
  };

  return (
    <Sequence
      key={mediaElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Image: ${mediaElement.id}`}
    >
      <ImageWithFade />
    </Sequence>
  );
};

const VideoSequence: React.FC<{ mediaElement: MediaElement; fps: number }> = ({
  mediaElement,
  fps,
}) => {
  const fromFrame = Math.floor(mediaElement.startTime * fps);
  const durationInFrames = Math.floor(
    (mediaElement.endTime - mediaElement.startTime) * fps,
  );

  return (
    <Sequence
      key={mediaElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Video: ${mediaElement.id}`}
    >
      <OffthreadVideo
        src={mediaElement.url || ''}
        volume={mediaElement.volume || 100}
        style={{
          pointerEvents: 'none',
          top: 0,
          left: 0,
          width: mediaElement.width || '100%',
          height: mediaElement.height || 'auto',
          position: 'absolute',
        }}
      />
    </Sequence>
  );
};

const AudioSequence: React.FC<{ audioElement: AudioElement; fps: number }> = ({
  audioElement,
  fps,
}) => {
  const fromFrame = Math.floor(audioElement.startTime * fps);
  const durationInFrames = Math.floor(
    (audioElement.endTime - audioElement.startTime) * fps,
  );

  return (
    <Sequence
      key={audioElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Audio: ${audioElement.id}`}
    >
      <AbsoluteFill>
        <Audio
          src={audioElement.url || ''}
          volume={audioElement.volume || 100}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

export const VideoEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inputProps = getInputProps() as unknown as VideoEditorProps | undefined;

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

  console.log(`VideoEditor currentTime: ${currentTime}s, elements:`, {
    text: inputProps.media?.textElement?.length || 0,
    media: inputProps.media?.mediaElement?.length || 0,
    audio: inputProps.media?.audioElement?.length || 0,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 텍스트 요소 렌더링 */}
      {inputProps.media?.textElement?.map((textElement) => (
        <TextSequence
          key={textElement.id}
          textElement={textElement}
          fps={fps}
        />
      ))}

      {/* 미디어 요소 렌더링 */}
      {inputProps.media?.mediaElement?.map((mediaElement) => {
        if (mediaElement.type === 'image') {
          return (
            <ImageSequence
              key={mediaElement.id}
              mediaElement={mediaElement}
              fps={fps}
            />
          );
        }
        if (mediaElement.type === 'video') {
          return (
            <VideoSequence
              key={mediaElement.id}
              mediaElement={mediaElement}
              fps={fps}
            />
          );
        }
        return null;
      })}

      {/* 오디오 요소 렌더링 */}
      {inputProps.media?.audioElement?.map((audioElement) => (
        <AudioSequence
          key={audioElement.id}
          audioElement={audioElement}
          fps={fps}
        />
      ))}

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
