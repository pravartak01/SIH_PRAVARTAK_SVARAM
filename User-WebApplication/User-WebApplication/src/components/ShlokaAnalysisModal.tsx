import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Theme Colors
const COLORS = {
  primaryBrown: '#4A2E1C',
  copper: '#B87333',
  gold: '#D4A017',
  saffron: '#DD7A1F',
  sand: '#F3E4C8',
  cream: '#FFF8E7',
  darkBrown: '#2D1810',
  lightCopper: '#D4956B',
  guruColor: '#7B1F1F',
  laghuColor: '#D4A017',
};

interface SyllableBreakdown {
  syllable: string;
  type: 'guru' | 'laghu';
  position: number;
}

interface IdentificationStep {
  step_number: number;
  step_name: string;
  description: string;
  result: string;
}

interface ChandasAPIResponse {
  chandas_name: string;
  syllable_breakdown: SyllableBreakdown[];
  laghu_guru_pattern: string;
  explanation: string;
  confidence: number;
  identification_process: IdentificationStep[];
}

interface AnalysisResult {
  inputText: string;
  chandasName: string;
  syllableBreakdown: SyllableBreakdown[];
  laghuGuruPattern: string;
  explanation: string;
  confidence: number;
  totalSyllables: number;
  guruCount: number;
  laghuCount: number;
  identificationProcess: IdentificationStep[];
}

interface ShlokaAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

type AnalysisStage = 'idle' | 'scanning' | 'syllabification' | 'pattern-detection' | 'classification' | 'complete';

const AI_BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:5001';

export default function ShlokaAnalysisModal({ isOpen, onClose, initialText = '' }: ShlokaAnalysisModalProps) {
  const [inputText, setInputText] = useState(initialText);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'input' | 'results' | 'explanation'>('input');
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');

  useEffect(() => {
    if (initialText && isOpen) {
      setInputText(initialText);
    }
  }, [initialText, isOpen]);

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisStage('scanning');

    try {
      // Simulate stage progression
      setTimeout(() => setAnalysisStage('syllabification'), 500);
      setTimeout(() => setAnalysisStage('pattern-detection'), 1000);
      setTimeout(() => setAnalysisStage('classification'), 1500);

      const response = await fetch(`${AI_BACKEND_URL}/api/chandas/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze chandas');
      }

      const data: ChandasAPIResponse = await response.json();

      const guruCount = data.syllable_breakdown.filter(s => s.type === 'guru').length;
      const laghuCount = data.syllable_breakdown.filter(s => s.type === 'laghu').length;

      const result: AnalysisResult = {
        inputText,
        chandasName: data.chandas_name,
        syllableBreakdown: data.syllable_breakdown,
        laghuGuruPattern: data.laghu_guru_pattern,
        explanation: data.explanation,
        confidence: data.confidence,
        totalSyllables: data.syllable_breakdown.length,
        guruCount,
        laghuCount,
        identificationProcess: data.identification_process,
      };

      setAnalysisResult(result);
      setAnalysisStage('complete');
      setCurrentTab('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze. Please check your backend connection.');
      setAnalysisStage('idle');
    } finally {
      setLoading(false);
    }
  };

  const renderColoredText = () => {
    if (!analysisResult) return null;

    const { inputText, syllableBreakdown } = analysisResult;
    const words = inputText.split(/\s+/);
    let syllableIndex = 0;

    return (
      <div className="text-3xl font-sanskrit leading-relaxed mb-6">
        {words.map((word, wordIdx) => {
          const wordParts: React.ReactNode[] = [];
          let currentWord = word;

          while (currentWord.length > 0 && syllableIndex < syllableBreakdown.length) {
            const syllable = syllableBreakdown[syllableIndex];
            const syllableText = syllable.syllable;

            if (currentWord.startsWith(syllableText)) {
              wordParts.push(
                <span
                  key={`${wordIdx}-${syllableIndex}`}
                  style={{
                    color: syllable.type === 'guru' ? COLORS.guruColor : COLORS.laghuColor,
                    fontWeight: '700',
                  }}
                >
                  {syllableText}
                </span>
              );
              currentWord = currentWord.slice(syllableText.length);
              syllableIndex++;
            } else {
              syllableIndex++;
              if (syllableIndex >= syllableBreakdown.length) break;
            }
          }

          if (currentWord.length > 0) {
            wordParts.push(
              <span key={`${wordIdx}-remaining`} style={{ color: COLORS.primaryBrown }}>
                {currentWord}
              </span>
            );
          }

          return (
            <span key={wordIdx}>
              {wordParts}
              {wordIdx < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    );
  };

  const getStageInfo = () => {
    switch (analysisStage) {
      case 'scanning':
        return { icon: '📖', title: 'Step 1: Text Scanning', desc: 'Reading Sanskrit text' };
      case 'syllabification':
        return { icon: '✂️', title: 'Step 2: Syllable Parsing', desc: 'Breaking text into syllables' };
      case 'pattern-detection':
        return { icon: '🔍', title: 'Step 3: Pattern Analysis', desc: 'Detecting Guru-Laghu patterns' };
      case 'classification':
        return { icon: '✅', title: 'Step 4: Chandas Classification', desc: 'Matching against meter patterns' };
      default:
        return { icon: '🌿', title: 'Initializing Analysis', desc: 'Preparing AI-powered detection' };
    }
  };

  const stageInfo = getStageInfo();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4A2E1C] to-[#B87333] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>✨</span>
                  <span>Chandas Analyzer</span>
                </h2>
                <p className="text-sm text-white/80 mt-1">AI-Powered Sanskrit Meter Detection</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {['input', 'results', 'explanation'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab as any)}
                  disabled={tab !== 'input' && !analysisResult}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    currentTab === tab
                      ? 'bg-white text-[#4A2E1C]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  } ${tab !== 'input' && !analysisResult ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {tab === 'input' && '📝 Input'}
                  {tab === 'results' && '📊 Results'}
                  {tab === 'explanation' && '💡 Explanation'}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4A017] to-[#DD7A1F] flex items-center justify-center mb-6"
                >
                  <span className="text-3xl">{stageInfo.icon}</span>
                </motion.div>
                <h3 className="text-xl font-bold text-[#4A2E1C] mb-2">{stageInfo.title}</h3>
                <p className="text-[#B87333] mb-4">{stageInfo.desc}</p>
                <div className="w-64 h-2 bg-[#F3E4C8] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#D4A017] to-[#DD7A1F]"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            )}

            {/* Input Tab */}
            {!loading && currentTab === 'input' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#4A2E1C] mb-2">
                    Enter Sanskrit Text (Devanagari)
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन..."
                    className="w-full h-40 p-4 border-2 border-[#D4C5A9] rounded-xl font-sanskrit text-lg focus:border-[#D4A017] focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={analyzeText}
                  disabled={!inputText.trim()}
                  className="w-full py-4 bg-gradient-to-r from-[#DD7A1F] to-[#B87333] text-white rounded-xl font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍 Analyze Chandas
                </button>

                {/* Example Texts */}
                <div className="mt-6">
                  <p className="text-sm font-bold text-[#4A2E1C] mb-3">Quick Examples:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
                      'गायत्री छन्दसां मातेति वेदेषु प्रतिष्ठिता',
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputText(example)}
                        className="p-3 text-left bg-[#F3E4C8] hover:bg-[#E6D5B8] rounded-lg text-sm font-sanskrit transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {!loading && currentTab === 'results' && analysisResult && (
              <div className="space-y-6">
                {/* Chandas Name */}
                <div className="bg-gradient-to-br from-[#F3E4C8] to-[#E6D5B8] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#B87333] font-semibold mb-2">Identified Meter</p>
                  <h3 className="text-3xl font-bold text-[#4A2E1C] mb-2">{analysisResult.chandasName}</h3>
                  <div className="flex items-center justify-center gap-4">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-[#D4A017]">
                      {analysisResult.confidence}% Confidence
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-[#B87333]">
                      {analysisResult.totalSyllables} Syllables
                    </span>
                  </div>
                </div>

                {/* Colored Text */}
                <div className="bg-white rounded-xl p-6 border-2 border-[#D4C5A9]">
                  <p className="text-sm font-bold text-[#4A2E1C] mb-4">Syllable Breakdown:</p>
                  {renderColoredText()}
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.guruColor }} />
                      <span className="text-sm font-semibold">Guru ({analysisResult.guruCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.laghuColor }} />
                      <span className="text-sm font-semibold">Laghu ({analysisResult.laghuCount})</span>
                    </div>
                  </div>
                </div>

                {/* Pattern */}
                <div className="bg-white rounded-xl p-6 border-2 border-[#D4C5A9]">
                  <p className="text-sm font-bold text-[#4A2E1C] mb-3">Guru-Laghu Pattern:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.laghuGuruPattern.split('').map((char, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                        style={{
                          backgroundColor: char === 'G' ? COLORS.guruColor : COLORS.laghuColor,
                        }}
                      >
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Explanation Tab */}
            {!loading && currentTab === 'explanation' && analysisResult && (
              <div className="space-y-6">
                <div className="bg-[#F3E4C8] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#4A2E1C] mb-3 flex items-center gap-2">
                    <span>💡</span>
                    <span>How We Identified This Meter</span>
                  </h3>
                  <p className="text-[#6B5D4F] leading-relaxed">{analysisResult.explanation}</p>
                </div>

                {/* Identification Process */}
                {analysisResult.identificationProcess && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#4A2E1C]">Step-by-Step Process:</h3>
                    {analysisResult.identificationProcess.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-4 border-l-4 border-[#D4A017]"
                      >
                        <h4 className="font-bold text-[#4A2E1C] mb-1">
                          {step.step_number}. {step.step_name}
                        </h4>
                        <p className="text-sm text-[#6B5D4F] mb-2">{step.description}</p>
                        <p className="text-sm text-[#B87333] font-semibold">{step.result}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
