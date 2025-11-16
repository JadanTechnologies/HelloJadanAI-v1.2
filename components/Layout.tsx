import React, { useState, useContext } from 'react';
import { NavLink, Link, useLocation, Outlet } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { HomeIcon, ImageIcon, VideoIcon, AdIcon, TaskIcon, GalleryIcon, CreditIcon, BellIcon, ReferralIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, GiftIcon, SupportIcon, ChatBubbleBottomCenterTextIcon, SparklesIcon } from '../constants';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-brand-indigo"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    )
}

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { state, dispatch, logout } = useContext(AppContext);
    const { locale, setLocale } = useContext(LanguageContext);
    const { t } = useTranslation();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    const unreadCount = state.notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        dispatch({ type: 'MARK_NOTIFICATION_AS_READ', payload: id });
    }

    return (
        <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white lg:hidden mr-4">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <Link to="/app/dashboard" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                            {state.brandingSettings.logoUrl && <img src={state.brandingSettings.logoUrl} alt="Logo" className="h-8 w-auto" />}
                            <span>Hello<span className="text-brand-cyan">Jadan</span>AI</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                           <CreditIcon className="w-5 h-5 text-brand-cyan"/>
                           <span className="text-slate-900 dark:text-white font-semibold">{state.credits}</span>
                           <span className="text-slate-500 dark:text-slate-400 text-sm">{t('credits')}</span>
                        </div>
                        <div className="relative">
                            <select 
                                value={locale} 
                                onChange={(e) => setLocale(e.target.value as 'en' | 'ha')}
                                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-md focus:ring-brand-indigo focus:border-brand-indigo block w-full pl-3 pr-8 py-1.5"
                            >
                                <option value="en">EN</option>
                                <option value="ha">HA</option>
                            </select>
                        </div>
                        <ThemeToggle />
                        <div className="relative">
                            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white relative">
                                <BellIcon className="w-6 h-6"/>
                                {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-800"></span>}
                            </button>
                            {isNotifOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50">
                                    <div className="p-3 font-semibold text-white border-b border-slate-700">Notifications</div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {state.notifications.length > 0 ? state.notifications.map(notif => (
                                            <div key={notif.id} className={`p-3 border-b border-slate-800 ${!notif.read ? 'bg-brand-indigo/10' : ''}`}>
                                                <p className="text-sm text-slate-200">{notif.message}</p>
                                                <div className="text-xs text-slate-500 mt-1 flex justify-between items-center">
                                                    <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                    {!notif.read && <button onClick={() => handleMarkAsRead(notif.id)} className="text-brand-cyan hover:underline">Mark as read</button>}
                                                </div>
                                            </div>
                                        )) : <p className="p-4 text-sm text-slate-400 text-center">No new notifications.</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                         <div className="relative">
                             <button className="flex items-center space-x-2">
                                <img src={state.user?.avatar} alt="User" className="w-8 h-8 rounded-full"/>
                            </button>
                        </div>
                        <button onClick={logout} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white" title={t('logout')}>
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
const inactiveLinkClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white";

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
    const { state } = useContext(AppContext);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-800 border-r border-slate-700 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="flex flex-col h-full">
                    <div className={`flex items-center h-16 px-4 border-b border-slate-700 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <Link to="/app/dashboard" className={`text-xl font-bold text-white transition-opacity duration-200 whitespace-nowrap ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}`}>
                            Hello<span className="text-brand-cyan">Jadan</span>AI
                        </Link>
                         {isCollapsed && (
                            <Link to="/app/dashboard" className="text-xl font-bold text-white">
                                H<span className="text-brand-cyan">J</span>
                            </Link>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 space-y-1 p-4">
                            <NavItem to="/app/dashboard" icon={<HomeIcon className="w-5 h-5"/>} label={t('navDashboard')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            
                            <div className={`pt-4 mt-4 border-t border-slate-700 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Create</h3>
                                <NavItem to="/app/generate-image" icon={<ImageIcon className="w-5 h-5"/>} label={t('navGenerateImage')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/generate-video" icon={<VideoIcon className="w-5 h-5"/>} label={t('navGenerateVideo')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/generate-ad" icon={<AdIcon className="w-5 h-5"/>} label={t('navGenerateAd')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/generate-social-post" icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>} label={t('navGenerateSocial')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                            <div className={`pt-4 mt-4 border-t border-slate-700 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>AI Tools</h3>
                                <NavItem to="/app/chat" icon={<SparklesIcon className="w-5 h-5"/>} label={t('navChat')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                            <div className={`pt-4 mt-4 border-t border-slate-700 ${isCollapsed ? 'border-none' : ''}`}>
                                <h3 className={`px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>Manage</h3>
                                <NavItem to="/app/tasks" icon={<TaskIcon className="w-5 h-5"/>} label={t('navTasks')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/gallery" icon={<GalleryIcon className="w-5 h-5"/>} label={t('navGallery')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/credits" icon={<CreditIcon className="w-5 h-5"/>} label={t('creditHistory')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/referrals" icon={<ReferralIcon className="w-5 h-5"/>} label={t('referFriend')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/redeem" icon={<GiftIcon className="w-5 h-5"/>} label={t('navRedeem')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                <NavItem to="/app/support" icon={<SupportIcon className="w-5 h-5"/>} label={t('navSupport')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                            </div>

                            {state.user?.isAdmin && (
                                <div className={`pt-4 mt-4 border-t border-slate-700 ${isCollapsed ? 'border-none' : ''}`}>
                                    <NavItem to="/admin" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label={t('navAdmin')} onClick={closeSidebar} isCollapsed={isCollapsed}/>
                                </div>
                            )}
                        </nav>
                    </div>
                     <div className="hidden lg:flex items-center justify-center p-4 border-t border-slate-700 shrink-0">
                        <button onClick={toggleCollapse} className="p-2 rounded-full text-slate-400 hover:bg-slate-700">
                            {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6"/> : <ChevronDoubleLeftIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>
            </aside>
            {isOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}
        </>
    );
};

const Layout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebarCollapse = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <div className="min-h-screen bg-brand-navy text-slate-200 dark:bg-brand-navy">
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

export default Layout;
