import React, { useState, useContext } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { mockPendingTaskSubmissions, mockTaskSubmissionHistory } from './data';
import { TaskSubmission } from '../../types';
import { AppContext } from '../../contexts/AppContext';

// New Modal component for reviewing proof
interface ProofReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: (submissionId: string) => void;
    onReject: (submissionId: string) => void;
    submission: TaskSubmission | null;
}

const ProofReviewModal: React.FC<ProofReviewModalProps> = ({ isOpen, onClose, onApprove, onReject, submission }) => {
    if (!isOpen || !submission) return null;

    const isUrl = (text: string) => {
        try {
            const url = new URL(text);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Review Submission: ${submission.taskTitle}`}>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-slate-300">User</h4>
                    <div className="flex items-center space-x-2 mt-1">
                        <img src={submission.avatar} alt={submission.username} className="w-8 h-8 rounded-full" />
                        <span className="text-white">{submission.username}</span>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-300">Submitted Proof</h4>
                    <div className="mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg max-h-48 overflow-y-auto">
                        {isUrl(submission.proof) ? (
                            <a href={submission.proof} target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline break-all">{submission.proof}</a>
                        ) : (
                            <p className="text-white whitespace-pre-wrap break-words">{submission.proof}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end space-x-2">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => onReject(submission.id)} className="!bg-red-600/50 hover:!bg-red-600">Reject</Button>
                <Button onClick={() => onApprove(submission.id)} className="!bg-green-600/50 hover:!bg-green-600">Approve</Button>
            </div>
        </Modal>
    );
};


const TaskMonitoringPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { user: adminUser } = state;

    const [pendingSubmissions, setPendingSubmissions] = useState<TaskSubmission[]>(mockPendingTaskSubmissions);
    const [submissionHistory, setSubmissionHistory] = useState<TaskSubmission[]>(mockTaskSubmissionHistory);

    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null);

    const handleOpenProofModal = (submission: TaskSubmission) => {
        setSelectedSubmission(submission);
        setIsProofModalOpen(true);
    };

    const handleCloseProofModal = () => {
        setSelectedSubmission(null);
        setIsProofModalOpen(false);
    };

    const handleApprove = (submissionId: string) => {
        const submission = pendingSubmissions.find(s => s.id === submissionId);
        if (submission) {
            dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    message: `Your submission for "${submission.taskTitle}" has been approved!`,
                    type: 'success',
                }
            });
            dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: submission.taskId, userId: submission.userId, status: 'completed' } });
            
            const historyEntry: TaskSubmission = {
                ...submission,
                status: 'approved',
                reviewedBy: adminUser?.username,
                reviewedAt: new Date().toISOString(),
            };
            setSubmissionHistory(prev => [historyEntry, ...prev]);
        }
        setPendingSubmissions(current => current.filter(s => s.id !== submissionId));
        handleCloseProofModal();
    };
    
    const handleReject = (submissionId: string) => {
         const submission = pendingSubmissions.find(s => s.id === submissionId);
         if (submission) {
              dispatch({
                type: 'ADD_NOTIFICATION',
                payload: {
                    message: `Your submission for "${submission.taskTitle}" was rejected. Please review the task requirements.`,
                    type: 'warning',
                }
            });
            dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId: submission.taskId, userId: submission.userId, status: 'incomplete' } });

            const historyEntry: TaskSubmission = {
                ...submission,
                status: 'rejected',
                reviewedBy: adminUser?.username,
                reviewedAt: new Date().toISOString(),
            };
            setSubmissionHistory(prev => [historyEntry, ...prev]);
         }
        setPendingSubmissions(current => current.filter(s => s.id !== submissionId));
        handleCloseProofModal();
    };

    const statusBadge = (status: TaskSubmission['status']) => {
        const styles = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            approved: 'bg-green-500/20 text-green-400',
            rejected: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Task Monitoring</h1>
                <p className="text-slate-400 mt-1">Review and approve user task submissions to prevent fraud.</p>
            </div>
            <Card>
                 <h2 className="text-xl font-bold text-white mb-4">Pending Submissions</h2>
                {pendingSubmissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Task</th>
                                    <th scope="col" className="px-6 py-3">Submitted Proof</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingSubmissions.map(sub => (
                                    <tr key={sub.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                            <img className="w-8 h-8 rounded-full" src={sub.avatar} alt={sub.username} />
                                            <span>{sub.username}</span>
                                        </td>
                                        <td className="px-6 py-4">{sub.taskTitle}</td>
                                        <td className="px-6 py-4 font-mono text-xs bg-slate-900 rounded-md p-2 max-w-xs truncate">{sub.proof}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button onClick={() => handleOpenProofModal(sub)} className="py-1 px-2 text-xs">Review Proof</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-semibold text-white">All Clear!</h3>
                        <p className="text-slate-400 mt-2">There are no pending task submissions to review.</p>
                    </div>
                )}
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Submission History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Task</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Reviewed By</th>
                                <th scope="col" className="px-6 py-3">Reviewed At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissionHistory.map(sub => (
                                <tr key={sub.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{sub.username}</td>
                                    <td className="px-6 py-4">{sub.taskTitle}</td>
                                    <td className="px-6 py-4">{statusBadge(sub.status)}</td>
                                    <td className="px-6 py-4">{sub.reviewedBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sub.reviewedAt ? new Date(sub.reviewedAt).toLocaleString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {submissionHistory.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No submission history found.</p>
                    )}
                </div>
            </Card>


            <ProofReviewModal
                isOpen={isProofModalOpen}
                onClose={handleCloseProofModal}
                onApprove={handleApprove}
                onReject={handleReject}
                submission={selectedSubmission}
            />
        </div>
    );
};

export default TaskMonitoringPage;