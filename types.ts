
export enum AlgorithmType {
  RANDOM = 'Random Baseline',
  UCB = 'UCB',
  THOMPSON_SAMPLING = 'Thompson Sampling',
  LINUCB = 'LinUCB (Contextual)'
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  stock: number;
  description: string;
  image: string;
}

export interface UserProfile {
  id: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: string;
  language: 'Bangla' | 'English' | 'Bilingual';
  budget: 'Low' | 'Medium' | 'High';
  priceSensitivity: number; // 0 to 1
  brandLoyalty: number; // 0 to 1
  preferredCategories: string[];
  totalPurchases: number;
  avgRatingPreference: number;
}

export interface Interaction {
  timestamp: number;
  userId: string;
  productId: string;
  algorithm: AlgorithmType;
  type: 'impression' | 'click' | 'purchase';
  reward: number;
  revenue: number;
}

export interface Metrics {
  impressions: number;
  clicks: number;
  purchases: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  aov: number;
}

export type ContextVector = number[]; // 11 dimensions
