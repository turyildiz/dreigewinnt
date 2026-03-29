import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateBusinessAction, deleteBusinessAction } from "../../actions";
import { BusinessForm } from "../../BusinessForm";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (!business) notFound();

  const updateAction = updateBusinessAction.bind(null, id);
  const deleteAction = deleteBusinessAction.bind(null, id);

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Gewerbe</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{business.name}</h1>
        </div>
        <BusinessForm action={updateAction} deleteAction={deleteAction} defaultValues={business} />
      </div>
    </div>
  );
}
