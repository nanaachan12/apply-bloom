"use client";

import React, { useState, useEffect } from "react";
import { KanbanSquare, Plus, Sparkles } from "lucide-react";
import { AppLayout, useApp } from "@/components/layout/AppLayout";
import { PipelineBoard } from "@/components/applications/PipelineBoard";
import { ApplicationDetailDrawer } from "@/components/applications/ApplicationDetailDrawer";
import { ApplicationModal } from "@/components/applications/ApplicationModal";
import { ReminderModal } from "@/components/reminders/ReminderModal";
import { WireframeSkeleton } from "@/components/ui/WireframeSkeleton";
import { Button } from "@/components/ui/Button";
import { ApplicationDto } from "@/types";
import { ApplicationStatusType } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

export default function PipelinePage() {
  const { user, openAddModal, triggerXpCelebration, refreshTimestamp } = useApp();
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detail drawer & Modals
  const [selectedApp, setSelectedApp] = useState<ApplicationDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reminderAppId, setReminderAppId] = useState<string | undefined>(
    undefined
  );
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [addCardStatus, setAddCardStatus] = useState<ApplicationStatusType | null>(null);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await apiFetch("/api/v1/applications?limit=100");
      if (res.ok) {
        const json = await res.json();
        setApplications(json.data || []);
      }
    } catch (err) {
      console.error("Fetch pipeline error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, refreshTimestamp]);

  const handleMoveStatus = async (
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
            `Berhasil melangkah ke ${newStatus}! +${json.gamification.amount} XP`
          );
        } else {
          triggerXpCelebration(0, `Dipindahkan ke tahap ${newStatus}`);
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

  return (
    <AppLayout>
      {isLoading ? (
        <WireframeSkeleton type="pipeline" />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading flex items-center gap-2">
                <KanbanSquare size={22} className="text-[#788B4E] dark:text-[#9BC358]" />
                <span>Pipeline Board</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
                Pantau seluruh tahapan rekrutmen secara visual dan pindahkan lamaran
                seiring berjalannya proses.
              </p>
            </div>

            <Button variant="primary" onClick={openAddModal}>
              <Plus size={15} />
              <span>Tambah Lamaran</span>
            </Button>
          </div>

          {/* Board View */}
          <PipelineBoard
            applications={applications}
            onSelectApplication={(app) => {
              setSelectedApp(app);
              setIsDrawerOpen(true);
            }}
            onMoveStatus={handleMoveStatus}
            onAddCard={(status) => setAddCardStatus(status)}
          />
        </div>
      )}

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
        onStatusChange={handleMoveStatus}
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

      {/* Stage Specific Add Card Modal */}
      <ApplicationModal
        isOpen={Boolean(addCardStatus)}
        defaultStatus={addCardStatus || "WISHLIST"}
        onClose={() => setAddCardStatus(null)}
        onSuccess={() => {
          fetchApplications();
          triggerXpCelebration(10, "Lamaran baru berhasil ditambahkan! +10 XP");
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
        }}
      />
    </AppLayout>
  );
}
