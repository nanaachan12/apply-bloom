"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export function isNightSleepTime(): boolean {
  if (typeof window === "undefined") return false;
  const hour = new Date().getHours();
  return hour >= 22 || hour < 5;
}

interface BloomieMascotProps {
  mood?: "auto" | "happy" | "sleep" | "celebrate" | "surprised";
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  className?: string;
  speechText?: string;
  onPoke?: () => void;
  enableEyeTracking?: boolean;
  showShadow?: boolean;
  bubblePlacement?: "top" | "left" | "bottom";
  showBubble?: boolean;
  speechList?: string[];
}

const MENU_MESSAGES: Record<string, string[]> = {
  dashboard: [
    "Pantau ringkasan seluruh lamaran pekerjaan dan agenda pentingmu hari ini.",
    "Konsistensi harian merupakan kunci utama dalam meraih pekerjaan impian.",
    "Pastikan memeriksa kembali status lamaran yang memerlukan tindak lanjut.",
  ],
  applications: [
    "Kelola dan perbarui setiap lowongan yang telah kamu lamar secara terstruktur.",
    "Catat tanggal pengiriman lamaran dan kontak perekrut agar mudah ditindaklanjuti.",
    "Periksa kelengkapan berkas lamaran agar sesuai dengan kualifikasi yang dicari.",
  ],
  pipeline: [
    "Pantau alur tahapan rekrutmen dari tahap seleksi berkas hingga offering.",
    "Geser kartu ke kolom berikutnya sesuai dengan hasil tahapan seleksi.",
    "Persiapkan materi dan profil perusahaan sebelum memasuki tahapan wawancara.",
  ],
  reminders: [
    "Semua jadwal wawancara dan tenggat waktu tugas tersusun rapi di kalender ini.",
    "Lakukan persiapan dan konfirmasi kehadiran sebelum sesi wawancara dimulai.",
    "Tandai jadwal yang telah terlaksana agar riwayat agendamu selalu akurat.",
  ],
  garden: [
    "Kebun virtual ini berkembang seiring kebiasaan positif yang kamu bangun.",
    "Lakukan penyiraman tanaman secara teratur untuk merawat kebun karirmu.",
    "Buka lencana pencapaian baru seiring kemajuan proses pencarian karirmu.",
  ],
  settings: [
    "Atur preferensi akun, tema tampilan, dan data profil karirmu di halaman ini.",
    "Pastikan informasi akun dan zona waktu telah terkonfigurasi dengan tepat.",
  ],
};

const NIGHT_SLEEP_MESSAGES = [
  "Waktu menunjukkan pukul 22.00 ke atas. Saatnya beristirahat dan tidur yang cukup.",
  "Istirahat yang cukup sangat penting untuk menjaga fokus dan stamina saat mencari kerja.",
  "Tutup perangkat kerjamu dan tidur lebih awal agar kembali segar esok hari.",
  "Bloomie akan kembali aktif menemani aktivitasmu pada pukul 05.00 pagi.",
];

export function BloomieMascot({
  mood = "auto",
  size = "md",
  interactive = true,
  className = "",
  speechText,
  onPoke,
  enableEyeTracking = true,
  showShadow = true,
  bubblePlacement = "top",
  showBubble = true,
  speechList,
}: BloomieMascotProps) {
  const pathname = usePathname() || "/";
  const [bubbleText, setBubbleText] = useState<string | null>(speechText || null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentHour, setCurrentHour] = useState<number>(() => {
    if (typeof window !== "undefined") return new Date().getHours();
    return 12;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const isNightTime = currentHour >= 22 || currentHour < 5;
  const isSleeping = mood === "sleep" || (mood === "auto" && isNightTime);
  const isSurprised = mood === "surprised";

  // Helper to determine menu key from current path
  const getMenuKey = (path: string): string => {
    if (path.startsWith("/applications")) return "applications";
    if (path.startsWith("/pipeline")) return "pipeline";
    if (path.startsWith("/reminders")) return "reminders";
    if (path.startsWith("/garden")) return "garden";
    if (path.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  // Set contextual message when route changes or sleep state triggers
  useEffect(() => {
    if (speechText) {
      setBubbleText(speechText);
      return;
    }

    if (speechList && speechList.length > 0) {
      setBubbleText(isSleeping ? NIGHT_SLEEP_MESSAGES[0] : speechList[0]);
      setMessageIndex(0);
      return;
    }

    if (isSleeping) {
      setBubbleText(NIGHT_SLEEP_MESSAGES[0]);
    } else {
      const key = getMenuKey(pathname);
      const msgs = MENU_MESSAGES[key] || MENU_MESSAGES.dashboard;
      setBubbleText(msgs[0]);
      setMessageIndex(0);
    }
  }, [pathname, isSleeping, speechText, speechList]);

  // Blinking loop (every 3-5 seconds when awake)
  useEffect(() => {
    if (isSleeping || isSurprised) return;

    let timeoutId: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
      const nextDelay = 2800 + Math.random() * 2500;
      timeoutId = setTimeout(triggerBlink, nextDelay);
    };

    timeoutId = setTimeout(triggerBlink, 2000);
    return () => clearTimeout(timeoutId);
  }, [isSleeping]);

  // Eye tracking cursor
  useEffect(() => {
    if (!enableEyeTracking || isSleeping || typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.45;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(3.5, Math.hypot(deltaX, deltaY) / 60);

      setEyeOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableEyeTracking, isSleeping]);

  // Gentle Web Audio Synthesizer
  const playSound = (type: "poke" | "sleep") => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === "sleep") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        return;
      }

      // Melodic gentle chime
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const startTime = now + idx * 0.05;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {
      // Audio fallback
    }
  };

  const handlePoke = () => {
    if (!interactive) return;

    setIsJumping(true);
    playSound(isSleeping ? "sleep" : "poke");

    if (onPoke) onPoke();

    // Cycle to next contextual message for this menu or speechList
    if (isSleeping) {
      const nextIdx = (messageIndex + 1) % NIGHT_SLEEP_MESSAGES.length;
      setMessageIndex(nextIdx);
      setBubbleText(NIGHT_SLEEP_MESSAGES[nextIdx]);
    } else if (speechList && speechList.length > 0) {
      const nextIdx = (messageIndex + 1) % speechList.length;
      setMessageIndex(nextIdx);
      setBubbleText(speechList[nextIdx]);
    } else {
      const key = getMenuKey(pathname);
      const msgs = MENU_MESSAGES[key] || MENU_MESSAGES.dashboard;
      const nextIdx = (messageIndex + 1) % msgs.length;
      setMessageIndex(nextIdx);
      setBubbleText(msgs[nextIdx]);
    }

    setTimeout(() => setIsJumping(false), 450);
  };

  const sizeClasses = {
    sm: "w-20 h-24",
    md: "w-28 h-32 sm:w-32 sm:h-36",
    lg: "w-40 h-44 sm:w-48 sm:h-52",
    xl: "w-52 h-56 sm:w-60 sm:h-64",
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contextual Speech Bubble (No emojis, no action chips, clean design) */}
      {showBubble && interactive && bubbleText && (
        <div
          className={`absolute z-40 max-w-[240px] sm:max-w-[280px] w-max animate-in fade-in zoom-in-95 duration-200 ${
            bubblePlacement === "left"
              ? "sm:right-full sm:mr-4 sm:top-7 sm:translate-y-0 sm:left-auto sm:translate-x-0 -top-20 left-1/2 -translate-x-1/2"
              : bubblePlacement === "bottom"
              ? "top-full mt-2 left-1/2 -translate-x-1/2"
              : "bottom-full mb-3 left-1/2 -translate-x-1/2"
          }`}
        >
          <div className="relative bg-white/95 dark:bg-[#1B231C]/95 backdrop-blur-md text-[#242D22] dark:text-[#F1F6F2] text-xs font-medium px-3.5 py-2.5 rounded-2xl shadow-xl border border-[#DEE7D0] dark:border-[#2C3B2E] flex items-start gap-2 leading-relaxed">
            <span className="flex-1 text-[11px] sm:text-xs">{bubbleText}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBubbleText(null);
              }}
              className="text-[#7A8E80] hover:text-[#242D22] dark:hover:text-[#F1F6F2] p-0.5 rounded-full shrink-0"
              title="Tutup dialog"
            >
              <X size={11} />
            </button>

            {/* Bubble arrow */}
            {bubblePlacement === "left" ? (
              <>
                <div className="hidden sm:block absolute top-6 -right-1.5 w-3 h-3 bg-white/95 dark:bg-[#1B231C]/95 border-t border-r border-[#DEE7D0] dark:border-[#2C3B2E] transform rotate-45" />
                <div className="sm:hidden absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-[#1B231C]/95 border-b border-r border-[#DEE7D0] dark:border-[#2C3B2E] transform rotate-45" />
              </>
            ) : bubblePlacement === "bottom" ? (
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-[#1B231C]/95 border-t border-l border-[#DEE7D0] dark:border-[#2C3B2E] transform rotate-45" />
            ) : (
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-[#1B231C]/95 border-b border-r border-[#DEE7D0] dark:border-[#2C3B2E] transform rotate-45" />
            )}
          </div>
        </div>
      )}

      {/* Floating Zzz Animation in Sleep Mode */}
      {isSleeping && (
        <div className="absolute -top-3 right-2 pointer-events-none z-30 flex flex-col items-center">
          <span className="text-xs font-extrabold text-amber-400 dark:text-amber-300 animate-bounce" style={{ animationDuration: "2.4s" }}>
            Z
          </span>
          <span className="text-[10px] font-bold text-amber-300/80 -mt-1 ml-3 animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.4s" }}>
            z
          </span>
          <span className="text-[8px] font-bold text-amber-200/60 -mt-1 ml-5 animate-bounce" style={{ animationDuration: "1.6s", animationDelay: "0.8s" }}>
            z
          </span>
        </div>
      )}

      {/* Mascot Character Wrapper with Squash & Stretch Physics */}
      <div
        onClick={handlePoke}
        title={interactive ? "Bloomie" : "Bloomie Mascot"}
        className={`relative ${sizeClasses[size]} transition-transform duration-200 ${
          interactive ? "cursor-pointer" : ""
        } ${
          isSurprised
            ? "scale-x-92 scale-y-108 -translate-y-1.5"
            : isJumping
            ? "-translate-y-3 scale-x-92 scale-y-108"
            : isHovered
            ? "scale-105"
            : "animate-bloomie-breathe"
        }`}
      >
        <svg
          viewBox="0 0 120 140"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(120,139,78,0.22)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform overflow-visible"
        >
          <defs>
            {/* 3D Organic Body Gradient */}
            <linearGradient id="bloomieBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8D063" />
              <stop offset="45%" stopColor="#8EAD52" />
              <stop offset="100%" stopColor="#6C833E" />
            </linearGradient>

            {/* Belly Patch Gradient */}
            <linearGradient id="bloomieBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E9F2DD" stopOpacity="0.9" />
            </linearGradient>

            {/* Sprout Leaves Gradient */}
            <linearGradient id="bloomieLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4EE76" />
              <stop offset="100%" stopColor="#7DA63B" />
            </linearGradient>

            {/* Nightcap Gradient for Sleep Mode */}
            <linearGradient id="bloomieCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A5568" />
              <stop offset="50%" stopColor="#2D3748" />
              <stop offset="100%" stopColor="#1A202C" />
            </linearGradient>

            {/* Blush Gradient */}
            <radialGradient id="bloomieBlush">
              <stop offset="0%" stopColor="#F45B88" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#F45B88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F45B88" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Tiny Feet */}
          <ellipse cx="44" cy="122" rx="11" ry="6" fill="#586C32" />
          <ellipse cx="76" cy="122" rx="11" ry="6" fill="#586C32" />

          {/* Body Main Sprout Teardrop Shape */}
          <path
            d="M60,34 C85,34 100,54 100,82 C100,108 84,124 60,124 C36,124 20,108 20,82 C20,54 35,34 60,34 Z"
            fill="url(#bloomieBodyGrad)"
          />

          {/* Top highlight shine for 3D depth */}
          <ellipse cx="60" cy="46" rx="26" ry="10" fill="#C6EB7D" opacity="0.45" />

          {/* Cute Soft Belly */}
          <path
            d="M60,65 C74,65 82,78 82,96 C82,112 73,121 60,121 C47,121 38,112 38,96 C38,78 46,65 60,65 Z"
            fill="url(#bloomieBellyGrad)"
          />

          {/* Left Hand / Sprout Arm */}
          <path
            d="M22,78 C14,75 8,82 12,90 C15,95 24,88 23,80 Z"
            fill="#7CA13A"
          />

          {/* Right Hand / Sprout Arm */}
          <path
            d="M98,78 C106,75 112,82 108,90 C105,95 96,88 97,80 Z"
            fill="#7CA13A"
          />

          {/* Head Sprout Leaves on Top */}
          <g className={isSurprised ? "animate-leaf-wobble" : isJumping ? "animate-leaf-mleyot" : "animate-sway"}>
            {/* Sprout Stem */}
            <path
              d="M60,35 Q60,22 60,16"
              stroke="#5E782E"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left Leaf */}
            <path
              d="M60,20 C46,14 40,24 45,30 C51,35 58,26 60,20 Z"
              fill="url(#bloomieLeafGrad)"
            />
            {/* Right Leaf */}
            <path
              d="M60,18 C74,10 82,19 78,26 C73,32 63,24 60,18 Z"
              fill="url(#bloomieLeafGrad)"
            />
          </g>

          {/* Blushing Cheeks */}
          <ellipse
            cx="34"
            cy="84"
            rx={isSurprised ? 9 : isHovered ? 8 : 6}
            ry={isSurprised ? 6 : isHovered ? 5 : 4}
            fill="url(#bloomieBlush)"
          />
          <ellipse
            cx="86"
            cy="84"
            rx={isSurprised ? 9 : isHovered ? 8 : 6}
            ry={isSurprised ? 6 : isHovered ? 5 : 4}
            fill="url(#bloomieBlush)"
          />

          {/* EYES */}
          {isSurprised ? (
            // Cute Shocked / Surprised Eyes ("lucu gemes!")
            <g>
              <circle cx="44" cy="72" r="8.5" fill="#1C2B1D" />
              <circle cx="44" cy="71" r="3.2" fill="#FFFFFF" />
              <circle cx="46.5" cy="74" r="1.5" fill="#FFFFFF" />

              <circle cx="76" cy="72" r="8.5" fill="#1C2B1D" />
              <circle cx="76" cy="71" r="3.2" fill="#FFFFFF" />
              <circle cx="78.5" cy="74" r="1.5" fill="#FFFFFF" />

              {/* Tiny cute surprised sweat drop */}
              <path
                d="M87,58 C89,54 92,56 91,60 C90,62 88,62 87,58 Z"
                fill="#60A5FA"
                opacity="0.9"
              />
            </g>
          ) : !isSleeping ? (
            isBlinking ? (
              // Blinking Eyes
              <g stroke="#1F2E1E" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M38,72 Q44,76 50,72" />
                <path d="M70,72 Q76,76 82,72" />
              </g>
            ) : isJumping || isHovered ? (
              // Happy Arc Eyes
              <g stroke="#1F2E1E" strokeWidth="3.2" strokeLinecap="round" fill="none">
                <path d="M38,74 Q44,66 50,74" />
                <path d="M70,74 Q76,66 82,74" />
              </g>
            ) : (
              // Normal Alive Eyes with Eye-Tracking Pupil
              <g>
                <ellipse cx="44" cy="72" rx="7" ry="9" fill="#1C2B1D" />
                <circle
                  cx={44 + eyeOffset.x}
                  cy={72 + eyeOffset.y}
                  r="3.5"
                  fill="#FFFFFF"
                />
                <circle
                  cx={42 + eyeOffset.x * 0.5}
                  cy={70 + eyeOffset.y * 0.5}
                  r="1.8"
                  fill="#FFFFFF"
                />

                <ellipse cx="76" cy="72" rx="7" ry="9" fill="#1C2B1D" />
                <circle
                  cx={76 + eyeOffset.x}
                  cy={72 + eyeOffset.y}
                  r="3.5"
                  fill="#FFFFFF"
                />
                <circle
                  cx={74 + eyeOffset.x * 0.5}
                  cy={70 + eyeOffset.y * 0.5}
                  r="1.8"
                  fill="#FFFFFF"
                />
              </g>
            )
          ) : (
            // Sleeping Eyes
            <g stroke="#263827" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M37,74 Q44,80 51,74" />
              <path d="M69,74 Q76,80 83,74" />
            </g>
          )}

          {/* MOUTH */}
          {isSurprised ? (
            // Cute Surprised Gasp / 'O' Mouth
            <g>
              <ellipse cx="60" cy="87" rx="4.5" ry="6" fill="#1C2B1D" />
              <ellipse cx="60" cy="88" rx="2.5" ry="3.5" fill="#F45B88" />
            </g>
          ) : !isSleeping ? (
            isJumping || isHovered ? (
              // Joyful Open Smile
              <g>
                <path
                  d="M52,84 Q60,95 68,84 Z"
                  fill="#1C2B1D"
                />
                <path
                  d="M55,87 Q60,94 65,87 Z"
                  fill="#F45B88"
                />
              </g>
            ) : (
              // Gentle Cheerful Smile
              <path
                d="M54,84 Q60,90 66,84"
                stroke="#1C2B1D"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )
          ) : (
            // Sleeping tiny mouth
            <path
              d="M57,86 Q60,88 63,86"
              stroke="#263827"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Sleeping Cap for Sleep Mode */}
          {isSleeping && (
            <g>
              <path
                d="M32,46 C32,32 50,22 72,26 C88,29 104,42 108,54 C104,56 94,48 80,48 C62,48 42,50 32,46 Z"
                fill="url(#bloomieCapGrad)"
              />
              <ellipse cx="60" cy="46" rx="28" ry="5.5" fill="#FFFFFF" opacity="0.9" />
              <polygon
                points="84,36 86,40 90,40 87,42 88,46 84,43 80,46 81,42 78,40 82,40"
                fill="#FBBF24"
              />
              <circle cx="108" cy="56" r="6" fill="#FBBF24" />
            </g>
          )}
        </svg>
      </div>

      {/* Soft Ground Shadow */}
      {showShadow && (
        <div
          className={`h-2.5 rounded-full bg-black/10 dark:bg-black/40 blur-xs transition-all duration-200 mt-1 ${
            isJumping
              ? "w-8 opacity-40 scale-75"
              : isHovered
              ? "w-16 opacity-70"
              : "w-14 opacity-50"
          }`}
        />
      )}

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes bloomieBreathe {
          0%, 100% {
            transform: scale(1, 1);
          }
          50% {
            transform: scale(1.02, 0.98);
          }
        }
        @keyframes bloomieSway {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }
        .animate-bloomie-breathe {
          animation: bloomieBreathe 3.5s ease-in-out infinite;
        }
        .animate-sway {
          animation: bloomieSway 3s ease-in-out infinite;
          transform-origin: 60px 35px;
        }
        @keyframes bloomieLeafMleyot {
          0% {
            transform: rotate(0deg) scale(1, 1);
          }
          25% {
            transform: rotate(-16deg) scaleY(0.88);
          }
          55% {
            transform: rotate(18deg) scaleY(1.06);
          }
          75% {
            transform: rotate(-8deg) scaleY(0.96);
          }
          100% {
            transform: rotate(0deg) scale(1, 1);
          }
        }
        .animate-leaf-mleyot {
          animation: bloomieLeafMleyot 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transform-origin: 60px 35px;
        }
        @keyframes bloomieLeafWobble {
          0% {
            transform: rotate(0deg) scale(1, 1);
          }
          20% {
            transform: rotate(-15deg) skewX(-6deg);
          }
          40% {
            transform: rotate(15deg) skewX(6deg);
          }
          60% {
            transform: rotate(-10deg) skewX(-4deg);
          }
          80% {
            transform: rotate(8deg) skewX(3deg);
          }
          100% {
            transform: rotate(0deg) scale(1, 1);
          }
        }
        .animate-leaf-wobble {
          animation: bloomieLeafWobble 0.45s ease-in-out infinite;
          transform-origin: 60px 35px;
        }
      `}</style>
    </div>
  );
}
