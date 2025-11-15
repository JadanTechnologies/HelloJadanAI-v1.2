import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Referral } from '../types';

const ReferralsPage = () => {
    const { state } = useContext(AppContext);
    const { user, referrals } = state;
    const [copied, setCopied] = useState(false);

    if (!user) {
        return null;
    }

    const referralLink = `https://hellojadan.ai/join?ref=${user.referralCode}`;
    const userReferrals = referrals.filter(r => r.referrerId === user.id);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Referral Program</h1>
                <p className="text-slate-400 mt-1">Invite friends and earn credits together!</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Your Referral Link</h2>
                <p className="text-slate-400 mb-4">Share this link with your friends. When they sign up, you'll earn credits. You'll get an extra bonus when they complete their first task!</p>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                    />
                    <Button onClick={handleCopy} className="w-full sm:w-auto">
                        {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                    <h3 className="text-slate-400 font-medium">Total Referrals</h3>
                    <p className="text-4xl font-bold text-brand-cyan mt-2">{user.referralStats.count}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-slate-400 font-medium">Successful Sign-ups</h3>
                    <p className="text-4xl font-bold text-white mt-2">{userReferrals.length}</p>
                </Card>
                 <Card className="text-center">
                    <h3 className="text-slate-400 font-medium">Credits Earned</h3>
                    <p className="text-4xl font-bold text-white mt-2">{user.referralStats.creditsEarned}</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Your Referral History</h2>
                <div className="overflow-x-auto">
                    {userReferrals.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Friend</th>
                                    <th scope="col" className="px-6 py-3">Date Joined</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userReferrals.map((ref: Referral) => (
                                    <tr key={ref.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4 font-medium text-white">{ref.refereeUsername}</td>
                                        <td className="px-6 py-4">{new Date(ref.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {ref.status === 'task_completed' ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">First Task Completed</span>
                                            ) : (
                                                 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400">Signed Up</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-slate-500 py-8">You haven't referred anyone yet. Share your link to get started!</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ReferralsPage;