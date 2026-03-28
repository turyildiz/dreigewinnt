"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center gap-1.5 h-6">
            <span className="w-[2px] h-[16px] bg-primary"></span>
            <span className="w-[2px] h-[24px] bg-secondary"></span>
            <span className="w-[2px] h-[20px] bg-tertiary"></span>
          </div>
          <div className="text-xl font-headline tracking-tighter uppercase flex items-baseline">
            <span className="font-bold text-primary">DREIGEWINNT</span>
            <span className="font-light text-tertiary">.COM</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            Redaktion
          </p>
          <h1 className="text-2xl font-headline font-black tracking-tighter text-primary mb-8">
            Admin-Bereich
          </h1>

          <form action={formAction} className="flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                E-Mail
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
                Passwort
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container transition-colors"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-error font-medium">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="signature-gradient text-on-secondary py-3.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-60 mt-2"
            >
              {pending ? "Anmelden…" : "Anmelden"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
