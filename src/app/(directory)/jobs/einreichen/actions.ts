"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function submitJobAction(
  formData: FormData
): Promise<{ success: true } | { success: false; error: string }> {
  const title = formData.get("title") as string;
  const slug = toSlug(title) + "-" + Date.now().toString(36);

  const featuredBoost = formData.get("featured_boost") === "true";

  let imageUrl: string | null = null;
  if (featuredBoost) {
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToStorage(imageFile, "job-images", `submissions/${slug}`);
    }
  }

  const { error } = await supabaseAdmin.from("jobs").insert({
    slug,
    title,
    company_name: formData.get("company_name") as string,
    town: formData.get("town") as string,
    job_type: (formData.get("job_type") as string) || null,
    category: (formData.get("category") as string) || null,
    description: (formData.get("description") as string) || null,
    salary_range: (formData.get("salary_range") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    contact_phone: (formData.get("contact_phone") as string) || null,
    website_url: (formData.get("website_url") as string) || null,
    image_url: imageUrl,
    is_featured: featuredBoost,
    status: "pending",
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
