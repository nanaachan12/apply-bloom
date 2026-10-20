"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  APPLICATION_STATUS,
  EMPLOYMENT_TYPE,
  ApplicationStatusType,
  EmploymentTypeType,
} from "@/lib/constants";
import { ApplicationDto } from "@/types";

import { apiFetch } from "@/lib/api";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  initialData?: ApplicationDto | null;
  defaultStatus?: ApplicationStatusType;
}

export function ApplicationModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  defaultStatus = "APPLIED",
}: ApplicationModalProps) {
  const isEditing = Boolean(initialData);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentTypeType | "">(
    "FULL_TIME"
  );
  const [salaryMin, setSalaryMin] = useState<string>("");
  const [salaryMax, setSalaryMax] = useState<string>("");
  const [currency, setCurrency] = useState("IDR");
  const [source, setSource] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<ApplicationStatusType>(defaultStatus);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || "");
      setPosition(initialData.position || "");
      setLocation(initialData.location || "");
      setEmploymentType(initialData.employmentType || "FULL_TIME");
      setSalaryMin(initialData.salaryMin ? String(initialData.salaryMin) : "");
      setSalaryMax(initialData.salaryMax ? String(initialData.salaryMax) : "");
      setCurrency(initialData.currency || "IDR");
      setSource(initialData.source || "");
      setJobUrl(initialData.jobUrl || "");
      setStatus(initialData.status || "APPLIED");
      setNotes(initialData.notes || "");
    } else {
      setCompany("");
      setPosition("");
      setLocation("");
      setEmploymentType("FULL_TIME");
      setSalaryMin("");
      setSalaryMax("");
      setCurrency("IDR");
      setSource("LinkedIn");
      setJobUrl("");
      setStatus(defaultStatus || "APPLIED");
      setNotes("");
    }
    setError(null);
  }, [initialData, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) {
      setError("Nama perusahaan dan posisi wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);

    let formattedJobUrl = jobUrl.trim();
    if (formattedJobUrl && !/^https?:\/\//i.test(formattedJobUrl)) {
      formattedJobUrl = `https://${formattedJobUrl}`;
    }

    const parsedMin = salaryMin.trim() && !isNaN(Number(salaryMin)) ? Number(salaryMin) : null;
    const parsedMax = salaryMax.trim() && !isNaN(Number(salaryMax)) ? Number(salaryMax) : null;

    const payload = {
      company: company.trim(),
      position: position.trim(),
      location: location.trim() || null,
      employmentType: employmentType || null,
      salaryMin: parsedMin,
      salaryMax: parsedMax,
      currency,
      source: source.trim() || null,
      jobUrl: formattedJobUrl || null,
      status,
      notes: notes.trim() || null,
    };

    try {
      const url = isEditing
        ? `/api/v1/applications/${initialData?.id}`
        : "/api/v1/applications";
      const method = isEditing ? "PATCH" : "POST";

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        throw new Error(json?.error || "Gagal menyimpan lamaran kerja");
      }

      onSuccess(json);
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Lamaran Kerja" : "Tambah Lamaran Baru"}
      subtitle={
        isEditing
          ? "Perbarui detail dan catatan progres lamaranmu"
          : "Catat lamaran baru untuk mendapatkan +10 XP dan menumbuhkan tanaman kebunmu."
      }
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Perusahaan <span className="text-[#F45B88]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: GoTo, Traveloka, Shopee"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Posisi Pekerjaan <span className="text-[#F45B88]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Frontend Engineer, Product Lead"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Status Lamaran
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatusType)}
              className="w-full px-3 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            >
              <option value={APPLICATION_STATUS.WISHLIST}>Wishlist</option>
              <option value={APPLICATION_STATUS.APPLIED}>Applied</option>
              <option value={APPLICATION_STATUS.SCREENING}>Screening</option>
              <option value={APPLICATION_STATUS.ASSESSMENT}>Assessment</option>
              <option value={APPLICATION_STATUS.INTERVIEW}>Interview</option>
              <option value={APPLICATION_STATUS.OFFER}>Offer</option>
              <option value={APPLICATION_STATUS.REJECTED}>Rejected</option>
              <option value={APPLICATION_STATUS.WITHDRAWN}>Withdrawn</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Tipe Pekerjaan
            </label>
            <select
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(e.target.value as EmploymentTypeType)
              }
              className="w-full px-3 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            >
              <option value={EMPLOYMENT_TYPE.FULL_TIME}>Full Time</option>
              <option value={EMPLOYMENT_TYPE.PART_TIME}>Part Time</option>
              <option value={EMPLOYMENT_TYPE.CONTRACT}>Contract</option>
              <option value={EMPLOYMENT_TYPE.INTERNSHIP}>Internship</option>
              <option value={EMPLOYMENT_TYPE.FREELANCE}>Freelance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Lokasi
            </label>
            <input
              type="text"
              placeholder="Jakarta / Remote / Hybrid"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Sumber Lowongan
            </label>
            <input
              type="text"
              placeholder="LinkedIn, Jobstreet, Glints, Referral"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              URL Lowongan
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Gaji Minimal ({currency})
            </label>
            <input
              type="number"
              placeholder="Contoh: 15000000"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
              Gaji Maksimal ({currency})
            </label>
            <input
              type="number"
              placeholder="Contoh: 25000000"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] mb-1">
            Catatan & Evaluasi (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Catat tahapan tes, pertanyaan yang diajukan interviewer, poin negosiasi, atau refleksi belajar..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-colors"
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
            {isEditing ? "Simpan Perubahan" : "Tambah Lamaran"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
