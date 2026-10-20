"use client";

import React from "react";

function PlaceholderIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

interface WireframeSkeletonProps {
  type?: "dashboard" | "pipeline" | "applications" | "garden" | "generic";
}

export function WireframeSkeleton({ type = "generic" }: WireframeSkeletonProps) {
  if (type === "dashboard") {
    return (
      <div className="space-y-6 animate-pulse select-none" aria-busy="true" aria-label="Memuat Dashboard...">
        {/* Welcome Banner Skeleton */}
        <div className="p-5 sm:p-7 rounded-3xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126]">
          <div className="space-y-3 max-w-xl">
            {/* Tag pill */}
            <div className="w-36 h-5 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
            {/* Heading */}
            <div className="w-4/5 sm:w-80 h-7 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
            {/* Description lines */}
            <div className="w-full sm:w-96 h-4 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="w-32 h-8 rounded-xl bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
              <div className="w-32 h-8 rounded-xl border-2 border-[#AFC7A5]/50 dark:border-[#334636]" />
            </div>
          </div>
        </div>

        {/* 4 Stat Cards Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-20 h-3 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
                <div className="w-8 h-8 rounded-xl bg-[#D6E5CF] dark:bg-[#233125]" />
              </div>
              <div className="flex items-baseline gap-2">
                <div className="w-14 h-7 rounded-md bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
                <div className="w-16 h-3 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
              </div>
              <div className="w-28 h-2.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
            </div>
          ))}
        </div>

        {/* Bottom 2 Section Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Garden Preview Card Skeleton */}
          <div className="p-5 rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-40 h-5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
              <div className="w-24 h-4 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
            </div>
            <div className="h-44 rounded-xl bg-[#E2EEDD] dark:bg-[#1A251C] flex items-center justify-center">
              <PlaceholderIcon className="w-10 h-10 text-[#AFC7A5] dark:text-[#384C3B]" />
            </div>
          </div>

          {/* Agenda & Pengingat Card Skeleton */}
          <div className="p-5 rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-36 h-5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
              <div className="w-20 h-6 rounded-lg bg-[#D6E5CF] dark:bg-[#233125]" />
            </div>
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="p-3.5 rounded-xl bg-[#E2EEDD] dark:bg-[#1A251C] flex items-center justify-between gap-3"
              >
                <div className="space-y-1.5 w-2/3">
                  <div className="w-3/4 h-3.5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
                  <div className="w-1/2 h-2.5 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
                </div>
                <div className="w-14 h-4 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "pipeline") {
    return (
      <div className="space-y-5 animate-pulse select-none" aria-busy="true" aria-label="Memuat Pipeline...">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="w-48 h-6 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
            <div className="w-72 sm:w-96 h-3.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
          </div>
          <div className="w-36 h-9 rounded-xl bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
        </div>

        {/* Horizontal Status Pills Skeleton (mobile view) */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {[1, 2, 3, 4, 5].map((p) => (
            <div key={p} className="w-20 h-7 rounded-xl bg-[#EEF5EB] dark:bg-[#162018] shrink-0" />
          ))}
        </div>

        {/* 5 Column Kanban Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {[1, 2, 3, 4, 5].map((col) => (
            <div
              key={col}
              className="p-3.5 rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] space-y-3 min-h-[320px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DEEAD9] dark:border-[#243126]">
                <div className="w-20 h-4 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
                <div className="w-6 h-4 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
              </div>

              {[1, 2].map((card) => (
                <div
                  key={card}
                  className="p-3 rounded-xl bg-white dark:bg-[#1D281F] border border-[#E2EEDD] dark:border-[#2A3A2C] space-y-2.5 shadow-2xs"
                >
                  <div className="w-3/4 h-3.5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
                  <div className="w-1/2 h-2.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
                  <div className="flex justify-between items-center pt-1 border-t border-[#F0F5ED] dark:border-[#243226]">
                    <div className="w-12 h-3.5 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
                    <div className="w-8 h-2.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "applications") {
    return (
      <div className="space-y-5 animate-pulse select-none" aria-busy="true" aria-label="Memuat Lamaran...">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="w-48 h-6 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
            <div className="w-64 h-3.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
          </div>
          <div className="w-36 h-9 rounded-xl bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
        </div>

        {/* Filter bar */}
        <div className="p-3 rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] flex flex-wrap items-center justify-between gap-3">
          <div className="w-56 h-8 rounded-xl bg-[#D6E5CF] dark:bg-[#233125]" />
          <div className="flex gap-2">
            {[1, 2, 3].map((t) => (
              <div key={t} className="w-16 h-7 rounded-xl bg-[#D6E5CF] dark:bg-[#233125]" />
            ))}
          </div>
        </div>

        {/* Rows Skeleton */}
        <div className="rounded-2xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] divide-y divide-[#DEEAD9] dark:divide-[#243126] overflow-hidden">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#CCDDC4] dark:bg-[#2A3B2D] shrink-0" />
                <div className="space-y-1.5">
                  <div className="w-36 sm:w-48 h-3.5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
                  <div className="w-24 sm:w-32 h-2.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
                </div>
              </div>
              <div className="w-20 h-5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D] hidden sm:block" />
              <div className="w-16 h-3 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "garden") {
    return (
      <div className="space-y-6 animate-pulse select-none" aria-busy="true" aria-label="Memuat Kebun...">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] text-center space-y-3">
          <div className="w-28 h-5 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D] mx-auto" />
          <div className="w-60 h-7 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D] mx-auto" />
          <div className="w-48 h-3.5 rounded-full bg-[#DDE9D7] dark:bg-[#1E2B20] mx-auto" />

          {/* Plant visual silhouette */}
          <div className="h-56 max-w-sm mx-auto mt-4 rounded-2xl bg-[#E2EEDD] dark:bg-[#1A251C] flex flex-col items-center justify-center gap-2">
            <PlaceholderIcon className="w-12 h-12 text-[#AFC7A5] dark:text-[#384C3B]" />
            <div className="w-24 h-3 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback
  return (
    <div
      className="p-6 rounded-3xl bg-[#EEF5EB] dark:bg-[#162018] border border-[#DEEAD9] dark:border-[#243126] animate-pulse select-none space-y-4"
      aria-busy="true"
      aria-label="Memuat konten..."
    >
      <div className="w-2/5 h-6 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
      <div className="w-4/5 h-8 rounded-full bg-[#CCDDC4] dark:bg-[#2A3B2D]" />
      <div className="w-3/5 h-5 rounded-full bg-[#D6E5CF] dark:bg-[#233125]" />
      <div className="w-full h-px bg-[#DEEAD9] dark:bg-[#243126] my-2" />
      <div className="w-28 h-7 rounded-full border-2 border-[#8C9F73]/50 dark:border-[#526841]" />
    </div>
  );
}
