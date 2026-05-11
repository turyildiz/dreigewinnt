#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SOURCE = "/var/www/html/dreigewinnt/businesses.json";

function parseArgs(argv) {
  const args = {
    source: DEFAULT_SOURCE,
    apply: false,
    limit: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") args.apply = true;
    else if (arg === "--dry-run") args.apply = false;
    else if (arg === "--source") args.source = argv[++i];
    else if (arg.startsWith("--source=")) args.source = arg.slice("--source=".length);
    else if (arg === "--limit") args.limit = Number(argv[++i]);
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (args.limit !== null && (!Number.isInteger(args.limit) || args.limit < 1)) {
    throw new Error("--limit must be a positive integer");
  }

  return args;
}

function printHelp() {
  console.log(`Import businesses into Supabase.\n\nUsage:\n  npm run import:businesses -- --source /path/businesses.json --dry-run\n  npm run import:businesses -- --source /path/businesses.json --apply\n\nOptions:\n  --source <path>  JSON source path. Default: ${DEFAULT_SOURCE}\n  --dry-run        Parse and validate only. Default.\n  --apply          Upsert normalized rows into public.businesses.\n  --limit <n>      Process only the first n rows.\n`);
}

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (process.env[key]) continue;
    process.env[key] = rest.join("=").trim().replace(/^['\"]|['\"]$/g, "");
  }
}

function asString(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function firstString(row, keys) {
  for (const key of keys) {
    const value = asString(row[key]);
    if (value) return value;
  }
  return null;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeTown(value, fallbackText = "") {
  const raw = `${value ?? ""} ${fallbackText}`.toLowerCase();
  if (raw.includes("raunheim")) return "raunheim";
  if (raw.includes("kelsterbach")) return "kelsterbach";
  if (raw.includes("rüsselsheim") || raw.includes("ruesselsheim") || raw.includes("russelsheim")) return "ruesselsheim";
  return null;
}

function normalizeWebsite(value) {
  const website = asString(value);
  if (!website) return null;
  if (/^https?:\/\//i.test(website)) return website;
  return `https://${website}`;
}

function toRows(input) {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.businesses)) return input.businesses;
  if (Array.isArray(input.data)) return input.data;
  throw new Error("Source JSON must be an array, or an object with a businesses/data array");
}

function normalizeBusiness(row, index) {
  const name = firstString(row, ["name", "title", "company", "company_name", "business_name", "Name", "Firma"]);
  const address = firstString(row, ["address", "street", "adresse", "Address", "Straße", "strasse"]);
  const town = normalizeTown(firstString(row, ["town", "city", "ort", "Town", "Stadt"]), address ?? "");
  const sourceSlug = firstString(row, ["slug", "id"]);
  const slugBase = sourceSlug ?? [name, town].filter(Boolean).join("-");

  const normalized = {
    slug: slugBase ? slugify(slugBase) : null,
    name,
    category: firstString(row, ["category", "branche", "rubrik", "type", "Category", "Kategorie"]),
    town,
    tier: firstString(row, ["tier", "plan"]) ?? "free",
    status: firstString(row, ["status"]) ?? "active",
    description: firstString(row, ["description", "short_description", "beschreibung", "Description", "Kurzbeschreibung"]),
    full_description: firstString(row, ["full_description", "long_description", "details", "Beschreibung"]),
    address,
    phone: firstString(row, ["phone", "telephone", "tel", "telefon", "Phone", "Telefon"]),
    email: firstString(row, ["email", "mail", "Email", "E-Mail"]),
    website: normalizeWebsite(firstString(row, ["website", "url", "homepage", "Website", "Webseite"])),
    hero_image_url: normalizeWebsite(firstString(row, ["hero_image_url", "image", "image_url", "photo", "logo"])),
    is_spotlight: Boolean(row.is_spotlight ?? row.spotlight ?? row.featured ?? false),
    opening_hours: row.opening_hours ?? row.hours ?? null,
  };

  const errors = [];
  if (!normalized.name) errors.push("missing name");
  if (!normalized.slug) errors.push("missing slug");
  if (!normalized.town) errors.push("missing/unknown town");

  return { index, source: row, normalized, errors };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourcePath = path.resolve(args.source);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }

  const input = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const rawRows = toRows(input);
  const selectedRows = args.limit ? rawRows.slice(0, args.limit) : rawRows;
  const normalized = selectedRows.map(normalizeBusiness);
  const invalid = normalized.filter((item) => item.errors.length > 0);
  const validRows = normalized.filter((item) => item.errors.length === 0).map((item) => item.normalized);

  console.log(`Source: ${sourcePath}`);
  console.log(`Rows found: ${rawRows.length}`);
  console.log(`Rows processed: ${selectedRows.length}`);
  console.log(`Valid rows: ${validRows.length}`);
  console.log(`Invalid rows: ${invalid.length}`);

  if (invalid.length) {
    console.log("\nInvalid samples:");
    for (const item of invalid.slice(0, 10)) {
      console.log(`- #${item.index + 1}: ${item.errors.join(", ")}`);
    }
  }

  console.log("\nValid samples:");
  for (const row of validRows.slice(0, 5)) {
    console.log(`- ${row.name} | ${row.town} | ${row.category ?? "no category"} | ${row.slug}`);
  }

  if (!args.apply) {
    console.log("\nDry run only. Re-run with --apply to upsert into Supabase.");
    return;
  }

  loadLocalEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --apply");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const batchSize = 100;
  let imported = 0;
  for (let i = 0; i < validRows.length; i += batchSize) {
    const batch = validRows.slice(i, i + batchSize);
    const { error } = await supabase.from("businesses").upsert(batch, { onConflict: "slug" });
    if (error) throw error;
    imported += batch.length;
    console.log(`Imported ${imported}/${validRows.length}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
