"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function toSlug(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
    "-" + Date.now().toString(36)
  );
}

export async function createJobAction(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = toSlug(title);

  const imageFile = formData.get("image_file") as File | null;
  let imageUrl = (formData.get("image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToStorage(imageFile, "job-images", slug);
  }

  const isFeatured = formData.get("is_featured") === "on";
  const featuredUntilRaw = formData.get("featured_until") as string;

  const data = {
    slug,
    title,
    company_name: formData.get("company_name") as string,
    town: formData.get("town") as string,
    job_type: formData.get("job_type") as string,
    category: (formData.get("category") as string) || null,
    description: (formData.get("description") as string) || null,
    salary_range: (formData.get("salary_range") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    contact_phone: (formData.get("contact_phone") as string) || null,
    website_url: (formData.get("website_url") as string) || null,
    image_url: imageUrl,
    is_featured: isFeatured,
    featured_until: isFeatured && featuredUntilRaw ? new Date(featuredUntilRaw).toISOString() : null,
    status: formData.get("status") as string,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const { error } = await supabaseAdmin.from("jobs").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function updateJobAction(id: string, formData: FormData) {
  const imageFile = formData.get("image_file") as File | null;
  let imageUrl = (formData.get("image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToStorage(imageFile, "job-images", id);
  }

  const isFeatured = formData.get("is_featured") === "on";
  const featuredUntilRaw = formData.get("featured_until") as string;
  const contactEmail = (formData.get("contact_email") as string) || null;

  // Fetch existing record to preserve NOT NULL fields if left empty
  const { data: existing } = await supabaseAdmin.from("jobs").select("contact_email").eq("id", id).single();

  const data: Record<string, unknown> = {
    title: formData.get("title") as string,
    company_name: formData.get("company_name") as string,
    town: formData.get("town") as string,
    job_type: formData.get("job_type") as string,
    category: (formData.get("category") as string) || null,
    description: (formData.get("description") as string) || null,
    address: (formData.get("address") as string) || null,
    salary_range: (formData.get("salary_range") as string) || null,
    contact_email: contactEmail ?? existing?.contact_email ?? "",
    contact_phone: (formData.get("contact_phone") as string) || null,
    website_url: (formData.get("website_url") as string) || null,
    image_url: imageUrl,
    is_featured: isFeatured,
    featured_until: isFeatured && featuredUntilRaw ? new Date(featuredUntilRaw).toISOString() : null,
    status: formData.get("status") as string,
  };

  const { error } = await supabaseAdmin.from("jobs").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}

export async function deleteJobAction(id: string) {
  const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  redirect("/admin/jobs");
}
