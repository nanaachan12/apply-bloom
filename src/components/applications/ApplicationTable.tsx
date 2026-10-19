"use client";

import React from "react";
import {
  MoreVertical,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  Edit2,
  Trash2,
  Clock,
  Eye,
  Briefcase,
} from "lucide-react";
import { ApplicationDto } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import { ApplicationStatusType } from "@/lib/constants";

interface ApplicationTableProps {
  applications: ApplicationDto[];
  onSelect: (app: ApplicationDto) => void;
  onEdit: (app: ApplicationDto) => void;
  onDelete: (id: string) => void;
}

export function ApplicationTable({
  applications,
  onSelect,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  const formatCurrency = (val: number | null, curr = "IDR") => {
    if (!val) return null;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (applications.length === 0) {
    return (
      <div className="p-10 sm:p-12 text-center bg-[#F8FAF4] dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328]">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#EDF2E4] dark:bg-[#1E281F] border border-[#DEE7D0] dark:border-[#28382A] flex items-center justify-center text-[#788B4E] dark:text-[#9BC358]">
          <Briefcase size={22} />
        </div>
        <h3 className="text-base font-bold text-[#242D22] dark:text-[#F1F6F2]">
          Belum ada lamaran yang cocok
        </h3>
        <p className="text-xs text-[#616D64] dark:text-[#A0B2A3] max-w-sm mx-auto mt-1 leading-relaxed">
          Coba ubah kata kunci pencarian, filter status, atau klik tombol Tambah
          Lamaran untuk mencatat target pekerjaan barumu.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-[#F8FAF4] dark:bg-[#182019] rounded-3xl border border-[#DEE7D0] dark:border-[#263328] shadow-2xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#DEE7D0] dark:border-[#263328] bg-[#EDF2E4]/60 dark:bg-[#131A14] text-[#556534] dark:text-[#A0B2A3] text-xs font-semibold">
              <th className="py-3.5 px-4">Perusahaan</th>
              <th className="py-3.5 px-4">Posisi</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Tipe & Lokasi</th>
              <th className="py-3.5 px-4">Perkiraan Gaji</th>
              <th className="py-3.5 px-4">Tanggal Melamar</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE7D0]/60 dark:divide-[#232E25]">
            {applications.map((app) => {
              const salaryString =
                app.salaryMin && app.salaryMax
                  ? `${formatCurrency(app.salaryMin, app.currency)} - ${formatCurrency(app.salaryMax, app.currency)}`
                  : app.salaryMin
                  ? `Mulai ${formatCurrency(app.salaryMin, app.currency)}`
                  : app.salaryMax
                  ? `Hingga ${formatCurrency(app.salaryMax, app.currency)}`
                  : "-";

              return (
                <tr
                  key={app.id}
                  onClick={() => onSelect(app)}
                  className="hover:bg-[#EDF2E4]/40 dark:hover:bg-[#1F2B20]/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#242D22] dark:text-[#F1F6F2]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#EDF2E4] dark:bg-[#1F2B20] text-[#788B4E] dark:text-[#9BC358] font-bold flex items-center justify-center text-xs shrink-0 border border-[#DEE7D0] dark:border-[#28382A]">
                        {app.company.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[140px]">
                        {app.company}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#242D22] dark:text-[#F1F6F2] font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[160px]">
                        {app.position}
                      </span>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#788B4E] dark:text-[#9BC358] hover:text-[#556534]"
                          title="Buka link"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} />
                  </td>

                  <td className="py-3.5 px-4 text-xs text-[#616D64] dark:text-[#A0B2A3]">
                    <div>
                      {app.employmentType?.replace("_", " ") || "Full Time"}
                    </div>
                    {app.location && (
                      <div className="text-[11px] text-[#7A8E80]">
                        {app.location}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-medium text-[#242D22] dark:text-[#F1F6F2]">
                    {salaryString}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-[#616D64] dark:text-[#A0B2A3]">
                    {app.appliedAt ? (
                      new Date(app.appliedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    ) : (
                      <span className="text-[#7A8E80] italic">Belum melamar</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(app);
                        }}
                        className="p-1.5 rounded-lg text-[#616D64] dark:text-[#A0B2A3] hover:text-[#788B4E] dark:hover:text-[#9BC358] hover:bg-[#EDF2E4] dark:hover:bg-[#232E25] cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(app);
                        }}
                        className="p-1.5 rounded-lg text-[#616D64] dark:text-[#A0B2A3] hover:text-[#788B4E] dark:hover:text-[#9BC358] hover:bg-[#EDF2E4] dark:hover:bg-[#232E25] cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Hapus lamaran di ${app.company}?`
                            )
                          ) {
                            onDelete(app.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#616D64] dark:text-[#A0B2A3] hover:text-[#F45B88] hover:bg-[#FFF0F3] dark:hover:bg-[#2A141A] cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => onSelect(app)}
            className="p-4 bg-[#F8FAF4] dark:bg-[#182019] rounded-2xl border border-[#DEE7D0] dark:border-[#263328] shadow-2xs hover:border-[#788B4E] dark:hover:border-[#9BC358] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[11px] font-semibold text-[#7A8E80] uppercase tracking-wider block">
                  {app.company}
                </span>
                <h4 className="font-bold text-base text-[#242D22] dark:text-[#F1F6F2] mt-0.5">
                  {app.position}
                </h4>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#616D64] dark:text-[#A0B2A3] mt-2 pt-2 border-t border-[#DEE7D0]/60 dark:border-[#263328]">
              {app.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#7A8E80]" />
                  {app.location}
                </span>
              )}
              {app.appliedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-[#7A8E80]" />
                  {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
