import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { mockTasks } from './data';
import { Task } from '../../types';

const TaskManagementPage = () => {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const openCreateModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };
    
    const handleDelete = (taskId: string) => {
        setTasks(currentTasks => currentTasks.filter(t => t.id !== taskId));
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'status'>) => {
        if (editingTask) {
            // Update existing task
            setTasks(currentTasks => currentTasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
        } else {
            // Create new task
            const newTask: Task = {
                ...taskData,
                id: `task-${Date.now()}`,
                status: 'incomplete',
            };
            setTasks(currentTasks => [newTask, ...currentTasks]);
        }
        setIsModalOpen(false);
    };
    
    const renderReward = (task: Task) => {
        switch (task.rewardType) {
            case 'credits': return `+${task.rewardAmount} Credits`;
            case 'data': return `+${task.rewardAmount} MB`;
            case 'airtime': return `+₦${task.rewardAmount}`;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Task Management</h1>
                <p className="text-slate-400 mt-1">Create, edit, and manage tasks for users to earn rewards.</p>
            </div>

            <div className="text-right">
                <Button onClick={openCreateModal}>Create New Task</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Reward</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Requires Proof?</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                                    <td className="px-6 py-4 font-bold text-brand-cyan">{renderReward(task)}</td>
                                    <td className="px-6 py-4 capitalize">{task.type.replace('_', ' ')}</td>
                                    <td className="px-6 py-4">{task.requiresProof ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => openEditModal(task)} className="font-medium text-brand-cyan hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(task.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && (
                <TaskFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTask}
                    task={editingTask}
                />
            )}
        </div>
    );
};

// Task Form Modal Component
interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<Task, 'id' | 'status'>) => void;
    task: Task | null;
}

const taskTypes: Task['type'][] = ['daily', 'engagement', 'profile', 'youtube_subscribe', 'social_follow', 'social_share', 'app_download'];
const rewardTypes: Task['rewardType'][] = ['credits', 'data', 'airtime'];

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [rewardAmount, setRewardAmount] = useState(task?.rewardAmount || 10);
    const [rewardType, setRewardType] = useState<Task['rewardType']>(task?.rewardType || 'credits');
    const [type, setType] = useState<Task['type']>(task?.type || 'daily');
    const [targetUrl, setTargetUrl] = useState(task?.targetUrl || '');
    const [requiresProof, setRequiresProof] = useState(task?.requiresProof || false);
    const [errors, setErrors] = useState<Partial<Record<keyof Omit<Task, 'id' | 'status'>, string>>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: Partial<Record<keyof Omit<Task, 'id' | 'status'>, string>> = {};
        if (!title.trim()) newErrors.title = 'Title cannot be empty.';
        if (!description.trim()) newErrors.description = 'Description cannot be empty.';
        if (rewardAmount <= 0) newErrors.rewardAmount = 'Reward must be a positive number.';

        if (requiresProof && !targetUrl.trim()) {
            newErrors.targetUrl = 'Target URL is required when manual verification is needed.';
        } else if (targetUrl.trim()) {
            try {
                // Simple URL validation
                new URL(targetUrl);
            } catch (_) {
                newErrors.targetUrl = 'Please enter a valid URL (e.g., https://example.com).';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSave({ title, description, rewardAmount, rewardType, type, targetUrl, requiresProof });
    };
    
    const selectClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <Input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        rows={3}
                    />
                    {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Reward Type</label>
                        <select value={rewardType} onChange={e => setRewardType(e.target.value as any)} className={selectClasses}>
                            {rewardTypes.map(rt => <option key={rt} value={rt} className="capitalize">{rt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Reward Amount</label>
                        <Input type="number" value={rewardAmount} onChange={e => setRewardAmount(parseInt(e.target.value, 10))} />
                        {errors.rewardAmount && <p className="text-red-400 text-xs mt-1">{errors.rewardAmount}</p>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Task Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className={selectClasses}>
                        {taskTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Target URL</label>
                    <Input type="url" placeholder="https://example.com" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} />
                    {errors.targetUrl && <p className="text-red-400 text-xs mt-1">{errors.targetUrl}</p>}
                </div>
                
                <div className="flex items-center">
                    <input
                        id="requiresProof"
                        type="checkbox"
                        checked={requiresProof}
                        onChange={(e) => setRequiresProof(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-brand-indigo focus:ring-brand-indigo"
                    />
                    <label htmlFor="requiresProof" className="ml-2 block text-sm text-slate-300">Requires Manual Verification</label>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Task</Button>
                </div>
            </form>
        </Modal>
    );
};


export default TaskManagementPage;