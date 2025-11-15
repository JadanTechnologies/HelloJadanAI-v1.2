import React, { useState, useContext } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { AppContext } from '../../contexts/AppContext';
import { RedemptionRequest } from '../../types';

const RedemptionManagementPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [filter, setFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState<RedemptionRequest | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleOpenReview = (request: RedemptionRequest) => {
        setSelectedRequest(request);
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setSelectedRequest(null);
        setIsReviewModalOpen(false);
    };

    const handleUpdateStatus = (status: 'completed' | 'rejected') => {
        if (!selectedRequest) return;
        dispatch({ type: 'UPDATE_REDEMPTION_STATUS', payload: { requestId: selectedRequest.id, status } });
        handleCloseReview();
    };
    
    const filteredRequests = state.redemptionRequests.filter(p => filter === 'all' || p.status === filter);

    const statusBadge = (status: RedemptionRequest['status']) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            completed: 'bg-green-500/20 text-green-400',
            rejected: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Redemption Requests</h1>
                <p className="text-slate-400 mt-1">Process user requests for data and airtime top-ups.</p>
            </div>

            <Card>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'completed', 'rejected'].map(f => (
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
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Request Details</th>
                                <th className="px-6 py-3">Phone Number</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(r => (
                                <tr key={r.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={r.avatar} alt={r.username} />
                                        <span>{r.username}</span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-brand-cyan capitalize">
                                        {r.type} - {r.type === 'data' ? `${r.amount}MB` : `₦${r.amount}`}
                                    </td>
                                    <td className="px-6 py-4 font-mono">{r.networkProvider} - {r.phoneNumber}</td>
                                    <td className="px-6 py-4">{statusBadge(r.status)}</td>
                                    <td className="px-6 py-4">{new Date(r.requestedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        {r.status === 'pending' && (
                                            <Button variant="secondary" onClick={() => handleOpenReview(r)} className="py-1 px-2 text-xs">Review</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredRequests.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No requests found for this filter.</p>
                    )}
                </div>
            </Card>

            {selectedRequest && (
                 <ReviewRequestModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReview}
                    request={selectedRequest}
                    onApprove={() => handleUpdateStatus('completed')}
                    onReject={() => handleUpdateStatus('rejected')}
                />
            )}
        </div>
    );
};

// --- Modal Component ---
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RedemptionRequest;
    onApprove: () => void;
    onReject: () => void;
}

const ReviewRequestModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, request, onApprove, onReject }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Review Request from ${request.username}`}>
            <div className="space-y-4">
                 <div className="p-4 bg-slate-900 rounded-lg text-center">
                    <p className="text-slate-400 text-sm">REQUESTING</p>
                    <p className="text-white text-3xl font-bold capitalize">{request.type}</p>
                    <p className="text-brand-cyan text-4xl font-bold">{request.type === 'data' ? `${request.amount}MB` : `₦${request.amount.toFixed(2)}`}</p>
                 </div>
                 <div className="p-4 bg-slate-900 rounded-lg text-center">
                    <p className="text-slate-400 text-sm">TO BE SENT TO</p>
                    <p className="text-white text-2xl font-bold">{request.phoneNumber}</p>
                    <p className="text-brand-cyan text-lg font-bold">{request.networkProvider}</p>
                 </div>
                 <p className="text-center text-slate-500 text-xs pt-4">By clicking "Approve", you confirm that you have manually sent the requested amount to the user's phone number.</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end flex-wrap gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={onReject} className="!bg-red-600/50 hover:!bg-red-600">Reject</Button>
                <Button onClick={onApprove} className="!bg-green-600/50 hover:!bg-green-600">Approve & Mark as Sent</Button>
            </div>
        </Modal>
    );
};


export default RedemptionManagementPage;