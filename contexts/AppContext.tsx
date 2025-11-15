import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, User, Generation, CreditTransaction, Task } from '../types';

const mockAdminUser: User = {
    id: 'user-1',
    username: 'Admin Jadan',
    email: 'admin@example.com',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    isAdmin: true,
    tasksCompleted: 5,
    ip: '192.168.1.1',
    deviceInfo: 'Chrome on macOS'
};

const mockRegularUser: User = {
    id: 'user-2',
    username: 'Jadan',
    email: 'jadan@example.com',
    avatar: 'https://picsum.photos/seed/jadan/100/100',
    isAdmin: false,
    tasksCompleted: 15,
    ip: '198.51.100.5',
    deviceInfo: 'Firefox on Windows'
};

const initialGenerations: Generation[] = [
    { id: 'gen-1', type: 'image', prompt: 'A futuristic city skyline', url: 'https://picsum.photos/seed/futuristic/512/512', createdAt: new Date().toISOString(), isFavorite: false, style: 'Realistic', resolution: 'HD' },
    { id: 'gen-2', type: 'video', prompt: 'A robot dancing in the rain', url: 'https://www.w3schools.com/html/mov_bbb.mp4', createdAt: new Date().toISOString(), isFavorite: true, style: 'Cinematic', duration: '10s' },
];

const initialTasks: Task[] = [
    { id: 'task-1', title: 'Daily Login', description: 'Log in every day to earn credits.', creditReward: 10, isCompleted: true, type: 'daily' },
    { id: 'task-2', title: 'Generate 1 Image', description: 'Create your first masterpiece.', creditReward: 5, isCompleted: false, type: 'daily' },
    { id: 'task-3', title: 'Share on Social Media', description: 'Share your creation with friends.', creditReward: 15, isCompleted: false, type: 'engagement' },
    { id: 'task-4', title: 'Complete Profile', description: 'Upload an avatar and set a username.', creditReward: 20, isCompleted: true, type: 'profile' },
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
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'UPDATE_CREDITS':
      return { ...state, credits: action.payload };
    case 'ADD_GENERATION':
      return { ...state, generations: [action.payload, ...state.generations] };
    case 'COMPLETE_TASK':
        const taskToComplete = state.tasks.find(t => t.id === action.payload);
        if (!taskToComplete || taskToComplete.isCompleted) return state;
        
        return {
            ...state,
            credits: state.credits + taskToComplete.creditReward,
            tasks: state.tasks.map(t => t.id === action.payload ? { ...t, isCompleted: true } : t),
            user: state.user ? { ...state.user, tasksCompleted: state.user.tasksCompleted + 1 } : null,
            creditHistory: [{ id: `tx-${Date.now()}`, description: `Task: ${taskToComplete.title}`, amount: taskToComplete.creditReward, date: new Date().toISOString()}, ...state.creditHistory]
        };
    case 'TOGGLE_FAVORITE':
      return { ...state, generations: state.generations.map(g => g.id === action.payload ? { ...g, isFavorite: !g.isFavorite } : g) };
    case 'DELETE_GENERATION':
      return { ...state, generations: state.generations.filter(g => g.id !== action.payload) };
    case 'ADD_CREDIT_TRANSACTION':
        return { ...state, creditHistory: [action.payload, ...state.creditHistory]}
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loginAsAdmin: (email: string, password: string) => boolean;
}>({
  state: initialState,
  dispatch: () => null,
  login: () => false,
  logout: () => {},
  loginAsAdmin: () => false,
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (email: string, password: string): boolean => {
    if (email === mockRegularUser.email && password === 'password') {
      dispatch({ type: 'LOGIN', payload: mockRegularUser });
      return true;
    }
    return false;
  };

  const loginAsAdmin = (email: string, password: string): boolean => {
    if (email === mockAdminUser.email && password === 'password') {
      dispatch({ type: 'LOGIN', payload: mockAdminUser });
      return true;
    }
    return false;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, loginAsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};