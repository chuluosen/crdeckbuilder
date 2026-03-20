"use client";

import { useState } from "react";

export function CopyDeckButton({ cardIds }: { cardIds: number[] }) {
  const [copied, setCopied] = useState(false);

  const deckLink = `https://link.clashroyale.com/deck/en?deck=${cardIds.join(";")}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deckLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = deckLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-3 w-full py-2 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
    >
      {copied ? "Copied!" : "Copy Deck Link"}
    </button>
  );
}
