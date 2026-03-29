"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createAdminUserAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = (formData.get("full_name") as string) || null;
  const role = (formData.get("role") as string) || "admin";

  if (!email || !password) {
    return { error: "E-Mail und Passwort sind Pflichtfelder." };
  }

  // Create Supabase Auth user
  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    return { error: authError.message };
  }

  // Insert into admin_users
  const { error: profileError } = await supabaseAdmin
    .from("admin_users")
    .insert({ id: authUser.user.id, email, full_name, role });

  if (profileError) {
    // Roll back auth user
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return { error: profileError.message };
  }

  revalidatePath("/admin/team");
  return null;
}

export async function deleteAdminUserAction(id: string) {
  await supabaseAdmin.from("admin_users").delete().eq("id", id);
  await supabaseAdmin.auth.admin.deleteUser(id);
  revalidatePath("/admin/team");
}
