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
  Sparkles,
  Zap,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ApplicationModal } from "@/components/applications/ApplicationModal";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { UserSession, GamificationProfileDto } from "@/types";

interface AppContextType {
  user: UserSession | null;
  profile: GamificationProfileDto | null;
  isLoadingAuth: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  refreshProfile: () => Promise<void>;
  openAddModal: () => void;
  triggerXpCelebration: (amount: number, reason?: string) => void;
}

export const AppContext = createContext<AppContextType>({
  user: null,
  profile: null,
  isLoadingAuth: true,
  theme: "light",
  toggleTheme: () => {},
  refreshProfile: async () => {},
  openAddModal: () => {},
  triggerXpCelebration: () => {},
});

export const useApp = () => useContext(AppContext);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<GamificationProfileDto | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

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
        // If not logged in and user hasn't explicitly logged out, auto-login with Demo account
        const wasExplicitlyLoggedOut =
          typeof window !== "undefined" &&
          localStorage.getItem("applybloom_logged_out") === "true";

        if (!wasExplicitlyLoggedOut) {
          const demoRes = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "bloom@applybloom.com",
              password: "Password123!",
            }),
          });
          if (demoRes.ok) {
            const demoJson = await demoRes.json();
            if (typeof window !== "undefined" && demoJson.data?.token) {
              localStorage.setItem("applybloom_token", demoJson.data.token);
            }
            setUser(demoJson.data.user);
            setProfile(demoJson.data.profile);
            setIsAuthModalOpen(false);
            return;
          }
        }

        setUser(null);
        setProfile(null);
        setIsAuthModalOpen(true);
      }
    } catch (err) {
      console.error("fetchAuthUser error:", err);
      setUser(null);
      setProfile(null);
      setIsAuthModalOpen(true);
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

  const pathname = usePathname();

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
    setUser(null);
    setProfile(null);
    setIsAuthModalOpen(true);
    router.push("/");
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
    } catch (err: any) {
      setAuthError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsSubmittingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "bloom@applybloom.com",
          password: "Password123!",
        }),
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
              : "Gagal masuk dengan akun demo")
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
      triggerXpCelebration(15, "Masuk sebagai akun Demo Rania Bloom");
    } catch (err: any) {
      setAuthError(err.message || "Gagal login demo");
    } finally {
      setIsSubmittingAuth(false);
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
        refreshProfile,
        openAddModal: () => setIsAddModalOpen(true),
        triggerXpCelebration,
      }}
    >
      <div className="min-h-screen bg-[#EDF2E4] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] flex flex-col transition-colors duration-200">
        {/* Sidebar (Desktop) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
          onAddApplication={() => setIsAddModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            user={user}
            profile={profile}
            onAddApplication={() => setIsAddModalOpen(true)}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
            <div className="bg-white dark:bg-[#141A15] border border-[#DEE7D0] dark:border-[#232E25] rounded-3xl sm:rounded-[2.2rem] shadow-xs p-4 sm:p-7 min-h-[calc(100vh-6.5rem)] transition-colors duration-200">
              {isLoadingAuth ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF3E2] dark:bg-[#1E281F] border border-[#D5E0BF] dark:border-[#2C3B2E] flex items-center justify-center text-[#788B4E] dark:text-[#9BC358] shadow-2xs">
                    <Flower2 size={24} className="animate-spin text-[#788B4E] dark:text-[#9BC358]" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#647363] dark:text-[#8E9F90]">
                    Memuat data ApplyBloom...
                  </p>
                </div>
              ) : (
                children
              )}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#EEF3E2]/95 dark:bg-[#131A14]/95 backdrop-blur-md border-t border-[#DEE7D0] dark:border-[#232E25] px-2 py-1.5 flex items-center justify-around shadow-sm transition-colors duration-200">
          {[
            { label: "Dashboard", href: "/", icon: LayoutDashboard },
            { label: "Lamaran", href: "/applications", icon: Briefcase },
            { label: "Pipeline", href: "/pipeline", icon: KanbanSquare },
            { label: "Agenda", href: "/reminders", icon: CalendarCheck },
            { label: "Kebun", href: "/garden", icon: Flower2 },
          ].map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] transition-all ${
                  isActive
                    ? "text-[#63733E] dark:text-[#9BC358] font-bold"
                    : "text-[#647363] dark:text-[#8E9F90] hover:text-[#242D22] dark:hover:text-[#F1F6F2]"
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-colors ${
                    isActive ? "bg-white dark:bg-[#233125] shadow-xs" : ""
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#63733E] dark:text-[#9BC358]" : "text-[#8E9F90]"}
                  />
                </div>
                <span className="mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Floating XP Toast */}
        {xpToast && (
          <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-white dark:bg-[#1B231C] border border-[#DEE7D0] dark:border-[#2C3B2E] shadow-lg rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom duration-200 text-[#242D22] dark:text-[#F1F6F2]">
            <div className="w-9 h-9 rounded-xl bg-[#EEF3E2] dark:bg-[#233125] text-[#788B4E] dark:text-[#9BC358] flex items-center justify-center text-sm shadow-2xs">
              <Sparkles size={16} />
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
            triggerXpCelebration(10, "Lamaran baru berhasil ditambahkan! +10 XP");
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
                onClick={handleQuickDemoLogin}
                isLoading={isSubmittingAuth}
              >
                <Zap size={14} className="text-amber-300" />
                <span>Masuk Instan sebagai Demo User</span>
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
                  placeholder="••••••••"
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
      </div>
    </AppContext.Provider>
  );
}
