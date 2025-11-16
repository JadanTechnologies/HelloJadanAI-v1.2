import { Generation, AdCreative } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';

// Initialize the Google Gemini AI client.
// The API key is securely accessed from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const generateImage = async (
  prompt: string, 
  style: string, 
  resolution: string, 
  aspectRatio: string, 
  negativePrompt: string,
  sourceImage: File | null,
  onProgress: (progress: number, message: string) => void
): Promise<Generation> => {
  console.log(`Generating image with prompt: "${prompt}", style: ${style}, aspect ratio: ${aspectRatio}`, sourceImage ? `source image: ${sourceImage.name}` : '');
  
  onProgress(0, "Initializing model...");

  try {
      let imageUrl: string;

      if (sourceImage) {
          // Image-to-image generation with gemini-2.5-flash-image
          onProgress(20, "Analyzing source image...");
          const base64Data = await fileToBase64(sourceImage);
          const mimeType = sourceImage.type;

          onProgress(50, "Editing image with AI...");
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: {
                  parts: [
                      { inlineData: { data: base64Data, mimeType } },
                      { text: `A ${style} version of the image. ${prompt}. ${negativePrompt ? `Do not include: ${negativePrompt}` : ''}` },
                  ],
              },
              config: {
                  responseModalities: [Modality.IMAGE],
              },
          });

          onProgress(90, "Finalizing edited image...");
          const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
          if (!imagePart?.inlineData) throw new Error("No image was generated in the response.");
          
          imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      } else {
          // Text-to-image generation with imagen
          onProgress(20, "Analyzing prompt...");
          const rawRatio = aspectRatio.split(' ')[0];
          const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"] as const;
          type ValidRatio = typeof validRatios[number];
          const finalRatio: ValidRatio = validRatios.includes(rawRatio as any) ? rawRatio as ValidRatio : "1:1";

          onProgress(50, "Generating pixels...");
          const response = await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: `A ${style} image of ${prompt}. ${negativePrompt ? `Negative prompt: ${negativePrompt}` : ''}`,
              config: {
                  numberOfImages: 1,
                  aspectRatio: finalRatio,
              },
          });

          onProgress(90, "Finalizing...");
          const base64ImageBytes = response.generatedImages[0].image.imageBytes;
          imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      }

      onProgress(100, "Done!");

      return {
          id: `gen-img-${Date.now()}`,
          type: 'image',
          prompt,
          url: imageUrl,
          createdAt: new Date().toISOString(),
          isFavorite: false,
          style,
          resolution,
          aspectRatio,
          negativePrompt,
          sourceImageUrl: sourceImage ? URL.createObjectURL(sourceImage) : undefined,
      };

  } catch (error) {
      console.error("Error generating image with Gemini:", error);
      onProgress(100, "An error occurred.");
      throw new Error("Image generation failed. Please check the console for more details.");
  }
};


export const generateVideo = async (
  prompt: string, 
  style: string, 
  duration: string,
  onProgress: (message: string) => void
): Promise<Generation> => {
    onProgress("Initializing video generation...");
    // Must create a new instance to get the latest key from the dialog
    const aiWithUserKey = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    let operation;
    try {
        operation = await aiWithUserKey.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `A ${style} video of: ${prompt}`,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });
    } catch (error: any) {
         if (error.message && error.message.includes("API key not valid")) {
             throw new Error("API_KEY_INVALID");
         }
         throw error;
    }

    onProgress("Video generation is queued. This may take a few minutes...");

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
            operation = await aiWithUserKey.operations.getVideosOperation({ operation: operation });
            onProgress(`Processing... Status: ${operation.metadata?.state || 'Unknown'}`);
        } catch (error: any) {
            if (error.message && error.message.includes("Requested entity was not found.")) {
                throw new Error("API_KEY_INVALID");
            }
            throw error;
        }
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    onProgress("Finalizing video...");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("No video URI found in the response.");
    }
    
    // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
        id: `gen-vid-${Date.now()}`,
        type: 'video',
        prompt,
        url: videoUrl,
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
    // This now calls the real generateImage, but for simplicity of the mock, we'll keep it self-contained.
    // In a real scenario, you'd likely call the actual generateImage function.
    await delay(3000);
    visualGeneration = {
        id: `gen-ad-img-${Date.now()}`,
        type: 'image',
        prompt: `A high-quality product shot for a ${adType} on ${platform}: ${prompt}`,
        url: 'https://picsum.photos/seed/ad-visual/512/512',
        createdAt: new Date().toISOString(),
        isFavorite: false
    };
    onProgress(100, "Visual ready.");
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
  
  onProgress(30, "Crafting your post...");

  const fullPrompt = `You are a social media expert. Write a compelling and engaging social media post for the platform "${platform}" with a "${tone}" tone of voice. The topic is: "${prompt}". Include relevant hashtags. Do not include any preamble, just return the post content.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    onProgress(100, "Finalizing...");

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