import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Campaign } from '../../types';

const AdvertiserCampaignsPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation();
    const { user, campaigns, payments } = state;

    const advertiserCampaigns = useMemo(() => {
        if (!user) return [];
        return campaigns.filter(c => c.advertiserId === user.id);
    }, [campaigns, user]);

    const handleTogglePause = (campaign: Campaign) => {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        dispatch({ type: 'UPDATE_CAMPAIGN', payload: { ...campaign, status: newStatus } });
    };
    
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
                <h1 className="text-3xl font-bold text-white">{t('myCampaignsTitle')}</h1>
                <p className="text-slate-400 mt-1">Manage and track the performance of your campaigns.</p>
            </div>
            
            <div className="text-right">
                <Link to="/advertise"><Button>{t('createNewCampaign')}</Button></Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">Campaign</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Budget</th>
                                <th className="px-6 py-3">Spend</th>
                                <th className="px-6 py-3">Completed Actions</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advertiserCampaigns.map(c => {
                                const payment = payments.find(p => p.campaignId === c.id && p.status === 'completed');
                                const spend = (c.completedActions || 0) * c.cpa;

                                return (
                                    <tr key={c.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4 font-medium text-white">{c.productName}</td>
                                        <td className="px-6 py-4 capitalize">{statusBadge(c.status)}</td>
                                        <td className="px-6 py-4">${(payment?.amount || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4">${spend.toFixed(2)}</td>
                                        <td className="px-6 py-4">{c.completedActions || 0}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {(c.status === 'active' || c.status === 'paused') && (
                                                <Button 
                                                    onClick={() => handleTogglePause(c)} 
                                                    className="py-1 px-2 text-xs"
                                                    variant="secondary"
                                                >
                                                    {c.status === 'active' ? 'Pause' : 'Resume'}
                                                </Button>
                                            )}
                                             <Button variant="secondary" className="py-1 px-2 text-xs">Add Budget</Button>
                                        </td>
                                    </tr>
                                );
                            })}
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

export default AdvertiserCampaignsPage;
