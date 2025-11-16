import React, { useState, useContext, useRef } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import InsufficientCreditsError from '../components/common/InsufficientCreditsError';
import GenerationProgress from '../components/common/GenerationProgress';
import Card from '../components/common/Card';
import { generateAdCreative as apiGenerateAd } from '../services/geminiService';
import { AD_PLATFORMS, AD_TYPES, CREDIT_COSTS, UploadIcon } from '../constants';
import { Generation, GenerationType } from '../types';
import { AdIcon } from '../constants';

const GenerateAd = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState(AD_PLATFORMS[0]);
  const [adType, setAdType] = useState(AD_TYPES[0]);
  
  const [visualSource, setVisualSource] = useState<'ai' | 'upload'>('ai');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);

  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Daily Limit Logic
  const generationType: GenerationType = 'ad';
  const dailyLimit = state.systemSettings.dailyGenerationLimits[generationType];
  const today = new Date().toISOString().split('T')[0];
  const lastResetDate = state.user?.dailyGenerations.lastReset.split('T')[0];
  const dailyCount = lastResetDate === today ? state.user?.dailyGenerations[generationType] ?? 0 : 0;
  const remainingToday = dailyLimit - dailyCount;
  const hasExceededDailyLimit = remainingToday <= 0;

  const creditCost = CREDIT_COSTS.ad;

  const handleProgressUpdate = (p: number, msg: string) => {
    setProgress(p);
    setLoadingMessage(msg);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setUploadedImage(file);
        setUploadedImagePreview(URL.createObjectURL(file));
    }
  };

  const clearUploadedImage = () => {
      setUploadedImage(null);
      setUploadedImagePreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
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
    if (visualSource === 'upload' && !uploadedImage) {
        setError('Please upload an image for the ad.');
        return;
    }
    if (hasExceededDailyLimit) {
      setError(`You have reached your daily limit of ${dailyLimit} ad generations.`);
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const imageToUse = visualSource === 'upload' ? uploadedImage : null;
      const newGeneration = await apiGenerateAd(prompt, platform, adType, imageToUse, handleProgressUpdate);
      setResult(newGeneration);
      dispatch({ type: 'ADD_GENERATION', payload: newGeneration });
      dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
      dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-ad-${Date.now()}`, description: 'Generated Ad', amount: -creditCost, date: new Date().toISOString() } });
      dispatch({ type: 'INCREMENT_DAILY_GENERATION', payload: { type: generationType } });
    } catch (err) {
      setError(t('generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const AdCreativeDisplay: React.FC<{ creative: Generation['adCreative'] }> = ({ creative }) => {
    if (!creative) return null;
    return (
        <div className="space-y-4 text-sm">
            <div>
                <h4 className="font-semibold text-slate-300">Headline</h4>
                <p className="text-white p-2 bg-slate-900 rounded">{creative.headline}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-300">Caption</h4>
                <p className="text-white p-2 bg-slate-900 rounded">{creative.caption}</p>
            </div>
             <div>
                <h4 className="font-semibold text-slate-300">Call to Action</h4>
                <p className="text-white p-2 bg-slate-900 rounded">{creative.cta}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-300">Target Audience</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                    {creative.targetAudience.map(tag => <span key={tag} className="bg-brand-indigo/50 text-brand-cyan text-xs font-medium px-2.5 py-0.5 rounded-full">{tag}</span>)}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('adGeneratorTitle')}</h1>
        <p className="text-slate-400 mt-1">Create compelling ad creatives in seconds.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product/Service Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A new line of eco-friendly sneakers made from recycled materials..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-24"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('visualSource')}</label>
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                <button type="button" onClick={() => setVisualSource('ai')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${visualSource === 'ai' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                    {t('aiGenerated')}
                </button>
                <button type="button" onClick={() => setVisualSource('upload')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${visualSource === 'upload' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                    {t('userUploaded')}
                </button>
              </div>
            </div>
            {visualSource === 'upload' && (
                <div>
                   <label className="block text-sm font-medium text-slate-300 mb-2">{t('uploadAdVisual')}</label>
                   {uploadedImagePreview ? (
                     <div className="relative group aspect-square">
                        <img src={uploadedImagePreview} alt="Ad visual preview" className="w-full h-full object-cover rounded-lg" />
                        <button type="button" onClick={clearUploadedImage} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                   ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="w-full h-full min-h-[100px] bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-brand-cyan cursor-pointer">
                        <UploadIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm">Click to upload</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                    </div>
                   )}
                </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('platformLabel')}</label>
                <Select options={AD_PLATFORMS} value={platform} onChange={(e) => setPlatform(e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('adTypeLabel')}</label>
                <Select options={AD_TYPES} value={adType} onChange={(e) => setAdType(e.target.value)} />
            </div>
          </div>
            {showInsufficientCredits && <InsufficientCreditsError message={t('notEnoughCredits')} />}
            {error && !showInsufficientCredits && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
            <div className="flex items-center justify-between">
                <Button type="submit" isLoading={isLoading} disabled={!prompt || isLoading || hasExceededDailyLimit}>
                    {t('generateButton')}
                </Button>
                <div className="text-right">
                    <p className="font-semibold whitespace-nowrap">{t('creditCost')}: <span className="text-brand-cyan">{creditCost}</span></p>
                    <p className="text-xs text-slate-400">Daily uses left: {remainingToday} / {dailyLimit}</p>
                </div>
            </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Generated Visual</h3>
            <div className="flex items-center justify-center w-full aspect-square bg-slate-900 rounded-lg overflow-hidden">
                {isLoading && <GenerationProgress progress={progress} message={loadingMessage} />}
                {!isLoading && result && (
                    <img src={result.url} alt={result.prompt} className="w-full h-full object-contain" />
                )}
                {!isLoading && !result && (
                    <div className="text-center text-slate-500 p-4">
                        <AdIcon className="w-16 h-16 mx-auto mb-4"/>
                        <p>Your ad creative will appear here.</p>
                    </div>
                )}
            </div>
        </Card>
         <Card className="h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Generated Copy</h3>
            {isLoading && <GenerationProgress progress={progress} message={loadingMessage} />}
            {!isLoading && result && <AdCreativeDisplay creative={result.adCreative} />}
            {!isLoading && !result && <p className="text-slate-500">Your ad copy will appear here.</p>}
        </Card>
      </div>
    </div>
  );
};

export default GenerateAd;
