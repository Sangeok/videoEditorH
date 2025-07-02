import { ButtonVariants } from "../lib/variants";

interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  variant?: "dark" | "light";
  size?: "sm" | "md";
}

export default function Button({
  children,
  className,
  variant = "dark",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button className={ButtonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
