"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Droplets, Clock } from "lucide-react";
import { PLANT_STAGES } from "@/lib/constants";

interface PlantVisualProps {
  stage: number;
  level: number;
  interactive?: boolean;
  waterCountToday?: number;
  maxWaterPerDay?: number;
  remainingWater?: number;
  canWater?: boolean;
  onWater?: () => Promise<boolean | void> | void;
}

export function PlantVisual({
  stage = 0,
  level = 1,
  interactive = true,
  waterCountToday = 0,
  maxWaterPerDay = 3,
  remainingWater = 3,
  canWater = true,
  onWater,
}: PlantVisualProps) {
  const [isWatering, setIsWatering] = useState(false);
  const [lastWateredTime, setLastWateredTime] = useState<string | null>(null);

  const safeStage = Math.min(Math.max(0, stage), 4);
  const currentStageInfo = PLANT_STAGES[safeStage] || PLANT_STAGES[0];

  const isQuotaExhausted = !canWater || remainingWater <= 0;

  const handleWaterClick = async () => {
    if (isQuotaExhausted || isWatering) return;
    setIsWatering(true);

    try {
      if (onWater) {
        const result = await onWater();
        if (result === false) {
          setIsWatering(false);
          return;
        }
      }

      setLastWateredTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      // Trigger sweet confetti burst
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#2D5A43", "#D95D70", "#EBF3ED", "#FAF7F2", "#B83E51"],
        });
      } catch {
        // safe fallback
      }
    } catch {
      // ignore
    } finally {
      setTimeout(() => {
        setIsWatering(false);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Visual Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Soft Aura Glow */}
        <div
          className={`absolute inset-4 rounded-full filter blur-2xl opacity-60 transition-all duration-700 ${
            safeStage === 4
              ? "bg-amber-100/70"
              : safeStage === 3
              ? "bg-[#FDF2F4]/80"
              : safeStage >= 1
              ? "bg-[#EBF3ED]/80"
              : "bg-[#F7F4EE]/50"
          }`}
        />

        {/* Water drops animation */}
        {isWatering && (
          <div className="absolute inset-0 pointer-events-none z-20 flex justify-center">
            <span className="absolute top-10 left-28 text-emerald-600 animate-water-drop">
              <svg className="w-5 h-5 fill-emerald-500" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </span>
            <span
              className="absolute top-6 left-36 text-emerald-600 animate-water-drop"
              style={{ animationDelay: "0.2s" }}
            >
              <svg className="w-4 h-4 fill-emerald-500" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </span>
            <span
              className="absolute top-12 left-44 text-emerald-600 animate-water-drop"
              style={{ animationDelay: "0.4s" }}
            >
              <svg className="w-4 h-4 fill-emerald-500" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </span>
          </div>
        )}

        {/* Stage Plant SVG */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {safeStage === 0 && (
            // Stage 0: Seed
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 drop-shadow-md animate-float"
            >
              {/* Ground & Pot */}
              <ellipse cx="100" cy="165" rx="60" ry="12" fill="#E8DCD1" />
              <path
                d="M55,140 L65,175 C65,178 70,180 100,180 C130,180 135,178 135,175 L145,140 Z"
                fill="#C49B76"
              />
              <path
                d="M50,135 L150,135 C153,135 155,138 153,141 L150,146 C148,148 145,149 142,149 L58,149 C55,149 52,148 50,146 L47,141 C45,138 47,135 50,135 Z"
                fill="#AF8662"
              />
              {/* Soil */}
              <ellipse cx="100" cy="142" rx="42" ry="8" fill="#6B4B35" />
              {/* Seed */}
              <ellipse
                cx="100"
                cy="138"
                rx="9"
                ry="13"
                transform="rotate(20 100 138)"
                fill="#8C532B"
              />
              <path
                d="M102,128 C104,133 104,142 98,146"
                stroke="#B57644"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tiny Sparkle Dew */}
              <circle cx="97" cy="133" r="2.5" fill="#BEE3F8" />
            </svg>
          )}

          {safeStage === 1 && (
            // Stage 1: Sprout
            <svg
              viewBox="0 0 200 200"
              className="w-52 h-52 drop-shadow-md animate-sway"
            >
              {/* Pot */}
              <ellipse cx="100" cy="168" rx="55" ry="10" fill="#E8DCD1" />
              <path
                d="M58,142 L66,174 C67,177 72,179 100,179 C128,179 133,177 134,174 L142,142 Z"
                fill="#D8A47F"
              />
              <rect
                x="52"
                y="136"
                width="96"
                height="12"
                rx="4"
                fill="#C6916B"
              />
              <ellipse cx="100" cy="142" rx="40" ry="7" fill="#5C3D2E" />

              {/* Stem */}
              <path
                d="M100,142 Q100,110 98,90"
                stroke="#68A357"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Left Leaf */}
              <path
                d="M98,102 C80,95 70,105 75,115 C82,122 95,112 98,105 Z"
                fill="#82C96D"
              />
              <path
                d="M98,105 Q85,108 78,114"
                stroke="#68A357"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Right Leaf */}
              <path
                d="M98,92 C116,84 126,94 122,105 C115,112 101,102 98,95 Z"
                fill="#94DC7E"
              />
              <path
                d="M98,95 Q110,98 118,104"
                stroke="#68A357"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          )}

          {safeStage === 2 && (
            // Stage 2: Young Plant
            <svg
              viewBox="0 0 200 200"
              className="w-56 h-56 drop-shadow-md animate-sway"
            >
              {/* Ceramic Pot Pastel Sage */}
              <ellipse cx="100" cy="172" rx="58" ry="10" fill="#E2DAD2" />
              <path
                d="M55,142 L64,176 C65,180 72,182 100,182 C128,182 135,180 136,176 L145,142 Z"
                fill="#B8D0B8"
              />
              <rect
                x="50"
                y="136"
                width="100"
                height="12"
                rx="5"
                fill="#9EBA9E"
              />
              <ellipse cx="100" cy="142" rx="42" ry="7" fill="#4A3528" />

              {/* Main Stem */}
              <path
                d="M100,142 Q102,100 97,60"
                stroke="#4F853F"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Lower Left Foliage */}
              <path
                d="M98,120 C72,110 60,128 72,138 C86,144 98,130 98,124 Z"
                fill="#6BB357"
              />
              {/* Lower Right Foliage */}
              <path
                d="M101,110 C128,100 138,118 126,128 C112,135 101,122 101,115 Z"
                fill="#7CC766"
              />

              {/* Mid Leaves */}
              <path
                d="M98,88 C70,72 62,94 76,104 C90,110 98,96 98,90 Z"
                fill="#88D972"
              />
              <path
                d="M99,80 C125,66 135,85 122,96 C110,102 99,88 99,82 Z"
                fill="#94E37D"
              />

              {/* Top Leaves */}
              <path
                d="M97,60 C84,40 100,32 104,45 C106,54 99,58 97,60 Z"
                fill="#A6F08F"
              />
            </svg>
          )}

          {safeStage === 3 && (
            // Stage 3: Blooming Plant (Lavender Flowers)
            <svg
              viewBox="0 0 200 200"
              className="w-60 h-60 drop-shadow-lg animate-sway"
            >
              {/* Lavender ceramic pot */}
              <ellipse cx="100" cy="174" rx="60" ry="10" fill="#DDD5E5" />
              <path
                d="M52,142 L62,177 C63,181 72,183 100,183 C128,183 137,181 138,177 L148,142 Z"
                fill="#CDBFE3"
              />
              <rect
                x="48"
                y="136"
                width="104"
                height="12"
                rx="5"
                fill="#B8A4D4"
              />
              <ellipse cx="100" cy="142" rx="44" ry="7" fill="#3E2B20" />

              {/* Branches */}
              <path
                d="M100,142 Q100,95 95,50"
                stroke="#3E6B32"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M98,100 Q78,85 65,75"
                stroke="#3E6B32"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M99,85 Q120,70 135,62"
                stroke="#3E6B32"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Lush foliage */}
              <circle cx="80" cy="95" r="14" fill="#68B254" />
              <circle cx="120" cy="85" r="14" fill="#75C260" />
              <circle cx="95" cy="70" r="16" fill="#88D472" />

              {/* Flowers! */}
              {/* Flower Top */}
              <g transform="translate(95, 46)">
                <circle cx="-6" cy="0" r="7" fill="#E4C6F8" />
                <circle cx="6" cy="0" r="7" fill="#E4C6F8" />
                <circle cx="0" cy="-6" r="7" fill="#E4C6F8" />
                <circle cx="0" cy="6" r="7" fill="#E4C6F8" />
                <circle cx="0" cy="0" r="5" fill="#FED77C" />
              </g>

              {/* Flower Left */}
              <g transform="translate(62, 72)">
                <circle cx="-5" cy="0" r="6" fill="#F3DCFA" />
                <circle cx="5" cy="0" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="-5" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="5" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="0" r="4" fill="#FED77C" />
              </g>

              {/* Flower Right */}
              <g transform="translate(136, 60)">
                <circle cx="-5" cy="0" r="6" fill="#F3DCFA" />
                <circle cx="5" cy="0" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="-5" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="5" r="6" fill="#F3DCFA" />
                <circle cx="0" cy="0" r="4" fill="#FED77C" />
              </g>
            </svg>
          )}

          {safeStage === 4 && (
            // Stage 4: Majestic Golden Bloom
            <svg
              viewBox="0 0 200 200"
              className="w-64 h-64 drop-shadow-xl animate-glow"
            >
              {/* Golden Royal Pot */}
              <ellipse cx="100" cy="176" rx="62" ry="10" fill="#E4D5B7" />
              <path
                d="M50,140 L60,178 C62,182 72,185 100,185 C128,185 138,182 140,178 L150,140 Z"
                fill="#F3D58C"
              />
              <rect
                x="46"
                y="134"
                width="108"
                height="12"
                rx="6"
                fill="#E2BD63"
              />
              <ellipse cx="100" cy="140" rx="46" ry="7" fill="#2E1F14" />

              {/* Glowing Tree Trunk */}
              <path
                d="M100,140 Q101,90 95,45"
                stroke="#527A37"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M98,95 Q70,75 55,60"
                stroke="#527A37"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M99,80 Q125,65 145,50"
                stroke="#527A37"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Foliage Clusters */}
              <circle cx="75" cy="75" r="18" fill="#6CB855" />
              <circle cx="125" cy="65" r="18" fill="#7DC966" />
              <circle cx="95" cy="55" r="22" fill="#8FE078" />

              {/* Golden Flowers & Halo */}
              <circle
                cx="95"
                cy="38"
                r="18"
                fill="#FEEBC8"
                opacity="0.6"
                className="animate-pulse"
              />
              <g transform="translate(95, 38)">
                <circle cx="-8" cy="0" r="8" fill="#FBD38D" />
                <circle cx="8" cy="0" r="8" fill="#FBD38D" />
                <circle cx="0" cy="-8" r="8" fill="#FBD38D" />
                <circle cx="0" cy="8" r="8" fill="#FBD38D" />
                <circle cx="0" cy="0" r="6" fill="#F6AD55" />
              </g>

              <g transform="translate(52, 58)">
                <circle cx="-6" cy="0" r="6" fill="#FEEBC8" />
                <circle cx="6" cy="0" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="-6" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="6" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="0" r="4" fill="#F6AD55" />
              </g>

              <g transform="translate(145, 48)">
                <circle cx="-6" cy="0" r="6" fill="#FEEBC8" />
                <circle cx="6" cy="0" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="-6" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="6" r="6" fill="#FEEBC8" />
                <circle cx="0" cy="0" r="4" fill="#F6AD55" />
              </g>

              {/* Golden Star Emblem */}
              <g transform="translate(85, 4)">
                <polygon
                  points="10,1 12.5,7 19,7.5 14,12 15.5,18 10,14.5 4.5,18 6,12 1,7.5 7.5,7"
                  fill="#D49B35"
                />
              </g>
            </svg>
          )}
        </div>
      </div>

      {/* Stage Title & Info */}
      <div className="text-center mt-2 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] mb-1.5">
          <Sparkles size={13} className="text-[#788B4E] dark:text-[#9BC358]" />
          <span className="px-1.5 py-0.5 rounded-md bg-[#788B4E]/15 dark:bg-[#9BC358]/20 font-bold text-[11px]">
            Level {level}
          </span>
          <span>{currentStageInfo.title}</span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-[#242D22] dark:text-[#F1F6F2]">
          {currentStageInfo.name}
        </h4>
        <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] mt-1 line-clamp-2">
          {currentStageInfo.description}
        </p>
      </div>

      {/* Interactive Water Button & Daily Quota */}
      {interactive && (
        <div className="mt-4 flex flex-col items-center gap-2">
          {!isQuotaExhausted ? (
            <>
              <button
                onClick={handleWaterClick}
                disabled={isWatering}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-[#EDF2E4] dark:bg-[#1F2B20] hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Droplets
                  size={16}
                  className={`text-[#788B4E] dark:text-[#9BC358] ${
                    isWatering ? "animate-bounce" : ""
                  }`}
                />
                <span>
                  {isWatering ? "Menyirami..." : "Sirami Tanaman (+5 XP)"}
                </span>
              </button>
              <div className="flex items-center gap-2 text-[11px] text-[#616D64] dark:text-[#A0B2A3]">
                <span className="font-semibold text-[#556534] dark:text-[#9BC358]">
                  Sisa jatah hari ini: {remainingWater}/{maxWaterPerDay} kali
                </span>
                {lastWateredTime && (
                  <>
                    <span className="w-px h-2.5 bg-[#DEE7D0] dark:bg-[#28382A]" />
                    <span>Terakhir disiram pukul {lastWateredTime}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <button
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-[#EDF2E4]/40 dark:bg-[#182019] text-[#7A8E80] dark:text-[#58685C] border border-[#DEE7D0]/60 dark:border-[#263328] cursor-not-allowed opacity-80"
              >
                <Droplets size={16} className="text-[#7A8E80] dark:text-[#58685C]" />
                <span>Siram Tanaman (0/3)</span>
              </button>
              <div className="px-3.5 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                <Clock size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Siram tanaman sudah habis, kembali lagi besok</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
