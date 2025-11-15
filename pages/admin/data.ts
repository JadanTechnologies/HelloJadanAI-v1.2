import { User, Task, BrandingSettings, ContentSettings, TaskSubmission, ApiSettings, EmailTemplate, SmsTemplate, Announcement, CronJob, Referral, SystemSettings, AccessRestrictionRule, StaffMember, Campaign, Payment } from '../../types';
import { LOGO_DATA_URL } from '../../constants';

export const mockUsers: User[] = [
    { id: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', isAdmin: true, tasksCompleted: 5, ip: '192.168.1.1', deviceInfo: 'Chrome on macOS', status: 'active', credits: 150, referralCode: 'JADAN123', referredBy: undefined, referralStats: { count: 2, creditsEarned: 35 }, fraudRisk: 'low', location: { country: 'United States', region: 'New York', city: 'New York City' }, dailyGenerations: { image: 5, video: 1, ad: 2, lastReset: new Date().toISOString() } },
    { id: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', isAdmin: false, tasksCompleted: 12, ip: '10.0.0.5', deviceInfo: 'Safari on iOS', status: 'active', credits: 75, referralCode: 'ALEX456', referredBy: 'user-1', referralStats: { count: 0, creditsEarned: 0 }, fraudRisk: 'low', location: { country: 'Canada', region: 'Ontario', city: 'Toronto' }, dailyGenerations: { image: 10, video: 2, ad: 5, lastReset: new Date(Date.now() - 86400000).toISOString() } }, // Yesterday's reset
    { id: 'user-3', username: 'Sam', email: 'sam@temp-mail.org', avatar: 'https://picsum.photos/seed/sam/100/100', isAdmin: false, tasksCompleted: 2, ip: '172.16.0.10', deviceInfo: 'Edge on Windows', status: 'suspended', credits: 10, referralCode: 'SAM789', referredBy: 'user-1', referralStats: { count: 0, creditsEarned: 0 }, fraudRisk: 'high', location: { country: 'United Kingdom', region: 'England', city: 'London' }, dailyGenerations: { image: 1, video: 0, ad: 0, lastReset: new Date().toISOString() } },
    { id: 'user-4', username: 'BannedUser', email: 'banned@example.com', avatar: 'https://picsum.photos/seed/banned/100/100', isAdmin: false, tasksCompleted: 20, ip: '203.0.113.40', deviceInfo: 'Firefox on Linux', status: 'banned', credits: 0, referralCode: 'BANNED00', referredBy: undefined, referralStats: { count: 0, creditsEarned: 0 }, fraudRisk: 'high', location: { country: 'Nigeria', region: 'Lagos', city: 'Lagos' }, dailyGenerations: { image: 0, video: 0, ad: 0, lastReset: new Date().toISOString() } },
    { id: 'user-5', username: 'Newbie', email: 'newbie@example.com', avatar: 'https://picsum.photos/seed/newbie/100/100', isAdmin: false, tasksCompleted: 0, ip: '172.16.0.10', deviceInfo: 'Chrome on Android', status: 'active', credits: 20, referralCode: 'NEWBIE11', referredBy: 'user-2', referralStats: { count: 0, creditsEarned: 0 }, fraudRisk: 'medium', location: { country: 'Germany', region: 'Berlin', city: 'Berlin' }, dailyGenerations: { image: 0, video: 0, ad: 0, lastReset: new Date().toISOString() } },
];

export const mockLoginDetails = [
    { id: 'log-1', date: new Date('2023-10-26T10:00:00Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-2', date: new Date('2023-10-26T09:30:00Z').toISOString(), ip: '203.0.113.55', device: 'Unknown', status: 'Failed' },
    { id: 'log-3', date: new Date('2023-10-25T15:12:45Z').toISOString(), ip: '192.168.1.1', device: 'Chrome on macOS', status: 'Success' },
    { id: 'log-4', date: new Date('2023-10-24T11:05:10Z').toISOString(), ip: '198.51.100.2', device: 'Firefox on Windows', status: 'Success' },
];

export const mockTasks: Task[] = [
    { id: 'task-1', title: 'Daily Login', description: 'Log in every day to earn credits.', creditReward: 10, status: 'incomplete', type: 'daily' },
    { id: 'task-2', title: 'Generate 1 Image', description: 'Create your first masterpiece.', creditReward: 5, status: 'incomplete', type: 'daily' },
    { id: 'task-3', title: 'Share on Social Media', description: 'Share your creation with friends on X.', creditReward: 15, status: 'incomplete', type: 'social_share', targetUrl: 'https://x.com', requiresProof: true },
    { id: 'task-4', title: 'Complete Profile', description: 'Upload an avatar and set a username.', creditReward: 20, status: 'incomplete', type: 'profile' },
    { id: 'task-5', title: 'Subscribe to our YouTube', description: 'Get the latest news and tutorials.', creditReward: 25, status: 'incomplete', type: 'youtube_subscribe', targetUrl: 'https://youtube.com', requiresProof: true },
    { id: 'task-6', title: 'Download our Mobile App', description: 'Generate on the go!', creditReward: 50, status: 'incomplete', type: 'app_download', targetUrl: 'https://play.google.com', requiresProof: false }
];

export const mockTaskSubmissions: TaskSubmission[] = [
    { id: 'sub-1', userId: 'user-2', username: 'Alex', avatar: 'https://picsum.photos/seed/alex/100/100', taskId: 'task-3', taskTitle: 'Share on Social Media', proof: 'My username is @alex_shares', submittedAt: new Date().toISOString() },
    { id: 'sub-2', userId: 'user-3', username: 'Sam', avatar: 'https://picsum.photos/seed/sam/100/100', taskId: 'task-5', taskTitle: 'Subscribe to our YouTube', proof: 'My YouTube handle is SamStreams', submittedAt: new Date(Date.now() - 3600 * 1000).toISOString() },
];

export const mockBrandingSettings: BrandingSettings = {
    logoUrl: LOGO_DATA_URL,
    faviconUrl: null,
    hologramLogoUrl: LOGO_DATA_URL,
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

export const mockApiSettings: ApiSettings = {
  resend: { apiKey: '' },
  twilio: { accountSid: '', authToken: '', phoneNumber: '' },
  oneSignal: { appId: '', restApiKey: '' },
  ipLookup: { provider: 'Mock Service', apiKey: '' },
  aiProviders: {
    gemini: { apiKey: '' },
    dalle: { apiKey: '' },
    runway: { apiKey: '' },
  },
};

export const mockEmailTemplates: EmailTemplate[] = [
  { id: 'et-1', name: 'Welcome Email', subject: 'Welcome to HelloJadanAI!', body: 'Hi {{username}}, welcome aboard! We are excited to have you.' },
  { id: 'et-2', name: 'Password Reset', subject: 'Reset Your Password', body: 'Click here to reset your password: {{resetLink}}' },
];

export const mockSmsTemplates: SmsTemplate[] = [
  { id: 'st-1', name: 'Phone Verification', body: 'Your verification code is {{code}}.' },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'an-1', message: 'New Video Generation styles are now available! Check them out.', type: 'info', isActive: true, startDate: new Date().toISOString(), endDate: null },
  { id: 'an-2', message: 'We will be undergoing scheduled maintenance this Sunday from 2-3 AM UTC.', type: 'warning', isActive: false, startDate: new Date(Date.now() - 86400000 * 2).toISOString(), endDate: new Date(Date.now() - 86400000).toISOString() },
];

export const mockCronJobs: CronJob[] = [
  { id: 'cron-1', name: 'Daily Credit Reset', schedule: '0 0 * * *', status: 'idle', lastRun: new Date(Date.now() - 86400000).toISOString(), nextRun: new Date(Date.now() + 86400000).toISOString() },
  { id: 'cron-2', name: 'Weekly Inactive User Cleanup', schedule: '0 2 * * 0', status: 'idle', lastRun: new Date(Date.now() - 86400000 * 7).toISOString(), nextRun: new Date(Date.now() + 86400000 * 7).toISOString() },
  { id: 'cron-3', name: 'Sync Analytics Data', schedule: '*/30 * * * *', status: 'running', lastRun: new Date(Date.now() - 1800000).toISOString(), nextRun: new Date(Date.now() + 1800000).toISOString() },
];

export const mockStaff: StaffMember[] = [
    { id: 'staff-1', userId: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', role: 'Admin' },
    { id: 'staff-2', userId: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', role: 'Moderator' },
];

export const mockReferrals: Referral[] = [
    { id: 'ref-1', referrerId: 'user-1', referrerUsername: 'Jadan', refereeId: 'user-2', refereeUsername: 'Alex', status: 'task_completed', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'ref-2', referrerId: 'user-1', referrerUsername: 'Jadan', refereeId: 'user-3', refereeUsername: 'Sam', status: 'signed_up', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockCampaigns: Campaign[] = [
    {
        id: 'camp-1',
        companyName: 'Innovate Inc.',
        contactEmail: 'contact@innovate.com',
        productName: 'Synth AI Assistant',
        taskDescription: 'Sign up for early access to our new AI assistant and get a free trial.',
        targetUrl: 'https://innovate.com/signup',
        taskType: 'signup',
        budget: 500,
        cpa: 2.0,
        userCreditReward: 100,
        status: 'active',
        submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        imageUrl: 'https://picsum.photos/seed/innovate/200/200',
        paymentId: 'pay-1'
    },
    {
        id: 'camp-2',
        companyName: 'Gamerz United',
        contactEmail: 'ads@gamerzu.com',
        productName: 'CyberRonin 2088',
        taskDescription: 'Visit the official website for our upcoming game CyberRonin 2088.',
        targetUrl: 'https://cyberronin2088.com',
        taskType: 'visit_website',
        budget: 0,
        cpa: 0,
        userCreditReward: 0,
        status: 'pending_payment',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: 'https://picsum.photos/seed/gamerz/200/200',
        paymentId: 'pay-2'
    },
     {
        id: 'camp-3',
        companyName: 'EcoWear',
        contactEmail: 'partner@ecowear.com',
        productName: 'Sustainable Sneakers',
        taskDescription: 'Check out our new line of eco-friendly sneakers.',
        targetUrl: 'https://ecowear.com',
        taskType: 'visit_website',
        budget: 0,
        cpa: 1.0,
        userCreditReward: 50,
        status: 'completed',
        submittedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
        id: 'camp-4',
        companyName: 'DevTools Co.',
        contactEmail: 'info@devtools.com',
        productName: 'CodeSphere IDE',
        taskDescription: 'Pay and submit proof for our new CodeSphere IDE campaign.',
        targetUrl: 'https://codesphere.com',
        taskType: 'signup',
        budget: 0,
        cpa: 0,
        userCreditReward: 0,
        status: 'pending_review',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        paymentId: 'pay-3',
    }
];

export const mockPayments: Payment[] = [
    { id: 'pay-1', campaignId: 'camp-1', campaignName: 'Synth AI Assistant', companyName: 'Innovate Inc.', amount: 500, currency: 'USD', gateway: 'paystack', status: 'completed', transactionId: 'ps_123abc', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'pay-2', campaignId: 'camp-2', campaignName: 'CyberRonin 2088', companyName: 'Gamerz United', amount: 250, currency: 'USD', gateway: 'flutterwave', status: 'failed', transactionId: 'fw_456def', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'pay-3', campaignId: 'camp-4', campaignName: 'CodeSphere IDE', companyName: 'DevTools Co.', amount: 1000, currency: 'USD', gateway: 'manual', status: 'pending', paymentProofUrl: 'https://picsum.photos/seed/proof/400/300', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
];

const mockAccessRules: AccessRestrictionRule[] = [
    { id: 'rule-1', type: 'block', criteria: 'country', value: 'Nigeria' },
    { id: 'rule-2', type: 'block', criteria: 'ip', value: '203.0.113.40' },
];

export const mockSystemSettings: SystemSettings = {
    referralRewards: {
        signUp: 20,
        firstTask: 15,
    },
    fraudDetection: {
        blockTempEmails: true,
        maxSignupsPerIp: 3,
    },
    accessRestrictions: mockAccessRules,
    sponsoredTasksEnabled: true,
    dailyGenerationLimits: {
        image: 10,
        video: 2,
        ad: 5,
    },
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. We should be back online shortly. Thank you for your patience!',
    paymentGateways: {
        paystack: { enabled: true, publicKey: '', secretKey: '' },
        flutterwave: { enabled: true, publicKey: '', secretKey: '' },
        monnify: { enabled: false, apiKey: '', contractCode: '' },
        manual: {
            enabled: true,
            accountName: 'HelloJadan AI Inc.',
            accountNumber: '1234567890',
            bankName: 'Creative Bank',
            instructions: 'Please include your company name in the payment reference. After payment, upload your receipt.'
        }
    }
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