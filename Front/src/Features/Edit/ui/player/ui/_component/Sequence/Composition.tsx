import { useCurrentFrame, useVideoConfig } from "remotion";

export default function Composition() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig(); // fps를 동적으로 가져오기

  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        fontSize: "4em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      Frame: {frame} / FPS: {fps}
    </div>
  );
}
