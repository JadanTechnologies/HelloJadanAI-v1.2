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

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
        if (editingTask) {
            // Update existing task
            setTasks(currentTasks => currentTasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
        } else {
            // Create new task
            const newTask: Task = {
                ...taskData,
                id: `task-${Date.now()}`,
                isCompleted: false, // New tasks are never completed by default
            };
            setTasks(currentTasks => [newTask, ...currentTasks]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Task Management</h1>
                <p className="text-slate-400 mt-1">Create, edit, and manage tasks for users to earn credits.</p>
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
                                <th scope="col" className="px-6 py-3">Credit Reward</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                                    <td className="px-6 py-4 font-bold text-brand-cyan">+{task.creditReward}</td>
                                    <td className="px-6 py-4 capitalize">{task.type}</td>
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
    onSave: (taskData: Omit<Task, 'id' | 'isCompleted'>) => void;
    task: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [creditReward, setCreditReward] = useState(task?.creditReward || 10);
    const [type, setType] = useState<'daily' | 'engagement' | 'profile'>(task?.type || 'daily');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, creditReward, type });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <Input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        rows={3}
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="creditReward" className="block text-sm font-medium text-slate-300 mb-1">Credit Reward</label>
                    <Input id="creditReward" type="number" value={creditReward} onChange={e => setCreditReward(parseInt(e.target.value, 10))} required />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">Task Type</label>
                    <select
                        id="type"
                        value={type}
                        onChange={e => setType(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                    >
                        <option value="daily">Daily</option>
                        <option value="engagement">Engagement</option>
                        <option value="profile">Profile</option>
                    </select>
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