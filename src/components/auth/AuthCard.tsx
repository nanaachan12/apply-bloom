"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Flower2, Sun, Moon, ChevronLeft } from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";

interface AuthCardProps {
  initialMode: "login" | "register";
}

export function AuthCard({ initialMode }: AuthCardProps) {
  const router = useRouter();
  const { user, theme, toggleTheme, handleGuestLogin, triggerXpCelebration, triggerRefresh } =
    useApp();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#2D4526] dark:text-[#E2ECD5] hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] transition-colors"
          >
            <ChevronLeft size={14} />
            <span>Kembali ke Beranda</span>
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

      {/* Main Auth Card Container (matching uploaded mockup with organic forest palette) */}
      <div className="max-w-3xl w-full mx-auto my-6 sm:my-10">
        {/* Notice for guest upgrading to permanent account */}
        {isGuestUser && (
          <div className="mb-4 p-3 sm:p-3.5 rounded-2xl bg-[#EEF3E2] dark:bg-[#18231A] border border-[#BED0A4] dark:border-[#2C3E2E] text-xs text-[#2D4526] dark:text-[#E2ECD5] flex items-center gap-2 shadow-2xs">
            <Flower2 size={15} className="shrink-0 text-[#788B4E] dark:text-[#9BC358]" />
            <span>
              Kamu saat ini berada dalam <strong>Mode Simulasi Tamu</strong>. Daftarkan akun permanen baru di bawah ini agar data lamaranmu tersimpan selamanya!
            </span>
          </div>
        )}

        <div className="rounded-3xl sm:rounded-[2.5rem] bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] shadow-2xl overflow-hidden flex flex-col sm:flex-row transition-colors">
          {/* Left Column: Geometric Diagonal Folded Ribbons & Seam Cutout Tabs */}
          <div className="relative w-full sm:w-[40%] min-h-[220px] sm:min-h-[480px] bg-gradient-to-br from-[#1E311B] via-[#2A4325] to-[#142312] overflow-hidden flex flex-col justify-between p-6 select-none">
            {/* Geometric Diagonal Ribbons in Forest & Moss Palette */}
            <div
              className="absolute -top-16 -left-16 w-80 h-80 bg-[#3B572A]/40 rounded-3xl transform -rotate-45 pointer-events-none"
              style={{ filter: "blur(1px)" }}
            />
            <div className="absolute top-1/4 -left-20 w-96 h-44 bg-gradient-to-r from-[#4E6F36] via-[#638C44] to-[#405D2C] transform -rotate-45 shadow-xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-gradient-to-tr from-[#6C974B] to-[#7EA956] transform rotate-12 opacity-80 shadow-2xl pointer-events-none" />
            <div className="absolute top-10 left-1/3 w-36 h-80 bg-[#C9DEC0]/20 transform -rotate-45 pointer-events-none" />

            {/* Brand Logo inside ribbon */}
            <div className="relative z-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D3E5C7]/80">
                ApplyBloom Portal
              </span>
            </div>

            {/* Desktop Seam Cutout Tabs protruding into left ribbon with smooth active slide */}
            <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end z-20 w-32">
              {/* Tab: LOGIN */}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`w-full py-2.5 px-5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 text-right cursor-pointer ${
                  mode === "login"
                    ? "bg-white dark:bg-[#141A15] text-[#2D4526] dark:text-[#E2ECD5] rounded-l-full shadow-lg translate-x-0"
                    : "text-white/80 hover:text-white pr-4"
                }`}
              >
                LOGIN
              </button>

              {/* Tab: REGISTER / SIGN IN */}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`w-full mt-2 py-2.5 px-5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 text-right cursor-pointer ${
                  mode === "register"
                    ? "bg-white dark:bg-[#141A15] text-[#2D4526] dark:text-[#E2ECD5] rounded-l-full shadow-lg translate-x-0"
                    : "text-white/80 hover:text-white pr-4"
                }`}
              >
                SIGN IN
              </button>
            </div>

            {/* Mobile Tab Toggle */}
            <div className="flex sm:hidden relative z-20 items-center justify-center gap-2 bg-black/30 backdrop-blur-xs rounded-full p-1 self-center">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  mode === "login"
                    ? "bg-white text-[#2D4526] shadow-sm"
                    : "text-white/80"
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  mode === "register"
                    ? "bg-white text-[#2D4526] shadow-sm"
                    : "text-white/80"
                }`}
              >
                SIGN IN
              </button>
            </div>

            {/* Ribbon bottom quote */}
            <div className="relative z-10 text-[10px] text-[#D3E5C7]/70">
              Tumbuhkan karir impianmu lebih teratur.
            </div>
          </div>

          {/* Right Column: Form Area */}
          <div className="w-full sm:w-[60%] p-6 sm:p-10 flex flex-col justify-between">
            <div className="transition-all duration-300 ease-in-out">
              {/* Circular Avatar Top Icon with Organic Forest Gradient */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#556832] to-[#2D4526] dark:from-[#788B4E] dark:to-[#405423] flex items-center justify-center text-white shadow-md mx-auto mb-2 ring-4 ring-[#EEF3E2] dark:ring-[#1E291D] transition-transform duration-300 hover:scale-105">
                  <User size={28} />
                </div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider text-[#2D4526] dark:text-[#E2ECD5] transition-all duration-200">
                  {mode === "login" ? "LOGIN" : "REGISTER"}
                </h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              {/* Form with clean underline style inputs & smooth field animations */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="border-b-2 border-gray-200 dark:border-[#263328] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] py-2 flex items-center gap-3 transition-colors animate-in fade-in slide-in-from-top-1 duration-200">
                    <User size={18} className="text-[#556832] dark:text-[#9BC358] shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-gray-400 focus:outline-hidden"
                    />
                  </div>
                )}

                <div className="border-b-2 border-gray-200 dark:border-[#263328] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] py-2 flex items-center gap-3 transition-colors">
                  <Mail size={18} className="text-[#556832] dark:text-[#9BC358] shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-gray-400 focus:outline-hidden"
                  />
                </div>

                <div className="border-b-2 border-gray-200 dark:border-[#263328] focus-within:border-[#556832] dark:focus-within:border-[#9BC358] py-2 flex items-center gap-3 transition-colors">
                  <Lock size={18} className="text-[#556832] dark:text-[#9BC358] shrink-0" />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-gray-400 focus:outline-hidden"
                  />
                </div>

                {/* Forgot Password & Submit Row */}
                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "login" ? "register" : "login");
                      setError(null);
                    }}
                    className="text-xs text-[#556832] dark:text-[#9BC358] hover:underline cursor-pointer transition-colors"
                  >
                    {mode === "login"
                      ? "Belum punya akun? Sign In"
                      : "Sudah punya akun? Login"}
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-full bg-gradient-to-r from-[#556832] to-[#3B5023] hover:from-[#495E2B] hover:to-[#31421D] text-white text-xs font-extrabold uppercase tracking-wider px-8 py-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isLoading
                      ? "Memproses..."
                      : mode === "login"
                      ? "LOGIN"
                      : "REGISTER"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom: Or Login With Section */}
            <div className="border-t border-gray-100 dark:border-gray-800/80 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-gray-400 dark:text-gray-500 font-medium">
                Or Login With
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGuestLogin}
                  disabled={isGuestLoading}
                  className="px-3.5 py-1.5 rounded-full border border-[#BED0A4] dark:border-[#2C3E2E] bg-[#EEF3E2] dark:bg-[#1A251B] text-[#556832] dark:text-[#9BC358] hover:bg-[#E3ECD3] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Coba langsung tanpa akun pribadi"
                >
                  <Flower2 size={13} />
                  <span>{isGuestLoading ? "Memuat..." : "Simulasi Guest"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-gray-400 dark:text-gray-600">
        ApplyBloom — Career Tracker & Growth
      </div>
    </div>
  );
}
