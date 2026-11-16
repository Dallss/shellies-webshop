"use client";

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-[34px] w-[60px] flex-none rounded-full border-[3px] border-ink transition-colors duration-300 ${checked ? "bg-ink" : "bg-transparent"}`}
    >
      <span
        className={`absolute top-[3px] h-[22px] w-[22px] rounded-full transition-[left,background-color] duration-500 ease-[var(--ease-bubble)] ${checked ? "left-[29px] bg-white" : "left-[3px] bg-ink"}`}
      />
    </button>
  );
}
