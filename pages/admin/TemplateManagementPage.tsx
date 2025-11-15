import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { mockEmailTemplates, mockSmsTemplates } from './data';
import { EmailTemplate, SmsTemplate } from '../../types';

type TemplateType = 'email' | 'sms';

const TemplateManagementPage = () => {
    const [activeTab, setActiveTab] = useState<TemplateType>('email');
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
    const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>(mockSmsTemplates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | SmsTemplate | null>(null);

    const openModal = (template: EmailTemplate | SmsTemplate | null) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setEditingTemplate(null);
        setIsModalOpen(false);
    };

    const handleSave = (data: any) => {
        if (activeTab === 'email') {
             if (editingTemplate) {
                setEmailTemplates(emailTemplates.map(t => t.id === editingTemplate.id ? { ...t, ...data } : t));
            } else {
                setEmailTemplates([{...data, id: `et-${Date.now()}`}, ...emailTemplates]);
            }
        } else {
            if (editingTemplate) {
                setSmsTemplates(smsTemplates.map(t => t.id === editingTemplate.id ? { ...t, ...data } : t));
            } else {
                setSmsTemplates([{...data, id: `st-${Date.now()}`}, ...smsTemplates]);
            }
        }
        closeModal();
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Template Management</h1>
                <p className="text-slate-400 mt-1">Create and manage Email and SMS templates.</p>
            </div>
            
            <div className="flex space-x-2 p-1 bg-slate-800 rounded-lg max-w-sm">
                <button onClick={() => setActiveTab('email')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'email' ? 'bg-brand-indigo text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Email Templates</button>
                <button onClick={() => setActiveTab('sms')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'sms' ? 'bg-brand-indigo text-white' : 'text-slate-300 hover:bg-slate-700'}`}>SMS Templates</button>
            </div>
            
            <div className="text-right">
                <Button onClick={() => openModal(null)}>Create New Template</Button>
            </div>

            <Card>
                {activeTab === 'email' && <EmailTemplateList templates={emailTemplates} onEdit={openModal} />}
                {activeTab === 'sms' && <SmsTemplateList templates={smsTemplates} onEdit={openModal} />}
            </Card>

            <TemplateModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} template={editingTemplate} type={activeTab} />
        </div>
    );
};

const EmailTemplateList: React.FC<{templates: EmailTemplate[], onEdit: (t: EmailTemplate) => void}> = ({templates, onEdit}) => (
    <div className="space-y-4">
        {templates.map(t => (
            <div key={t.id} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white">{t.name}</h3>
                    <Button variant="secondary" onClick={() => onEdit(t)} className="py-1 px-2 text-xs">Edit</Button>
                </div>
                <p className="text-sm text-slate-400 mt-1">Subject: {t.subject}</p>
            </div>
        ))}
    </div>
);

const SmsTemplateList: React.FC<{templates: SmsTemplate[], onEdit: (t: SmsTemplate) => void}> = ({templates, onEdit}) => (
     <div className="space-y-4">
        {templates.map(t => (
            <div key={t.id} className="p-4 bg-slate-900 rounded-lg">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white">{t.name}</h3>
                    <Button variant="secondary" onClick={() => onEdit(t)} className="py-1 px-2 text-xs">Edit</Button>
                </div>
                <p className="text-sm text-slate-400 mt-1 font-mono">{t.body}</p>
            </div>
        ))}
    </div>
);

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    template: EmailTemplate | SmsTemplate | null;
    type: TemplateType;
}

const TemplateModal: React.FC<TemplateModalProps> = ({isOpen, onClose, onSave, template, type}) => {
    const isEmail = type === 'email';
    const [name, setName] = useState(template?.name || '');
    const [subject, setSubject] = useState(isEmail ? (template as EmailTemplate)?.subject || '' : '');
    const [body, setBody] = useState(template?.body || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = isEmail ? { name, subject, body } : { name, body };
        onSave(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${template ? 'Edit' : 'Create'} ${isEmail ? 'Email' : 'SMS'} Template`}>
             <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Template Name</label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} required />
                 </div>
                 {isEmail && (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email Subject</label>
                        <Input type="text" value={subject} onChange={e => setSubject(e.target.value)} required />
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
                    <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono" required />
                    {/* FIX: Corrected the invalid JSX syntax used to display placeholder examples. */}
                    <p className="text-xs text-slate-500 mt-1">Use placeholders like {`{{username}}`} or {`{{resetLink}}`}.</p>
                 </div>
                 <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Template</Button>
                </div>
             </form>
        </Modal>
    )
}

export default TemplateManagementPage;
