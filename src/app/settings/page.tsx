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
} from "lucide-react";
import { AppLayout, useApp } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { user, profile, refreshProfile, triggerXpCelebration } = useApp();

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
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#282D29] font-heading flex items-center gap-2">
            <Settings size={22} className="text-[#2D5A43]" />
            <span>Pengaturan Akun & Profil</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5C645D] mt-0.5">
            Kelola preferensi akun, nama tampilan, dan pelajari keamanan data
            pribadimu.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-xs">
          <h3 className="text-base font-bold text-[#282D29] mb-4 flex items-center gap-2">
            <User size={18} className="text-[#2D5A43]" />
            <span>Informasi Profil</span>
          </h3>

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-[#EBF3ED] border border-[#D5E6D8] text-[#2D5A43] text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FDF2F4] border border-[#F6D2D8] text-[#B83E51] text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#282D29] mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FAF7F2] text-xs sm:text-sm text-[#7C857D] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#7C857D] mt-1">
                Email terdaftar tidak dapat diubah demi keamanan data.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282D29] mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-xs sm:text-sm text-[#282D29] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282D29] mb-1">
                Zona Waktu (Timezone)
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-xs sm:text-sm text-[#282D29] focus:outline-none focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43]"
              >
                <option value="Asia/Jakarta">
                  Asia/Jakarta (WIB - UTC+7)
                </option>
                <option value="Asia/Makassar">
                  Asia/Makassar (WITA - UTC+8)
                </option>
                <option value="Asia/Jayapura">
                  Asia/Jayapura (WIT - UTC+9)
                </option>
                <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
              </select>
              <p className="text-[11px] text-[#7C857D] mt-1">
                Zona waktu digunakan untuk menghitung streak harianmu secara
                akurat.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Simpan Profil
              </Button>
            </div>
          </form>
        </div>

        {/* Security & Multi-User Architecture Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8E1D5] shadow-xs">
          <h3 className="text-base font-bold text-[#282D29] mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#2D5A43]" />
            <span>Keamanan & Isolasi Data Multi-User</span>
          </h3>

          <p className="text-xs text-[#5C645D] leading-relaxed mb-4">
            ApplyBloom menerapkan standar arsitektur keamanan multi-user ketat:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#EBF3ED] text-[#2D5A43] border border-[#D5E6D8] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#282D29] block mb-0.5">
                  Isolasi Kepemilikan Data Penuh (Tenant Boundary)
                </strong>
                <span className="text-[#5C645D]">
                  Setiap query backend memvalidasi <code>userId</code> pengguna
                  aktif. Pengguna A tidak dapat melihat atau mengubah lamaran
                  pengguna B meskipun mengetahui ID datanya.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#FDF2F4] text-[#B83E51] border border-[#F6D2D8] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#282D29] block mb-0.5">
                  Password Hashing dengan Bcrypt
                </strong>
                <span className="text-[#5C645D]">
                  Password tidak pernah disimpan dalam plain text. Password
                  dienkripsi dengan salt rounds sebelum disimpan di database.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#FAF3DE] text-[#8C6D1F] border border-[#EFE1B8] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-[#282D29] block mb-0.5">
                  Integritas XP & Transaksi Atomik
                </strong>
                <span className="text-[#5C645D]">
                  Pemberian XP dilindungi oleh unique constraint{" "}
                  <code>[userId, sourceType, sourceId]</code> untuk mencegah
                  duplikasi atau manipulasi client-side.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
