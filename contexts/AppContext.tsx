import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, User, Generation, CreditTransaction, Task, Notification, Announcement, Referral, SystemSettings, AccessRestrictionRule, GenerationType, BrandingSettings, ContentSettings, Campaign, Payment } from '../types';
import { mockAnnouncements, mockReferrals, mockSystemSettings, mockBrandingSettings, mockContentSettings, mockCampaigns, mockPayments } from '../pages/admin/data';

const mockAdminUser: User = {
    id: 'user-1',
    username: 'Admin Jadan',
    email: 'admin@example.com',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    isAdmin: true,
    tasksCompleted: 5,
    ip: '192.168.1.1',
    deviceInfo: 'Chrome on macOS',
    status: 'active',
    credits: 9999,
    referralCode: 'ADMINJADAN',
    referralStats: { count: 0, creditsEarned: 0 },
    fraudRisk: 'low',
    dailyGenerations: { image: 0, video: 0, ad: 0, lastReset: new Date().toISOString() },
};

const mockRegularUser: User = {
    id: 'user-2',
    username: 'Jadan',
    email: 'jadan@example.com',
    avatar: 'https://picsum.photos/seed/jadan/100/100',
    isAdmin: false,
    tasksCompleted: 15,
    ip: '198.51.100.5',
    deviceInfo: 'Firefox on Windows',
    status: 'active',
    credits: 100,
    referralCode: 'JADAN123',
    referralStats: { count: 2, creditsEarned: 35 },
    fraudRisk: 'low',
    dailyGenerations: { image: 2, video: 1, ad: 4, lastReset: new Date().toISOString() },
};

const initialGenerations: Generation[] = [
    { id: 'gen-1', type: 'image', prompt: 'A futuristic city skyline', url: 'https://picsum.photos/seed/futuristic/512/512', createdAt: new Date().toISOString(), isFavorite: false, style: 'Realistic', resolution: 'HD' },
    { id: 'gen-2', type: 'video', prompt: 'A robot dancing in the rain', url: 'https://www.w3schools.com/html/mov_bbb.mp4', createdAt: new Date().toISOString(), isFavorite: true, style: 'Cinematic', duration: '10s' },
];

const initialTasks: Task[] = [
    { id: 'task-1', title: 'Daily Login', description: 'Log in every day to earn credits.', creditReward: 10, status: 'completed', type: 'daily' },
    { id: 'task-2', title: 'Generate 1 Image', description: 'Create your first masterpiece.', creditReward: 5, status: 'incomplete', type: 'daily' },
    { id: 'task-3', title: 'Share on Social Media', description: 'Share your creation with friends.', creditReward: 15, status: 'incomplete', type: 'engagement', requiresProof: true, targetUrl: 'https://x.com' },
    { id: 'task-4', title: 'Complete Profile', description: 'Upload an avatar and set a username.', creditReward: 20, status: 'completed', type: 'profile' },
];

const initialCreditHistory: CreditTransaction[] = [
    { id: 'tx-1', description: 'Initial Credits', amount: 100, date: new Date().toISOString() },
    { id: 'tx-2', description: 'Generated Image', amount: -5, date: new Date().toISOString() },
]

const initialState: AppState = {
  user: null,
  credits: 100,
  generations: initialGenerations,
  creditHistory: initialCreditHistory,
  tasks: initialTasks,
  notifications: [],
  announcements: mockAnnouncements.filter(a => {
      const now = new Date();
      const start = new Date(a.startDate);
      const end = a.endDate ? new Date(a.endDate) : null;
      return a.isActive && start <= now && (!end || end >= now);
  }),
  referrals: mockReferrals,
  systemSettings: mockSystemSettings,
  brandingSettings: mockBrandingSettings,
  contentSettings: mockContentSettings,
  campaigns: mockCampaigns,
  payments: mockPayments,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, credits: action.payload.credits };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'UPDATE_CREDITS':
      return { ...state, credits: action.payload };
    case 'ADD_GENERATION':
      return { ...state, generations: [action.payload, ...state.generations] };
    case 'UPDATE_TASK_STATUS':
        const { taskId, status, userId } = action.payload;
        const taskToUpdate = state.tasks.find(t => t.id === taskId);
        
        // Ensure user is logged in and task exists
        if (!state.user || !taskToUpdate) return state;
        
        // Prevent re-completing a task
        if (state.tasks.find(t => t.id === taskId)?.status !== 'incomplete') return state;

        const isCompleting = status === 'completed';
        const isFirstTaskCompletion = state.user.tasksCompleted === 0 && isCompleting;

        // Base state update
        let newState = {
            ...state,
            credits: isCompleting ? state.credits + taskToUpdate.creditReward : state.credits,
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
            user: isCompleting ? { ...state.user, tasksCompleted: state.user.tasksCompleted + 1 } : state.user,
            creditHistory: isCompleting 
                ? [{ id: `tx-${Date.now()}`, description: `Task: ${taskToUpdate.title}`, amount: taskToUpdate.creditReward, date: new Date().toISOString()}, ...state.creditHistory]
                : state.creditHistory
        };
        
        // Handle referral bonus for the referrer
        if (isFirstTaskCompletion && state.user.referredBy) {
            const referrerId = state.user.referredBy;
            const referralBonus = 15; // This would come from admin settings in a real app
            console.log(`User ${state.user.id} completed their first task. Awarding ${referralBonus} credits to referrer ${referrerId}`);
            
            // In a real app, this would be an API call to update the referrer's balance.
            // Here, we'll just log it. If the referrer was logged in, we could update them.
            
            // We also need to update the referral record status
            const updatedReferrals = state.referrals.map(r => 
                r.refereeId === userId && r.referrerId === referrerId 
                ? { ...r, status: 'task_completed' as 'task_completed' } 
                : r
            );

            newState = { ...newState, referrals: updatedReferrals };
        }

        return newState;
    case 'TOGGLE_FAVORITE':
      return { ...state, generations: state.generations.map(g => g.id === action.payload ? { ...g, isFavorite: !g.isFavorite } : g) };
    case 'DELETE_GENERATION':
      return { ...state, generations: state.generations.filter(g => g.id !== action.payload) };
    case 'ADD_CREDIT_TRANSACTION':
        return { ...state, creditHistory: [action.payload, ...state.creditHistory]}
    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      return { ...state, notifications: [newNotification, ...state.notifications] };
    case 'MARK_NOTIFICATION_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n),
      };
    case 'UPDATE_SYSTEM_SETTINGS':
        return { ...state, systemSettings: action.payload };
    case 'UPDATE_PLATFORM_SETTINGS':
        return {
            ...state,
            brandingSettings: action.payload.brandingSettings,
            contentSettings: action.payload.contentSettings,
        };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [action.payload, ...state.campaigns] };
    case 'UPDATE_CAMPAIGN':
      return { 
          ...state, 
          campaigns: state.campaigns.map(c => 
              c.id === action.payload.id ? action.payload : c
          ) 
      };
    case 'ADD_PAYMENT':
      return { ...state, payments: [action.payload, ...state.payments] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'INCREMENT_DAILY_GENERATION':
        if (!state.user) return state;
        const { type } = action.payload;
        
        const today = new Date().toISOString().split('T')[0];
        const lastResetDate = state.user.dailyGenerations.lastReset.split('T')[0];
        
        let currentDailyGenerations = state.user.dailyGenerations;

        // If last reset was before today, reset the counts
        if (lastResetDate !== today) {
            currentDailyGenerations = {
                image: 0,
                video: 0,
                ad: 0,
                lastReset: new Date().toISOString()
            };
        }
        
        // Now increment the count for the current generation
        const updatedUser = {
            ...state.user,
            dailyGenerations: {
            ...currentDailyGenerations,
            [type]: currentDailyGenerations[type as GenerationType] + 1,
            }
        };
      
        return { ...state, user: updatedUser };
    default:
      return state;
  }
};

type LoginResult = { success: boolean; message?: string; };

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  loginAsAdmin: (email: string, password: string) => LoginResult;
}>({
  state: initialState,
  dispatch: () => null,
  login: () => ({ success: false }),
  logout: () => {},
  loginAsAdmin: () => ({ success: false }),
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const checkAccess = (user: User): { allowed: boolean; message?: string } => {
    const { accessRestrictions } = state.systemSettings;
    if (accessRestrictions.length === 0) {
      return { allowed: true };
    }

    // Mock location for checking rules
    const location = { country: 'United States', region: 'California', city: 'San Francisco' };
    const deviceInfo = user.deviceInfo.toLowerCase();
    
    // Parse device info
    const osMatch = deviceInfo.match(/windows|macos|linux|ios|android/);
    const os = osMatch ? osMatch[0] : 'unknown';
    
    const browserMatch = deviceInfo.match(/chrome|firefox|safari|edge/);
    const browser = browserMatch ? browserMatch[0] : 'unknown';
    
    const deviceType = (os === 'ios' || os === 'android') ? 'Mobile' : 'Desktop';
    
    for (const rule of accessRestrictions) {
        let match = false;
        const ruleValue = rule.value.toLowerCase();

        switch(rule.criteria) {
            case 'ip':
                if (user.ip === rule.value) match = true;
                break;
            case 'country':
                if (location.country.toLowerCase() === ruleValue) match = true;
                break;
            case 'region':
                 if (location.region.toLowerCase() === ruleValue) match = true;
                break;
            case 'os':
                if (os === ruleValue) match = true;
                break;
            case 'browser':
                if (browser === ruleValue) match = true;
                break;
            case 'device':
                if (deviceType.toLowerCase() === ruleValue) match = true;
                break;
        }

        if (match && rule.type === 'block') {
            return { allowed: false, message: `Access from your location or device is restricted.` };
        }
    }

    return { allowed: true };
  };

  const login = (email: string, password: string): LoginResult => {
    if (email === mockRegularUser.email && password === 'password') {
      const access = checkAccess(mockRegularUser);
      if (!access.allowed) {
        return { success: false, message: access.message };
      }
      const userWithLocation: User = {
          ...mockRegularUser,
          location: { country: 'United States', region: 'California', city: 'San Francisco' }
      };
      dispatch({ type: 'LOGIN', payload: userWithLocation });
      return { success: true };
    }
    return { success: false, message: "Invalid credentials. Please try again."};
  };

  const loginAsAdmin = (email: string, password: string): LoginResult => {
    if (email === mockAdminUser.email && password === 'password') {
       const access = checkAccess(mockAdminUser);
       if (!access.allowed) {
        return { success: false, message: access.message };
      }
       const userWithLocation: User = {
          ...mockAdminUser,
          location: { country: 'United States', region: 'New York', city: 'New York City' }
      };
      dispatch({ type: 'LOGIN', payload: userWithLocation });
      return { success: true };
    }
    return { success: false, message: "Invalid credentials. Please try again." };
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, loginAsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};