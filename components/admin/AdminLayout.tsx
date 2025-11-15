import React, { useState, useContext } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminIcon, AnalyticsIcon, SettingsIcon, ChecklistIcon, ShieldCheckIcon, EnvelopeIcon, MegaphoneIcon, ClockIcon, ReferralIcon, ShieldExclamationIcon } from '../../constants';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { state, logout } = useContext(AppContext);

    return (
        <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="text-slate-400 hover:text-white lg:hidden mr-4">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <div className="text-xl font-bold text-white">
                            Admin<span className="text-brand-cyan">Panel</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                         <Link to="/app/dashboard">
                            <button className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors">
                                Return to User App
                            </button>
                        </Link>
                         <div className="flex items-center space-x-2">
                             <img src={state.user?.avatar} alt="Admin" className="w-8 h-8 rounded-full"/>
                             <span className="text-white hidden sm:block">{state.user?.username}</span>
                        </div>
                        <button onClick={logout} className="text-slate-400 hover:text-white" title="Logout">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                           </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const navLinkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
const activeLinkClasses = "bg-brand-indigo text-white shadow-lg";
const inactiveLinkClasses = "text-slate-400 hover:bg-slate-700 hover:text-white";

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick?: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </NavLink>
);


const Sidebar: React.FC<{ isOpen: boolean, setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation();
    const closeSidebar = () => setIsOpen(false);

    const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center h-16 px-4 border-b border-slate-800">
                     <Link to="/admin" className="text-xl font-bold text-white">
                        Hello<span className="text-brand-cyan">Jadan</span>AI
                    </Link>
                </div>
                <div className="flex flex-col h-full p-4">
                    <nav className="flex-1 space-y-1">
                        <NavItem to="/admin/dashboard" icon={<AnalyticsIcon className="w-5 h-5"/>} label="Dashboard" onClick={closeSidebar}/>
                        
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Management</h3>
                            <NavItem to="/admin/users" icon={<AdminIcon className="w-5 h-5"/>} label={t('userManagement')} onClick={closeSidebar}/>
                            <NavItem to="/admin/tasks" icon={<ChecklistIcon className="w-5 h-5" />} label="Task Management" onClick={closeSidebar} />
                            <NavItem to="/admin/task-monitoring" icon={<ShieldCheckIcon className="w-5 h-5" />} label="Task Monitoring" onClick={closeSidebar} />
                        </div>

                         <div className="pt-4 mt-4 border-t border-slate-800">
                            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Growth & Security</h3>
                            <NavItem to="/admin/referrals" icon={<ReferralIcon className="w-5 h-5" />} label="Referral Management" onClick={closeSidebar} />
                            <NavItem to="/admin/fraud-detection" icon={<ShieldCheckIcon className="w-5 h-5" />} label="Fraud Detection" onClick={closeSidebar} />
                            <NavItem to="/admin/access-control" icon={<ShieldExclamationIcon className="w-5 h-5" />} label="Access Control" onClick={closeSidebar} />
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Communication</h3>
                             <NavItem to="/admin/announcements" icon={<MegaphoneIcon className="w-5 h-5"/>} label="Announcements" onClick={closeSidebar}/>
                             <NavItem to="/admin/templates" icon={<EnvelopeIcon className="w-5 h-5"/>} label="Templates" onClick={closeSidebar}/>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</h3>
                            <NavItem to="/admin/settings" icon={<SettingsIcon className="w-5 h-5" />} label="Platform Settings" onClick={closeSidebar} />
                            <NavItem to="/admin/cron-jobs" icon={<ClockIcon className="w-5 h-5"/>} label="Cron Jobs" onClick={closeSidebar}/>
                            <NavItem to="/admin/logins" icon={<LoginIcon className="w-5 h-5"/>} label={t('loginDetails')} onClick={closeSidebar}/>
                        </div>
                    </nav>
                </div>
            </aside>
            {isOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}
        </>
    );
};

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-brand-navy text-slate-200">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:pl-64 flex flex-col flex-1">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main key={location.pathname} className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;