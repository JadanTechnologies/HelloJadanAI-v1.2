import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useTranslation } from '../hooks/useTranslation';

const AdminLoginPage = () => {
  const { loginAsAdmin } = useContext(AppContext);
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAsAdmin(email, password);
    if (!success) {
      setError(t('invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
                Hello<span className="text-brand-cyan">Jadan</span>AI
            </h1>
            <p className="text-slate-400 mt-2">Admin Panel</p>
        </div>
        <Card>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
            <p className="text-slate-400 mt-1">Please enter your credentials.</p>
          </div>

          <div className="bg-slate-900/50 border border-brand-cyan/30 rounded-lg p-4 mb-6 text-sm">
              <p className="font-bold text-slate-300">{t('adminLoginInfoTitle')}</p>
              <p className="text-slate-400 mt-2">{t('adminLoginInfoText')}</p>
              <ul className="mt-2 space-y-1 text-slate-300 list-disc list-inside">
                  <li>{t('emailLabel')}: <code className="font-mono bg-slate-700 px-2 py-1 rounded text-brand-cyan">admin@example.com</code></li>
                  <li>{t('passwordLabel')}: <code className="font-mono bg-slate-700 px-2 py-1 rounded text-brand-cyan">password</code></li>
              </ul>
          </div>
          
          {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{t('emailLabel')}</label>
              <Input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">{t('passwordLabel')}</label>
              <Input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;