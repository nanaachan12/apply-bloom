"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  Trash2,
  Filter,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { ReminderModal } from "@/components/reminders/ReminderModal";
import { Button } from "@/components/ui/Button";
import { ReminderDto, ApplicationDto } from "@/types";
import { REMINDER_TYPE_META, ReminderTypeType } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { getCached, setCached, clearCache } from "@/lib/cache";

export default function RemindersPage() {
  const { user, triggerXpCelebration } = useApp();
  const [filter, setFilter] = useState<"upcoming" | "completed" | "all">(
    "upcoming"
  );
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cacheKey = `reminders_${filter}_${typeFilter}`;
  const cachedReminders = getCached<ReminderDto[]>(cacheKey);
  const cachedApps = getCached<ApplicationDto[]>("reminders_apps");
  const hasCache = !!cachedReminders;

  const [reminders, setReminders] = useState<ReminderDto[]>(cachedReminders || []);
  const [applications, setApplications] = useState<ApplicationDto[]>(cachedApps || []);
  const [isLoading, setIsLoading] = useState(!hasCache);

  const fetchReminders = async (showLoading = !hasCache) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);
      const params = new URLSearchParams({ filter });
      if (typeFilter !== "ALL") params.append("type", typeFilter);

      const [remRes, appsRes] = await Promise.all([
        apiFetch(`/api/v1/reminders?${params.toString()}`),
        apiFetch("/api/v1/applications?limit=100"),
      ]);

      if (remRes.ok) {
        const json = await remRes.json();
        const list = json.data || [];
        setReminders(list);
        setCached(cacheKey, list);
      }
      if (appsRes.ok) {
        const json = await appsRes.json();
        const appList = json.data || [];
        setApplications(appList);
        setCached("reminders_apps", appList);
      }
    } catch (err) {
      console.error("Fetch reminders error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReminders(!hasCache);
    }
  }, [user, filter, typeFilter]);

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/v1/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        if (isCompleted) {
          triggerXpCelebration(5, "Kegiatan selesai! +5 XP");
        }
        fetchReminders();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus jadwal kegiatan ini?")) return;
    try {
      const res = await fetch(`/api/v1/reminders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchReminders();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading flex items-center gap-2">
              <CalendarCheck size={22} className="text-[#788B4E] dark:text-[#9BC358]" />
              <span>Agenda & Pengingat</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
              Atur jadwal wawancara kerja, tes teknis, batas waktu dokumen, dan
              email follow-up.
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} />
            <span>Tambah Jadwal</span>
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs flex flex-wrap items-center justify-between gap-3 transition-colors">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#EDF2E4] dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#263328]">
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "upcoming"
                  ? "bg-white dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] shadow-xs"
                  : "text-[#616D64] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2]"
              }`}
            >
              Mendatang
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-white dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] shadow-xs"
                  : "text-[#616D64] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2]"
              }`}
            >
              Selesai
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] shadow-xs"
                  : "text-[#616D64] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2]"
              }`}
            >
              Semua
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#616D64] dark:text-[#A0B2A3] font-medium">Tipe:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-[#242D22] dark:text-[#F1F6F2] focus:ring-2 focus:ring-[#788B4E]/30"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="INTERVIEW">Interview</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="DEADLINE">Deadline</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-3xl bg-[#EEF3E2]/60 dark:bg-[#1E281F]/40 animate-pulse border border-[#DEE7D0]/60 dark:border-[#28382A]/40"
                />
              ))}
            </div>
          ) : reminders.length > 0 ? (
            reminders.map((rem) => {
              const isDone = Boolean(rem.completedAt);
              const meta =
                REMINDER_TYPE_META[rem.type as ReminderTypeType] ||
                REMINDER_TYPE_META.OTHER;

              return (
                <div
                  key={rem.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                    isDone
                      ? "bg-[#F8FAF4]/80 dark:bg-[#182019]/60 border-[#DEE7D0] dark:border-[#263328] opacity-75"
                      : "bg-white dark:bg-[#182019] border-[#DEE7D0] dark:border-[#263328] hover:border-[#788B4E] dark:hover:border-[#9BC358]"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(e) => handleToggle(rem.id, e.target.checked)}
                      className="mt-1 rounded accent-[#788B4E] dark:accent-[#9BC358] w-5 h-5 cursor-pointer"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-semibold text-sm sm:text-base ${
                            isDone
                              ? "line-through text-[#7A8E80] dark:text-[#58685C]"
                              : "text-[#242D22] dark:text-[#F1F6F2]"
                          }`}
                        >
                          {rem.title}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {rem.application && (
                        <p className="text-xs font-medium text-[#788B4E] dark:text-[#9BC358] mt-0.5 flex items-center gap-1.5">
                          <span>{rem.application.company}</span>
                          <span className="text-[#7A8E80] dark:text-[#58685C] font-light">/</span>
                          <span>{rem.application.position}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-2.5 text-xs text-[#616D64] dark:text-[#A0B2A3] mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-[#788B4E] dark:text-[#9BC358]" />
                          {new Date(rem.dueAt).toLocaleDateString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="w-px h-3 bg-[#DEE7D0] dark:bg-[#28382A]" />
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-[#788B4E] dark:text-[#9BC358]" />
                          {new Date(rem.dueAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#DEE7D0]/60 dark:border-[#263328]">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-1 rounded-full border border-[#DEE7D0] dark:border-[#28382A]">
                        <CheckCircle2 size={13} />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2255C] dark:text-[#FA7194] bg-[#FFF0F3] dark:bg-[#2A141A] px-2.5 py-1 rounded-full border border-[#FDC4D0] dark:border-[#4B1E29]">
                        <Clock size={13} />
                        <span>Menunggu</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 rounded-xl text-[#7A8E80] hover:text-[#F45B88] hover:bg-[#FFF0F3] dark:hover:bg-[#2A141A] transition-colors cursor-pointer"
                      title="Hapus reminder"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-[#F8FAF4] dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328]">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#EDF2E4] dark:bg-[#1F2B20] flex items-center justify-center text-[#788B4E] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                <CalendarCheck size={26} />
              </div>
              <h3 className="text-base font-bold text-[#242D22] dark:text-[#F1F6F2]">
                Tidak ada agenda yang ditemukan
              </h3>
              <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] max-w-sm mx-auto mt-1">
                Jadwalkan interview, follow-up, atau tes teknis pertamamu untuk
                mendapatkan poin XP dan pengingat tepat waktu.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        applications={applications}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchReminders();
          triggerXpCelebration(5, "Jadwal berhasil ditambahkan!");
        }}
      />
    </>
  );
}
