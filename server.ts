import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));

// Shared Google GenAI client instance on server with required User-Agent
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY topilmadi. AI Studio sozlamalarida API kalitini tekshiring.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Check system status and configuration
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.1-flash-lite-image',
    promptModel: 'gemini-3.8-flash',
  });
});

// API: Enhance Prompt into professional detailed image prompt (Uzbek & English)
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt, style } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt kiritilmadi' });
    }

    const ai = getAIClient();
    const systemInstruction = `Siz professional AI rasm generatori (Image Generation Prompt Engineer) yordamchisisiz.
Foydalanuvchi qisqa yoki oddiy so'zlar kiritadi (masalan o'zbek tilida yoki ingliz tilida: "tog'da turgan mashina").
Vazifangiz:
1. Ushbu promptni matndan-tasvir yaratuvchi ilg'or modellar (Midjourney, Gemini Image, Stable Diffusion) uchun ideal ingliz tilidagi mukammal, o'ta aniq va tasviriy promptga aylantirish (chunki tasvir modellari ingliz tilidagi boy detallarni mukammal tushunadi).
2. Quyidagi jihatlarni boyitish: asosiy ob'ekt, atrof-muhit, yorug'lik turi (masalan golden hour, dramatic cinematic backlight, volumetric rays), kompozitsiya va kamera burchagi (masalan wide-angle lens, 85mm f/1.4, bird-eye view), ranglar palitrasi, materiallar fakturasi va vizual atmosfera (masalan 8k resolution, photorealistic, intricate details).
3. Tanlangan uslub: ${style || 'photorealistic'}.
4. Natijani JSON formatda qaytarish:
{
  "enhancedPrompt": "Ingliz tilidagi boyitilgan mukammal prompt",
  "explanationUz": "O'zbek tilida nimalar qo'shilganligi haqida qisqa (1-2 gap) izoh"
}
Faqat toza JSON qaytaring.`;

    const contents = `Foydalanuvchi prompti: "${prompt.trim()}". Tanlangan uslub: "${style || 'fotorealistik'}".`;

    // Try gemini-3.8-flash first, fallback to gemini-3.1-flash-lite on spike
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });
      responseText = response.text || '';
    } catch (err: any) {
      if (err?.status === 503 || err?.message?.includes('high demand') || err?.message?.includes('503')) {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        responseText = fallbackRes.text || '';
      } else {
        throw err;
      }
    }

    try {
      const parsed = JSON.parse(responseText.trim());
      return res.json({
        enhancedPrompt: parsed.enhancedPrompt || prompt,
        explanationUz: parsed.explanationUz || "Prompt yorug'lik, kompozitsiya va yuqori sifatli detallar bilan boyitildi.",
      });
    } catch {
      return res.json({
        enhancedPrompt: responseText.trim() || prompt,
        explanationUz: "Prompt boyitildi.",
      });
    }
  } catch (error: any) {
    console.error('Enhance prompt error:', error);
    const msg = error?.message || 'Promptni boyitishda xatolik yuz berdi.';
    return res.status(500).json({ error: msg });
  }
});

// API: Generate Image using Google GenAI image model
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      negativePrompt,
      style = 'photorealistic',
      aspectRatio = '1:1',
      quality = 'standard',
      creativity = 'balanced',
      numberOfImages = 1,
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        error: 'Iltimos, rasm yaratish uchun tavsif (prompt) yozing.',
      });
    }

    const ai = getAIClient();

    // Style modifiers mapping to ensure stunning visual results
    const styleModifiers: Record<string, string> = {
      photorealistic: 'photorealistic 8k, hyper-detailed photography, natural studio lighting, ultra-sharp focus, shot on 35mm lens, depth of field',
      cinematic: 'cinematic still, 35mm film grain, dramatic moody lighting, anamorphic lens flare, IMAX composition, cinematic color grading',
      anime: 'modern high-end anime aesthetic, Makoto Shinkai style, vivid vibrant colors, beautiful anime illustration, highly detailed, clean lines',
      '3d': '3D render, Octane render 8k, Unreal Engine 5 aesthetic, volumetric lighting, Ray tracing, smooth textures, subsurface scattering',
      digital_art: 'stunning digital art painting, ArtStation trending, intricate brushstrokes, vibrant atmospheric lighting, epic concept art',
      illustration: 'masterpiece modern vector and editorial illustration, clean elegant shapes, harmonious color palette, aesthetic design',
      fantasy: 'epic high fantasy art, magical ethereal luminescence, enchanted atmospheric glow, mythical detailed environment',
      cyberpunk: 'cyberpunk neon city aesthetic, reflective wet pavement, holograms, volumetric fog, blue and magenta neon lights',
      minimalist: 'minimalist fine art, clean composition, elegant negative space, muted sophisticated tones, balanced geometry',
      oil_painting: 'classic textured oil painting on canvas, visible rich impasto brushwork, dramatic chiaroscuro lighting, museum masterpiece',
    };

    const stylePrefix = styleModifiers[style] || styleModifiers.photorealistic;

    // Compose final prompt
    let fullPrompt = `${prompt.trim()}, ${stylePrefix}`;

    // Add creativity/detail level cues
    if (creativity === 'ultra_detail') {
      fullPrompt += ', extreme intricate micro-details, ultra-high resolution textures, flawless fidelity';
    } else if (creativity === 'hyper_realistic') {
      fullPrompt += ', national geographic award winning photograph, authentic skin pores, lifelike atmosphere, masterwork';
    }

    if (negativePrompt && typeof negativePrompt === 'string' && negativePrompt.trim()) {
      fullPrompt += ` (negative elements to avoid: ${negativePrompt.trim()}, blur, watermark, distortion, extra limbs, low quality)`;
    }

    // Supported aspect ratios in Google GenAI: "1:1", "3:4", "4:3", "9:16", "16:9"
    const validRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Model selection: gemini-3.1-flash-lite-image by default, gemini-nano-banana-2.1 for ultra
    const modelToUse = quality === 'ultra' ? 'gemini-nano-banana-2.1' : 'gemini-3.1-flash-lite-image';

    const count = Math.min(Math.max(Number(numberOfImages) || 1, 1), 4);
    const generatedResults: Array<{ url: string; mimeType: string; prompt: string; id: string; createdAt: string; aspectRatio: string }> = [];

    // Generate requested count of images
    for (let i = 0; i < count; i++) {
      const config: any = {
        imageConfig: {
          aspectRatio: chosenRatio,
        },
      };

      if (quality === 'ultra' && modelToUse === 'gemini-nano-banana-2.1') {
        config.imageConfig.imageSize = '2K';
      }

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config,
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      let foundImage = false;

      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          const base64 = part.inlineData.data;
          const imageUrl = `data:${mime};base64,${base64}`;

          generatedResults.push({
            id: `img_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
            url: imageUrl,
            mimeType: mime,
            prompt: prompt.trim(),
            createdAt: new Date().toISOString(),
            aspectRatio: chosenRatio,
          });
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        const textResp = parts.find((p) => p.text)?.text || '';
        console.warn('Image part not found in model response:', textResp);
      }
    }

    if (generatedResults.length === 0) {
      return res.status(500).json({
        error: "Model javobida tasvir ma'lumotlari topilmadi. Iltimos, promptni o'zgartirib qayta urinib ko'ring.",
      });
    }

    return res.json({
      images: generatedResults,
      modelUsed: modelToUse,
      fullPrompt,
    });
  } catch (error: any) {
    console.error('Generate image error:', error);

    const errorMessage = error?.message || '';
    const isQuotaError =
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('limit: 0');

    if (isQuotaError) {
      return res.status(429).json({
        code: 'QUOTA_EXCEEDED',
        error: "Google Gemini Image modeli uchun bepul kvota cheklovi mavjud (limit: 0). Rasm yaratish uchun Google AI Studio hisobingizda to'lov (Billing/Paid API Key) faollashtirilgan bo'lishi kerak.",
        actionUz: "Sozlamalar (Settings > Secrets) bo'limida to'lov ulangan Gemini API kalitini kiritishingiz yoki tanlashingiz lozim.",
      });
    }

    if (errorMessage.includes('SAFETY') || errorMessage.includes('blocked')) {
      return res.status(400).json({
        code: 'SAFETY_BLOCKED',
        error: "Prompt xavfsizlik filtrlari (Safety Guidelines) tomonidan to'xtatildi. Iltimos, boshqacha tavsif kiriting.",
      });
    }

    return res.status(500).json({
      code: 'GENERATE_FAILED',
      error: `Rasm yaratishda xatolik yuz berdi: ${errorMessage.slice(0, 200)}`,
      actionUz: "Iltimos, bir ozdan so'ng qayta urinib ko'ring yoki promptni soddalashtiring.",
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TasvirAI server ishga tushdi: http://0.0.0.0:${port}`);
  });
}

startServer();
