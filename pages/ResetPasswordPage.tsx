import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        // In a real app, you would submit this to an API
        console.log('Password reset successfully');
        setSuccess(t('passwordResetSuccess'));
        
        // Redirect to login after a short delay
        setTimeout(() => {
            navigate('/login');
        }, 2000);
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
                        <h2 className="text-2xl font-bold text-white">{t('resetPasswordTitle')}</h2>
                        <p className="text-slate-400 mt-1">{t('resetPasswordSubtitle')}</p>
                    </div>

                    {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">{error}</p>}
                    {success && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4 text-center">{success}</p>}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">{t('newPasswordLabel')}</label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">{t('confirmPasswordLabel')}</label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!!success}>
                            {t('resetPasswordButton')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
