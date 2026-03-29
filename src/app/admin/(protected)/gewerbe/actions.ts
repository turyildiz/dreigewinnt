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

async function ensureBucket() {
  await supabaseAdmin.storage.createBucket("business-images", { public: true }).catch(() => {});
}

async function uploadImage(file: File, folder: string): Promise<string> {
  await ensureBucket();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { data, error } = await supabaseAdmin.storage
    .from("business-images")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw new Error(error.message);
  return supabaseAdmin.storage.from("business-images").getPublicUrl(data.path).data.publicUrl;
}

export async function createBusinessAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = toSlug(name) + "-" + Date.now().toString(36);

  const heroFile = formData.get("hero_image_file") as File | null;
  let heroUrl = (formData.get("hero_image_url") as string) || null;
  if (heroFile && heroFile.size > 0) {
    heroUrl = await uploadImage(heroFile, `hero/${slug}`);
  }

  const { error } = await supabaseAdmin.from("businesses").insert({
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
    hero_image_url: heroUrl,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

export async function updateBusinessAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;

  const heroFile = formData.get("hero_image_file") as File | null;
  let heroUrl = (formData.get("hero_image_url") as string) || null;
  if (heroFile && heroFile.size > 0) {
    heroUrl = await uploadImage(heroFile, `hero/${id}`);
  }

  const { error } = await supabaseAdmin
    .from("businesses")
    .update({
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
      hero_image_url: heroUrl,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

export async function deleteBusinessAction(id: string) {
  const { error } = await supabaseAdmin.from("businesses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

// ── Gallery photo actions ──────────────────────────────────────────

const PHOTO_LIMITS: Record<string, number> = {
  free: 0,
  standard: 5,
  premium: Infinity,
};

export async function uploadGalleryPhotoAction(businessId: string, formData: FormData) {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Kein Bild ausgewählt." };

  // Check tier limit
  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("tier")
    .eq("id", businessId)
    .single();

  const limit = PHOTO_LIMITS[business?.tier ?? "free"] ?? 0;
  if (limit === 0) return { error: "Dieses Paket unterstützt keine Galerie." };

  if (limit !== Infinity) {
    const { count } = await supabaseAdmin
      .from("business_photos")
      .select("id", { count: "exact", head: true })
      .eq("business_id", businessId);
    if ((count ?? 0) >= limit) return { error: `Maximale Anzahl (${limit}) erreicht.` };
  }

  const url = await uploadImage(file, `gallery/${businessId}`);
  const { data: existing } = await supabaseAdmin
    .from("business_photos")
    .select("sort_order")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  const { error } = await supabaseAdmin.from("business_photos").insert({
    business_id: businessId,
    url,
    sort_order: nextOrder,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/gewerbe/${businessId}/edit`);
  revalidatePath(`/gewerbe`);
  return null;
}

export async function deleteGalleryPhotoAction(photoId: string, businessId: string) {
  await supabaseAdmin.from("business_photos").delete().eq("id", photoId);
  revalidatePath(`/admin/gewerbe/${businessId}/edit`);
  revalidatePath(`/gewerbe`);
}
