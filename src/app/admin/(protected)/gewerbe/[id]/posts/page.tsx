import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createPostAction, deletePostAction, updatePostAction, removePostImageAction } from "./actions";

export default async function BusinessPostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit: editPostId } = await searchParams;

  const [{ data: business }, { data: posts }] = await Promise.all([
    supabaseAdmin.from("businesses").select("id, name").eq("id", id).single(),
    supabaseAdmin
      .from("business_posts")
      .select("id, content, image_url, images, created_at, source, expires_at")
      .eq("business_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!business) notFound();

  const createAction = createPostAction.bind(null, id);

  const inputClass = "w-full bg-surface border border-outline-variant/30 p-3 text-sm text-primary placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary";

  return (
    <div className="p-5 sm:p-8 lg:p-12">
      <div className="max-w-3xl">

        <div className="pb-6 flex flex-col gap-1">
          <Link
            href={`/admin/gewerbe/${id}/edit`}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {business.name}
          </Link>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Manage Posts</h1>
        </div>

        {/* New post form */}
        <div className="bg-surface-container-low p-5 sm:p-8 mb-8">
          <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-5 flex items-center gap-3">
            <span className="w-5 h-[2px] bg-secondary flex-shrink-0" />
            New Post
          </h2>
          <form action={createAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Content <span className="text-error">*</span>
              </label>
              <textarea
                name="content"
                required
                rows={4}
                className={`${inputClass} resize-y`}
                placeholder="What's new at this business?"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Images (optional, multiple allowed)
              </label>
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-surface-container file:text-primary hover:file:bg-surface-container-high file:cursor-pointer cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Expires (optional — leave blank to keep forever)
              </label>
              <input
                name="expires_at"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-6 py-3 hover:brightness-110 transition-all"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>

        {/* Existing posts */}
        <div>
          <h2 className="text-[12px] font-black tracking-[0.1em] text-primary uppercase mb-5 flex items-center gap-3">
            <span className="w-5 h-[2px] bg-outline-variant flex-shrink-0" />
            Posts ({posts?.length ?? 0})
          </h2>

          {!posts || posts.length === 0 ? (
            <div className="bg-surface-container-low p-10 text-center">
              <span
                className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                feed
              </span>
              <p className="text-on-surface-variant text-sm">No posts yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => {
                const deleteAction = deletePostAction.bind(null, post.id, id);
                const updateAction = updatePostAction.bind(null, post.id, id);
                const isEditing = editPostId === post.id;
                // Merge images array and legacy image_url
                const images: string[] = post.images?.length
                  ? post.images
                  : post.image_url
                  ? [post.image_url]
                  : [];

                return (
                  <div key={post.id} className="bg-surface-container-low p-5 flex flex-col gap-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {new Date(post.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {post.source && post.source !== "manual" && (
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2 py-0.5 bg-secondary/10">
                            {post.source}
                          </span>
                        )}
                        {post.expires_at && (
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${new Date(post.expires_at) < new Date() ? "bg-error/10 text-error" : "bg-tertiary/10 text-tertiary"}`}>
                            {new Date(post.expires_at) < new Date() ? "Expired" : `Expires ${new Date(post.expires_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isEditing ? (
                          <Link
                            href={`/admin/gewerbe/${id}/posts`}
                            className="text-on-surface-variant/40 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/gewerbe/${id}/posts?edit=${post.id}`}
                            className="text-on-surface-variant/40 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </Link>
                        )}
                        <form action={deleteAction}>
                          <button type="submit" className="text-on-surface-variant/40 hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {isEditing ? (
                      /* Edit form */
                      <form action={updateAction} className="flex flex-col gap-3">
                        <textarea
                          name="content"
                          required
                          rows={4}
                          defaultValue={post.content}
                          className={`${inputClass} resize-y`}
                        />

                        {/* Existing images with individual remove */}
                        {images.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              Current images
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {images.map((url, i) => {
                                const removeAction = removePostImageAction.bind(null, post.id, id, url);
                                return (
                                  <div key={url} className="relative group">
                                    <img src={url} alt="" className="w-20 h-20 object-cover" />
                                    {i === 0 && (
                                      <span className="absolute top-1 left-1 bg-secondary text-on-secondary text-[8px] font-bold px-1 uppercase">
                                        Cover
                                      </span>
                                    )}
                                    <form action={removeAction} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button type="submit" className="bg-error text-white w-5 h-5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xs">close</span>
                                      </button>
                                    </form>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Add more images
                          </label>
                          <input
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-surface-container file:text-primary hover:file:bg-surface-container-high file:cursor-pointer cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                            Expires (leave blank to keep forever)
                          </label>
                          <input
                            name="expires_at"
                            type="date"
                            defaultValue={post.expires_at ? new Date(post.expires_at).toISOString().split("T")[0] : ""}
                            className={inputClass}
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="signature-gradient text-on-secondary text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 hover:brightness-110 transition-all"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Read view */
                      <>
                        {images.length > 0 && (
                          <div className={`grid gap-1 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                            {images.map((url) => (
                              <img key={url} src={url} alt="" className="w-full object-cover aspect-video" />
                            ))}
                          </div>
                        )}
                        <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line line-clamp-4">
                          {post.content}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
