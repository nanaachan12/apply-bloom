import { prisma } from "@/lib/prisma";
import { ApplicationStatus, EmploymentType, ReminderType } from "@prisma/client";

interface DemoAppType {
  company: string;
  position: string;
  employmentType: EmploymentType;
  location: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  source: string;
  jobUrl: string;
  status: ApplicationStatus;
  appliedAt: Date | null;
  notes: string;
  events?: {
    fromStatus: ApplicationStatus | null;
    toStatus: ApplicationStatus;
    description: string;
    occurredAt: Date;
  }[];
  reminders?: {
    title: string;
    type: ReminderType;
    dueAt: Date;
  }[];
}

export async function resetGuestData(userId: string) {
  // 1. Delete existing applications and related items for this guest
  await prisma.application.deleteMany({
    where: { userId },
  });

  // 2. Reset gamification profile
  await prisma.gamificationProfile.upsert({
    where: { userId },
    update: {
      totalXp: 185,
      level: 2,
      currentStreak: 4,
      longestStreak: 5,
      plantStage: 1,
      lastActiveDate: new Date(),
    },
    create: {
      userId,
      totalXp: 185,
      level: 2,
      currentStreak: 4,
      longestStreak: 5,
      plantStage: 1,
      lastActiveDate: new Date(),
    },
  });

  // 3. Insert clean, realistic demo applications for simulation
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const demoApplications: DemoAppType[] = [
    {
      company: "Traveloka",
      position: "Senior Frontend Engineer",
      employmentType: "FULL_TIME",
      location: "Jakarta (Hybrid)",
      salaryMin: 22000000,
      salaryMax: 30000000,
      currency: "IDR",
      source: "LinkedIn",
      jobUrl: "https://traveloka.com/careers/senior-frontend",
      status: "INTERVIEW",
      appliedAt: new Date(now - 10 * dayMs),
      notes: "Lolos screening & live coding test. Tahap selanjutnya: System design interview dengan VP of Engineering.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Lamaran dikirimkan melalui LinkedIn Easy Apply",
          occurredAt: new Date(now - 10 * dayMs),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "ASSESSMENT",
          description: "Menerima undangan HackerRank online assessment 90 menit",
          occurredAt: new Date(now - 6 * dayMs),
        },
        {
          fromStatus: "ASSESSMENT",
          toStatus: "INTERVIEW",
          description: "Lolos assessment dengan skor 100%. Dijadwalkan interview teknis.",
          occurredAt: new Date(now - 2 * dayMs),
        },
      ],
      reminders: [
        {
          title: "Technical Interview with VP Engineering",
          type: "INTERVIEW",
          dueAt: new Date(now + 2 * dayMs + 4 * 60 * 60 * 1000),
        },
      ],
    },
    {
      company: "Midtrans (GoTo Financial)",
      position: "Full-Stack Software Engineer",
      employmentType: "FULL_TIME",
      location: "Jakarta (Remote-friendly)",
      salaryMin: 18000000,
      salaryMax: 26000000,
      currency: "IDR",
      source: "Tech in Asia",
      jobUrl: "https://midtrans.com/jobs/fullstack",
      status: "ASSESSMENT",
      appliedAt: new Date(now - 7 * dayMs),
      notes: "Take-home test membuat microservice payment gateway simulation.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim CV dan portofolio GitHub",
          occurredAt: new Date(now - 7 * dayMs),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "ASSESSMENT",
          description: "Mendapat repo take-home assignment, deadline hari Jumat",
          occurredAt: new Date(now - 3 * dayMs),
        },
      ],
      reminders: [
        {
          title: "Submit Take-home assignment ke GitHub repo",
          type: "ASSESSMENT",
          dueAt: new Date(now + 1 * dayMs + 7 * 60 * 60 * 1000),
        },
      ],
    },
    {
      company: "Akseleran",
      position: "React Developer",
      employmentType: "FULL_TIME",
      location: "Jakarta Selatan",
      salaryMin: 16000000,
      salaryMax: 20000000,
      currency: "IDR",
      source: "Jobstreet",
      jobUrl: "https://jobstreet.co.id/akseleran-react",
      status: "OFFER",
      appliedAt: new Date(now - 21 * dayMs),
      notes: "Offering letter resmi sudah diterima. Benefit: asuransi swasta keluarga, flexi-work, bonus performa tahunan.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim lamaran via Jobstreet",
          occurredAt: new Date(now - 21 * dayMs),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "INTERVIEW",
          description: "Interview HR dan User Technical Lead",
          occurredAt: new Date(now - 14 * dayMs),
        },
        {
          fromStatus: "INTERVIEW",
          toStatus: "OFFER",
          description: "Penawaran kerja resmi diterbitkan HRD Akseleran",
          occurredAt: new Date(now - 1 * dayMs),
        },
      ],
      reminders: [
        {
          title: "Konfirmasi & Tanda Tangan Offering Letter",
          type: "DEADLINE",
          dueAt: new Date(now + 3 * dayMs),
        },
      ],
    },
    {
      company: "Bukalapak",
      position: "Web Platform Engineer",
      employmentType: "CONTRACT",
      location: "Remote",
      salaryMin: 17000000,
      salaryMax: 23000000,
      currency: "IDR",
      source: "Company Website",
      jobUrl: "https://careers.bukalapak.com/web-engineer",
      status: "SCREENING",
      appliedAt: new Date(now - 4 * dayMs),
      notes: "Resume viewed by recruiter. Menunggu kabar tahap interview lanjutan.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Melamar via portal karir Bukalapak",
          occurredAt: new Date(now - 4 * dayMs),
        },
      ],
      reminders: [
        {
          title: "Follow-up email ke recruiter jika belum ada kabar",
          type: "FOLLOW_UP",
          dueAt: new Date(now + 4 * dayMs),
        },
      ],
    },
    {
      company: "Supabase Partner Agency",
      position: "Frontend UI/UX Specialist",
      employmentType: "CONTRACT",
      location: "Singapore (Remote)",
      salaryMin: 30000000,
      salaryMax: 45000000,
      currency: "IDR",
      source: "Twitter / X",
      jobUrl: "https://remoteok.com/j/123",
      status: "WISHLIST",
      appliedAt: null,
      notes: "Perlu menyesuaikan CV berbahasa Inggris dengan highlight Next.js & Tailwind.",
      events: [],
      reminders: [],
    },
    {
      company: "Fintech Nusantara",
      position: "Junior Frontend Engineer",
      employmentType: "FULL_TIME",
      location: "Bandung",
      salaryMin: 12000000,
      salaryMax: 15000000,
      currency: "IDR",
      source: "Glints",
      jobUrl: "https://glints.com/fintech-junior",
      status: "REJECTED",
      appliedAt: new Date(now - 18 * dayMs),
      notes: "Membutuhkan pengalaman framework yang lebih mendalam. Feedback positif mengenai culture fit.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim lamaran via Glints",
          occurredAt: new Date(now - 18 * dayMs),
        },
      ],
      reminders: [],
    },
  ];

  for (const app of demoApplications) {
    const { events, reminders, ...appData } = app;
    const createdApp = await prisma.application.create({
      data: {
        ...appData,
        userId,
      },
    });

    if (events && events.length > 0) {
      await prisma.applicationEvent.createMany({
        data: events.map((ev) => ({
          ...ev,
          applicationId: createdApp.id,
        })),
      });
    }

    if (reminders && reminders.length > 0) {
      await prisma.reminder.createMany({
        data: reminders.map((r) => ({
          ...r,
          applicationId: createdApp.id,
        })),
      });
    }
  }
}
