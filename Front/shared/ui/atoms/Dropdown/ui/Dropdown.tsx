import { useRef, useEffect } from "react";

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownItems: any[];
}

export default function Dropdown({ isOpen, setIsOpen, dropdownItems }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-black dark-border z-50 shadow-lg rounded-md overflow-hidden">
          {dropdownItems.map((item) => (
            <div
              onClick={() => setIsOpen(false)}
              key={item.id}
              className="text-white py-2 px-2 cursor-pointer transition-colors duration-200 text-sm"
            >
              <div className="flex gap-2 py-2 px-4 dark-button-hover rounded-md">
                {item.icon}
                {item.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
