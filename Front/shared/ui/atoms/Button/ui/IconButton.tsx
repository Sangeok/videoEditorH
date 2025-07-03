interface IconButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
}

export default function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <button
      className="p-2 hover:bg-white/12 rounded-lg cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}
