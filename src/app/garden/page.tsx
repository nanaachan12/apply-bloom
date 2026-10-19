"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Flower2,
  Sparkles,
  Flame,
  Award,
  Clock,
  Droplets,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { AppLayout, useApp } from "@/components/layout/AppLayout";
import { PlantVisual } from "@/components/garden/PlantVisual";
import { BadgeGrid } from "@/components/garden/BadgeGrid";
import { Button } from "@/components/ui/Button";
import { BadgeDto, XpTransactionDto } from "@/types";
import { PLANT_STAGES, XP_RULES } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

export default function BloomGardenPage() {
  const { user, profile, refreshProfile, triggerXpCelebration } = useApp();

  const [gamificationData, setGamificationData] = useState<any>(null);
  const [badges, setBadges] = useState<BadgeDto[]>([]);
  const [xpHistory, setXpHistory] = useState<XpTransactionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGardenData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [gamRes, badRes, histRes] = await Promise.all([
        apiFetch("/api/v1/gamification/me"),
        apiFetch("/api/v1/gamification/badges"),
        apiFetch("/api/v1/gamification/xp-history"),
      ]);

      if (gamRes.ok) {
        const j = await gamRes.json();
        setGamificationData(j.data);
      }
      if (badRes.ok) {
        const j = await badRes.json();
        setBadges(j.data || []);
      }
      if (histRes.ok) {
        const j = await histRes.json();
        setXpHistory(j.data || []);
      }
    } catch (err) {
      console.error("Garden data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGardenData();
    }
  }, [user]);

  const currentLevel = gamificationData?.level ?? profile?.level ?? 1;
  const currentStage =
    gamificationData?.plantStage ?? profile?.plantStage ?? 0;
  const currentXp = gamificationData?.totalXp ?? profile?.totalXp ?? 0;
  const xpInLevel = currentXp % 100;
  const xpNeeded = 100 - xpInLevel;
  const progressPercent = Math.min(100, Math.max(0, xpInLevel));

  return (
    <AppLayout>
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
                <Sparkles size={13} className="text-[#788B4E] dark:text-[#9BC358]" />
                <span>Total {currentXp} XP</span>
              </span>
            </div>

            <span className="text-xs text-[#7A8E80]">
              Rekor Streak Terpanjang:{" "}
              <strong className="text-[#242D22] dark:text-[#F1F6F2]">
                {gamificationData?.longestStreak ?? 1} Hari
              </strong>
            </span>
          </div>

          {/* Plant Illustration */}
          <div className="my-4">
            <PlantVisual
              stage={currentStage}
              level={currentLevel}
              interactive={true}
              onWater={() => {
                triggerXpCelebration(5, "Tanaman berhasil disiram!");
                refreshProfile();
              }}
            />
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
    </AppLayout>
  );
}
