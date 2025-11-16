import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import InsufficientCreditsError from '../components/common/InsufficientCreditsError';
import GenerationProgress from '../components/common/GenerationProgress';
import Card from '../components/common/Card';
import { generateSocialPost as apiGenerateSocialPost } from '../services/geminiService';
import { SOCIAL_PLATFORMS, SOCIAL_TONES, CREDIT_COSTS, ChatBubbleBottomCenterTextIcon } from '../constants';
import { Generation, GenerationType } from '../types';

const GenerateSocialPost = () => {
    const { state, dispatch } = useContext(AppContext);
    const { t } = useTranslation();

    const [prompt, setPrompt] = useState('');
    const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0]);
    const [tone, setTone] = useState(SOCIAL_TONES[0]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
    const [result, setResult] = useState<Generation | null>(null);
    const [copied, setCopied] = useState(false);

    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    const generationType: GenerationType = 'social';
    const dailyLimit = state.systemSettings.dailyGenerationLimits[generationType];
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = state.user?.dailyGenerations?.lastReset?.split('T')[0];
    const dailyCount = lastResetDate === today ? state.user?.dailyGenerations[generationType] ?? 0 : 0;
    const remainingToday = dailyLimit - dailyCount;
    const hasExceededDailyLimit = remainingToday <= 0;

    const creditCost = CREDIT_COSTS.social;

    const handleProgressUpdate = (p: number, msg: string) => {
        setProgress(p);
        setLoadingMessage(msg);
    };
    
    const handleCopy = () => {
        if (result?.socialPost?.content) {
            navigator.clipboard.writeText(result.socialPost.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setShowInsufficientCredits(false);

        if (state.credits < creditCost) {
            setShowInsufficientCredits(true);
            return;
        }
        if (hasExceededDailyLimit) {
            setError(`You have reached your daily limit of ${dailyLimit} social post generations.`);
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const newGeneration = await apiGenerateSocialPost(prompt, platform, tone, handleProgressUpdate);
            setResult(newGeneration);
            dispatch({ type: 'ADD_GENERATION', payload: newGeneration });
            dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
            dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-soc-${Date.now()}`, description: 'Generated Social Post', amount: -creditCost, date: new Date().toISOString() } });
            dispatch({ type: 'INCREMENT_DAILY_GENERATION', payload: { type: generationType } });
        } catch (err) {
            setError(t('generationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font.bold text-white">{t('socialGeneratorTitle')}</h1>
                <p className="text-slate-400 mt-1">Craft the perfect post for your audience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Topic / Idea</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('socialPromptPlaceholder')}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-32"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{t('platformLabel')}</label>
                                <Select options={SOCIAL_PLATFORMS} value={platform} onChange={(e) => setPlatform(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">{t('toneLabel')}</label>
                                <Select options={SOCIAL_TONES} value={tone} onChange={(e) => setTone(e.target.value)} />
                            </div>
                        </div>
                        {showInsufficientCredits && <InsufficientCreditsError message={t('notEnoughCredits')} />}
                        {error && !showInsufficientCredits && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
                        <div className="flex items-center justify-between">
                            <Button type="submit" isLoading={isLoading} disabled={!prompt || isLoading || hasExceededDailyLimit}>
                                {t('generateButton')}
                            </Button>
                            <div className="text-right">
                                <p className="font-semibold">{t('creditCost')}: <span className="text-brand-cyan">{creditCost}</span></p>
                                <p className="text-xs text-slate-400">Daily uses left: {remainingToday} / {dailyLimit}</p>
                            </div>
                        </div>
                    </form>
                </Card>

                <Card>
                    <div className="w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px] p-4">
                        {isLoading ? (
                           <GenerationProgress progress={progress} message={loadingMessage} />
                        ) : result?.socialPost?.content ? (
                            <textarea
                                readOnly
                                value={result.socialPost.content}
                                className="w-full h-80 bg-transparent text-white border-none focus:ring-0 resize-none"
                            />
                        ) : (
                            <div className="text-center text-slate-500 p-8">
                                <ChatBubbleBottomCenterTextIcon className="w-16 h-16 mx-auto mb-4"/>
                                <p>Your generated social post will appear here.</p>
                            </div>
                        )}
                    </div>
                    {result && !isLoading && (
                        <div className="mt-4">
                             <Button variant="secondary" className="w-full" onClick={handleCopy}>
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GenerateSocialPost;
