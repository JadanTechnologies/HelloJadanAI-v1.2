import { Generation, AdCreative } from '../types';

// This is a mock service. In a real application, you would import and use @google/genai.
// For example: import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateImage = async (
  prompt: string, 
  style: string, 
  resolution: string, 
  aspectRatio: string, 
  negativePrompt: string,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating image with prompt: "${prompt}", style: ${style}, resolution: ${resolution}, aspect ratio: ${aspectRatio}, negative prompt: "${negativePrompt}"`);
  
  onProgress(0, "Initializing model...");
  await delay(500);
  
  onProgress(20, "Analyzing prompt...");
  await delay(1000);

  onProgress(50, "Rendering pixels...");
  await delay(1500);
  
  onProgress(85, "Upscaling image...");
  await delay(1000);

  onProgress(100, "Finalizing...");
  await delay(300);

  const getDimensions = (ratio: string, res: string): { width: number, height: number } => {
    const baseSize = res === 'SD' ? 512 : res === 'HD' ? 768 : 1024;
    const parsedRatio = ratio.split(' ')[0];
    const [w, h] = parsedRatio.split(':').map(Number);

    if (w > h) return { width: baseSize, height: Math.round(baseSize * (h / w)) };
    if (h > w) return { width: Math.round(baseSize * (w / h)), height: baseSize };
    return { width: baseSize, height: baseSize };
  }
  
  const { width, height } = getDimensions(aspectRatio, resolution);
  const randomSeed = Math.random().toString(36).substring(7);

  return {
    id: `gen-img-${Date.now()}`,
    type: 'image',
    prompt,
    url: `https://picsum.photos/seed/${randomSeed}/${width}/${height}`,
    createdAt: new Date().toISOString(),
    isFavorite: false,
    style,
    resolution,
    aspectRatio,
    negativePrompt,
  };
};


export const generateVideo = async (
  prompt: string, 
  style: string, 
  duration: string,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
    console.log(`Generating video with prompt: "${prompt}", style: ${style}, duration: ${duration}`);
    
    onProgress(0, "Preparing video engine...");
    await delay(1000);

    onProgress(15, "Generating initial frames...");
    await delay(3000);
    
    onProgress(40, "Rendering motion sequences...");
    await delay(4000);

    onProgress(75, "Encoding video file...");
    await delay(3000);

    onProgress(95, "Adding audio track...");
    await delay(1500);
    
    onProgress(100, "Finalizing...");
    await delay(500);

    return {
        id: `gen-vid-${Date.now()}`,
        type: 'video',
        prompt,
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createdAt: new Date().toISOString(),
        isFavorite: false,
        style,
        duration,
    };
};


export const generateAdCreative = async (
  prompt: string, 
  platform: string, 
  adType: string,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating ad for platform: ${platform}, type: ${adType} with prompt: "${prompt}"`);

  onProgress(0, "Analyzing ad requirements...");
  await delay(500);

  onProgress(25, "Generating ad copy & headlines...");
  await delay(1500);
  
  const mockAdCreative: AdCreative = {
    headline: `Futuristic ${adType} for ${platform}`,
    subheadline: 'Experience the next generation of product.',
    caption: `Check out our amazing new product! #future #tech #${platform.toLowerCase()}`,
    cta: 'Shop Now',
    targetAudience: ['Tech Enthusiasts', 'Early Adopters', 'Ages 18-35'],
  };
  
  onProgress(50, "Generating visual asset...");
  // Simulate image generation progress within the ad generation
  const visualGeneration = await generateImage(
      `A high-quality product shot for a ${adType} on ${platform}: ${prompt}`, 
      'Product', 'HD', '1:1 (Square)', '', 
      (p, m) => onProgress(50 + (p / 2), m) // Scale image progress to fit 50-100% range
  );

  return {
    ...visualGeneration,
    id: `gen-ad-${Date.now()}`,
    type: 'ad',
    adCreative: mockAdCreative,
    platform,
    adType,
  };
};