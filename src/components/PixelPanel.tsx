import type { ReactNode } from "react";

interface PixelPanelProps {
  children: ReactNode;
  className?: string;
}

export function PixelPanel({ children, className = "" }: PixelPanelProps) {
  return (
    <div
      className={`bg-panel border-4 border-border p-4 ${className}`}
      style={{ boxShadow: "6px 6px 0px var(--color-border)" }}
    >
      {children}
    </div>
  );
}