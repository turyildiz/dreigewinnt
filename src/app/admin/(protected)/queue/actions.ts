"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function approveItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string; // "businesses" | "events"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin.from(table as any) as any).update({ status: "active" }).eq("id", id);

  revalidatePath("/admin/queue");
  const pathMap: Record<string, string> = { businesses: "/gewerbe", events: "/events", jobs: "/jobs" };
  revalidatePath(pathMap[table] ?? "/");
  redirect("/admin/queue?approved=1");
}

export async function reinstateItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin.from(table as any) as any).update({ status: "pending" }).eq("id", id);

  revalidatePath("/admin/queue");
  redirect("/admin/queue");
}

export async function rejectItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin.from(table as any) as any).update({ status: "rejected" }).eq("id", id);

  revalidatePath("/admin/queue");
  redirect("/admin/queue?rejected=1");
}
