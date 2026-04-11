
export interface OpeningHourRow {
  day: string;
  hours: string;
}

export type BusinessStatus = "open" | "closed" | "unknown";

/**
 * Checks if a business is currently open based on its opening hours.
 * 
 * Expected formats for 'day': 
 * - "Montag - Freitag", "Mo - Fr"
 * - "Samstag", "Sa"
 * - "Sonntag", "So"
 * - "Täglich"
 * 
 * Expected formats for 'hours':
 * - "09:00 - 18:30"
 * - "09:00 - 13:00, 14:00 - 18:00"
 * - "Geschlossen"
 */
export function getBusinessStatus(openingHours: OpeningHourRow[]): BusinessStatus {
  if (!openingHours || openingHours.length === 0) return "unknown";

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentTime = now.getHours() * 100 + now.getMinutes();

  // Mapping German days to indices
  const dayMap: Record<string, number[]> = {
    "montag": [1], "diestag": [2], "mittwoch": [3], "donnerstag": [4], "freitag": [5], "samstag": [6], "sonntag": [0],
    "mo": [1], "di": [2], "mi": [3], "do": [4], "fr": [5], "sa": [6], "so": [0],
    "täglich": [0, 1, 2, 3, 4, 5, 6]
  };

  for (const row of openingHours) {
    const dayStr = row.day.toLowerCase();
    const hoursStr = row.hours.toLowerCase();

    if (hoursStr.includes("geschlossen")) continue;

    let targetDays: number[] = [];

    // Simple range like "Montag - Freitag"
    if (dayStr.includes("-")) {
      const parts = dayStr.split("-").map(s => s.trim());
      if (parts.length === 2) {
        const startDay = Object.keys(dayMap).find(k => parts[0].includes(k));
        const endDay = Object.keys(dayMap).find(k => parts[1].includes(k));
        
        if (startDay && endDay) {
          const startIdx = dayMap[startDay][0];
          const endIdx = dayMap[endDay][0];
          
          if (startIdx <= endIdx) {
            for (let i = startIdx; i <= endIdx; i++) targetDays.push(i);
          } else {
            // Wraps around weekend (e.g. Freitag - Montag) - unlikely but possible
            for (let i = startIdx; i <= 6; i++) targetDays.push(i);
            for (let i = 0; i <= endIdx; i++) targetDays.push(i);
          }
        }
      }
    } else {
      // Single day or "Täglich"
      const found = Object.keys(dayMap).find(k => dayStr.includes(k));
      if (found) targetDays = dayMap[found];
    }

    if (targetDays.includes(dayOfWeek)) {
      // Check time ranges
      // Format: "09:00 - 13:00, 14:00 - 18:00"
      const timeRanges = hoursStr.split(",").map(s => s.trim());
      for (const range of timeRanges) {
        const times = range.split("-").map(s => s.trim());
        if (times.length === 2) {
          const start = parseInt(times[0].replace(":", ""), 10);
          const end = parseInt(times[1].replace(":", ""), 10);
          
          if (currentTime >= start && currentTime < end) {
            return "open";
          }
        }
      }
    }
  }

  return "closed";
}
