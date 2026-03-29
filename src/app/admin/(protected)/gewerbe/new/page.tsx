import { createBusinessAction } from "../actions";
import { BusinessForm } from "../BusinessForm";

export default function NewBusinessPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Gewerbe</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Neues Unternehmen</h1>
        </div>
        <BusinessForm action={createBusinessAction} />
      </div>
    </div>
  );
}
