import React, { useContext, useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Payment, PaymentGateway, Campaign } from '../types';
import { UploadIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../constants';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import Input from '../components/common/Input';

// --- Start: In-component Modal for Payment Simulation ---
const PaymentSimulationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    gateway: string;
    amount: number;
    onSuccess: () => void;
}> = ({ isOpen, onClose, gateway, amount, onSuccess }) => {
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    const runSimulation = () => {
        setStatus('processing');
        setTimeout(() => {
            // Simulate 80% success rate
            if (Math.random() < 0.8) {
                setStatus('success');
                setTimeout(() => {
                    onSuccess();
                }, 2000); // Show success message for 2 seconds before calling parent handler
            } else {
                setStatus('failed');
            }
        }, 2500); // Simulate processing time
    };

    useEffect(() => {
        if (isOpen) {
            runSimulation();
        }
    }, [isOpen]);

    const renderContent = () => {
        switch (status) {
            case 'processing':
                return <Spinner message={`Processing payment with ${gateway}...`} />;
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
                        <p className="text-slate-400 mt-2">Amount of ${amount.toFixed(2)} received. Finalizing submission...</p>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-center p-8">
                        <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                        <h3 className="text-2xl font-bold text-white">Payment Failed</h3>
                        <p className="text-slate-400 mt-2">We were unable to process your payment. Please try again.</p>
                        <div className="mt-6 flex justify-center space-x-4">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button onClick={runSimulation}>Retry Payment</Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={status !== 'processing' ? onClose : () => {}} title={`Pay with ${gateway}`}>
            {renderContent()}
        </Modal>
    );
};
// --- End: In-component Modal ---


const PaymentPage = () => {
    const { state, dispatch } = useContext(AppContext);
    const { campaignId } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
    
    if (campaign.status !== 'pending_payment' && !isSuccess) {
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
            setIsSuccess(true);
        }, 1500);
    };

    const handleGatewayPayment = (gateway: 'paystack' | 'flutterwave') => {
        setSelectedGateway(gateway);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        if (!campaign || !selectedGateway || selectedGateway === 'manual') return;

        setIsPaymentModalOpen(false);
        setIsLoading(true);

        setTimeout(() => {
            const newPayment: Payment = {
                id: `pay-${Date.now()}`,
                campaignId: campaign.id,
                campaignName: campaign.productName,
                companyName: campaign.companyName,
                amount: campaignPrice,
                currency: 'USD',
                gateway: selectedGateway,
                status: 'completed',
                transactionId: `${selectedGateway}_${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
    
            const updatedCampaign: Campaign = { ...campaign, status: 'pending_review', paymentId: newPayment.id };
            dispatch({ type: 'UPDATE_CAMPAIGN', payload: updatedCampaign });

            setIsLoading(false);
            setIsSuccess(true);
        }, 300);
    };

    const gateways = state.systemSettings.paymentGateways;

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
                <div className="w-full max-w-lg text-center">
                    <Card>
                        <CheckCircleIcon className="w-20 h-20 mx-auto text-green-500 mb-4" />
                        <h1 className="text-3xl font-bold text-white">Submission Received!</h1>
                        <p className="text-slate-400 mt-4">
                            Thank you for your submission. Your campaign is now pending review by our team.
                            We will notify you at your contact email once the review is complete.
                        </p>
                        <Link to="/" className="mt-8 inline-block">
                            <Button variant="secondary">Back to Homepage</Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

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
                            {gateways.paystack.enabled && <Button variant="secondary" className="w-full" onClick={() => handleGatewayPayment('paystack')}>Pay with Paystack</Button>}
                            {gateways.flutterwave.enabled && <Button variant="secondary" className="w-full" onClick={() => handleGatewayPayment('flutterwave')}>Pay with Flutterwave</Button>}
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
            {selectedGateway && selectedGateway !== 'manual' && (
                <PaymentSimulationModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    gateway={selectedGateway}
                    amount={campaignPrice}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default PaymentPage;