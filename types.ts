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


export interface AppState {
  user: User | null;
  credits: number;
  generations: Generation[];
  creditHistory: CreditTransaction[];
  tasks: Task[];
}

export type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_CREDITS'; payload: number }
  | { type: 'ADD_GENERATION'; payload: Generation }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: 'incomplete' | 'pending' | 'completed' } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'DELETE_GENERATION'; payload: string }
  | { type: 'ADD_CREDIT_TRANSACTION'; payload: CreditTransaction };

export type GenerationType = 'image' | 'video' | 'ad';