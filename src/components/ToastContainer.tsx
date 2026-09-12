import { useToast } from "../context/ToastContext";

const typeStyles: Record<string, string> = {
  success: "border-l-gain",
  error: "border-l-loss",
  info: "border-l-banana",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`font-data text-xs bg-panel border-2 border-border border-l-4 ${typeStyles[toast.type]} px-3 py-2 cursor-pointer max-w-xs`}
          style={{ boxShadow: "4px 4px 0px var(--color-border)" }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}