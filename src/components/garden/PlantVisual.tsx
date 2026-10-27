"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Droplets, Clock } from "lucide-react";
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

export interface PlantStageSvgProps {
  stage: number;
  isSilhouette?: boolean;
  className?: string;
}

export function PlantStageSvg({
  stage,
  isSilhouette = false,
  className = "w-52 h-52 sm:w-60 sm:h-60 drop-shadow-md",
}: PlantStageSvgProps) {
  const safeStage = Math.min(Math.max(0, stage), 9);

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-300 ${
        isSilhouette ? "brightness-0 opacity-25 dark:invert dark:opacity-35 select-none pointer-events-none" : ""
      }`}
    >
      {/* Stage 0: Dormant Seed (Level 1) */}
      {safeStage === 0 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="56" ry="10" fill="#E8DCD1" />
          <path
            d="M55,142 L65,176 C66,180 72,182 100,182 C128,182 134,180 135,176 L145,142 Z"
            fill="#C49B76"
          />
          <rect x="50" y="136" width="100" height="12" rx="4" fill="#AF8662" />
          <ellipse cx="100" cy="142" rx="42" ry="7" fill="#5C3D2E" />
          {/* Seed resting in soil */}
          <ellipse
            cx="100"
            cy="136"
            rx="9"
            ry="14"
            transform="rotate(22 100 136)"
            fill="#8C532B"
          />
          <path
            d="M103,124 C106,131 105,142 98,147"
            stroke="#B57644"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="96" cy="130" r="3" fill="#BEE3F8" />
        </svg>
      )}

      {/* Stage 1: Germinating Seed & First Root (Level 2) - Clearly Cracked Seed! */}
      {safeStage === 1 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="56" ry="10" fill="#E8DCD1" />
          <path
            d="M55,142 L65,176 C66,180 72,182 100,182 C128,182 134,180 135,176 L145,142 Z"
            fill="#C49B76"
          />
          <rect x="50" y="136" width="100" height="12" rx="4" fill="#AF8662" />
          <ellipse cx="100" cy="142" rx="42" ry="7" fill="#5C3D2E" />

          {/* Root burrowing into soil */}
          <path
            d="M99,146 Q96,156 93,164"
            stroke="#EAE6DA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,148 Q103,155 106,160"
            stroke="#EAE6DA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cracked Seed Shell (Left & Right halves) */}
          <path
            d="M93,128 C85,134 87,146 95,149 C93,142 94,135 93,128 Z"
            fill="#8C532B"
          />
          <path
            d="M107,126 C115,132 113,145 105,149 C107,142 106,134 107,126 Z"
            fill="#7A4522"
          />

          {/* Tender Green Sprout emerging from center of the cracked seed */}
          <path
            d="M100,140 Q101,126 97,118"
            stroke="#68A357"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="97" cy="117" r="4.5" fill="#8AE376" />
          <circle cx="100" cy="119" r="3" fill="#A2F48F" />
        </svg>
      )}

      {/* Stage 2: Early Upright Sprout (Level 3) */}
      {safeStage === 2 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="56" ry="10" fill="#E8DCD1" />
          <path
            d="M55,142 L65,176 C66,180 72,182 100,182 C128,182 134,180 135,176 L145,142 Z"
            fill="#C49B76"
          />
          <rect x="50" y="136" width="100" height="12" rx="4" fill="#AF8662" />
          <ellipse cx="100" cy="142" rx="42" ry="7" fill="#5C3D2E" />

          {/* Slender upright green stem */}
          <path
            d="M100,142 Q100,124 99,106"
            stroke="#68A357"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pointed sprout tip */}
          <path
            d="M99,108 C94,99 104,91 99,85 C94,91 104,99 99,108 Z"
            fill="#82C96D"
          />
          <circle cx="99" cy="85" r="2.5" fill="#BEE3F8" />
        </svg>
      )}

      {/* Stage 3: Twin Seedling Leaves (Level 4) */}
      {safeStage === 3 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="56" ry="10" fill="#E8DCD1" />
          <path
            d="M55,142 L65,176 C66,180 72,182 100,182 C128,182 134,180 135,176 L145,142 Z"
            fill="#C49B76"
          />
          <rect x="50" y="136" width="100" height="12" rx="4" fill="#AF8662" />
          <ellipse cx="100" cy="142" rx="42" ry="7" fill="#5C3D2E" />

          {/* Stem */}
          <path
            d="M100,142 Q100,115 99,94"
            stroke="#68A357"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Twin Leaves */}
          <path
            d="M99,98 C78,88 68,99 74,110 C84,118 97,107 99,99 Z"
            fill="#78BA65"
          />
          <path
            d="M99,95 C120,85 130,96 124,107 C114,115 101,104 99,96 Z"
            fill="#8AE376"
          />
        </svg>
      )}

      {/* Stage 4: Young Foliage with 4 Leaves (Level 5) */}
      {safeStage === 4 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="56" ry="10" fill="#E2DAD2" />
          <path
            d="M55,142 L64,176 C65,180 72,182 100,182 C128,182 135,180 136,176 L145,142 Z"
            fill="#B8D0B8"
          />
          <rect x="50" y="136" width="100" height="12" rx="4" fill="#9EBA9E" />
          <ellipse cx="100" cy="142" rx="42" ry="7" fill="#4A3528" />

          {/* Main Stem */}
          <path
            d="M100,142 Q101,110 98,76"
            stroke="#558B43"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lower pair of leaves */}
          <path
            d="M99,114 C74,104 66,120 76,130 C88,136 99,122 99,114 Z"
            fill="#6BB357"
          />
          <path
            d="M100,108 C125,98 133,114 123,124 C111,130 100,116 100,108 Z"
            fill="#7CC766"
          />
          {/* Upper pair of fresh leaves */}
          <path
            d="M98,86 C74,72 68,88 80,98 C92,102 98,90 98,86 Z"
            fill="#8AE376"
          />
          <path
            d="M99,80 C123,66 129,82 117,92 C105,96 99,84 99,80 Z"
            fill="#A0F48D"
          />
        </svg>
      )}

      {/* Stage 5: Branching Plant with Lush Foliage (Level 6) */}
      {safeStage === 5 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="172" rx="58" ry="10" fill="#E2DAD2" />
          <path
            d="M54,142 L63,176 C64,180 72,182 100,182 C128,182 136,180 137,176 L146,142 Z"
            fill="#B8D0B8"
          />
          <rect x="49" y="136" width="102" height="12" rx="4" fill="#9EBA9E" />
          <ellipse cx="100" cy="142" rx="43" ry="7" fill="#4A3528" />

          {/* Thick branching stem */}
          <path
            d="M100,142 Q101,100 97,62"
            stroke="#437036"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,105 Q78,92 66,82"
            stroke="#437036"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,92 Q120,78 132,70"
            stroke="#437036"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foliage Clusters */}
          <circle cx="68" cy="82" r="14" fill="#68B254" />
          <circle cx="130" cy="72" r="14" fill="#75C260" />
          <circle cx="97" cy="62" r="16" fill="#88D472" />
          <circle cx="97" cy="48" r="12" fill="#9CE686" />
        </svg>
      )}

      {/* Stage 6: Pre-Budding Flower Node (Level 7) */}
      {safeStage === 6 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="173" rx="59" ry="10" fill="#DDD5E5" />
          <path
            d="M53,142 L63,177 C64,181 72,183 100,183 C128,183 136,181 137,177 L147,142 Z"
            fill="#CDBFE3"
          />
          <rect x="49" y="136" width="102" height="12" rx="4" fill="#B8A4D4" />
          <ellipse cx="100" cy="142" rx="43" ry="7" fill="#3E2B20" />

          {/* Branches */}
          <path
            d="M100,142 Q100,98 96,54"
            stroke="#3E6B32"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M98,102 Q78,88 66,78"
            stroke="#3E6B32"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,88 Q120,74 134,65"
            stroke="#3E6B32"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foliage */}
          <circle cx="72" cy="85" r="15" fill="#68B254" />
          <circle cx="126" cy="76" r="15" fill="#75C260" />
          <circle cx="96" cy="65" r="17" fill="#88D472" />
          {/* Top Closed Flower Bud */}
          <ellipse cx="96" cy="46" rx="8" ry="11" fill="#6AB855" />
          <path
            d="M94,38 C95,41 97,44 96,48 C98,44 100,41 98,38 Z"
            fill="#FA7194"
          />
        </svg>
      )}

      {/* Stage 7: Swelling Strawberry Bud (Level 8) */}
      {safeStage === 7 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="173" rx="59" ry="10" fill="#DDD5E5" />
          <path
            d="M53,142 L63,177 C64,181 72,183 100,183 C128,183 136,181 137,177 L147,142 Z"
            fill="#CDBFE3"
          />
          <rect x="49" y="136" width="102" height="12" rx="4" fill="#B8A4D4" />
          <ellipse cx="100" cy="142" rx="43" ry="7" fill="#3E2B20" />

          {/* Stems */}
          <path
            d="M100,142 Q100,95 96,52"
            stroke="#3E6B32"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M98,100 Q78,85 64,74"
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
          {/* Foliage */}
          <circle cx="75" cy="85" r="16" fill="#68B254" />
          <circle cx="124" cy="75" r="16" fill="#75C260" />
          <circle cx="96" cy="66" r="18" fill="#88D472" />

          {/* Swelling Flower Bud revealing Strawberry Pink Petals */}
          <g transform="translate(96, 44)">
            <path d="M-9,8 C-7,0 -1,-6 0,-8 C1,-6 7,0 9,8 Z" fill="#6AB855" />
            <ellipse cx="0" cy="-6" rx="8" ry="11" fill="#F45B88" />
            <ellipse cx="-4" cy="-5" rx="5" ry="9" fill="#FA7194" />
            <ellipse cx="4" cy="-5" rx="5" ry="9" fill="#FA7194" />
            <circle cx="0" cy="-7" r="3" fill="#FED77C" />
          </g>
        </svg>
      )}

      {/* Stage 8: Full Majestic Blooming Flower (Level 9) */}
      {safeStage === 8 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="174" rx="60" ry="10" fill="#DDD5E5" />
          <path
            d="M52,142 L62,177 C63,181 72,183 100,183 C128,183 137,181 138,177 L148,142 Z"
            fill="#CDBFE3"
          />
          <rect x="48" y="136" width="104" height="12" rx="4" fill="#B8A4D4" />
          <ellipse cx="100" cy="142" rx="44" ry="7" fill="#3E2B20" />

          {/* Stems */}
          <path
            d="M100,142 Q100,95 95,50"
            stroke="#3E6B32"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M98,100 Q78,85 64,74"
            stroke="#3E6B32"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,85 Q120,70 136,62"
            stroke="#3E6B32"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foliage */}
          <circle cx="78" cy="88" r="16" fill="#68B254" />
          <circle cx="122" cy="78" r="16" fill="#75C260" />
          <circle cx="95" cy="68" r="18" fill="#88D472" />

          {/* Side buds */}
          <g transform="translate(62, 70)">
            <circle cx="0" cy="0" r="5" fill="#FA7194" />
            <circle cx="0" cy="0" r="2.5" fill="#FED77C" />
          </g>
          <g transform="translate(136, 58)">
            <circle cx="0" cy="0" r="5" fill="#FA7194" />
            <circle cx="0" cy="0" r="2.5" fill="#FED77C" />
          </g>

          {/* Grand Central Flower (Strawberry Pink & Soft Rose) */}
          <g transform="translate(95, 42)">
            <circle cx="-8" cy="-2" r="8" fill="#F45B88" />
            <circle cx="8" cy="-2" r="8" fill="#F45B88" />
            <circle cx="0" cy="-9" r="8" fill="#FA7194" />
            <circle cx="-5" cy="6" r="8" fill="#FA7194" />
            <circle cx="5" cy="6" r="8" fill="#FA7194" />
            <circle cx="0" cy="0" r="6" fill="#FFD166" />
            <circle cx="0" cy="0" r="3" fill="#FFF0F3" />
          </g>
        </svg>
      )}

      {/* Stage 9: Golden Bloom & Radiant Tree (Level 10+) */}
      {safeStage === 9 && (
        <svg viewBox="0 0 200 200" className={className}>
          <ellipse cx="100" cy="176" rx="62" ry="10" fill="#E4D5B7" />
          <path
            d="M50,140 L60,178 C62,182 72,185 100,185 C128,185 138,182 140,178 L150,140 Z"
            fill="#F3D58C"
          />
          <rect x="46" y="134" width="108" height="12" rx="6" fill="#E2BD63" />
          <ellipse cx="100" cy="140" rx="46" ry="7" fill="#2E1F14" />

          {/* Tree trunk */}
          <path
            d="M100,140 Q101,90 95,45"
            stroke="#527A37"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M98,95 Q70,75 54,60"
            stroke="#527A37"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M99,80 Q125,65 146,50"
            stroke="#527A37"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Foliage */}
          <circle cx="74" cy="74" r="19" fill="#6CB855" />
          <circle cx="126" cy="64" r="19" fill="#7DC966" />
          <circle cx="95" cy="54" r="23" fill="#8FE078" />

          {/* Golden Aura Ring */}
          <circle
            cx="95"
            cy="36"
            r="19"
            fill="#FEEBC8"
            opacity="0.65"
            className="animate-pulse"
          />

          {/* Center Golden Blossom */}
          <g transform="translate(95, 36)">
            <circle cx="-8" cy="0" r="8" fill="#FBD38D" />
            <circle cx="8" cy="0" r="8" fill="#FBD38D" />
            <circle cx="0" cy="-8" r="8" fill="#FBD38D" />
            <circle cx="0" cy="8" r="8" fill="#FBD38D" />
            <circle cx="0" cy="0" r="6" fill="#F6AD55" />
            <circle cx="0" cy="0" r="3" fill="#FFF0F3" />
          </g>
          {/* Left Blossom */}
          <g transform="translate(52, 56)">
            <circle cx="-6" cy="0" r="6" fill="#FEEBC8" />
            <circle cx="6" cy="0" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="-6" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="6" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="0" r="4" fill="#F6AD55" />
          </g>
          {/* Right Blossom */}
          <g transform="translate(146, 46)">
            <circle cx="-6" cy="0" r="6" fill="#FEEBC8" />
            <circle cx="6" cy="0" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="-6" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="6" r="6" fill="#FEEBC8" />
            <circle cx="0" cy="0" r="4" fill="#F6AD55" />
          </g>
        </svg>
      )}
    </div>
  );
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

  const safeStage = Math.min(Math.max(0, stage), 9);
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
          colors: ["#556832", "#788B4E", "#F45B88", "#FFF0F3", "#9BC358"],
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
            safeStage === 9
              ? "bg-amber-100/70 dark:bg-amber-400/20"
              : safeStage >= 7
              ? "bg-[#FDF2F4]/80 dark:bg-[#381622]/40"
              : safeStage >= 4
              ? "bg-[#EBF3ED]/80 dark:bg-[#1E281F]/40"
              : "bg-[#F7F4EE]/50 dark:bg-[#151D16]/40"
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
          <PlantStageSvg
            stage={safeStage}
            className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-md animate-sway"
          />
        </div>
      </div>

      {/* Stage Title & Info */}
      <div className="text-center mt-2 max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] mb-1.5">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-[#EDF2E4] dark:bg-[#1F2B20] hover:bg-[#DEE7D0] dark:hover:bg-[#28382A] text-[#556832] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A] shadow-xs active:scale-95 transition-all cursor-pointer"
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
                <span className="font-semibold text-[#556832] dark:text-[#9BC358]">
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
