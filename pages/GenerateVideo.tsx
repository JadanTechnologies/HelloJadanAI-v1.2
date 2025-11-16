import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Spinner from '../components/common/Spinner';
import Card from '../components/common/Card';
import { generateVideo as apiGenerateVideo } from '../services/geminiService';
import { VIDEO_STYLES, VIDEO_DURATIONS, CREDIT_COSTS } from '../constants';
import { Generation, GenerationType } from '../types';
import { VideoIcon } from '../constants';

const GenerateVideo = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(VIDEO_STYLES[0]);
  const [duration, setDuration] = useState(VIDEO_DURATIONS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ready' | 'not_selected'>('checking');

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore - aistudio is available in the execution environment
      if (await window.aistudio.hasSelectedApiKey()) {
        setApiKeyStatus('ready');
      } else {
        setApiKeyStatus('not_selected');
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    // Assume success and optimistically update UI to avoid race conditions
    setApiKeyStatus('ready');
    setError(null);
  };

  // Daily Limit Logic
  const generationType: GenerationType = 'video';
  const dailyLimit = state.systemSettings.dailyGenerationLimits[generationType];
  const today = new Date().toISOString().split('T')[0];
  const lastResetDate = state.user?.dailyGenerations.lastReset.split('T')[0];
  const dailyCount = lastResetDate === today ? state.user?.dailyGenerations[generationType] ?? 0 : 0;
  const remainingToday = dailyLimit - dailyCount;
  const hasExceededDailyLimit = remainingToday <= 0;

  const creditCost = CREDIT_COSTS.video;

  const handleProgressUpdate = (msg: string) => {
    setLoadingMessage(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (state.credits < creditCost) {
      setError(t('notEnoughCredits'));
      return;
    }
    if (hasExceededDailyLimit) {
      setError(`You have reached your daily limit of ${dailyLimit} video generations.`);
      return;
    }
    if (apiKeyStatus !== 'ready') {
      setError('Please select an API key to generate videos.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const newGeneration = await apiGenerateVideo(prompt, style, duration, handleProgressUpdate);
      setResult(newGeneration);
      dispatch({ type: 'ADD_GENERATION', payload: newGeneration });
      dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
      dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-vid-${Date.now()}`, description: 'Generated Video', amount: -creditCost, date: new Date().toISOString() } });
      dispatch({ type: 'INCREMENT_DAILY_GENERATION', payload: { type: generationType } });
    } catch (err: any) {
       if (err.message === "API_KEY_INVALID") {
        setError("Your API key is invalid or has been revoked. Please select a valid key.");
        setApiKeyStatus('not_selected');
      } else {
        setError(err.message || t('generationFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const LoadingState = () => (
      <div className="text-center p-4">
        <Spinner message={loadingMessage} />
        <p className="text-slate-400 mt-4 max-w-sm mx-auto text-sm">{t('videoGenerationNotice')}</p>
      </div>
  );

  const ApiKeySelection = () => (
    <div className="text-center p-4 bg-slate-900 rounded-lg border border-slate-700 animate-fade-in-up">
        <h3 className="font-bold text-white">API Key Required for Veo</h3>
        <p className="text-sm text-slate-400 mt-2">
            Video generation with Veo requires you to use your own Google AI API key.
            Please select a key to proceed.
        </p>
        <p className="text-xs text-slate-500 mt-2">
            Standard charges will apply to your Google Cloud project. 
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline ml-1">
                Learn more about billing.
            </a>
        </p>
        <Button onClick={handleSelectKey} className="mt-4">Select API Key</Button>
    </div>
  );


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('videoGeneratorTitle')}</h1>
        <p className="text-slate-400 mt-1">Bring your ideas to life with motion using Google's Veo model.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          {apiKeyStatus === 'not_selected' ? <ApiKeySelection /> : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('promptPlaceholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-32"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('styleLabel')}</label>
              <Select options={VIDEO_STYLES} value={style} onChange={(e) => setStyle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('durationLabel')} <span className="text-slate-500">(approximate)</span></label>
              <Select options={VIDEO_DURATIONS} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
            <div className="flex items-center justify-between">
              <Button type="submit" isLoading={isLoading} disabled={!prompt || isLoading || hasExceededDailyLimit || apiKeyStatus !== 'ready'}>
                {t('generateButton')}
              </Button>
               <div className="text-right">
                  <p className="font-semibold">{t('creditCost')}: <span className="text-brand-cyan">{creditCost}</span></p>
                  <p className="text-xs text-slate-400">Daily uses left: {remainingToday} / {dailyLimit}</p>
              </div>
            </div>
          </form>
          )}
        </Card>

        <Card className="h-full">
          <div className="flex items-center justify-center w-full aspect-video bg-slate-900 rounded-lg overflow-hidden">
            {isLoading && <LoadingState />}
            {!isLoading && result && (
              <video src={result.url} controls autoPlay loop className="w-full h-full object-contain" />
            )}
             {!isLoading && !result && (
              <div className="text-center text-slate-500 p-4">
                <VideoIcon className="w-16 h-16 mx-auto mb-4"/>
                <p>Your generated video will appear here.</p>
              </div>
            )}
          </div>
          {result && !isLoading && (
            <div className="mt-4 flex space-x-2">
              <a href={result.url} download={`hellojadanai-video-${Date.now()}.mp4`} className="w-full">
                <Button variant="secondary" className="w-full">Download MP4</Button>
              </a>
              <Button variant="secondary" className="flex-1">Share</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GenerateVideo;