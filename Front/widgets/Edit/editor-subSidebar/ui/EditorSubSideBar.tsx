"use client";

import useSideButtonStore from "@/entities/sideButton/useSideButtonStore";
import TextEditSubSide from "./_component/TextEditSubSide";
import VideoEditSubSide from "./_component/VideoEditSubSide";
import CaptionsEditSubSide from "./_component/CaptionsEditSubSide";
import MusicEditSubSide from "./_component/MusiceEditSubSide";
import ImageEditSubSide from "./_component/ImageEditSubSide";

export default function EditorSubSideBar() {
  const activeSideButton = useSideButtonStore(
    (state) => state.activeSideButton
  );

  const renderSubSideBar = () => {
    switch (activeSideButton) {
      case "Text":
        return <TextEditSubSide />;
      case "Video":
        return <VideoEditSubSide />;
      case "Captions":
        return <CaptionsEditSubSide />;
      case "Image":
        return <ImageEditSubSide />;
      case "Music":
        return <MusicEditSubSide />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 h-full bg-black border-r border-white/20 overflow-y-auto">
      <div className="flex flex-col h-full w-full items-center pt-4">
        {renderSubSideBar()}
      </div>
    </aside>
  );
}
