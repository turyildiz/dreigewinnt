"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";
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
  const slug = toSlug(title);
  const town = formData.get("town") as string;

  const imageFile = formData.get("hero_image_file") as File | null;
  let heroImageUrl = (formData.get("hero_image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    heroImageUrl = await uploadToStorage(imageFile, "article-images", slug);
  }

  const { error } = await supabaseAdmin.from("articles").insert({
    slug,
    title,
    excerpt: (formData.get("excerpt") as string) || null,
    body: (formData.get("body") as string) || null,
    hero_image_url: heroImageUrl,
    towns: [town],
    status: formData.get("status") as string,
    type: (formData.get("type") as string) || "news",
    published_at: formData.get("status") === "published" ? new Date().toISOString() : null,
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/articles");
  revalidatePath("/news");
  redirect("/admin/articles");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const town = formData.get("town") as string;
  const newStatus = formData.get("status") as string;

  const imageFile = formData.get("hero_image_file") as File | null;
  let heroImageUrl = (formData.get("hero_image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    heroImageUrl = await uploadToStorage(imageFile, "article-images", id);
  }

  const { error } = await supabaseAdmin.from("articles").update({
    title: formData.get("title") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    body: (formData.get("body") as string) || null,
    hero_image_url: heroImageUrl,
    towns: [town],
    status: newStatus,
    type: (formData.get("type") as string) || "news",
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
  }).eq("id", id);
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
