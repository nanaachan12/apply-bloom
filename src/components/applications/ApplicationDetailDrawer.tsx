"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ApplicationDto, ReminderDto } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { APPLICATION_STATUS, ApplicationStatusType } from "@/lib/constants";

interface ApplicationDetailDrawerProps {
  application: ApplicationDto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (app: ApplicationDto) => void;
  onDelete: (id: string) => void;
  onStatusChange: (appId: string, newStatus: ApplicationStatusType) => void;
  onAddReminder: (appId: string) => void;
  onToggleReminder: (reminderId: string, isCompleted: boolean) => void;
}

export function ApplicationDetailDrawer({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onAddReminder,
  onToggleReminder,
}: ApplicationDetailDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!isOpen || !application) return null;

  const handleStatusSelect = async (newStatus: ApplicationStatusType) => {
    if (newStatus === application.status) return;
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(application.id, newStatus);
      if (newStatus === "OFFER" || newStatus === "INTERVIEW") {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#7C5CFC", "#DDEBDD", "#F6AD55"],
        });
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatCurrency = (val: number | null) => {
    if (!val) return null;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: application.currency || "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const salaryString =
    application.salaryMin && application.salaryMax
      ? `${formatCurrency(application.salaryMin)} - ${formatCurrency(application.salaryMax)}`
      : application.salaryMin
      ? `Mulai ${formatCurrency(application.salaryMin)}`
      : application.salaryMax
      ? `Hingga ${formatCurrency(application.salaryMax)}`
      : "Negosiasi / Tidak disebutkan";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C100D]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#141A15] h-full shadow-2xl border-l border-[#DEE7D0] dark:border-[#232E25] p-6 sm:p-7 overflow-y-auto z-10 animate-in slide-in-from-right duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#DEE7D0]/60 dark:border-[#232E25]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF2E4] dark:bg-[#1F2B20] border border-[#DEE7D0] dark:border-[#28382A] flex items-center justify-center text-[#788B4E] dark:text-[#9BC358] font-bold text-xl">
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading">
                {application.position}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
                <span className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">
                  {application.company}
                </span>
                {application.location && (
                  <>
                    <span className="w-px h-3 bg-[#DEE7D0] dark:bg-[#28382A]" />
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#7A8E80]" />
                      {application.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#7A8E80] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EDF2E4] dark:hover:bg-[#232E25] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status bar */}
        <div className="my-5 p-4 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <span className="text-xs text-[#616D64] dark:text-[#A0B2A3] font-medium block mb-1">
              Status Sekarang
            </span>
            <StatusBadge status={application.status} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#616D64] dark:text-[#A0B2A3] font-medium">Ubah:</span>
            <select
              value={application.status}
              disabled={isUpdatingStatus}
              onChange={(e) =>
                handleStatusSelect(e.target.value as ApplicationStatusType)
              }
              className="text-xs font-semibold px-3 py-1.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-[#242D22] dark:text-[#F1F6F2] focus:ring-2 focus:ring-[#788B4E]/30"
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
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#182019] shadow-2xs">
            <span className="flex items-center gap-1.5 text-xs text-[#616D64] dark:text-[#A0B2A3] font-medium mb-1">
              <DollarSign size={14} className="text-[#788B4E] dark:text-[#9BC358]" />
              Gaji
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#242D22] dark:text-[#F1F6F2]">
              {salaryString}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#182019] shadow-2xs">
            <span className="flex items-center gap-1.5 text-xs text-[#616D64] dark:text-[#A0B2A3] font-medium mb-1">
              <Briefcase size={14} className="text-[#788B4E] dark:text-[#9BC358]" />
              Tipe Kerja
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#242D22] dark:text-[#F1F6F2]">
              {application.employmentType
                ? application.employmentType.replace("_", " ")
                : "Tidak ditentukan"}
            </p>
          </div>
        </div>

        {/* Job URL & Source */}
        <div className="space-y-3 mb-6">
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#788B4E] dark:text-[#9BC358] hover:underline"
            >
              <ExternalLink size={14} />
              Buka Tautan Lowongan Asli
            </a>
          )}

          {application.source && (
            <p className="text-xs text-[#616D64] dark:text-[#A0B2A3]">
              Sumber: <span className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">{application.source}</span>
            </p>
          )}

          {application.appliedAt && (
            <p className="text-xs text-[#616D64] dark:text-[#A0B2A3]">
              Tanggal Melamar:{" "}
              <span className="font-semibold text-[#242D22] dark:text-[#F1F6F2]">
                {new Date(application.appliedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>

        {/* Notes */}
        {application.notes && (
          <div className="mb-6 p-4 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328]">
            <h4 className="text-xs font-bold text-[#788B4E] dark:text-[#9BC358] uppercase tracking-wider mb-1.5">
              Catatan & Evaluasi
            </h4>
            <p className="text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2] whitespace-pre-wrap leading-relaxed">
              {application.notes}
            </p>
          </div>
        )}

        {/* Linked Reminders */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-[#242D22] dark:text-[#F1F6F2] flex items-center gap-1.5">
              <Clock size={15} className="text-[#788B4E] dark:text-[#9BC358]" />
              Jadwal & Pengingat ({application.reminders?.length || 0})
            </h4>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAddReminder(application.id)}
            >
              <Plus size={13} />
              <span>Tambah Jadwal</span>
            </Button>
          </div>

          {application.reminders && application.reminders.length > 0 ? (
            <div className="space-y-2">
              {application.reminders.map((rem) => {
                const isDone = Boolean(rem.completedAt);
                return (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                      isDone
                        ? "bg-[#F8FAF4]/80 dark:bg-[#182019]/60 border-[#DEE7D0] dark:border-[#263328] line-through text-[#7A8E80] dark:text-[#58685C]"
                        : "bg-white dark:bg-[#182019] border-[#DEE7D0] dark:border-[#263328] text-[#242D22] dark:text-[#F1F6F2] shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={(e) =>
                          onToggleReminder(rem.id, e.target.checked)
                        }
                        className="rounded accent-[#788B4E] dark:accent-[#9BC358] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <p className="font-semibold">{rem.title}</p>
                        <p className="text-[11px] text-[#616D64] dark:text-[#A0B2A3]">
                          {new Date(rem.dueAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                      {rem.type}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[#7A8E80] italic">
              Belum ada jadwal reminder untuk lamaran ini.
            </p>
          )}
        </div>

        {/* Timeline Events */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-[#242D22] dark:text-[#F1F6F2] mb-3 flex items-center gap-1.5">
            <Calendar size={15} className="text-[#788B4E] dark:text-[#9BC358]" />
            Riwayat Tahapan Rekrutmen
          </h4>

          {application.events && application.events.length > 0 ? (
            <div className="relative pl-6 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-[#DEE7D0] dark:before:bg-[#263328]">
              {application.events.map((ev) => (
                <div key={ev.id} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#788B4E] dark:bg-[#9BC358] ring-4 ring-white dark:ring-[#141A15]" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#242D22] dark:text-[#F1F6F2]">
                      {ev.toStatus || "Updated"}
                    </span>
                    <span className="text-[11px] text-[#7A8E80]">
                      {new Date(ev.occurredAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  {ev.description && (
                    <p className="text-[#616D64] dark:text-[#A0B2A3] mt-0.5 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A8E80] italic">
              Belum ada riwayat tercatat.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#DEE7D0]/60 dark:border-[#232E25]">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  `Apakah kamu yakin ingin menghapus lamaran di ${application.company}?`
                )
              ) {
                onDelete(application.id);
                onClose();
              }
            }}
          >
            <Trash2 size={13} />
            <span>Hapus</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onEdit(application);
            }}
          >
            <Edit3 size={13} />
            <span>Edit Lamaran</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
