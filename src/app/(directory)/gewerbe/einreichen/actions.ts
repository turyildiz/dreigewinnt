"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function submitBusinessAction(formData: FormData) {
  const payload = {
    name: formData.get("name") as string,
    town: formData.get("town") as string,
    category: formData.get("category") as string,
    phone: (formData.get("phone") as string) || null,
    website: (formData.get("website") as string) || null,
    address: (formData.get("address") as string) || null,
    description: (formData.get("description") as string) || null,
    contact_email: formData.get("contact_email") as string,
    tier: (formData.get("tier") as string) || "free",
  };

  const { error } = await supabaseAdmin.from("queue_items").insert({
    content_type: "business",
    source_type: "website_submission",
    status: "pending",
    payload,
  });

  if (error) throw new Error(error.message);
  redirect("/gewerbe/einreichen?success=1");
}
