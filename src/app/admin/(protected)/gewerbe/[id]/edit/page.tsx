import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateBusinessAction, deleteBusinessAction, uploadGalleryPhotoAction, deleteGalleryPhotoAction } from "../../actions";
import { BusinessForm } from "../../BusinessForm";
import { GalleryManager } from "../../GalleryManager";

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
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Gewerbe</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{business.name}</h1>
        </div>

        <BusinessForm action={updateAction} deleteAction={deleteAction} defaultValues={business} />

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
