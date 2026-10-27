import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyBloom - Career Tracker & Growth",
  description:
    "Aplikasi pelacak lamaran kerja modern dengan sistem gamifikasi bertema kebun karir.",
  keywords: [
    "job tracker",
    "lamaran kerja",
    "applybloom",
    "career",
    "interview tracker",
  ],
  authors: [{ name: "ApplyBloom Team" }],
};

import { AppProvider, AppLayout } from "@/components/layout/AppLayout";
import { TopProgressBar } from "@/components/layout/TopProgressBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={quicksand.variable}>
      <body className="min-h-screen font-sans bg-[#F4F7EF] dark:bg-[#0C100D] text-[#242D22] dark:text-[#F1F6F2] antialiased selection:bg-[#D5E6D8] selection:text-[#204231]">
        <AppProvider>
          <TopProgressBar />
          <AppLayout>
            {children}
          </AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
