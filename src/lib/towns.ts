export const townDisplayNames: Record<string, "Raunheim" | "Kelsterbach" | "Rüsselsheim"> = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim",
};

export function toDisplayTown(dbTown: string): "Raunheim" | "Kelsterbach" | "Rüsselsheim" {
  return townDisplayNames[dbTown] ?? "Raunheim";
}
