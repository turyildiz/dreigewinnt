"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
          Aktuelles Passwort *
        </label>
        <input
          name="current_password"
          type="password"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
          Neues Passwort *
        </label>
        <input
          name="new_password"
          type="password"
          required
          minLength={8}
          className={inputClass}
          placeholder="Mindestens 8 Zeichen"
        />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">
          Neues Passwort bestätigen *
        </label>
        <input
          name="confirm_password"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-error font-medium">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-secondary font-medium">Passwort erfolgreich geändert.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="signature-gradient text-on-secondary py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-60 mt-2"
      >
        {pending ? "Wird gespeichert…" : "Passwort ändern"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full bg-surface-container-low px-4 py-3 text-sm text-primary placeholder:text-outline/50 outline-none focus:ring-1 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors";
