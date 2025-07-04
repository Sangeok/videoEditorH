import IconButton from "@/src/shared/ui/atoms/Button/ui/IconButton";
import Slider from "@/src/shared/ui/atoms/Slider/ui/Slider";
import { Copy, Split, Trash } from "lucide-react";

const FooterItems = [
  {
    label: "Delete",
    icon: <Trash size={18} />,
  },
  {
    label: "Split",
    icon: <Split size={18} />,
  },
  {
    label: "Clone",
    icon: <Copy size={18} />,
  },
];

export default function EditorFooter() {
  return (
    <footer className="bg-black border-t border-white/20 p-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {FooterItems.map((item) => (
            <IconButton key={item.label}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm text-gray-400">{item.label}</span>
              </div>
            </IconButton>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-800 rounded">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-800 rounded bg-gray-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-800 rounded">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono">00:00</span>
            <span className="text-gray-400">/</span>
            <span className="font-mono text-gray-400">00:01</span>
          </div>

          <Slider />

          {/* <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </button>
            <input
              type="range"
              className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              defaultValue="50"
            />
            <button className="p-2 hover:bg-gray-800 rounded">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="flex items-center text-xs text-gray-400 mb-2">
          <div className="w-1 h-4 bg-white absolute left-0 top-0"></div>
          <span className="ml-4">5s</span>
          <span className="ml-16">10s</span>
          <span className="ml-16">15s</span>
          <span className="ml-16">20s</span>
        </div>
        <div className="h-16 bg-gray-800 rounded border border-gray-700"></div>
      </div>
    </footer>
  );
}
