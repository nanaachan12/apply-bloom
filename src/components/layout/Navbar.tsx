"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Flame,
  LogOut,
  User as UserIcon,
  Plus,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserSession, GamificationProfileDto } from "@/types";
import { useApp } from "@/components/layout/AppLayout";

interface NavbarProps {
  onToggleSidebar: () => void;
  user: UserSession | null;
  profile: GamificationProfileDto | null;
  onAddApplication: () => void;
  onLogout: () => void;
}

export function Navbar({
  onToggleSidebar,
  user,
  profile,
  onAddApplication,
  onLogout,
}: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#EDF2E4]/80 dark:bg-[#0C100D]/80 backdrop-blur-md border-b border-[#DEE7D0]/60 dark:border-[#232E25] px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#647363] dark:text-[#8E9F90] hover:bg-white/60 dark:hover:bg-[#1A221C] lg:hidden transition-colors"
          aria-label="Buka Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-[#242D22] dark:text-[#F1F6F2]">
            Halo, {user ? user.name.split(" ")[0] : "Kandidat"}
          </h1>
          <p className="hidden sm:block text-[11px] text-[#647363] dark:text-[#8E9F90]">
            Pantau status lamaran dan progres karirmu secara terstruktur
          </p>
        </div>
      </div>

      {/* Right: Gamification Badges, Dark Theme Toggle & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Theme Toggle ("Tema Cowo") */}
        <button
          id="theme-toggle-btn"
          aria-label="Toggle Theme"
          onClick={toggleTheme}
          title={theme === "dark" ? "Ganti ke Light Mode" : "Aktifkan Dark Mode (Tema Cowo)"}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#19211A] text-[#647363] dark:text-[#9BC358] border border-[#DEE7D0] dark:border-[#2C3B2E] shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Sun size={14} className="text-amber-400" />
              <span className="hidden md:inline text-[11px]">Light</span>
            </>
          ) : (
            <>
              <Moon size={14} className="text-[#63733E]" />
              <span className="hidden md:inline text-[11px]">Dark Mode</span>
            </>
          )}
        </button>

        {/* Streak Pill - Fresh Strawberry Pink (Hidden on small mobile for clean header) */}
        <div
          title={`${profile?.currentStreak ?? 1} hari aktif berturut-turut`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0F3] dark:bg-[#2A141A] text-[#C2255C] dark:text-[#FA7194] border border-[#FDC4D0] dark:border-[#4D1D28] shadow-2xs cursor-default transition-colors"
        >
          <Flame size={13} className="text-[#F45B88]" />
          <span>{profile?.currentStreak ?? 1} Hari</span>
        </div>

        {/* XP Pill - Olive Sage */}
        <Link
          href="/garden"
          title="Buka ringkasan Bloom Garden"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF3E2] dark:bg-[#1E281F] text-[#556832] dark:text-[#9BC358] border border-[#D5E0BF] dark:border-[#2C3B2E] shadow-2xs hover:bg-[#E3ECCF] dark:hover:bg-[#263528] transition-colors"
        >
          <span>{profile?.totalXp ?? 0} XP</span>
        </Link>

        {/* Add Application Button (Desktop only) */}
        <div className="hidden sm:block">
          <Button
            size="sm"
            variant="primary"
            onClick={onAddApplication}
          >
            <Plus size={14} className="shrink-0" />
            <span>Tambah Lamaran</span>
          </Button>
        </div>

        {/* User Avatar & Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full bg-[#EEF3E2] dark:bg-[#233125] border border-[#D5E0BF] dark:border-[#2C3B2E] flex items-center justify-center font-bold text-xs text-[#556832] dark:text-[#9BC358] shadow-2xs hover:opacity-90 transition-opacity"
          >
            {user ? user.name.charAt(0).toUpperCase() : "U"}
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#161C17] rounded-2xl shadow-lg border border-[#DEE7D0] dark:border-[#28352A] p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#F0F5E8] dark:border-[#242E25]">
                  <p className="text-xs font-bold text-[#242D22] dark:text-[#F1F6F2] truncate">
                    {user?.name || "Tamu"}
                  </p>
                  <p className="text-[11px] text-[#647363] dark:text-[#8E9F90] truncate">
                    {user?.email || "demo@applybloom.com"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[#242D22] dark:text-[#F1F6F2] hover:bg-[#EEF3E2] dark:hover:bg-[#202921] rounded-xl transition-colors"
                  >
                    <Settings size={14} className="text-[#647363] dark:text-[#8E9F90]" />
                    <span>Pengaturan Akun</span>
                  </Link>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#C2255C] dark:text-[#FA7194] hover:bg-[#FFF0F3] dark:hover:bg-[#2A141A] rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
