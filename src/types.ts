export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export type QualityLevel = 'standard' | 'high' | 'ultra';

export type CreativityLevel = 'balanced' | 'ultra_detail' | 'hyper_realistic';

export interface StyleOption {
  id: string;
  nameUz: string;
  descUz: string;
  iconName: string;
  gradient: string;
  tag: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  fullPrompt?: string;
  style: string;
  aspectRatio: AspectRatio;
  quality: QualityLevel;
  creativity: CreativityLevel;
  createdAt: string;
  modelUsed?: string;
}

export interface PresetPrompt {
  id: string;
  titleUz: string;
  prompt: string;
  style: string;
  aspectRatio: AspectRatio;
  categoryUz: string;
  sampleBadgeUz: string;
  sampleImageUrl?: string;
}
