import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { User } from "../types/api";

interface UserContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  createTrader: (username: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);
const STORAGE_KEY = "banana_user_id";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshUser() {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (!storedId) {
      setLoading(false);
      return;
    }
    try {
      setUser(await api.getUser(storedId));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function createTrader(username: string) {
    setError(null);
    try {
      const created = await api.createUser(username);
      localStorage.setItem(STORAGE_KEY, created.id);
      setUser(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trader");
      throw err;
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, error, createTrader, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}