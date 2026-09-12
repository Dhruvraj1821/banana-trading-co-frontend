import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="p-8 max-w-2xl mx-auto">{children}</div>;
}