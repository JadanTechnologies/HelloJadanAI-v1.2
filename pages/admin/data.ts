import { User } from '../../types';

export const mockUsers: User[] = [
    { id: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', isAdmin: true, tasksCompleted: 5, ip: '192.168.1.1', deviceInfo: 'Chrome on macOS' },
    { id: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', isAdmin: false, tasksCompleted: 12, ip: '10.0.0.5', deviceInfo: 'Safari on iOS' },
];

export const mockLoginDetails = [
    { id: 'log-1', date: new Date('2023-10-26T10:00:00Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-2', date: new Date('2023-10-26T09:30:00Z').toISOString(), ip: '203.0.113.55', device: 'Unknown', status: 'Failed' },
    { id: 'log-3', date: new Date('2023-10-25T15:12:45Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-4', date: new Date('2023-10-24T11:05:10Z').toISOString(), ip: '198.51.100.2', device: 'Firefox on Windows', status: 'Success' },
];

export const analyticsData = {
    dau: [
        { date: '2023-10-01', users: 120 }, { date: '2023-10-02', users: 150 }, { date: '2023-10-03', users: 130 }, { date: '2023-10-04', users: 180 },
    ],
    categoryDistribution: [
        { name: 'Image', value: 400 }, { name: 'Video', value: 150 }, { name: 'Ad', value: 250 },
    ],
    deviceDistribution: [
        { name: 'Desktop', value: 550 }, { name: 'Mobile', value: 450 },
    ],
};
export const COLORS = ['#4F46E5', '#22D3EE', '#8884d8'];