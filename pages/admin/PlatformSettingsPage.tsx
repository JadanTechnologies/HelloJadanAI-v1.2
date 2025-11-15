import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CREDIT_COSTS } from '../../constants';

const imageProviders = ['Gemini', 'DALL-E 3', 'Midjourney', 'Mock Service'];
const videoProviders = ['Veo (Google)', 'RunwayML', 'Pika', 'Sora', 'Mock Service'];

const initialProviders = {
    image: { primary: 'Gemini', fallback: 'Mock Service' },
    video: { primary: 'Veo (Google)', fallback: 'Mock Service' },
    ad: { primary: 'Gemini', fallback: 'Mock Service' },
};

const PlatformSettingsPage = () => {
    const [costs, setCosts] = useState(CREDIT_COSTS);
    const [providers, setProviders] = useState(initialProviders);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleCostChange = (type: 'image' | 'video' | 'ad', value: string) => {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue) && numericValue >= 0) {
            setCosts(prev => ({ ...prev, [type]: numericValue }));
        }
    };

     const handleProviderChange = (
      category: 'image' | 'video' | 'ad',
      type: 'primary' | 'fallback',
      value: string
    ) => {
      setProviders(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [type]: value,
        },
      }));
    };
    
    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);
        // Simulate API call
        setTimeout(() => {
            console.log("Saved new costs:", costs);
            console.log("Saved new providers:", providers);
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };
    
    const selectClasses = "mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300";

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
                <p className="text-slate-400 mt-1">Manage global settings for the application.</p>
            </div>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">Credit Costs Management</h2>
                <p className="text-slate-400 mb-6">Adjust the amount of credits required for each type of generation.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="image-cost" className="block text-sm font-medium text-slate-300">Image Generation Cost</label>
                        <input
                            id="image-cost"
                            type="number"
                            value={costs.image}
                            onChange={(e) => handleCostChange('image', e.target.value)}
                            className={selectClasses}
                        />
                    </div>
                     <div>
                        <label htmlFor="video-cost" className="block text-sm font-medium text-slate-300">Video Generation Cost</label>
                        <input
                            id="video-cost"
                            type="number"
                            value={costs.video}
                            onChange={(e) => handleCostChange('video', e.target.value)}
                            className={selectClasses}
                        />
                    </div>
                     <div>
                        <label htmlFor="ad-cost" className="block text-sm font-medium text-slate-300">Ad Creative Cost</label>
                        <input
                            id="ad-cost"
                            type="number"
                            value={costs.ad}
                             onChange={(e) => handleCostChange('ad', e.target.value)}
                            className={selectClasses}
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-white mb-4">API Provider Management</h2>
                <p className="text-slate-400 mb-6">Configure the primary and fallback AI services for content generation.</p>
                <div className="space-y-6">
                    {/* Image & Ads */}
                    <div>
                        <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Image & Ad Generation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="image-primary" className="block text-sm font-medium text-slate-300">Primary Provider</label>
                                <select id="image-primary" value={providers.image.primary} onChange={e => handleProviderChange('image', 'primary', e.target.value)} className={selectClasses}>
                                    {imageProviders.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                             </div>
                             <div>
                                <label htmlFor="image-fallback" className="block text-sm font-medium text-slate-300">Fallback Provider</label>
                                 <select id="image-fallback" value={providers.image.fallback} onChange={e => handleProviderChange('image', 'fallback', e.target.value)} className={selectClasses}>
                                    {imageProviders.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                             </div>
                        </div>
                    </div>
                    {/* Video */}
                     <div>
                        <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Video Generation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="video-primary" className="block text-sm font-medium text-slate-300">Primary Provider</label>
                                <select id="video-primary" value={providers.video.primary} onChange={e => handleProviderChange('video', 'primary', e.target.value)} className={selectClasses}>
                                    {videoProviders.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                             </div>
                             <div>
                                <label htmlFor="video-fallback" className="block text-sm font-medium text-slate-300">Fallback Provider</label>
                                 <select id="video-fallback" value={providers.video.fallback} onChange={e => handleProviderChange('video', 'fallback', e.target.value)} className={selectClasses}>
                                    {videoProviders.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                             </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="pt-2 flex items-center space-x-4">
                <Button onClick={handleSave} isLoading={isSaving}>Save All Changes</Button>
                {saved && <p className="text-green-400 text-sm animate-fade-in-up">Settings saved successfully!</p>}
            </div>
        </div>
    );
};

export default PlatformSettingsPage;