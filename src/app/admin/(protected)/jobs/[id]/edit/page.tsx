import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateJobAction, deleteJobAction } from "../../actions";
import { JobForm } from "../../JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: job } = await supabaseAdmin.from("jobs").select("*").eq("id", id).single();
  if (!job) notFound();

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Stellenanzeigen</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{job.title}</h1>
        </div>
        <JobForm
          action={updateJobAction.bind(null, id)}
          deleteAction={deleteJobAction.bind(null, id)}
          defaultValues={job}
        />
      </div>
    </div>
  );
}
