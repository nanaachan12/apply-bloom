"use client";

import React from "react";
import {
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Building,
  ArrowRight,
} from "lucide-react";
import { ApplicationDto } from "@/types";
import {
  APPLICATION_STATUS,
  STATUS_META,
  ApplicationStatusType,
} from "@/lib/constants";

interface PipelineBoardProps {
  applications: ApplicationDto[];
  onSelectApplication: (app: ApplicationDto) => void;
  onMoveStatus: (appId: string, newStatus: ApplicationStatusType) => void;
}

const PIPELINE_COLUMNS: ApplicationStatusType[] = [
  "WISHLIST",
  "APPLIED",
  "SCREENING",
  "ASSESSMENT",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export function PipelineBoard({
  applications,
  onSelectApplication,
  onMoveStatus,
}: PipelineBoardProps) {
  const getNextStatus = (
    current: ApplicationStatusType
  ): ApplicationStatusType | null => {
    switch (current) {
      case "WISHLIST":
        return "APPLIED";
      case "APPLIED":
        return "SCREENING";
      case "SCREENING":
        return "ASSESSMENT";
      case "ASSESSMENT":
        return "INTERVIEW";
      case "INTERVIEW":
        return "OFFER";
      default:
        return null;
    }
  };

  const [activeMobileCol, setActiveMobileCol] = React.useState<ApplicationStatusType>("WISHLIST");

  return (
    <div className="space-y-3">
      {/* Mobile Column Quick Select Tabs */}
      <div className="sm:hidden flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PIPELINE_COLUMNS.map((colStatus) => {
          const count = applications.filter((a) => a.status === colStatus).length;
          const isActive = activeMobileCol === colStatus;
          return (
            <button
              key={colStatus}
              onClick={() => {
                setActiveMobileCol(colStatus);
                const el = document.getElementById(`pipeline-col-${colStatus}`);
                el?.scrollIntoView({ behavior: "smooth", inline: "center" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#788B4E] dark:bg-[#9BC358] text-white dark:text-[#0C100D] shadow-xs"
                  : "bg-[#F8FAF4] dark:bg-[#182019] text-[#616D64] dark:text-[#A0B2A3] border border-[#DEE7D0] dark:border-[#263328]"
              }`}
            >
              <span>{STATUS_META[colStatus].label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-white/20 text-white dark:text-[#0C100D]" : "bg-[#EDF2E4] dark:bg-[#232E25] text-[#556534] dark:text-[#A0B2A3]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[550px] scrollbar-thin snap-x snap-mandatory">
        {PIPELINE_COLUMNS.map((colStatus) => {
          const colMeta = STATUS_META[colStatus];
          const colApps = applications.filter((a) => a.status === colStatus);

          return (
            <div
              key={colStatus}
              id={`pipeline-col-${colStatus}`}
              className="w-[82vw] sm:w-72 shrink-0 snap-start bg-[#F8FAF4] dark:bg-[#131A14] rounded-3xl border border-[#DEE7D0] dark:border-[#232E25] p-3 flex flex-col max-h-[750px] shadow-2xs transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${colMeta.dotBg}`} />
                  <h3 className="font-bold text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2]">
                    {colMeta.label}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-[#1C251D] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                  {colApps.length}
                </span>
              </div>

              {/* Applications Cards in Column */}
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {colApps.map((app) => {
                  const nextStatus = getNextStatus(app.status);

                  return (
                    <div
                      key={app.id}
                      onClick={() => onSelectApplication(app)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs hover:shadow-xs hover:border-[#788B4E] dark:hover:border-[#9BC358] transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#7A8E80] uppercase tracking-wider">
                          {app.company}
                        </span>
                        {app.reminders && app.reminders.length > 0 && (
                          <span className="text-[10px] font-semibold text-[#C2255C] dark:text-[#FA7194] bg-[#FFF0F3] dark:bg-[#2A141A] border border-[#FDC4D0] dark:border-[#4B1E29] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                            <Clock size={10} />
                            {app.reminders.length}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2] mt-0.5 group-hover:text-[#788B4E] dark:group-hover:text-[#9BC358] transition-colors line-clamp-1">
                        {app.position}
                      </h4>

                      {app.location && (
                        <p className="flex items-center gap-1 text-[11px] text-[#616D64] dark:text-[#A0B2A3] mt-1.5">
                          <MapPin size={11} className="shrink-0 text-[#7A8E80]" />
                          <span className="truncate">{app.location}</span>
                        </p>
                      )}

                      {/* Quick Move Button */}
                      {nextStatus && (
                        <div className="mt-3 pt-2.5 border-t border-[#DEE7D0]/60 dark:border-[#232E25] flex items-center justify-between">
                          <span className="text-[10px] text-[#7A8E80]">
                            Langkah berikutnya:
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveStatus(app.id, nextStatus);
                            }}
                            title={`Pindahkan ke ${STATUS_META[nextStatus].label}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#556534] dark:text-[#9BC358] hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] transition-colors cursor-pointer"
                          >
                            <span>{STATUS_META[nextStatus].label}</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {colApps.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#7A8E80] italic border border-dashed border-[#DEE7D0] dark:border-[#263328] rounded-2xl">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
