export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  tasksCompleted: number;
  ip: string;
  deviceInfo: string;
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
}

export interface AdCreative {
  headline: string;
  subheadline: string;
  caption: string;
  cta: string;
  targetAudience: string[];
}

export interface CreditTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  creditReward: number;
  isCompleted: boolean;
  type: 'daily' | 'engagement' | 'profile';
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
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'DELETE_GENERATION'; payload: string }
  | { type: 'ADD_CREDIT_TRANSACTION'; payload: CreditTransaction };

export type GenerationType = 'image' | 'video' | 'ad';