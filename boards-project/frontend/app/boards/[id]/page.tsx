"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Navbar } from "../../components/Navbar";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  user: { id: string; name: string };
}
interface Board {
  id: string;
  title: string;
  tasks: Task[];
}
interface User {
  id: string;
  name: string;
  role: string;
}

const STATUSES = [
  { key: "todo", label: "📋 To Do", color: "#6366f1" },
  { key: "in_progress", label: "⚡ In Progress", color: "#f59e0b" },
  { key: "done", label: "✅ Done", color: "#10b981" },
];

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch<Board>(`/boards/${id}`), apiFetch<User>("/auth/me")])
      .then(([b, u]) => {
        setBoard(b);
        setUser(u);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [id]);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const task = await apiFetch<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          boardId: id,
          title: newTitle.trim(),
          description: newDesc.trim() || undefined,
        }),
      });
      setBoard((prev) =>
        prev ? { ...prev, tasks: [...prev.tasks, task] } : prev,
      );
      setNewTitle("");
      setNewDesc("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function updateStatus(taskId: string, status: string) {
    try {
      const updated = await apiFetch<Task>(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t)),
            }
          : prev,
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
      setBoard((prev) =>
        prev
          ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }
          : prev,
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  const isAdmin = user?.role === "ADMIN";

  if (loading)
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <Navbar />
        <div
          className="flex items-center justify-center py-40 text-sm"
          style={{ color: "var(--text2)" }}
        >
          Загрузка...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="text-sm px-3 py-2 rounded-lg border transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text2)" }}
          >
            ← Назад
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {board?.title}
          </h1>
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

        <form
          onSubmit={createTask}
          className="rounded-2xl border p-5 mb-8"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-sm font-medium mb-3"
            style={{ color: "var(--text)" }}
          >
            + Новая задача
          </p>
          <div className="flex gap-3 mb-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Название задачи..."
              required
              className="flex-1 rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                backgroundColor: "var(--bg2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            <button
              type="submit"
              disabled={creating || !newTitle.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition"
            >
              {creating ? "..." : "Создать"}
            </button>
          </div>
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Описание (необязательно)..."
            className="w-full rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
            style={{
              backgroundColor: "var(--bg2)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map((col) => {
            const tasks =
              board?.tasks.filter((t) => t.status === col.key) || [];
            return (
              <div key={col.key}>
                <div className="flex items-center gap-2 mb-4">
                  <h2
                    className="font-semibold text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {col.label}
                  </h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: col.color + "20",
                      color: col.color,
                    }}
                  >
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div
                      className="rounded-xl border-2 border-dashed p-6 text-center text-xs"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text2)",
                      }}
                    >
                      Задач нет
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border p-4 group transition hover:shadow-md"
                        style={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                        }}
                      >
                        <p
                          className="font-medium text-sm mb-1"
                          style={{ color: "var(--text)" }}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p
                            className="text-xs mb-2"
                            style={{ color: "var(--text2)" }}
                          >
                            {task.description}
                          </p>
                        )}
                        <p
                          className="text-xs mb-3"
                          style={{ color: "var(--text2)" }}
                        >
                          👤 {task.user.name}
                        </p>
                        {isAdmin && (
                          <div className="flex gap-1 flex-wrap">
                            {STATUSES.filter((s) => s.key !== col.key).map(
                              (s) => (
                                <button
                                  key={s.key}
                                  onClick={() => updateStatus(task.id, s.key)}
                                  className="text-xs px-2 py-1 rounded-lg border transition hover:opacity-80"
                                  style={{
                                    borderColor: s.color + "40",
                                    color: s.color,
                                    backgroundColor: s.color + "10",
                                  }}
                                >
                                  →{" "}
                                  {s.key === "todo"
                                    ? "To Do"
                                    : s.key === "in_progress"
                                      ? "In Progress"
                                      : "Done"}
                                </button>
                              ),
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-xs px-2 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition ml-auto"
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
