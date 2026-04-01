"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function approveItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string; // "businesses" | "events"

  await supabaseAdmin.from(table).update({ status: "active" }).eq("id", id);

  revalidatePath("/admin/queue");
  revalidatePath(table === "businesses" ? "/gewerbe" : "/events");
  redirect("/admin/queue?approved=1");
}

export async function reinstateItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string;

  await supabaseAdmin.from(table).update({ status: "pending" }).eq("id", id);

  revalidatePath("/admin/queue");
  redirect("/admin/queue");
}

export async function rejectItem(formData: FormData) {
  const id = formData.get("id") as string;
  const table = formData.get("table") as string;

  await supabaseAdmin.from(table).update({ status: "rejected" }).eq("id", id);

  revalidatePath("/admin/queue");
  redirect("/admin/queue?rejected=1");
}
