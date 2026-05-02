"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    apiFetch<User>("/auth/me")
      .then(setUser)
      .catch(() => {});
  }, []);

  async function logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    router.replace("/login");
  }

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg)",
      }}
      className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
    >
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--text)" }}>
            TaskNest
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-2 rounded-lg border text-sm transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text2)" }}
          >
            {theme === "dark" ? "☀️ Светлая" : "🌙 Тёмная"}
          </button>
        )}
        {user && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: "var(--bg2)" }}
          >
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                {user.name}
              </p>
              <p className="text-xs" style={{ color: "var(--text2)" }}>
                {user.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="text-sm px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition"
        >
          Выйти
        </button>
      </div>
    </nav>
  );
}
