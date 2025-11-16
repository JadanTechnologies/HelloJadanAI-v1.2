import React, { createContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { AppState, AppAction, User, Generation, CreditTransaction, Task, Notification, Announcement, Referral, SystemSettings, BrandingSettings, ContentSettings, Campaign, Payment, RedemptionRequest, SupportTicket, SupportTicketMessage, Role, StaffMember } from '../types';
import { mockAnnouncements, mockReferrals, mockSystemSettings, mockBrandingSettings, mockContentSettings, mockCampaigns, mockPayments, mockRedemptionRequests, mockSupportTickets, mockRoles, mockStaff } from '../pages/admin/data';
import * as api from '../services/api';

const initialState: AppState = {
  user: null,
  credits: 0,
  generations: [], // Will be loaded from user data or local storage
  creditHistory: [], // Will be loaded from user data
  tasks: [], // Will be loaded based on user
  notifications: [],
  announcements: mockAnnouncements.filter(a => {
      const now = new Date();
      const start = new Date(a.startDate);
      const end = a.endDate ? new Date(a.endDate) : null;
      return a.isActive && start <= now && (!end || end >= now);
  }),
  referrals: [], // Will be loaded based on user
  systemSettings: mockSystemSettings,
  brandingSettings: mockBrandingSettings,
  contentSettings: mockContentSettings,
  campaigns: [], // Will be loaded
  payments: mockPayments, // Admin-facing, can still be mock for now
  redemptionRequests: mockRedemptionRequests, // Admin-facing
  supportTickets: mockSupportTickets, // Admin-facing
  recentRedemption: null,
  roles: mockRoles, // Admin-facing
  staff: mockStaff, // Admin-facing
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, credits: action.payload.credits };
    case 'LOGOUT':
      // Reset user-specific data on logout
      return { ...state, user: null, credits: 0, tasks: [], generations: [], creditHistory: [], referrals: [] };
    case 'ADD_USER':
      // This is now mainly for simulation, login handles the state update
      console.log("New user signed up (simulated):", action.payload);
      return state;
    case 'UPDATE_CREDITS':
      return { ...state, credits: action.payload };
    case 'ADD_GENERATION':
      return { ...state, generations: [action.payload, ...state.generations] };
    case 'UPDATE_TASK_STATUS': {
      // Simplified: This action now just updates the UI status of a task.
      // The reward logic is handled by the API service.
      const { taskId, status } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t),
      };
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
    case 'UPDATE_REDEMPTION_STATUS': {
        const { requestId, status: newStatus } = action.payload;
        const requestToUpdate = state.redemptionRequests.find(r => r.id === requestId);
        if (!requestToUpdate) return state;

        let finalState: AppState = {
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
            console.log(`SIMULATING SMS: Sending ${requestToUpdate.amount} of ${requestToUpdate.type} to ${requestToUpdate.phoneNumber}.`);
        } else if (newStatus === 'rejected') {
            // BUG FIX: Refund the user's balance if their request is rejected.
            if (state.user && state.user.id === requestToUpdate.userId) {
                const updatedUser = { ...state.user };
                if (requestToUpdate.type === 'data') {
                    updatedUser.dataBalanceMB += requestToUpdate.amount;
                } else {
                    updatedUser.airtimeBalanceNGN += requestToUpdate.amount;
                }
                finalState.user = updatedUser;
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
    }
    case 'DISMISS_REDEMPTION_BANNER':
        return { ...state, recentRedemption: null };
    case 'INCREMENT_DAILY_GENERATION': {
        if (!state.user) return state;
        const { type } = action.payload;
        
        const today = new Date().toISOString().split('T')[0];
        const lastResetDate = state.user.dailyGenerations.lastReset.split('T')[0];
        
        let currentDailyGenerations = state.user.dailyGenerations;

        if (lastResetDate !== today) {
            currentDailyGenerations = {
                image: 0,
                video: 0,
                ad: 0,
                social: 0,
                lastReset: new Date().toISOString()
            };
        }
        
        const updatedUser = {
            ...state.user,
            dailyGenerations: {
            ...currentDailyGenerations,
            [type]: currentDailyGenerations[type] + 1,
            }
        };
      
        return { ...state, user: updatedUser };
    }
    case 'BULK_UPDATE_USER_STATUS': {
        const { userIds, status } = action.payload;
        console.log(`API call simulated: Set status to '${status}' for ${userIds.length} users.`);
        return state;
    }
    case 'CREATE_SUPPORT_TICKET':
      return {
        ...state,
        supportTickets: [action.payload, ...state.supportTickets],
      };
    case 'ADD_SUPPORT_TICKET_REPLY': {
      const { ticketId, message } = action.payload;
      return {
        ...state,
        supportTickets: state.supportTickets.map(ticket =>
          ticket.id === ticketId
            ? {
                ...ticket,
                messages: [...ticket.messages, message],
                lastUpdatedAt: new Date().toISOString(),
              }
            : ticket
        ),
      };
    }
    case 'UPDATE_SUPPORT_TICKET_STATUS': {
      const { ticketId, status } = action.payload;
      return {
        ...state,
        supportTickets: state.supportTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status, lastUpdatedAt: new Date().toISOString() } : ticket
        ),
      };
    }
    case 'ADD_OR_UPDATE_ROLE': {
        const existing = state.roles.find(r => r.id === action.payload.id);
        if (existing) {
            return { ...state, roles: state.roles.map(r => r.id === action.payload.id ? action.payload : r) };
        }
        return { ...state, roles: [action.payload, ...state.roles] };
    }
    case 'DELETE_ROLE': {
        return { ...state, roles: state.roles.filter(r => r.id !== action.payload) };
    }
    case 'ADD_STAFF': {
        return { ...state, staff: [action.payload, ...state.staff] };
    }
    case 'UPDATE_STAFF_ROLE': {
        return {
            ...state,
            staff: state.staff.map(s => s.id === action.payload.staffId ? { ...s, roleName: action.payload.roleName } : s),
        };
    }
    case 'DELETE_STAFF': {
        return { ...state, staff: state.staff.filter(s => s.id !== action.payload) };
    }
    // New actions for setting fetched data
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };
    case 'SET_REFERRALS':
      return { ...state, referrals: action.payload };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  isInitializing: boolean;
}>({
  state: initialState,
  dispatch: () => null,
  isInitializing: true,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);

  // Effect to fetch user-specific data upon login
  useEffect(() => {
    const fetchUserData = async () => {
      if (state.user) {
        setIsInitializing(true);
        const data = await api.apiFetchUserData(state.user.id);
        if (data) {
          dispatch({ type: 'SET_TASKS', payload: data.tasks });
          dispatch({ type: 'SET_CAMPAIGNS', payload: data.campaigns });
          dispatch({ type: 'SET_REFERRALS', payload: data.referrals });
        }
        setIsInitializing(false);
      }
    };
    fetchUserData();
  }, [state.user]);
  
  // Effect to stop initial loading if there's no user
   useEffect(() => {
    // This simulates checking for a user session on initial load.
    // In a real app with Supabase, you'd check `supabase.auth.session()` here.
    setTimeout(() => {
      if (!state.user) {
        setIsInitializing(false);
      }
    }, 500);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isInitializing }}>
      {children}
    </AppContext.Provider>
  );
};
