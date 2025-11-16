import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { SupportTicket, SupportTicketMessage } from '../../types';

const SupportManagementPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { supportTickets } = state;

    const [filter, setFilter] = useState<SupportTicket['status'] | 'all'>('open');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const filteredTickets = useMemo(() => {
        if (filter === 'all') return supportTickets;
        return supportTickets.filter(t => t.status === filter);
    }, [supportTickets, filter]);

    const statusBadge = (status: SupportTicket['status']) => {
        const styles = {
            open: 'bg-green-500/20 text-green-400',
            in_progress: 'bg-yellow-500/20 text-yellow-400',
            closed: 'bg-slate-500/20 text-slate-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status.replace('_', ' ')}</span>;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
                <p className="text-slate-400 mt-1">Manage and respond to user support requests.</p>
            </div>

            <Card>
                <div className="flex flex-wrap gap-2">
                    {(['all', 'open', 'in_progress', 'closed'] as const).map(f => (
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
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Last Updated</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={ticket.avatar} alt={ticket.username} />
                                        <span>{ticket.username}</span>
                                    </td>
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">{statusBadge(ticket.status)}</td>
                                    <td className="px-6 py-4">{new Date(ticket.lastUpdatedAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="secondary" onClick={() => setSelectedTicket(ticket)} className="py-1 px-2 text-xs">View Ticket</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTickets.length === 0 && <p className="text-center py-8 text-slate-500">No tickets match the current filter.</p>}
                </div>
            </Card>

            {selectedTicket && (
                <TicketModal
                    isOpen={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    ticket={selectedTicket}
                    adminUser={state.user}
                    dispatch={dispatch}
                />
            )}
        </div>
    );
};

interface TicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: SupportTicket;
    adminUser: any;
    dispatch: React.Dispatch<any>;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, ticket, adminUser, dispatch }) => {
    const [reply, setReply] = useState('');

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        const newMessage: SupportTicketMessage = {
            id: `msg-${Date.now()}`,
            authorId: adminUser.id,
            authorName: `${adminUser.username} (Support)`,
            avatar: adminUser.avatar,
            message: reply,
            createdAt: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_SUPPORT_TICKET_REPLY', payload: { ticketId: ticket.id, message: newMessage } });
        
        if (ticket.status === 'open') {
             dispatch({ type: 'UPDATE_SUPPORT_TICKET_STATUS', payload: { ticketId: ticket.id, status: 'in_progress' }});
        }
        setReply('');
    };

    const handleStatusChange = (status: SupportTicket['status']) => {
        dispatch({ type: 'UPDATE_SUPPORT_TICKET_STATUS', payload: { ticketId: ticket.id, status } });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Ticket: ${ticket.subject}`}>
            <div className="flex flex-col h-[70vh]">
                 <div className="border-b border-slate-700 pb-4 mb-4">
                     <p className="text-sm text-slate-400">From: {ticket.username}</p>
                     {ticket.relatedTaskTitle && <p className="text-sm text-slate-500">Related to: {ticket.relatedTaskTitle}</p>}
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {ticket.messages.map((msg: SupportTicketMessage) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.authorId === adminUser.id ? 'flex-row-reverse' : ''}`}>
                            <img src={msg.avatar} alt={msg.authorName} className="w-8 h-8 rounded-full" />
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.authorId === adminUser.id ? 'bg-brand-indigo text-white' : 'bg-slate-800 text-slate-200'}`}>
                                <p className="font-semibold text-sm">{msg.authorName}</p>
                                <p className="text-sm mt-1">{msg.message}</p>
                                <p className="text-xs opacity-60 mt-2 text-right">{new Date(msg.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {ticket.status !== 'closed' && (
                    <form onSubmit={handleReply} className="mt-4 pt-4 border-t border-slate-700">
                        <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} placeholder="Type your reply..." className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" />
                        <div className="mt-2 flex justify-between items-center">
                            <div className="space-x-2">
                                <Button type="button" onClick={() => handleStatusChange('in_progress')} variant="secondary" className="text-xs py-1 px-2 !bg-yellow-500/20 hover:!bg-yellow-500/40">Mark as In Progress</Button>
                                <Button type="button" onClick={() => handleStatusChange('closed')} variant="secondary" className="text-xs py-1 px-2 !bg-slate-600 hover:!bg-slate-500">Mark as Closed</Button>
                            </div>
                            <Button type="submit">Send Reply</Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default SupportManagementPage;
