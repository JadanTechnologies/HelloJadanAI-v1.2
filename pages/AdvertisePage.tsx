import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { AppContext } from '../contexts/AppContext';
import { Campaign } from '../types';

const AdvertisePage = () => {
    const { state, dispatch } = useContext(AppContext);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newCampaign: Campaign = {
            id: `camp-${Date.now()}`,
            companyName: formData.get('companyName') as string,
            contactEmail: formData.get('contactEmail') as string,
            productName: formData.get('productName') as string,
            taskDescription: formData.get('taskDescription') as string,
            targetUrl: formData.get('targetUrl') as string,
            taskType: 'visit_website', // Default
            budget: 0,
            cpa: 0,
            userCreditReward: 0,
            status: 'pending_review',
            submittedAt: new Date().toISOString(),
        };
        
        // In a real app, this would be an API call. Here we dispatch to context.
        dispatch({ type: 'ADD_CAMPAIGN', payload: newCampaign });
        
        setSubmitted(true);
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
            <div className="w-full max-w-2xl">
                <Link to="/" className="flex items-center justify-center space-x-3 text-center mb-8">
                    {state.brandingSettings.logoUrl && <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-10 w-auto" />}
                    <h1 className="text-4xl font-bold text-white">Hello<span className="text-brand-cyan">Jadan</span>AI</h1>
                </Link>
                <Card>
                    {submitted ? (
                        <div className="text-center p-8">
                             <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                             <p className="text-slate-400 mt-2">Your campaign has been submitted for review. Our team will contact you at your provided email address within 2-3 business days.</p>
                             <Link to="/" className="mt-6 inline-block"><Button variant="secondary">Back to Home</Button></Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Advertise With Us</h2>
                                <p className="text-slate-400 mt-1">Submit your product for promotion. All submissions are subject to review.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Company Name</label>
                                        <Input name="companyName" type="text" required />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Contact Email</label>
                                        <Input name="contactEmail" type="email" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Product / Service Name</label>
                                    <Input name="productName" type="text" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Target URL (Website, App Store, etc.)</label>
                                    <Input name="targetUrl" type="url" placeholder="https://example.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Task Description for Users</label>
                                    <textarea
                                        name="taskDescription"
                                        rows={3}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500"
                                        placeholder="e.g., 'Sign up for our newsletter to get weekly tips!'"
                                        required
                                    ></textarea>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full">Submit for Review</Button>
                                </div>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default AdvertisePage;