"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function changePasswordAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Alle Felder sind Pflichtfelder." };
  }

  if (newPassword.length < 8) {
    return { error: "Das neue Passwort muss mindestens 8 Zeichen haben." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Die Passwörter stimmen nicht überein." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Nicht angemeldet." };
  }

  // Verify current password by trying to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Das aktuelle Passwort ist falsch." };
  }

  // Update password via admin API (so we don't need a fresh session)
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
