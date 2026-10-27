"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  CalendarCheck,
  Flower2,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function BottomNavbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Lamaran", href: "/applications", icon: Briefcase },
    { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
    { label: "Agenda", href: "/reminders", icon: CalendarCheck },
    { label: "Kebun", href: "/garden", icon: Flower2 },
  ];

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/dashboard" ? activeTab === "/dashboard" : activeTab.startsWith(item.href)
  );

  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const ActiveIcon = navItems[safeActiveIndex].icon;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-30 lg:hidden max-w-md mx-auto pointer-events-auto">
      {/* Main Floating Rounded Bar */}
      <div className="relative bg-white dark:bg-[#151C16] border border-[#DEE7D0] dark:border-[#263528] rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] pt-1 pb-2 px-1 transition-colors duration-200">
        {/* Animated Sliding Scoop + Elevated Circle Indicator */}
        <div
          aria-hidden="true"
          className={`absolute top-0 left-0 w-1/5 pointer-events-none z-20 ${
            isMounted
              ? "transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              : ""
          }`}
          style={{
            transform: `translateX(${safeActiveIndex * 100}%)`,
          }}
        >
          {/* Curved Scoop Mask (dips into navbar with page canvas color) */}
          <svg
            viewBox="0 0 72 26"
            className="w-[72px] h-[26px] absolute -top-[2px] left-1/2 -translate-x-1/2 pointer-events-none z-10"
          >
            {/* Fill canvas color over white navbar to create scoop */}
            <path
              d="M 0 0 C 16 0 18 26 36 26 C 54 26 56 0 72 0 L 72 -6 L 0 -6 Z"
              className="fill-[#F4F7EF] dark:fill-[#0C100D]"
            />
            {/* Scoop Border Line (continuous with navbar border) */}
            <path
              d="M 0 0 C 16 0 18 26 36 26 C 54 26 56 0 72 0"
              fill="none"
              strokeWidth="1.2"
              className="stroke-[#DEE7D0] dark:stroke-[#263528]"
            />
          </svg>

          {/* Elevated Floating Circular Badge with Active Icon */}
          <div className="w-[52px] h-[52px] rounded-full bg-white dark:bg-[#1A231B] border-4 border-[#F4F7EF] dark:border-[#0C100D] shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-center absolute -top-5 left-1/2 -translate-x-1/2 z-20 transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#EEF3E2] dark:bg-[#253326] flex items-center justify-center text-[#556832] dark:text-[#A8D063] shadow-2xs">
              <ActiveIcon size={20} className="shrink-0 animate-in zoom-in-75 duration-200" />
            </div>
          </div>
        </div>

        {/* Navigation Items Row */}
        <nav className="relative z-10 flex items-center justify-between">
          {navItems.map((item, index) => {
            const isActive = index === safeActiveIndex;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => setActiveTab(item.href)}
                className="w-1/5 flex flex-col items-center justify-center pt-2 pb-1 text-center cursor-pointer select-none group"
              >
                {/* Regular Icon (invisible when active because elevated circle covers it) */}
                <div
                  className={`h-5 flex items-center justify-center transition-all duration-200 ${
                    isActive ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  }`}
                >
                  <Icon
                    size={20}
                    className="text-[#647363] dark:text-[#8E9F90] group-hover:text-[#242D22] dark:group-hover:text-[#F1F6F2] transition-colors"
                  />
                </div>

                {/* Text Label */}
                <span
                  className={`mt-1.5 tracking-tight transition-all duration-200 truncate max-w-full px-1 ${
                    isActive
                      ? "text-[11px] font-bold text-[#242D22] dark:text-[#F1F6F2]"
                      : "text-[10px] font-medium text-[#647363] dark:text-[#8E9F90] group-hover:text-[#242D22] dark:group-hover:text-[#F1F6F2]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* iOS-Style Home Indicator Bar */}
        <div className="w-24 h-1 bg-[#242D22]/15 dark:bg-white/20 rounded-full mx-auto mt-1 mb-0.5" />
      </div>
    </div>
  );
}
