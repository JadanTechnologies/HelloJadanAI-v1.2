import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CREDIT_COSTS } from '../../constants';

const PlatformSettingsPage = () => {
    const [costs, setCosts] = useState(CREDIT_COSTS);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleCostChange = (type: 'image' | 'video' | 'ad', value: string) => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setCosts(prev => ({ ...prev, [type]: numericValue }));
        }
    };
    
    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);
        // Simulate API call
        setTimeout(() => {
            console.log("Saved new costs:", costs);
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
                <p className="text-slate-400 mt-1">Manage global settings for the application.</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Credit Costs Management</h2>
                <p className="text-slate-400 mb-6">Adjust the amount of credits required for each type of generation.</p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="image-cost" className="block text-sm font-medium text-slate-300">Image Generation Cost</label>
                        <input
                            id="image-cost"
                            type="number"
                            value={costs.image}
                            onChange={(e) => handleCostChange('image', e.target.value)}
                            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        />
                    </div>
                     <div>
                        <label htmlFor="video-cost" className="block text-sm font-medium text-slate-300">Video Generation Cost</label>
                        <input
                            id="video-cost"
                            type="number"
                            value={costs.video}
                            onChange={(e) => handleCostChange('video', e.target.value)}
                            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        />
                    </div>
                     <div>
                        <label htmlFor="ad-cost" className="block text-sm font-medium text-slate-300">Ad Creative Cost</label>
                        <input
                            id="ad-cost"
                            type="number"
                            value={costs.ad}
                             onChange={(e) => handleCostChange('ad', e.target.value)}
                            className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                    <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                    {saved && <p className="text-green-400 text-sm">Settings saved successfully!</p>}
                </div>
            </Card>
        </div>
    );
};

export default PlatformSettingsPage;