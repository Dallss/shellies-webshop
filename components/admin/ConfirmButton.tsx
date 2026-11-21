"use client";

import { useState } from "react";

/**
 * A button for actions that can't be undone. The first press swaps it for an inline
 * question with the real action and a way back, instead of the browser's confirm() pop-up.
 */
export function ConfirmButton({
  label,
  question,
  confirmLabel,
  onConfirm,
  disabled = false,
  className,
}: {
  label: string;
  question: string;
  confirmLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
  className: string;
}) {
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" className={className} disabled={disabled} onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={question}
      onKeyDown={(e) => e.key === "Escape" && setAsking(false)}
      className="pop flex flex-[1_1_100%] flex-wrap items-center gap-2.5 rounded-2xl border-2 border-[#E86A6A] bg-[#FBE7EA] p-3"
    >
      <p className="min-w-0 flex-[1_1_200px] text-[15px] font-semibold text-crimson">{question}</p>
      <div className="flex gap-2">
        <button
          type="button"
          autoFocus
          disabled={disabled}
          onClick={() => {
            setAsking(false);
            onConfirm();
          }}
          className="bubbly h-11 whitespace-nowrap rounded-[14px] bg-crimson px-4 text-[15px] font-bold text-white disabled:opacity-60"
        >
          {confirmLabel}
        </button>
        <button type="button" onClick={() => setAsking(false)} className="bubbly h-11 rounded-[14px] bg-white px-4 text-[15px] font-bold text-ink">
          Keep it
        </button>
      </div>
    </div>
  );
}
