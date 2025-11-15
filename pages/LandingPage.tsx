import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeContext } from '../contexts/ThemeContext';
import { AppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { ImageIcon, VideoIcon, AdIcon, TaskIcon, CreditIcon } from '../constants';
import { ContentSettings, BrandingSettings } from '../types';

const Hologram: React.FC<{ logoUrl: string | null }> = ({ logoUrl }) => {
    const Orbit: React.FC<{ size: string; speed: string; rotationClass: string; children: React.ReactNode }> = ({ size, speed, rotationClass, children }) => (
        <div className={`absolute ${size} ${speed} ${rotationClass} transform-style-3d`}>
            {children}
        </div>
    );

    const Particle: React.FC<{ size: string; color: string; position: string }> = ({ size, color, position }) => (
        <div className={`absolute ${size} ${color} rounded-full ${position} shadow-[0_0_10px_currentColor]`}></div>
    );

    return (
        <div className="relative w-[300px] h-[300px] flex items-center justify-center perspective-[1000px]">
            <div className="animate-hologram-float w-full h-full flex items-center justify-center transform-style-3d">
                {/* Central Sphere */}
                <div className="absolute w-[150px] h-[150px] bg-brand-cyan/10 rounded-full border border-brand-cyan/50 animate-hologram-pulse shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center overflow-hidden">
                    {logoUrl ? <img src={logoUrl} alt="Brand Logo" className="w-24 h-24 rounded-lg object-cover" /> : <span className="text-5xl font-bold text-brand-cyan animate-pulse-subtle">AI</span>}
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-pulse-subtle"></div>
                </div>

                {/* Orbits & Particles */}
                <Orbit size="w-[220px] h-[220px]" speed="animate-[spin_10s_linear_infinite]" rotationClass="transform -rotate-x-60">
                     <Particle size="w-3 h-3" color="bg-brand-cyan" position="top-0 left-1/2 -translate-x-1/2" />
                </Orbit>

                <Orbit size="w-[280px] h-[280px]" speed="animate-[spin_15s_linear_infinite_reverse]" rotationClass="transform rotate-x-45 -rotate-y-30">
                    <Particle size="w-4 h-4" color="bg-brand-indigo" position="top-1/4 right-0 -translate-y-1/2" />
                     <Particle size="w-2 h-2" color="bg-white/80" position="bottom-1/4 left-0 translate-y-1/2" />
                </Orbit>

                 <Orbit size="w-[320px] h-[320px]" speed="animate-[spin_20s_linear_infinite]" rotationClass="transform rotate-y-60">
                    <Particle size="w-2 h-2" color="bg-brand-cyan" position="bottom-0 left-1/2 -translate-x-1/2" />
                </Orbit>
            </div>
        </div>
    );
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    )
}

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">{title}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 text-slate-600 dark:text-slate-400">{children}</div>
            </div>
        </div>
    );
};

const LandingPage: React.FC = () => {
    const { state } = useContext(AppContext);
    const { t } = useTranslation();
    const { contentSettings, brandingSettings } = state;
    const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy text-slate-800 dark:text-slate-200 overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                        <span>Hello<span className="text-brand-cyan">Jadan</span>AI</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <Link to="/login"><Button variant="secondary">{t('loginButton')}</Button></Link>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative flex flex-col items-center justify-center h-screen text-center px-4">
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-indigo/10 dark:bg-brand-indigo/20 rounded-full blur-3xl animate-pulse-glow"></div>
                    <div className="z-10"><Hologram logoUrl={brandingSettings.hologramLogoUrl} /></div>
                    <div className="relative z-10 mt-8">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">Unlock Your <span className="text-brand-cyan">Creative</span> Potential</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">Generate stunning AI images, videos, and ads simply by completing tasks. No payment required.</p>
                        <p className="mt-2 max-w-2xl mx-auto text-md text-slate-500 dark:text-slate-400">We built this platform for students, startups, and content creators who don't have the budget to pay for other services.</p>
                        <Link to="/login" className="mt-8 inline-block"><Button className="text-lg px-8 py-3">Get Started for Free</Button></Link>
                    </div>
                </section>
                
                <section id="about" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto text-center max-w-3xl">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">About Us</h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{contentSettings.aboutUs}</p>
                    </div>
                </section>

                <section id="faq" className="py-20 px-4">
                    <div className="container mx-auto max-w-3xl">
                        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h3>
                        <div className="space-y-2">
                            {contentSettings.faqs.map(faq => <AccordionItem key={faq.id} title={faq.question}>{faq.answer}</AccordionItem>)}
                        </div>
                    </div>
                </section>
                
                <section id="contact" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto text-center max-w-3xl">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 whitespace-pre-line">{contentSettings.contactUs}</p>
                    </div>
                </section>
            </main>
            
            <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
                <div className="space-x-4 mb-4">
                    <button onClick={() => setModalContent({title: "Terms of Service", content: contentSettings.termsOfService})} className="hover:text-brand-cyan transition">Terms of Service</button>
                    <button onClick={() => setModalContent({title: "Privacy Policy", content: contentSettings.privacyPolicy})} className="hover:text-brand-cyan transition">Privacy Policy</button>
                </div>
                <p>&copy; {new Date().getFullYear()} HelloJadanAI. All rights reserved.</p>
            </footer>

            <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">{modalContent?.content}</div>
            </Modal>
        </div>
    );
};

export default LandingPage;