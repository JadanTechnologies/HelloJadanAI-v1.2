import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { mockCronJobs } from './data';
import { CronJob } from '../../types';

const CronJobPage = () => {
    const [jobs, setJobs] = useState<CronJob[]>(mockCronJobs);

    const handleRunNow = (jobId: string) => {
        console.log(`Manually triggering job ${jobId}`);
        // In a real app, this would make an API call.
        // For this demo, we'll just show an alert.
        const job = jobs.find(j => j.id === jobId);
        alert(`Triggering "${job?.name}" now.`);
    };
    
    const statusBadge = (status: CronJob['status']) => {
        const styles = {
            idle: 'bg-green-500/20 text-green-400',
            running: 'bg-blue-500/20 text-blue-400 animate-pulse',
            error: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Cron Job Monitor</h1>
                <p className="text-slate-400 mt-1">Monitor and manage scheduled system tasks.</p>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Job Name</th>
                                <th scope="col" className="px-6 py-3">Schedule</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Last Run</th>
                                <th scope="col" className="px-6 py-3">Next Run</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{job.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{job.schedule}</td>
                                    <td className="px-6 py-4">{statusBadge(job.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(job.lastRun).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(job.nextRun).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <Button variant="secondary" onClick={() => handleRunNow(job.id)} className="py-1 px-2 text-xs">Run Now</Button>
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

export default CronJobPage;