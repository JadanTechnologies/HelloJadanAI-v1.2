import { User, Task, Campaign, Payment, RedemptionRequest, SupportTicket, CreditTransaction, Referral } from '../types';
import { mockUsers, mockTasks, mockCampaigns, mockPayments, mockRedemptionRequests, mockSupportTickets, mockReferrals, mockSystemSettings } from '../pages/admin/data';

// --- SIMULATED API LATENCY ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- AUTHENTICATION ---
export const apiLogin = async (email: string, password: string): Promise<{ success: true, user: User } | { success: false, message: string }> => {
    await delay(500);
    // In a real app, you would also check location/device restrictions here or on the backend.
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
        return { success: true, user };
    }
    return { success: false, message: "Invalid credentials. Please try again." };
};

export const apiSignup = async (data: { username: string; email: string; password: string; role: 'student' | 'content_creator' | 'startup' }): Promise<{ success: true, user: User } | { success: false, message: string }> => {
    await delay(750);
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
        return { success: false, message: "An account with this email already exists." };
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        username: data.username,
        email: data.email,
        avatar: `https://picsum.photos/seed/${data.username}/100/100`,
        isAdmin: false,
        role: data.role,
        tasksCompleted: 0,
        ip: '127.0.0.1',
        deviceInfo: 'Mock Browser',
        status: 'active',
        credits: 20, // Starting credits
        dataBalanceMB: 0,
        airtimeBalanceNGN: 0,
        referralCode: data.username.toUpperCase() + Math.floor(Math.random() * 1000),
        referralStats: { count: 0, creditsEarned: 0 },
        fraudRisk: 'low',
        location: { country: 'Unknown', region: 'Unknown', city: 'Unknown' },
        dailyGenerations: { image: 0, video: 0, ad: 0, social: 0, lastReset: new Date().toISOString() }
    };
    mockUsers.push(newUser);
    return { success: true, user: newUser };
};

export const apiFetchUserData = async (userId: string): Promise<{ tasks: Task[], campaigns: Campaign[], referrals: Referral[] } | null> => {
    await delay(800);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return null;

    // In a real app, this would be a single performant query to get user-related data.
    // For now, we filter the mock data.
    const nonStudent = user.role === 'content_creator' || user.role === 'startup';
    const availableSystemTasks = nonStudent ? mockTasks.filter(t => t.rewardType === 'credits') : mockTasks;

    const activeCampaigns = mockSystemSettings.sponsoredTasksEnabled
        ? mockCampaigns.filter(c => c.status === 'active')
        : [];

    const sponsoredTasks: Task[] = activeCampaigns.map(c => ({
        id: c.id,
        title: c.productName,
        description: c.taskDescription,
        rewardAmount: c.userCreditReward,
        rewardType: 'credits',
        status: 'incomplete', // This would be user-specific in a real DB
        type: 'engagement',
        targetUrl: c.targetUrl,
        requiresProof: c.taskType === 'signup',
    }));

    const userReferrals = mockReferrals.filter(r => r.referrerId === userId);

    return {
        tasks: [...availableSystemTasks, ...sponsoredTasks],
        campaigns: mockCampaigns, // For now, return all campaigns for simplicity
        referrals: userReferrals
    };
};


// --- TASK & REWARD LOGIC ---
export const apiUpdateTaskStatus = async (
    taskId: string, 
    userId: string, 
    status: 'pending' | 'completed'
): Promise<{ 
    updatedUser: Partial<User>, 
    newTransaction?: CreditTransaction, 
    notification?: { message: string, type: 'success' | 'info' | 'warning' },
    updatedReferrals?: Referral[]
}> => {
    await delay(1000);
    const user = mockUsers.find(u => u.id === userId);
    const task = mockTasks.find(t => t.id === taskId);

    if (!user || !task) {
        throw new Error("User or Task not found");
    }

    if (status === 'pending') {
        // Just update task status, no rewards yet.
        // In a real DB, you'd update the user_tasks table.
        console.log(`Task ${taskId} for user ${userId} is now pending review.`);
        return { updatedUser: {} }; // No immediate user update
    }

    // --- Logic for 'completed' status ---
    const isFirstTaskCompletion = user.tasksCompleted === 0;
    
    let creditsUpdate = 0;
    let dataUpdate = 0;
    let airtimeUpdate = 0;
    let newTransaction: CreditTransaction | undefined = undefined;
    let notification: { message: string, type: 'success' | 'info' | 'warning' } | undefined = undefined;

    switch (task.rewardType) {
        case 'credits':
            creditsUpdate += task.rewardAmount;
            newTransaction = { id: `tx-${Date.now()}`, description: `Task: ${task.title}`, amount: task.rewardAmount, date: new Date().toISOString() };
            break;
        case 'data':
            dataUpdate += task.rewardAmount;
            notification = { message: `You earned ${task.rewardAmount}MB of data!`, type: 'success' };
            break;
        case 'airtime':
            airtimeUpdate += task.rewardAmount;
            notification = { message: `You earned NGN ${task.rewardAmount} in airtime!`, type: 'success' };
            break;
    }

    // Handle referral bonus for the referrer
    let updatedReferrals: Referral[] | undefined = undefined;
    if (isFirstTaskCompletion && user.referredBy) {
        const referrer = mockUsers.find(u => u.id === user.referredBy);
        if (referrer) {
            const referralBonus = mockSystemSettings.referralRewards.firstTask;
            referrer.credits += referralBonus;
            referrer.referralStats.creditsEarned += referralBonus;
            // In a real DB, you'd also add a credit transaction for the referrer.
            console.log(`Awarded ${referralBonus} credits to referrer ${referrer.id}`);

            // Update the referral record status
            const referral = mockReferrals.find(r => r.refereeId === userId && r.referrerId === referrer.id);
            if (referral) {
                referral.status = 'task_completed';
                updatedReferrals = [...mockReferrals]; // Simulate update
            }
        }
    }
    
    // Apply updates to the mock user
    user.tasksCompleted += 1;
    user.credits += creditsUpdate;
    user.dataBalanceMB += dataUpdate;
    user.airtimeBalanceNGN += airtimeUpdate;

    return {
        updatedUser: {
            tasksCompleted: user.tasksCompleted,
            credits: user.credits,
            dataBalanceMB: user.dataBalanceMB,
            airtimeBalanceNGN: user.airtimeBalanceNGN,
        },
        newTransaction,
        notification,
        updatedReferrals,
    };
};
