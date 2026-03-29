import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import { CreateAdminForm } from "./CreateAdminForm";
import { deleteAdminUserAction } from "./actions";

export default async function TeamPage() {
  // Only superadmins can access
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await supabaseAdmin
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (me?.role !== "superadmin") redirect("/admin/dashboard");

  const { data: admins } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, full_name, role, created_at")
    .order("created_at");

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-2xl">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Superadmin</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Team</h1>
        </div>

        {/* Admin list */}
        <div className="bg-surface-container-lowest mb-8">
          <div className="px-6 pt-5 pb-1 border-b border-outline-variant/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Mitglieder</p>
          </div>
          {admins?.map((admin) => (
            <div key={admin.id} className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/10 last:border-b-0">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary text-sm">{admin.full_name ?? admin.email}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                  {admin.email} · {admin.role}
                </p>
              </div>
              {admin.id !== user.id && (
                <form action={deleteAdminUserAction.bind(null, admin.id)}>
                  <button type="submit" className="material-symbols-outlined text-xl text-on-surface-variant hover:text-error transition-colors">
                    delete
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        {/* Create new admin */}
        <CreateAdminForm />
      </div>
    </div>
  );
}
