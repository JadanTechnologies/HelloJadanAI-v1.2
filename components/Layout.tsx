import React, { useState, useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import { HomeIcon, ImageIcon, VideoIcon, AdIcon, TaskIcon, GalleryIcon, AdminIcon, CreditIcon } from '../constants';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { state, logout } = useContext(AppContext);
    const { locale, setLocale } = useContext(LanguageContext);
    const { t } = useTranslation();

    return (
        <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button onClick={onMenuClick} className="text-slate-400 hover:text-white lg:hidden mr-4">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <Link to="/app/dashboard" className="text-xl font-bold text-white">
                            Hello<span className="text-brand-cyan">Jadan</span>AI
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
                           <CreditIcon className="w-5 h-5 text-brand-cyan"/>
                           <span className="text-white font-semibold">{state.credits}</span>
                           <span className="text-slate-400 text-sm">{t('credits')}</span>
                        </div>
                        <div className="relative">
                            <select 
                                value={locale} 
                                onChange={(e) => setLocale(e.target.value as 'en' | 'ha')}
                                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-md focus:ring-brand-indigo focus:border-brand-indigo block w-full pl-3 pr-8 py-1.5"
                            >
                                <option value="en">EN</option>
                                <option value="ha">HA</option>
                            </select>
                        </div>
                         <div className="relative">
                             <button className="flex items-center space-x-2">
                                <img src={state.user?.avatar} alt="User" className="w-8 h-8 rounded-full"/>
                            </button>
                        </div>
                        <button onClick={logout} className="text-slate-400 hover:text-white" title={t('logout')}>
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
    const { state } = useContext(AppContext);
    const { t } = useTranslation();
    
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full p-4">
                    <nav className="flex-1 space-y-2">
                        <NavItem to="/app/dashboard" icon={<HomeIcon className="w-5 h-5"/>} label={t('navDashboard')} onClick={closeSidebar}/>
                        <NavItem to="/app/generate-image" icon={<ImageIcon className="w-5 h-5"/>} label={t('navGenerateImage')} onClick={closeSidebar}/>
                        <NavItem to="/app/generate-video" icon={<VideoIcon className="w-5 h-5"/>} label={t('navGenerateVideo')} onClick={closeSidebar}/>
                        <NavItem to="/app/generate-ad" icon={<AdIcon className="w-5 h-5"/>} label={t('navGenerateAd')} onClick={closeSidebar}/>
                        <NavItem to="/app/tasks" icon={<TaskIcon className="w-5 h-5"/>} label={t('navTasks')} onClick={closeSidebar}/>
                        <NavItem to="/app/gallery" icon={<GalleryIcon className="w-5 h-5"/>} label={t('navGallery')} onClick={closeSidebar}/>
                        <NavItem to="/app/credits" icon={<CreditIcon className="w-5 h-5"/>} label={t('creditHistory')} onClick={closeSidebar}/>
                        {state.user?.isAdmin && (
                            <NavItem to="/app/admin" icon={<AdminIcon className="w-5 h-5"/>} label={t('navAdmin')} onClick={closeSidebar}/>
                        )}
                    </nav>
                </div>
            </aside>
            {isOpen && <div onClick={closeSidebar} className="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>}
        </>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen text-slate-200">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="lg:pl-64 flex flex-col flex-1">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main key={location.pathname} className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;