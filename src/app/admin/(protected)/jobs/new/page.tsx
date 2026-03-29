import { createJobAction } from "../actions";
import { JobForm } from "../JobForm";

export default function NewJobPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Stellenanzeigen</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Neue Stelle</h1>
        </div>
        <JobForm action={createJobAction} />
      </div>
    </div>
  );
}
