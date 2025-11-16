import { Generation, AdCreative } from '../types';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gemini AI client.
// The API key is securely accessed from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateImage = async (
  prompt: string, 
  style: string, 
  resolution: string, 
  aspectRatio: string, 
  negativePrompt: string,
  sourceImage: File | null,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating image with prompt: "${prompt}", style: ${style}, resolution: ${resolution}, aspect ratio: ${aspectRatio}, negative prompt: "${negativePrompt}"`, sourceImage ? `source image: ${sourceImage.name}` : '');
  
  onProgress(0, sourceImage ? "Analyzing source image..." : "Initializing model...");
  await delay(sourceImage ? 1500 : 500);
  
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
    sourceImageUrl: sourceImage ? URL.createObjectURL(sourceImage) : undefined,
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
  sourceImage: File | null,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating ad for platform: ${platform}, type: ${adType} with prompt: "${prompt}"`, sourceImage ? `with user image: ${sourceImage.name}` : '');

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
  
  let visualGeneration: Generation;

  if (sourceImage) {
      onProgress(50, "Processing uploaded visual...");
      await delay(1000);
      onProgress(100, "Finalizing...");
      await delay(300);
      visualGeneration = {
          id: `gen-upl-${Date.now()}`,
          type: 'image',
          prompt: 'User uploaded image',
          url: URL.createObjectURL(sourceImage),
          createdAt: new Date().toISOString(),
          isFavorite: false,
      };
  } else {
    onProgress(50, "Generating visual asset...");
    visualGeneration = await generateImage(
        `A high-quality product shot for a ${adType} on ${platform}: ${prompt}`, 
        'Product', 'HD', '1:1 (Square)', '', null,
        (p, m) => onProgress(50 + (p / 2), m)
    );
  }

  return {
    ...visualGeneration,
    id: `gen-ad-${Date.now()}`,
    type: 'ad',
    adCreative: mockAdCreative,
    platform,
    adType,
  };
};

export const generateSocialPost = async (
  prompt: string,
  platform: string,
  tone: string,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating social post for ${platform} with tone ${tone} and prompt: "${prompt}" using Gemini API.`);
  
  onProgress(0, "Warming up AI...");
  await delay(200);
  onProgress(30, "Crafting your post...");

  const fullPrompt = `You are a social media expert. Write a compelling and engaging social media post for the platform "${platform}" with a "${tone}" tone of voice. The topic is: "${prompt}". Include relevant hashtags. Do not include any preamble, just return the post content.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    onProgress(100, "Finalizing...");
    await delay(200);

    const content = response.text;

    return {
      id: `gen-soc-${Date.now()}`,
      type: 'social',
      prompt,
      url: '', // Not used for text generation
      createdAt: new Date().toISOString(),
      isFavorite: false,
      socialPost: {
        platform,
        tone,
        content,
      }
    };
  } catch (error) {
    console.error("Error generating social post:", error);
    throw new Error("Failed to generate social post.");
  }
};


export const chatWithAI = async (message: string): Promise<string> => {
  console.log(`Sending message to Gemini chat: "${message}"`);
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
    });
    return response.text;
  } catch (error) {
    console.error("Error with AI chat:", error);
    return "I'm sorry, I encountered an error and can't respond right now.";
  }
};