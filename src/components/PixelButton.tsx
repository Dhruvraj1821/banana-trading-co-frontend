import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "gain" | "loss" | "neutral";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-banana text-bg",
  gain: "bg-gain text-bg",
  loss: "bg-loss text-bg",
  neutral: "bg-bg text-text-dim",
};

export function PixelButton({
  variant = "primary",
  className = "",
  ...props
}: PixelButtonProps) {
  return (
    <button
      {...props}
      className={`font-pixel text-xs border-2 border-border px-4 py-2 transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 ${variantClasses[variant]} ${className}`}
    />
  );
}