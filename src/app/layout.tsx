import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ApplyBloom — Career Tracker & Growth",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen font-sans bg-[#FAF7F2] text-[#282D29] antialiased selection:bg-[#D5E6D8] selection:text-[#204231]">
        {children}
      </body>
    </html>
  );
}
