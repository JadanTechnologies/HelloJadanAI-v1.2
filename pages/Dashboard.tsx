import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { ImageIcon, VideoIcon, AdIcon } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Day 1', earned: 30, spent: 5 },
  { name: 'Day 2', earned: 20, spent: 25 },
  { name: 'Day 3', earned: 50, spent: 10 },
  { name: 'Day 4', earned: 15, spent: 0 },
  { name: 'Day 5', earned: 40, spent: 50 },
  { name: 'Day 6', earned: 25, spent: 5 },
];


const Dashboard = () => {
  const { state } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('dashboardTitle')}</h1>
        <p className="text-slate-400">Welcome back, {state.user?.username}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <h3 className="text-slate-400 font-medium">{t('yourCredits')}</h3>
          <p className="text-4xl font-bold text-brand-cyan">{state.credits}</p>
        </Card>
        <Card>
          <h3 className="text-slate-400 font-medium">{t('tasksCompleted')}</h3>
          <p className="text-4xl font-bold text-white">{state.user?.tasksCompleted}</p>
        </Card>
        <Card>
          <h3 className="text-slate-400 font-medium">{t('recentGenerations')}</h3>
          <p className="text-4xl font-bold text-white">{state.generations.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Credit Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Line type="monotone" dataKey="earned" stroke="#22D3EE" strokeWidth={2} name="Earned"/>
                <Line type="monotone" dataKey="spent" stroke="#4F46E5" strokeWidth={2} name="Spent" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
        
        <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">{t('quickActions')}</h3>
              <div className="space-y-3">
                <Link to="/app/generate-image">
                  <Button className="w-full justify-start"><ImageIcon className="w-5 h-5 mr-3"/>{t('generateImage')}</Button>
                </Link>
                 <Link to="/app/generate-video">
                  <Button className="w-full justify-start"><VideoIcon className="w-5 h-5 mr-3"/>{t('generateVideo')}</Button>
                </Link>
                 <Link to="/app/generate-ad">
                  <Button className="w-full justify-start"><AdIcon className="w-5 h-5 mr-3"/>{t('generateAd')}</Button>
                </Link>
              </div>
            </Card>
             <Card>
                <h3 className="text-lg font-semibold text-white mb-4">{t('dailyRewards')}</h3>
                <p className="text-slate-400 mb-4">Log in daily for bonus credits!</p>
                <Button className="w-full" variant="secondary">{t('claimReward')}</Button>
            </Card>
        </div>
      </div>
      
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">{t('recentGenerations')}</h3>
        {state.generations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {state.generations.slice(0, 6).map(gen => (
              <div key={gen.id} className="aspect-square rounded-lg overflow-hidden border-2 border-slate-700 hover:border-brand-cyan transition-all">
                {gen.type === 'video' ? (
                   <video src={gen.url} className="w-full h-full object-cover" />
                ) : (
                   <img src={gen.url} alt={gen.prompt} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">You haven't generated anything yet. Get started!</p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;