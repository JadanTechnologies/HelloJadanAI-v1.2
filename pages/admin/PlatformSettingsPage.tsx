import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { CREDIT_COSTS, TrashIcon, UploadIcon } from '../../constants';
import { mockBrandingSettings, mockContentSettings, mockApiSettings } from './data';
import { BrandingSettings, ContentSettings, FAQItem, ApiSettings } from '../../types';

type SettingsTab = 'general' | 'branding' | 'content' | 'api' | 'integrations';

const imageProviders = ['Gemini', 'DALL-E 3', 'Midjourney', 'Mock Service'];
const videoProviders = ['Veo (Google)', 'RunwayML', 'Pika', 'Sora', 'Mock Service'];

const initialProviders = {
    image: { primary: 'Gemini', fallback: 'Mock Service' },
    video: { primary: 'Veo (Google)', fallback: 'Mock Service' },
    ad: { primary: 'Gemini', fallback: 'Mock Service' },
};

const PlatformSettingsPage = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    
    // States for each settings category
    const [costs, setCosts] = useState(CREDIT_COSTS);
    const [providers, setProviders] = useState(initialProviders);
    const [branding, setBranding] = useState<BrandingSettings>(mockBrandingSettings);
    const [content, setContent] = useState<ContentSettings>(mockContentSettings);
    const [apiSettings, setApiSettings] = useState<ApiSettings>(mockApiSettings);
    
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // FAQ Modal State
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

    const handleSave = () => {
        setIsSaving(true);
        setSaved(false);
        setTimeout(() => {
            console.log("Saved Settings:", { costs, providers, branding, content, apiSettings });
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof BrandingSettings) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setBranding(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveFaq = (faq: FAQItem) => {
        if (editingFaq) {
             setContent(prev => ({...prev, faqs: prev.faqs.map(f => f.id === faq.id ? faq : f)}));
        } else {
            const newFaq = {...faq, id: `faq-${Date.now()}`};
            setContent(prev => ({...prev, faqs: [...prev.faqs, newFaq]}));
        }
        closeFaqModal();
    };

    const handleDeleteFaq = (id: string) => {
        setContent(prev => ({...prev, faqs: prev.faqs.filter(f => f.id !== id)}));
    };
    
    const openFaqModal = (faq: FAQItem | null) => {
        setEditingFaq(faq);
        setIsFaqModalOpen(true);
    };

    const closeFaqModal = () => {
        setEditingFaq(null);
        setIsFaqModalOpen(false);
    };

    const inputClasses = "mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300";
    const textareaClasses = `${inputClasses} min-h-[120px]`;
    
    const TabButton: React.FC<{tab: SettingsTab; label: string}> = ({ tab, label }) => (
      <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-brand-indigo text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
        {label}
      </button>
    );

    return (
        <div className="space-y-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
                <p className="text-slate-400 mt-1">Manage global settings for the application.</p>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-800 rounded-lg">
                <TabButton tab="general" label="General"/>
                <TabButton tab="branding" label="Branding"/>
                <TabButton tab="content" label="Content"/>
                <TabButton tab="api" label="API Providers"/>
                <TabButton tab="integrations" label="Integrations"/>
            </div>

            {activeTab === 'general' && (
                <Card>
                    <h2 className="text-xl font-bold text-white mb-4">Credit Costs Management</h2>
                    <p className="text-slate-400 mb-6">Adjust the credits required for each generation type.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.keys(costs).map(key => (
                            <div key={key}>
                                <label htmlFor={`${key}-cost`} className="block text-sm font-medium text-slate-300 capitalize">{key} Generation Cost</label>
                                <input id={`${key}-cost`} type="number" value={costs[key as keyof typeof costs]} onChange={(e) => setCosts(p => ({...p, [key]: parseInt(e.target.value) || 0}))} className={inputClasses}/>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'branding' && (
                <Card>
                     <h2 className="text-xl font-bold text-white mb-4">Branding & Appearance</h2>
                     <p className="text-slate-400 mb-6">Customize the look of the platform with your own branding.</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(['logoUrl', 'faviconUrl', 'hologramLogoUrl'] as const).map(field => (
                             <div key={field}>
                                 <label className="block text-sm font-medium text-slate-300 capitalize mb-2">{field.replace('Url', ' ')}</label>
                                 <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center relative group">
                                     {branding[field] ? <img src={branding[field]} alt={field} className="max-w-full max-h-full object-contain p-2"/> : <span className="text-slate-500">No Image</span>}
                                     <label htmlFor={field} className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <UploadIcon className="w-8 h-8"/> Upload
                                     </label>
                                     <input type="file" id={field} accept="image/*" onChange={(e) => handleFileUpload(e, field)} className="hidden"/>
                                 </div>
                             </div>
                        ))}
                     </div>
                </Card>
            )}
            
            {activeTab === 'content' && (
                <div className="space-y-8">
                     <Card>
                        <h2 className="text-xl font-bold text-white mb-4">Landing Page Content</h2>
                        <div className="space-y-4">
                            <div><label className="text-sm font-medium text-slate-300">About Us Section</label><textarea value={content.aboutUs} onChange={e => setContent(p => ({...p, aboutUs: e.target.value}))} className={textareaClasses}/></div>
                            <div><label className="text-sm font-medium text-slate-300">Contact Us Info</label><textarea value={content.contactUs} onChange={e => setContent(p => ({...p, contactUs: e.target.value}))} className={textareaClasses}/></div>
                            <div><label className="text-sm font-medium text-slate-300">Terms of Service</label><textarea value={content.termsOfService} onChange={e => setContent(p => ({...p, termsOfService: e.target.value}))} className={textareaClasses}/></div>
                            <div><label className="text-sm font-medium text-slate-300">Privacy Policy</label><textarea value={content.privacyPolicy} onChange={e => setContent(p => ({...p, privacyPolicy: e.target.value}))} className={textareaClasses}/></div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">FAQ Management</h2>
                            <Button onClick={() => openFaqModal(null)}>Add FAQ</Button>
                        </div>
                        <div className="space-y-2">
                            {content.faqs.map(faq => (
                                <div key={faq.id} className="p-4 bg-slate-900 rounded-lg flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-white">{faq.question}</p>
                                        <p className="text-sm text-slate-400">{faq.answer}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center space-x-2 ml-4">
                                        <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => openFaqModal(faq)}>Edit</Button>
                                        <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
            
            {activeTab === 'api' && (
                 <Card>
                    <h2 className="text-xl font-bold text-white mb-4">AI Provider Management</h2>
                    <p className="text-slate-400 mb-6">Configure the primary and fallback AI services.</p>
                     <div className="space-y-6">
                         <div>
                            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Image & Ad Generation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="text-sm font-medium text-slate-300">Primary Provider</label><select value={providers.image.primary} onChange={e => setProviders(p => ({...p, image: {...p.image, primary: e.target.value}}))} className={inputClasses}>{imageProviders.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                <div><label className="text-sm font-medium text-slate-300">Fallback Provider</label><select value={providers.image.fallback} onChange={e => setProviders(p => ({...p, image: {...p.image, fallback: e.target.value}}))} className={inputClasses}>{imageProviders.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Video Generation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="text-sm font-medium text-slate-300">Primary Provider</label><select value={providers.video.primary} onChange={e => setProviders(p => ({...p, video: {...p.video, primary: e.target.value}}))} className={inputClasses}>{videoProviders.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                <div><label className="text-sm font-medium text-slate-300">Fallback Provider</label><select value={providers.video.fallback} onChange={e => setProviders(p => ({...p, video: {...p.video, fallback: e.target.value}}))} className={inputClasses}>{videoProviders.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                            </div>
                        </div>
                    </div>
                 </Card>
            )}

            {activeTab === 'integrations' && (
                 <Card>
                    <h2 className="text-xl font-bold text-white mb-4">Third-Party Integrations</h2>
                    <p className="text-slate-400 mb-6">Manage API keys and settings for external services.</p>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Email (Resend)</h3>
                            <div>
                                <label className="text-sm font-medium text-slate-300">Resend API Key</label>
                                <Input type="password" value={apiSettings.resend.apiKey} onChange={e => setApiSettings(p => ({...p, resend: {...p.resend, apiKey: e.target.value}}))} className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">SMS (Twilio)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div><label className="text-sm font-medium text-slate-300">Account SID</label><Input type="text" value={apiSettings.twilio.accountSid} onChange={e => setApiSettings(p => ({...p, twilio: {...p.twilio, accountSid: e.target.value}}))} className={inputClasses}/></div>
                                <div><label className="text-sm font-medium text-slate-300">Auth Token</label><Input type="password" value={apiSettings.twilio.authToken} onChange={e => setApiSettings(p => ({...p, twilio: {...p.twilio, authToken: e.target.value}}))} className={inputClasses}/></div>
                                <div><label className="text-sm font-medium text-slate-300">Phone Number</label><Input type="text" value={apiSettings.twilio.phoneNumber} onChange={e => setApiSettings(p => ({...p, twilio: {...p.twilio, phoneNumber: e.target.value}}))} className={inputClasses}/></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2 mb-4">Push Notifications (OneSignal)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-300">OneSignal App ID</label>
                                    <Input type="text" value={apiSettings.oneSignal.appId} onChange={e => setApiSettings(p => ({...p, oneSignal: {...p.oneSignal, appId: e.target.value}}))} className={inputClasses}/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300">REST API Key</label>
                                    <Input type="password" value={apiSettings.oneSignal.restApiKey} onChange={e => setApiSettings(p => ({...p, oneSignal: {...p.oneSignal, restApiKey: e.target.value}}))} className={inputClasses}/>
                                </div>
                            </div>
                        </div>
                    </div>
                 </Card>
            )}
            
            <div className="pt-2 flex items-center space-x-4">
                <Button onClick={handleSave} isLoading={isSaving}>Save All Changes</Button>
                {saved && <p className="text-green-400 text-sm animate-fade-in-up">Settings saved successfully!</p>}
            </div>

            {isFaqModalOpen && <FaqModal isOpen={isFaqModalOpen} onClose={closeFaqModal} onSave={handleSaveFaq} faq={editingFaq}/>}
        </div>
    );
};

const FaqModal: React.FC<{isOpen: boolean; onClose: () => void; onSave: (faq: FAQItem) => void; faq: FAQItem | null;}> = ({isOpen, onClose, onSave, faq}) => {
    const [question, setQuestion] = useState(faq?.question || '');
    const [answer, setAnswer] = useState(faq?.answer || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: faq?.id || '', question, answer });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={faq ? "Edit FAQ" : "Add FAQ"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="text-sm font-medium text-slate-300">Question</label><Input type="text" value={question} onChange={e => setQuestion(e.target.value)} required/></div>
                <div><label className="text-sm font-medium text-slate-300">Answer</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300" rows={4} required/></div>
                <div className="pt-4 flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit">Save FAQ</Button></div>
            </form>
        </Modal>
    )
};

export default PlatformSettingsPage;