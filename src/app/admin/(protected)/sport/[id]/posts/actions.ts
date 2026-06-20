"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function uploadPostImages(files: File[], clubId: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${clubId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage
      .from("post-images")
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabaseAdmin.storage.from("post-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function createClubPostAction(clubId: string, formData: FormData) {
  const content = (formData.get("content") as string)?.trim();
  if (!content) throw new Error("Content cannot be empty.");

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploadedUrls = files.length > 0 ? await uploadPostImages(files, clubId) : [];

  const imageUrl = uploadedUrls[0] ?? null;
  const expiresAt = (formData.get("expires_at") as string) || null;

  const { error } = await supabaseAdmin.from("club_posts").insert({
    club_id: clubId,
    content,
    image_url: imageUrl,
    images: uploadedUrls,
    source: "manual",
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/sport/${clubId}/posts`);
  revalidatePath(`/`);
  revalidatePath(`/sport`);
  redirect(`/admin/sport/${clubId}/posts`);
}

export async function updateClubPostAction(postId: string, clubId: string, formData: FormData) {
  const content = (formData.get("content") as string)?.trim();
  if (!content) throw new Error("Content cannot be empty.");

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  const { data: existing } = await supabaseAdmin
    .from("club_posts")
    .select("images, image_url")
    .eq("id", postId)
    .single();

  const existingImages: string[] = existing?.images ?? [];
  const newUploads = files.length > 0 ? await uploadPostImages(files, clubId) : [];
  const allImages = [...existingImages, ...newUploads];
  const imageUrl = allImages[0] ?? existing?.image_url ?? null;

  const expiresAt = (formData.get("expires_at") as string) || null;

  const { error } = await supabaseAdmin
    .from("club_posts")
    .update({
      content,
      images: allImages,
      image_url: imageUrl,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    })
    .eq("id", postId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/sport/${clubId}/posts`);
  revalidatePath(`/`);
  revalidatePath(`/sport`);
  redirect(`/admin/sport/${clubId}/posts`);
}

export async function removeClubPostImageAction(postId: string, clubId: string, imageUrl: string) {
  const { data: post } = await supabaseAdmin
    .from("club_posts")
    .select("images, image_url")
    .eq("id", postId)
    .single();

  const updatedImages = (post?.images ?? []).filter((url: string) => url !== imageUrl);
  const newFirst = updatedImages[0] ?? null;

  await supabaseAdmin
    .from("club_posts")
    .update({ images: updatedImages, image_url: newFirst })
    .eq("id", postId);

  revalidatePath(`/admin/sport/${clubId}/posts`);
  revalidatePath(`/`);
}

export async function deleteClubPostAction(postId: string, clubId: string) {
  const { error } = await supabaseAdmin.from("club_posts").delete().eq("id", postId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/sport/${clubId}/posts`);
  revalidatePath(`/`);
  revalidatePath(`/sport`);
}
