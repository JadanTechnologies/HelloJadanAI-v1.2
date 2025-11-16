import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import Card from '../../components/common/Card';
import { Payment } from '../../types';

const AdvertiserBillingPage = () => {
    const { state } = useContext(AppContext);
    const { t } = useTranslation();
    const { user, campaigns, payments } = state;

    const advertiserPayments = useMemo(() => {
        if (!user) return [];
        const campaignIds = campaigns.filter(c => c.advertiserId === user.id).map(c => c.id);
        return payments.filter(p => campaignIds.includes(p.campaignId));
    }, [campaigns, payments, user]);

    const statusBadge = (status: Payment['status']) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            completed: 'bg-green-500/20 text-green-400',
            failed: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('navBilling')}</h1>
                <p className="text-slate-400 mt-1">View your payment history.</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Payment History</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Campaign</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Gateway</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advertiserPayments.map(p => (
                                <tr key={p.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{p.campaignName}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-cyan">${p.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 capitalize">{p.gateway}</td>
                                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {advertiserPayments.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No payment history found.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdvertiserBillingPage;
