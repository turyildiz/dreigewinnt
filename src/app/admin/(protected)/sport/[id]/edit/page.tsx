import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateClubAction, deleteClubAction, uploadClubGalleryPhotoAction, deleteClubGalleryPhotoAction, generateClubTelegramCode } from "../../actions";
import { ClubForm } from "../../ClubForm";
import { ClubGalleryManager } from "../../GalleryManager";
import { TelegramCodeCard } from "@/components/admin/TelegramCodeCard";

export default async function EditClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: club }, { data: photos }] = await Promise.all([
    supabaseAdmin.from("clubs").select("*").eq("id", id).single(),
    supabaseAdmin.from("club_photos").select("id, url, sort_order").eq("club_id", id).order("sort_order"),
  ]);

  if (!club) notFound();

  const updateAction = updateClubAction.bind(null, id);
  const deleteAction = deleteClubAction.bind(null, id);
  const uploadPhotoAction = uploadClubGalleryPhotoAction.bind(null, id);

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Sport</p>
            <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{club.name}</h1>
          </div>
          <Link
            href={`/admin/sport/${id}/posts`}
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">feed</span>
            Posts verwalten
          </Link>
        </div>

        <TelegramCodeCard
          code={club.telegram_code ?? null}
          linked={!!club.telegram_chat_id}
          generateAction={generateClubTelegramCode.bind(null, id)}
        />

        <ClubForm
          action={updateAction}
          deleteAction={deleteAction}
          defaultValues={{
            ...club,
            sport: club.sport ?? undefined,
          }}
        />

        <ClubGalleryManager
          clubId={id}
          photos={photos ?? []}
          uploadAction={uploadPhotoAction}
          deleteAction={deleteClubGalleryPhotoAction}
        />
      </div>
    </div>
  );
}
