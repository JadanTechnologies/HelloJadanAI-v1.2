import React, { useState, useContext } from 'react';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockUsers } from './data';
import { User } from '../../types';
import { CreditIcon, ExclamationTriangleIcon, NoSymbolIcon, CheckCircleIcon, TrashIcon } from '../../constants';
import { AppContext } from '../../contexts/AppContext';

type BulkAction = 'suspend' | 'ban' | 'delete';

const UserManagementPage = () => {
    const { dispatch } = useContext(AppContext);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalAction, setModalAction] = useState<'credits' | 'suspend' | 'ban' | 'reactivate' | 'delete' | null>(null);
    const [creditAmount, setCreditAmount] = useState<number>(0);
    
    // State for bulk actions
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);
    const [bulkActionType, setBulkActionType] = useState<BulkAction | null>(null);

    const openModal = (user: User, action: typeof modalAction) => {
        setSelectedUser(user);
        setModalAction(action);
        setCreditAmount(0);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setModalAction(null);
        setIsBulkConfirmOpen(false);
        setBulkActionType(null);
    };

    const handleAction = () => {
        if (!selectedUser || !modalAction) return;

        switch (modalAction) {
            case 'credits':
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, credits: u.credits + creditAmount } : u));
                break;
            case 'suspend':
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'suspended' } : u));
                break;
            case 'ban':
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'banned' } : u));
                break;
            case 'reactivate':
                 setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'active' } : u));
                break;
            case 'delete':
                setUsers(users.filter(u => u.id !== selectedUser.id));
                break;
        }
        closeModal();
    };
    
    // Bulk Action Handlers
    const handleSelectUser = (userId: string, checked: boolean) => {
        setSelectedUserIds(prev => 
            checked ? [...prev, userId] : prev.filter(id => id !== userId)
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedUserIds(checked ? users.map(u => u.id) : []);
    };

    const handleBulkActionClick = (action: BulkAction) => {
        setBulkActionType(action);
        setIsBulkConfirmOpen(true);
    };

    const handleConfirmBulkAction = () => {
        if (!bulkActionType) return;
        
        let newStatus: 'suspended' | 'banned' | 'active' | 'deleted' = bulkActionType === 'delete' ? 'deleted' : bulkActionType;

        if (bulkActionType === 'delete') {
            setUsers(users.filter(u => !selectedUserIds.includes(u.id)));
        } else {
            setUsers(users.map(u => selectedUserIds.includes(u.id) ? { ...u, status: bulkActionType } : u));
        }

        dispatch({ type: 'BULK_UPDATE_USER_STATUS', payload: { userIds: selectedUserIds, status: newStatus } });
        
        setSelectedUserIds([]);
        closeModal();
    };

    const statusBadge = (status: User['status']) => {
        const styles = {
            active: 'bg-green-500/20 text-green-400',
            suspended: 'bg-yellow-500/20 text-yellow-400',
            banned: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
    };
    
    const riskBadge = (risk: User['fraudRisk']) => {
        const styles = {
            low: 'bg-green-500/20 text-green-400',
            medium: 'bg-yellow-500/20 text-yellow-400',
            high: 'bg-red-500/20 text-red-400',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[risk]}`}>{risk} risk</span>;
    }

    const renderModalContent = () => {
        if (!selectedUser || !modalAction) return null;
        
        const actionDetails = {
            credits: { title: `Manage Credits for ${selectedUser.username}`, icon: <CreditIcon className="w-10 h-10 text-brand-cyan" />, buttonText: "Update Credits" },
            suspend: { title: `Suspend ${selectedUser.username}?`, icon: <ExclamationTriangleIcon className="w-10 h-10 text-yellow-400" />, buttonText: "Confirm Suspend" },
            ban: { title: `Ban ${selectedUser.username}?`, icon: <NoSymbolIcon className="w-10 h-10 text-red-400" />, buttonText: "Confirm Ban" },
            reactivate: { title: `Reactivate ${selectedUser.username}?`, icon: <CheckCircleIcon className="w-10 h-10 text-green-400" />, buttonText: "Confirm Reactivate" },
            delete: { title: `Delete ${selectedUser.username}?`, icon: <TrashIcon className="w-10 h-10 text-red-500" />, buttonText: "Confirm Delete" }
        }

        const currentAction = actionDetails[modalAction];

        return (
            <div className="text-center">
                <div className="mx-auto mb-4">{currentAction.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{currentAction.title}</h3>

                {modalAction === 'credits' && (
                     <div className="flex items-center justify-center space-x-2">
                        <Button variant="secondary" onClick={() => setCreditAmount(creditAmount - 50)}>-50</Button>
                        <Button variant="secondary" onClick={() => setCreditAmount(creditAmount - 10)}>-10</Button>
                        <Input type="number" value={creditAmount} onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)} className="w-32 text-center" />
                        <Button variant="secondary" onClick={() => setCreditAmount(creditAmount + 10)}>+10</Button>
                        <Button variant="secondary" onClick={() => setCreditAmount(creditAmount + 50)}>+50</Button>
                    </div>
                )}
                {modalAction !== 'credits' && <p className="text-slate-400">This action can be reversed, except for deletion. Are you sure?</p>}
                
                <div className="mt-6 flex justify-center space-x-4">
                    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    <Button onClick={handleAction}>{currentAction.buttonText}</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-slate-400 mt-1">View and manage platform users.</p>
            </div>
            <Card>
                {selectedUserIds.length > 0 && (
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 mb-4 flex items-center justify-between animate-fade-in-up">
                        <p className="text-sm font-semibold text-white">{selectedUserIds.length} user{selectedUserIds.length > 1 ? 's' : ''} selected</p>
                        <div className="space-x-2">
                             <Button onClick={() => handleBulkActionClick('suspend')} className="!bg-yellow-600/50 hover:!bg-yellow-600 py-1 px-2 text-xs">Suspend</Button>
                             <Button onClick={() => handleBulkActionClick('ban')} className="!bg-orange-600/50 hover:!bg-orange-600 py-1 px-2 text-xs">Ban</Button>
                             <Button onClick={() => handleBulkActionClick('delete')} className="!bg-red-600/50 hover:!bg-red-600 py-1 px-2 text-xs">Delete</Button>
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-brand-indigo focus:ring-brand-indigo"
                                        checked={selectedUserIds.length > 0 && selectedUserIds.length === users.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Fraud Risk</th>
                                <th scope="col" className="px-6 py-3">Location</th>
                                <th scope="col" className="px-6 py-3">Credits</th>
                                <th scope="col" className="px-6 py-3">Tasks</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={`bg-slate-800 border-b border-slate-700 ${selectedUserIds.includes(user.id) ? 'bg-brand-indigo/10' : ''}`}>
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-brand-indigo focus:ring-brand-indigo"
                                            checked={selectedUserIds.includes(user.id)}
                                            onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.username} />
                                        <div>
                                            <span>{user.username}</span>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{statusBadge(user.status)}</td>
                                    <td className="px-6 py-4 capitalize">{riskBadge(user.fraudRisk)}</td>
                                    <td className="px-6 py-4">{user.location?.country || 'N/A'}</td>
                                    <td className="px-6 py-4 font-semibold text-brand-cyan">{user.credits}</td>
                                    <td className="px-6 py-4">{user.tasksCompleted}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="secondary" onClick={() => openModal(user, 'credits')} className="py-1 px-2 text-xs">Manage Credits</Button>
                                        <Button variant="secondary" onClick={() => openModal(user, 'suspend')} className="py-1 px-2 text-xs" disabled={user.status !== 'active'}>Suspend</Button>
                                        <Button variant="secondary" onClick={() => openModal(user, 'ban')} className="py-1 px-2 text-xs" disabled={user.status === 'banned'}>Ban</Button>
                                        <Button variant="secondary" onClick={() => openModal(user, 'reactivate')} className="py-1 px-2 text-xs" disabled={user.status === 'active'}>Reactivate</Button>
                                        <Button variant="secondary" onClick={() => openModal(user, 'delete')} className="py-1 px-2 text-xs !bg-red-500/50 hover:!bg-red-500">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={!!modalAction} onClose={closeModal} title="Confirm Action">
                {renderModalContent()}
            </Modal>
            
            <Modal isOpen={isBulkConfirmOpen} onClose={closeModal} title={`Confirm Bulk Action: ${bulkActionType}`}>
                 <div className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
                    <p className="text-slate-400">You are about to <span className="font-bold text-white">{bulkActionType}</span> <span className="font-bold text-white">{selectedUserIds.length}</span> user(s). This action cannot be easily undone.</p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                        <Button onClick={handleConfirmBulkAction} className="!bg-red-600 hover:!bg-red-700">Confirm</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagementPage;