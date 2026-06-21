"use client";

import { useState, useTransition } from "react";

export function TelegramCodeCard({
  code,
  linked,
  generateAction,
}: {
  code: string | null;
  linked: boolean;
  generateAction: () => Promise<string>;
}) {
  const [currentCode, setCurrentCode] = useState(code);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    startTransition(async () => {
      const newCode = await generateAction();
      setCurrentCode(newCode);
    });
  }

  function handleCopy() {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 p-5 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-secondary text-lg">qr_code</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Telegram Code</span>
        {linked && (
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 ml-auto">Verknüpft</span>
        )}
      </div>

      {currentCode ? (
        <div className="flex items-center gap-3">
          <code className="text-2xl font-black tracking-widest text-primary bg-surface-container-low px-4 py-2 select-all">
            {currentCode}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer p-2 hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">
              {copied ? "check" : "content_copy"}
            </span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isPending}
          className="cursor-pointer signature-gradient text-on-secondary px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-40"
        >
          {isPending ? "Wird generiert..." : "Code generieren"}
        </button>
      )}

      <p className="text-[10px] text-on-surface-variant/60 mt-3">
        {currentCode
          ? "Diesen Code dem Partner geben. Er sendet ihn an den Telegram Bot um sein Profil zu verknüpfen."
          : "Generiert einen einzigartigen Code für diesen Partner."}
      </p>
    </div>
  );
}
