"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flower2,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Menu,
  X,
  Shield,
  ArrowUp,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { BloomieThrowable } from "@/components/mascot/BloomieThrowable";

export function LandingPage() {
  const router = useRouter();
  const { user, theme, toggleTheme, handleGuestLogin } = useApp();
  const [isLoggingInGuest, setIsLoggingInGuest] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onGuestClick = async () => {
    try {
      setIsLoggingInGuest(true);
      setGuestError(null);
      const success = await handleGuestLogin();
      if (success) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setGuestError(err.message || "Gagal masuk ke mode simulasi guest");
    } finally {
      setIsLoggingInGuest(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] transition-colors duration-200">
      {/* 1. Dynamic Floating Pill Top Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none transition-all duration-300 ease-in-out ${
          isScrolled ? "pt-2.5 sm:pt-4 px-4 sm:px-6" : "pt-0 px-0"
        }`}
      >
        <div
          className={`pointer-events-auto transition-all duration-300 ease-in-out flex items-center justify-between ${
            isScrolled
              ? "w-full max-w-4xl rounded-full bg-[#556832]/92 dark:bg-[#111912]/92 backdrop-blur-md border border-white/20 shadow-xl shadow-black/15 py-2 sm:py-2.5 px-4 sm:px-6"
              : "w-full max-w-7xl px-4 sm:px-8 py-4 sm:py-5 bg-transparent border-b border-white/10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white text-[#556832] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Flower2 size={18} />
            </div>
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white drop-shadow-xs">
              ApplyBloom
            </span>
          </Link>

          {/* Desktop Nav Links (Maskot Bloomie removed) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-semibold text-white/85">
            <a href="#hero" className="hover:text-white transition-colors">
              Beranda
            </a>
            <a href="#mengapa-kami" className="hover:text-white transition-colors">
              Tentang
            </a>
            <a href="#fitur" className="hover:text-white transition-colors">
              Fitur Unggulan
            </a>
          </nav>

          {/* Action Buttons & Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={theme === "light" ? "Ganti ke Tema Gelap" : "Ganti ke Tema Terang"}
              aria-label="Ganti Tema"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex rounded-full bg-white text-[#556832] hover:bg-white/90 px-4 py-2 text-xs font-bold shadow-xs hover:shadow-sm transition-all items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-white/85 hover:text-white transition-colors"
                >
                  Masuk
                </Link>

                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-full bg-white text-[#556832] hover:bg-white/90 text-xs font-bold shadow-xs transition-all"
                >
                  Daftar Akun
                </Link>
              </>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
              title={mobileMenuOpen ? "Tutup Menu" : "Buka Menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-2 w-[92%] max-w-md p-4 rounded-2xl bg-[#556832]/95 dark:bg-[#111912]/95 backdrop-blur-lg border border-white/20 shadow-2xl text-white animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-white/90">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Beranda
              </a>
              <a
                href="#mengapa-kami"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Tentang ApplyBloom
              </a>
              <a
                href="#fitur"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                Fitur Unggulan
              </a>
            </nav>

            <div className="pt-3 mt-2 border-t border-white/15 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-colors"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-[#556832] bg-white hover:bg-white/90 rounded-xl transition-colors shadow-xs"
              >
                Daftar Akun
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section: Full-Bleed Dashboard Olive Green & Strawberry Pink Gradient with Standalone Interactive Bloomie */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#556832] via-[#788B4E] via-45% to-[#F45B88] dark:from-[#111912] dark:via-[#1A261C] dark:via-50% dark:to-[#381622] text-white pt-28 sm:pt-36 pb-20 sm:pb-32 transition-colors duration-300"
      >
        {/* Soft Ambient Glow Orbs for Olive Sage & Strawberry Pink Blend */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#788B4E]/30 dark:bg-[#9BC358]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-16 w-88 h-88 rounded-full bg-[#F45B88]/30 dark:bg-[#FA7194]/20 blur-3xl pointer-events-none" />

        {/* Subtle Atmospheric Background Illustration */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('/images/landingpage.png')" }}
        />

        {/* Hero Grid Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-4 sm:pt-6">
            {/* Left Column: Bold Typography & Action Buttons */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-white font-heading leading-[1.15] tracking-tight drop-shadow-xs">
                Kelola Lamaran &<br />
                Tumbuhkan Karir<br />
                Lebih Mudah
              </h1>

              <p className="text-[#F3F7EC] dark:text-[#E2ECD5] text-xs sm:text-sm max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                Platform pelacak lamaran kerja terorganisir dengan papan kanban visual,
                kalender agenda interview, dan mode simulasi tamu interaktif tanpa perlu daftar di awal.
              </p>

              {guestError && (
                <div className="p-3 rounded-2xl bg-rose-500/80 backdrop-blur-md text-white text-xs max-w-md mx-auto lg:mx-0">
                  {guestError}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-white text-[#556832] hover:bg-[#FFF0F3] hover:text-[#C2255C] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Flower2 size={16} className="text-[#788B4E]" />
                    <span>Buka Dashboard Karir</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="rounded-full bg-white text-[#556832] hover:bg-[#FFF0F3] hover:text-[#C2255C] px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <span>Mulai Sekarang - Gratis</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      href="/login"
                      className="rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white px-5 py-3 text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs hover:-translate-y-0.5"
                    >
                      <span>Masuk ke Akun</span>
                    </Link>
                  </>
                )}
              </div>

              <p className="text-[11px] text-[#E2EED9] dark:text-[#BDCEB4] pt-1">
                Tersedia mode simulasi tamu interaktif langsung di halaman login dan register.
              </p>
            </div>

            {/* Right Column: Standalone Interactive Bloomie Mascot */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
              <div className="relative flex flex-col items-center">
                {/* Soft ambient aura behind Bloomie */}
                <div className="absolute -inset-4 rounded-full bg-white/20 dark:bg-white/5 blur-2xl pointer-events-none" />

                {/* Standalone Interactive Draggable & Throwable Bloomie Mascot */}
                <BloomieThrowable onThrow={onGuestClick} />

                {/* Micro Hint */}
                <p className="text-[11px] text-[#FFF0F3] dark:text-[#FDC4D0] font-semibold mt-3 text-center drop-shadow-xs">
                  Tarik atau lempar Bloomie ke mana saja!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Organic Wave Transition Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative block w-full h-10 sm:h-16 lg:h-20 text-[#F4F7EF] dark:text-[#0C100D]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C320,105 520,15 820,70 C1080,115 1280,30 1440,55 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* 3. Section 2: Two-Column Showcase ("Kenapa Memilih ApplyBloom?") */}
      <section id="mengapa-kami" className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Visual Workspace Showcase */}
          <div className="md:col-span-6 relative">
            <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-[#DEE7D0] dark:border-[#232E25] shadow-lg bg-white dark:bg-[#141A15]">
              <div className="relative h-64 sm:h-96 w-full overflow-hidden">
                <img
                  src="/images/showcase_preview.jpg"
                  alt="ApplyBloom Workspace Showcase"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
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
          </div>
        </div>
      </section>

      {/* 4. Section 3: Feature Cards */}
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

        {/* 3 Clean Rounded Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Kanban Board */}
          <div
            onClick={onGuestClick}
            className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 group cursor-pointer"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/showcase_preview.jpg"
                alt="Papan Kanban Pelacak Lamaran"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5 flex-1 px-1 pb-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Papan Kanban Visual
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Kelompokkan lamaran ke tahap Wishlist, Applied, Assessment, Interview, hingga Offer dengan status dinamis.
              </p>
            </div>
          </div>

          {/* Card 2: Kalender Agenda */}
          <div
            onClick={onGuestClick}
            className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 group cursor-pointer"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/feature_preview.jpg"
                alt="Kalender Agenda Pintar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5 flex-1 px-1 pb-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Kalender Agenda Pintar
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Tampilan grid bulanan dengan penanda hari ini serta jadwal interview kerja, batas pengumpulan tugas, dan reminder.
              </p>
            </div>
          </div>

          {/* Card 3: Kebun Pertumbuhan Karir */}
          <div
            onClick={onGuestClick}
            className="rounded-3xl overflow-hidden bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col p-4 group cursor-pointer"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
              <img
                src="/images/hero_landscape.jpg"
                alt="Kebun Karir Gamifikasi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5 flex-1 px-1 pb-1">
              <h3 className="font-bold text-sm text-[#242D22] dark:text-[#F1F6F2]">
                Kebun Pertumbuhan Karir
              </h3>
              <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                Kumpulkan XP dari setiap lamaran, sirami tanaman virtualmu, jaga streak konsistensi, dan raih badge pencapaian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Enhanced Premium Footer */}
      <footer className="mt-20 border-t border-[#DEE7D0] dark:border-[#222E25] bg-gradient-to-b from-transparent via-[#EEF3E2]/40 to-[#E4EDD6]/60 dark:via-[#101712]/50 dark:to-[#080C09]/90 pt-16 pb-12 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* CTA Banner Card before Footer Links */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#556832] via-[#687E3E] to-[#F45B88] text-white p-6 sm:p-10 mb-14 shadow-xl shadow-[#556832]/15">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
                  <span>Siap Memulai Langkah Karir Barumu?</span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
                  Tumbuhkan Setiap Kesempatan Karir Bersama ApplyBloom
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                  Pantau puluhan lamaran kerja dengan papan kanban rapi, rawat kebun karir virtualmu, dan taklukkan setiap proses interview.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-white text-[#556832] hover:bg-[#FFF0F3] hover:text-[#C2255C] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Daftar Akun Gratis</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto text-center px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs transition-all"
                >
                  Masuk Akun
                </Link>
              </div>
            </div>
          </div>

          {/* 4-Column Footer Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-[#DEE7D0] dark:border-[#222E25]">
            {/* Col 1: Brand Info */}
            <div className="space-y-3.5">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#788B4E] to-[#556832] dark:from-[#9BC358] dark:to-[#698834] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
                  <Flower2 size={16} />
                </div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-[#2D4526] dark:text-[#E2ECD5]">
                  ApplyBloom
                </span>
              </Link>
              <p className="text-xs text-[#5C6B5E] dark:text-[#9DAEA0] leading-relaxed">
                Platform pintar pelacak lamaran kerja modern dan gamifikasi karir yang menyenangkan untuk para pencari kerja.
              </p>
            </div>

            {/* Col 2: Navigasi Cepat */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D4526] dark:text-[#E2ECD5]">
                Navigasi Cepat
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6B5E] dark:text-[#9DAEA0]">
                <li>
                  <a href="#hero" className="hover:text-[#556832] dark:hover:text-[#9BC358] transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#mengapa-kami" className="hover:text-[#556832] dark:hover:text-[#9BC358] transition-colors">
                    Tentang ApplyBloom
                  </a>
                </li>
                <li>
                  <a href="#fitur" className="hover:text-[#556832] dark:hover:text-[#9BC358] transition-colors">
                    Fitur Unggulan
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#556832] dark:hover:text-[#9BC358] transition-colors">
                    Halaman Masuk (Login)
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#556832] dark:hover:text-[#9BC358] transition-colors">
                    Daftar Akun Baru
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Fitur Utama */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D4526] dark:text-[#E2ECD5]">
                Fitur Unggulan
              </h4>
              <ul className="space-y-2 text-xs text-[#5C6B5E] dark:text-[#9DAEA0]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556832] dark:bg-[#9BC358]" />
                  <span>Kanban Board Pelacak Lamaran</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556832] dark:bg-[#9BC358]" />
                  <span>Kalender Interview & Deadline</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556832] dark:bg-[#9BC358]" />
                  <span>Kebun Karir & Gamifikasi XP</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556832] dark:bg-[#9BC358]" />
                  <span>Pengingat & Notifikasi Otomatis</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#556832] dark:bg-[#9BC358]" />
                  <span>Mode Simulasi Guest Interaktif</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Keamanan & Akses */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#2D4526] dark:text-[#E2ECD5]">
                Akses & Keamanan
              </h4>
              <div className="p-3.5 rounded-2xl bg-[#EEF3E2]/60 dark:bg-[#151D16] border border-[#DEE7D0] dark:border-[#273529] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#2D4526] dark:text-[#E2ECD5] font-semibold">
                  <Shield size={14} className="text-[#556832] dark:text-[#9BC358]" />
                  <span>Data Aman & Terproteksi</span>
                </div>
                <p className="text-[11px] text-[#667768] dark:text-[#9DAEA0] leading-relaxed">
                  Password akun dienkripsi dengan standar industri. Coba simulasi tamu langsung di halaman login/register tanpa khawatir.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#556832] dark:text-[#9BC358] hover:underline pt-0.5"
                >
                  <span>Coba Mode Tamu di Login</span>
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A8E80] dark:text-[#6A7B6E]">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} ApplyBloom. Seluruh Hak Cipta Dilindungi.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[#4E614A] dark:text-[#A0B2A3]">Sistem Aktif & Terlindungi</span>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E281F] border border-[#DEE7D0] dark:border-[#2C3E2E] hover:border-[#556832] text-[#2D4526] dark:text-[#E2ECD5] hover:text-[#556832] dark:hover:text-[#9BC358] shadow-2xs transition-all cursor-pointer text-xs font-semibold"
                title="Kembali ke atas"
              >
                <span>Ke Atas</span>
                <ArrowUp size={12} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
