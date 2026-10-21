import {
  ApplicationStatusType,
  EmploymentTypeType,
  ReminderTypeType,
} from "@/lib/constants";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  timezone: string;
}

export interface GamificationProfileDto {
  id: string;
  userId: string;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  plantStage: number;
  plantStageName?: string;
  nextLevelXp?: number;
  xpProgressInLevel?: number;
  waterCountToday?: number;
  maxWaterPerDay?: number;
  remainingWater?: number;
  canWater?: boolean;
}

export interface ApplicationEventDto {
  id: string;
  applicationId: string;
  fromStatus: ApplicationStatusType | null;
  toStatus: ApplicationStatusType | null;
  description: string | null;
  occurredAt: string;
}

export interface ReminderDto {
  id: string;
  applicationId: string;
  title: string;
  type: ReminderTypeType;
  dueAt: string;
  completedAt: string | null;
  createdAt: string;
  application?: {
    company: string;
    position: string;
    status: ApplicationStatusType;
  };
}

export interface ApplicationDto {
  id: string;
  userId: string;
  company: string;
  position: string;
  location: string | null;
  employmentType: EmploymentTypeType | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  source: string | null;
  jobUrl: string | null;
  status: ApplicationStatusType;
  appliedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  events?: ApplicationEventDto[];
  reminders?: ReminderDto[];
}

export interface BadgeDto {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  threshold: number | null;
  isUnlocked: boolean;
  earnedAt: string | null;
  currentProgress?: number;
}

export interface XpTransactionDto {
  id: string;
  sourceType: string;
  sourceId: string;
  amount: number;
  createdAt: string;
}

export interface DashboardSummaryDto {
  totalApplications: number;
  interviewsCount: number;
  offersCount: number;
  pendingCount: number;
  weeklyCount: number;
  plantStage: number;
  level: number;
  currentStreak: number;
  totalXp: number;
  plantStageName: string;
  upcomingReminders: ReminderDto[];
  waterCountToday?: number;
  maxWaterPerDay?: number;
  remainingWater?: number;
  canWater?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: string;
  message?: string;
}
