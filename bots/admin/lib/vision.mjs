const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) {
  console.warn("[vision] GEMINI_API_KEY not set — poster extraction will return placeholders");
}

const currentYear = new Date().getFullYear();

const EVENT_EXTRACTION_PROMPT = `Du bist ein Assistent, der Eventdaten aus Veranstaltungspostern extrahiert.
Heute ist ${new Date().toISOString().slice(0, 10)}. Das aktuelle Jahr ist ${currentYear}.

Extrahiere die folgenden Felder als JSON. Wenn ein Feld nicht erkennbar ist, setze null.
WICHTIG: Wenn kein Jahr auf dem Poster steht, verwende ${currentYear} oder ${currentYear + 1} — je nachdem, ob das Datum noch in der Zukunft liegt. Events sind fast immer zukünftig.

{
  "title": "Titel der Veranstaltung",
  "description": "Kurze Beschreibung auf Deutsch (2-3 Sätze)",
  "date_start": "YYYY-MM-DD",
  "date_end": "YYYY-MM-DD oder null",
  "time": "HH:MM-HH:MM oder HH:MM",
  "venue": "Name des Veranstaltungsorts",
  "address": "Straße und Hausnummer, PLZ Ort",
  "town": "raunheim, kelsterbach oder ruesselsheim (nur diese drei Optionen)",
  "category": "Kategorie (z.B. Sport, Kultur, Musik, Markt, Workshop, Fest)"
}

Antworte NUR mit dem JSON-Objekt, ohne Erklärung.`;

async function callGemini(contents) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function extractEventFromImage(imageBuffer) {
  if (!GEMINI_API_KEY) {
    return {
      title: "[Platzhalter] Event-Titel",
      description: "Gemini API-Key nicht konfiguriert. Bitte GEMINI_API_KEY setzen.",
      date_start: null, date_end: null, time: null,
      venue: null, address: null, town: null, category: null,
      _placeholder: true,
    };
  }

  const base64 = imageBuffer.toString("base64");

  const text = await callGemini([
    {
      parts: [
        { inline_data: { mime_type: "image/jpeg", data: base64 } },
        { text: EVENT_EXTRACTION_PROMPT },
      ],
    },
  ]);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini returned no JSON");

  return JSON.parse(jsonMatch[0]);
}

export async function polishArticle(rawText) {
  if (!GEMINI_API_KEY) return rawText;

  const text = await callGemini([
    {
      parts: [
        {
          text: `Schreibe den folgenden Text als professionellen deutschen Nachrichtenartikel um. Behalte die Fakten bei, verbessere Stil und Grammatik. Antworte nur mit dem fertigen Artikel, ohne Erklärung.\n\n${rawText}`,
        },
      ],
    },
  ]);

  return text || rawText;
}

export async function chatResponse(userMessage, context = "") {
  if (!GEMINI_API_KEY) return "Gemini API-Key nicht konfiguriert.";

  const systemContext = context
    ? `Kontext: ${context}\n\n`
    : "";

  const text = await callGemini([
    {
      parts: [
        {
          text: `${systemContext}Du bist der Dreigewinnt Admin-Bot. Du hilfst dem Administrator, Events und Nachrichten für das lokale Portal dreigewinnt.com zu erstellen. Antworte kurz und auf Deutsch.\n\nNachricht: ${userMessage}`,
        },
      ],
    },
  ]);

  return text || "Entschuldigung, ich konnte keine Antwort generieren.";
}
