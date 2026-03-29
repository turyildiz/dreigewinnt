"use client";

import { useActionState } from "react";
import { createAdminUserAction } from "./actions";

export function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdminUserAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-px">
      <div className="bg-surface-container-lowest border-b border-outline-variant/10">
        <div className="px-6 pt-5 pb-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Neuen Admin anlegen</p>
        </div>
        <div className="px-6 pb-6 pt-4 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Name</label>
            <input name="full_name" className={inputClass} placeholder="Max Mustermann" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">E-Mail *</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Passwort *</label>
            <input name="password" type="password" required minLength={8} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rolle</label>
            <select name="role" className={inputClass} defaultValue="admin">
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>

          {state?.error && (
            <p className="text-sm text-error font-medium">{state.error}</p>
          )}
        </div>
      </div>

      <div className="bg-surface-container-lowest px-6 py-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="signature-gradient text-on-secondary px-6 py-2.5 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
        >
          {pending ? "Wird angelegt…" : "Admin anlegen"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-surface-container-low px-4 py-2.5 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/0 focus:border-secondary/30 focus:bg-surface-container transition-colors";
