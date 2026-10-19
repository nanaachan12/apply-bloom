"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  CalendarCheck,
  Flower2,
  Settings,
  X,
  Sparkles,
  Flame,
  Plus,
} from "lucide-react";
import { GamificationProfileDto } from "@/types";
import { useApp } from "@/components/layout/AppLayout";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: GamificationProfileDto | null;
  onAddApplication: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  profile,
  onAddApplication,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useApp();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "My Applications", href: "/applications", icon: Briefcase },
    { label: "Pipeline Board", href: "/pipeline", icon: KanbanSquare },
    { label: "Calendar & Reminders", href: "/reminders", icon: CalendarCheck },
    { label: "Bloom Garden", href: "/garden", icon: Flower2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - Olive Sage in Light Mode, Tactical Gunmetal in Dark Mode */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#7B8E50] dark:bg-[#131A14] border-r border-[#6F8146] dark:border-[#232E25] text-white flex flex-col justify-between p-5 transition-all duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Profile Card (Matching User Reference Image) */}
          <div className="flex items-center justify-between pb-5 mb-3 border-b border-white/20 dark:border-[#232E25]">
            <Link
              href="/settings"
              className="flex items-center gap-3 group min-w-0"
              onClick={onClose}
            >
              <div className="w-11 h-11 rounded-2xl bg-white/20 dark:bg-[#233125] border border-white/30 dark:border-[#354837] flex items-center justify-center text-white dark:text-[#A8D063] font-bold text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                {user ? user.name.charAt(0).toUpperCase() : "K"}
              </div>
              <div className="min-w-0">
                <span className="font-heading font-bold text-sm text-white tracking-tight truncate block">
                  {user?.name || "Kandidat Bloom"}
                </span>
                <span className="text-[11px] text-[#E2EBD3] dark:text-[#8E9F90] truncate block">
                  Level {profile?.level ?? 1} • {profile?.totalXp ?? 0} XP
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 lg:hidden"
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Section Menu Label */}
          <p className="text-[11px] font-bold text-white/70 dark:text-[#8E9F90] uppercase tracking-wider px-3 my-2">
            Menu
          </p>

          {/* Nav Items - Floating White Pill on Active */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white dark:bg-[#233125] text-[#63733E] dark:text-[#A8D063] font-bold shadow-sm dark:border dark:border-[#354837]"
                      : "text-white/85 dark:text-[#8E9F90] hover:text-white dark:hover:text-[#F1F6F2] hover:bg-white/10 dark:hover:bg-[#1E281F]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-[#63733E] dark:text-[#A8D063]"
                        : "text-white/80 dark:text-[#8E9F90]"
                    }
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Garden Plant Status Card */}
        <div className="space-y-3 pt-3">
          <div className="p-3.5 rounded-2xl bg-black/15 dark:bg-[#1A221C] border border-white/20 dark:border-[#28352A] backdrop-blur-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flower2 size={13} className="text-[#E2EBD3] dark:text-[#A8D063]" />
                <span>Level {profile?.level ?? 1} Tanaman</span>
              </span>
              <span className="text-[11px] font-semibold text-[#E2EBD3] dark:text-[#A8D063]">
                {profile?.totalXp ?? 0} XP
              </span>
            </div>

            {/* XP progress bar */}
            <div className="w-full h-2 rounded-full bg-white/20 dark:bg-[#242E25] overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-white dark:bg-[#A8D063] transition-all duration-300"
                style={{
                  width: `${Math.min(100, (profile?.totalXp ?? 0) % 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#E2EBD3] dark:text-[#8E9F90]">
              <span className="flex items-center gap-1">
                <Flame size={12} className="text-[#FF8DA1]" />
                <span className="text-[#FFB6C4] font-semibold">
                  {profile?.currentStreak ?? 1} Hari Streak
                </span>
              </span>
              <Link
                href="/garden"
                className="font-bold text-white hover:underline"
                onClick={onClose}
              >
                Kebun →
              </Link>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onAddApplication();
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-[#233125] hover:bg-[#F2F5EB] dark:hover:bg-[#2A3B2D] text-[#63733E] dark:text-[#A8D063] shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            <span>Tambah Lamaran</span>
          </button>
        </div>
      </aside>
    </>
  );
}
