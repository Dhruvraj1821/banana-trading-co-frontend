import { useUser } from "../context/UserContext";

export function UserBadge() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="font-data text-xs text-text-dim mb-4">
      {user.username} · <span className="text-banana">${user.currency_balance.toFixed(2)}</span>
    </div>
  );
}