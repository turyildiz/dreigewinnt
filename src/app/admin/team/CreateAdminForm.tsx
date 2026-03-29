"use client";

import { useActionState } from "react";
import { createAdminUserAction } from "./actions";

export function CreateAdminForm() {
  const [state, formAction, pending] = useActionState(createAdminUserAction, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Name</label>
        <input name="full_name" className={inputClass} placeholder="Max Mustermann" />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">E-Mail *</label>
        <input name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Passwort *</label>
        <input name="password" type="password" required minLength={8} className={inputClass} />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Rolle</label>
        <select name="role" className={inputClass} defaultValue="admin">
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      {state?.error && (
        <p className="text-sm text-error font-medium">{state.error}</p>
      )}
      {state === null && !pending && (
        <p className="text-sm text-secondary font-medium hidden">Gespeichert</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="signature-gradient text-on-secondary py-3 font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
      >
        {pending ? "Wird angelegt…" : "Admin anlegen"}
      </button>
    </form>
  );
}

const inputClass = "w-full bg-white px-4 py-3 text-sm text-primary placeholder:text-outline/40 outline-none border border-outline-variant/25 focus:border-secondary/60 focus:bg-white transition-colors";
