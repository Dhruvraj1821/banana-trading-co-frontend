export function PixelSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 font-data text-text-dim text-xs">
      <span className="inline-block w-3 h-3 bg-banana animate-pulse" />
      <span className="inline-block w-3 h-3 bg-banana animate-pulse [animation-delay:150ms]" />
      <span className="inline-block w-3 h-3 bg-banana animate-pulse [animation-delay:300ms]" />
      {label && <span>{label}</span>}
    </div>
  );
}