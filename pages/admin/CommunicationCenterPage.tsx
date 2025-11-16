import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { mockAnnouncements, mockEmailTemplates, mockSmsTemplates } from './data';
import { Announcement } from '../../types';

type CommunicationTab = 'broadcast' | 'email' | 'sms';

// FIX: Moved AnnouncementModal before CommunicationCenterPage to fix "used before defined" error.
interface AnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Announcement, 'id'>) => void;
    announcement: Announcement | null;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSave, announcement }) => {
    const [message, setMessage] = useState(announcement?.message || '');
    const [type, setType] = useState<Announcement['type']>(announcement?.type || 'info');
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

const CommunicationCenterPage = () => {
    const [activeTab, setActiveTab] = useState<CommunicationTab>('broadcast');
    
    // START: Logic migrated from AnnouncementPage.tsx
    const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const openAnnouncementModal = (announcement: Announcement | null) => {
        setEditingAnnouncement(announcement);
        setIsAnnouncementModalOpen(true);
    };

    const closeAnnouncementModal = () => {
        setEditingAnnouncement(null);
        setIsAnnouncementModalOpen(false);
    };

    const handleSaveAnnouncement = (data: Omit<Announcement, 'id'>) => {
        if (editingAnnouncement) {
            setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...editingAnnouncement, ...data } : a));
        } else {
            const newAnnouncement: Announcement = { ...data, id: `an-${Date.now()}`};
            setAnnouncements([newAnnouncement, ...announcements]);
        }
        closeAnnouncementModal();
    };

    const handleDeleteAnnouncement = (id: string) => {
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
    // END: Logic migrated from AnnouncementPage.tsx

    // START: New logic for Email/SMS
    const [emailRecipients, setEmailRecipients] = useState('all_users');
    const [emailSpecificRecipients, setEmailSpecificRecipients] = useState('');
    const [emailTemplate, setEmailTemplate] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const [smsRecipients, setSmsRecipients] = useState('all_users');
    const [smsSpecificRecipients, setSmsSpecificRecipients] = useState('');
    const [smsTemplate, setSmsTemplate] = useState('');
    const [smsBody, setSmsBody] = useState('');
    const [isSendingSms, setIsSendingSms] = useState(false);
    
    const handleEmailTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = mockEmailTemplates.find(t => t.id === templateId);
        if (template) {
            setEmailSubject(template.subject);
            setEmailBody(template.body);
        } else {
            setEmailSubject('');
            setEmailBody('');
        }
        setEmailTemplate(templateId);
    };
    
    const handleSmsTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        const template = mockSmsTemplates.find(t => t.id === templateId);
        if (template) {
            setSmsBody(template.body);
        } else {
            setSmsBody('');
        }
        setSmsTemplate(templateId);
    };

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingEmail(true);
        console.log("Sending Email:", { recipientType: emailRecipients, specificRecipients: emailSpecificRecipients, subject: emailSubject, body: emailBody });
        setTimeout(() => {
            alert('Email sent (simulated). Check console for details.');
            setIsSendingEmail(false);
        }, 1500);
    };

    const handleSendSms = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingSms(true);
        console.log("Sending SMS:", { recipientType: smsRecipients, specificRecipients: smsSpecificRecipients, body: smsBody });
        setTimeout(() => {
            alert('SMS sent (simulated). Check console for details.');
            setIsSendingSms(false);
        }, 1500);
    };

    // END: New logic for Email/SMS

    const TabButton: React.FC<{tab: CommunicationTab; label: string}> = ({ tab, label }) => (
      <button onClick={() => setActiveTab(tab)} className={`w-1/3 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-brand-indigo text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
        {label}
      </button>
    );

    const selectClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300";
    const textareaClasses = `${selectClasses} min-h-[120px]`;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Communication Center</h1>
                <p className="text-slate-400 mt-1">Send broadcasts, emails, and SMS messages to your users and staff.</p>
            </div>
            
            <div className="flex space-x-2 p-1 bg-slate-800 rounded-lg max-w-md">
                <TabButton tab="broadcast" label="Broadcasts"/>
                <TabButton tab="email" label="Email"/>
                <TabButton tab="sms" label="SMS"/>
            </div>
            
            {activeTab === 'broadcast' && (
                <div className="animate-fade-in-up">
                    <div className="text-right mb-4">
                        <Button onClick={() => openAnnouncementModal(null)}>Create Announcement</Button>
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
                                                <Button variant="secondary" onClick={() => openAnnouncementModal(item)} className="py-1 px-2 text-xs">Edit</Button>
                                                <Button variant="secondary" onClick={() => handleDeleteAnnouncement(item.id)} className="!bg-red-500/50 hover:!bg-red-500 py-1 px-2 text-xs">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    {/* FIX: Corrected component name from `AnnouncementModal` to `openAnnouncementModal` to match the function call */}
                    <AnnouncementModal isOpen={isAnnouncementModalOpen} onClose={closeAnnouncementModal} onSave={handleSaveAnnouncement} announcement={editingAnnouncement} />
                </div>
            )}

            {activeTab === 'email' && (
                <Card className="animate-fade-in-up">
                     <h2 className="text-xl font-bold text-white mb-4">Send Email</h2>
                    <form onSubmit={handleSendEmail} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Recipients</label>
                                <select value={emailRecipients} onChange={e => setEmailRecipients(e.target.value)} className={selectClasses}>
                                    <option value="all_users">All Users</option>
                                    <option value="all_staff">All Staff</option>
                                    <option value="specific">Specific Emails</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Use Template (Optional)</label>
                                <select value={emailTemplate} onChange={handleEmailTemplateChange} className={selectClasses}>
                                    <option value="">No Template</option>
                                    {mockEmailTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {emailRecipients === 'specific' && (
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Specific Emails (comma-separated)</label>
                                <Input type="text" value={emailSpecificRecipients} onChange={e => setEmailSpecificRecipients(e.target.value)} placeholder="user1@example.com, user2@example.com" />
                            </div>
                        )}
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                            <Input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
                            <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8} className={textareaClasses} required />
                            {/* FIX: Corrected invalid JSX syntax for displaying placeholder examples. */}
                            <p className="text-xs text-slate-500 mt-1">You can use placeholders like {`{{username}}`} in your body and subject.</p>
                        </div>
                        <div className="pt-2">
                            <Button type="submit" isLoading={isSendingEmail}>Send Email</Button>
                        </div>
                    </form>
                </Card>
            )}

            {activeTab === 'sms' && (
                 <Card className="animate-fade-in-up">
                    <h2 className="text-xl font-bold text-white mb-4">Send SMS</h2>
                    <form onSubmit={handleSendSms} className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Recipients</label>
                                <select value={smsRecipients} onChange={e => setSmsRecipients(e.target.value)} className={selectClasses}>
                                    <option value="all_users">All Users</option>
                                    <option value="all_staff">All Staff</option>
                                    <option value="specific">Specific Phone Numbers</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Use Template (Optional)</label>
                                <select value={smsTemplate} onChange={handleSmsTemplateChange} className={selectClasses}>
                                    <option value="">No Template</option>
                                    {mockSmsTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {smsRecipients === 'specific' && (
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Specific Numbers (comma-separated)</label>
                                <Input type="text" value={smsSpecificRecipients} onChange={e => setSmsSpecificRecipients(e.target.value)} placeholder="+1234567890, +1987654321" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                            <textarea value={smsBody} onChange={e => setSmsBody(e.target.value)} rows={4} className={textareaClasses} required />
                            {/* FIX: Corrected invalid JSX syntax for displaying placeholder examples. */}
                            <p className="text-xs text-slate-500 mt-1">Placeholders like {`{{username}}`} are supported. Be mindful of character limits.</p>
                        </div>
                        <div className="pt-2">
                            <Button type="submit" isLoading={isSendingSms}>Send SMS</Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default CommunicationCenterPage;