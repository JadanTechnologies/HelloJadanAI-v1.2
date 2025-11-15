import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { RedemptionRequest } from '../types';
import { NETWORK_PROVIDERS, SignalIcon, PhoneIcon } from '../constants';

const RedemptionPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user } = state;
    const { t } = useTranslation();

    const [type, setType] = useState<'data' | 'airtime'>('data');
    const [amount, setAmount] = useState('');
    const [provider, setProvider] = useState(NETWORK_PROVIDERS[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    if (!user) return null;

    const balance = type === 'data' ? user.dataBalanceMB : user.airtimeBalanceNGN;
    const unit = type === 'data' ? 'MB' : 'NGN';
    const userRequests = state.redemptionRequests.filter(r => r.userId === user.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (numAmount > balance) {
            setError(`Insufficient balance. You only have ${balance} ${unit}.`);
            return;
        }
        if (!/^\d{10,14}$/.test(phoneNumber)) {
            setError('Please enter a valid phone number.');
            return;
        }

        const newRequest: RedemptionRequest = {
            id: `redeem-${Date.now()}`,
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            type,
            amount: numAmount,
            networkProvider: provider,
            phoneNumber,
            status: 'pending',
            requestedAt: new Date().toISOString(),
        };

        dispatch({ type: 'CREATE_REDEMPTION_REQUEST', payload: newRequest });

        // Reset form
        setAmount('');
        setPhoneNumber('');
    };
    
    const statusBadge = (status: RedemptionRequest['status']) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            completed: 'bg-green-500/20 text-green-400',
            rejected: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('redeemYourRewards')}</h1>
                <p className="text-slate-400 mt-1">{t('redeemSubtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="text-slate-400 font-medium">{t('dataBalance')}</h3>
                        <SignalIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-4xl font-bold text-white mt-2">{user.dataBalanceMB}<span className="text-lg ml-1">MB</span></p>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="text-slate-400 font-medium">{t('airtimeBalance')}</h3>
                        <PhoneIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-4xl font-bold text-white mt-2"><span className="text-lg mr-1">₦</span>{user.airtimeBalanceNGN.toFixed(2)}</p>
                </Card>
            </div>

            <Card>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('redemptionType')}</label>
                            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white">
                                <option value="data">{t('data')}</option>
                                <option value="airtime">{t('airtime')}</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('amountToRedeem')} ({unit})</label>
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('networkProvider')}</label>
                            <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white">
                                {NETWORK_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">{t('phoneNumber')}</label>
                            <Input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="08012345678" required />
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="pt-2">
                         <Button type="submit" className="w-full">{t('submitRequest')}</Button>
                    </div>
                 </form>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">{t('redemptionHistory')}</h2>
                 <div className="overflow-x-auto">
                    {userRequests.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Request</th>
                                    <th className="px-6 py-3">Details</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequests.map(req => (
                                    <tr key={req.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4">{new Date(req.requestedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-white capitalize">{req.type} - {req.type === 'data' ? `${req.amount}MB` : `₦${req.amount}`}</td>
                                        <td className="px-6 py-4">{req.networkProvider} - {req.phoneNumber}</td>
                                        <td className="px-6 py-4">{statusBadge(req.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">You have no redemption history.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default RedemptionPage;