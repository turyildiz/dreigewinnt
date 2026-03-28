import { createJobAction } from "../actions";
import { JobForm } from "../JobForm";

export default function NewJobPage() {
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Stellenanzeigen</p>
      <h1 className="text-3xl font-headline font-black tracking-tighter text-primary mb-8">Neue Stelle</h1>
      <JobForm action={createJobAction} />
    </div>
  );
}
