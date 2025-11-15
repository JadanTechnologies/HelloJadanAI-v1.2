import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import GenerationProgress from '../components/common/GenerationProgress';
import Card from '../components/common/Card';
import { generateAdCreative as apiGenerateAd } from '../services/geminiService';
import { AD_PLATFORMS, AD_TYPES, CREDIT_COSTS } from '../constants';
import { Generation } from '../types';
import { AdIcon } from '../constants';

const GenerateAd = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState(AD_PLATFORMS[0]);
  const [adType, setAdType] = useState(AD_TYPES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);

  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const creditCost = CREDIT_COSTS.ad;

  const handleProgressUpdate = (p: number, msg: string) => {
    setProgress(p);
    setLoadingMessage(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.credits < creditCost) {
      setError(t('notEnoughCredits'));
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const newGeneration = await apiGenerateAd(prompt, platform, adType, handleProgressUpdate);
      setResult(newGeneration);
      dispatch({ type: 'ADD_GENERATION', payload: newGeneration });
      dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
      dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-ad-${Date.now()}`, description: 'Generated Ad', amount: -creditCost, date: new Date().toISOString() } });
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Product/Service Description</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A new line of eco-friendly sneakers made from recycled materials..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-24"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('platformLabel')}</label>
            <Select options={AD_PLATFORMS} value={platform} onChange={(e) => setPlatform(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('adTypeLabel')}</label>
            <Select options={AD_TYPES} value={adType} onChange={(e) => setAdType(e.target.value)} />
          </div>
          <div className="flex items-center space-x-4">
              <Button type="submit" isLoading={isLoading} disabled={!prompt || isLoading} className="w-full">
                {t('generateButton')}
              </Button>
              <p className="font-semibold whitespace-nowrap">{t('creditCost')}: <span className="text-brand-cyan">{creditCost}</span></p>
          </div>
           {error && <p className="text-red-400 text-sm md:col-span-4">{error}</p>}
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