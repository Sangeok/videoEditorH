"use client";

import { useRouter } from "next/navigation";
import Button from "@/shared/ui/atoms/Button";
import { Download, Menu, MoveLeft, Share2 } from "lucide-react";

export default function EditorHeader() {
  const router = useRouter();

  const HeaderLeftButton = [
    {
      icon: <Menu />,
      label: "메뉴",
      onClick: () => {},
    },
    {
      icon: <MoveLeft />,
      label: "이전",
      onClick: () => {
        router.back();
      },
    },
  ];

  return (
    <header className="col-span-2 bg-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {HeaderLeftButton.map((button) => (
            <button
              className="p-2 hover:bg-gray-800 rounded cursor-pointer"
              key={button.label}
              onClick={button.onClick}
            >
              {button.icon}
            </button>
          ))}
        </div>

        <h1 className="text-lg font-medium">Untitled video</h1>

        <div className="flex items-center gap-2">
          <Button variant="dark">
            <div className="flex items-center gap-2">
              <Share2 size={16} />
              Share
            </div>
          </Button>
          <Button variant="dark">
            <div className="flex items-center gap-2">
              <Download size={16} />
              Export
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
