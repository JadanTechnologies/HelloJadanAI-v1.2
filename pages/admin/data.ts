import { User, Task } from '../../types';

export const mockUsers: User[] = [
    { id: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', isAdmin: true, tasksCompleted: 5, ip: '192.168.1.1', deviceInfo: 'Chrome on macOS' },
    { id: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', isAdmin: false, tasksCompleted: 12, ip: '10.0.0.5', deviceInfo: 'Safari on iOS' },
    { id: 'user-3', username: 'Sam', email: 'sam@example.com', avatar: 'https://picsum.photos/seed/sam/100/100', isAdmin: false, tasksCompleted: 2, ip: '172.16.0.10', deviceInfo: 'Edge on Windows' },
];

export const mockLoginDetails = [
    { id: 'log-1', date: new Date('2023-10-26T10:00:00Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-2', date: new Date('2023-10-26T09:30:00Z').toISOString(), ip: '203.0.113.55', device: 'Unknown', status: 'Failed' },
    { id: 'log-3', date: new Date('2023-10-25T15:12:45Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-4', date: new Date('2023-10-24T11:05:10Z').toISOString(), ip: '198.51.100.2', device: 'Firefox on Windows', status: 'Success' },
];

export const mockTasks: Task[] = [
    { id: 'task-1', title: 'Daily Login', description: 'Log in every day to earn credits.', creditReward: 10, isCompleted: false, type: 'daily' },
    { id: 'task-2', title: 'Generate 1 Image', description: 'Create your first masterpiece.', creditReward: 5, isCompleted: false, type: 'daily' },
    { id: 'task-3', title: 'Share on Social Media', description: 'Share your creation with friends.', creditReward: 15, isCompleted: false, type: 'engagement' },
    { id: 'task-4', title: 'Complete Profile', description: 'Upload an avatar and set a username.', creditReward: 20, isCompleted: false, type: 'profile' },
];


export const analyticsData = {
    dau: [
        { date: 'Day 1', users: 120 }, { date: 'Day 2', users: 150 }, { date: 'Day 3', users: 130 }, { date: 'Day 4', users: 180 }, { date: 'Day 5', users: 210 }, { date: 'Day 6', users: 190 }, { date: 'Day 7', users: 250 }
    ],
    categoryDistribution: [
        { name: 'Image', value: 400 }, { name: 'Video', value: 150 }, { name: 'Ad', value: 250 },
    ],
    deviceDistribution: [
        { name: 'Desktop', value: 550 }, { name: 'Mobile', value: 450 },
    ],
    kpis: {
        totalUsers: 1250,
        totalGenerations: 800,
        creditsSpent: 12500,
        tasksCompleted: 2300,
    }
};
export const COLORS = ['#4F46E5', '#22D3EE', '#8884d8'];