import { createClubAction } from "../actions";
import { ClubForm } from "../ClubForm";

export default function NewClubPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Sport</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Neuer Verein</h1>
        </div>
        <ClubForm action={createClubAction} />
      </div>
    </div>
  );
}
