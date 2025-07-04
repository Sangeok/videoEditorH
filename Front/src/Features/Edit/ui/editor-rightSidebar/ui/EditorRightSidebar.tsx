"use client";

import useSideButtonStore from "@/src/Features/Edit/model/store/useSideButtonStore";
import TextEditRightSide from "./_component/TextEditRightSide";
import CaptionEditRightSide from "./_component/CaptionEditRightSide";
import VideoEditRightSide from "./_component/VideoEditRightSide";
import ImageEditRightSide from "./_component/ImageEditRightSide";
import MusicEditRightSide from "./_component/MusicEditRightSide";

export default function EditorRightSidebar() {
  const activeSideButton = useSideButtonStore(
    (state) => state.activeSideButton
  );

  const renderSubSideBar = () => {
    switch (activeSideButton) {
      case "Text":
        return <TextEditRightSide />;
      case "Video":
        return <VideoEditRightSide />;
      case "Captions":
        return <CaptionEditRightSide />;
      case "Image":
        return <ImageEditRightSide />;
      case "Music":
        return <MusicEditRightSide />;
      default:
        return null;
    }
  };
  return (
    <aside className="w-50 h-full bg-black border-l border-white/20 overflow-y-auto">
      <div className="flex flex-col h-full items-center pt-4">
        {renderSubSideBar()}
      </div>
    </aside>
  );
}
