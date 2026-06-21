import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateBusinessAction, deleteBusinessAction, uploadGalleryPhotoAction, deleteGalleryPhotoAction, generateBusinessTelegramCode } from "../../actions";
import { BusinessForm } from "../../BusinessForm";
import { GalleryManager } from "../../GalleryManager";
import { TelegramCodeCard } from "@/components/admin/TelegramCodeCard";

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: business }, { data: photos }] = await Promise.all([
    supabaseAdmin.from("businesses").select("*").eq("id", id).single(),
    supabaseAdmin.from("business_photos").select("id, url, sort_order").eq("business_id", id).order("sort_order"),
  ]);

  if (!business) notFound();

  const updateAction = updateBusinessAction.bind(null, id);
  const deleteAction = deleteBusinessAction.bind(null, id);
  const uploadPhotoAction = uploadGalleryPhotoAction.bind(null, id);

  const photoLimit = business.tier === "premium" ? Infinity : business.tier === "standard" ? 5 : 0;

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Gewerbe</p>
            <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{business.name}</h1>
          </div>
          <Link
            href={`/admin/gewerbe/${id}/posts`}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">feed</span>
            Posts verwalten
          </Link>
        </div>

        <TelegramCodeCard
          code={business.telegram_code ?? null}
          linked={!!business.telegram_chat_id}
          generateAction={generateBusinessTelegramCode.bind(null, id)}
        />

        <BusinessForm action={updateAction} deleteAction={deleteAction} defaultValues={{ ...business, category: business.category ?? undefined, opening_hours: business.opening_hours as { day: string; hours: string }[] | null }} />

        {/* Gallery — Standard (5 photos) and Premium (unlimited) only */}
        {photoLimit > 0 && (
          <GalleryManager
            businessId={id}
            photos={photos ?? []}
            limit={photoLimit}
            uploadAction={uploadPhotoAction}
            deleteAction={deleteGalleryPhotoAction}
          />
        )}
      </div>
    </div>
  );
}
