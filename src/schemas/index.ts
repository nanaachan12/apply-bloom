import { z } from "zod";
import { APPLICATION_STATUS, EMPLOYMENT_TYPE, REMINDER_TYPE } from "@/lib/constants";

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(60),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  timezone: z.string().default("Asia/Jakarta"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  timezone: z.string().optional(),
});

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Nama perusahaan wajib diisi").max(100),
  position: z.string().min(1, "Posisi wajib diisi").max(100),
  location: z.string().max(100).optional().nullable(),
  employmentType: z
    .enum([
      EMPLOYMENT_TYPE.FULL_TIME,
      EMPLOYMENT_TYPE.PART_TIME,
      EMPLOYMENT_TYPE.CONTRACT,
      EMPLOYMENT_TYPE.INTERNSHIP,
      EMPLOYMENT_TYPE.FREELANCE,
    ])
    .optional()
    .nullable(),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  currency: z.string().default("IDR"),
  source: z.string().max(100).optional().nullable(),
  jobUrl: z.string().max(500, "URL maksimal 500 karakter").optional().nullable().or(z.literal("")),
  status: z
    .enum([
      APPLICATION_STATUS.WISHLIST,
      APPLICATION_STATUS.APPLIED,
      APPLICATION_STATUS.SCREENING,
      APPLICATION_STATUS.ASSESSMENT,
      APPLICATION_STATUS.INTERVIEW,
      APPLICATION_STATUS.OFFER,
      APPLICATION_STATUS.REJECTED,
      APPLICATION_STATUS.WITHDRAWN,
    ])
    .default(APPLICATION_STATUS.WISHLIST),
  appliedAt: z.string().datetime().optional().nullable().or(z.literal("")),
  notes: z.string().max(5000).optional().nullable(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum([
    APPLICATION_STATUS.WISHLIST,
    APPLICATION_STATUS.APPLIED,
    APPLICATION_STATUS.SCREENING,
    APPLICATION_STATUS.ASSESSMENT,
    APPLICATION_STATUS.INTERVIEW,
    APPLICATION_STATUS.OFFER,
    APPLICATION_STATUS.REJECTED,
    APPLICATION_STATUS.WITHDRAWN,
  ]),
  description: z.string().max(500).optional().nullable(),
});

export const createReminderSchema = z.object({
  title: z.string().min(1, "Judul reminder wajib diisi").max(200),
  type: z
    .enum([
      REMINDER_TYPE.INTERVIEW,
      REMINDER_TYPE.ASSESSMENT,
      REMINDER_TYPE.FOLLOW_UP,
      REMINDER_TYPE.DEADLINE,
      REMINDER_TYPE.OTHER,
    ])
    .default(REMINDER_TYPE.OTHER),
  dueAt: z.string().datetime("Tanggal dan waktu reminder harus valid"),
});

export const updateReminderSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z
    .enum([
      REMINDER_TYPE.INTERVIEW,
      REMINDER_TYPE.ASSESSMENT,
      REMINDER_TYPE.FOLLOW_UP,
      REMINDER_TYPE.DEADLINE,
      REMINDER_TYPE.OTHER,
    ])
    .optional(),
  dueAt: z.string().datetime().optional(),
  isCompleted: z.boolean().optional(),
});
