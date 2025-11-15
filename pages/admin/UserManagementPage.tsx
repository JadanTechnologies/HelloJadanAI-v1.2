import React from 'react';
import Card from '../../components/common/Card';
import { mockUsers } from './data';

const UserManagementPage = () => (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400 mt-1">View and manage platform users.</p>
        </div>
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Tasks</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.map(user => (
                            <tr key={user.id} className="bg-slate-800 border-b border-slate-700">
                                <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                    <img className="w-8 h-8 rounded-full" src={user.avatar} alt={user.username} />
                                    <span>{user.username}</span>
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.tasksCompleted}</td>
                                <td className="px-6 py-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                                <td className="px-6 py-4">
                                    <button className="font-medium text-brand-cyan hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

export default UserManagementPage;