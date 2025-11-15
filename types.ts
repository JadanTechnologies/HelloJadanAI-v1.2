export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  tasksCompleted: number;
  ip: string;
  deviceInfo: string;
  status: 'active' | 'suspended' | 'banned';
  credits: number;
  referralCode: string;
  referredBy?: string;
  referralStats: {
    count: number;
    creditsEarned: number;
  };
  fraudRisk: 'low' | 'medium' | 'high';
  location?: {
    country: string;
    region: string;
    city: string;
  };
  dailyGenerations: {
    image: number;
    video: number;
    ad: number;
    lastReset: string; // ISO Date string
  };
}

export interface Generation {
  id: string;
  type: 'image' | 'video' | 'ad';
  prompt: string;
  url: string;
  createdAt: string;
  isFavorite: boolean;
  // Fields for "Use Again" functionality
  style?: string;
  resolution?: string;
  aspectRatio?: string;
  negativePrompt?: string;
  duration?: string;
  platform?: string;
  adType?: string;
  adCreative?: AdCreative;
  // FIX: Added optional sourceImageUrl property to store the URL of the source image used for generation.
  sourceImageUrl?: string;
}

export interface AdCreative {
  headline: string;
  subheadline: string;
  caption: string;
  cta: string;
  targetAudience: string[];
}

export interface CreditTransaction {
  id:string;
  description: string;
  amount: number;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  creditReward: number;
  status: 'incomplete' | 'pending' | 'completed';
  type: 'daily' | 'engagement' | 'profile' | 'youtube_subscribe' | 'social_follow' | 'social_share' | 'app_download';
  targetUrl?: string;
  requiresProof?: boolean;
}

export interface TaskSubmission {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  taskId: string;
  taskTitle: string;
  proof: string;
  submittedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BrandingSettings {
  logoUrl: string | null;
  faviconUrl: string | null;
  hologramLogoUrl: string | null;
}

export interface ContentSettings {
  aboutUs: string;
  contactUs: string;
  termsOfService: string;
  privacyPolicy: string;
  faqs: FAQItem[];
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'success' | 'info' | 'warning';
}

export interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isActive: boolean;
  startDate: string;
  endDate: string | null;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface SmsTemplate {
  id:string;
  name: string;
  body: string;
}

export interface ApiSettings {
  resend: { apiKey: string; };
  twilio: { accountSid: string; authToken: string; phoneNumber: string; };
  oneSignal: { appId: string; restApiKey: string; };
  ipLookup: {
    provider: string;
    apiKey: string;
  };
  aiProviders: {
    gemini: { apiKey: string };
    dalle: { apiKey: string };
    runway: { apiKey: string };
  };
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'running' | 'idle' | 'error';
  lastRun: string;
  nextRun: string;
}

export type StaffRole = 'Admin' | 'Moderator' | 'Support';

export interface StaffMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatar: string;
  role: StaffRole;
}

export interface Referral {
    id: string;
    referrerId: string;
    // FIX: Add missing `referrerUsername` property to the `Referral` interface.
    referrerUsername: string;
    refereeId: string;
    refereeUsername: string;
    status: 'signed_up' | 'task_completed';
    createdAt: string;
}

export interface AccessRestrictionRule {
    id: string;
    type: 'allow' | 'block';
    criteria: 'country' | 'region' | 'os' | 'browser' | 'device' | 'ip';
    value: string;
}

export interface SystemSettings {
    referralRewards: {
        signUp: number;
        firstTask: number;
    };
    fraudDetection: {
        blockTempEmails: boolean;
        maxSignupsPerIp: number;
    };
    accessRestrictions: AccessRestrictionRule[];
    dailyGenerationLimits: {
        image: number;
        video: number;
        ad: number;
    };
}

export interface AppState {
  user: User | null;
  credits: number;
  generations: Generation[];
  creditHistory: CreditTransaction[];
  tasks: Task[];
  notifications: Notification[];
  announcements: Announcement[];
  referrals: Referral[];
  systemSettings: SystemSettings;
  brandingSettings: BrandingSettings;
  contentSettings: ContentSettings;
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_CREDITS'; payload: number }
  | { type: 'ADD_GENERATION'; payload: Generation }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; userId: string; status: 'incomplete' | 'pending' | 'completed' } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'DELETE_GENERATION'; payload: string }
  | { type: 'ADD_CREDIT_TRANSACTION'; payload: CreditTransaction }
  | { type: 'SET_ANNOUNCEMENTS'; payload: Announcement[] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt' | 'read'> }
  | { type: 'MARK_NOTIFICATION_AS_READ'; payload: string }
  | { type: 'UPDATE_SYSTEM_SETTINGS'; payload: SystemSettings }
  | { type: 'UPDATE_PLATFORM_SETTINGS'; payload: { brandingSettings: BrandingSettings; contentSettings: ContentSettings } }
  | { type: 'INCREMENT_DAILY_GENERATION'; payload: { type: GenerationType } };

export type GenerationType = 'image' | 'video' | 'ad';