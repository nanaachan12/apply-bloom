"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  CalendarCheck,
  Flower2,
  Zap,
  Lock,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNavbar } from "@/components/layout/BottomNavbar";
import { WireframeSkeleton } from "@/components/ui/WireframeSkeleton";
import { ApplicationModal } from "@/components/applications/ApplicationModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { UserSession, GamificationProfileDto } from "@/types";
import { clearCache } from "@/lib/cache";
import { BloomieFloatingCompanion } from "@/components/mascot/BloomieFloatingCompanion";

export interface AppContextType {
  user: UserSession | null;
  profile: GamificationProfileDto | null;
  isLoadingAuth: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  showBloomie: boolean;
  setShowBloomie: (show: boolean) => void;
  toggleBloomie: () => void;
  refreshProfile: () => Promise<void>;
  openAddModal: () => void;
  triggerXpCelebration: (amount: number, reason?: string) => void;
  refreshTimestamp: number;
  triggerRefresh: () => void;
  handleLogout: () => Promise<void>;
  handleGuestLogin: () => Promise<boolean>;
  openAuthModal: () => void;
  isGuest: boolean;
  resetGuestSimulation: () => Promise<boolean>;
  isResettingSimulation: boolean;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  profile: null,
  isLoadingAuth: true,
  theme: "light",
  toggleTheme: () => {},
  showBloomie: true,
  setShowBloomie: () => {},
  toggleBloomie: () => {},
  refreshProfile: async () => {},
  openAddModal: () => {},
  triggerXpCelebration: () => {},
  refreshTimestamp: 0,
  triggerRefresh: () => {},
  handleLogout: async () => {},
  handleGuestLogin: async () => false,
  openAuthModal: () => {},
  isGuest: false,
  resetGuestSimulation: async () => false,
  isResettingSimulation: false,
});

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<GamificationProfileDto | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showBloomie, setShowBloomieState] = useState<boolean>(true);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());

  // Auth modal state for non-logged in visitors
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Floating XP toast
  const [xpToast, setXpToast] = useState<{ amount: number; message: string } | null>(
    null
  );

  const triggerRefresh = () => {
    clearCache();
    setRefreshTimestamp(Date.now());
  };

  useEffect(() => {
    // Check saved theme or system preference
    const saved = localStorage.getItem("applybloom_theme") as "light" | "dark" | null;
    const initialTheme = saved || "light";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check saved bloomie visibility preference
    try {
      const savedBloomie = localStorage.getItem("applybloom_hide_bloomie");
      if (savedBloomie === "true") {
        setShowBloomieState(false);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("applybloom_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setShowBloomie = (show: boolean) => {
    setShowBloomieState(show);
    try {
      localStorage.setItem("applybloom_hide_bloomie", String(!show));
    } catch {
      // LocalStorage fallback
    }
  };

  const toggleBloomie = () => {
    setShowBloomieState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("applybloom_hide_bloomie", String(!next));
      } catch {
        // LocalStorage fallback
      }
      return next;
    });
  };

  const fetchAuthUser = async () => {
    try {
      setIsLoadingAuth(true);
      const res = await apiFetch("/api/v1/auth/me");
      if (res.ok) {
        const json = await res.json();
        setUser({
          id: json.data.id,
          name: json.data.name,
          email: json.data.email,
          timezone: json.data.timezone,
        });
        setProfile(json.data.profile);
        setIsAuthModalOpen(false);
      } else {
        // Visitor is not logged in
        setUser(null);
        setProfile(null);
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      console.error("fetchAuthUser error:", err);
      setUser(null);
      setProfile(null);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await apiFetch("/api/v1/gamification/me");
      if (res.ok) {
        const json = await res.json();
        setProfile((prev) => (prev ? { ...prev, ...json.data } : json.data));
      }
    } catch {
      // ignore
    }
  };

  const triggerXpCelebration = (amount: number, reason?: string) => {
    setXpToast({
      amount,
      message: reason || `Selamat! Kamu mendapatkan +${amount} XP`,
    });
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#2D5A43", "#D95D70", "#EBF3ED", "#FAF7F2", "#B83E51"],
      });
    } catch {
      // safe fallback
    }
    setTimeout(() => {
      setXpToast(null);
    }, 3500);
    refreshProfile();
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("applybloom_token");
      localStorage.setItem("applybloom_logged_out", "true");
    }
    clearCache();
    setUser(null);
    setProfile(null);
    setIsAuthModalOpen(false);
    window.location.href = "/";
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError(null);

    try {
      const endpoint =
        authMode === "login" ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const payload =
        authMode === "login"
          ? { email: authEmail, password: authPassword }
          : { name: authName, email: authEmail, password: authPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        throw new Error(
          json?.error ||
            (res.status >= 500
              ? "Koneksi database terputus. Pastikan MySQL sudah menyala di Laragon/XAMPP."
              : "Gagal melakukan autentikasi")
        );
      }

      if (typeof window !== "undefined") {
        if (json.data?.token) {
          localStorage.setItem("applybloom_token", json.data.token);
        }
        localStorage.removeItem("applybloom_logged_out");
      }

      await fetchAuthUser();
      setIsAuthModalOpen(false);
      triggerXpCelebration(10, "Selamat datang di ApplyBloom!");
      triggerRefresh();
    } catch (err: any) {
      setAuthError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGuestLogin = async (): Promise<boolean> => {
    setIsSubmittingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/v1/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json?.error ||
            (res.status >= 500
              ? "Koneksi database terputus. Pastikan MySQL sudah menyala di Laragon/XAMPP."
              : "Gagal masuk sebagai Guest")
        );
      }

      if (typeof window !== "undefined") {
        if (json.data?.token) {
          localStorage.setItem("applybloom_token", json.data.token);
        }
        localStorage.removeItem("applybloom_logged_out");
      }

      setUser(json.data.user);
      setProfile(json.data.profile);
      setIsAuthModalOpen(false);
      triggerXpCelebration(15, "Masuk sebagai akun Guest");
      triggerRefresh();
      return true;
    } catch (err: any) {
      setAuthError(err.message || "Gagal login guest");
      return false;
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    await handleGuestLogin();
  };

  const isGuest = Boolean(user && user.email === "guest@applybloom.com");
  const [isResettingSimulation, setIsResettingSimulation] = useState(false);

  const resetGuestSimulation = async (): Promise<boolean> => {
    try {
      setIsResettingSimulation(true);
      await apiFetch("/api/v1/guest/reset", { method: "POST" });
      triggerRefresh();
      await refreshProfile();
      setXpToast({
        amount: 0,
        message: "Data simulasi tamu berhasil dikembalikan ke kondisi awal.",
      });
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    } finally {
      setIsResettingSimulation(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        isLoadingAuth,
        theme,
        toggleTheme,
        showBloomie,
        setShowBloomie,
        toggleBloomie,
        refreshProfile,
        openAddModal: () => setIsAddModalOpen(true),
        triggerXpCelebration,
        refreshTimestamp,
        triggerRefresh,
        handleLogout,
        handleGuestLogin,
        openAuthModal: () => setIsAuthModalOpen(true),
        isGuest,
        resetGuestSimulation,
        isResettingSimulation,
      }}
    >
      {children}

      {/* Floating XP Toast */}
      {xpToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-white dark:bg-[#1B231C] border border-[#DEE7D0] dark:border-[#2C3B2E] shadow-lg rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom duration-200 text-[#242D22] dark:text-[#F1F6F2]">
          <div className="w-9 h-9 rounded-xl bg-[#EEF3E2] dark:bg-[#233125] text-[#788B4E] dark:text-[#9BC358] flex items-center justify-center text-sm shadow-2xs">
            <Flower2 size={16} />
          </div>
          <div>
            <p className="font-bold text-xs text-[#2D5A43]">
              +{xpToast.amount} XP DIDAPATKAN
            </p>
            <p className="text-xs text-[#282D29] font-medium mt-0.5">
              {xpToast.message}
            </p>
          </div>
        </div>
      )}

      {/* Global Add Application Modal */}
      <ApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          if (isGuest) {
            triggerXpCelebration(
              10,
              "Simulasi: Lamaran berhasil diuji coba. Catatan: Data sementara ini tidak disimpan permanen."
            );
          } else {
            triggerXpCelebration(10, "Lamaran baru berhasil ditambahkan! +10 XP");
          }
          triggerRefresh();
          refreshProfile();
          router.refresh();
        }}
      />

      {/* Authentication Modal */}
      <Modal
        isOpen={isAuthModalOpen && !isLoadingAuth}
        onClose={() => {
          if (user) setIsAuthModalOpen(false);
        }}
        title={
          authMode === "login"
            ? "Masuk ke ApplyBloom"
            : "Daftar Akun Baru ApplyBloom"
        }
        subtitle="Kelola lamaran pekerjaan dan pantau progres karirmu"
        maxWidth="md"
      >
        <div className="space-y-4">
          {/* Quick Demo Access Button - Strawberry Creme Accent */}
          <div className="p-3.5 rounded-2xl bg-[#FDF2F4] border border-[#F6D2D8] text-center">
            <p className="text-xs text-[#B83E51] font-semibold mb-2">
              Ingin langsung mencoba tanpa registrasi?
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="w-full font-bold flex items-center justify-center gap-2"
              onClick={handleGuestLogin}
              isLoading={isSubmittingAuth}
            >
              <Zap size={14} />
              <span>Masuk sebagai Guest (1-Klik)</span>
            </Button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E8E1D5]"></div>
            <span className="shrink mx-3 text-[11px] text-[#8D9B91] uppercase font-semibold">
              atau gunakan akun sendiri
            </span>
            <div className="flex-grow border-t border-[#E8E1D5]"></div>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {authMode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-[#282D29] mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-sm text-[#282D29] focus:outline-hidden focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#282D29] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="kamu@email.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-sm text-[#282D29] focus:outline-hidden focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#282D29] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Kata sandi anda"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] bg-white text-sm text-[#282D29] focus:outline-hidden focus:ring-2 focus:ring-[#2D5A43]/20 focus:border-[#2D5A43]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmittingAuth}
            >
              {authMode === "login" ? "Masuk Sekarang" : "Daftar Akun"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthError(null);
              }}
              className="text-xs text-[#2D5A43] hover:underline font-semibold cursor-pointer"
            >
              {authMode === "login"
                ? "Belum punya akun? Daftar di sini"
                : "Sudah punya akun? Masuk di sini"}
            </button>
          </div>
        </div>
      </Modal>
    </AppContext.Provider>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const {
    user,
    profile,
    isLoadingAuth,
    openAddModal,
    handleLogout,
    showBloomie,
    handleGuestLogin,
    isGuest,
    resetGuestSimulation,
    isResettingSimulation,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isPublicPage =
    pathname === "/login" || pathname === "/register" || (!user && pathname === "/");

  // If public page (Landing, Login, Register), render cleanly without app shell
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] transition-colors duration-200">
        {children}
      </div>
    );
  }

  // If visitor attempts to access internal app pages without being logged in
  if (!user && !isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#263328] shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3E2] dark:bg-[#1E281F] text-[#788B4E] dark:text-[#9BC358] flex items-center justify-center mx-auto">
            <Lock size={22} />
          </div>
          <h2 className="text-lg font-bold font-heading text-[#242D22] dark:text-[#F1F6F2]">
            Akses Memerlukan Login
          </h2>
          <p className="text-xs text-[#616D64] dark:text-[#A0B2A3]">
            Silakan masuk terlebih dahulu untuk mengakses menu ini, atau gunakan Mode Guest
            untuk mencoba fitur secara instan.
          </p>
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={async () => {
                await handleGuestLogin();
              }}
            >
              <span>Masuk sebagai Guest (1-Klik)</span>
            </Button>
            <div className="flex items-center justify-center gap-3 pt-2 text-xs">
              <Link
                href="/login"
                className="font-semibold text-[#788B4E] dark:text-[#9BC358] hover:underline"
              >
                Halaman Login
              </Link>
              <span className="text-[#DEE7D0] dark:text-[#263328]">•</span>
              <Link href="/" className="text-[#616D64] dark:text-[#A0B2A3] hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSkeletonType = () => {
    if (pathname === "/") return "dashboard";
    if (pathname.startsWith("/pipeline")) return "pipeline";
    if (pathname.startsWith("/applications")) return "applications";
    if (pathname.startsWith("/garden")) return "garden";
    return "generic";
  };

  return (
    <div className="min-h-screen bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] flex flex-col transition-colors duration-200">
      {/* Sidebar (Desktop) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
        onAddApplication={openAddModal}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          profile={profile}
          onAddApplication={openAddModal}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {/* Guest Simulation Sticky Mode Top Banner */}
          {isGuest && !isLoadingAuth && (
            <div className="mb-5 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#EEF3E2] dark:bg-[#18231A] border border-[#BED0A4] dark:border-[#2C3E2E] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#556832] dark:bg-[#788B4E] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Flower2 size={16} />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#242D22] dark:text-[#F1F6F2]">
                      Mode Simulasi Tamu
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#556832]/15 dark:bg-[#9BC358]/20 text-[#556832] dark:text-[#9BC358]">
                      Hanya Simulasi
                    </span>
                  </div>
                  <p className="text-[#5C6B5E] dark:text-[#A0B2A3] leading-relaxed">
                    Kamu bebas mencoba input data lamaran untuk simulasi. Data ini bersifat sementara dan tidak disimpan secara permanen. Silakan daftar akun untuk menyimpan lamaranmu!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={resetGuestSimulation}
                  disabled={isResettingSimulation}
                  className="px-3.5 py-2 rounded-xl border border-[#BED0A4] dark:border-[#2C3E2E] bg-white dark:bg-[#141A15] text-[#242D22] dark:text-[#F1F6F2] hover:bg-[#F4F7EF] dark:hover:bg-[#1E281F] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                  title="Kembalikan data demo ke kondisi rapi awal"
                >
                  {isResettingSimulation ? "Mereset..." : "Reset Data Demo"}
                </button>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-[#556832] hover:bg-[#435327] dark:bg-[#788B4E] dark:hover:bg-[#687a41] text-white text-xs font-bold transition-all shadow-2xs"
                >
                  Daftar Akun Permanen
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] rounded-3xl sm:rounded-[2.2rem] shadow-xs p-4 sm:p-7 min-h-[calc(100vh-6.5rem)] transition-colors duration-200">
            {isLoadingAuth ? (
              <WireframeSkeleton type={getSkeletonType()} />
            ) : (
              <div key={pathname} className="animate-in fade-in duration-150">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Curved Bottom Navigation Bar with Scooped Floating Active Circle */}
      <BottomNavbar />

      {/* Interactive Bloomie Mascot Floating Companion */}
      {user && !isLoadingAuth && showBloomie && <BloomieFloatingCompanion />}
    </div>
  );
}
