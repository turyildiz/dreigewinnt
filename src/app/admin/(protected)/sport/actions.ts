"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadToStorage } from "@/lib/storage";
import { generateTelegramCode } from "@/lib/telegram-codes";
import { sendApprovalEmail } from "@/lib/email";
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
  return uploadToStorage(file, "club-images", folder);
}

export async function createClubAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = toSlug(name) + "-" + Date.now().toString(36);

  const heroFile = formData.get("hero_image_file") as File | null;
  let heroUrl = (formData.get("hero_image_url") as string) || null;
  if (heroFile && heroFile.size > 0) {
    heroUrl = await uploadImage(heroFile, `hero/${slug}`);
  }

  const logoFile = formData.get("logo_file") as File | null;
  let logoUrl = (formData.get("logo_url") as string) || null;
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, `logo/${slug}`);
  }

  const { error } = await supabaseAdmin.from("clubs").insert({
    slug,
    name,
    sport: (formData.get("sport") as string) || null,
    town: formData.get("town") as string,
    tier: (formData.get("tier") as string) || "free",
    status: formData.get("status") as string,
    description: (formData.get("description") as string) || null,
    full_description: (formData.get("full_description") as string) || null,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    website: (formData.get("website") as string) || null,
    hero_image_url: heroUrl,
    logo_url: logoUrl,
    founded_year: formData.get("founded_year") ? parseInt(formData.get("founded_year") as string, 10) : null,
    members_count: formData.get("members_count") ? parseInt(formData.get("members_count") as string, 10) : null,
    social_instagram: (formData.get("social_instagram") as string) || null,
    social_facebook: (formData.get("social_facebook") as string) || null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/sport");
  revalidatePath("/sport");
  redirect("/admin/sport");
}

export async function updateClubAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const newStatus = formData.get("status") as string;

  const { data: current } = await supabaseAdmin
    .from("clubs")
    .select("status, email, slug, telegram_code, town")
    .eq("id", id)
    .single();

  const heroFile = formData.get("hero_image_file") as File | null;
  let heroUrl = (formData.get("hero_image_url") as string) || null;
  if (heroFile && heroFile.size > 0) {
    heroUrl = await uploadImage(heroFile, `hero/${id}`);
  }

  const logoFile = formData.get("logo_file") as File | null;
  let logoUrl = (formData.get("logo_url") as string) || null;
  if (logoFile && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, `logo/${id}`);
  }

  const { error } = await supabaseAdmin
    .from("clubs")
    .update({
      name,
      sport: (formData.get("sport") as string) || null,
      town: formData.get("town") as string,
      tier: (formData.get("tier") as string) || "free",
      status: newStatus,
      is_spotlight: formData.get("is_spotlight") === "on",
      description: (formData.get("description") as string) || null,
      full_description: (formData.get("full_description") as string) || null,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      website: (formData.get("website") as string) || null,
      hero_image_url: heroUrl,
      logo_url: logoUrl,
      founded_year: formData.get("founded_year") ? parseInt(formData.get("founded_year") as string, 10) : null,
      members_count: formData.get("members_count") ? parseInt(formData.get("members_count") as string, 10) : null,
      social_instagram: (formData.get("social_instagram") as string) || null,
      social_facebook: (formData.get("social_facebook") as string) || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (current && current.status !== "approved" && newStatus === "approved" && current.email) {
    const slug = current.slug;
    let code = current.telegram_code;
    if (!code) {
      code = await generateTelegramCode(current.town, "clubs");
      await supabaseAdmin.from("clubs").update({ telegram_code: code }).eq("id", id);
    }
    try {
      await sendApprovalEmail({
        to: current.email,
        partnerName: name,
        profileUrl: `https://dreigewinnt.com/sport/${slug}`,
        telegramCode: code,
      });
    } catch (err) {
      console.error("Approval email failed:", err);
    }
  }

  revalidatePath("/admin/sport");
  revalidatePath("/sport");
  redirect("/admin/sport");
}

export async function deleteClubAction(id: string) {
  const { error } = await supabaseAdmin.from("clubs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/sport");
  revalidatePath("/sport");
  redirect("/admin/sport");
}

// ── Gallery photo actions ──────────────────────────────────────────

export async function uploadClubGalleryPhotoAction(clubId: string, formData: FormData) {
  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Kein Bild ausgewählt." };

  const url = await uploadImage(file, `gallery/${clubId}`);
  const { data: existing } = await supabaseAdmin
    .from("club_photos")
    .select("sort_order")
    .eq("club_id", clubId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  const { error } = await supabaseAdmin.from("club_photos").insert({
    club_id: clubId,
    url,
    sort_order: nextOrder,
  });
  if (error) return { error: error.message };

  revalidatePath(`/admin/sport/${clubId}/edit`);
  revalidatePath(`/sport`);
  return null;
}

export async function deleteClubGalleryPhotoAction(photoId: string, clubId: string) {
  const { data: photo } = await supabaseAdmin
    .from("club_photos")
    .select("url")
    .eq("id", photoId)
    .single();

  await supabaseAdmin.from("club_photos").delete().eq("id", photoId);

  if (photo?.url && !photo.url.startsWith(process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL ?? "__none__")) {
    const match = photo.url.match(/\/club-images\/(.+)$/);
    if (match) {
      await supabaseAdmin.storage.from("club-images").remove([match[1]]);
    }
  }

  revalidatePath(`/admin/sport/${clubId}/edit`);
  revalidatePath(`/sport`);
}

export async function generateClubTelegramCode(clubId: string) {
  const { data: club } = await supabaseAdmin
    .from("clubs")
    .select("town, telegram_code")
    .eq("id", clubId)
    .single();

  if (!club) throw new Error("Club not found");
  if (club.telegram_code) return club.telegram_code;

  const code = await generateTelegramCode(club.town, "clubs");
  await supabaseAdmin
    .from("clubs")
    .update({ telegram_code: code })
    .eq("id", clubId);

  revalidatePath(`/admin/sport/${clubId}/edit`);
  return code;
}
