import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import GenerationProgress from '../components/common/GenerationProgress';
import Card from '../components/common/Card';
import { generateImage as apiGenerateImage } from '../services/geminiService';
import { IMAGE_STYLES, IMAGE_RESOLUTIONS, IMAGE_ASPECT_RATIOS, CREDIT_COSTS, ImageIcon } from '../constants';
import { Generation } from '../types';

const GenerateImage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { t } = useTranslation();
  const location = useLocation();
  
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState(IMAGE_STYLES[0]);
  const [resolution, setResolution] = useState(IMAGE_RESOLUTIONS[0]);
  const [aspectRatio, setAspectRatio] = useState(IMAGE_ASPECT_RATIOS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);

  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    if (location.state) {
      const { prompt, style, resolution, aspectRatio, negativePrompt } = location.state as Generation;
      if (prompt) setPrompt(prompt);
      if (style) setStyle(style);
      if (resolution) setResolution(resolution);
      if (aspectRatio) setAspectRatio(aspectRatio);
      if (negativePrompt) setNegativePrompt(negativePrompt);
    }
  }, [location.state]);


  const creditCost = CREDIT_COSTS.image;

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
      const newGeneration = await apiGenerateImage(prompt, style, resolution, aspectRatio, negativePrompt, handleProgressUpdate);
      setResult(newGeneration);
      dispatch({ type: 'ADD_GENERATION', payload: newGeneration });
      dispatch({ type: 'UPDATE_CREDITS', payload: state.credits - creditCost });
      dispatch({ type: 'ADD_CREDIT_TRANSACTION', payload: { id: `tx-img-${Date.now()}`, description: 'Generated Image', amount: -creditCost, date: new Date().toISOString() } });
    } catch (err) {
      setError(t('generationFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const AspectRatioContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [w, h] = aspectRatio.split(' ')[0].split(':').map(Number);
      const paddingTop = `${(h / w) * 100}%`;
      return (
          <div className="relative w-full" style={{ paddingTop }}>
              <div className="absolute inset-0 flex items-center justify-center">
                  {children}
              </div>
          </div>
      );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{t('imageGeneratorTitle')}</h1>
        <p className="text-slate-400 mt-1">Unleash your imagination and create stunning visuals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('promptPlaceholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-28"
                required
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Negative Prompt <span className="text-slate-500">(optional)</span></label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="e.g., blurry, text, watermark, extra fingers"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-indigo transition duration-300 h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('styleLabel')}</label>
                <Select options={IMAGE_STYLES} value={style} onChange={(e) => setStyle(e.target.value)} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('resolutionLabel')}</label>
                <Select options={IMAGE_RESOLUTIONS} value={resolution} onChange={(e) => setResolution(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
              <Select options={IMAGE_ASPECT_RATIOS} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex items-center justify-between">
              <Button type="submit" isLoading={isLoading} disabled={!prompt || isLoading}>
                {t('generateButton')}
              </Button>
              <p className="font-semibold">{t('creditCost')}: <span className="text-brand-cyan">{creditCost}</span></p>
            </div>
          </form>
        </Card>

        <Card>
          <div className="w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <AspectRatioContainer>
                <div className="w-full h-full bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                    <GenerationProgress progress={progress} message={loadingMessage} />
                </div>
              </AspectRatioContainer>
            ) : result ? (
              <img src={result.url} alt={result.prompt} className="w-full h-auto object-contain" />
            ) : (
              <div className="text-center text-slate-500 p-8 min-h-[300px] flex flex-col justify-center items-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4"/>
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </div>
          {result && !isLoading && (
            <div className="mt-4 flex space-x-2">
              <Button variant="secondary" className="flex-1">Download</Button>
              <Button variant="secondary" className="flex-1">Share</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GenerateImage;