import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ApplyBloom database...");

  // 1. Seed Badges
  const badgesData = [
    {
      code: "first-step",
      name: "First Step",
      description: "Mencatat lamaran pertama kamu di ApplyBloom.",
      icon: "Sprout",
      threshold: 1,
    },
    {
      code: "getting-started",
      name: "Getting Started",
      description: "Mencatat 5 lamaran aktif untuk memulai perjalanan karir.",
      icon: "TreePine",
      threshold: 5,
    },
    {
      code: "interview-ready",
      name: "Interview Ready",
      description: "Mencatat tahapan interview atau assessment pertama.",
      icon: "CalendarCheck2",
      threshold: 1,
    },
    {
      code: "consistent-grower",
      name: "Consistent Grower",
      description: "Aktif menjaga streak aktivitas selama 7 hari berturut-turut.",
      icon: "Flame",
      threshold: 7,
    },
    {
      code: "offer-bloom",
      name: "Offer Bloom",
      description: "Meraih surat penawaran kerja (Job Offer)! Selamat atas perjuanganmu!",
      icon: "Flower2",
      threshold: 1,
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
  }
  console.log("Badges seeded successfully");

  // 2. Seed Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Password123!", salt);

  const demoUser = await prisma.user.upsert({
    where: { email: "guest@applybloom.com" },
    update: {
      name: "Guest",
      passwordHash,
      timezone: "Asia/Jakarta",
    },
    create: {
      email: "guest@applybloom.com",
      name: "Guest",
      passwordHash,
      timezone: "Asia/Jakarta",
    },
  });

  // 3. Seed Gamification Profile for Demo User
  await prisma.gamificationProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      totalXp: 185,
      level: 2,
      currentStreak: 4,
      longestStreak: 5,
      plantStage: 1, // Sprout
      lastActiveDate: new Date(),
    },
    create: {
      userId: demoUser.id,
      totalXp: 185,
      level: 2,
      currentStreak: 4,
      longestStreak: 5,
      plantStage: 1,
      lastActiveDate: new Date(),
    },
  });

  // Clean old sample applications for demo user if any
  await prisma.application.deleteMany({
    where: { userId: demoUser.id },
  });

  // 4. Seed Applications
  const apps = [
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
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      notes: "Sudah lolos screening & live coding test. Next: System design interview dengan VP of Engineering.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Lamaran dikirimkan melalui LinkedIn Easy Apply",
          occurredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "ASSESSMENT",
          description: "Menerima undangan HackerRank online assessment 90 menit",
          occurredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "ASSESSMENT",
          toStatus: "INTERVIEW",
          description: "Lolos assessment dengan skor 100%. Dijadwalkan interview teknis.",
          occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
      reminders: [
        {
          title: "Technical Interview with VP Engineering",
          type: "INTERVIEW",
          dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
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
      appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      notes: "Take-home test membuat microservice payment gateway simulation.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim CV dan portofolio GitHub",
          occurredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "ASSESSMENT",
          description: "Mendapat repo take-home assignment, deadline hari Jumat",
          occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
      reminders: [
        {
          title: "Submit Take-home assignment ke GitHub repo",
          type: "ASSESSMENT",
          dueAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
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
      appliedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      notes: "Offering letter resmi sudah diterima! Benefit: asuransi swasta keluarga, flexi-work, bonus performa tahunan.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim lamaran",
          occurredAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "INTERVIEW",
          description: "Interview HR dan User",
          occurredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "INTERVIEW",
          toStatus: "OFFER",
          description: "Penawaran kerja resmi diterbitkan HRD Akseleran",
          occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
      reminders: [],
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
      appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      notes: "Resume viewed by recruiter. Menunggu kabar tahap interview.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Melamar via portal Bukalapak",
          occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
      ],
      reminders: [
        {
          title: "Follow-up email ke recruiter jika belum ada update",
          type: "FOLLOW_UP",
          dueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
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
      appliedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      notes: "Membutuhkan pengalaman Vue.js yang lebih mendalam. Feedback positif mengenai attitude.",
      events: [
        {
          fromStatus: null,
          toStatus: "APPLIED",
          description: "Kirim lamaran",
          occurredAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        },
        {
          fromStatus: "APPLIED",
          toStatus: "REJECTED",
          description: "Menerima email penolakan ramah dari HR",
          occurredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
      ],
      reminders: [],
    },
  ];

  for (const app of apps) {
    const createdApp = await prisma.application.create({
      data: {
        userId: demoUser.id,
        company: app.company,
        position: app.position,
        employmentType: app.employmentType as any,
        location: app.location,
        salaryMin: app.salaryMin,
        salaryMax: app.salaryMax,
        currency: app.currency,
        source: app.source,
        jobUrl: app.jobUrl,
        status: app.status as any,
        appliedAt: app.appliedAt,
        notes: app.notes,
        events: {
          create: app.events as any,
        },
        reminders: {
          create: app.reminders as any,
        },
      },
    });

    // Record XP Transaction for creating this application
    await prisma.xpTransaction.upsert({
      where: {
        userId_sourceType_sourceId: {
          userId: demoUser.id,
          sourceType: "APPLICATION_CREATED",
          sourceId: createdApp.id,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        sourceType: "APPLICATION_CREATED",
        sourceId: createdApp.id,
        amount: 10,
      },
    });
  }

  // 5. Award Badges to demo user
  const firstStepBadge = await prisma.badge.findUnique({ where: { code: "first-step" } });
  const gettingStartedBadge = await prisma.badge.findUnique({ where: { code: "getting-started" } });
  const interviewReadyBadge = await prisma.badge.findUnique({ where: { code: "interview-ready" } });
  const offerBloomBadge = await prisma.badge.findUnique({ where: { code: "offer-bloom" } });

  if (firstStepBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: firstStepBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: firstStepBadge.id },
    });
  }
  if (gettingStartedBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: gettingStartedBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: gettingStartedBadge.id },
    });
  }
  if (interviewReadyBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: interviewReadyBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: interviewReadyBadge.id },
    });
  }
  if (offerBloomBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: offerBloomBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: offerBloomBadge.id },
    });
  }

  console.log("Seed complete! Guest account: guest@applybloom.com / Password123!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
