import React from "react";
import { STATUS_META, ApplicationStatusType } from "@/lib/constants";

export function StatusBadge({ status }: { status: ApplicationStatusType }) {
  const meta = STATUS_META[status] || STATUS_META.WISHLIST;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.bg} ${meta.text} ${meta.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotBg}`} />
      {meta.label}
    </span>
  );
}

export function XpBadge({ amount, size = "md" }: { amount: number; size?: "sm" | "md" }) {
  const isSm = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] border border-[#D5E0BF] dark:border-[#2C3B2E] ${
        isSm ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
    >
      <span>+{amount} XP</span>
    </span>
  );
}
