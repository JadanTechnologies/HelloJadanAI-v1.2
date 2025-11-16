import React, { useState, useContext, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { AppContext } from '../../contexts/AppContext';
import { Payment, Campaign, PaymentGateway } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS } from './data';

const PaymentManagementPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const location = useLocation();

    // Pre-select a payment if linked from campaign page
    const paymentIdFromState = location.state?.paymentId;
    const initialSelected = state.payments.find(p => p.id === paymentIdFromState) || null;
    
    const [filter, setFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(initialSelected);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(!!initialSelected);

    const revenueByGateway = useMemo(() => {
        const revenueData = state.payments
            .filter(p => p.status === 'completed')
            .reduce((acc, payment) => {
                acc[payment.gateway] = (acc[payment.gateway] || 0) + payment.amount;
                return acc;
            }, {} as Record<PaymentGateway, number>);

        return Object.entries(revenueData).map(([name, revenue]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            revenue: parseFloat((revenue as number).toFixed(2)),
        }));
    }, [state.payments]);


    const handleOpenReview = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setSelectedPayment(null);
        setIsReviewModalOpen(false);
    };

    const handleApprove = () => {
        if (!selectedPayment) return;
        const updatedPayment: Payment = { ...selectedPayment, status: 'completed' };
        dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });

        const campaignToUpdate = state.campaigns.find(c => c.id === selectedPayment.campaignId);
        if (campaignToUpdate) {
            const updatedCampaign: Campaign = { ...campaignToUpdate, status: 'pending_review' };
            dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });
        }
        handleCloseReview();
    };
    
    const handleReject = () => {
        if (!selectedPayment) return;
        const updatedPayment: Payment = { ...selectedPayment, status: 'failed' };
        dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });
        // Optionally update campaign status to reflect failed payment
        handleCloseReview();
    };
    
    const filteredPayments = state.payments.filter(p => filter === 'all' || p.status === filter);

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
                <h1 className="text-3xl font-bold text-white">Payment Management</h1>
                <p className="text-slate-400 mt-1">Review and manage all campaign payments.</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Revenue by Gateway</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByGateway} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            cursor={{ fill: 'rgba(71, 85, 105, 0.3)' }}
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#cbd5e1' }}
                            itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Bar dataKey="revenue" name="Revenue (USD)" unit="$" radius={[4, 4, 0, 0]}>
                            {revenueByGateway.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'completed', 'failed'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${filter === f ? 'bg-brand-indigo text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th className="px-6 py-3">Campaign</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Gateway</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(p => (
                                <tr key={p.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <p>{p.campaignName}</p>
                                        <p className="text-xs text-slate-500">{p.companyName}</p>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-brand-cyan">${p.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 capitalize">{p.gateway}</td>
                                    <td className="px-6 py-4">{statusBadge(p.status)}</td>
                                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {p.gateway === 'manual' && p.status === 'pending' && (
                                            <Button variant="secondary" onClick={() => handleOpenReview(p)} className="py-1 px-2 text-xs">Review Proof</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredPayments.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No payments found for this filter.</p>
                    )}
                </div>
            </Card>

            {selectedPayment && (
                 <ReviewPaymentModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReview}
                    payment={selectedPayment}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

// --- Modal Component ---
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: Payment;
    onApprove: () => void;
    onReject: () => void;
}

const ReviewPaymentModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, payment, onApprove, onReject }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Review Payment for ${payment.campaignName}`}>
            <div className="space-y-4">
                 <div><h4 className="font-semibold text-slate-400">Amount</h4><p className="text-white text-lg font-bold">${payment.amount.toFixed(2)}</p></div>
                 <div><h4 className="font-semibold text-slate-400">Campaign</h4><Link to={`/admin/campaigns`} className="text-brand-cyan hover:underline">{payment.campaignName} by {payment.companyName}</Link></div>

                {payment.paymentProofUrl && (
                     <div>
                        <h4 className="font-semibold text-slate-400 mb-2">Payment Proof</h4>
                        <a href={payment.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                            <img src={payment.paymentProofUrl} alt="Payment Proof" className="max-w-full max-h-80 rounded-lg border border-slate-700" />
                        </a>
                     </div>
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end flex-wrap gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={onReject} className="!bg-red-600/50 hover:!bg-red-600">Reject</Button>
                <Button onClick={onApprove} className="!bg-green-600/50 hover:!bg-green-600">Approve</Button>
            </div>
        </Modal>
    );
};


export default PaymentManagementPage;
