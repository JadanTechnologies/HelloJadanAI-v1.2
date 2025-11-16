import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { User } from '../types';

type Role = 'student' | 'content_creator' | 'startup';

const RoleCard: React.FC<{ title: string; description: string; isSelected: boolean; onClick: () => void; }> = ({ title, description, isSelected, onClick }) => (
    <div
        onClick={onClick}
        className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-brand-cyan bg-brand-indigo/10 ring-2 ring-brand-cyan' : 'border-slate-700 bg-slate-900 hover:border-slate-500'}`}
    >
        <h3 className={`font-bold ${isSelected ? 'text-brand-cyan' : 'text-white'}`}>{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
);

const SignupPage = () => {
    const { signup, state } = useContext(AppContext);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<Role | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }
        if (!role) {
            setError('Please select a role.');
            return;
        }

        setIsLoading(true);
        const result = await signup({ username, email, password, role });
        setIsLoading(false);

        if (!result.success) {
            setError(result.message || 'An unknown error occurred.');
        } else {
            navigate('/app/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
            <div className="w-full max-w-lg">
                <Link to="/" className="flex items-center justify-center space-x-3 text-center mb-8">
                    {state.brandingSettings.logoUrl && (
                        <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-10 w-auto" />
                    )}
                    <h1 className="text-4xl font-bold text-white">
                        Hello<span className="text-brand-cyan">Jadan</span>AI
                    </h1>
                </Link>
                <Card>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{t('signupTitle')}</h2>
                        <p className="text-slate-400 mt-1">{t('signupSubtitle')}</p>
                    </div>

                    {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('usernameLabel')}</label>
                                <Input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('emailLabel')}</label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('passwordLabel')}</label>
                                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">{t('confirmPasswordLabel')}</label>
                                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">{t('roleLabel')}</label>
                            <div className="space-y-3">
                                <RoleCard title={t('studentRole')} description={t('studentRoleDesc')} isSelected={role === 'student'} onClick={() => setRole('student')} />
                                <RoleCard title={t('creatorRole')} description={t('creatorRoleDesc')} isSelected={role === 'content_creator'} onClick={() => setRole('content_creator')} />
                                <RoleCard title={t('startupRole')} description={t('startupRoleDesc')} isSelected={role === 'startup'} onClick={() => setRole('startup')} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                {t('createAccountButton')}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center mt-6 text-sm">
                        <p className="text-slate-400">
                            {t('alreadyHaveAccount')}{' '}
                            <Link to="/login" className="font-semibold text-brand-cyan hover:underline">
                                {t('loginButton')}
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;
