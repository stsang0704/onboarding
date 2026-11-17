import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary: "bg-ink text-cream hover:bg-[#3c3329]",
  secondary: "border border-line bg-white text-ink hover:bg-[#fffaf4]",
  ghost: "text-muted hover:text-ink",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
