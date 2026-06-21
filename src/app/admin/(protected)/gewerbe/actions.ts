"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";
import { generateTelegramCode } from "@/lib/telegram-codes";
import { sendApprovalEmail } from "@/lib/email";
import { notifyAdmins } from "@/lib/telegram-notify";
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

function uploadImage(file: File, folder: string) {
  return uploadToStorage(file, "business-images", folder);
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
    opening_hours: formData.get("opening_hours") ? JSON.parse(formData.get("opening_hours") as string) : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/gewerbe");
  revalidatePath("/gewerbe");
  redirect("/admin/gewerbe");
}

export async function updateBusinessAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const newStatus = formData.get("status") as string;

  // Check if this is an approval (status changing to active)
  const { data: current } = await supabaseAdmin
    .from("businesses")
    .select("status, email, slug, telegram_code, town")
    .eq("id", id)
    .single();

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
      status: newStatus,
      is_spotlight: formData.get("is_spotlight") === "on",
      description: (formData.get("description") as string) || null,
      full_description: (formData.get("full_description") as string) || null,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      website: (formData.get("website") as string) || null,
      hero_image_url: heroUrl,
      opening_hours: formData.get("opening_hours") ? JSON.parse(formData.get("opening_hours") as string) : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // Send approval email if status changed to active
  if (current && current.status !== "active" && newStatus === "active" && current.email) {
    const slug = current.slug;
    let code = current.telegram_code;
    if (!code) {
      code = await generateTelegramCode(current.town, "businesses");
      await supabaseAdmin.from("businesses").update({ telegram_code: code }).eq("id", id);
    }
    try {
      await sendApprovalEmail({
        to: current.email,
        partnerName: name,
        profileUrl: `https://dreigewinnt.com/gewerbe/${slug}`,
        telegramCode: code,
      });
    } catch (err) {
      console.error("Approval email failed:", err);
    }
  }

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
  const { data: photo } = await supabaseAdmin
    .from("business_photos")
    .select("url")
    .eq("id", photoId)
    .single();

  await supabaseAdmin.from("business_photos").delete().eq("id", photoId);

  // Only delete from Supabase Storage for legacy Supabase-hosted URLs
  if (photo?.url && !photo.url.startsWith(process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL ?? "__none__")) {
    const match = photo.url.match(/\/business-images\/(.+)$/);
    if (match) {
      await supabaseAdmin.storage.from("business-images").remove([match[1]]);
    }
  }

  revalidatePath(`/admin/gewerbe/${businessId}/edit`);
  revalidatePath(`/gewerbe`);
}

export async function generateBusinessTelegramCode(businessId: string) {
  const { data: biz } = await supabaseAdmin
    .from("businesses")
    .select("town, telegram_code")
    .eq("id", businessId)
    .single();

  if (!biz) throw new Error("Business not found");
  if (biz.telegram_code) return biz.telegram_code;

  const code = await generateTelegramCode(biz.town, "businesses");
  await supabaseAdmin
    .from("businesses")
    .update({ telegram_code: code })
    .eq("id", businessId);

  revalidatePath(`/admin/gewerbe/${businessId}/edit`);
  return code;
}
