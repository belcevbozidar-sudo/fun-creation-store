"use client";

import { useState, useTransition } from "react";
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { adminLoginAction } from "./actions";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await adminLoginAction(null, formData);
      if (res.success) {
        // Refresh page to load server dashboard
        window.location.reload();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-8 rounded-sm border border-ink-line bg-ink-card p-6 shadow-2xl sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ember/10 text-ember">
            <Lock size={28} />
          </div>
          <h2 className="font-display mt-6 text-3xl text-bone uppercase tracking-wider">
            Админ Панел
          </h2>
          <p className="mt-2 text-sm text-bone-dim">
            Въведете парола за достъп до настройките
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block font-head text-xs uppercase tracking-wider text-bone-dim">
                Парола
              </span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isPending}
                  className="input pr-12 font-mono"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bone-dim hover:text-bone"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
              <input
                name="rememberMe"
                type="checkbox"
                disabled={isPending}
                className="h-4 w-4 rounded-sm border-ink-line bg-ink accent-ember text-ember focus:ring-0 focus:ring-offset-0"
              />
              <span className="font-head text-xs uppercase tracking-wider text-bone-dim">
                Запомни ме на това устройство
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-sm border border-ember/20 bg-ember/5 p-4 text-sm text-ember">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-sm bg-ember py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60"
          >
            {isPending ? "Проверка..." : "Влез в панела"}
          </button>
        </form>
      </div>
    </div>
  );
}
