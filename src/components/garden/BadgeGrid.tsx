"use client";

import React from "react";
import {
  Sprout,
  TreePine,
  CalendarCheck2,
  Flame,
  Flower2,
  Award,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { BadgeDto } from "@/types";

interface BadgeGridProps {
  badges: BadgeDto[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Sprout":
        return <Sprout size={24} className="text-emerald-500" />;
      case "TreePine":
        return <TreePine size={24} className="text-teal-600" />;
      case "CalendarCheck2":
        return <CalendarCheck2 size={24} className="text-purple-500" />;
      case "Flame":
        return <Flame size={24} className="text-amber-500" />;
      case "Flower2":
        return <Flower2 size={24} className="text-pink-500" />;
      default:
        return <Award size={24} className="text-indigo-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const threshold = badge.threshold || 1;
        const progress = Math.min(threshold, badge.currentProgress || 0);
        const percent = Math.round((progress / threshold) * 100);

        return (
          <div
            key={badge.id}
            className={`relative p-5 rounded-3xl border transition-all duration-200 ${
              badge.isUnlocked
                ? "bg-white dark:bg-[#182019] border-[#DEE7D0] dark:border-[#263328] shadow-2xs hover:border-[#788B4E] dark:hover:border-[#9BC358] hover:shadow-xs"
                : "bg-[#F8FAF4]/70 dark:bg-[#131A14]/70 border-[#DEE7D0] dark:border-[#232E25] opacity-75"
            }`}
          >
            {/* Unlocked tag */}
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${
                  badge.isUnlocked
                    ? "bg-[#EDF2E4] dark:bg-[#1F2B20] border-[#DEE7D0] dark:border-[#28382A]"
                    : "bg-[#DEE7D0]/50 dark:bg-[#1C251D] border-[#DEE7D0]/60 dark:border-[#263328] grayscale"
                }`}
              >
                {getBadgeIcon(badge.icon)}
              </div>

              {badge.isUnlocked ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                  <CheckCircle2 size={12} />
                  <span>Terbuka</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#DEE7D0]/60 dark:bg-[#232E25] text-[#7A8E80]">
                  <Lock size={11} />
                  <span>Terkunci</span>
                </span>
              )}
            </div>

            <div className="mt-3.5">
              <h4 className="font-semibold text-base text-[#242D22] dark:text-[#F1F6F2]">
                {badge.name}
              </h4>
              <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-[#DEE7D0]/60 dark:border-[#232E25]">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#616D64] dark:text-[#A0B2A3] mb-1.5">
                <span>Progres</span>
                <span>
                  {progress} / {threshold}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#DEE7D0] dark:bg-[#232E25] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.isUnlocked ? "bg-[#788B4E] dark:bg-[#9BC358]" : "bg-[#A3B3A6] dark:bg-[#3B4D3E]"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {badge.earnedAt && (
                <p className="text-[10px] text-[#7A8E80] mt-2">
                  Diraih pada:{" "}
                  {new Date(badge.earnedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
