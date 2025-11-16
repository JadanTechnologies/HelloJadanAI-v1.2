import React, { useState, useContext } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminIcon, AnalyticsIcon, SettingsIcon, ChecklistIcon, ShieldCheckIcon, EnvelopeIcon, PaperAirplaneIcon, ClockIcon, ReferralIcon, ShieldExclamationIcon, IdentificationIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, BriefcaseIcon, CurrencyDollarIcon, PhoneIcon, SupportIcon, KeyIcon } from '../../constants';

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

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string, onClick?: () => void, isCollapsed: boolean }> = ({ to, icon, label, onClick, isCollapsed }) => (
    <NavLink
        to={to}
        end
        onClick={onClick}
        className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses} ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? label : undefined}
    >
        <div className="flex-shrink-0">{icon}</div>
        <span className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 ml-0 hidden' : 'w-auto opacity-100 ml-3'}`}>{label}</span>
    </NavLink>
);


const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void; isCollapsed: boolean; toggleCollapse: () => void; }> = ({ isOpen, setIsOpen, isCollapsed, toggleCollapse }) => {
    const { t } = useTranslation();
    const closeSidebar = () => setIsOpen(false);

    const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="flex flex-col h-full">
                    <div className={`flex items-center h-16 px-4 border-b border-slate-800 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <Link to="/admin" className={`text-xl font-bold text-white transition-opacity duration-200 whitespace-nowrap ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                            Hello<span className="text-brand-cyan">Jadan</span>AI
                        </Link>
                        {isCollapsed && (
                            <Link to="/admin" className="text-xl font-bold text-white">
                                H<span className="text-brand-cyan">J</span>
                            </Link>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 space-y-1 p-4">
                            <NavItem to="/admin/dashboard" icon={<AnalyticsIcon className="w-5 h-5"/>} label="Dashboard" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            
                            <div className={`pt-4 mt-4 border-t border-slate-800 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Management</h3>
                                <NavItem to="/admin/users" icon={<AdminIcon className="w-5 h-5"/>} label={t('userManagement')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/staff" icon={<IdentificationIcon className="w-5 h-5" />} label="Staff Management" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/roles" icon={<KeyIcon className="w-5 h-5" />} label="Roles & Permissions" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/tasks" icon={<ChecklistIcon className="w-5 h-5" />} label="Task Management" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/task-monitoring" icon={<ShieldCheckIcon className="w-5 h-5" />} label="Task Monitoring" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/campaigns" icon={<BriefcaseIcon className="w-5 h-5" />} label="Campaigns" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/payments" icon={<CurrencyDollarIcon className="w-5 h-5" />} label="Payments" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/redemptions" icon={<PhoneIcon className="w-5 h-5" />} label="Redemptions" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/support" icon={<SupportIcon className="w-5 h-5" />} label="Support Tickets" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                             <div className={`pt-4 mt-4 border-t border-slate-800 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Growth & Security</h3>
                                <NavItem to="/admin/referrals" icon={<ReferralIcon className="w-5 h-5" />} label="Referral Management" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/fraud-detection" icon={<ShieldCheckIcon className="w-5 h-5" />} label="Fraud Detection" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/access-control" icon={<ShieldExclamationIcon className="w-5 h-5" />} label="Access Control" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                            <div className={`pt-4 mt-4 border-t border-slate-800 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Communication</h3>
                                 <NavItem to="/admin/communication" icon={<PaperAirplaneIcon className="w-5 h-5"/>} label="Communication Center" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                 <NavItem to="/admin/templates" icon={<EnvelopeIcon className="w-5 h-5"/>} label="Templates" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                            <div className={`pt-4 mt-4 border-t border-slate-800 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>System</h3>
                                <NavItem to="/admin/settings" icon={<SettingsIcon className="w-5 h-5" />} label="Platform Settings" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/cron-jobs" icon={<ClockIcon className="w-5 h-5"/>} label="Cron Jobs" onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/admin/logins" icon={<LoginIcon className="w-5 h-5"/>} label={t('loginDetails')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>
                        </nav>
                    </div>

                    <div className="hidden lg:flex items-center justify-center p-4 border-t border-slate-800 shrink-0">
                        <button onClick={toggleCollapse} className="p-2 rounded-full text-slate-400 hover:bg-white/10">
                            {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6"/> : <ChevronDoubleLeftIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>
            </aside>
            {isOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}
        </>
    );
};

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <div className="min-h-screen bg-brand-navy text-slate-200">
            <Sidebar 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={toggleSidebarCollapse} 
            />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main key={location.pathname} className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;