"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  User,
  Clock,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
} from "lucide-react";
import { useApp } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { BloomieMascot } from "@/components/mascot/BloomieMascot";

function EyeOffIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
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

export default function SettingsPage() {
  const { user, profile, refreshProfile, triggerXpCelebration, showBloomie, toggleBloomie } = useApp();

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setTimezone(user.timezone || "Asia/Jakarta");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/v1/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, timezone }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memperbarui profil");
      }

      setMessage("Profil berhasil disimpan");
      triggerXpCelebration(0, "Nama dan zona waktu diperbarui");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading flex items-center gap-2">
            <Settings size={22} className="text-[#788B4E] dark:text-[#9BC358]" />
            <span>Pengaturan Akun & Profil</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
            Kelola preferensi akun, nama tampilan, dan pelajari keamanan data pribadimu.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-xs transition-colors">
          <h3 className="text-base font-bold text-[#242D22] dark:text-[#F1F6F2] mb-4 flex items-center gap-2">
            <User size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
            <span>Informasi Profil</span>
          </h3>

          {message && (
            <div className="mb-4 p-3 rounded-2xl bg-[#EEF3E2] dark:bg-[#1E281F] border border-[#DEE7D0] dark:border-[#2C3B2E] text-[#556832] dark:text-[#9BC358] text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-[#EDF2E4] dark:bg-[#131A14] text-xs sm:text-sm text-[#7A8E80] dark:text-[#58685C] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#7A8E80] dark:text-[#58685C] mt-1">
                Email terdaftar tidak dapat diubah demi keamanan data.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1.5">
                Zona Waktu (Timezone)
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-all"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB - UTC+7)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA - UTC+8)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT - UTC+9)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
              <p className="text-[11px] text-[#7A8E80] dark:text-[#58685C] mt-1">
                Zona waktu digunakan untuk menghitung streak harianmu secara akurat.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Simpan Profil
              </Button>
            </div>
          </form>
        </div>

        {/* Mascot & UI Preferences Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-2">
              <Sparkles size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
              <span>Tampilan & Maskot Bloomie</span>
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                showBloomie
                  ? "bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] border-[#DEE7D0] dark:border-[#2C3B2E]"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
              }`}
            >
              {showBloomie ? (
                <>
                  <Eye size={12} />
                  <span>Aktif (Ditampilkan)</span>
                </>
              ) : (
                <>
                  <EyeOffIcon size={12} />
                  <span>Disembunyikan</span>
                </>
              )}
            </span>
          </div>

          <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] leading-relaxed mb-5">
            Atur apakah maskot Bloomie kecil yang melayang di pojok layar ingin ditampilkan atau disembunyikan.
          </p>

          {/* Toggle Item */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-center justify-between gap-4 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF3E2] dark:bg-[#1E281F] border border-[#DEE7D0] dark:border-[#2C3B2E] flex items-center justify-center shrink-0 overflow-hidden">
                <BloomieMascot
                  mood={showBloomie ? "happy" : "sleep"}
                  size="sm"
                  interactive={false}
                  showShadow={false}
                  showBubble={false}
                  enableEyeTracking={false}
                  className="scale-65"
                />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2] block mb-0.5">
                  Bloomie Kecil (Floating Companion)
                </strong>
                <span className="text-[11px] sm:text-xs text-[#616D64] dark:text-[#A0B2A3] block">
                  {showBloomie
                    ? "Maskot aktif mengambang di pojok layar, bisa digeser (drag & drop)."
                    : "Maskot disembunyikan untuk tampilan yang lebih minimalis."}
                </span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={showBloomie}
              onClick={() => {
                toggleBloomie();
                triggerXpCelebration(
                  0,
                  !showBloomie
                    ? "Bloomie kecil kembali aktif menemani layarmu! ✨"
                    : "Bloomie kecil disembunyikan."
                );
              }}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/40 ${
                showBloomie ? "bg-[#788B4E] dark:bg-[#9BC358]" : "bg-neutral-300 dark:bg-neutral-700"
              }`}
            >
              <span className="sr-only">Toggle Bloomie Kecil</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showBloomie ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Context tip */}
          <div className="mt-3.5 p-3 rounded-2xl bg-[#EEF3E2]/60 dark:bg-[#1E281F]/60 border border-[#DEE7D0]/60 dark:border-[#2C3B2E]/60 text-[11px] text-[#616D64] dark:text-[#A0B2A3] flex items-center gap-2">
            <span className="shrink-0 text-base">🌱</span>
            <span>
              Catatan: Meskipun Bloomie kecil disembunyikan, kamu tetap dapat berinteraksi dengan Bloomie utama di halaman <strong>Kebun Virtual (Bloom Garden)</strong>.
            </span>
          </div>
        </div>

        {/* Security & Multi-User Architecture Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-xs transition-colors">
          <h3 className="text-base font-bold text-[#242D22] dark:text-[#F1F6F2] mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#788B4E] dark:text-[#9BC358]" />
            <span>Keamanan & Isolasi Data Multi-User</span>
          </h3>

          <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] leading-relaxed mb-4">
            ApplyBloom menerapkan standar arsitektur keamanan multi-user ketat:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#2C3B2E] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#242D22] dark:text-[#F1F6F2] block mb-0.5">
                  Isolasi Kepemilikan Data Penuh (Tenant Boundary)
                </strong>
                <span className="text-[#616D64] dark:text-[#A0B2A3]">
                  Setiap query backend memvalidasi <code>userId</code> pengguna aktif. Pengguna A tidak dapat melihat atau mengubah lamaran pengguna B meskipun mengetahui ID datanya.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#FFF0F3] dark:bg-[#2A141A] text-[#C2255C] dark:text-[#FA7194] border border-[#FDC4D0] dark:border-[#4D1D28] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#242D22] dark:text-[#F1F6F2] block mb-0.5">
                  Password Hashing dengan Bcrypt
                </strong>
                <span className="text-[#616D64] dark:text-[#A0B2A3]">
                  Password tidak pernah disimpan dalam plain text. Password dienkripsi dengan salt rounds sebelum disimpan di database.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#131A14] border border-[#DEE7D0] dark:border-[#232E25] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#242D22] dark:text-[#F1F6F2] block mb-0.5">
                  Integritas XP & Transaksi Atomik
                </strong>
                <span className="text-[#616D64] dark:text-[#A0B2A3]">
                  Pemberian XP dilindungi oleh unique constraint <code>[userId, sourceType, sourceId]</code> untuk mencegah duplikasi atau manipulasi client-side.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
