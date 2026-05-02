"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Navbar } from "../components/Navbar";

interface Board {
  id: string;
  title: string;
  createdAt: string;
  tasks?: any[];
}
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch<Board[]>("/boards"), apiFetch<User>("/auth/me")])
      .then(([b, u]) => {
        setBoards(b);
        setUser(u);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const board = await apiFetch<Board>("/boards", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setBoards((prev) => [board, ...prev]);
      setTitle("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function deleteBoard(id: string) {
    try {
      await apiFetch(`/boards/${id}`, { method: "DELETE" });
      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text)" }}
          >
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            {boards.length === 0
              ? "Досок пока нет"
              : `${boards.length} ${boards.length === 1 ? "доска" : boards.length < 5 ? "доски" : "досок"}`}
            {user && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-violet-500/20 text-violet-400">
                {user.role}
              </span>
            )}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            {error}{" "}
            <button
              onClick={() => setError("")}
              className="ml-2 opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {isAdmin && (
          <form onSubmit={createBoard} className="flex gap-3 mb-8">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название новой доски..."
              className="flex-1 rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                backgroundColor: "var(--bg2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium rounded-xl px-6 py-3 text-sm transition"
            >
              {creating ? "..." : "+ Создать"}
            </button>
          </form>
        )}

        {loading ? (
          <div
            className="text-center py-20 text-sm"
            style={{ color: "var(--text2)" }}
          >
            Загрузка...
          </div>
        ) : boards.length === 0 ? (
          <div
            className="text-center py-24 border-2 border-dashed rounded-2xl"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-5xl mb-4">📋</p>
            <p
              className="font-semibold text-lg mb-2"
              style={{ color: "var(--text)" }}
            >
              {isAdmin ? "Создай первую доску" : "Досок пока нет"}
            </p>
            <p className="text-sm" style={{ color: "var(--text2)" }}>
              {isAdmin ? "Введи название выше" : "Обратись к администратору"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="rounded-2xl border p-5 flex flex-col gap-4 group transition hover:shadow-lg hover:shadow-violet-500/5 cursor-pointer"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <Link href={`/boards/${board.id}`} className="flex-1">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold mb-3">
                    {board.title[0]?.toUpperCase()}
                  </div>
                  <h2
                    className="font-semibold text-base mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {board.title}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text2)" }}>
                    {new Date(board.createdAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => deleteBoard(board.id)}
                    className="text-xs py-1.5 rounded-lg border border-transparent hover:border-red-500/30 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                    style={{ color: "var(--text2)" }}
                  >
                    🗑 Удалить доску
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
