export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  role: 'student' | 'content_creator' | 'startup' | 'advertiser';
  tasksCompleted: number;
  ip: string;
  deviceInfo: string;
  status: 'active' | 'suspended' | 'banned';
  credits: number;
  dataBalanceMB: number; // in Megabytes
  airtimeBalanceNGN: number; // in Nigerian Naira
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
    social: number;
    lastReset: string; // ISO Date string
  };
}

export interface Generation {
  id: string;
  type: 'image' | 'video' | 'ad' | 'social';
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
  socialPost?: {
    platform: string;
    tone: string;
    content: string;
  };
  // Fields for "Use Again" functionality
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
  rewardAmount: number;
  rewardType: 'credits' | 'data' | 'airtime';
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
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface RedemptionRequest {
  id:string;
  userId: string;
  username: string;
  avatar: string;
  type: 'data' | 'airtime';
  amount: number;
  networkProvider: string;
  phoneNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
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
    gemini: { apiKey: string; };
    dalle: { apiKey: string; };
    midjourney: { apiKey: string; };
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

export type Permission =
  | 'view_dashboard'
  | 'manage_users'
  | 'manage_staff'
  | 'manage_roles'
  | 'view_login_history'
  | 'edit_platform_settings'
  | 'manage_tasks'
  | 'review_task_submissions'
  | 'manage_campaigns'
  | 'manage_payments'
  | 'process_redemptions'
  | 'manage_support_tickets'
  | 'manage_referrals'
  | 'view_fraud_detection'
  | 'manage_access_control'
  | 'manage_announcements'
  | 'manage_templates'
  | 'view_cron_jobs';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface StaffMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatar: string;
  roleName: string;
}

export interface Referral {
    id: string;
    referrerId: string;
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

export interface Campaign {
  id: string;
  advertiserId: string;
  companyName: string;
  contactEmail: string;
  productName: string;
  taskDescription: string;
  targetUrl: string;
  taskType: 'visit_website' | 'signup';
  budget: number; // total budget in USD
  cpa: number; // cost per action in USD
  userCreditReward: number; // credits given to user, set by admin
  status: 'pending_payment' | 'pending_review' | 'active' | 'paused' | 'completed' | 'rejected';
  submittedAt: string;
  imageUrl?: string;
  paymentId?: string;
  completedActions?: number;
}

export type PaymentGateway = 'paystack' | 'flutterwave' | 'monnify' | 'manual';

export interface Payment {
  id: string;
  campaignId: string;
  campaignName: string;
  companyName: string;
  amount: number;
  currency: 'USD' | 'NGN';
  gateway: PaymentGateway;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentProofUrl?: string; // for manual payments
  createdAt: string;
}

export interface PaymentGatewaySettings {
  paystack: { enabled: boolean; publicKey: string; secretKey: string; };
  flutterwave: { enabled: boolean; publicKey: string; secretKey: string; };
  monnify: { enabled: boolean; apiKey: string; contractCode: string; };
  manual: {
    enabled: boolean;
    accountName: string;
    accountNumber: string;
    bankName: string;
    instructions: string;
  };
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
    sponsoredTasksEnabled: boolean;
    dailyGenerationLimits: {
        image: number;
        video: number;
        ad: number;
        social: number;
    };
    maintenanceMode: boolean;
    maintenanceMessage: string;
    paymentGateways: PaymentGatewaySettings;
}

export interface SupportTicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  avatar: string;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  subject: string;
  relatedTaskId?: string;
  relatedTaskTitle?: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  lastUpdatedAt: string;
  messages: SupportTicketMessage[];
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  email: string;
  date: string;
  ip: string;
  device: string;
  status: 'Success' | 'Failed';
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
  campaigns: Campaign[];
  payments: Payment[];
  redemptionRequests: RedemptionRequest[];
  supportTickets: SupportTicket[];
  recentRedemption: { successful: boolean; message: string } | null;
  roles: Role[];
  staff: StaffMember[];
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_USER'; payload: User }
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
  | { type: 'ADD_CAMPAIGN'; payload: Campaign }
  | { type: 'UPDATE_CAMPAIGN'; payload: Campaign }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'INCREMENT_DAILY_GENERATION'; payload: { type: GenerationType } }
  | { type: 'CREATE_REDEMPTION_REQUEST'; payload: RedemptionRequest }
  | { type: 'UPDATE_REDEMPTION_STATUS'; payload: { requestId: string; status: 'completed' | 'rejected' } }
  | { type: 'DISMISS_REDEMPTION_BANNER' }
  | { type: 'BULK_UPDATE_USER_STATUS'; payload: { userIds: string[], status: 'active' | 'suspended' | 'banned' | 'deleted' } }
  | { type: 'CREATE_SUPPORT_TICKET'; payload: SupportTicket }
  | { type: 'ADD_SUPPORT_TICKET_REPLY'; payload: { ticketId: string; message: SupportTicketMessage } }
  | { type: 'UPDATE_SUPPORT_TICKET_STATUS'; payload: { ticketId: string; status: 'open' | 'in_progress' | 'closed' } }
  | { type: 'ADD_OR_UPDATE_ROLE'; payload: Role }
  | { type: 'DELETE_ROLE'; payload: string }
  | { type: 'ADD_STAFF'; payload: StaffMember }
  | { type: 'UPDATE_STAFF_ROLE'; payload: { staffId: string, roleName: string } }
  | { type: 'DELETE_STAFF'; payload: string };


export type GenerationType = 'image' | 'video' | 'ad' | 'social';