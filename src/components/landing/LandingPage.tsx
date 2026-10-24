"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  KanbanSquare,
  CalendarCheck,
  Flower2,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { BloomieThrowable } from "@/components/mascot/BloomieThrowable";

export function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme, handleGuestLogin } = useApp();
  const [isLoggingInGuest, setIsLoggingInGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [activeTabDot, setActiveTabDot] = useState(0);

  const onGuestClick = async () => {
    try {
      setIsLoggingInGuest(true);
      setGuestError(null);
      const success = await handleGuestLogin();
      if (success) {
        router.push("/");
      }
    } catch (err: any) {
      setGuestError(err.message || "Gagal masuk ke mode simulasi guest");
    } finally {
      setIsLoggingInGuest(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] transition-colors duration-200 pb-16">
      {/* 1. Floating Pill Top Navbar */}
      <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4">
        <div className="rounded-full bg-white/90 dark:bg-[#141A15]/90 backdrop-blur-md border border-[#DEE7D0] dark:border-[#232E25] shadow-xs px-5 py-2.5 flex items-center justify-between transition-colors">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#788B4E] to-[#556832] dark:from-[#9BC358] dark:to-[#698834] flex items-center justify-center text-white dark:text-[#0C100D] shadow-2xs group-hover:scale-105 transition-transform">
              <Flower2 size={18} />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tight text-[#2D4526] dark:text-[#E2ECD5]">
              ApplyBloom
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#57645A] dark:text-[#A0B2A3]">
            <a
              href="#hero"
              className="hover:text-[#2D4526] dark:hover:text-[#F1F6F2] transition-colors"
            >
              Beranda
            </a>
            <a
              href="#preview-fitur"
              className="hover:text-[#2D4526] dark:hover:text-[#F1F6F2] transition-colors"
            >
              Fitur Preview
            </a>
            <a
              href="#mengapa-kami"
              className="hover:text-[#2D4526] dark:hover:text-[#F1F6F2] transition-colors"
            >
              Tentang
            </a>
            <a
              href="#bloomie-interaktif"
              className="hover:text-[#2D4526] dark:hover:text-[#F1F6F2] transition-colors"
            >
              Teman Bloomie
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#57645A] dark:text-[#A0B2A3] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors cursor-pointer"
              title={theme === "light" ? "Ganti ke Tema Gelap" : "Ganti ke Tema Terang"}
              aria-label="Ganti Tema"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-[#2D4526] dark:text-[#E2ECD5] hover:text-[#556832] transition-colors"
            >
              Masuk
            </Link>

            <Link
              href="/register"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-full border border-[#BED0A4] dark:border-[#2C3E2E] bg-[#EEF3E2]/60 dark:bg-[#19221B] hover:bg-[#E2ECD5] dark:hover:bg-[#202C23] text-xs font-semibold text-[#2D4526] dark:text-[#E2ECD5] transition-colors"
            >
              Daftar Akun
            </Link>

            <button
              onClick={onGuestClick}
              disabled={isLoggingInGuest}
              className="rounded-full bg-[#556832] hover:bg-[#435327] dark:bg-[#788B4E] dark:hover:bg-[#687a41] text-white px-4 py-1.5 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoggingInGuest ? "Memuat..." : "Simulasi Guest"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Rounded Scenic Card Container with landingpage.png background */}
      <section id="hero" className="max-w-5xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="relative rounded-[2.2rem] sm:rounded-[2.8rem] overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-6 sm:p-12 border border-[#DEE7D0] dark:border-[#232E25] shadow-lg bg-[#FAF6EE] dark:bg-[#141A15]">
          {/* Official ApplyBloom landingpage.png Illustration Background */}
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center transition-transform duration-700"
            style={{ backgroundImage: "url('/images/landingpage.png')" }}
          />
          {/* Subtle gradient overlay to guarantee crystal clear text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EE]/95 via-[#FAF6EE]/75 to-transparent dark:from-[#0C100D]/95 dark:via-[#0C100D]/80 dark:to-[#0C100D]/25" />

          {/* Top Pill Tag (Badge without Sparkles symbol) */}
          <div className="relative z-10 self-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-[#BED0A4] dark:border-white/20 text-[11px] font-bold text-[#2D4526] dark:text-[#E2ECD5] shadow-2xs">
              <Flower2 size={13} className="text-[#556832] dark:text-[#9BC358]" />
              <span>Platform Pelacak Karir & Lamaran</span>
            </div>
          </div>

          {/* Center-Left Bold Typography & CTA */}
          <div className="relative z-10 max-w-lg space-y-4 my-auto pt-6 pb-8">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-[#242D22] dark:text-[#F1F6F2] font-heading leading-[1.15] tracking-tight">
              Kelola Lamaran &<br />
              Tumbuhkan Karir<br />
              Lebih Mudah
            </h1>

            <p className="text-[#4E5C4F] dark:text-[#A0B2A3] text-xs sm:text-sm max-w-md leading-relaxed font-medium">
              Platform pelacak lamaran kerja terorganisir dengan papan kanban visual,
              kalender agenda interview, dan mode simulasi tamu interaktif tanpa perlu daftar di awal.
            </p>

            {guestError && (
              <div className="p-3 rounded-2xl bg-rose-500/80 backdrop-blur-md text-white text-xs max-w-md">
                {guestError}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onGuestClick}
                disabled={isLoggingInGuest}
                className="rounded-full bg-[#556832] hover:bg-[#435327] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isLoggingInGuest ? "Membuka Simulasi..." : "Coba Mode Simulasi (Guest)"}</span>
              </button>

              <Link
                href="/register"
                className="rounded-full bg-white/85 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 backdrop-blur-md border border-[#BED0A4] dark:border-white/30 text-[#242D22] dark:text-[#F1F6F2] px-4 py-2.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Daftar Akun Gratis</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Bottom subtle note */}
          <div className="relative z-10 text-[11px] text-[#5C6B5E] dark:text-[#A0B2A3]">
            Mode simulasi tamu siap digunakan langsung. Data tidak disimpan permanen sebelum mendaftar.
          </div>
        </div>

        {/* 3. Floating Preview Fitur — Simpel & Minimalis */}
        <div id="preview-fitur" className="relative z-20 max-w-4xl mx-auto -mt-6 sm:-mt-8 px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Card 1: Catat Lamaran */}
            <div
              onClick={onGuestClick}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#151D16]/95 backdrop-blur-md border border-[#DEE7D0] dark:border-[#263528] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <KanbanSquare size={18} />
                </div>
                <span className="text-[11px] font-semibold text-[#8D9B8E] dark:text-[#5E7060]">
                  01
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Catat Lamaran
              </h4>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] mt-1 leading-relaxed">
                Atur seluruh lamaran di papan visual tanpa ribet menggunakan Excel.
              </p>
            </div>

            {/* Card 2: Pasang Pengingat */}
            <div
              onClick={onGuestClick}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#151D16]/95 backdrop-blur-md border border-[#DEE7D0] dark:border-[#263528] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <CalendarCheck size={18} />
                </div>
                <span className="text-[11px] font-semibold text-[#8D9B8E] dark:text-[#5E7060]">
                  02
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Pasang Pengingat
              </h4>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] mt-1 leading-relaxed">
                Pengingat otomatis agar tidak ada sesi interview yang terlewat.
              </p>
            </div>

            {/* Card 3: Pantau Progres */}
            <div
              onClick={onGuestClick}
              className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#151D16]/95 backdrop-blur-md border border-[#DEE7D0] dark:border-[#263528] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Flower2 size={18} />
                </div>
                <span className="text-[11px] font-semibold text-[#8D9B8E] dark:text-[#5E7060]">
                  03
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Pantau Progres
              </h4>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] mt-1 leading-relaxed">
                Dapatkan poin XP dari setiap tahapan dan kembangkan kebun karirmu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Two-Column Showcase ("Kenapa Memilih ApplyBloom?") */}
      <section id="mengapa-kami" className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Card with Overlapping Circular Badges */}
          <div className="md:col-span-6 relative">
            <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-[#DEE7D0] dark:border-[#232E25] shadow-md bg-white dark:bg-[#141A15]">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src="/images/showcase_preview.jpg"
                  alt="ApplyBloom Workspace Showcase"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Live simulation banner inside visual */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-[#151E17]/90 backdrop-blur-md border border-white/40 dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#242D22] dark:text-[#F1F6F2]">
                      Workspace Terintegrasi
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#788B4E]/15 text-[#556832] dark:text-[#9BC358]">
                      Mode Tamu Siap Pakai
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6B5E] dark:text-[#A0B2A3] mt-1">
                    Traveloka (Interview) • Midtrans (Assessment) • Akseleran (Offer)
                  </p>
                </div>
              </div>

              {/* Floating Circular Badge 1 (Top-Left) */}
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-[#556832] dark:bg-[#788B4E] text-white flex flex-col items-center justify-center shadow-lg border-2 border-white dark:border-[#141A15]">
                <Flower2 size={16} />
                <span className="text-[8px] font-bold uppercase tracking-wider">Mulai</span>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="md:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3E2] dark:bg-[#19231B] text-[#556832] dark:text-[#9BC358] text-xs font-bold">
              <span>Tentang ApplyBloom</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#242D22] dark:text-[#F1F6F2] font-heading leading-tight">
              Kenapa Memilih ApplyBloom?
            </h2>

            <p className="text-xs sm:text-sm text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
              Mencari pekerjaan bisa melelahkan jika status lamaran berceceran di berbagai platform.
              ApplyBloom merapikan seluruh proses seleksi kerjamu ke dalam visual yang tenang,
              teratur, dan menyenangkan.
            </p>

            {/* Benefit Checkpoints */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#242D22] dark:text-[#F1F6F2]">
                    Mode Simulasi Tamu Bebas Ribet
                  </h4>
                  <p className="text-[11px] text-[#5C6B5E] dark:text-[#A0B2A3]">
                    Coba input data dan jelajahi alur kanban secara langsung. Jika sudah cocok, daftar akun untuk menyimpan data permanen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#242D22] dark:text-[#F1F6F2]">
                    Kalender Agenda & Pengingat Tepat Waktu
                  </h4>
                  <p className="text-[11px] text-[#5C6B5E] dark:text-[#A0B2A3]">
                    Jadwal interview, tes teknis coding, dan follow-up tercatat jelas di kalender grid bulanan.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#242D22] dark:text-[#F1F6F2]">
                    Kebun Gamifikasi & Teman Karir Bloomie
                  </h4>
                  <p className="text-[11px] text-[#5C6B5E] dark:text-[#A0B2A3]">
                    Dapatkan XP, rawat kebun virtual, dan nikmati interaksi ceria dari maskot di setiap pencapaian.
                  </p>
                </div>
              </div>
            </div>

            {/* Pill Button CTA */}
            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={onGuestClick}
                disabled={isLoggingInGuest}
                className="rounded-full bg-[#556832] hover:bg-[#435327] dark:bg-[#788B4E] dark:hover:bg-[#687a41] text-white px-5 py-2.5 text-xs font-bold shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isLoggingInGuest ? "Memuat..." : "Coba Simulasi Guest"}</span>
              </button>

              <Link
                href="/register"
                className="text-xs font-semibold text-[#556832] dark:text-[#9BC358] hover:underline flex items-center gap-1"
              >
                <span>Daftar Akun Baru</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 3: Feature Cards & Pagination Indicator Dots */}
      <section id="fitur" className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EEF3E2] dark:bg-[#19231B] text-[#556832] dark:text-[#9BC358] text-xs font-bold mb-2">
            <span>Fitur Unggulan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242D22] dark:text-[#F1F6F2] font-heading">
            Tiga Pilar Utama ApplyBloom
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6B5E] dark:text-[#A0B2A3] mt-2">
            Setiap fitur dirancang khusus untuk mempermudah persiapan dan manajemen karirmu.
          </p>
        </div>

        {/* 3 Rounded Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Kanban Board */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-4 group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/showcase_preview.jpg"
                alt="Papan Kanban Pelacak Lamaran"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#556832] dark:text-[#9BC358]">
                <KanbanSquare size={16} />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Papan Kanban Visual
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Kelompokkan lamaran ke tahap Wishlist, Applied, Assessment, Interview, hingga Offer dengan status dinamis.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onGuestClick}
                className="w-full rounded-full bg-[#EEF3E2] dark:bg-[#1F2B20] hover:bg-[#556832] hover:text-white dark:hover:bg-[#788B4E] text-[#556832] dark:text-[#E2ECD5] py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Jelajahi Kanban
              </button>
            </div>
          </div>

          {/* Card 2: Kalender Agenda */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-4 group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/feature_preview.jpg"
                alt="Kalender Agenda Pintar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#556832] dark:text-[#9BC358]">
                <CalendarCheck size={16} />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Kalender Agenda Pintar
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Tampilan grid bulanan dengan penanda hari ini serta jadwal interview kerja, batas pengumpulan tugas, dan reminder.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onGuestClick}
                className="w-full rounded-full bg-[#EEF3E2] dark:bg-[#1F2B20] hover:bg-[#556832] hover:text-white dark:hover:bg-[#788B4E] text-[#556832] dark:text-[#E2ECD5] py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Buka Kalender
              </button>
            </div>
          </div>

          {/* Card 3: Kebun Pertumbuhan Karir */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-4 group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/hero_landscape.jpg"
                alt="Kebun Karir Gamifikasi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md text-[#556832] dark:text-[#9BC358]">
                <Flower2 size={16} />
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Kebun Pertumbuhan Karir
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Kumpulkan XP dari setiap lamaran, sirami tanaman virtualmu, jaga streak konsistensi, dan raih badge pencapaian.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={onGuestClick}
                className="w-full rounded-full bg-[#EEF3E2] dark:bg-[#1F2B20] hover:bg-[#556832] hover:text-white dark:hover:bg-[#788B4E] text-[#556832] dark:text-[#E2ECD5] py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                Tumbuhkan Kebun
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {[0, 1, 2, 3, 4].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveTabDot(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeTabDot === idx
                  ? "w-6 bg-[#556832] dark:bg-[#9BC358]"
                  : "w-2 bg-[#D0DBC2] dark:bg-[#28382A]"
              }`}
              aria-label={`Halaman Fitur ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 6. Section 4: Throwable & Magnetic Bloomie Mascot Companion Highlight */}
      <section id="bloomie-interaktif" className="max-w-5xl mx-auto px-4 py-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#EEF3E2] via-[#E6EFD8] to-[#DCE8CC] dark:from-[#162118] dark:via-[#19261B] dark:to-[#121A13] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-black/30 text-[#556832] dark:text-[#9BC358] text-xs font-bold">
              <span>Teman Karir Interaktif</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#242D22] dark:text-[#F1F6F2] font-heading">
              Sapa Bloomie, Maskot Karir Ceria
            </h3>
            <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
              Bloomie hadir menemani proses pencarian kerja setiap hari. Tarik Bloomie dengan
              kursor atau sentuhan layar, lempar ke mana saja, dan lihat pantulan magnetiknya yang kembali ke sarang!
            </p>
            <div className="pt-2">
              <button
                onClick={onGuestClick}
                disabled={isLoggingInGuest}
                className="rounded-full bg-[#556832] hover:bg-[#435327] dark:bg-[#788B4E] dark:hover:bg-[#687a41] text-white px-5 py-2.5 text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <span>Mulai Simulasi Bersama Bloomie</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Throwable, Draggable & Magnetic Bloomie Arena */}
          <div className="shrink-0 p-4 rounded-3xl bg-white/70 dark:bg-[#1A261D]/70 backdrop-blur-xs border border-white/50 dark:border-white/10 flex flex-col items-center shadow-xs">
            <BloomieThrowable onThrow={onGuestClick} />
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="max-w-5xl mx-auto px-4 pt-12 text-center text-xs text-[#7A8E80] dark:text-[#58685C]">
        <div className="border-t border-[#DEE7D0] dark:border-[#232E25] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flower2 size={15} className="text-[#556832] dark:text-[#9BC358]" />
            <span className="font-bold text-[#242D22] dark:text-[#F1F6F2]">
              ApplyBloom
            </span>
          </div>
          <p className="text-[11px]">
            Mode Tamu disediakan untuk simulasi fitur. Data tersimpan permanen setelah pendaftaran.
          </p>
        </div>
      </footer>
    </div>
  );
}
