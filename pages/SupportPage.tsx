import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { SupportTicket, SupportTicketMessage } from '../types';

const SupportPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation();
    const { user, supportTickets, tasks } = state;

    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [view, setView] = useState<'list' | 'create'>('list');

    const userTickets = useMemo(() => {
        if (!user) return [];
        return supportTickets.filter(t => t.userId === user.id);
    }, [supportTickets, user]);
    
    const statusBadge = (status: SupportTicket['status']) => {
        const styles = {
            open: 'bg-green-500/20 text-green-400',
            in_progress: 'bg-yellow-500/20 text-yellow-400',
            closed: 'bg-slate-500/20 text-slate-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status.replace('_', ' ')}</span>;
    };

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('supportTitle')}</h1>
                <p className="text-slate-400 mt-1">{t('supportSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">{t('myTickets')}</h2>
                            <Button onClick={() => { setView('create'); setSelectedTicket(null); }} className="text-sm py-1 px-2">{t('createTicket')}</Button>
                        </div>
                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            {userTickets.map(ticket => (
                                <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); setView('list'); }} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedTicket?.id === ticket.id ? 'bg-brand-indigo/20' : 'bg-slate-900 hover:bg-slate-800'}`}>
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-white truncate pr-2">{ticket.subject}</p>
                                        {statusBadge(ticket.status)}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Last update: {new Date(ticket.lastUpdatedAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {userTickets.length === 0 && <p className="text-slate-500 text-center py-4">No tickets found.</p>}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card className="min-h-[75vh] flex flex-col">
                        {view === 'create' && <CreateTicketForm user={user} tasks={tasks} dispatch={dispatch} onTicketCreated={(ticket) => { setSelectedTicket(ticket); setView('list'); }} />}
                        {view === 'list' && selectedTicket && <TicketConversation user={user} ticket={selectedTicket} dispatch={dispatch} />}
                        {view === 'list' && !selectedTicket && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                <p>Select a ticket to view the conversation or create a new one.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const CreateTicketForm = ({ user, tasks, dispatch, onTicketCreated }: any) => {
    const { t } = useTranslation();
    const [subject, setSubject] = useState('');
    const [relatedTaskId, setRelatedTaskId] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date().toISOString();
        const selectedTask = tasks.find((t:any) => t.id === relatedTaskId);

        const newMessage: SupportTicketMessage = {
            id: `msg-${Date.now()}`,
            authorId: user.id,
            authorName: user.username,
            avatar: user.avatar,
            message,
            createdAt: now,
        };

        const newTicket: SupportTicket = {
            id: `ticket-${Date.now()}`,
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            subject,
            relatedTaskId: selectedTask?.id,
            relatedTaskTitle: selectedTask?.title,
            status: 'open',
            createdAt: now,
            lastUpdatedAt: now,
            messages: [newMessage],
        };
        dispatch({ type: 'CREATE_SUPPORT_TICKET', payload: newTicket });
        onTicketCreated(newTicket);
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-4">{t('createTicket')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{t('ticketSubject')}</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{t('relatedTask')}</label>
                    <select value={relatedTaskId} onChange={e => setRelatedTaskId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white">
                        <option value="">{t('selectTask')}</option>
                        {tasks.map((task: any) => <option key={task.id} value={task.id}>{task.title}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">{t('yourMessage')}</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" required />
                </div>
                <div className="pt-2">
                    <Button type="submit" className="w-full">{t('submitTicket')}</Button>
                </div>
            </form>
        </div>
    );
};

const TicketConversation = ({ user, ticket, dispatch }: any) => {
    const { t } = useTranslation();
    const [reply, setReply] = useState('');

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        const newMessage: SupportTicketMessage = {
            id: `msg-${Date.now()}`,
            authorId: user.id,
            authorName: user.username,
            avatar: user.avatar,
            message: reply,
            createdAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_SUPPORT_TICKET_REPLY', payload: { ticketId: ticket.id, message: newMessage }});
        setReply('');
    };

    return (
        <div className="flex-1 flex flex-col h-full animate-fade-in-up">
            <div className="border-b border-slate-700 pb-4 mb-4">
                 <h2 className="text-xl font-bold text-white">{ticket.subject}</h2>
                 {ticket.relatedTaskTitle && <p className="text-sm text-slate-500">Related to: {ticket.relatedTaskTitle}</p>}
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {ticket.messages.map((msg: SupportTicketMessage) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.authorId === user.id ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.avatar} alt={msg.authorName} className="w-8 h-8 rounded-full" />
                        <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.authorId === user.id ? 'bg-brand-indigo text-white' : 'bg-slate-900 text-slate-200'}`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-60 mt-2 text-right">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {ticket.status !== 'closed' && (
                <form onSubmit={handleReply} className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                    <textarea value={reply} onChange={e => setReply(e.target.value)} rows={2} placeholder="Type your reply..." className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                    <Button type="submit">{t('sendMessage')}</Button>
                </form>
            )}
        </div>
    );
};

export default SupportPage;
