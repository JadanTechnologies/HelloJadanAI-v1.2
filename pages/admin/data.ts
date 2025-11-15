import { User, Task, BrandingSettings, ContentSettings } from '../../types';

export const mockUsers: User[] = [
    { id: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', isAdmin: true, tasksCompleted: 5, ip: '192.168.1.1', deviceInfo: 'Chrome on macOS', status: 'active', credits: 150 },
    { id: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', isAdmin: false, tasksCompleted: 12, ip: '10.0.0.5', deviceInfo: 'Safari on iOS', status: 'active', credits: 75 },
    { id: 'user-3', username: 'Sam', email: 'sam@example.com', avatar: 'https://picsum.photos/seed/sam/100/100', isAdmin: false, tasksCompleted: 2, ip: '172.16.0.10', deviceInfo: 'Edge on Windows', status: 'suspended', credits: 10 },
    { id: 'user-4', username: 'BannedUser', email: 'banned@example.com', avatar: 'https://picsum.photos/seed/banned/100/100', isAdmin: false, tasksCompleted: 20, ip: '203.0.113.40', deviceInfo: 'Firefox on Linux', status: 'banned', credits: 0 },
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

export const mockBrandingSettings: BrandingSettings = {
    logoUrl: null,
    faviconUrl: null,
    hologramLogoUrl: null,
};

export const mockContentSettings: ContentSettings = {
    aboutUs: "HelloJadanAI is a revolutionary platform that empowers creativity through artificial intelligence. We believe that everyone should have access to powerful creative tools without financial barriers. Our unique task-to-earn model allows users to generate stunning images, videos, and ad creatives by completing simple tasks, earning credits to fuel their imagination.",
    contactUs: "For support, please email us at support@hellojadan.ai. For business inquiries, contact business@hellojadan.ai.",
    termsOfService: "Welcome to HelloJadanAI. By using our services, you agree to these terms. Please read them carefully. You must be at least 13 years old to use the service. You are responsible for your account and any activity on it. Do not use our service for any illegal or unauthorized purpose. We reserve the right to terminate accounts that violate these terms.",
    privacyPolicy: "Your privacy is important to us. This policy explains what information we collect and how we use it. We collect information you provide, such as your email address, and data about your usage of the service. This data is used to improve our platform and provide customer support. We do not sell your personal data to third parties.",
    faqs: [
        { id: 'faq-1', question: 'How do I earn credits?', answer: 'You can earn credits by completing tasks such as daily logins, watching ads, referring friends, and participating in special promotions. Check the "Earn Credits" page for all available tasks.' },
        { id: 'faq-2', question: 'Are the AI generations truly free?', answer: 'Yes! Our platform operates on a credits-based system. You use credits that you earn from tasks, not real money, to generate content.' },
        { id: 'faq-3', question: 'Can I use the generated images and videos commercially?', answer: 'Yes, all content you generate is yours to use for personal or commercial purposes, subject to our terms of service regarding acceptable use.' },
    ]
};


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