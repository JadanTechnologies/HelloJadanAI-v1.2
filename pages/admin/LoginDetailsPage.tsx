import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { mockLoginDetails } from './data';
import { LoginHistoryEntry } from '../../types';

const LoginDetailsPage = () => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState<LoginHistoryEntry[]>(mockLoginDetails);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('loginHistory')}</h1>
                <p className="text-slate-400 mt-1">Track user login activity.</p>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Date & Time</th>
                                <th scope="col" className="px-6 py-3">IP Address</th>
                                <th scope="col" className="px-6 py-3">Device / Browser</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={log.avatar} alt={log.username} />
                                        <div>
                                            <span>{log.username}</span>
                                            <p className="text-xs text-slate-500">{log.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{new Date(log.date).toLocaleString()}</td>
                                    <td className="px-6 py-4">{log.ip}</td>
                                    <td className="px-6 py-4">{log.device}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            log.status === 'Success' 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default LoginDetailsPage;