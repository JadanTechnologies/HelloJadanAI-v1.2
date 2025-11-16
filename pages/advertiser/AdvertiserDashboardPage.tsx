import React, { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Campaign } from '../../types';
import { CurrencyDollarIcon, BriefcaseIcon, CheckCircleIcon } from '../../constants';

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <Card>
        <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-400">{title}</h4>
            <div className="text-slate-500">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </Card>
);

const AdvertiserDashboardPage = () => {
    const { state } = useContext(AppContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, campaigns, payments } = state;

    const advertiserCampaigns = useMemo(() => {
        if (!user) return [];
        return campaigns.filter(c => c.advertiserId === user.id);
    }, [campaigns, user]);

    const advertiserPayments = useMemo(() => {
        const campaignIds = advertiserCampaigns.map(c => c.id);
        return payments.filter(p => campaignIds.includes(p.campaignId) && p.status === 'completed');
    }, [payments, advertiserCampaigns]);

    const totalSpend = advertiserPayments.reduce((sum, p) => sum + p.amount, 0);
    const activeCampaigns = advertiserCampaigns.filter(c => c.status === 'active').length;
    const completedActions = advertiserCampaigns.reduce((sum, c) => sum + (c.completedActions || 0), 0);
    
    const statusBadge = (status: Campaign['status']) => {
        const styles = {
            pending_payment: 'bg-orange-500/20 text-orange-400',
            pending_review: 'bg-yellow-500/20 text-yellow-400',
            active: 'bg-green-500/20 text-green-400',
            paused: 'bg-slate-500/20 text-slate-400',
            completed: 'bg-blue-500/20 text-blue-400',
            rejected: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status.replace('_', ' ')}</span>;
    };


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('advertiserDashboardTitle')}</h1>
                <p className="text-slate-400 mt-1">Welcome back, {user?.username}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard title={t('totalSpend')} value={`$${totalSpend.toFixed(2)}`} icon={<CurrencyDollarIcon className="w-6 h-6 text-green-500"/>} />
                <KPICard title={t('activeCampaigns')} value={activeCampaigns} icon={<BriefcaseIcon className="w-6 h-6 text-brand-cyan"/>} />
                <KPICard title={t('completedActions')} value={completedActions} icon={<CheckCircleIcon className="w-6 h-6 text-blue-400"/>} />
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">{t('recentCampaigns')}</h2>
                    <Link to="/advertise"><Button>{t('createNewCampaign')}</Button></Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">Campaign Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Spend</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advertiserCampaigns.slice(0, 5).map(c => {
                                const spend = payments.find(p => p.campaignId === c.id)?.amount || 0;
                                return (
                                <tr key={c.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{c.productName}</td>
                                    <td className="px-6 py-4 capitalize">{statusBadge(c.status)}</td>
                                    <td className="px-6 py-4">${spend.toFixed(2)}</td>
                                    <td className="px-6 py-4"><Button variant="secondary" onClick={() => navigate('/advertiser/campaigns')} className="py-1 px-2 text-xs">View Details</Button></td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    {advertiserCampaigns.length === 0 && (
                        <p className="text-center py-8 text-slate-500">You haven't created any campaigns yet.</p>
                    )}
                </div>
            </Card>

        </div>
    );
};

export default AdvertiserDashboardPage;