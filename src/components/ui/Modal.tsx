"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C100D]/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#182019] rounded-3xl shadow-2xl border border-[#DEE7D0] dark:border-[#263328] p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-150 my-8 transition-colors`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#DEE7D0]/60 dark:border-[#263328] mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#242D22] dark:text-[#F1F6F2] font-heading">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#616D64] dark:text-[#A0B2A3] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7A8E80] hover:text-[#242D22] dark:hover:text-[#F1F6F2] hover:bg-[#EDF2E4] dark:hover:bg-[#232E25] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
