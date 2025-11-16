import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import * as api from '../services/api';
import { User } from '../types';

type LoginType = 'user' | 'admin' | 'advertiser';

const LoginPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  
  const [loginType, setLoginType] = useState<LoginType>('user');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeChange = (type: LoginType) => {
    setLoginType(type);
    setError('');
    if (type === 'admin') {
      setEmail('jadan@example.com');
    } else if (type === 'user') {
      setEmail('alex@example.com');
    } else if (type === 'advertiser') {
      setEmail('advertiser@example.com');
    }
  }

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError('');
    const result = await api.apiLogin(loginEmail, loginPass);
    setIsLoading(false);
    
    // FIX: Using a strict equality check to ensure TypeScript correctly narrows the discriminated union type.
    if (result.success === false) {
      setError(result.message || t('invalidCredentials'));
      return;
    }
    
    // At this point, 'result' is known to be the success case.
    // Basic role check on the client side.
    // In a real app, the backend should be the source of truth for roles.
    const userIsAdmin = result.user.isAdmin;
    const userIsAdvertiser = result.user.role === 'advertiser';

    if (loginType === 'admin' && !userIsAdmin) {
      setError("This account does not have admin privileges.");
      return;
    }
    if (loginType === 'advertiser' && !userIsAdvertiser) {
      setError("This account is not an advertiser account.");
      return;
    }
    if ((loginType === 'user') && (userIsAdmin || userIsAdvertiser)) {
      setError("Please use the correct login portal for your account type.");
      return;
    }
    
    dispatch({ type: 'LOGIN', payload: result.user });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleGoogleLogin = () => {
    handleLogin('alex@example.com', 'password');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center space-x-3 text-center mb-8">
            {state.brandingSettings.logoUrl && (
                <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-10 w-auto" />
            )}
            <h1 className="text-4xl font-bold text-white">
                Hello<span className="text-brand-cyan">Jadan</span>AI
            </h1>
        </Link>
        <Card>
          <div className="mb-6">
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                <button 
                  onClick={() => handleTypeChange('user')}
                  className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${loginType === 'user' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  User
                </button>
                 <button 
                  onClick={() => handleTypeChange('advertiser')}
                  className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${loginType === 'advertiser' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Advertiser
                </button>
                 <button 
                  onClick={() => handleTypeChange('admin')}
                  className={`w-1/3 py-2 rounded-md text-sm font-semibold transition-colors ${loginType === 'admin' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                  Admin
                </button>
              </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">{loginType === 'user' ? t('loginTitle') : (loginType === 'advertiser' ? t('advertiserLogin') : 'Admin Access')}</h2>
            <p className="text-slate-400 mt-1">{loginType === 'user' ? t('loginSubtitle') : 'Please enter your credentials.'}</p>
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
                disabled={isLoading}
              />
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">{t('passwordLabel')}</label>
                    {loginType !== 'admin' && (
                       <Link to="/forgot-password" className="text-sm text-brand-cyan hover:underline">{t('forgotPassword')}</Link>
                    )}
                </div>
              <Input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              {t('loginButton')}
            </Button>
          </form>

          {loginType === 'user' && (
             <>
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-800 px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>
                <Button onClick={handleGoogleLogin} variant="secondary" className="w-full" isLoading={isLoading}>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z" fill="#4285F4"/>
                    <path d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z" fill="#34A853"/>
                    <path d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z" fill="#FBBC05"/>
                    <path d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,2.09,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z" fill="#EA4335"/>
                    </svg>
                    {t('loginWithGoogle')}
                </Button>
            </>
          )}

          <div className="text-center mt-6 text-sm">
            { loginType === 'user' &&
                <p className="text-slate-400">
                    {t('dontHaveAccount')}{' '}
                    <Link to="/signup" className="font-semibold text-brand-cyan hover:underline">
                        {t('signUp')}
                    </Link>
                </p>
            }
           </div>

        </Card>
      </div>
    </div>
  );
};

export default LoginPage;