export type Lang = 'en' | 'ja';

export type Method = 'GET' | 'DELETE';

export type ImagePurpose = 'main' | 'detail' | 'detail_main';

export interface ImageAsset {
  image_file: string;
  purpose: ImagePurpose;
  order: number;
}

export interface Work {
  id: number;
  title: string;
  description: string;
  main_image: ImageAsset | null;
  images: ImageAsset[];
  is_high_value: boolean;
}

export interface Favorite {
  id: number;
  user: number;
  work: number;
  created_at: string;
}