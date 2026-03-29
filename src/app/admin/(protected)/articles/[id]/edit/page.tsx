import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateArticleAction, deleteArticleAction } from "../../actions";
import { ArticleForm } from "../../ArticleForm";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: article } = await supabaseAdmin.from("articles").select("*").eq("id", id).single();
  if (!article) notFound();

  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Nachrichten</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">{article.title}</h1>
        </div>
        <ArticleForm
          action={updateArticleAction.bind(null, id)}
          deleteAction={deleteArticleAction.bind(null, id)}
          defaultValues={article}
        />
      </div>
    </div>
  );
}
