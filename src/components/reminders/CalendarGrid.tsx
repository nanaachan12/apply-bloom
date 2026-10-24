"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  Calendar,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { ReminderDto } from "@/types";
import { REMINDER_TYPE_META, ReminderTypeType } from "@/lib/constants";

interface CalendarGridProps {
  reminders: ReminderDto[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onAddReminderOnDate: (date: Date) => void;
  onToggleReminder: (id: string, isCompleted: boolean) => void;
  onDeleteReminder: (id: string) => void;
}

export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const isoToDateKey = (isoString: string): string => {
  const date = new Date(isoString);
  return toDateKey(date);
};

const WEEKDAYS = [
  { short: "Sen", full: "Senin" },
  { short: "Sel", full: "Selasa" },
  { short: "Rab", full: "Rabu" },
  { short: "Kam", full: "Kamis" },
  { short: "Jum", full: "Jumat" },
  { short: "Sab", full: "Sabtu" },
  { short: "Min", full: "Minggu" },
];

const getDotColor = (type: string) => {
  switch (type) {
    case "INTERVIEW":
      return "bg-purple-500";
    case "ASSESSMENT":
      return "bg-pink-500";
    case "DEADLINE":
      return "bg-amber-500";
    case "FOLLOW_UP":
      return "bg-blue-500";
    default:
      return "bg-emerald-500";
  }
};

const getChipStyle = (type: string, isDone: boolean) => {
  if (isDone) {
    return "bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#7A8E80] dark:text-[#58685C] border-[#DEE7D0] dark:border-[#28382A] line-through";
  }
  switch (type) {
    case "INTERVIEW":
      return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900";
    case "ASSESSMENT":
      return "bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-900";
    case "DEADLINE":
      return "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    case "FOLLOW_UP":
      return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900";
    default:
      return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900";
  }
};

export function CalendarGrid({
  reminders,
  selectedDate,
  onSelectDate,
  onAddReminderOnDate,
  onToggleReminder,
  onDeleteReminder,
}: CalendarGridProps) {
  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const today = new Date();
  const todayKey = toDateKey(today);
  const selectedDateKey = toDateKey(selectedDate);

  // Group reminders by YYYY-MM-DD
  const remindersByDate = React.useMemo(() => {
    const map: Record<string, ReminderDto[]> = {};
    for (const rem of reminders) {
      const key = isoToDateKey(rem.dueAt);
      if (!map[key]) map[key] = [];
      map[key].push(rem);
    }
    return map;
  }, [reminders]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate(now);
  };

  // Build grid days
  const cells = React.useMemo(() => {
    const list: Array<{
      date: Date;
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      events: ReminderDto[];
    }> = [];

    const firstDayOfMonth = new Date(year, month, 1);
    // Monday = 0, ..., Sunday = 6
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // 1. Padding days from prev month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const d = new Date(year, month - 1, dayNum);
      const key = toDateKey(d);
      list.push({
        date: d,
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: key === todayKey,
        isSelected: key === selectedDateKey,
        events: remindersByDate[key] || [],
      });
    }

    // 2. Current month days
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const d = new Date(year, month, dayNum);
      const key = toDateKey(d);
      list.push({
        date: d,
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: key === todayKey,
        isSelected: key === selectedDateKey,
        events: remindersByDate[key] || [],
      });
    }

    // 3. Trailing days from next month (complete 7-day rows, 35 or 42 cells)
    const totalCells = Math.ceil(list.length / 7) * 7;
    const trailingCount = totalCells - list.length;
    for (let dayNum = 1; dayNum <= trailingCount; dayNum++) {
      const d = new Date(year, month + 1, dayNum);
      const key = toDateKey(d);
      list.push({
        date: d,
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: key === todayKey,
        isSelected: key === selectedDateKey,
        events: remindersByDate[key] || [],
      });
    }

    return list;
  }, [year, month, todayKey, selectedDateKey, remindersByDate]);

  // Events for selected day
  const selectedDayEvents = remindersByDate[selectedDateKey] || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Calendar Grid Left/Main Column */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-white dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328] shadow-2xs">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading capitalize">
              {currentMonth.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={handleGoToToday}
              className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] transition-colors cursor-pointer"
            >
              Hari Ini
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-[#616D64] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EDF2E4] dark:hover:bg-[#1F2B20] transition-colors cursor-pointer"
              title="Bulan sebelumnya"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-[#616D64] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EDF2E4] dark:hover:bg-[#1F2B20] transition-colors cursor-pointer"
              title="Bulan selanjutnya"
              aria-label="Bulan selanjutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days Grid Box */}
        <div className="p-2.5 sm:p-4 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs">
          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day.short}
                className={`text-[10px] sm:text-xs font-bold py-1 ${
                  idx >= 5
                    ? "text-[#C2255C] dark:text-[#FA7194]"
                    : "text-[#616D64] dark:text-[#A0B2A3]"
                }`}
              >
                <span className="sm:hidden">{day.short.slice(0, 1)}</span>
                <span className="hidden sm:inline">{day.short}</span>
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((cell) => {
              const dayEvents = cell.events;
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => {
                    onSelectDate(cell.date);
                    if (!cell.isCurrentMonth) {
                      setCurrentMonth(
                        new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
                      );
                    }
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      const agendaEl = document.getElementById("selected-date-agenda");
                      if (agendaEl) {
                        agendaEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }
                    }
                  }}
                  className={`relative flex flex-col justify-between p-1.5 sm:p-2.5 rounded-2xl border transition-all text-left cursor-pointer min-h-[54px] sm:min-h-[84px] ${
                    cell.isSelected
                      ? "ring-2 ring-[#788B4E] dark:ring-[#9BC358] bg-[#788B4E]/10 dark:bg-[#788B4E]/20 border-[#788B4E] dark:border-[#9BC358] z-10 shadow-xs"
                      : cell.isToday
                      ? "border-[#788B4E]/60 dark:border-[#9BC358]/60 bg-[#F4F8EC] dark:bg-[#1D261E]"
                      : cell.isCurrentMonth
                      ? "bg-white dark:bg-[#141A15] border-[#DEE7D0] dark:border-[#263328] hover:border-[#788B4E]/60 dark:hover:border-[#9BC358]/60"
                      : "bg-[#F8FAF4]/40 dark:bg-[#121713]/40 border-transparent opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* Top: Date Number & Today Label */}
                  <div className="w-full flex items-center justify-between gap-1">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-[11px] sm:text-xs rounded-full shrink-0 ${
                        cell.isToday
                          ? "bg-[#788B4E] text-white font-bold shadow-xs"
                          : cell.isSelected
                          ? "text-[#788B4E] dark:text-[#9BC358] font-bold"
                          : cell.isCurrentMonth
                          ? "text-[#242D22] dark:text-[#F1F6F2] font-semibold"
                          : "text-[#7A8E80] dark:text-[#58685C]"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.isToday && (
                      <span className="hidden md:inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#788B4E]/15 text-[#788B4E] dark:text-[#9BC358] uppercase tracking-wider whitespace-nowrap">
                        Hari Ini
                      </span>
                    )}
                  </div>

                  {/* Bottom: Event Indicators */}
                  {hasEvents && (
                    <div className="w-full mt-1">
                      {/* Mobile Indicator: Colored Dots */}
                      <div className="flex sm:hidden items-center justify-center gap-0.5">
                        {dayEvents.slice(0, 3).map((ev) => (
                          <span
                            key={ev.id}
                            className={`w-1.5 h-1.5 rounded-full ${getDotColor(
                              ev.type
                            )}`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] font-bold text-[#788B4E] dark:text-[#9BC358] ml-0.5">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Desktop Indicator: Mini Preview Chips */}
                      <div className="hidden sm:flex flex-col gap-1 w-full overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const isDone = Boolean(ev.completedAt);
                          return (
                            <div
                              key={ev.id}
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate border flex items-center gap-1 ${getChipStyle(
                                ev.type,
                                isDone
                              )}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor(
                                  ev.type
                                )}`}
                              />
                              <span className="font-bold shrink-0">
                                {new Date(ev.dueAt).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] font-semibold text-[#788B4E] dark:text-[#9BC358] pl-1">
                            +{dayEvents.length - 2} agenda lagi
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend / Color Guide */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] text-[11px] sm:text-xs text-[#616D64] dark:text-[#A0B2A3]">
          <span className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">
            Keterangan:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Interview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
            <span>Assessment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Deadline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>Follow-up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Lainnya</span>
          </div>
          <div className="flex items-center gap-1.5 sm:ml-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-[#788B4E] inline-block ring-2 ring-[#788B4E]/30" />
            <span>Hari Ini</span>
          </div>
        </div>
      </div>

      {/* Selected Day Agenda Right/Bottom Column */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
        <div
          id="selected-date-agenda"
          className="bg-white dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328] p-4 sm:p-5 shadow-2xs scroll-mt-20"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-3.5 border-b border-[#DEE7D0]/60 dark:border-[#263328]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#788B4E] dark:text-[#9BC358]">
                Agenda Tanggal
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading capitalize">
                {selectedDate.toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
                {selectedDayEvents.length > 0
                  ? `${selectedDayEvents.length} agenda terjadwal`
                  : "Belum ada agenda"}
              </p>
            </div>

            <button
              onClick={() => onAddReminderOnDate(selectedDate)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#788B4E] hover:bg-[#687843] dark:bg-[#9BC358] dark:hover:bg-[#8AB14A] text-white dark:text-[#131A14] text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>Tambah</span>
            </button>
          </div>

          {/* Events List for Selected Day */}
          <div className="mt-4">
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-0.5">
                {selectedDayEvents.map((rem) => {
                  const isDone = Boolean(rem.completedAt);
                  const meta =
                    REMINDER_TYPE_META[rem.type as ReminderTypeType] ||
                    REMINDER_TYPE_META.OTHER;

                  return (
                    <div
                      key={rem.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        isDone
                          ? "bg-[#F8FAF4]/80 dark:bg-[#141A15]/60 border-[#DEE7D0] dark:border-[#263328] opacity-75"
                          : "bg-[#FAFCF6] dark:bg-[#141A15] border-[#DEE7D0] dark:border-[#263328] hover:border-[#788B4E] dark:hover:border-[#9BC358]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={(e) =>
                            onToggleReminder(rem.id, e.target.checked)
                          }
                          className="mt-1 rounded accent-[#788B4E] dark:accent-[#9BC358] w-4 h-4 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className={`font-semibold text-xs sm:text-sm truncate ${
                                isDone
                                  ? "line-through text-[#7A8E80] dark:text-[#58685C]"
                                  : "text-[#242D22] dark:text-[#F1F6F2]"
                              }`}
                            >
                              {rem.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${meta.color}`}
                            >
                              {meta.label}
                            </span>
                          </div>

                          {rem.application && (
                            <p className="text-[11px] font-medium text-[#788B4E] dark:text-[#9BC358] truncate mt-0.5">
                              {rem.application.company} •{" "}
                              {rem.application.position}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 text-[11px] text-[#616D64] dark:text-[#A0B2A3] mt-1.5">
                            <Clock
                              size={12}
                              className="text-[#788B4E] dark:text-[#9BC358]"
                            />
                            <span>
                              {new Date(rem.dueAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              WIB
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteReminder(rem.id)}
                        className="p-1 rounded-lg text-[#7A8E80] hover:text-[#F45B88] hover:bg-[#FFF0F3] dark:hover:bg-[#2A141A] transition-colors cursor-pointer shrink-0"
                        title="Hapus reminder"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#F8FAF4] dark:bg-[#141A15] border border-dashed border-[#DEE7D0] dark:border-[#263328]">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#EDF2E4] dark:bg-[#1F2B20] flex items-center justify-center text-[#788B4E] dark:text-[#9BC358]">
                  <CalendarCheck size={22} />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#242D22] dark:text-[#F1F6F2]">
                  Tidak ada agenda di tanggal ini
                </h4>
                <p className="text-[11px] text-[#616D64] dark:text-[#A0B2A3] mt-1 max-w-[240px] mx-auto">
                  Belum ada jadwal wawancara, tes teknis, atau deadline pada tanggal ini.
                </p>
                <button
                  onClick={() => onAddReminderOnDate(selectedDate)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF2E4] dark:bg-[#1F2B20] hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] text-[#788B4E] dark:text-[#9BC358] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Jadwalkan Sekarang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
