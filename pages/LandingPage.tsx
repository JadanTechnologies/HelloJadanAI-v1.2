import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { ThemeContext } from '../contexts/ThemeContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import { ImageIcon, VideoIcon, AdIcon, TaskIcon, CreditIcon } from '../constants';
import { mockBrandingSettings, mockContentSettings } from './admin/data';
import { ContentSettings, BrandingSettings } from '../types';

const Hologram: React.FC<{ rotation: { x: number; y: number }, logoUrl: string | null }> = ({ rotation, logoUrl }) => {
    const Face: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
        <div className={`absolute w-[200px] h-[200px] bg-brand-cyan/10 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan ${className}`}>
            {children}
        </div>
    );

    return (
        <div className="relative w-[200px] h-[200px] perspective-[1000px] group">
            <div
                className="w-full h-full relative transform-style-3d transition-transform duration-300 ease-out"
                style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
                <Face className="transform rotate-y-0 translate-z-[100px]">{logoUrl ? <img src={logoUrl} alt="Brand Logo" className="p-4 rounded-lg" /> : <ImageIcon className="w-16 h-16" />}</Face>
                <Face className="transform rotate-y-90 translate-z-[100px]"><VideoIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-y-180 translate-z-[100px]"><AdIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-y-[-90deg] translate-z-[100px]"><TaskIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-x-90 translate-z-[100px]"><CreditIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-x-[-90deg] translate-z-[100px]"><b className="text-3xl font-bold">AI</b></Face>
            </div>
        </div>
    )
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
    const { t } = useTranslation();
    const [content] = useState<ContentSettings>(mockContentSettings);
    const [branding] = useState<BrandingSettings>(mockBrandingSettings);
    const [rotation, setRotation] = useState({ x: 20, y: 0 });
    const heroRef = useRef<HTMLElement>(null);
    const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        setRotation({ x: 20 - (deltaY * 15), y: deltaX * -25 });
    };

    const handleMouseLeave = () => setRotation({ x: 20, y: 0 });

    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy text-slate-800 dark:text-slate-200 overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="HelloJadanAI Logo" className="h-10" />
                        ) : (
                            <span>Hello<span className="text-brand-cyan">Jadan</span>AI</span>
                        )}
                    </Link>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        <Link to="/login"><Button variant="secondary">{t('loginButton')}</Button></Link>
                    </div>
                </div>
            </header>

            <main>
                <section ref={heroRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative flex flex-col items-center justify-center h-screen text-center px-4">
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-indigo/10 dark:bg-brand-indigo/20 rounded-full blur-3xl animate-pulse-glow"></div>
                    <div className="z-10"><Hologram rotation={rotation} logoUrl={branding.hologramLogoUrl} /></div>
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
                        <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{content.aboutUs}</p>
                    </div>
                </section>

                <section id="faq" className="py-20 px-4">
                    <div className="container mx-auto max-w-3xl">
                        <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h3>
                        <div className="space-y-2">
                            {content.faqs.map(faq => <AccordionItem key={faq.id} title={faq.question}>{faq.answer}</AccordionItem>)}
                        </div>
                    </div>
                </section>
                
                <section id="contact" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto text-center max-w-3xl">
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h3>
                        <p className="text-slate-600 dark:text-slate-400 mt-4 whitespace-pre-line">{content.contactUs}</p>
                    </div>
                </section>
            </main>
            
            <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
                <div className="space-x-4 mb-4">
                    <button onClick={() => setModalContent({title: "Terms of Service", content: content.termsOfService})} className="hover:text-brand-cyan transition">Terms of Service</button>
                    <button onClick={() => setModalContent({title: "Privacy Policy", content: content.privacyPolicy})} className="hover:text-brand-cyan transition">Privacy Policy</button>
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