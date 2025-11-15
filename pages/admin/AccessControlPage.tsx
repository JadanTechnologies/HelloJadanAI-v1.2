import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { SystemSettings, AccessRestrictionRule } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { TrashIcon } from '../../constants';

const AccessControlPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [rules, setRules] = useState<AccessRestrictionRule[]>(state.systemSettings.accessRestrictions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleDelete = (ruleId: string) => {
        const updatedRules = rules.filter(r => r.id !== ruleId);
        setRules(updatedRules);
        const updatedSettings: SystemSettings = {
            ...state.systemSettings,
            accessRestrictions: updatedRules,
        };
        dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', payload: updatedSettings });
    };

    const handleSave = (newRule: Omit<AccessRestrictionRule, 'id'>) => {
        const ruleWithId = { ...newRule, id: `rule-${Date.now()}` };
        const updatedRules = [...rules, ruleWithId];
        setRules(updatedRules);
        const updatedSettings: SystemSettings = {
            ...state.systemSettings,
            accessRestrictions: updatedRules,
        };
        dispatch({ type: 'UPDATE_SYSTEM_SETTINGS', payload: updatedSettings });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Access Control & Restrictions</h1>
                <p className="text-slate-400 mt-1">Define rules to allow or block users based on various criteria.</p>
            </div>
            
            <div className="text-right">
                <Button onClick={() => setIsModalOpen(true)}>Add New Rule</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Criteria</th>
                                <th scope="col" className="px-6 py-3">Value</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rules.map(rule => (
                                <tr key={rule.id} className="bg-slate-800 border-b border-slate-700">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${rule.type === 'block' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {rule.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{rule.criteria}</td>
                                    <td className="px-6 py-4 font-mono text-sm">{rule.value}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-500 hover:text-red-400">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {rules.length === 0 && (
                        <p className="text-center py-8 text-slate-500">No access control rules defined.</p>
                    )}
                </div>
            </Card>

            <RuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
        </div>
    );
};

const RuleModal: React.FC<{isOpen: boolean; onClose: () => void; onSave: (rule: Omit<AccessRestrictionRule, 'id'>) => void;}> = ({isOpen, onClose, onSave}) => {
    const [type, setType] = useState<'allow' | 'block'>('block');
    const [criteria, setCriteria] = useState<AccessRestrictionRule['criteria']>('country');
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ type, criteria, value });
        // Reset form
        setType('block');
        setCriteria('country');
        setValue('');
    };
    
    const selectClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-indigo";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Access Rule">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Action Type</label>
                        <select value={type} onChange={e => setType(e.target.value as any)} className={selectClasses}>
                            <option value="block">Block</option>
                            <option value="allow">Allow</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Criteria</label>
                        <select value={criteria} onChange={e => setCriteria(e.target.value as any)} className={selectClasses}>
                            <option value="country">Country</option>
                            <option value="region">Region</option>
                            <option value="os">Operating System</option>
                            <option value="browser">Browser</option>
                            <option value="device">Device Type</option>
                            <option value="ip">IP Address</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Value</label>
                    <Input 
                        type="text" 
                        value={value} 
                        onChange={e => setValue(e.target.value)} 
                        placeholder="e.g., Nigeria, iOS, 192.168.1.1"
                        required 
                    />
                    <p className="text-xs text-slate-500 mt-1">Value is case-insensitive. For OS/Browser, use values like 'Windows', 'macOS', 'Chrome', 'Firefox'. For Device, use 'Desktop' or 'Mobile'.</p>
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Rule</Button>
                </div>
            </form>
        </Modal>
    )
}

export default AccessControlPage;