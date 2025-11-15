import React, { useState, useContext } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { AppContext } from '../../contexts/AppContext';
import { Campaign } from '../../types';

const CampaignManagementPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [filter, setFilter] = useState('all');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleOpenReview = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsReviewModalOpen(true);
    };

    const handleCloseReview = () => {
        setSelectedCampaign(null);
        setIsReviewModalOpen(false);
    };

    const handleUpdateCampaign = (updatedCampaign: Campaign) => {
        dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });
        handleCloseReview();
    };
    
    const filteredCampaigns = state.campaigns.filter(c => filter === 'all' || c.status === filter);

    const statusBadge = (status: Campaign['status']) => {
        const styles = {
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
                <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
                <p className="text-slate-400 mt-1">Review, approve, and manage sponsored tasks from partners.</p>
            </div>

            <Card>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending_review', 'active', 'paused', 'completed', 'rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${filter === f ? 'bg-brand-indigo text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                            {f.replace('_', ' ')}
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
                                <th className="px-6 py-3">Budget (USD)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Submitted</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.map(c => (
                                <tr key={c.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <p>{c.productName}</p>
                                        <p className="text-xs text-slate-500">{c.companyName}</p>
                                    </td>
                                    <td className="px-6 py-4">${c.budget.toFixed(2)}</td>
                                    <td className="px-6 py-4">{statusBadge(c.status)}</td>
                                    <td className="px-6 py-4">{new Date(c.submittedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="secondary" onClick={() => handleOpenReview(c)} className="py-1 px-2 text-xs">View & Manage</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredCampaigns.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No campaigns found for this filter.</p>
                    )}
                </div>
            </Card>

            {selectedCampaign && (
                <ReviewCampaignModal
                    isOpen={isReviewModalOpen}
                    onClose={handleCloseReview}
                    campaign={selectedCampaign}
                    onUpdate={handleUpdateCampaign}
                />
            )}
        </div>
    );
};

// --- Modal Component ---
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
    onUpdate: (campaign: Campaign) => void;
}

const ReviewCampaignModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, campaign, onUpdate }) => {
    const [budget, setBudget] = useState(campaign.budget);
    const [cpa, setCpa] = useState(campaign.cpa);
    const [reward, setReward] = useState(campaign.userCreditReward);

    const handleUpdateStatus = (status: Campaign['status']) => {
        onUpdate({ ...campaign, status, budget, cpa, userCreditReward: reward });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage: ${campaign.productName}`}>
            <div className="space-y-4">
                <div><h4 className="font-semibold text-slate-400">Company</h4><p className="text-white">{campaign.companyName} ({campaign.contactEmail})</p></div>
                <div><h4 className="font-semibold text-slate-400">Target URL</h4><a href={campaign.targetUrl} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline">{campaign.targetUrl}</a></div>
                <div><h4 className="font-semibold text-slate-400">Task Description</h4><p className="p-2 bg-slate-800 rounded-md text-white">{campaign.taskDescription}</p></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Total Budget ($)</label>
                        <Input type="number" value={budget} onChange={e => setBudget(parseFloat(e.target.value) || 0)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Cost Per Action ($)</label>
                        <Input type="number" step="0.01" value={cpa} onChange={e => setCpa(parseFloat(e.target.value) || 0)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">User Reward (Credits)</label>
                        <Input type="number" value={reward} onChange={e => setReward(parseInt(e.target.value) || 0)} />
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end flex-wrap gap-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                {campaign.status !== 'rejected' && <Button onClick={() => handleUpdateStatus('rejected')} className="!bg-red-600/50 hover:!bg-red-600">Reject</Button>}
                {campaign.status === 'active' && <Button onClick={() => handleUpdateStatus('paused')} className="!bg-yellow-600/50 hover:!bg-yellow-600">Pause</Button>}
                {campaign.status === 'paused' && <Button onClick={() => handleUpdateStatus('active')}>Resume</Button>}
                {campaign.status === 'pending_review' && <Button onClick={() => handleUpdateStatus('active')} className="!bg-green-600/50 hover:!bg-green-600">Approve & Activate</Button>}
            </div>
        </Modal>
    );
};

export default CampaignManagementPage;