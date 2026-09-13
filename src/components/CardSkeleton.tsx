import { PixelPanel } from "./PixelPanel";

export function CardSkeleton() {
  return (
    <PixelPanel>
      <div className="h-4 w-2/3 bg-border animate-pulse mb-3" />
      <div className="h-6 w-1/2 bg-border animate-pulse mb-2" />
      <div className="h-10 w-full bg-border animate-pulse opacity-50" />
    </PixelPanel>
  );
}