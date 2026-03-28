import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateEventAction, deleteEventAction } from "../../actions";
import { EventForm } from "../../EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: event } = await supabaseAdmin.from("events").select("*").eq("id", id).single();
  if (!event) notFound();

  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Veranstaltungen</p>
      <h1 className="text-3xl font-headline font-black tracking-tighter text-primary mb-8">{event.title}</h1>
      <EventForm
        action={updateEventAction.bind(null, id)}
        deleteAction={deleteEventAction.bind(null, id)}
        defaultValues={event}
      />
    </div>
  );
}
