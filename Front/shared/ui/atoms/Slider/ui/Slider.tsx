import { ZoomIn, ZoomOut } from "lucide-react";

export default function Slider() {
  return (
    <div className="relative flex-1 mx-4 flex items-center gap-2">
      <button
        // onClick={handleMinusClick}
        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
      >
        <ZoomOut size={18} />
      </button>
      <input
        type="range"
        min="0"
        max="100"
        // value={value}
        // onChange={handleChange}
        className="slider w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none"
        style={{ width: "100px" }}
      />
      <button
        // onClick={handleMinusClick}
        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
      >
        <ZoomIn size={18} />
      </button>
    </div>
  );
}
