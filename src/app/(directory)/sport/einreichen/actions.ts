"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function submitClubAction(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  const name = formData.get("name") as string;
  const slug = toSlug(name) + "-" + Date.now().toString(36);

  const { error } = await supabaseAdmin.from("clubs").insert({
    slug,
    name,
    town: formData.get("town") as string,
    sport: (formData.get("sport") as string) || null,
    status: "pending",
    description: (formData.get("description") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    website: (formData.get("website") as string) || null,
    email: (formData.get("contact_email") as string) || null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
