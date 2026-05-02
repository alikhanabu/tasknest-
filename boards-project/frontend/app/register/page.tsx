"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.message === "Email already in use"
          ? "Этот email уже занят"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          <span className="font-bold text-xl" style={{ color: "var(--text)" }}>
            TaskNest
          </span>
        </div>
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--text)" }}
        >
          Регистрация
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>
          Создай аккаунт бесплатно
        </p>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm mb-1.5"
              style={{ color: "var(--text2)" }}
            >
              Имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                backgroundColor: "var(--bg2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              placeholder="Твоё имя"
            />
          </div>
          <div>
            <label
              className="block text-sm mb-1.5"
              style={{ color: "var(--text2)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                backgroundColor: "var(--bg2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              className="block text-sm mb-1.5"
              style={{ color: "var(--text2)" }}
            >
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                backgroundColor: "var(--bg2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
              placeholder="мин. 6 символов"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-xl py-3 text-sm transition"
          >
            {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>
        <p
          className="text-sm text-center mt-6"
          style={{ color: "var(--text2)" }}
        >
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 transition"
          >
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
