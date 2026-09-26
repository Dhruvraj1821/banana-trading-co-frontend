import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserContext";

const links = [
  { to: "/", label: "markets" },
  { to: "/portfolio", label: "portfolio" },
  { to: "/leaderboard", label: "leaderboard" },
  { to: "/newspaper", label: "newspaper" },
];

export function NavBar() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <nav className="border-b-4 border-border bg-panel mb-6">
      <div className="max-w-2xl mx-auto px-8 py-3 flex justify-between items-center">
        <div className="flex gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `font-pixel text-xs ${isActive ? "text-banana" : "text-text-dim"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="font-data text-xs text-text-dim">
          {user.username} · <span className="text-banana">${user.currency_balance.toFixed(2)}</span>
        </div>
      </div>
    </nav>
  );
}