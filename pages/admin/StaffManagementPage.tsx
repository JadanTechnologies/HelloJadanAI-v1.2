import React, { useState, useContext } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { mockStaff, mockUsers } from './data';
import { StaffMember, StaffRole, User } from '../../types';
import { TrashIcon } from '../../constants';
import { AppContext } from '../../contexts/AppContext';

// Role Dropdown and Badge Components
const roleOptions: StaffRole[] = ['Admin', 'Moderator', 'Support'];

const RoleBadge: React.FC<{ role: StaffRole }> = ({ role }) => {
    const styles = {
        Admin: 'bg-red-500/20 text-red-400',
        Moderator: 'bg-yellow-500/20 text-yellow-400',
        Support: 'bg-blue-500/20 text-blue-400',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>{role}</span>;
};


// Main Component
const StaffManagementPage = () => {
    const { dispatch } = useContext(AppContext);
    const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

    const handleOpenModal = (staffMember: StaffMember | null) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };
    
    const handleOpenDeleteModal = (staffMember: StaffMember) => {
        setStaffToDelete(staffMember);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setEditingStaff(null);
        setIsModalOpen(false);
        setStaffToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleSave = (data: { username?: string, email?: string, password?: string, role: StaffRole, userId?: string }) => {
        if (editingStaff) {
            // Edit existing staff's role
            setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, role: data.role } : s));
        } else {
            // Add new staff by creating a new user
            const userId = `user-${Date.now()}`;
            const newUser: User = {
                id: userId,
                username: data.username!,
                email: data.email!,
                avatar: `https://picsum.photos/seed/${data.username}/100/100`,
                isAdmin: true, // All staff are admins for panel access
                tasksCompleted: 0,
                ip: 'N/A',
                deviceInfo: 'N/A',
                status: 'active',
                credits: 0,
                dataBalanceMB: 0,
                airtimeBalanceNGN: 0,
                referralCode: data.username!.toUpperCase(),
                referralStats: { count: 0, creditsEarned: 0 },
                fraudRisk: 'low',
                dailyGenerations: { image: 0, video: 0, ad: 0, lastReset: new Date().toISOString() },
            };

            // In a real app, an API call would handle this. We simulate by dispatching.
            dispatch({ type: 'ADD_USER', payload: newUser });
            mockUsers.push(newUser); // Add to mock data for persistence in this session

            const newStaff: StaffMember = {
                id: `staff-${Date.now()}`,
                userId: newUser.id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar,
                role: data.role,
            };
            setStaff([newStaff, ...staff]);
        }
        handleCloseModals();
    };
    
    const handleConfirmRemove = () => {
        if (!staffToDelete) return;
        setStaff(staff.filter(s => s.id !== staffToDelete.id));
        handleCloseModals();
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Staff Management</h1>
                <p className="text-slate-400 mt-1">Assign roles and manage platform staff members.</p>
            </div>

            <div className="text-right">
                <Button onClick={() => handleOpenModal(null)}>Add New Staff</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Staff Member</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map(member => (
                                <tr key={member.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <img className="w-8 h-8 rounded-full" src={member.avatar} alt={member.username} />
                                        <div>
                                            <span>{member.username}</span>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><RoleBadge role={member.role} /></td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="secondary" onClick={() => handleOpenModal(member)} className="py-1 px-2 text-xs">Edit Role</Button>
                                        <Button variant="secondary" onClick={() => handleOpenDeleteModal(member)} className="!bg-red-500/50 hover:!bg-red-500 py-1 px-2 text-xs">Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {staff.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No staff members assigned yet.</p>
                    )}
                </div>
            </Card>

            <StaffModal 
                isOpen={isModalOpen}
                onClose={handleCloseModals}
                onSave={handleSave}
                staff={editingStaff}
            />
            
            {staffToDelete && (
                <Modal isOpen={isDeleteModalOpen} onClose={handleCloseModals} title={`Remove ${staffToDelete.username}?`}>
                    <div className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20">
                            <TrashIcon className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
                        <p className="text-slate-400">This will remove their staff permissions. This action cannot be undone, but you can re-add them later.</p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
                            <Button onClick={handleConfirmRemove} className="!bg-red-600 hover:!bg-red-700">Confirm Remove</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

// Staff Form Modal Component
interface StaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { username?: string, email?: string, password?: string, role: StaffRole }) => void;
    staff: StaffMember | null;
}

const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, onSave, staff }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<StaffRole>(staff?.role || 'Support');
    
    React.useEffect(() => {
        if(staff) {
            setUsername(staff.username);
            setEmail(staff.email);
            setRole(staff.role);
        } else {
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('Support');
        }
    }, [staff, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ username, email, password, role });
    };

    const selectClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={staff ? `Edit Role for ${staff.username}` : 'Add New Staff'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {staff ? (
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">User</label>
                        <p className="p-2 bg-slate-900 rounded-md">{staff.username} ({staff.email})</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value as StaffRole)} className={selectClasses} required>
                        {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
};

export default StaffManagementPage;