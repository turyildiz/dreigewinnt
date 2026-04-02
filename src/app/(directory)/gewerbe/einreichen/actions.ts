"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function submitBusinessAction(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  const tier = (formData.get("tier") as string) || "free";
  const isPaid = tier !== "free";
  const isPremium = tier === "premium";
  const name = formData.get("name") as string;
  const slug = toSlug(name) + "-" + Date.now().toString(36);

  let heroImageUrl: string | null = null;
  const galleryUrls: string[] = [];

  const existingId = (formData.get("existing_id") as string) || null;
  const uploadSlug = existingId ?? slug;

  if (isPaid) {
    const heroFile = formData.get("hero_image") as File | null;
    if (heroFile && heroFile.size > 0) {
      heroImageUrl = await uploadToStorage(heroFile, "business-images", `submissions/${uploadSlug}`);
    }
    const galleryFiles = formData.getAll("gallery_images") as File[];
    for (const file of galleryFiles) {
      if (file && file.size > 0) {
        const url = await uploadToStorage(file, "business-images", `submissions/${uploadSlug}/gallery`);
        galleryUrls.push(url);
      }
    }
  }

  const payload = {
    tier,
    status: "pending" as const,
    description: (formData.get("description") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    website: (formData.get("website") as string) || null,
    email: (formData.get("contact_email") as string) || null,
    ...(heroImageUrl ? { hero_image_url: heroImageUrl } : {}),
  };

  let bizId: string;

  if (existingId) {
    // Upgrade: update the existing record
    const { error } = await supabaseAdmin.from("businesses").update(payload).eq("id", existingId);
    if (error) return { success: false, error: error.message };
    bizId = existingId;
  } else {
    // New submission: insert
    const { data: biz, error } = await supabaseAdmin.from("businesses").insert({
      slug,
      name,
      town: formData.get("town") as string,
      category: formData.get("category") as string,
      ...payload,
    }).select("id").single();
    if (error) return { success: false, error: error.message };
    bizId = biz.id;
  }

  // Insert gallery photos
  if (galleryUrls.length > 0) {
    await supabaseAdmin.from("business_photos").insert(
      galleryUrls.map((url, i) => ({ business_id: bizId, photo_url: url, sort_order: i }))
    );
  }

  return { success: true };
}
