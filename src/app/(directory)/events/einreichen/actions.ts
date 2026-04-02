"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function submitEventAction(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  const title = formData.get("title") as string;
  const slug = toSlug(title) + "-" + Date.now().toString(36);

  let imageUrl: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToStorage(imageFile, "event-images", `submissions/${slug}`);
  }

  const dateStr = formData.get("date") as string;
  const timeStr = (formData.get("time") as string) || "00:00";
  const dateStart = dateStr ? new Date(`${dateStr}T${timeStr}`) : new Date();

  const featuredBoost = formData.get("featured_boost") === "true";

  const { error } = await supabaseAdmin.from("events").insert({
    slug,
    title,
    town: formData.get("town") as string,
    category: (formData.get("category") as string) || null,
    date_start: dateStart.toISOString(),
    venue: (formData.get("venue") as string) || null,
    description: (formData.get("description") as string) || null,
    organiser_name: (formData.get("organiser_name") as string) || null,
    organiser_email: (formData.get("organiser_email") as string) || null,
    image_url: imageUrl,
    is_featured: featuredBoost,
    status: "pending",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
