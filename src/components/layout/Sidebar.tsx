"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Flame,
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

  // Active path state for immediate optimistic transition
  const [activePath, setActivePath] = useState(pathname);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? activePath === "/" : activePath.startsWith(item.href)
  );

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    top: 0,
    height: 48,
    opacity: 0,
  });

  const updateIndicator = () => {
    if (activeIndex >= 0) {
      const el = itemRefs.current[activeIndex];
      if (el && el.offsetHeight > 0) {
        setIndicatorStyle({
          top: el.offsetTop,
          height: el.offsetHeight,
          opacity: 1,
        });
        return;
      }
      // Reliable fallback if DOM ref not yet measured
      setIndicatorStyle({
        top: activeIndex * 54,
        height: 48,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    updateIndicator();
    const timer = setTimeout(() => setIsMounted(true), 30);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activePath, activeIndex]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container - No vertical border line for seamless merge */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#7B8E50] dark:bg-[#131A14] text-white flex flex-col justify-between pt-5 pb-5 pl-5 pr-0 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header Profile Card */}
          <div className="flex items-center justify-between pb-5 mb-3 pr-5 border-b border-white/20 dark:border-[#232E25]">
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 dark:bg-[#233125] text-white dark:text-[#A8D063]">
                    Level {profile?.level ?? 1}
                  </span>
                  <span className="text-[11px] text-[#E2EBD3] dark:text-[#8E9F90] font-medium">
                    {profile?.totalXp ?? 0} XP
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 lg:hidden cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Section Menu Label */}
          <p className="text-[11px] font-bold text-white/70 dark:text-[#8E9F90] uppercase tracking-wider px-3 my-2 pr-5">
            Menu
          </p>

          {/* Nav Items Container with Smooth Animated Merged Tab Indicator */}
          <nav className="relative flex flex-col gap-1.5">
            {/* Smooth Sliding Merged Tab Background Indicator */}
            <div
              aria-hidden="true"
              className={`absolute top-0 left-0 -right-[2px] pointer-events-none z-0 ${
                isMounted
                  ? "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-100"
                  : "opacity-0"
              }`}
              style={{
                transform: `translateY(${indicatorStyle.top}px)`,
                height: `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
              }}
            >
              {/* Top Concave Curve (Smoothly merges into right canvas) */}
              <svg
                aria-hidden="true"
                className="absolute -top-4 right-0 w-4 h-4 text-[#F4F7EF] dark:text-[#0C100D] fill-current pointer-events-none z-20"
                viewBox="0 0 16 16"
              >
                <path d="M 16 0 C 16 8.837 8.837 16 0 16 L 16 16 Z" />
              </svg>

              {/* Active Tab Merged Body - seamless with canvas */}
              <div className="w-full h-full rounded-l-3xl bg-[#F4F7EF] dark:bg-[#0C100D] shadow-[-4px_0_12px_rgba(0,0,0,0.03)]" />

              {/* Bottom Concave Curve (Smoothly merges into right canvas) */}
              <svg
                aria-hidden="true"
                className="absolute -bottom-4 right-0 w-4 h-4 text-[#F4F7EF] dark:text-[#0C100D] fill-current pointer-events-none z-20"
                viewBox="0 0 16 16"
              >
                <path d="M 0 0 C 8.837 0 16 7.163 16 16 L 16 0 Z" />
              </svg>
            </div>

            {/* Nav Items Link List - Direct children of nav so offsetTop is accurate */}
            {navItems.map((item, index) => {
              const isActive = index === activeIndex;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  href={item.href}
                  prefetch={true}
                  onClick={() => {
                    setActivePath(item.href);
                    onClose();
                  }}
                  className={`group flex items-center gap-3 pl-4 h-12 text-sm font-semibold transition-colors duration-200 cursor-pointer relative z-10 ${
                    isActive
                      ? "text-[#4E612B] dark:text-[#9BC358] font-bold rounded-l-3xl pr-5"
                      : "text-white/85 dark:text-[#8E9F90] hover:text-white dark:hover:text-[#F1F6F2] hover:bg-white/10 dark:hover:bg-[#1E281F]/60 mr-4 rounded-2xl pr-4"
                  }`}
                >
                  <Icon
                    size={19}
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "text-[#4E612B] dark:text-[#9BC358] scale-105"
                        : "text-white/80 dark:text-[#8E9F90] group-hover:text-white group-hover:scale-105"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Garden Plant Status Card */}
        <div className="pr-5 pt-3">
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
        </div>
      </aside>
    </>
  );
}
