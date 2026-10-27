"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Flower2,
  Flame,
  Award,
  Clock,
  Droplets,
  HelpCircle,
  TrendingUp,
  Eye,
  Lock,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { PlantVisual, PlantStageSvg } from "@/components/garden/PlantVisual";
import { BadgeGrid } from "@/components/garden/BadgeGrid";
import { Button } from "@/components/ui/Button";
import { WireframeSkeleton } from "@/components/ui/WireframeSkeleton";
import { BadgeDto, XpTransactionDto } from "@/types";
import { PLANT_STAGES, XP_RULES } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import { getCached, setCached, clearCache } from "@/lib/cache";
import { BloomieMascot } from "@/components/mascot/BloomieMascot";

export default function BloomGardenPage() {
  const { user, profile, refreshProfile, triggerXpCelebration } = useApp();

  const cachedGam = getCached<any>("garden_gamification");
  const cachedBadges = getCached<BadgeDto[]>("garden_badges");
  const cachedHistory = getCached<XpTransactionDto[]>("garden_history");
  const hasCache = !!cachedGam;

  const [gamificationData, setGamificationData] = useState<any>(cachedGam);
  const [badges, setBadges] = useState<BadgeDto[]>(cachedBadges || []);
  const [xpHistory, setXpHistory] = useState<XpTransactionDto[]>(cachedHistory || []);
  const [isLoading, setIsLoading] = useState(!hasCache);
  const [showSilhouetteModal, setShowSilhouetteModal] = useState(false);
  const [bloomieMood, setBloomieMood] = useState<"auto" | "happy" | "sleep" | "celebrate" | "surprised" | "smile">("auto");
  const [isBloomieSmiling, setIsBloomieSmiling] = useState(false);
  const [bloomieSpeech, setBloomieSpeech] = useState<string | null>(null);

  const fetchGardenData = async (showLoading = !hasCache) => {
    if (!user) return;
    try {
      if (showLoading) setIsLoading(true);
      const [gamRes, badRes, histRes] = await Promise.all([
        apiFetch("/api/v1/gamification/me"),
        apiFetch("/api/v1/gamification/badges"),
        apiFetch("/api/v1/gamification/xp-history"),
      ]);

      if (gamRes.ok) {
        const j = await gamRes.json();
        setGamificationData(j.data);
        setCached("garden_gamification", j.data);
      }
      if (badRes.ok) {
        const j = await badRes.json();
        const b = j.data || [];
        setBadges(b);
        setCached("garden_badges", b);
      }
      if (histRes.ok) {
        const j = await histRes.json();
        const h = j.data || [];
        setXpHistory(h);
        setCached("garden_history", h);
      }
    } catch (err) {
      console.error("Garden data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGardenData(!hasCache);
    }
  }, [user]);

  const currentLevel = gamificationData?.level ?? profile?.level ?? 1;
  const currentStage =
    gamificationData?.plantStage ?? profile?.plantStage ?? 0;
  const currentXp = gamificationData?.totalXp ?? profile?.totalXp ?? 0;
  const xpInLevel = currentXp % 100;
  const xpNeeded = 100 - xpInLevel;
  const progressPercent = Math.min(100, Math.max(0, xpInLevel));

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

      // Trigger Bloomie smiling celebration effect
      setIsBloomieSmiling(true);
      setBloomieMood("smile");
      const smileMessages = [
        "Segar sekali! Terima kasih banyak sudah menyiram tanamanku hari ini!",
        "Airnya sejuk! Tanamannya senang, Bloomie juga ikut tersenyum lebar!",
        "Yaaay! Tanaman kita makin subur! Terus konsisten melamar ya!",
        "Makasih sudah disiram! Yuk rawat impian karirmu setiap hari!",
      ];
      const randomMsg = smileMessages[Math.floor(Math.random() * smileMessages.length)];
      setBloomieSpeech(randomMsg);

      setTimeout(() => {
        setIsBloomieSmiling(false);
        setBloomieMood("auto");
        setBloomieSpeech(null);
      }, 5500);

      triggerXpCelebration(5, json.message || "Tanaman berhasil disiram! +5 XP");

      setGamificationData((prev: any) => ({
        ...prev,
        totalXp: json.totalXp,
        level: json.level,
        plantStage: json.plantStage,
        waterCountToday: json.waterCountToday,
        remainingWater: json.remainingWater,
        canWater: json.canWater,
      }));

      clearCache("garden_");
      clearCache("dashboard_");
      refreshProfile();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <>
      {isLoading ? (
        <WireframeSkeleton type="garden" />
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading flex items-center gap-2">
            <Flower2 size={24} className="text-[#788B4E] dark:text-[#9BC358]" />
            <span>Bloom Garden</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
            Kebun virtual motivasi karirmu. Tanaman berkembang seiring konsistensi
            melamar dan menghadiri tahapan wawancara.
          </p>
        </div>

        {/* Big Virtual Plant Showcase */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-b from-[#EDF2E4]/70 via-white to-[#F8FAF4] dark:from-[#131A14] dark:via-[#182019] dark:to-[#131A14] border border-[#DEE7D0] dark:border-[#263328] shadow-xs flex flex-col items-center justify-center relative overflow-hidden transition-colors">
          {/* Top Info Chips */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0F3] dark:bg-[#2A141A] text-[#C2255C] dark:text-[#FA7194] border border-[#FDC4D0] dark:border-[#4B1E29] shadow-xs">
                <Flame size={14} className="text-[#F45B88]" />
                <span>
                  Streak: {gamificationData?.currentStreak ?? 1} Hari
                </span>
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                <span>Total {currentXp} XP</span>
              </span>

              <button
                type="button"
                onClick={() => setShowSilhouetteModal(true)}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#1E281F] hover:bg-[#EEF3E2] dark:hover:bg-[#28382A] text-[#556832] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] shadow-2xs transition-all cursor-pointer"
                title="Bocoran Siluet Tanaman Level 1 - 10"
              >
                <Eye size={13} className="text-[#556832] dark:text-[#9BC358] group-hover:scale-110 transition-transform" />
                <span>Bocoran Siluet</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#788B4E]/15 dark:bg-[#9BC358]/20 text-[#556832] dark:text-[#9BC358]">
                  Lv. 1-10
                </span>
              </button>
            </div>

            <span className="text-xs text-[#7A8E80]">
              Rekor Streak Terpanjang:{" "}
              <strong className="text-[#242D22] dark:text-[#F1F6F2]">
                {gamificationData?.longestStreak ?? 1} Hari
              </strong>
            </span>
          </div>

          {/* Plant & Bloomie Mascot Showcase */}
          <div className="my-4 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 w-full max-w-3xl">
            {/* The Plant */}
            <div className="flex-1 flex justify-center">
              <PlantVisual
                stage={currentStage}
                level={currentLevel}
                interactive={true}
                waterCountToday={gamificationData?.waterCountToday ?? profile?.waterCountToday ?? 0}
                maxWaterPerDay={gamificationData?.maxWaterPerDay ?? profile?.maxWaterPerDay ?? 3}
                remainingWater={gamificationData?.remainingWater ?? profile?.remainingWater ?? 3}
                canWater={gamificationData?.canWater ?? profile?.canWater ?? true}
                onWater={handleWaterPlant}
              />
            </div>

            {/* Bloomie Companion */}
            <div className="flex flex-col items-center justify-center p-3 text-center">
              <BloomieMascot
                mood={bloomieMood}
                size="md"
                isSmiling={isBloomieSmiling}
                speechText={bloomieSpeech || undefined}
                showBubble={true}
              />
              <h4 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2] mt-2 flex items-center justify-center">
                <span>Bloomie</span>
              </h4>
              <p className="text-[11px] text-[#616D64] dark:text-[#A0B2A3] mt-0.5 leading-relaxed max-w-[200px]">
                {isBloomieSmiling
                  ? "Bloomie tersenyum bahagia karena tanamannya sudah disiram!"
                  : "Ketuk Bloomie untuk sapaan, efek ceria, dan kata motivasi karir!"}
              </p>
            </div>
          </div>

          {/* Progress Bar To Next Level */}
          <div className="w-full max-w-md p-4 rounded-3xl bg-white/95 dark:bg-[#182019]/95 border border-[#DEE7D0] dark:border-[#263328] shadow-xs mt-3 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-2">
              <span>Level {currentLevel}</span>
              <span className="text-[#788B4E] dark:text-[#9BC358]">Level {currentLevel + 1}</span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#DEE7D0] dark:bg-[#232E25] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#788B4E] dark:bg-[#9BC358] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#616D64] dark:text-[#A0B2A3] mt-2">
              <span>{xpInLevel} / 100 XP</span>
              <span>{xpNeeded} XP menuju Level Berikutnya</span>
            </div>
          </div>
        </div>

        {/* Badges Collection Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-2">
                <Award size={19} className="text-[#788B4E] dark:text-[#9BC358]" />
                <span>Koleksi Lencana Pencapaian</span>
              </h3>
              <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
                Buka lencana dengan menyelesaikan tahapan pencapaian karir nyata.
              </p>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
              {badges.filter((b) => b.isUnlocked).length} / {badges.length}{" "}
              Terbuka
            </span>
          </div>

          <BadgeGrid badges={badges} />
        </div>

        {/* 2-Columns: Gamification Rules & XP History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Rules Card */}
          <div className="p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-xs transition-colors">
            <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
              <span>Aturan Perolehan XP & Level</span>
            </h3>
            <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mb-4 leading-relaxed">
              XP dihitung secara transparan di sistem untuk menghargai setiap usaha
              aktif dalam mencari pekerjaan:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between">
                <span className="font-medium text-[#242D22] dark:text-[#F1F6F2]">
                  Menambahkan lamaran baru
                </span>
                <span className="font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-0.5 rounded-md border border-[#DEE7D0] dark:border-[#28382A]">
                  +{XP_RULES.APPLICATION_CREATED} XP
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between">
                <span className="font-medium text-[#242D22] dark:text-[#F1F6F2]">
                  Mencatat interview atau assessment
                </span>
                <span className="font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-0.5 rounded-md border border-[#DEE7D0] dark:border-[#28382A]">
                  +{XP_RULES.INTERVIEW_RECORDED} XP
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between">
                <span className="font-medium text-[#242D22] dark:text-[#F1F6F2]">
                  Menyelesaikan reminder jadwal
                </span>
                <span className="font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-0.5 rounded-md border border-[#DEE7D0] dark:border-[#28382A]">
                  +{XP_RULES.REMINDER_COMPLETED} XP
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between">
                <span className="font-medium text-[#242D22] dark:text-[#F1F6F2]">
                  Memperbarui catatan evaluasi rekrutmen
                </span>
                <span className="font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-0.5 rounded-md border border-[#DEE7D0] dark:border-[#28382A]">
                  +{XP_RULES.NOTES_UPDATED} XP
                </span>
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-[#EDF2E4]/80 dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] text-[11px] text-[#556534] dark:text-[#9BC358] leading-relaxed">
              <strong>Prinsip:</strong> Status <em>Rejected</em> tidak
              pernah mengurangi XP. ApplyBloom menghargai konsistensi dan
              setiap proses perjuanganmu.
            </div>
          </div>

          {/* XP History Card */}
          <div className="p-6 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-xs transition-colors">
            <h3 className="font-heading font-bold text-base text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-2 mb-3">
              <Clock size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
              <span>Riwayat Perolehan XP</span>
            </h3>
            <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mb-4">
              Daftar transaksi XP yang telah tervalidasi oleh sistem:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {xpHistory.length > 0 ? (
                xpHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">
                        {tx.sourceType.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-[#7A8E80] mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="font-semibold text-[#556534] dark:text-[#9BC358] bg-[#EDF2E4] dark:bg-[#1F2B20] px-2.5 py-1 rounded-full border border-[#DEE7D0] dark:border-[#28382A]">
                      +{tx.amount} XP
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#7A8E80] italic text-center py-6">
                  Belum ada riwayat XP. Mulai catat lamaran pertamamu!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Silhouette Preview Modal */}
      {showSilhouetteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowSilhouetteModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#DEE7D0] dark:border-[#263328]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EDF2E4] dark:bg-[#1F2B20] flex items-center justify-center text-[#556832] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                  <Eye size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#242D22] dark:text-[#F1F6F2]">
                    Bocoran Siluet Tanaman (Level 1 - 10)
                  </h3>
                  <p className="text-xs text-[#616D64] dark:text-[#A0B2A3]">
                    Setiap kenaikan level mengubah wujud tanamanmu. Buka siluet aslinya dengan mengumpulkan XP!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSilhouetteModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A8E80] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EDF2E4] dark:hover:bg-[#28382A] transition-colors cursor-pointer"
                title="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Grid of 10 Stages */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Info & Status Banner */}
              <div className="p-3 rounded-2xl bg-[#EDF2E4]/80 dark:bg-[#1F2B20]/80 border border-[#DEE7D0] dark:border-[#28382A] flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#556832] dark:text-[#9BC358]">
                  <Sparkles size={15} />
                  <span>
                    Level kamu saat ini: <strong>Level {currentLevel}</strong> ({PLANT_STAGES[currentStage]?.title || "Benih"})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#616D64] dark:text-[#A0B2A3]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Terbuka (Warna)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-400 dark:bg-stone-600 inline-block" />
                    <span>Terkunci (Siluet)</span>
                  </span>
                </div>
              </div>

              {/* 10 Stages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {PLANT_STAGES.map((st, idx) => {
                  const stageLevel = idx + 1;
                  const isUnlocked = currentLevel >= stageLevel;
                  const isCurrent = currentLevel === stageLevel;

                  return (
                    <div
                      key={st.stage}
                      className={`relative rounded-2xl p-3 flex flex-col items-center text-center transition-all border ${
                        isCurrent
                          ? "bg-[#EDF2E4] dark:bg-[#1F2B20] border-[#788B4E] dark:border-[#9BC358] shadow-xs ring-2 ring-[#788B4E]/30"
                          : isUnlocked
                          ? "bg-white dark:bg-[#131A14] border-[#DEE7D0] dark:border-[#263328]"
                          : "bg-[#F9FAF8] dark:bg-[#141A15] border-[#E8EDE2] dark:border-[#1E2620] opacity-85 hover:opacity-100"
                      }`}
                    >
                      {/* Badge top */}
                      <div className="w-full flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isCurrent
                              ? "bg-[#788B4E] text-white"
                              : isUnlocked
                              ? "bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#556832] dark:text-[#9BC358]"
                              : "bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                          }`}
                        >
                          Lv. {stageLevel}
                        </span>
                        {isUnlocked ? (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 size={12} />
                            <span>Buka</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                            <Lock size={11} />
                            <span>Kunci</span>
                          </span>
                        )}
                      </div>

                      {/* Plant SVG Container */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center my-1">
                        <PlantStageSvg
                          stage={idx}
                          isSilhouette={!isUnlocked}
                          className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-2xs"
                        />
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-6 h-6 rounded-full bg-stone-900/40 dark:bg-stone-100/20 backdrop-blur-2xs flex items-center justify-center text-white dark:text-stone-200 shadow-xs">
                              <Lock size={11} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stage Details */}
                      <div className="mt-1 w-full">
                        <h4
                          className="font-bold text-xs text-[#242D22] dark:text-[#F1F6F2] truncate"
                          title={st.name}
                        >
                          {st.title}
                        </h4>
                        <p className="text-[10px] text-[#7A8E80] dark:text-[#8E9F92] mt-0.5">
                          {st.minXp} XP
                        </p>
                        <p
                          className="text-[10px] text-[#556832] dark:text-[#9BC358] font-medium mt-1 truncate"
                          title={st.name}
                        >
                          {isUnlocked ? st.name.split(" (")[0] : `Buka di Lv. ${stageLevel}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DEE7D0] dark:border-[#263328] bg-[#F8FAF4] dark:bg-[#141A15] flex items-center justify-between text-xs">
              <span className="text-[#616D64] dark:text-[#A0B2A3]">
                Tiap lamaran kerja, wawancara, dan siraman menambah XP menuju wujud tanaman berikutnya!
              </span>
              <button
                type="button"
                onClick={() => setShowSilhouetteModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] font-semibold hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
