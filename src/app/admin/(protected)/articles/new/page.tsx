import { createArticleAction } from "../actions";
import { ArticleForm } from "../ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="max-w-3xl">
        <div className="pb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Nachrichten</p>
          <h1 className="text-3xl font-headline font-black tracking-tighter text-primary">Neuer Artikel</h1>
        </div>
        <ArticleForm action={createArticleAction} />
      </div>
    </div>
  );
}
