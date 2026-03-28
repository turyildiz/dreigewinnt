import { createBusinessAction } from "../actions";
import { BusinessForm } from "../BusinessForm";

export default function NewBusinessPage() {
  return (
    <div className="p-8 lg:p-12 max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
        Gewerbe
      </p>
      <h1 className="text-3xl font-headline font-black tracking-tighter text-primary mb-8">
        Neues Unternehmen
      </h1>
      <BusinessForm action={createBusinessAction} />
    </div>
  );
}
