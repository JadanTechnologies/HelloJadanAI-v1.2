import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ClockIcon } from '../constants';

const MaintenancePage = () => {
    const { state } = useContext(AppContext);
    const { brandingSettings, systemSettings } = state;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-navy text-white">
            <div className="text-center max-w-2xl">
                <ClockIcon className="w-20 h-20 mx-auto text-brand-cyan mb-6 animate-pulse-subtle" />
                {brandingSettings.logoUrl && (
                    <img src={brandingSettings.logoUrl} alt="Logo" className="h-12 w-auto mx-auto mb-4" />
                )}
                <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    {systemSettings.maintenanceMessage}
                </p>
                <div className="mt-12 text-sm">
                    <p className="text-slate-500">Are you an administrator?</p>
                    <Link to="/login" className="text-brand-cyan hover:underline font-semibold">
                        Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;