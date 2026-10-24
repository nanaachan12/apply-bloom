"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Flower2, Sun, Moon, ChevronLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { BloomieMascot } from "@/components/mascot/BloomieMascot";

interface AuthCardProps {
  initialMode: "login" | "register";
}

// Inline SVGs for Eye and EyeOff for reliable, error-free rendering
function EyeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const router = useRouter();
  const { user, theme, toggleTheme, handleGuestLogin, triggerXpCelebration, triggerRefresh } =
    useApp();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as a permanent user (NOT in guest simulation), redirect to home
  useEffect(() => {
    if (user && user.email !== "guest@applybloom.com") {
      router.push("/");
    }
  }, [user, router]);

  // Keep internal mode aligned if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode]);

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newMode === "login" ? "/login" : "/register");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const payload =
        mode === "login"
          ? { email: email.trim(), password }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
              timezone: "Asia/Jakarta",
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json?.error ||
            (mode === "login"
              ? "Email atau password salah"
              : "Gagal membuat akun")
        );
      }

      if (typeof window !== "undefined") {
        if (json.data?.token) {
          localStorage.setItem("applybloom_token", json.data.token);
        }
        localStorage.removeItem("applybloom_logged_out");
      }

      triggerXpCelebration(
        mode === "login" ? 5 : 10,
        mode === "login"
          ? "Berhasil masuk ke akun!"
          : "Selamat datang! Akun permanen berhasil dibuat."
      );
      triggerRefresh();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGuestLogin = async () => {
    setIsGuestLoading(true);
    setError(null);
    try {
      const success = await handleGuestLogin();
      if (success) {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk ke mode simulasi guest");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const isGuestUser = Boolean(user && user.email === "guest@applybloom.com");

  return (
    <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#788B4E] to-[#556832] dark:from-[#9BC358] dark:to-[#698834] flex items-center justify-center text-white dark:text-[#0C100D] shadow-2xs group-hover:scale-105 transition-transform">
            <Flower2 size={16} />
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-[#2D4526] dark:text-[#E2ECD5]">
            ApplyBloom
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#2D4526] dark:text-[#E2ECD5] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Beranda</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#556832] dark:text-[#9BC358] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors cursor-pointer"
            title="Ganti Tema"
            aria-label="Ganti Tema"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>

      {/* Main Auth Card Container with Organic Aesthetics */}
      <div className="max-w-4xl w-full mx-auto my-6 sm:my-8">
        {/* Notice for guest upgrading to permanent account */}
        {isGuestUser && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#EEF3E2] dark:bg-[#18231A] border border-[#BED0A4] dark:border-[#2C3E2E] text-xs text-[#2D4526] dark:text-[#E2ECD5] flex items-center gap-2.5 shadow-2xs">
            <Flower2 size={16} className="shrink-0 text-[#788B4E] dark:text-[#9BC358]" />
            <span>
              Kamu saat ini berada dalam <strong>Mode Simulasi Tamu</strong>. Daftarkan akun permanen baru di bawah ini agar seluruh data lamaranmu tersimpan selamanya.
            </span>
          </div>
        )}

        <div className="rounded-3xl sm:rounded-[2rem] bg-white dark:bg-[#131914] border border-[#DEE7D0] dark:border-[#232E25] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px] transition-colors">
          {/* Left Column: Organic Botanical Theme, Ambient Glows, Clean Branding (No Triangles) */}
          <div className="relative md:col-span-5 bg-gradient-to-br from-[#1C2C1B] via-[#243B22] to-[#152214] text-white p-7 sm:p-9 flex flex-col justify-between overflow-hidden select-none">
            {/* Soft Organic Ambient Glows (Smooth circular gradients without harsh angles) */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[#788B4E]/25 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-16 w-56 h-56 rounded-full bg-[#9BC358]/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full bg-[#556832]/30 blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-[#E2ECD5]">
                <Flower2 size={12} className="text-[#9BC358]" />
                <span>ApplyBloom Career</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
                Tumbuhkan Karir Impianmu
              </h3>
              <p className="text-xs text-[#C5D8B4] leading-relaxed">
                Setiap lamaran kerja adalah benih. Pantau proses rekrutmen, raih badge pencapaian, dan kembangkan kebun karirmu setiap hari.
              </p>
            </div>

            {/* Center Mascot & Feature Highlights */}
            <div className="relative z-10 my-6 space-y-3">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xs flex items-center gap-3">
                <div className="shrink-0 p-1 rounded-xl bg-white/10">
                  <BloomieMascot size="sm" interactive={false} showBubble={false} mood="happy" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white">Temani Langkah Karirmu</div>
                  <div className="text-[11px] text-[#C5D8B4] mt-0.5">
                    Bloomie siap memberikan motivasi harian dan pengingat interview tepat waktu.
                  </div>
                </div>
              </div>

              {/* Micro feature chips */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#D8E6C9]">
                  <CheckCircle2 size={11} className="text-[#9BC358]" />
                  Kanban Board
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#D8E6C9]">
                  <CheckCircle2 size={11} className="text-[#9BC358]" />
                  Pengingat Interview
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[#D8E6C9]">
                  <CheckCircle2 size={11} className="text-[#9BC358]" />
                  Virtual Garden XP
                </span>
              </div>
            </div>

            {/* Bottom Security Guarantee */}
            <div className="relative z-10 flex items-center gap-2 text-[11px] text-[#A7C095]/90 pt-3 border-t border-white/10">
              <ShieldCheck size={14} className="text-[#9BC358] shrink-0" />
              <span>Data pribadi terlindungi & terenkripsi aman</span>
            </div>
          </div>

          {/* Right Column: Sleek Form with Smooth Tab Switcher & Show/Hide Password */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Modern Smooth Segmented Pill Switcher */}
              <div className="relative bg-[#EEF3E2] dark:bg-[#1A251B] p-1 rounded-full flex max-w-xs mx-auto mb-6 border border-[#DEE7D0] dark:border-[#273529]">
                {/* Smooth Animated Sliding Indicator */}
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white dark:bg-[#28382A] shadow-sm transition-all duration-300 ease-out ${
                    mode === "login" ? "left-1" : "left-[calc(50%+3px)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 text-center cursor-pointer ${
                    mode === "login"
                      ? "text-[#2D4526] dark:text-[#E2ECD5]"
                      : "text-[#6C7C6E] dark:text-[#8E9F90] hover:text-[#2D4526] dark:hover:text-[#E2ECD5]"
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`relative z-10 w-1/2 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors duration-200 text-center cursor-pointer ${
                    mode === "register"
                      ? "text-[#2D4526] dark:text-[#E2ECD5]"
                      : "text-[#6C7C6E] dark:text-[#8E9F90] hover:text-[#2D4526] dark:hover:text-[#E2ECD5]"
                  }`}
                >
                  Daftar
                </button>
              </div>

              {/* Form Title & Description with smooth transition */}
              <div className="mb-6 text-center sm:text-left transition-all duration-200">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#242D22] dark:text-[#F1F6F2]">
                  {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Permanen"}
                </h2>
                <p className="text-xs text-[#5C6B5E] dark:text-[#A0B2A3] mt-1 leading-relaxed">
                  {mode === "login"
                    ? "Masuk ke akunmu untuk melanjutkan pelacakan lamaran dan perkembangan karir."
                    : "Daftarkan akun untuk menyimpan seluruh progres lamaran dan tanaman virtualmu selamanya."}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Form with Clean, Structured Inputs and Smooth Field Animations */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name Field: Smoothly expands in Register mode, collapses in Login mode */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    mode === "register"
                      ? "max-h-24 opacity-100 transform translate-y-0"
                      : "max-h-0 opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <label className="block text-[11px] font-semibold text-[#5C6B5E] dark:text-[#A0B2A3] mb-1">
                    Nama Lengkap
                  </label>
                  <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#273529] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                    <User size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                    <input
                      type="text"
                      required={mode === "register"}
                      placeholder="Nama lengkap kamu"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#5C6B5E] dark:text-[#A0B2A3] mb-1">
                    Alamat Email
                  </label>
                  <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#273529] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                    <Mail size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Password Field with Hide/Show Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-[#5C6B5E] dark:text-[#A0B2A3]">
                      Kata Sandi
                    </label>
                    {mode === "login" && (
                      <span className="text-[11px] text-[#7A8E80] dark:text-[#6A7B6E]">
                        Minimal 6 karakter
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#273529] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                    <Lock size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                    />
                    {/* Hide & Show Password Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded-md text-[#788B4E] dark:text-[#9BC358] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={16} />
                      ) : (
                        <EyeIcon size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-gradient-to-r from-[#556832] to-[#3B5023] hover:from-[#495E2B] hover:to-[#31421D] text-white text-xs font-extrabold uppercase tracking-wider py-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>{mode === "login" ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom: 1-Click Guest Simulation Option */}
            <div className="border-t border-[#EEF3E2] dark:border-[#222E24] pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#7A8E80] dark:text-[#6A7B6E] font-medium text-center sm:text-left">
                Mau mencoba fitur terlebih dahulu?
              </span>

              <button
                type="button"
                onClick={onGuestLogin}
                disabled={isGuestLoading}
                className="px-4 py-2 rounded-full border border-[#BED0A4] dark:border-[#2C3E2E] bg-[#EEF3E2] dark:bg-[#1A251B] text-[#556832] dark:text-[#9BC358] hover:bg-[#E3ECD3] dark:hover:bg-[#233124] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shadow-2xs hover:scale-[1.02]"
                title="Coba langsung tanpa registrasi"
              >
                <Flower2 size={13} />
                <span>{isGuestLoading ? "Memuat..." : "Simulasi Tamu (1-Klik)"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-[#7A8E80] dark:text-[#526356]">
        ApplyBloom — Career Tracker & Growth
      </div>
    </div>
  );
}
