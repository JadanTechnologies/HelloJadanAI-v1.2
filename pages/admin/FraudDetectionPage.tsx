import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { mockUsers } from './data';
import { User } from '../../types';

const FraudDetectionPage = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    
    // Filter for users who are suspended and have medium or high fraud risk
    const flaggedUsers = users.filter(u => u.status === 'suspended' && (u.fraudRisk === 'medium' || u.fraudRisk === 'high'));

    const getFlagReason = (user: User): string => {
        if (user.email.includes('@temp-mail.org')) {
            return "Used temporary email address.";
        }
        if (user.fraudRisk === 'medium') {
            return "Multiple signups from the same IP address.";
        }
        return "General suspicious activity detected.";
    };

    const handleApprove = (userId: string) => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'active', fraudRisk: 'low' } : u));
    };
    
    const handleConfirmSuspension = (userId: string) => {
        // This is just a UI confirmation, the user is already suspended.
        // In a real app, this might add a permanent flag or note.
        alert(`Suspension for user ${userId} confirmed.`);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Fraud Detection</h1>
                <p className="text-slate-400 mt-1">Review and manage accounts flagged for suspicious activity.</p>
            </div>
            
            <Card>
                {flaggedUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">IP Address</th>
                                    <th scope="col" className="px-6 py-3">Reason for Flag</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flaggedUsers.map(user => (
                                    <tr key={user.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                            <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.username} />
                                            <div>
                                                <span>{user.username}</span>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{user.ip}</td>
                                        <td className="px-6 py-4">{getFlagReason(user)}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button onClick={() => handleApprove(user.id)} className="!bg-green-600/50 hover:!bg-green-600 py-1 px-2 text-xs">Approve (Reactivate)</Button>
                                            <Button onClick={() => handleConfirmSuspension(user.id)} className="!bg-red-600/50 hover:!bg-red-600 py-1 px-2 text-xs">Confirm Suspension</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-white">No Flags!</h3>
                        <p className="text-slate-400 mt-2">There are no accounts currently flagged for suspicious activity.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FraudDetectionPage;