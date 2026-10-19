"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  ArrowUpDown,
  Building,
} from "lucide-react";
import { AppLayout, useApp } from "@/components/layout/AppLayout";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationModal } from "@/components/applications/ApplicationModal";
import { ApplicationDetailDrawer } from "@/components/applications/ApplicationDetailDrawer";
import { ReminderModal } from "@/components/reminders/ReminderModal";
import { Button } from "@/components/ui/Button";
import { ApplicationDto } from "@/types";
import { APPLICATION_STATUS, ApplicationStatusType } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

export default function ApplicationsPage() {
  const { user, openAddModal, triggerXpCelebration } = useApp();

  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawer state
  const [selectedApp, setSelectedApp] = useState<ApplicationDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reminderAppId, setReminderAppId] = useState<string | undefined>(
    undefined
  );
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        sortBy,
        sortOrder,
      });
      if (search.trim()) params.append("search", search.trim());
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await apiFetch(`/api/v1/applications?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setApplications(json.data || []);
        setTotalCount(json.meta?.total || 0);
      }
    } catch (err) {
      console.error("Fetch apps error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, statusFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusChange = async (
    appId: string,
    newStatus: ApplicationStatusType
  ) => {
    try {
      const res = await fetch(`/api/v1/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.gamification?.awarded) {
          triggerXpCelebration(
            json.gamification.amount,
            `Mencapai tahap ${newStatus}! +${json.gamification.amount} XP`
          );
        }
        fetchApplications();
        if (selectedApp?.id === appId) {
          setSelectedApp(json.data?.application || null);
        }
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchApplications();
        setIsDrawerOpen(false);
      }
    } catch {
      // ignore
    }
  };

  const handleToggleReminder = async (
    reminderId: string,
    isCompleted: boolean
  ) => {
    try {
      const res = await fetch(`/api/v1/reminders/${reminderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      if (res.ok) {
        if (isCompleted) {
          triggerXpCelebration(5, "Agenda selesai! (+5 XP)");
        }
        // Refetch current open app details
        if (selectedApp) {
          const updated = await fetch(
            `/api/v1/applications/${selectedApp.id}`
          ).then((r) => r.json());
          setSelectedApp(updated.data);
        }
      }
    } catch {
      // ignore
    }
  };

  const filterTabs = [
    { key: "ALL", label: "Semua" },
    { key: "WISHLIST", label: "Wishlist" },
    { key: "APPLIED", label: "Applied" },
    { key: "SCREENING", label: "Screening" },
    { key: "ASSESSMENT", label: "Assessment" },
    { key: "INTERVIEW", label: "Interview" },
    { key: "OFFER", label: "Offer" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading flex items-center gap-2">
              <span>My Applications</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF2E4] dark:bg-[#1E281F] text-[#556534] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#28382A]">
                {totalCount}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
              Kelola daftar lamaran kerja, riwayat kontak, dan hasil rekrutmen secara terpusat.
            </p>
          </div>

          <Button variant="primary" onClick={openAddModal}>
            <Plus size={15} />
            <span>Tambah Lamaran</span>
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-[#F8FAF4] dark:bg-[#182019] border border-[#DEE7D0] dark:border-[#263328] shadow-2xs space-y-3 transition-colors">
          {/* Search + Sorting */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8E80]"
              />
              <input
                type="text"
                placeholder="Cari perusahaan, posisi, atau lokasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-xs sm:text-sm text-[#242D22] dark:text-[#F1F6F2] placeholder-[#7A8E80] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30 focus:border-[#788B4E] dark:focus:border-[#9BC358] transition-all"
              />
            </form>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-[#616D64] dark:text-[#A0B2A3] shrink-0 font-medium">
                <ArrowUpDown size={13} />
                <span>Urutkan:</span>
              </div>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split(":");
                  setSortBy(sb);
                  setSortOrder(so as "asc" | "desc");
                }}
                className="px-3 py-2.5 rounded-2xl border border-[#DEE7D0] dark:border-[#263328] bg-white dark:bg-[#131A14] text-xs font-semibold text-[#242D22] dark:text-[#F1F6F2] focus:outline-hidden focus:ring-2 focus:ring-[#788B4E]/30"
              >
                <option value="updatedAt:desc">Terakhir Diperbarui</option>
                <option value="createdAt:desc">Terbaru Dibuat</option>
                <option value="createdAt:asc">Terlama Dibuat</option>
                <option value="company:asc">Nama Perusahaan (A-Z)</option>
                <option value="salaryMax:desc">Gaji Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Status Filter Badges */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-[#788B4E] dark:bg-[#9BC358] text-white dark:text-[#0C100D] shadow-xs"
                    : "bg-white dark:bg-[#131A14] text-[#616D64] dark:text-[#A0B2A3] hover:bg-[#EDF2E4] dark:hover:bg-[#1C251D] hover:text-[#242D22] dark:hover:text-[#F1F6F2] border border-[#DEE7D0] dark:border-[#263328]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Cards List */}
        <ApplicationTable
          applications={applications}
          onSelect={(app) => {
            setSelectedApp(app);
            setIsDrawerOpen(true);
          }}
          onEdit={(app) => {
            setEditingApp(app);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Detail Drawer */}
      <ApplicationDetailDrawer
        isOpen={isDrawerOpen}
        application={selectedApp}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(app) => {
          setIsDrawerOpen(false);
          setEditingApp(app);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onAddReminder={(appId) => {
          setReminderAppId(appId);
          setIsReminderModalOpen(true);
        }}
        onToggleReminder={handleToggleReminder}
      />

      {/* Edit Modal */}
      <ApplicationModal
        isOpen={isEditModalOpen}
        initialData={editingApp}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
        }}
        onSuccess={() => {
          fetchApplications();
        }}
      />

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        preselectedAppId={reminderAppId}
        applications={applications}
        onClose={() => {
          setIsReminderModalOpen(false);
          setReminderAppId(undefined);
        }}
        onSuccess={() => {
          fetchApplications();
          if (selectedApp) {
            fetch(`/api/v1/applications/${selectedApp.id}`)
              .then((r) => r.json())
              .then((j) => setSelectedApp(j.data));
          }
        }}
      />
    </AppLayout>
  );
}
