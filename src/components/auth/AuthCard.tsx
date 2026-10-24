"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Flower2, Sun, Moon, ChevronLeft } from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";

interface AuthCardProps {
  initialMode: "login" | "register";
}

// Inline SVGs for Eye and EyeOff for reliable, crisp rendering across all browsers
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

  // If already logged in as a permanent user (NOT guest), redirect to home
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
    <div className="min-h-screen bg-[#F7F9F3] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200">
      {/* Top Navigation Bar - Clean, Compact & Mobile Friendly */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between py-1">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#788B4E] to-[#556832] dark:from-[#9BC358] dark:to-[#698834] flex items-center justify-center text-white dark:text-[#0C100D] shadow-2xs group-hover:scale-105 transition-transform">
            <Flower2 size={16} />
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-[#2D4526] dark:text-[#E2ECD5]">
            ApplyBloom
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#2D4526] dark:text-[#E2ECD5] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Beranda</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full text-[#556832] dark:text-[#9BC358] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors cursor-pointer"
            title="Ganti Tema"
            aria-label="Ganti Tema"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </header>

      {/* Main Clean Centered Auth Card - Ultra Mobile Friendly & Distraction Free */}
      <main className="w-full max-w-md mx-auto my-auto py-4">
        {/* Guest Simulation Notice (if active) */}
        {isGuestUser && (
          <div className="mb-3.5 p-3 rounded-2xl bg-[#EEF3E2] dark:bg-[#18231A] border border-[#BED0A4] dark:border-[#2C3E2E] text-xs text-[#2D4526] dark:text-[#E2ECD5] flex items-center gap-2 shadow-2xs">
            <Flower2 size={15} className="shrink-0 text-[#788B4E] dark:text-[#9BC358]" />
            <span>
              Mode Tamu aktif. Buat akun di bawah agar seluruh data lamaranmu tersimpan permanen.
            </span>
          </div>
        )}

        {/* Card Body */}
        <div className="rounded-3xl bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#222E25] shadow-xl shadow-[#243B22]/5 dark:shadow-black/30 p-6 sm:p-8 transition-colors">
          {/* Brand Emblem & Heading */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#556832] to-[#3B5023] dark:from-[#788B4E] dark:to-[#435726] flex items-center justify-center text-white mx-auto shadow-sm ring-4 ring-[#EEF3E2] dark:ring-[#1E291D]">
              <Flower2 size={22} />
            </div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-[#242D22] dark:text-[#F1F6F2] mt-3">
              {mode === "login" ? "Selamat Datang" : "Buat Akun Baru"}
            </h1>
            <p className="text-xs text-[#667768] dark:text-[#9DAEA0] mt-1 leading-relaxed">
              {mode === "login"
                ? "Masuk untuk melanjutkan pemantauan lamaran kerjamu."
                : "Daftar untuk menyimpan seluruh progres karirmu selamanya."}
            </p>
          </div>

          {/* Smooth Sliding Pill Tab Switcher */}
          <div className="relative bg-[#EEF3E2] dark:bg-[#1A251B] p-1 rounded-2xl flex border border-[#DEE7D0] dark:border-[#273529] mb-5">
            {/* Sliding Active Pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white dark:bg-[#28382A] shadow-xs transition-all duration-300 ease-out ${
                mode === "login" ? "left-1" : "left-[calc(50%+3px)]"
              }`}
            />
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 text-center cursor-pointer ${
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
              className={`relative z-10 w-1/2 py-2 text-xs font-bold transition-colors duration-200 text-center cursor-pointer ${
                mode === "register"
                  ? "text-[#2D4526] dark:text-[#E2ECD5]"
                  : "text-[#6C7C6E] dark:text-[#8E9F90] hover:text-[#2D4526] dark:hover:text-[#E2ECD5]"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Field (Smooth expand/collapse on mode toggle) */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                mode === "register"
                  ? "max-h-24 opacity-100 transform translate-y-0"
                  : "max-h-0 opacity-0 transform -translate-y-2 pointer-events-none"
              }`}
            >
              <label className="block text-xs font-semibold text-[#4F5E52] dark:text-[#A0B2A3] mb-1">
                Nama Lengkap
              </label>
              <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#28382A] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                <User size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                <input
                  type="text"
                  required={mode === "register"}
                  placeholder="Nama lengkap kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-base sm:text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#4F5E52] dark:text-[#A0B2A3] mb-1">
                Alamat Email
              </label>
              <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#28382A] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                <Mail size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-base sm:text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password Field with Hide / Show Password Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#4F5E52] dark:text-[#A0B2A3]">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-[#7A8E80] dark:text-[#6A7B6E]">
                  Minimal 6 karakter
                </span>
              </div>
              <div className="rounded-xl bg-[#F8FAF4] dark:bg-[#18211A] border border-[#DEE7D0] dark:border-[#28382A] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] focus-within:ring-2 focus-within:ring-[#556832]/10 transition-all px-3.5 py-2.5 flex items-center gap-2.5">
                <Lock size={17} className="text-[#6B7D50] dark:text-[#9BC358] shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-base sm:text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden"
                />
                {/* Show/Hide Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-md text-[#788B4E] dark:text-[#9BC358] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#556832] to-[#3B5023] hover:from-[#495E2B] hover:to-[#31421D] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider py-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 min-h-[44px]"
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

          {/* Clean Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5EBDD] dark:border-[#222E25]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white dark:bg-[#141A15] px-3 text-[#7A8E80] dark:text-[#6C7C6E] font-medium">
                atau
              </span>
            </div>
          </div>

          {/* 1-Click Guest Simulation Button */}
          <button
            type="button"
            onClick={onGuestLogin}
            disabled={isGuestLoading}
            className="w-full rounded-xl border border-[#BED0A4] dark:border-[#2C3E2E] bg-[#EEF3E2]/60 hover:bg-[#EEF3E2] dark:bg-[#1A251B]/60 dark:hover:bg-[#1A251B] text-[#556832] dark:text-[#9BC358] py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[42px]"
            title="Coba langsung tanpa akun pribadi"
          >
            <Flower2 size={14} />
            <span>{isGuestLoading ? "Memuat..." : "Coba Mode Tamu (Simulasi 1-Klik)"}</span>
          </button>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="max-w-md w-full mx-auto text-center text-xs text-[#7A8E80] dark:text-[#526356] py-2">
        ApplyBloom — Career Tracker & Growth
      </footer>
    </div>
  );
}
