import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { logoutAction } from "./actions";
import { AdminMobileHeader } from "./AdminMobileHeader";

const navItems = [
  { href: "/admin/dashboard", label: "Übersicht", icon: "dashboard" },
  { href: "/admin/events", label: "Veranstaltungen", icon: "event" },
  { href: "/admin/gewerbe", label: "Gewerbe", icon: "storefront" },
  { href: "/admin/sport", label: "Sport", icon: "sports" },
  { href: "/admin/articles", label: "Nachrichten", icon: "newspaper" },
  { href: "/admin/jobs", label: "Stellenanzeigen", icon: "work" },
  { href: "/admin/queue", label: "Warteschlange", icon: "pending_actions" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminUser } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!adminUser) redirect("/admin/login");

  const isSuperadmin = adminUser.role === "superadmin";

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Mobile header */}
      <AdminMobileHeader
        userName={adminUser.full_name ?? adminUser.email ?? "Admin"}
        isSuperadmin={isSuperadmin}
      />

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex w-64 bg-surface-container-lowest flex-shrink-0 flex-col fixed top-0 left-0 h-full">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-outline-variant/15">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 h-5">
              <span className="w-[2px] h-[14px] bg-primary"></span>
              <span className="w-[2px] h-[20px] bg-secondary"></span>
              <span className="w-[2px] h-[17px] bg-tertiary"></span>
            </div>
            <div className="text-sm font-headline tracking-tighter uppercase flex items-baseline">
              <span className="font-bold text-primary">DREIGEWINNT</span>
              <span className="font-light text-tertiary">.COM</span>
            </div>
          </Link>
          <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1 pl-[22px]">
            Redaktion
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {isSuperadmin && (
            <>
              <div className="h-px bg-outline-variant/15 my-2 mx-3" />
              <Link
                href="/admin/team"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">group</span>
                Team
              </Link>
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-outline-variant/15 px-4 py-4">
          <p className="text-xs font-bold text-primary truncate">
            {adminUser.full_name ?? adminUser.email}
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
            {isSuperadmin ? "Superadmin" : "Admin"}
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            <Link
              href="/admin/account"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">manage_accounts</span>
              Passwort ändern
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="w-full max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
