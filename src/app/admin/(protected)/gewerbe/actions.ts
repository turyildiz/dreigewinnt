"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createBusinessAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = toSlug(name) + "-" + Date.now().toString(36);

  const data = {
    slug,
    name,
    category: formData.get("category") as string,
    town: formData.get("town") as string,
    tier: formData.get("tier") as string,
    status: formData.get("status") as string,
    description: (formData.get("description") as string) || null,
    full_description: (formData.get("full_description") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    website: (formData.get("website") as string) || null,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
  };

  const { error } = await supabaseAdmin.from("businesses").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

export async function updateBusinessAction(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    town: formData.get("town") as string,
    tier: formData.get("tier") as string,
    status: formData.get("status") as string,
    description: (formData.get("description") as string) || null,
    full_description: (formData.get("full_description") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    website: (formData.get("website") as string) || null,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
  };

  const { error } = await supabaseAdmin
    .from("businesses")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

export async function deleteBusinessAction(id: string) {
  const { error } = await supabaseAdmin
    .from("businesses")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}
