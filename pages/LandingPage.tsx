import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { ImageIcon, VideoIcon, AdIcon, TaskIcon, CreditIcon } from '../constants';

const Hologram: React.FC = () => {
    const Face: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
        <div className={`absolute w-[200px] h-[200px] bg-brand-cyan/10 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan ${className}`}>
            {children}
        </div>
    );

    return (
        <div className="relative w-[200px] h-[200px] perspective-[1000px] group">
            <div className="w-full h-full relative transform-style-3d animate-hologram-rotate">
                <Face className="transform rotate-y-0 translate-z-[100px]"><ImageIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-y-90 translate-z-[100px]"><VideoIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-y-180 translate-z-[100px]"><AdIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-y-[-90deg] translate-z-[100px]"><TaskIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-x-90 translate-z-[100px]"><CreditIcon className="w-16 h-16" /></Face>
                <Face className="transform rotate-x-[-90deg] translate-z-[100px]"><b className="text-3xl font-bold">AI</b></Face>
            </div>
        </div>
    )
};

const ThemeToggle: React.FC<{ theme: string; toggleTheme: () => void; }> = ({ theme, toggleTheme }) => {
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


const LandingPage: React.FC = () => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy text-slate-800 dark:text-slate-200 overflow-hidden">
            <header className="absolute top-0 left-0 right-0 z-10 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        Hello<span className="text-brand-cyan">Jadan</span>AI
                    </h1>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        <Link to="/login">
                            <Button variant="secondary">{t('loginButton')}</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative flex flex-col items-center justify-center h-screen text-center px-4">
                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/50 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-indigo/10 dark:bg-brand-indigo/20 rounded-full blur-3xl animate-pulse-glow"></div>
                    
                    <div className="z-10">
                        <Hologram />
                    </div>

                    <div className="relative z-10 mt-8">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                            Unlock Your <span className="text-brand-cyan">Creative</span> Potential
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                            Generate stunning AI images, videos, and ads simply by completing tasks. No payment required.
                        </p>
                        <Link to="/login" className="mt-8 inline-block">
                            <Button className="text-lg px-8 py-3">Get Started for Free</Button>
                        </Link>
                    </div>
                </section>
                
                {/* Features Section */}
                <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="container mx-auto">
                         <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">A New Era of Creation</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Everything you need to bring your ideas to life.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card>
                                <ImageIcon className="w-10 h-10 text-brand-cyan mb-4"/>
                                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">AI Image Generator</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Create breathtaking images from text prompts in a variety of styles.</p>
                            </Card>
                            <Card>
                                <VideoIcon className="w-10 h-10 text-brand-cyan mb-4"/>
                                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">AI Video Generator</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Transform your ideas into captivating short videos for any platform.</p>
                            </Card>
                            <Card>
                                <AdIcon className="w-10 h-10 text-brand-cyan mb-4"/>
                                <h4 className="text-xl font-semibold text-slate-900 dark:text-white">AI Ad Creative</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Instantly generate complete ad campaigns, from visuals to copy.</p>
                            </Card>
                        </div>
                    </div>
                </section>

                 {/* How it Works Section */}
                 <section className="py-20 px-4">
                     <div className="container mx-auto text-center">
                         <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Simple, Fun, and Free</h3>
                         <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">Our unique Task-to-Earn system puts creative power in your hands without the cost.</p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:items-center">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-brand-cyan rounded-full text-brand-cyan text-4xl font-bold">1</div>
                                <h4 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">Complete Tasks</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Engage in simple tasks like daily logins or sharing content.</p>
                            </div>
                             <div className="text-brand-cyan/50 hidden md:block">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-brand-cyan rounded-full text-brand-cyan text-4xl font-bold">2</div>
                                <h4 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">Earn Credits</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Watch your credit balance grow with every task you complete.</p>
                            </div>
                             <div className="text-brand-cyan/50 hidden md:block">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </div>
                             <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800 border-2 border-brand-cyan rounded-full text-brand-cyan text-4xl font-bold">3</div>
                                <h4 className="text-xl font-semibold mt-4 text-slate-900 dark:text-white">Create & Innovate</h4>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Use your credits to generate unlimited AI content.</p>
                            </div>
                        </div>
                     </div>
                 </section>
            </main>
            
            <footer className="bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} HelloJadanAI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;