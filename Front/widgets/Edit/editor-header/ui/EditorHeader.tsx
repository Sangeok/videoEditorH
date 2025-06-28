"use client";

import { useRouter } from "next/navigation";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { Download, Menu, MoveLeft, Share2 } from "lucide-react";
import { useState } from "react";
import Dropdown from "@/shared/ui/atoms/Dropdown/ui/Dropdown";
import { MenuItem } from "../constants/MenuItem";

export default function EditorHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  const HeaderLeftButton = [
    {
      icon: <Menu />,
      label: "Menu",
      children: <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} dropdownItems={MenuItem} />,
      onClick: () => {
        setIsOpen(!isOpen);
      },
    },
    {
      icon: <MoveLeft />,
      label: "Previous",
      onClick: () => {
        router.back();
      },
    },
  ];

  const HeaderRightButton = [
    {
      icon: <Share2 size={16} />,
      label: "Share",
      onClick: () => {},
    },
    {
      icon: <Download size={16} />,
      label: "Export",
      onClick: () => {},
    },
  ];

  return (
    <header className="col-span-2 bg-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {HeaderLeftButton.map((button) => (
            <button
              className="p-2 hover:bg-white/12 rounded cursor-pointer"
              key={button.label}
              onClick={button.onClick}
            >
              {button.icon}
              {button.children}
            </button>
          ))}
        </div>

        <h1 className="font-semibold">Untitled video</h1>

        <div className="flex items-center gap-2">
          {HeaderRightButton.map((button) => (
            <Button variant="dark" key={button.label}>
              <div className="flex items-center gap-2">
                {button.icon}
                {button.label}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
