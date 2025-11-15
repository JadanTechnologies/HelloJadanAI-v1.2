import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger an API call.
        // For this demo, we'll just show a success message.
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        Hello<span className="text-brand-cyan">Jadan</span>AI
                    </h1>
                </div>
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{t('forgotPasswordTitle')}</h2>
                        <p className="text-slate-400 mt-1">{t('forgotPasswordSubtitle')}</p>
                    </div>

                    {submitted ? (
                        <div className="text-center">
                            <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4">{t('emailSentSuccess')}</p>
                            <Link to="/login">
                                <Button variant="secondary">{t('backToLogin')}</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{t('emailLabel')}</label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {t('sendResetLink')}
                            </Button>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
