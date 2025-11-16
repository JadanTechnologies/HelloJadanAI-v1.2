import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Role, Permission } from '../../types';
import { ALL_PERMISSIONS } from './data';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { TrashIcon } from '../../constants';

const RoleManagementPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { roles } = state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const handleOpenModal = (role: Role | null) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingRole(null);
        setIsModalOpen(false);
    };

    const handleSaveRole = (roleData: Omit<Role, 'id'>) => {
        const roleToSave: Role = editingRole
            ? { ...editingRole, ...roleData }
            : { ...roleData, id: `role-${Date.now()}` };
        
        dispatch({ type: 'ADD_OR_UPDATE_ROLE', payload: roleToSave });
        handleCloseModal();
    };

    const handleDeleteRole = (roleId: string) => {
        if (roleId === 'role-admin') {
            alert("The default Admin role cannot be deleted.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this role? This cannot be undone.")) {
            dispatch({ type: 'DELETE_ROLE', payload: roleId });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Roles & Permissions</h1>
                <p className="text-slate-400 mt-1">Define staff roles and assign specific permissions.</p>
            </div>
            <div className="text-right">
                <Button onClick={() => handleOpenModal(null)}>Create New Role</Button>
            </div>
            <Card>
                <div className="space-y-4">
                    {roles.map(role => (
                        <div key={role.id} className="p-4 bg-slate-900 rounded-lg flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-white text-lg">{role.name}</h3>
                                <p className="text-sm text-slate-400 mt-1">{role.description}</p>
                                <p className="text-xs text-brand-cyan mt-2">{role.permissions.length} permissions</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                                <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => handleOpenModal(role)}>Edit</Button>
                                <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={role.id === 'role-admin'}
                                    title={role.id === 'role-admin' ? "Cannot delete Admin role" : "Delete role"}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <RoleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRole}
                role={editingRole}
            />
        </div>
    );
};


interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (roleData: Omit<Role, 'id'>) => void;
    role: Role | null;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, role }) => {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [permissions, setPermissions] = useState<Permission[]>(role?.permissions || []);

    const groupedPermissions = useMemo(() => {
        // FIX: Explicitly type the accumulator in the `reduce` function for `groupedPermissions` to fix a TypeScript error where `perms.map` was called on an `unknown` type.
        return ALL_PERMISSIONS.reduce((acc: Record<string, (typeof ALL_PERMISSIONS)[number][]>, perm) => {
            const key = perm.category;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(perm);
            return acc;
        }, {});
    }, []);
    
    const handlePermissionChange = (permissionId: Permission, checked: boolean) => {
        setPermissions(prev =>
            checked ? [...prev, permissionId] : prev.filter(p => p !== permissionId)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, permissions });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Edit Role' : 'Create New Role'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role Name</label>
                    <Input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                    <Input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Permissions</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                            <div key={category}>
                                <h4 className="font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-2">{category}</h4>
                                <div className="space-y-2">
                                    {perms.map(perm => (
                                        <label key={perm.id} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={permissions.includes(perm.id)}
                                                onChange={e => handlePermissionChange(perm.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-brand-indigo focus:ring-brand-indigo"
                                            />
                                            <span className="text-sm text-slate-300">{perm.description}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Role</Button>
                </div>
            </form>
        </Modal>
    );
};

export default RoleManagementPage;
