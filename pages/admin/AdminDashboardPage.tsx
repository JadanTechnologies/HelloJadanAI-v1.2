import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsData, COLORS, mockUsers } from './data';
import { AppContext } from '../../contexts/AppContext';
import { UsersIcon, BriefcaseIcon, ArrowUpRightIcon, ArrowDownRightIcon, ScaleIcon, CheckCircleIcon, ClockIcon } from '../../constants';

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; onClick?: () => void }> = ({ title, value, icon, onClick }) => (
    <Card className={onClick ? 'cursor-pointer transition-all hover:-translate-y-1 hover:shadow-brand-cyan/20' : ''} onClick={onClick}>
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-400">{title}</h4>
            <div className="text-slate-500">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </Card>
);

const AdminDashboardPage = () => {
    const { state } = useContext(AppContext);
    const navigate = useNavigate();
    const { campaigns, payments } = state;

    // Advertiser & Revenue Analytics Calculations
    const totalAdvertisers = new Set(campaigns.map(c => c.companyName)).size;
    const activeAdvertisers = new Set(campaigns.filter(c => c.status === 'active').map(c => c.companyName)).size;
    const totalCampaigns = campaigns.length;

    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    const totalCost = campaigns.reduce((sum, c) => sum + (c.completedActions || 0) * c.cpa, 0);
    const totalProfit = totalRevenue - totalCost;

    const completedTasks = campaigns.reduce((sum, c) => sum + (c.completedActions || 0), 0);

    const pendingTasks = campaigns
        .filter(c => c.status === 'active' && c.cpa > 0)
        .reduce((sum, c) => {
            const maxActions = Math.floor(c.budget / c.cpa);
            const remaining = maxActions - (c.completedActions || 0);
            return sum + (remaining > 0 ? remaining : 0);
        }, 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-400 mt-1">At-a-glance overview of the platform's performance.</p>
            </div>
            
            <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4">Advertiser & Revenue Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KPICard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<ArrowUpRightIcon className="w-6 h-6 text-green-500"/>} onClick={() => navigate('/admin/payments')} />
                 <KPICard title="Total Costs" value={`$${totalCost.toFixed(2)}`} icon={<ArrowDownRightIcon className="w-6 h-6 text-red-500"/>} onClick={() => navigate('/admin/campaigns')} />
                 <KPICard title="Total Profit" value={`$${totalProfit.toFixed(2)}`} icon={<ScaleIcon className="w-6 h-6 text-brand-cyan"/>} onClick={() => navigate('/admin/payments')} />
                 <KPICard title="Advertisers" value={`${activeAdvertisers} / ${totalAdvertisers}`} icon={<UsersIcon className="w-6 h-6"/>} onClick={() => navigate('/admin/campaigns')} />
                 <KPICard title="Total Campaigns" value={totalCampaigns} icon={<BriefcaseIcon className="w-6 h-6"/>} onClick={() => navigate('/admin/campaigns')} />
                 <KPICard title="Completed Tasks" value={completedTasks} icon={<CheckCircleIcon className="w-6 h-6"/>} onClick={() => navigate('/admin/campaigns')} />
                 <KPICard title="Pending Tasks" value={pendingTasks} icon={<ClockIcon className="w-6 h-6"/>} onClick={() => navigate('/admin/campaigns')} />
            </div>

            <h2 className="text-xl font-semibold text-white border-l-4 border-brand-cyan pl-4 pt-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Users" value={mockUsers.length} icon={<UsersIcon className="w-6 h-6" />} onClick={() => navigate('/admin/users')} />
                <KPICard title="Total Generations" value={analyticsData.kpis.totalGenerations} icon={<BriefcaseIcon className="w-6 h-6" />} />
                <KPICard title="Credits Spent" value={analyticsData.kpis.creditsSpent} icon={<ArrowDownRightIcon className="w-6 h-6 text-red-500" />} />
                <KPICard title="Tasks Completed" value={analyticsData.kpis.tasksCompleted} icon={<CheckCircleIcon className="w-6 h-6" />} onClick={() => navigate('/admin/task-monitoring')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-white mb-4">Daily Active Users</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.dau}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Bar dataKey="users" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-4">Generation Categories</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={analyticsData.categoryDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                                {analyticsData.categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboardPage;