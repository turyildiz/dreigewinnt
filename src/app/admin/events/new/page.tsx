import { createEventAction } from "../actions";
import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Veranstaltungen</p>
      <h1 className="text-3xl font-headline font-black tracking-tighter text-primary mb-8">Neue Veranstaltung</h1>
      <EventForm action={createEventAction} />
    </div>
  );
}
