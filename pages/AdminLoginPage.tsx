import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const AdminLoginPage = () => {
  const { loginAsAdmin } = useContext(AppContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin();
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <Input type="email" id="email" defaultValue="admin@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <Input type="password" id="password" defaultValue="password" required />
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