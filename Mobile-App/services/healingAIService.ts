/**
 * Healing AI Service
 * AI-powered features for healing shlokas including chandas identification,
 * enhanced meanings, and mood-based recommendations
 */

import { aiApi, handleApiError } from './api';

export interface ChandasPattern {
  name: string;
  nameHindi: string;
  syllablesPerLine: number[];
  totalSyllables: number;
  pattern: string;
  characteristics: string;
  emotionalImpact: string;
}

export interface EnhancedMeaning {
  literal: string;
  contextual: string;
  therapeutic: string;
  practicalApplication: string;
}

export interface ShlokaAnalysis {
  chandas: ChandasPattern;
  meaning: EnhancedMeaning;
  moodAlignment: {
    primaryMood: string;
    secondaryMoods: string[];
    effectiveness: number; // 0-100
    reasoning: string;
  };
  benefits: {
    psychological: string[];
    spiritual: string[];
    physical: string[];
  };
}

/**
 * Analyze shloka to identify chandas pattern
 */
export const identifyChandas = async (shloka: string): Promise<ChandasPattern> => {
  try {
    const response = await aiApi.post('/chandas/identify', {
      text: shloka,
      includeAnalysis: true,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error identifying chandas:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Get enhanced meaning and translation for shloka
 */
export const getEnhancedMeaning = async (
  shloka: string,
  context?: string
): Promise<EnhancedMeaning> => {
  try {
    const response = await aiApi.post('/translation/enhanced', {
      text: shloka,
      context: context || 'healing and therapeutic',
      includeTherapeutic: true,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error getting enhanced meaning:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Get complete analysis of shloka including chandas, meaning, and mood alignment
 */
export const analyzeShlokaForHealing = async (
  shloka: string,
  mood: string
): Promise<ShlokaAnalysis> => {
  try {
    const response = await aiApi.post('/healing/analyze', {
      shloka,
      mood,
      includeTherapeutic: true,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error analyzing shloka:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Search shlokas by mood, keywords, or chandas pattern
 */
export const searchShlokas = async (query: {
  keyword?: string;
  mood?: string;
  chandas?: string;
  limit?: number;
}): Promise<any[]> => {
  try {
    const response = await aiApi.post('/healing/search', query);
    return response.data.data;
  } catch (error) {
    console.error('Error searching shlokas:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Get personalized shloka recommendations based on user's mood
 */
export const getPersonalizedRecommendations = async (
  mood: string,
  preferences?: {
    duration?: 'short' | 'medium' | 'long';
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    source?: string[];
  }
): Promise<any[]> => {
  try {
    const response = await aiApi.post('/healing/recommend', {
      mood,
      preferences,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Explain why a specific shloka is effective for a particular mood
 */
export const explainShlokaEffectiveness = async (
  shloka: string,
  mood: string
): Promise<{
  chandasImpact: string;
  psychologicalBenefit: string;
  spiritualConnection: string;
  recommendedPractice: string;
}> => {
  try {
    const response = await aiApi.post('/healing/explain', {
      shloka,
      mood,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error explaining effectiveness:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Get chandas patterns and their therapeutic properties
 */
export const getChandasTherapeuticInfo = async (
  chandasName: string
): Promise<{
  name: string;
  description: string;
  emotionalImpact: string;
  physicalEffects: string;
  bestUsedFor: string[];
  examples: string[];
}> => {
  try {
    const response = await aiApi.get(`/chandas/${chandasName}/therapeutic`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting chandas info:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * Analyze user's chanting and provide feedback
 */
export const analyzeChanting = async (
  audioUri: string,
  expectedShloka: string
): Promise<{
  accuracy: number;
  pronunciation: { score: number; feedback: string };
  rhythm: { score: number; feedback: string };
  chandasAlignment: { score: number; feedback: string };
  overallFeedback: string;
  suggestions: string[];
}> => {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'chanting.m4a',
    } as any);
    formData.append('expectedText', expectedShloka);

    const response = await aiApi.post('/healing/analyze-chanting', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error analyzing chanting:', error);
    throw new Error(handleApiError(error));
  }
};

export default {
  identifyChandas,
  getEnhancedMeaning,
  analyzeShlokaForHealing,
  searchShlokas,
  getPersonalizedRecommendations,
  explainShlokaEffectiveness,
  getChandasTherapeuticInfo,
  analyzeChanting,
};
