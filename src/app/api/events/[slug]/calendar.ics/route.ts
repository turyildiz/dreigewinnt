import { supabase } from "@/lib/supabase";

function escapeIcsText(value: string | null | undefined) {
  return (value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function toIcsDate(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function foldIcsLine(line: string) {
  const maxLength = 74;
  if (line.length <= maxLength) return line;

  const chunks: string[] = [];
  let remaining = line;
  while (remaining.length > maxLength) {
    chunks.push(remaining.slice(0, maxLength));
    remaining = ` ${remaining.slice(maxLength)}`;
  }
  chunks.push(remaining);
  return chunks.join("\r\n");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { data: event } = await supabase
    .from("events")
    .select("slug, title, description, date_start, date_end, venue, address, status")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const start = new Date(event.date_start);
  const end = event.date_end
    ? new Date(event.date_end)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const origin = new URL(request.url).origin;
  const eventUrl = `${origin}/events/${event.slug}`;
  const location = [event.venue, event.address].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dreigewinnt//Events//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@dreigewinnt.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : null,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    `URL:${eventUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => Boolean(line));

  const body = `${lines.map(foldIcsLine).join("\r\n")}\r\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
