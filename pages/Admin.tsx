import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockUsers: User[] = [
    { id: 'user-1', username: 'Jadan', email: 'jadan@example.com', avatar: 'https://picsum.photos/seed/jadan/100/100', isAdmin: true, tasksCompleted: 5, ip: '192.168.1.1', deviceInfo: 'Chrome on macOS' },
    { id: 'user-2', username: 'Alex', email: 'alex@example.com', avatar: 'https://picsum.photos/seed/alex/100/100', isAdmin: false, tasksCompleted: 12, ip: '10.0.0.5', deviceInfo: 'Safari on iOS' },
];

const analyticsData = {
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
const COLORS = ['#4F46E5', '#22D3EE', '#8884d8'];


const UserManagement = () => (
    <Card>
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
                <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">User</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Tasks</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {mockUsers.map(user => (
                        <tr key={user.id} className="bg-slate-800 border-b border-slate-700">
                            <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.username} />
                                <span>{user.username}</span>
                            </td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.tasksCompleted}</td>
                            <td className="px-6 py-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-brand-cyan hover:underline">Edit</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const AnalyticsDashboard = () => (
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
);


const Admin = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: t('userManagement') },
    { id: 'analytics', label: t('analytics') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('adminPanel')}</h1>
        <p className="text-slate-400 mt-1">Manage and monitor the application.</p>
      </div>

      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-indigo text-brand-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default Admin;
