"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { BloomieMascot } from "./BloomieMascot";

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

const SLEEP_QUOTES = [
  "Waktu menunjukkan pukul 22.00 ke atas. Saatnya beristirahat dan tidur yang cukup.",
  "Istirahat yang cukup sangat penting untuk menjaga fokus dan stamina saat mencari kerja.",
  "Tutup perangkat kerjamu dan tidur lebih awal agar kembali segar esok hari.",
  "Bloomie akan kembali aktif menemani aktivitasmu pada pukul 05.00 pagi.",
];

export function BloomieFloatingCompanion() {
  const pathname = usePathname() || "/";
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  // Position and Magnetic Snap State
  const [side, setSide] = useState<"left" | "right">("right");
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    hasMoved: boolean;
  } | null>(null);

  const currentHour = typeof window !== "undefined" ? new Date().getHours() : 12;
  const isSleeping = currentHour >= 22 || currentHour < 5;

  // Initialize position and restore saved side/position from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("applybloom_bloomie_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        const targetSide: "left" | "right" = parsed.side === "left" ? "left" : "right";
        const targetY =
          typeof parsed.yRatio === "number"
            ? Math.max(64, Math.min(window.innerHeight - 150, parsed.yRatio * window.innerHeight))
            : window.innerHeight - 150;
        const targetX = targetSide === "left" ? 20 : window.innerWidth - 80 - 20;
        setSide(targetSide);
        setCoords({ x: targetX, y: targetY });
        return;
      }
    } catch {
      // Fallback to default position
    }

    // Default: bottom-right margin
    setCoords({
      x: window.innerWidth - 80 - 24,
      y: window.innerHeight - 150,
    });
    setSide("right");
  }, []);

  // Keep Bloomie within screen boundaries when resizing the browser
  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      setCoords((prev) => {
        if (!prev) return null;
        const targetX = side === "left" ? 20 : window.innerWidth - 80 - 20;
        const targetY = Math.max(64, Math.min(window.innerHeight - 150, prev.y));
        return { x: targetX, y: targetY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted, side]);

  // Hide floating Bloomie when on Bloom Garden page because Bloomie is already next to the plant
  if (pathname.startsWith("/garden")) {
    return null;
  }

  const getMenuKey = (path: string): string => {
    if (path.startsWith("/applications")) return "applications";
    if (path.startsWith("/pipeline")) return "pipeline";
    if (path.startsWith("/reminders")) return "reminders";
    if (path.startsWith("/garden")) return "garden";
    if (path.startsWith("/settings")) return "settings";
    return "dashboard";
  };

  const playFriendlySound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      const now = ctx.currentTime;
      if (isSleeping) {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.3);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio fallback
    }
  };

  const handleCompanionClick = () => {
    setIsBouncing(true);
    playFriendlySound();

    if (isSleeping) {
      const nextIdx = (msgIndex + 1) % SLEEP_QUOTES.length;
      setMsgIndex(nextIdx);
      setSpeech(SLEEP_QUOTES[nextIdx]);
    } else {
      const key = getMenuKey(pathname);
      const msgs = MENU_MESSAGES[key] || MENU_MESSAGES.dashboard;
      const nextIdx = (msgIndex + 1) % msgs.length;
      setMsgIndex(nextIdx);
      setSpeech(msgs[nextIdx]);
    }
    setIsOpen(true);

    setTimeout(() => setIsBouncing(false), 450);
  };

  // Drag and Snap with Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only primary left button
    if (e.button !== 0) return;

    const currentX = coords?.x ?? (typeof window !== "undefined" ? window.innerWidth - 80 - 24 : 0);
    const currentY = coords?.y ?? (typeof window !== "undefined" ? window.innerHeight - 150 : 0);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
      hasMoved: false,
    };

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (!dragRef.current) return;
      const dx = moveEv.clientX - dragRef.current.startX;
      const dy = moveEv.clientY - dragRef.current.startY;

      // Threshold to distinguish between simple click and intentional drag
      if (!dragRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
        dragRef.current.hasMoved = true;
        setIsDragging(true);
        setIsOpen(false); // Close dialog when dragging starts
      }

      if (dragRef.current.hasMoved) {
        const newX = Math.max(4, Math.min(window.innerWidth - 84, dragRef.current.initX + dx));
        const newY = Math.max(54, Math.min(window.innerHeight - 120, dragRef.current.initY + dy));
        setCoords({ x: newX, y: newY });
      }
    };

    const handlePointerUp = (upEv: PointerEvent) => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      if (!dragRef.current) return;

      if (dragRef.current.hasMoved) {
        // Calculate snap to closest screen edge (left or right)
        const currentCenterX = upEv.clientX;
        const isLeft = currentCenterX < window.innerWidth / 2;
        const snapX = isLeft ? 20 : window.innerWidth - 80 - 20;
        const rawY = dragRef.current.initY + (upEv.clientY - dragRef.current.startY);
        const snapY = Math.max(64, Math.min(window.innerHeight - 140, rawY));

        const targetSide: "left" | "right" = isLeft ? "left" : "right";
        setSide(targetSide);
        setCoords({ x: snapX, y: snapY });
        setIsDragging(false);

        // Persist preferences in localStorage
        try {
          localStorage.setItem(
            "applybloom_bloomie_pos",
            JSON.stringify({ side: targetSide, yRatio: snapY / window.innerHeight })
          );
        } catch {
          // LocalStorage fallback
        }
      } else {
        // Simple tap / click without drag
        setIsDragging(false);
        handleCompanionClick();
      }

      dragRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const mascotMood = isDragging ? "surprised" : isSleeping ? "sleep" : "happy";

  return (
    <div
      onPointerDown={handlePointerDown}
      style={
        mounted && coords
          ? {
              transform: `translate3d(${coords.x}px, ${coords.y}px, 0)`,
              transition: isDragging
                ? "none"
                : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }
          : undefined
      }
      className={`${
        mounted && coords
          ? "fixed top-0 left-0 z-40 select-none flex flex-col touch-none"
          : "fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 select-none flex flex-col items-end"
      } ${side === "left" ? "items-start" : "items-end"} ${
        isDragging ? "cursor-grabbing scale-105" : "cursor-grab"
      }`}
    >
      {/* Expanded Speech Card / Bubble - Positioned above Bloomie's head ("taruh diatas nya kepala") */}
      {isOpen && speech && (
        <div
          className={`absolute z-50 w-[min(calc(100vw-48px),340px)] sm:w-[360px] bottom-full mb-3 animate-in fade-in zoom-in-95 duration-200 ${
            side === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="relative bg-white/95 dark:bg-[#1B231C]/95 backdrop-blur-md text-[#242D22] dark:text-[#F1F6F2] text-xs font-medium px-4 py-3 rounded-2xl shadow-xl border border-[#DEE7D0] dark:border-[#2C3B2E] flex items-center gap-2.5 leading-relaxed">
            <p className="text-[11px] sm:text-xs flex-1">{speech}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-[#7A8E80] hover:text-[#242D22] dark:hover:text-[#F1F6F2] p-1 rounded-full shrink-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Tutup dialog"
            >
              <X size={12} />
            </button>

            {/* Pointer arrow pointing down to Bloomie's head */}
            <div
              className={`absolute -bottom-1.5 w-3 h-3 bg-white/95 dark:bg-[#1B231C]/95 border-b border-r border-[#DEE7D0] dark:border-[#2C3B2E] transform rotate-45 ${
                side === "left" ? "left-8" : "right-8"
              }`}
            />
          </div>
        </div>
      )}

      {/* Mascot Container - Interactive drag & surprise expression */}
      <div
        title={isSleeping ? "Bloomie (Sedang Istirahat)" : "Tarik & geser Bloomie ke tepi layar"}
        className={`relative p-0 bg-transparent border-0 outline-none shadow-none transition-transform duration-200 flex flex-col items-center justify-center ${
          isBouncing ? "scale-115 -rotate-6" : ""
        }`}
      >
        <BloomieMascot
          mood={mascotMood}
          size="sm"
          interactive={false}
          showShadow={!isDragging}
          showBubble={false}
        />
      </div>
    </div>
  );
}
