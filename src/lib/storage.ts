import { supabaseAdmin } from "./supabase-admin";

export async function uploadToStorage(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (error) throw new Error(error.message);
  return supabaseAdmin.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
}
