import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "sage";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#788B4E] hover:bg-[#63733E] text-white shadow-2xs hover:shadow-sm dark:bg-[#9BC358] dark:hover:bg-[#85AB43] dark:text-[#111712] font-semibold",
    secondary:
      "bg-[#FFF0F3] hover:bg-[#FFE3E8] text-[#C2255C] border border-[#FDC4D0] dark:bg-[#2A141A] dark:hover:bg-[#381B23] dark:text-[#FA7194] dark:border-[#4D1D28]",
    sage:
      "bg-[#EEF3E2] hover:bg-[#E3ECCF] text-[#556832] border border-[#D5E0BF] dark:bg-[#1E281F] dark:hover:bg-[#28362A] dark:text-[#A8D063] dark:border-[#2C3B2E]",
    outline:
      "bg-white dark:bg-[#19211A] hover:bg-[#F2F5EB] dark:hover:bg-[#232E25] text-[#242D22] dark:text-[#F1F6F2] border border-[#DEE7D0] dark:border-[#2C3B2E] shadow-2xs",
    ghost:
      "bg-transparent hover:bg-[#EEF3E2] dark:hover:bg-[#1E281F] text-[#242D22] dark:text-[#F1F6F2]",
    danger:
      "bg-[#FFF0F3] hover:bg-[#FFE3E8] text-[#C2255C] border border-[#FDC4D0] dark:bg-[#2B151A] dark:hover:bg-[#3D1A22] dark:text-[#FF8DA1] dark:border-[#4A1E27]",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
