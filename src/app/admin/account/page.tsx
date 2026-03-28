import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "./ChangePasswordForm";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabaseAdmin
    .from("admin_users")
    .select("email, full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Verwaltung</p>
        <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Mein Konto</h1>
      </div>

      {/* Account info */}
      <div className="bg-surface-container-lowest p-6 mb-10 max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Kontodaten</p>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Name</p>
            <p className="text-sm font-bold text-primary">{adminUser?.full_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">E-Mail</p>
            <p className="text-sm text-primary">{adminUser?.email ?? user.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Rolle</p>
            <p className="text-sm text-primary uppercase">{adminUser?.role ?? "admin"}</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="max-w-md">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-6">
          Passwort ändern
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
