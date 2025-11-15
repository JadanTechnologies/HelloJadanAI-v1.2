import React, { useContext, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Payment, PaymentGateway, Campaign } from '../types';
import { UploadIcon } from '../constants';

const PaymentPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { campaignId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const campaign = state.campaigns.find(c => c.id === campaignId);
    
    // For this demo, let's set a fixed price for campaign submission
    const campaignPrice = 50.00;

    if (!campaign) {
        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Campaign Not Found</h2>
                    <p className="text-slate-400 mt-2">The campaign you are looking for does not exist.</p>
                    <Link to="/advertise" className="mt-6 inline-block"><Button variant="secondary">Back to Advertise Page</Button></Link>
                </div>
            </div>
        );
    }
    
    if (campaign.status !== 'pending_payment') {
        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Payment Already Processed</h2>
                    <p className="text-slate-400 mt-2">The payment for this campaign has already been handled.</p>
                    <Link to="/" className="mt-6 inline-block"><Button variant="secondary">Back to Home</Button></Link>
                </div>
            </div>
        )
    }

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPaymentProof(file);
            setPaymentProofPreview(URL.createObjectURL(file));
        }
    };
    
    const handleManualSubmit = () => {
        if (!paymentProof) {
            alert('Please upload your proof of payment.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
             const newPayment: Payment = {
                id: `pay-${Date.now()}`,
                campaignId: campaign.id,
                campaignName: campaign.productName,
                companyName: campaign.companyName,
                amount: campaignPrice,
                currency: 'USD',
                gateway: 'manual',
                status: 'pending',
                paymentProofUrl: paymentProofPreview!,
                createdAt: new Date().toISOString()
            };
            dispatch({ type: 'ADD_PAYMENT', payload: newPayment });

            const updatedCampaign: Campaign = { ...campaign, status: 'pending_review', paymentId: newPayment.id };
            dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });

            setIsLoading(false);
            navigate('/advertise'); // Redirect to a generic thank you page for simplicity
        }, 1500);
    };

    const gateways = state.systemSettings.paymentGateways;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
            <div className="w-full max-w-2xl">
                 <Link to="/" className="flex items-center justify-center space-x-3 text-center mb-8">
                    {state.brandingSettings.logoUrl && <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-10 w-auto" />}
                    <h1 className="text-4xl font-bold text-white">Hello<span className="text-brand-cyan">Jadan</span>AI</h1>
                </Link>
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Complete Your Campaign Submission</h2>
                        <p className="text-slate-400 mt-1">Final step: Please make the payment to activate your campaign review process.</p>
                    </div>
                    
                    <div className="p-4 bg-slate-900 rounded-lg mb-6 border border-slate-700">
                        <h3 className="font-semibold text-white">Campaign Summary</h3>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-slate-400">Campaign: {campaign.productName}</span>
                            <span className="font-bold text-brand-cyan text-lg">${campaignPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white text-center">Select Payment Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {gateways.paystack.enabled && <Button variant="secondary" className="w-full" onClick={() => setSelectedGateway('paystack')}>Pay with Paystack</Button>}
                            {gateways.flutterwave.enabled && <Button variant="secondary" className="w-full" onClick={() => setSelectedGateway('flutterwave')}>Pay with Flutterwave</Button>}
                            {gateways.manual.enabled && <Button variant="secondary" className="w-full" onClick={() => setSelectedGateway('manual')}>Manual Bank Transfer</Button>}
                        </div>

                        {selectedGateway === 'manual' && (
                            <div className="mt-6 pt-6 border-t border-slate-700 animate-fade-in-up">
                                <h3 className="font-semibold text-lg text-white mb-2">Bank Transfer Details</h3>
                                <div className="p-4 bg-slate-900/50 rounded-lg space-y-2 text-sm">
                                    <p><strong className="text-slate-400">Bank:</strong> {gateways.manual.bankName}</p>
                                    <p><strong className="text-slate-400">Account Name:</strong> {gateways.manual.accountName}</p>
                                    <p><strong className="text-slate-400">Account Number:</strong> {gateways.manual.accountNumber}</p>
                                </div>
                                <p className="text-slate-400 text-sm mt-4">{gateways.manual.instructions}</p>
                                
                                <div className="mt-4">
                                     {paymentProofPreview ? (
                                        <div className="relative group">
                                            <img src={paymentProofPreview} alt="Proof preview" className="w-full max-w-sm mx-auto rounded-lg" />
                                            <button onClick={() => { setPaymentProof(null); setPaymentProofPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">X</button>
                                        </div>
                                     ) : (
                                        <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-brand-cyan cursor-pointer">
                                            <UploadIcon className="w-10 h-10 mb-2"/>
                                            <span>Upload Payment Proof</span>
                                            <input type="file" accept="image/*,application/pdf" onChange={handleProofUpload} ref={fileInputRef} className="hidden" />
                                        </div>
                                     )}
                                </div>

                                <Button onClick={handleManualSubmit} isLoading={isLoading} disabled={!paymentProof || isLoading} className="w-full mt-4">
                                    Submit Payment Proof
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default PaymentPage;
