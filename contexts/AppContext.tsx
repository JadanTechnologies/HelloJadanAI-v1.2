import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, User, Generation, CreditTransaction, Task, Notification, Announcement, Referral, SystemSettings, AccessRestrictionRule, GenerationType, BrandingSettings, ContentSettings, Campaign, Payment, RedemptionRequest } from '../types';
import { mockAnnouncements, mockReferrals, mockSystemSettings, mockBrandingSettings, mockContentSettings, mockCampaigns, mockPayments, mockRedemptionRequests, mockUsers } from '../pages/admin/data';

const initialGenerations: Generation[] = [
    { id: 'gen-1', type: 'image', prompt: 'A futuristic city skyline', url: 'https://picsum.photos/seed/futuristic/512/512', createdAt: new Date().toISOString(), isFavorite: false, style: 'Realistic', resolution: 'HD' },
    { id: 'gen-2', type: 'video', prompt: 'A robot dancing in the rain', url: 'https://www.w3schools.com/html/mov_bbb.mp4', createdAt: new Date().toISOString(), isFavorite: true, style: 'Cinematic', duration: '10s' },
];

const initialTasks: Task[] = [
    { id: 'task-1', title: 'Daily Login', description: 'Log in every day to earn credits.', rewardAmount: 10, rewardType: 'credits', status: 'completed', type: 'daily' },
    { id: 'task-2', title: 'Generate 1 Image', description: 'Create your first masterpiece.', rewardAmount: 5, rewardType: 'credits', status: 'incomplete', type: 'daily' },
    { id: 'task-3', title: 'Share on Social Media', description: 'Share your creation with friends.', rewardAmount: 15, rewardType: 'credits', status: 'incomplete', type: 'engagement', requiresProof: true, targetUrl: 'https://x.com' },
    { id: 'task-4', title: 'Complete Profile', description: 'Upload an avatar and set a username.', rewardAmount: 20, rewardType: 'credits', status: 'completed', type: 'profile' },
    { id: 'task-data-1', title: 'Watch a Tutorial Video', description: 'Learn a new skill and earn data.', rewardAmount: 100, rewardType: 'data', status: 'incomplete', type: 'engagement' },
    { id: 'task-airtime-1', title: 'Take a Survey', description: 'Give us your feedback for an airtime reward.', rewardAmount: 50, rewardType: 'airtime', status: 'incomplete', type: 'engagement', requiresProof: true },
];

const initialCreditHistory: CreditTransaction[] = [
    { id: 'tx-1', description: 'Initial Credits', amount: 100, date: new Date().toISOString() },
    { id: 'tx-2', description: 'Generated Image', amount: -5, date: new Date().toISOString() },
]

const initialState: AppState = {
  user: null,
  credits: 0,
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
  redemptionRequests: mockRedemptionRequests,
  recentRedemption: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, credits: action.payload.credits };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_USER':
        // This is a simulation for the frontend. In a real app, this would be an API call.
        // We add the user to the mock users list. This doesn't log them in.
        console.log("New user added (simulated):", action.payload);
        return state; // In a real app, you might update a list of all users.
    case 'UPDATE_CREDITS':
      return { ...state, credits: action.payload };
    case 'ADD_GENERATION':
      return { ...state, generations: [action.payload, ...state.generations] };
    // FIX: Wrapped case in a block scope to prevent redeclaration errors of 'updatedUser' in other cases.
    case 'UPDATE_TASK_STATUS': {
        const { taskId, status, userId } = action.payload;
        const taskToUpdate = state.tasks.find(t => t.id === taskId);
        
        if (!state.user || !taskToUpdate || state.user.id !== userId) return state;
        if (state.tasks.find(t => t.id === taskId)?.status !== 'incomplete') return state;

        const isCompleting = status === 'completed';
        if (!isCompleting) {
             return { ...state, tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t) };
        }
        
        const isFirstTaskCompletion = state.user.tasksCompleted === 0;

        let updatedUser = { ...state.user, tasksCompleted: state.user.tasksCompleted + 1 };
        let newCreditHistory = state.creditHistory;
        let newNotifications = state.notifications;

        // Handle reward type
        switch (taskToUpdate.rewardType) {
            case 'credits':
                updatedUser.credits += taskToUpdate.rewardAmount;
                newCreditHistory = [{ id: `tx-${Date.now()}`, description: `Task: ${taskToUpdate.title}`, amount: taskToUpdate.rewardAmount, date: new Date().toISOString()}, ...state.creditHistory];
                break;
            case 'data':
                updatedUser.dataBalanceMB += taskToUpdate.rewardAmount;
                newNotifications = [{ id: `notif-${Date.now()}`, message: `You earned ${taskToUpdate.rewardAmount}MB of data!`, read: false, createdAt: new Date().toISOString(), type: 'success' }, ...newNotifications];
                break;
            case 'airtime':
                updatedUser.airtimeBalanceNGN += taskToUpdate.rewardAmount;
                 newNotifications = [{ id: `notif-${Date.now()}`, message: `You earned NGN ${taskToUpdate.rewardAmount} in airtime!`, read: false, createdAt: new Date().toISOString(), type: 'success' }, ...newNotifications];
                break;
        }

        // Base state update
        let newState = {
            ...state,
            user: updatedUser,
            credits: updatedUser.credits,
            tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
            creditHistory: newCreditHistory,
            notifications: newNotifications,
        };
        
        // Handle referral bonus for the referrer
        if (isFirstTaskCompletion && state.user.referredBy) {
            const referrerId = state.user.referredBy;
            const referralBonus = 15; // This would come from admin settings in a real app
            console.log(`User ${state.user.id} completed their first task. Awarding ${referralBonus} credits to referrer ${referrerId}`);
            const updatedReferrals = state.referrals.map(r => 
                r.refereeId === userId && r.referrerId === referrerId 
                ? { ...r, status: 'task_completed' as 'task_completed' } 
                : r
            );

            newState = { ...newState, referrals: updatedReferrals };
        }

        return newState;
    }
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
    case 'CREATE_REDEMPTION_REQUEST':
        if (!state.user) return state;
        const req = action.payload;
        const userAfterDeduction = { ...state.user };
        if (req.type === 'data') {
            userAfterDeduction.dataBalanceMB -= req.amount;
        } else {
            userAfterDeduction.airtimeBalanceNGN -= req.amount;
        }
        return {
            ...state,
            user: userAfterDeduction,
            redemptionRequests: [req, ...state.redemptionRequests]
        };
    case 'UPDATE_REDEMPTION_STATUS':
        const { requestId, status: newStatus } = action.payload;
        const requestToUpdate = state.redemptionRequests.find(r => r.id === requestId);
        if (!requestToUpdate) return state;

        let finalState = {
            ...state,
            redemptionRequests: state.redemptionRequests.map(r =>
                r.id === requestId ? { ...r, status: newStatus, processedAt: new Date().toISOString() } : r
            )
        };

        if (newStatus === 'completed') {
            finalState.recentRedemption = { successful: true, message: `Your ${requestToUpdate.type} top-up of ${requestToUpdate.type === 'data' ? `${requestToUpdate.amount}MB` : `NGN ${requestToUpdate.amount}`} has been sent to ${requestToUpdate.phoneNumber}.` };
            finalState.notifications = [{
                id: `notif-${Date.now()}`,
                message: `Your ${requestToUpdate.type} redemption has been approved and sent!`,
                read: false,
                createdAt: new Date().toISOString(),
                type: 'success'
            }, ...finalState.notifications];
            // Here you would also trigger an SMS
            console.log(`SIMULATING SMS: Sending ${requestToUpdate.amount} of ${requestToUpdate.type} to ${requestToUpdate.phoneNumber}.`);
        } else if (newStatus === 'rejected') {
            // Refund the user if rejected
            const userToRefund = mockUsers.find(u => u.id === requestToUpdate.userId); // In real app, you'd get the user from state/API
            if (userToRefund) {
                 // This is a mock update. In a real app, this would be a single atomic transaction.
                 console.log(`Refunding ${requestToUpdate.amount} ${requestToUpdate.type} to user ${requestToUpdate.userId}`);
            }
             finalState.notifications = [{
                id: `notif-${Date.now()}`,
                message: `Your ${requestToUpdate.type} redemption was rejected. The amount has been refunded to your balance.`,
                read: false,
                createdAt: new Date().toISOString(),
                type: 'warning'
            }, ...finalState.notifications];
        }
        
        return finalState;
    case 'DISMISS_REDEMPTION_BANNER':
        return { ...state, recentRedemption: null };
    // FIX: Wrapped case in a block scope to prevent redeclaration errors of 'updatedUser' in other cases.
    case 'INCREMENT_DAILY_GENERATION': {
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
    }
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
    const user = mockUsers.find(u => u.email === email && !u.isAdmin);
    if (user && password === 'password') {
      const access = checkAccess(user);
      if (!access.allowed) {
        return { success: false, message: access.message };
      }
      const userWithLocation: User = {
          ...user,
          location: { country: 'United States', region: 'California', city: 'San Francisco' }
      };
      dispatch({ type: 'LOGIN', payload: userWithLocation });
      return { success: true };
    }
    return { success: false, message: "Invalid credentials. Please try again."};
  };

  const loginAsAdmin = (email: string, password: string): LoginResult => {
    const user = mockUsers.find(u => u.email === email && u.isAdmin);
    if (user && password === 'password') {
       const access = checkAccess(user);
       if (!access.allowed) {
        return { success: false, message: access.message };
      }
       const userWithLocation: User = {
          ...user,
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