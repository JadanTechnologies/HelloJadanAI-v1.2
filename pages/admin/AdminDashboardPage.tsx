import React from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsData, COLORS } from './data';

const KPICard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Card>
        <h4 className="text-sm font-medium text-slate-400">{title}</h4>
        <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</p>
    </Card>
);

const AdminDashboardPage = () => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">At-a-glance overview of the platform's performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Total Users" value={analyticsData.kpis.totalUsers} />
            <KPICard title="Total Generations" value={analyticsData.kpis.totalGenerations} />
            <KPICard title="Credits Spent" value={analyticsData.kpis.creditsSpent} />
            <KPICard title="Tasks Completed" value={analyticsData.kpis.tasksCompleted} />
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

export default AdminDashboardPage;