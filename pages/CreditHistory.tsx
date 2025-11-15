import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';

const CreditHistory = () => {
    const { state } = useContext(AppContext);
    const { t } = useTranslation();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('creditHistory')}</h1>
                <p className="text-slate-400 mt-1">Track your credit earnings and spending.</p>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.creditHistory.map(tx => (
                                <tr key={tx.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{tx.description}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
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

export default CreditHistory;
