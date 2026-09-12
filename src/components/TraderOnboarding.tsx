import { useState, type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import { PixelPanel } from "./PixelPanel";

export function TraderOnboarding() {
  const { createTrader, error } = useUser();
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setSubmitting(true);
    try {
      await createTrader(username.trim());
    } catch {
      // error is already captured in context and shown below
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <PixelPanel className="max-w-sm w-full">
        <p className="font-pixel text-banana text-sm mb-4">Welcome, trader</p>
        <form onSubmit={handleSubmit}>
          <input
            className="font-data w-full bg-bg border-2 border-border p-2 mb-3 text-text"
            placeholder="choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="font-data text-loss text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="font-pixel text-xs bg-banana text-bg border-2 border-border px-4 py-2 w-full disabled:opacity-50"
          >
            {submitting ? "creating..." : "start trading"}
          </button>
        </form>
      </PixelPanel>
    </div>
  );
}