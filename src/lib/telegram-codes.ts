import { supabaseAdmin } from "./supabase-admin";

const TOWN_PREFIXES: Record<string, string> = {
  raunheim: "RAU",
  kelsterbach: "KEL",
  ruesselsheim: "RUS",
};

export async function generateTelegramCode(town: string, table: "businesses" | "clubs"): Promise<string> {
  const prefix = TOWN_PREFIXES[town] ?? "DRG";

  const { data } = await supabaseAdmin
    .from(table)
    .select("telegram_code")
    .like("telegram_code", `${prefix}%`)
    .order("telegram_code", { ascending: false })
    .limit(1);

  let nextNum = 1;
  if (data?.[0]?.telegram_code) {
    const match = data[0].telegram_code.match(/(\d+)$/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }

  return `${prefix}${String(nextNum).padStart(3, "0")}`;
}
