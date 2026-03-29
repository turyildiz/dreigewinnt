"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-px">
      <div className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="px-6 pt-5 pb-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Passwort ändern</p>
        </div>
        <div className="px-6 pb-6 pt-4 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Aktuelles Passwort *
            </label>
            <input name="current_password" type="password" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Neues Passwort *
            </label>
            <input name="new_password" type="password" required minLength={8} className={inputClass} placeholder="Mindestens 8 Zeichen" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Neues Passwort bestätigen *
            </label>
            <input name="confirm_password" type="password" required minLength={8} className={inputClass} />
          </div>

          {state?.error && (
            <p className="text-sm text-error font-medium">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-secondary font-medium">Passwort erfolgreich geändert.</p>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest px-6 py-4">
        <button
          type="submit"
          disabled={pending}
          className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
        >
          {pending ? "Wird gespeichert…" : "Passwort ändern"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-surface-container-low px-4 py-2.5 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";
