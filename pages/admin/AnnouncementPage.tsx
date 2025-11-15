import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { mockAnnouncements } from './data';
import { Announcement } from '../../types';

const AnnouncementPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const openModal = (announcement: Announcement | null) => {
        setEditingAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingAnnouncement(null);
        setIsModalOpen(false);
    };

    const handleSave = (data: Omit<Announcement, 'id'>) => {
        if (editingAnnouncement) {
            setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...data } : a));
        } else {
            const newAnnouncement: Announcement = { ...data, id: `an-${Date.now()}`};
            setAnnouncements([newAnnouncement, ...announcements]);
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        setAnnouncements(announcements.filter(a => a.id !== id));
    };
    
    const typeBadge = (type: Announcement['type']) => {
        const styles = {
            info: 'bg-cyan-500/20 text-cyan-400',
            success: 'bg-green-500/20 text-green-400',
            warning: 'bg-yellow-500/20 text-yellow-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[type]}`}>{type}</span>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Announcements</h1>
                <p className="text-slate-400 mt-1">Manage platform-wide announcements for users.</p>
            </div>
            
            <div className="text-right">
                <Button onClick={() => openModal(null)}>Create Announcement</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Message</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map(item => (
                                <tr key={item.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white">{item.message}</td>
                                    <td className="px-6 py-4">{typeBadge(item.type)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <Button variant="secondary" onClick={() => openModal(item)} className="py-1 px-2 text-xs">Edit</Button>
                                        <Button variant="secondary" onClick={() => handleDelete(item.id)} className="!bg-red-500/50 hover:!bg-red-500 py-1 px-2 text-xs">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AnnouncementModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} announcement={editingAnnouncement} />
        </div>
    );
};

interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Announcement, 'id'>) => void;
    announcement: Announcement | null;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSave, announcement }) => {
    const [message, setMessage] = useState(announcement?.message || '');
    const [type, setType] = useState<Announcement['type']>(announcement?.type || 'info');
    // FIX: Use nullish coalescing operator `??` to correctly handle `false` values for `isActive`. The `||` operator would incorrectly convert `false` to `true`.
    const [isActive, setIsActive] = useState(announcement?.isActive ?? true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ message, type, isActive, startDate: new Date().toISOString(), endDate: null });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={announcement ? 'Edit Announcement' : 'Create Announcement'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as Announcement['type'])} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white">
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                    </select>
                </div>
                 <div className="flex items-center">
                    <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} id="isActive" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-brand-indigo focus:ring-brand-indigo"/>
                    <label htmlFor="isActive" className="ml-2 text-sm text-slate-300">Set as active announcement</label>
                 </div>
                 <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AnnouncementPage;