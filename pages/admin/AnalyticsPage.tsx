import React from 'react';
import Card from '../../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsData, COLORS } from './data';

const AnalyticsPage = () => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400 mt-1">Key metrics and insights about the application.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Daily Active Users</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.dau}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Bar dataKey="users" fill="#4F46E5" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Generation Categories</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={analyticsData.categoryDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                            {analyticsData.categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                         <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    </div>
);

export default AnalyticsPage;