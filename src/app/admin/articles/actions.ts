"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function toSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

export async function createArticleAction(formData: FormData) {
  const title = formData.get("title") as string;
  const town = formData.get("town") as string;
  const data = {
    slug: toSlug(title),
    title,
    excerpt: (formData.get("excerpt") as string) || null,
    body: (formData.get("body") as string) || null,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
    towns: [town],
    status: formData.get("status") as string,
    published_at: formData.get("status") === "published" ? new Date().toISOString() : null,
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
  };

  const { error } = await supabaseAdmin.from("articles").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath("/news");
  redirect("/admin/articles");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const town = formData.get("town") as string;
  const newStatus = formData.get("status") as string;
  const data = {
    title: formData.get("title") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    body: (formData.get("body") as string) || null,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
    towns: [town],
    status: newStatus,
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
  };

  const { error } = await supabaseAdmin.from("articles").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath("/news");
  redirect("/admin/articles");
}

export async function deleteArticleAction(id: string) {
  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath("/news");
  redirect("/admin/articles");
}
