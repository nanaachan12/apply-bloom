"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { REMINDER_TYPE, ReminderTypeType } from "@/lib/constants";
import { ApplicationDto } from "@/types";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  applications: ApplicationDto[];
  preselectedAppId?: string;
  initialDate?: Date | string | null;
}

export function ReminderModal({
  isOpen,
  onClose,
  onSuccess,
  applications,
  preselectedAppId,
  initialDate,
}: ReminderModalProps) {
  const [appId, setAppId] = useState(preselectedAppId || "");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderTypeType>("INTERVIEW");
  const [dueAt, setDueAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedAppId) {
      setAppId(preselectedAppId);
    } else if (applications.length > 0 && !appId) {
      setAppId(applications[0].id);
    }

    if (isOpen) {
      let targetDate: Date;
      if (initialDate) {
        targetDate = new Date(initialDate);
        if (targetDate.getHours() === 0 && targetDate.getMinutes() === 0) {
          targetDate.setHours(10, 0, 0, 0);
        }
      } else {
        // Default due date to tomorrow 10:00 AM
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
        targetDate.setHours(10, 0, 0, 0);
      }
      const tzOffset = targetDate.getTimezoneOffset() * 60000;
      const localISOTime = new Date(targetDate.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);
      setDueAt(localISOTime);
      setTitle("");
      setError(null);
    }
  }, [isOpen, preselectedAppId, applications, initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId) {
      setError("Pilih lamaran terkait");
      return;
    }
    if (!title.trim() || !dueAt) {
      setError("Judul dan waktu pengingat wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/applications/${appId}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type,
          dueAt: new Date(dueAt).toISOString(),
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        throw new Error(json?.error || "Gagal membuat pengingat");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Jadwal & Pengingat"
      subtitle="Catat jadwal interview, deadline tes teknis, atau agenda follow-up."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
            Lamaran Terkait <span className="text-[#F45B88]">*</span>
          </label>
          <select
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
          >
            <option value="" disabled>
              Pilih Perusahaan & Posisi
            </option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.company} — {app.position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
            Tipe Jadwal
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReminderTypeType)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
          >
            <option value={REMINDER_TYPE.INTERVIEW}>Interview (+15 XP)</option>
            <option value={REMINDER_TYPE.ASSESSMENT}>
              Assessment / Coding Test (+15 XP)
            </option>
            <option value={REMINDER_TYPE.DEADLINE}>Deadline Pengumpulan</option>
            <option value={REMINDER_TYPE.FOLLOW_UP}>Follow-up Email</option>
            <option value={REMINDER_TYPE.OTHER}>Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
            Judul Kegiatan <span className="text-[#F45B88]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Interview User dengan Tech Lead"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
            Waktu & Tanggal <span className="text-[#F45B88]">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#DEE7D0]/60 dark:border-[#263328]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Simpan Jadwal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
