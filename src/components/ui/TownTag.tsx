export type TownName = "Raunheim" | "Kelsterbach" | "Rüsselsheim";

interface TownTagProps {
  town: TownName;
  className?: string;
}

export function TownTag({ town, className = "" }: TownTagProps) {
  const colorMap = {
    Raunheim: "bg-primary-fixed text-on-primary-fixed",
    Kelsterbach: "bg-secondary-container text-on-secondary-container",
    Rüsselsheim: "bg-tertiary-fixed text-on-tertiary-container",
  };

  return (
    <span
      className={`px-3 py-1 rounded inline-block text-[10px] font-black uppercase tracking-[0.2em] ${colorMap[town]} ${className}`}
    >
      {town}
    </span>
  );
}
