import { createEventAction } from "../actions";
import { EventForm } from "../EventForm";

export default function NewEventPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Veranstaltungen</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Neue Veranstaltung</h1>
        </div>
        <EventForm action={createEventAction} />
      </div>
    </div>
  );
}
