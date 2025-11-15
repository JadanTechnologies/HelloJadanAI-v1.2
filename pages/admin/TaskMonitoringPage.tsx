import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { mockTaskSubmissions } from './data';
import { TaskSubmission } from '../../types';

const TaskMonitoringPage = () => {
    const [submissions, setSubmissions] = useState<TaskSubmission[]>(mockTaskSubmissions);

    const handleApprove = (submissionId: string) => {
        const submission = submissions.find(s => s.id === submissionId);
        console.log(`Approving submission ${submissionId} for user ${submission?.userId}. Award credits and update task status.`);
        setSubmissions(current => current.filter(s => s.id !== submissionId));
    };
    
    const handleReject = (submissionId: string) => {
         console.log(`Rejecting submission ${submissionId}.`);
        setSubmissions(current => current.filter(s => s.id !== submissionId));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Task Monitoring</h1>
                <p className="text-slate-400 mt-1">Review and approve user task submissions to prevent fraud.</p>
            </div>
            <Card>
                {submissions.length > 0 ? (
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
                                {submissions.map(sub => (
                                    <tr key={sub.id} className="bg-slate-800 border-b border-slate-700">
                                        <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                            <img className="w-8 h-8 rounded-full" src={sub.avatar} alt={sub.username} />
                                            <span>{sub.username}</span>
                                        </td>
                                        <td className="px-6 py-4">{sub.taskTitle}</td>
                                        <td className="px-6 py-4 font-mono text-xs bg-slate-900 rounded-md p-2">{sub.proof}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(sub.submittedAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button onClick={() => handleApprove(sub.id)} className="!bg-green-600/50 hover:!bg-green-600 py-1 px-2 text-xs">Approve</Button>
                                            <Button onClick={() => handleReject(sub.id)} className="!bg-red-600/50 hover:!bg-red-600 py-1 px-2 text-xs">Reject</Button>
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
        </div>
    );
};

export default TaskMonitoringPage;