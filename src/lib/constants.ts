export const APPLICATION_STATUS = {
  WISHLIST: "WISHLIST",
  APPLIED: "APPLIED",
  SCREENING: "SCREENING",
  ASSESSMENT: "ASSESSMENT",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type ApplicationStatusType = keyof typeof APPLICATION_STATUS;

export const EMPLOYMENT_TYPE = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  CONTRACT: "CONTRACT",
  INTERNSHIP: "INTERNSHIP",
  FREELANCE: "FREELANCE",
} as const;

export type EmploymentTypeType = keyof typeof EMPLOYMENT_TYPE;

export const REMINDER_TYPE = {
  INTERVIEW: "INTERVIEW",
  ASSESSMENT: "ASSESSMENT",
  FOLLOW_UP: "FOLLOW_UP",
  DEADLINE: "DEADLINE",
  OTHER: "OTHER",
} as const;

export type ReminderTypeType = keyof typeof REMINDER_TYPE;

export const STATUS_META: Record<
  ApplicationStatusType,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dotBg: string;
    description: string;
  }
> = {
  WISHLIST: {
    label: "Wishlist",
    bg: "bg-[#F5EFE6] dark:bg-[#1C201C]",
    text: "text-[#615444] dark:text-[#B5B0A6]",
    border: "border-[#E8DEC9] dark:border-[#2E332E]",
    dotBg: "bg-[#998263]",
    description: "Lowongan yang disimpan",
  },
  APPLIED: {
    label: "Applied",
    bg: "bg-[#EEF3E2] dark:bg-[#1B271C]",
    text: "text-[#556832] dark:text-[#A8D063]",
    border: "border-[#D5E0BF] dark:border-[#2C3E2E]",
    dotBg: "bg-[#788B4E] dark:bg-[#9BC358]",
    description: "Lamaran sudah terkirim",
  },
  SCREENING: {
    label: "Screening",
    bg: "bg-[#FEF9EE] dark:bg-[#282215]",
    text: "text-[#94621A] dark:text-[#E3B35B]",
    border: "border-[#FBEAC6] dark:border-[#3E321C]",
    dotBg: "bg-[#D4973B]",
    description: "Dalam review berkas",
  },
  ASSESSMENT: {
    label: "Assessment",
    bg: "bg-[#FFF0F3] dark:bg-[#2B151D]",
    text: "text-[#C2255C] dark:text-[#FA7194]",
    border: "border-[#FDC4D0] dark:border-[#4B1E2B]",
    dotBg: "bg-[#F45B88]",
    description: "Tes teknis atau kuis",
  },
  INTERVIEW: {
    label: "Interview",
    bg: "bg-[#E5EFE7] dark:bg-[#16271C]",
    text: "text-[#1E5236] dark:text-[#78C296]",
    border: "border-[#C6DEC9] dark:border-[#233F2C]",
    dotBg: "bg-[#2E7A50]",
    description: "Tahap wawancara",
  },
  OFFER: {
    label: "Offer",
    bg: "bg-[#FFF0F3] dark:bg-[#331420]",
    text: "text-[#C2255C] dark:text-[#FF8DA1]",
    border: "border-[#FDC4D0] dark:border-[#531E2F]",
    dotBg: "bg-[#F45B88]",
    description: "Tawaran kerja resmi",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-[#F8F3F1] dark:bg-[#261B1B]",
    text: "text-[#7A5555] dark:text-[#A37B7B]",
    border: "border-[#EADEDC] dark:border-[#382626]",
    dotBg: "bg-[#8C6464]",
    description: "Belum berjodoh",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    bg: "bg-[#F4F1EC] dark:bg-[#1D1E1D]",
    text: "text-[#5C5750] dark:text-[#8E8F8E]",
    border: "border-[#E5E0D8] dark:border-[#2E2F2E]",
    dotBg: "bg-[#8C8479]",
    description: "Lamaran ditarik",
  },
};

export const REMINDER_TYPE_META: Record<
  ReminderTypeType,
  { label: string; icon: string; color: string }
> = {
  INTERVIEW: { label: "Interview", icon: "Users", color: "text-purple-600 bg-purple-50" },
  ASSESSMENT: { label: "Assessment", icon: "Code2", color: "text-pink-600 bg-pink-50" },
  FOLLOW_UP: { label: "Follow-up", icon: "Mail", color: "text-blue-600 bg-blue-50" },
  DEADLINE: { label: "Deadline", icon: "Clock", color: "text-amber-600 bg-amber-50" },
  OTHER: { label: "Lainnya", icon: "CheckSquare", color: "text-emerald-600 bg-emerald-50" },
};

export const XP_RULES = {
  APPLICATION_CREATED: 10,
  INTERVIEW_RECORDED: 15,
  REMINDER_COMPLETED: 5,
  NOTES_UPDATED: 5,
  WATER_PLANT: 5,
  WEEKLY_GOAL: 25,
} as const;

export const PLANT_STAGES = [
  {
    stage: 0,
    name: "Benih Harapan (Seed)",
    title: "Seed",
    description: "Langkah awal perjalanan karirmu. Sirami dengan melamar lowongan impian!",
    minXp: 0,
    maxXp: 99,
    minLevel: 1,
  },
  {
    stage: 1,
    name: "Tunas Semangat (Sprout)",
    title: "Sprout",
    description: "Tunas kecil mulai bersemi! Usahamu mulai menampakkan hasil.",
    minXp: 100,
    maxXp: 299,
    minLevel: 2,
  },
  {
    stage: 2,
    name: "Tanaman Muda (Young Plant)",
    title: "Young Plant",
    description: "Batang kokoh dan daun rindang. Semangat interview semakin kuat!",
    minXp: 300,
    maxXp: 599,
    minLevel: 4,
  },
  {
    stage: 3,
    name: "Mekar Berbunga (Blooming Plant)",
    title: "Blooming Plant",
    description: "Kuncup bunga pastel mekar sempurna! Peluang tawaran kerja semakin dekat.",
    minXp: 600,
    maxXp: 999,
    minLevel: 7,
  },
  {
    stage: 4,
    name: "Pohon Impian Keemasan (Golden Bloom)",
    title: "Golden Bloom",
    description: "Kebun karirmu telah mencapai puncak keemasan. Tetap konsisten dan bersinar!",
    minXp: 1000,
    maxXp: 99999,
    minLevel: 10,
  },
] as const;

export const BADGE_DEFINITIONS = [
  {
    code: "first-step",
    name: "First Step",
    description: "Mencatat lamaran kerja pertama kamu.",
    icon: "Sprout",
    threshold: 1,
  },
  {
    code: "getting-started",
    name: "Getting Started",
    description: "Mencatat 5 lamaran kerja aktif.",
    icon: "TreePine",
    threshold: 5,
  },
  {
    code: "interview-ready",
    name: "Interview Ready",
    description: "Mencatat tahapan interview pertama kamu.",
    icon: "CalendarCheck2",
    threshold: 1,
  },
  {
    code: "consistent-grower",
    name: "Consistent Grower",
    description: "Menjaga streak aktivitas selama minimal 7 hari.",
    icon: "Flame",
    threshold: 7,
  },
  {
    code: "offer-bloom",
    name: "Offer Bloom",
    description: "Mendapatkan penawaran kerja (Offer) pertama.",
    icon: "Flower2",
    threshold: 1,
  },
] as const;
