"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "./actions";

const navItems = [
  { href: "/admin/dashboard", label: "Übersicht", icon: "dashboard" },
  { href: "/admin/gewerbe", label: "Gewerbe", icon: "storefront" },
  { href: "/admin/events", label: "Veranstaltungen", icon: "event" },
  { href: "/admin/articles", label: "Nachrichten", icon: "newspaper" },
  { href: "/admin/jobs", label: "Stellenanzeigen", icon: "work" },
  { href: "/admin/queue", label: "Warteschlange", icon: "pending_actions" },
];

interface Props {
  userName: string;
  isSuperadmin: boolean;
}

export function AdminMobileHeader({ userName, isSuperadmin }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-surface-container-lowest border-b border-outline-variant/15 flex items-center px-4 gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1.5 text-primary"
          aria-label="Menü öffnen"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 h-4">
            <span className="w-[2px] h-[11px] bg-primary"></span>
            <span className="w-[2px] h-[16px] bg-secondary"></span>
            <span className="w-[2px] h-[13px] bg-tertiary"></span>
          </div>
          <div className="text-sm font-headline tracking-tighter uppercase flex items-baseline">
            <span className="font-bold text-primary">DREIGEWINNT</span>
            <span className="font-light text-tertiary">.COM</span>
          </div>
        </Link>
        <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
          Redaktion
        </span>
      </header>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-primary/30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-surface-container-lowest flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="px-5 py-4 border-b border-outline-variant/15 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 h-4">
                <span className="w-[2px] h-[11px] bg-primary"></span>
                <span className="w-[2px] h-[16px] bg-secondary"></span>
                <span className="w-[2px] h-[13px] bg-tertiary"></span>
              </div>
              <div className="text-sm font-headline tracking-tighter uppercase flex items-baseline">
                <span className="font-bold text-primary">DREIGEWINNT</span>
                <span className="font-light text-tertiary">.COM</span>
              </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-0.5 pl-[18px]">
              Redaktion
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Menü schließen"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
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
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">group</span>
                Team
              </Link>
            </>
          )}
        </nav>

        {/* User + logout */}
        <div className="border-t border-outline-variant/15 px-4 py-4 flex-shrink-0">
          <p className="text-xs font-bold text-primary truncate">{userName}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">
            {isSuperadmin ? "Superadmin" : "Admin"}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/admin/account"
              onClick={() => setIsOpen(false)}
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
      </div>
    </>
  );
}
