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

export async function createEventAction(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = toSlug(title);

  const imageFile = formData.get("image_file") as File | null;
  let imageUrl = (formData.get("image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToStorage(imageFile, "event-images", slug);
  }

  const { error } = await supabaseAdmin.from("events").insert({
    slug,
    title,
    description: (formData.get("description") as string) || null,
    town: formData.get("town") as string,
    category: (formData.get("category") as string) || null,
    status: formData.get("status") as string,
    is_featured: formData.get("is_featured") === "on",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || null,
    venue: (formData.get("venue") as string) || null,
    address: (formData.get("address") as string) || null,
    organiser_name: (formData.get("organiser_name") as string) || null,
    organiser_email: (formData.get("organiser_email") as string) || null,
    image_url: imageUrl,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEventAction(id: string, formData: FormData) {
  const imageFile = formData.get("image_file") as File | null;
  let imageUrl = (formData.get("image_url") as string) || null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadToStorage(imageFile, "event-images", id);
  }

  const { error } = await supabaseAdmin.from("events").update({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    town: formData.get("town") as string,
    category: (formData.get("category") as string) || null,
    status: formData.get("status") as string,
    is_featured: formData.get("is_featured") === "on",
    date_start: formData.get("date_start") as string,
    date_end: (formData.get("date_end") as string) || null,
    venue: (formData.get("venue") as string) || null,
    address: (formData.get("address") as string) || null,
    organiser_name: (formData.get("organiser_name") as string) || null,
    organiser_email: (formData.get("organiser_email") as string) || null,
    image_url: imageUrl,
  }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
  const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}
