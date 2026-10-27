"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Award,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Flower2,
  BarChart3,
  Activity,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { PlantVisual } from "@/components/garden/PlantVisual";
import { Button } from "@/components/ui/Button";
import { ReminderModal } from "@/components/reminders/ReminderModal";
import { WireframeSkeleton } from "@/components/ui/WireframeSkeleton";
import { DashboardSummaryDto, ApplicationDto } from "@/types";
import { apiFetch } from "@/lib/api";
import { getCached, setCached, clearCache } from "@/lib/cache";
import { BloomieMascot } from "@/components/mascot/BloomieMascot";

const HERO_BLOOMIE_GREETINGS = [
  "Halo! Selamat datang di ApplyBloom. Aku Bloomie, teman yang siap menemani perjalanan karirmu.",
  "Senang bertemu denganmu. Mari bersama wujudkan pekerjaan impianmu langkah demi langkah.",
  "Tetap semangat dan konsisten ya. Aku ada di sini untuk mendukung setiap proses lamaranmu.",
];

export default function DashboardPage() {
  const {
    user,
    profile,
    refreshProfile,
    openAddModal,
    triggerXpCelebration,
    refreshTimestamp,
    isLoadingAuth,
  } = useApp();

  const cachedSummary = getCached<DashboardSummaryDto>("dashboard_summary");
  const cachedApps = getCached<ApplicationDto[]>("dashboard_applications");
  const cachedEvents = getCached<any[]>("dashboard_events");
  const cachedTrends = getCached<any>("dashboard_trends");
  const hasInitialCache = !!cachedSummary && !!cachedApps;

  const [summary, setSummary] = useState<DashboardSummaryDto | null>(cachedSummary);
  const [applications, setApplications] = useState<ApplicationDto[]>(cachedApps || []);
  const [recentEvents, setRecentEvents] = useState<any[]>(cachedEvents || []);
  const [trends, setTrends] = useState<any>(cachedTrends);
  const [isLoading, setIsLoading] = useState(!hasInitialCache);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const fetchDashboardData = async (showLoading = !hasInitialCache) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);
      const [sumRes, appsRes, actRes, trendRes] = await Promise.all([
        apiFetch("/api/v1/dashboard/summary"),
        apiFetch("/api/v1/applications?limit=20"),
        apiFetch("/api/v1/dashboard/activity"),
        apiFetch("/api/v1/dashboard/trends"),
      ]);

      if (sumRes.ok) {
        const d = await sumRes.json();
        setSummary(d.data);
        setCached("dashboard_summary", d.data);
      }
      if (appsRes.ok) {
        const d = await appsRes.json();
        setApplications(d.data || []);
        setCached("dashboard_applications", d.data || []);
      }
      if (actRes.ok) {
        const d = await actRes.json();
        setRecentEvents(d.data?.events || []);
        setCached("dashboard_events", d.data?.events || []);
      }
      if (trendRes.ok) {
        const d = await trendRes.json();
        setTrends(d.data);
        setCached("dashboard_trends", d.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData(!hasInitialCache);
    }
  }, [user, refreshTimestamp]);

  const handleToggleReminder = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/v1/reminders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        if (isCompleted) {
          triggerXpCelebration(5, "Agenda selesai! (+5 XP)");
        }
        fetchDashboardData();
        refreshProfile();
      }
    } catch {
      // ignore
    }
  };

  const handleWaterPlant = async () => {
    try {
      const res = await apiFetch("/api/v1/gamification/water", {
        method: "POST",
      });
      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Gagal menyiram tanaman");
        return false;
      }

      triggerXpCelebration(5, json.message || "Tanaman berhasil disiram! +5 XP");

      setSummary((prev: any) =>
        prev
          ? {
              ...prev,
              totalXp: json.totalXp,
              level: json.level,
              plantStage: json.plantStage,
              waterCountToday: json.waterCountToday,
              remainingWater: json.remainingWater,
              canWater: json.canWater,
            }
          : prev
      );

      clearCache("dashboard_");
      clearCache("garden_");
      refreshProfile();
      return true;
    } catch {
      return false;
    }
  };

  if (isLoadingAuth) {
    return <WireframeSkeleton type="dashboard" />;
  }

  return (
    <>
      {isLoading ? (
        <WireframeSkeleton type="dashboard" />
      ) : (
        <div className="space-y-6">
          {/* Welcome Hero Banner with bekgrond.webp Background Illustration */}
          <div className="relative p-6 sm:p-8 rounded-3xl sm:rounded-[2.2rem] border border-[#DEE7D0] dark:border-[#2C3B2E] shadow-2xs transition-colors duration-200">
            {/* Masked Background Container - Keeps background strictly within rounded corners without clipping speech bubble */}
            <div className="absolute inset-0 rounded-3xl sm:rounded-[2.2rem] overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 bg-cover bg-center sm:bg-right bg-no-repeat transition-all duration-300"
                style={{
                  backgroundImage: `url('/images/bekgrond.webp')`,
                }}
              />
              {/* Gradient Overlays for High Legibility in Light & Dark Mode */}
              <div className="absolute inset-0 bg-linear-to-r from-white/90 via-white/80 to-white/40 dark:from-[#111712]/95 dark:via-[#111712]/85 dark:to-[#1b251d]/65 backdrop-blur-[0.5px]" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 dark:bg-[#233125]/90 text-[#556832] dark:text-[#A8D063] border border-[#D5E0BF] dark:border-[#354837] mb-2.5 shadow-xs backdrop-blur-xs">
                  <span>Career & Application Tracker</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading drop-shadow-2xs">
                  Selamat datang, {user ? user.name : "Kandidat"}
                </h2>
                <p className="text-xs sm:text-sm text-[#4F5D4F] dark:text-[#A5B7A7] mt-1.5 leading-relaxed font-medium">
                  Pantau seluruh proses rekrutmen kerja dan bangun kebiasaan melamar yang terstruktur setiap hari.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4">
                  <Button size="sm" variant="primary" onClick={openAddModal}>
                    <Plus size={14} />
                    <span>Tambah Lamaran</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsReminderModalOpen(true)}
                    className="bg-white/80 dark:bg-[#1A221C]/80 backdrop-blur-xs"
                  >
                    <Clock size={14} />
                    <span>Jadwalkan Agenda</span>
                  </Button>
                </div>
              </div>

              {/* Bloomie Welcome Mascot - Floating on Front Layer */}
              <div className="relative z-30 flex flex-col items-center shrink-0 self-center sm:self-end sm:pr-4 pt-10 sm:pt-14 pb-1">
                <BloomieMascot
                  mood="auto"
                  size="md"
                  bubblePlacement="top"
                  speechList={HERO_BLOOMIE_GREETINGS}
                />
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Applications */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-[#647363] dark:text-[#8E9F90] uppercase tracking-wider">
                  Total Lamaran
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#EEF3E2] dark:bg-[#233125] flex items-center justify-center text-[#556832] dark:text-[#A8D063]">
                  <Briefcase size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#242D22] dark:text-[#F1F6F2]">
                  {summary?.totalApplications ?? 0}
                </span>
                <span className="text-xs text-[#556832] dark:text-[#A8D063] font-semibold">
                  +{summary?.weeklyCount ?? 0} minggu ini
                </span>
              </div>
              <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] mt-1">
                Lowongan yang dipantau
              </p>
            </div>

            {/* Interviews & Assessment */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-[#647363] dark:text-[#8E9F90] uppercase tracking-wider">
                  Interview
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] dark:bg-[#16271C] flex items-center justify-center text-[#1E5236] dark:text-[#78C296]">
                  <Users size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#242D22] dark:text-[#F1F6F2]">
                  {summary?.interviewsCount ?? 0}
                </span>
                <span className="text-xs font-semibold text-[#1E5236] dark:text-[#78C296]">
                  Tahap krusial
                </span>
              </div>
              <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] mt-1">
                Interview & assessment
              </p>
            </div>

            {/* Offers - Fresh Strawberry Pink Accent */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-[#647363] dark:text-[#8E9F90] uppercase tracking-wider">
                  Penawaran (Offers)
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F3] dark:bg-[#2F151F] flex items-center justify-center text-[#C2255C] dark:text-[#FA7194]">
                  <Award size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#242D22] dark:text-[#F1F6F2]">
                  {summary?.offersCount ?? 0}
                </span>
                <span className="text-xs font-semibold text-[#C2255C] dark:text-[#FA7194]">
                  Target tercapai
                </span>
              </div>
              <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] mt-1">
                Surat penawaran resmi
              </p>
            </div>

            {/* Pending / In Review */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] sm:text-xs font-semibold text-[#647363] dark:text-[#8E9F90] uppercase tracking-wider">
                  Sedang Diproses
                </span>
                <div className="w-8 h-8 rounded-xl bg-[#FEF9EE] dark:bg-[#262015] flex items-center justify-center text-[#94621A] dark:text-[#E3B35B]">
                  <Clock size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#242D22] dark:text-[#F1F6F2]">
                  {summary?.pendingCount ?? 0}
                </span>
                <span className="text-xs font-semibold text-[#94621A] dark:text-[#E3B35B]">
                  Dalam review
                </span>
              </div>
              <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] mt-1">
                Wishlist, applied, screening
              </p>
            </div>
          </div>

          {/* 2-Column Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Mini Bloom Garden + Trends Chart */}
            <div className="lg:col-span-7 space-y-6">
              {/* Mini Bloom Garden Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEE7D0]/60 dark:border-[#263328]">
                  <div className="flex items-center gap-2">
                    <Flower2 size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
                    <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2]">
                      Kebun Karir Virtual
                    </h3>
                  </div>
                  <Link
                    href="/garden"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#556832] dark:text-[#A8D063] hover:underline"
                  >
                    <span>Buka Kebun Lengkap</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Plant Visual */}
                <div className="my-2">
                  <PlantVisual
                    stage={summary?.plantStage ?? profile?.plantStage ?? 1}
                    level={summary?.level ?? profile?.level ?? 2}
                    interactive={true}
                    waterCountToday={summary?.waterCountToday ?? profile?.waterCountToday ?? 0}
                    maxWaterPerDay={summary?.maxWaterPerDay ?? profile?.maxWaterPerDay ?? 3}
                    remainingWater={summary?.remainingWater ?? profile?.remainingWater ?? 3}
                    canWater={summary?.canWater ?? profile?.canWater ?? true}
                    onWater={handleWaterPlant}
                  />
                </div>

                {/* Level Progress */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1E281F] border border-[#DEE7D0] dark:border-[#2C3B2E] mt-2 transition-colors">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#EDF2E4] dark:bg-[#233125] text-[#556534] dark:text-[#9BC358] text-[10px] font-bold">
                        Level {summary?.level ?? 1}
                      </span>
                      <span>{summary?.plantStageName}</span>
                    </span>
                    <span className="text-[#556832] dark:text-[#A8D063]">
                      {(summary?.totalXp ?? 0) % 100} / 100 XP
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#DEE7D0] dark:bg-[#28362A] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#788B4E] dark:bg-[#9BC358] transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (summary?.totalXp ?? 0) % 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] mt-2 text-center">
                    Butuh {100 - ((summary?.totalXp ?? 0) % 100)} XP lagi untuk
                    naik ke Level {(summary?.level ?? 1) + 1}
                  </p>
                </div>
              </div>

              {/* Weekly Applications Chart */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
                    <span>Aktivitas Melamar 7 Hari Terakhir</span>
                  </h3>
                  <span className="text-xs text-[#647363] dark:text-[#8E9F90]">
                    Total {summary?.weeklyCount ?? 0} lamaran
                  </span>
                </div>

                {/* Simple Clean Bar Chart */}
                <div className="pt-4 pb-2">
                  <div className="flex items-end justify-between gap-2 h-36 border-b border-[#DEE7D0] dark:border-[#263328] pb-2 px-2">
                    {trends?.weeklyTrends?.map((d: any, idx: number) => {
                      const maxVal = Math.max(
                        3,
                        ...(trends.weeklyTrends.map((t: any) => t.count) || [3])
                      );
                      const heightPercent = Math.max(
                        10,
                        Math.round((d.count / maxVal) * 100)
                      );

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                        >
                          <span className="text-[10px] font-bold text-[#556832] dark:text-[#A8D063] opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.count}
                          </span>
                          <div
                            className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 ${
                              d.count > 0
                                ? "bg-[#788B4E] dark:bg-[#9BC358] shadow-2xs group-hover:bg-[#63733E]"
                                : "bg-[#DEE7D0] dark:bg-[#263328]"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[10px] text-[#647363] dark:text-[#8E9F90] truncate w-full text-center">
                            {d.label.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Upcoming Reminders & Activity Timeline */}
            <div className="lg:col-span-5 space-y-6">
              {/* Upcoming Reminders Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEE7D0]/60 dark:border-[#263328]">
                  <div className="flex items-center gap-2">
                    <Clock size={17} className="text-[#788B4E] dark:text-[#9BC358]" />
                    <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2]">
                      Agenda & Pengingat
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsReminderModalOpen(true)}
                  >
                    <Plus size={13} />
                    <span>Tambah</span>
                  </Button>
                </div>

                <div className="mt-4 space-y-2.5">
                  {summary?.upcomingReminders &&
                  summary.upcomingReminders.length > 0 ? (
                    summary.upcomingReminders.map((rem) => (
                      <div
                        key={rem.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-start justify-between gap-3 hover:border-[#788B4E] dark:hover:border-[#9BC358] transition-all shadow-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={Boolean(rem.completedAt)}
                            onChange={(e) =>
                              handleToggleReminder(rem.id, e.target.checked)
                            }
                            className="mt-1 rounded accent-[#788B4E] dark:accent-[#9BC358] w-4 h-4 cursor-pointer"
                          />
                          <div>
                            <p className={`text-xs sm:text-sm font-bold ${Boolean(rem.completedAt) ? "line-through text-[#8D9B91] dark:text-[#58685C]" : "text-[#242D22] dark:text-[#F1F6F2]"}`}>
                              {rem.title}
                            </p>
                            {rem.application && (
                              <p className="text-[11px] font-medium text-[#788B4E] dark:text-[#9BC358] mt-0.5 flex items-center gap-1.5">
                                <span>{rem.application.company}</span>
                                <span className="text-[#7A8E80] dark:text-[#58685C] font-light">/</span>
                                <span>{rem.application.position}</span>
                              </p>
                            )}
                            <p className="text-[10px] text-[#7A8E80] dark:text-[#7A8E80] mt-1 flex items-center gap-1">
                              <Calendar size={11} />
                              <span>
                                {new Date(rem.dueAt).toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDF2E4] dark:bg-[#1C251D] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] shrink-0">
                          {rem.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-[#7A8E80]">
                      Tidak ada agenda mendesak saat ini.
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEE7D0]/60 dark:border-[#263328] text-center">
                  <Link
                    href="/reminders"
                    className="text-xs font-semibold text-[#788B4E] dark:text-[#9BC358] hover:underline"
                  >
                    Lihat Semua Kalender Jadwal →
                  </Link>
                </div>
              </div>

              {/* Recent Activity Timeline */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs transition-colors">
                <div className="flex items-center justify-between pb-4 border-b border-[#DEE7D0]/60 dark:border-[#263328]">
                  <div className="flex items-center gap-2">
                    <Activity size={17} className="text-[#788B4E] dark:text-[#9BC358]" />
                    <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2]">
                      Aktivitas Terbaru
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  {recentEvents && recentEvents.length > 0 ? (
                    recentEvents.slice(0, 5).map((ev) => (
                      <div key={ev.id} className="flex items-start gap-3 text-xs">
                        <div className="w-7 h-7 rounded-full bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                          <CheckCircle2 size={13} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">
                            {ev.application?.company}: {ev.toStatus || "Update"}
                          </p>
                          <p className="text-[11px] text-[#5A695C] dark:text-[#A0B2A3] leading-relaxed">
                            {ev.description || "Perubahan status lamaran"}
                          </p>
                          <span className="text-[10px] text-[#8D9B91] dark:text-[#677769]">
                            {new Date(ev.occurredAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#7A8E80] text-center py-4">
                      Belum ada riwayat aktivitas.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        applications={applications}
        onSuccess={() => {
          triggerXpCelebration(5, "Jadwal berhasil ditambahkan (+5 XP)");
          fetchDashboardData();
        }}
      />
    </>
  );
}
