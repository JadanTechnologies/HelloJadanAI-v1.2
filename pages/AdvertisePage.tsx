import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { AppContext } from '../contexts/AppContext';
import { Campaign } from '../types';

const AdvertisePage = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        companyName: '',
        contactEmail: '',
        productName: '',
        targetUrl: '',
        taskDescription: '',
    });
    
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formState, string>>>({});
    
    const validateUrl = (url: string): string | null => {
        if (!url.trim()) {
            return 'Target URL is required.';
        }

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
                return 'Please enter a valid URL with http:// or https://.';
            }

            const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
            if (ipRegex.test(parsedUrl.hostname)) {
                return 'For security reasons, direct IP addresses are not allowed in URLs.';
            }
            
            const shorteners = ['bit.ly', 't.co', 'goo.gl', 'tinyurl.com'];
            if (shorteners.includes(parsedUrl.hostname.replace('www.',''))) {
                return 'URL shorteners are not permitted. Please provide the direct link to the destination.';
            }

            if (!parsedUrl.hostname.includes('.')) {
                return 'The URL must contain a valid domain name.';
            }
        } catch (_) {
            return 'Please enter a valid URL format (e.g., https://example.com).';
        }

        return null;
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof typeof formState, string>> = {};

        if (!formState.companyName.trim()) newErrors.companyName = 'Company Name is required.';
        if (!formState.productName.trim()) newErrors.productName = 'Product Name is required.';
        if (!formState.taskDescription.trim()) newErrors.taskDescription = 'Task Description is required.';

        if (!formState.contactEmail.trim()) {
            newErrors.contactEmail = 'Contact Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formState.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address.';
        }
        
        const urlError = validateUrl(formState.targetUrl);
        if (urlError) {
            newErrors.targetUrl = urlError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }

        const campaignId = `camp-${Date.now()}`;
        const newCampaign: Campaign = {
            id: campaignId,
            ...formState,
            taskType: 'visit_website', // Default
            budget: 0,
            cpa: 0,
            userCreditReward: 0,
            status: 'pending_payment',
            submittedAt: new Date().toISOString(),
        };
        
        dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
        
        navigate(`/advertise/${campaignId}/pay`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
            <div className="w-full max-w-2xl">
                <Link to="/" className="flex items-center justify-center space-x-3 text-center mb-8">
                    {state.brandingSettings.logoUrl && <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-10 w-auto" />}
                    <h1 className="text-4xl font-bold text-white">Hello<span className="text-brand-cyan">Jadan</span>AI</h1>
                </Link>
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Advertise With Us</h2>
                        <p className="text-slate-400 mt-1">Submit your product for promotion. All submissions are subject to review.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                                <Input name="companyName" type="text" value={formState.companyName} onChange={handleChange} />
                                {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                                <Input name="contactEmail" type="email" value={formState.contactEmail} onChange={handleChange} />
                                {errors.contactEmail && <p className="text-red-400 text-xs mt-1">{errors.contactEmail}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Product / Service Name</label>
                            <Input name="productName" type="text" value={formState.productName} onChange={handleChange} />
                            {errors.productName && <p className="text-red-400 text-xs mt-1">{errors.productName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Target URL (Website, App Store, etc.)</label>
                            <Input name="targetUrl" type="url" placeholder="https://example.com" value={formState.targetUrl} onChange={handleChange} />
                            {errors.targetUrl && <p className="text-red-400 text-xs mt-1">{errors.targetUrl}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Task Description for Users</label>
                            <textarea
                                name="taskDescription"
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500"
                                placeholder="e.g., 'Sign up for our newsletter to get weekly tips!'"
                                value={formState.taskDescription}
                                onChange={handleChange}
                            ></textarea>
                            {errors.taskDescription && <p className="text-red-400 text-xs mt-1">{errors.taskDescription}</p>}
                        </div>
                        <div className="pt-2">
                            <Button type="submit" className="w-full">Proceed to Payment</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdvertisePage;