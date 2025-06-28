interface ButtonProps {
  children: React.ReactNode;
  variant?: "dark" | "light";
  className?: string;
  onClick?: () => void;
}

export default function Button({ children, variant = "light", className = "", onClick }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md cursor-pointer transition-colors duration-200";

  const variantStyles = {
    dark: "bg-black text-white dark-button-hover dark-border",
    light: "bg-white text-black hover:bg-gray-100 border border-gray-200",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button className={combinedClassName} onClick={onClick}>
      {children}
    </button>
  );
}
