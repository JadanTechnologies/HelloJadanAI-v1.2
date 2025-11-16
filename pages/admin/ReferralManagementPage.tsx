import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { mockReferrals, mockUsers } from './data';
import { Referral } from '../../types';

const ReferralManagementPage = () => {
    const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Referral Management</h1>
                <p className="text-slate-400 mt-1">Monitor all referral activity on the platform.</p>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Referrer</th>
                                <th scope="col" className="px-6 py-3">Referred User</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map(ref => {
                                const referrer = mockUsers.find(u => u.id === ref.referrerId);
                                return (
                                <tr key={ref.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{referrer?.username || 'Unknown'}</td>
                                    <td className="px-6 py-4 font-medium text-white">{ref.refereeUsername}</td>
                                    <td className="px-6 py-4">{new Date(ref.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {ref.status === 'task_completed' ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">First Task Completed</span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400">Signed Up</span>
                                        )}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ReferralManagementPage;