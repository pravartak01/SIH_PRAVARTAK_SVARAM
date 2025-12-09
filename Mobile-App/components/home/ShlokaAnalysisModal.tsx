import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { AI_BACKEND_URL, aiApi } from '../../services/api';
import { ALL_SHLOKAS } from '../../data/shlokas';
import { BotpressChatbot } from './BotpressChatbot';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = SCREEN_WIDTH > 768;

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

interface ShlokaAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
}

// API Response Types
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

interface MeaningExtractionResponse {
  translation: string;
  word_meanings: { [key: string]: string };
  context: string;
  notes: string;
  manifestation_of_chandas?: string;
  unique_facts?: string;
  unknown_facts?: string;
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

// Analysis Stage for progressive animation
type AnalysisStage = 'idle' | 'scanning' | 'syllabification' | 'pattern-detection' | 'classification' | 'complete';

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
}

// Audio file mapping - maps shloka IDs to audio file names in ShlokaAudios folder
const audioFileMap: Record<string, string> = {
  'gayatri-mantra': 'gayaytri mantra.mp3',
  'mahamrityunjaya-mantra': 'mahamrityunjay_mantra.mp3',
  'shanti-mantra': 'shanti mantra.mp3',
  'vakratunda-shloka': 'vakratunda.mp3',
  'asato-ma-mantra': 'astoma.mp3',
  'saraswati-vandana': 'Saraswati vandana.mp3',
  'om-namah-shivaya': 'om namah shivaya.mp3',
  'guru-brahma': 'Guru bramha.mp3',
  'hare-krishna-mantra': 'hare krishna.mp3',
};

// Icon mapping for different shloka categories
const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'vedic mantras': return 'sunny-outline';
    case 'upanishadic': return 'book-outline';
    case 'devotional': return 'heart-outline';
    default: return 'flower-outline';
  }
};

// Demo Shloka Examples - All shlokas from library
const demoShlokas = ALL_SHLOKAS.map(shloka => ({
  id: shloka.id,
  title: shloka.title,
  text: shloka.lines.map(line => line.text).join(' '),
  description: shloka.description.substring(0, 60) + '...',
  iconName: getCategoryIcon(shloka.category),
  audioFile: audioFileMap[shloka.id] || null,
  category: shloka.category,
}));

// Floating Particle Component
const FloatingParticle = ({ particle, initialX, initialY }: { 
  particle: Particle; 
  initialX: number; 
  initialY: number;
}) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        opacity: particle.opacity,
        transform: [
          { translateX: particle.x },
          { translateY: particle.y },
          { scale: particle.scale }
        ],
      }}
    >
      <Ionicons name="sparkles" size={20} color={COLORS.gold} />
    </Animated.View>
  );
};

// Colored Syllable Text Component - Shows Guru (Red) and Laghu (Green)
const ColoredSyllableText = ({ 
  text, 
  syllableBreakdown 
}: { 
  text: string;
  syllableBreakdown?: SyllableBreakdown[];
}) => {
  if (!syllableBreakdown || syllableBreakdown.length === 0) {
    return (
      <Text style={{
        color: COLORS.primaryBrown,
        fontSize: 16,
        lineHeight: 26,
        textAlign: 'center',
        fontWeight: '600',
      }}>
        {text}
      </Text>
    );
  }

  // Split text into words
  const words = text.split(/\s+/);
  let syllableIndex = 0;

  return (
    <Text style={{
      fontSize: 16,
      lineHeight: 26,
      textAlign: 'center',
      fontWeight: '600',
    }}>
      {words.map((word, wordIdx) => {
        const wordParts: React.ReactNode[] = [];
        let currentWord = word;
        
        // For each syllable in this word
        while (currentWord.length > 0 && syllableIndex < syllableBreakdown.length) {
          const syllable = syllableBreakdown[syllableIndex];
          const syllableText = syllable.syllable;
          
          if (currentWord.startsWith(syllableText)) {
            // Add colored syllable
            wordParts.push(
              <Text
                key={`${wordIdx}-${syllableIndex}`}
                style={{
                  color: syllable.type === 'guru' ? COLORS.guruColor : COLORS.laghuColor,
                  fontWeight: '700',
                }}
              >
                {syllableText}
              </Text>
            );
            currentWord = currentWord.slice(syllableText.length);
            syllableIndex++;
          } else {
            // If syllable doesn't match, move to next
            syllableIndex++;
            if (syllableIndex >= syllableBreakdown.length) break;
          }
        }
        
        // Add remaining part of word if any
        if (currentWord.length > 0) {
          wordParts.push(
            <Text key={`${wordIdx}-remaining`} style={{ color: COLORS.primaryBrown }}>
              {currentWord}
            </Text>
          );
        }
        
        // Add space after word (except last word)
        return (
          <Text key={wordIdx}>
            {wordParts}
            {wordIdx < words.length - 1 ? ' ' : ''}
          </Text>
        );
      })}
    </Text>
  );
};

// Mathematical Analysis Animation Component
const MathematicalAnalysisAnimation = ({ 
  stage, 
  text 
}: { 
  stage: AnalysisStage; 
  text: string;
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Rotation animation (uses native driver)
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotate.start();

    // Progress bar animation (cannot use native driver due to width property)
    const progress = Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      })
    );
    progress.start();

    // Scanning line animation
    const scanAnimation = Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    scanAnimation.start();

    // Glow pulse
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();

    // Generate particles
    const particleArray: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      initialX: Math.random() * SCREEN_WIDTH,
      initialY: Math.random() * 300,
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    }));

    setParticles(particleArray);

    // Animate particles
    particleArray.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 800,
              easing: Easing.out(Easing.back(2)),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.y, {
              toValue: -50,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 1000,
              delay: 1000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    return () => {
      rotate.stop();
      progress.stop();
      scanAnimation.stop();
      glow.stop();
    };
  }, [rotateAnim, progressAnim, scanLineAnim, glowAnim]);

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const getStageInfo = () => {
    switch (stage) {
      case 'scanning':
        return { 
          iconName: 'scan-outline', 
          title: 'Step 1: Text Scanning', 
          desc: 'Parsing Devanagari script and removing punctuation',
          detail: 'Converting UTF-8 characters → Sanskrit phonemes'
        };
      case 'syllabification':
        return { 
          iconName: 'analytics-outline', 
          title: 'Step 2: Syllabification', 
          desc: 'Breaking text into syllables (वर्ण-विच्छेद)',
          detail: 'Identifying vowel-consonant clusters & conjuncts'
        };
      case 'pattern-detection':
        return { 
          iconName: 'grid-outline', 
          title: 'Step 3: Pattern Detection', 
          desc: 'Analyzing Guru (ग) and Laghu (ल) weights',
          detail: 'Calculating मात्रा (syllable duration) for each unit'
        };
      case 'classification':
        return { 
          iconName: 'checkmark-circle-outline', 
          title: 'Step 4: Chandas Classification', 
          desc: 'Matching against 50+ known meter patterns',
          detail: 'AI comparing with Vedic prosody database'
        };
      default:
        return { 
          iconName: 'leaf-outline', 
          title: 'Initializing Analysis', 
          desc: 'Preparing AI-powered chandas detection',
          detail: 'Loading Sanskrit prosody engine...'
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <View style={{ alignItems: 'center', paddingVertical: 30 }}>
      {/* Particle effects */}
      <View style={{ position: 'absolute', width: SCREEN_WIDTH, height: 300 }}>
        {particles.map((particle) => (
          <FloatingParticle 
            key={particle.id} 
            particle={particle} 
            initialX={particle.initialX}
            initialY={particle.initialY}
          />
        ))}
      </View>

      {/* Main analysis container */}
      <View style={{
        width: SCREEN_WIDTH - 80,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 2,
        borderColor: COLORS.gold,
        shadowColor: COLORS.gold,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
      }}>
        {/* Animated glow border */}
        <Animated.View style={{
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          borderRadius: 24,
          borderWidth: 2,
          borderColor: COLORS.saffron,
          opacity: glowOpacity,
        }} />

        {/* Stage icon with rotation */}
        <Animated.View style={{
          alignSelf: 'center',
          marginBottom: 16,
          transform: [{
            rotate: rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          }],
        }}>
          <LinearGradient
            colors={[COLORS.gold, COLORS.saffron]}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name={stageInfo.iconName as any} size={32} color={COLORS.darkBrown} />
          </LinearGradient>
        </Animated.View>

        {/* Stage title */}
        <Text style={{
          color: COLORS.primaryBrown,
          fontSize: 20,
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          {stageInfo.title}
        </Text>

        <Text style={{
          color: COLORS.copper,
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 8,
        }}>
          {stageInfo.desc}
        </Text>
        
        <Text style={{
          color: COLORS.lightCopper,
          fontSize: 12,
          textAlign: 'center',
          marginBottom: 20,
          fontStyle: 'italic',
        }}>
          {stageInfo.detail}
        </Text>

        {/* Text display with scan line */}
        <View style={{
          backgroundColor: COLORS.cream,
          borderRadius: 16,
          padding: 16,
          minHeight: 100,
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <Text style={{
            color: COLORS.primaryBrown,
            fontSize: 16,
            lineHeight: 26,
            textAlign: 'center',
            fontWeight: '600',
          }}>
            {text}
          </Text>
          
          {/* Animated scanning line */}
          <Animated.View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: COLORS.saffron,
            opacity: 0.6,
            transform: [{ translateY: scanLineTranslateY }],
          }} />
        </View>

        {/* Progress indicators */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
        }}>
          {['scanning', 'syllabification', 'pattern-detection', 'classification'].map((s, idx) => (
            <View
              key={s}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: stage === s || idx < ['scanning', 'syllabification', 'pattern-detection', 'classification'].indexOf(stage as string)
                  ? COLORS.gold
                  : COLORS.sand,
              }}
            />
          ))}
        </View>

        {/* Mathematical formula display */}
        <View style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: `${COLORS.gold}15`,
          borderRadius: 12,
          borderLeftWidth: 3,
          borderLeftColor: COLORS.gold,
        }}>
          <Text style={{
            color: COLORS.primaryBrown,
            fontSize: 11,
            fontFamily: 'monospace',
            textAlign: 'center',
          }}>
            {stage === 'pattern-detection' && 'Pattern = f(syllable_weight, position)'}
            {stage === 'classification' && 'Chandas ∈ {Anuṣṭup, Triṣṭup, Jagatī, ...}'}
            {stage === 'syllabification' && 'Σ syllables = count(vowel_units)'}
            {stage === 'scanning' && 'Input → UTF-8 Devanagari Parser'}
          </Text>
        </View>
      </View>

      {/* Bottom progress bar */}
      <View style={{
        width: SCREEN_WIDTH - 80,
        height: 4,
        backgroundColor: COLORS.sand,
        borderRadius: 2,
        marginTop: 20,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: '100%',
          backgroundColor: COLORS.gold,
          width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['30%', '95%'],
          }),
        }} />
      </View>

      <Text style={{
        color: COLORS.copper,
        fontSize: 13,
        marginTop: 12,
        fontStyle: 'italic',
      }}>
        Processing with AI-powered Sanskrit prosody engine
      </Text>
    </View>
  );
};

// Static Syllable Chip Component - Easy to Read
const SyllableChip = ({ syllable, type }: { 
  syllable: string; 
  type: 'guru' | 'laghu'; 
}) => {
  const isGuru = type === 'guru';
  
  return (
    <View>
      <LinearGradient
        colors={isGuru ? [COLORS.guruColor, '#5A1515'] : [COLORS.laghuColor, '#B8860B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 14,
          margin: 4,
          shadowColor: isGuru ? COLORS.guruColor : COLORS.laghuColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 5,
          minWidth: 50,
          alignItems: 'center',
        }}
      >
        <Text style={{ 
          color: '#FFF', 
          fontSize: 18, 
          fontWeight: '700',
          textAlign: 'center',
          textShadowColor: 'rgba(0,0,0,0.2)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}>
          {syllable}
        </Text>
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.3)',
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 8,
          marginTop: 4,
        }}>
          <Text style={{ 
            color: '#FFF', 
            fontSize: 9, 
            fontWeight: '700',
            opacity: 0.9,
          }}>
            {isGuru ? '●●' : '○'}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

// Static Pattern Display - Easy to Read
const PatternDisplay = ({ pattern }: { pattern: string }) => {
  const chars = pattern.replace(/\./g, '').split('');
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'center',
      backgroundColor: COLORS.cream,
      padding: 16,
      borderRadius: 16,
      marginTop: 12,
    }}>
      {chars.map((char, idx) => {
        const isGuru = char === 'G';
        
        return (
          <View
            key={idx}
            style={{ margin: 3 }}
          >
            <LinearGradient
              colors={isGuru 
                ? [COLORS.guruColor, '#5A1515', COLORS.guruColor] 
                : [COLORS.laghuColor, '#B8860B', COLORS.laghuColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: isGuru ? COLORS.guruColor : COLORS.laghuColor,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 6,
              }}
            >
              <Text style={{ 
                color: '#FFF', 
                fontWeight: '800',
                fontSize: 16,
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}>
                {char}
              </Text>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );
};

// Process Step Card Component - Creative Timeline Display
const ProcessStepCard = ({ step, index, total }: { 
  step: IdentificationStep; 
  index: number;
  total: number;
}) => {
  const stepColors = [
    { bg: '#EEF2FF', border: '#818CF8', icon: '#4F46E5' }, // Indigo
    { bg: '#F0FDF4', border: '#86EFAC', icon: '#16A34A' }, // Green
    { bg: '#FEF3C7', border: '#FCD34D', icon: '#D97706' }, // Amber
    { bg: '#FCE7F3', border: '#F9A8D4', icon: '#DB2777' }, // Pink
    { bg: '#DBEAFE', border: '#93C5FD', icon: '#2563EB' }, // Blue
  ];
  
  const color = stepColors[index % stepColors.length];
  const isLast = index === total - 1;
  
  const stepIcons = ['document-text-outline', 'cut-outline', 'analytics-outline', 'git-compare-outline', 'checkmark-done-outline'];
  const icon = stepIcons[index] || 'ellipse-outline';
  
  return (
    <View style={{ marginBottom: isLast ? 0 : 20 }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Timeline indicator */}
        <View style={{ alignItems: 'center', marginRight: 16 }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: color.bg,
            borderWidth: 3,
            borderColor: color.border,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: color.icon,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          }}>
            <Ionicons name={icon as any} size={24} color={color.icon} />
          </View>
          {!isLast && (
            <View style={{
              width: 3,
              flex: 1,
              backgroundColor: color.border,
              marginTop: 8,
              minHeight: 60,
              opacity: 0.4,
            }} />
          )}
        </View>
        
        {/* Content card */}
        <View style={{ flex: 1 }}>
          <View style={{
            backgroundColor: '#FFF',
            borderRadius: 16,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: color.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}>
            {/* Step header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: color.bg,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                marginRight: 10,
              }}>
                <Text style={{ 
                  color: color.icon, 
                  fontWeight: '800', 
                  fontSize: 12 
                }}>
                  STEP {step.step_number}
                </Text>
              </View>
              <Text style={{
                color: COLORS.primaryBrown,
                fontSize: 16,
                fontWeight: '700',
                flex: 1,
              }}>
                {step.step_name}
              </Text>
            </View>
            
            {/* Description */}
            <Text style={{
              color: COLORS.copper,
              fontSize: 13,
              lineHeight: 20,
              marginBottom: 12,
            }}>
              {step.description}
            </Text>
            
            {/* Result box */}
            <View style={{
              backgroundColor: color.bg,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: color.border,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="checkmark-circle" size={16} color={color.icon} />
                <Text style={{
                  color: color.icon,
                  fontSize: 11,
                  fontWeight: '700',
                  marginLeft: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Result
                </Text>
              </View>
              <Text style={{
                color: COLORS.primaryBrown,
                fontSize: 13,
                lineHeight: 20,
                fontWeight: '500',
              }}>
                {step.result}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ShlokaAnalysisModal({ visible, onClose }: ShlokaAnalysisModalProps) {
  const [inputShloka, setInputShloka] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [meaningResult, setMeaningResult] = useState<MeaningExtractionResponse | null>(null);
  const [isExtractingMeaning, setIsExtractingMeaning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');
  const [isListening, setIsListening] = useState(false);
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [recordingObject, setRecordingObject] = useState<Audio.Recording | null>(null);
  const [liveSyllables, setLiveSyllables] = useState<SyllableBreakdown[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
      if (recordingObject) {
        recordingObject.stopAndUnloadAsync();
      }
    };
  }, [soundObject, recordingObject]);

  useEffect(() => {
    if (analysisResult) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Scroll to results
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [analysisResult, fadeAnim]);

  // Audio playback function
  const playAudio = async (audioFileName: string) => {
    try {
      // Stop any currently playing audio
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }

      const audioPath = `../../../ShlokaAudios/${audioFileName}`;
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true }
      );
      
      setSoundObject(sound);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setSoundObject(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Could not play audio file');
    }
  };

  // Functional voice recording with speech-to-text
  const startVoiceRecognition = async () => {
    try {
      setIsListening(true);
      setError(null);

      // Request microphone permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Microphone permission is required for voice input');
        setIsListening(false);
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      
      await recording.startAsync();
      setRecordingObject(recording);
      
      Alert.alert(
        '🎤 Recording Started',
        'Speak your shloka clearly in Sanskrit. Tap "Stop Recording" button when finished.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Voice recognition error:', error);
      Alert.alert(
        'Recording Error',
        'Could not start recording. Please check microphone permissions.',
      );
      setIsListening(false);
    }
  };

  // Stop recording and transcribe
  const stopVoiceRecognition = async () => {
    try {
      if (!recordingObject) {
        setIsListening(false);
        return;
      }

      // Stop recording and get URI
      await recordingObject.stopAndUnloadAsync();
      const uri = recordingObject.getURI();
      setRecordingObject(null);
      
      if (!uri) {
        Alert.alert('Error', 'Recording file not found');
        setIsListening(false);
        return;
      }

      // Show processing message
      Alert.alert(
        '🔄 Processing Audio',
        'Transcribing your speech to text... Please wait.',
        [{ text: 'OK' }]
      );

      // Send audio to speech-to-text API
      await transcribeAudio(uri);
      
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process recording');
      setIsListening(false);
    }
  };

  // Transcribe audio using backend API
  const transcribeAudio = async (audioUri: string) => {
    try {
      // Read audio file as base64
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send to backend for transcription
      const response = await aiApi.post('/speech/transcribe', {
        audio_data: base64Audio,
        language: 'sa', // Sanskrit
        format: 'm4a',
      });

      if (response.data && response.data.text) {
        setInputShloka(response.data.text);
        Alert.alert(
          '✅ Transcription Complete',
          'Your speech has been converted to text. You can now analyze it!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Speech Detected',
          'Could not detect any speech. Please try speaking more clearly.',
        );
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      let errorMessage = 'Failed to transcribe audio.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to transcription service. Please check your backend is running.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      Alert.alert(
        'Transcription Failed',
        errorMessage + '\n\nPlease type the shloka manually instead.',
      );
    } finally {
      setIsListening(false);
    }
  };

  // Pick and transcribe audio file
  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*', 'audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/wav'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'cancel') {
        return;
      }

      if (result.type === 'success') {
        Alert.alert(
          '🔄 Processing Audio File',
          'Transcribing audio to text... This may take a moment.',
          [{ text: 'OK' }]
        );

        // Transcribe the uploaded audio file
        await transcribeAudio(result.uri);
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert(
        'File Selection Error',
        'Could not open file picker. Please try again.',
      );
    }
  };

  const extractMeaning = async (text: string) => {
    if (!text.trim()) {
      Alert.alert('Error', 'No text to extract meaning from');
      return;
    }

    setIsExtractingMeaning(true);
    setError(null);

    try {
      console.log('🔍 Extracting meaning from:', text.trim());
      
      const response = await aiApi.post('/meaning/extract', {
        verse: text.trim(),
        include_word_meanings: true,
        include_context: true,
        include_manifestation: true,
        include_unique_facts: true,
        include_unknown_facts: true,
      });
      
      console.log('✅ Meaning response:', response.data);
      setMeaningResult(response.data);
      
      // Scroll to show meaning section
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
      
    } catch (err: unknown) {
      console.error('❌ Meaning extraction error:', err);
      let errorMessage = 'Failed to extract meaning';
      
      if (err && typeof err === 'object') {
        const error = err as any;
        
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          errorMessage = `Cannot connect to AI server.\n\nPlease ensure the AI backend is running on port 8000`;
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail[0]?.msg || error.response.data.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      Alert.alert('Meaning Extraction Error', errorMessage);
    } finally {
      setIsExtractingMeaning(false);
    }
  };

  const analyzeShloka = async (text: string) => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter a shloka to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setLiveSyllables([]);
    fadeAnim.setValue(0);

    // Scroll down to show animation box
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 600, animated: true });
    }, 100);

    // Start animation immediately
    const stages: AnalysisStage[] = ['scanning', 'syllabification', 'pattern-detection', 'classification'];
    let currentStageIndex = 0;
    
    // Set first stage immediately
    setAnalysisStage(stages[0]);
    currentStageIndex = 1;

    const stageInterval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        setAnalysisStage(stages[currentStageIndex]);
        currentStageIndex++;
      }
    }, 1200);

    // Record start time to ensure minimum animation duration
    const startTime = Date.now();
    const MIN_ANIMATION_DURATION = 4800; // 1200ms × 4 stages

    try {
      console.log('🔍 Sending request to:', `${AI_BACKEND_URL}/chandas/identify`);
      console.log('📝 Request body:', { shloka: text.trim() });
      
      // Force fresh API call - prevent caching
      const timestamp = new Date().getTime();
      const response = await aiApi.post('/chandas/identify', { 
        shloka: text.trim(),
        _t: timestamp
      });
      
      console.log('📨 Response status:', response.status);
      
      const data: ChandasAPIResponse = response.data;
      console.log('✅ Response data:', data);
      
      // Update live syllables for colored display
      setLiveSyllables(data.syllable_breakdown);
      
      // Calculate stats from syllable breakdown
      const guruCount = data.syllable_breakdown.filter(s => s.type === 'guru').length;
      const laghuCount = data.syllable_breakdown.filter(s => s.type === 'laghu').length;
      
      const result: AnalysisResult = {
        inputText: text,
        chandasName: data.chandas_name,
        syllableBreakdown: data.syllable_breakdown,
        laghuGuruPattern: data.laghu_guru_pattern,
        explanation: data.explanation,
        confidence: data.confidence,
        totalSyllables: data.syllable_breakdown.length,
        guruCount,
        laghuCount,
        identificationProcess: data.identification_process || [],
      };
      
      // Calculate how long to wait to complete minimum animation duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_ANIMATION_DURATION - elapsedTime);
      
      console.log(`⏱️ API took ${elapsedTime}ms, waiting ${remainingTime}ms more for animation`);
      
      // Wait for remaining animation time
      setTimeout(() => {
        clearInterval(stageInterval);
        setAnalysisStage('complete');
        
        // Additional delay before showing results for smooth transition
        setTimeout(() => {
          setAnalysisResult(result);
          setIsAnalyzing(false);
        }, 800);
      }, remainingTime);
      
    } catch (err: unknown) {
      clearInterval(stageInterval);
      console.error('❌ Analysis error:', err);
      let errorMessage = 'Failed to analyze shloka';
      
      if (err && typeof err === 'object') {
        const error = err as any;
        
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          errorMessage = 'Request timed out. The AI server might be busy. Please try again.';
        } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          errorMessage = `Cannot connect to AI server.\n\nPlease ensure:\n1. AI backend is running on port 8000\n2. Phone is on same WiFi as computer\n3. Firewall allows port 8000`;
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail[0]?.msg || error.response.data.message || errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      Alert.alert('Analysis Error', errorMessage);
      setAnalysisStage('idle');
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setInputShloka('');
    setAnalysisResult(null);
    setMeaningResult(null);
    setError(null);
    setAnalysisStage('idle');
    fadeAnim.setValue(0);
    onClose();
  };

  const clearResults = () => {
    setAnalysisResult(null);
    setMeaningResult(null);
    setError(null);
    setAnalysisStage('idle');
    setLiveSyllables([]);
    fadeAnim.setValue(0);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <ScrollView 
          ref={scrollViewRef}
          style={{ flex: 1 }} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Gradient Header */}
          <LinearGradient
            colors={[COLORS.primaryBrown, COLORS.darkBrown]}
            style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="leaf" size={isWeb && isLargeScreen ? 32 : 24} color={COLORS.gold} style={{ marginRight: 10 }} />
                <Text style={{ 
                  color: '#FFF', 
                  fontSize: isWeb && isLargeScreen ? 32 : 24, 
                  fontWeight: '800',
                  letterSpacing: 0.5,
                }}>
                  Chandas Identifier
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  padding: 8, 
                  borderRadius: 20,
                }}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: isWeb && isLargeScreen ? 18 : 15, 
              lineHeight: isWeb && isLargeScreen ? 28 : 22,
              marginTop: 8,
            }}>
              Discover the prosodic meter of Sanskrit shlokas with AI-powered analysis
            </Text>
            
            {/* Stats Banner */}
            <View style={{ 
              flexDirection: 'row', 
              marginTop: 20,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: isWeb && isLargeScreen ? 20 : 16,
              padding: isWeb && isLargeScreen ? 24 : 16,
            }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="library" size={isWeb && isLargeScreen ? 32 : 24} color={COLORS.gold} />
                <Text style={{ 
                  color: 'white', 
                  fontSize: isWeb && isLargeScreen ? 28 : 20, 
                  fontWeight: '800',
                  marginTop: 8,
                }}>50+</Text>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isWeb && isLargeScreen ? 14 : 12,
                  marginTop: 4,
                }}>Chandas Types</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="analytics" size={isWeb && isLargeScreen ? 32 : 24} color={COLORS.gold} />
                <Text style={{ 
                  color: 'white', 
                  fontSize: isWeb && isLargeScreen ? 28 : 20, 
                  fontWeight: '800',
                  marginTop: 8,
                }}>AI</Text>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  fontSize: isWeb && isLargeScreen ? 14 : 12,
                  marginTop: 4,
                }}>Powered</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="flash" size={isWeb && isLargeScreen ? 32 : 24} color={COLORS.gold} />
                <Text style={{ 
                  color: 'white', 
                  fontSize: isWeb && isLargeScreen ? 28 : 20, 
                  fontWeight: '800',
                  marginTop: 8,
                }}>98%</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Accuracy</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Input Section */}
          <View style={{ 
            padding: isWeb && isLargeScreen ? 40 : 20,
            maxWidth: isWeb && isLargeScreen ? 1200 : '100%',
            marginHorizontal: 'auto',
            width: '100%',
          }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: isWeb && isLargeScreen ? 20 : 12,
            }}>
              <Ionicons name="create-outline" size={isWeb && isLargeScreen ? 28 : 20} color={COLORS.primaryBrown} />
              <Text style={{ 
                color: COLORS.primaryBrown, 
                fontSize: isWeb && isLargeScreen ? 26 : 18, 
                fontWeight: '700',
                marginLeft: 8,
              }}>
                Enter Sanskrit Shloka
              </Text>
            </View>
            
            <View style={{ 
              backgroundColor: '#FFF', 
              borderRadius: isWeb && isLargeScreen ? 24 : 20,
              borderWidth: isWeb && isLargeScreen ? 3 : 2,
              borderColor: COLORS.sand,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 6,
            }}>
              <TextInput
                value={inputShloka}
                onChangeText={(text) => {
                  setInputShloka(text);
                  if (analysisResult) clearResults();
                }}
                placeholder="टाइप करें या पेस्ट करें..."
                placeholderTextColor={COLORS.lightCopper}
                multiline
                numberOfLines={isWeb && isLargeScreen ? 8 : 5}
                style={{
                  padding: isWeb && isLargeScreen ? 28 : 18,
                  fontSize: isWeb && isLargeScreen ? 22 : 18,
                  color: COLORS.primaryBrown,
                  lineHeight: isWeb && isLargeScreen ? 36 : 28,
                  minHeight: isWeb && isLargeScreen ? 200 : 140,
                  textAlignVertical: 'top',
                  fontWeight: '500',
                }}
              />
            </View>

            {/* Action Buttons - AI Help and Analyze */}
            <View style={{ marginTop: 16, flexDirection: 'row', gap: 12  }}>
              {/* AI Help Button */}
              <View style={{ flex: 1 }}>
                <BotpressChatbot 
                  onSuggestion={(text) => {
                    setInputShloka(text);
                    clearResults();
                  }}
                />
              </View>
                
              {/* Analyze Button */}
              <TouchableOpacity
                onPress={() => analyzeShloka(inputShloka)}
                disabled={isAnalyzing || !inputShloka.trim()}
                style={{
                  flex: 1,
                  borderRadius: 30,
                  overflow: 'hidden',
                  shadowColor: inputShloka.trim() ? COLORS.copper : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: inputShloka.trim() ? 5 : 0,
                }}
              >
                <LinearGradient
                  colors={isAnalyzing || !inputShloka.trim() 
                    ? [COLORS.sand, COLORS.sand] 
                    : [COLORS.saffron, COLORS.copper]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    height: 56,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: !inputShloka.trim() ? 2 : 0,
                    borderColor: 'rgba(139, 69, 19, 0.2)',
                  }}
                >
                  {isAnalyzing ? (
                    <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons 
                      name="analytics" 
                      size={22} 
                      color={!inputShloka.trim() ? COLORS.copper : '#FFF'} 
                      style={{ marginRight: 8 }} 
                    />
                  )}
                  <Text style={{ 
                    color: !inputShloka.trim() ? COLORS.copper : '#FFF', 
                    fontSize: 16, 
                    fontWeight: '700',
                  }}>
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Note: AI Chatbot available via floating button at bottom right */}

            {/* Error Display */}
            {error && (
              <View style={{
                backgroundColor: '#FEE2E2',
                borderRadius: isWeb && isLargeScreen ? 20 : 12,
                padding: isWeb && isLargeScreen ? 24 : 16,
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#DC2626',
              }}>
                <Ionicons name="alert-circle" size={isWeb && isLargeScreen ? 32 : 24} color="#DC2626" style={{ marginRight: 12 }} />
                <Text style={{ 
                  color: '#DC2626', 
                  flex: 1,
                  fontSize: isWeb && isLargeScreen ? 16 : 14,
                  lineHeight: isWeb && isLargeScreen ? 24 : 20,
                }}>{error}</Text>
              </View>
            )}

            {/* Demo Examples Section */}
            <View style={{ marginTop: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="sparkles" size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
                <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                  Try These Examples
                </Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                {demoShlokas.map((demo) => (
                  <TouchableOpacity
                    key={demo.id}
                    onPress={() => {
                      setInputShloka(demo.text);
                      analyzeShloka(demo.text);
                    }}
                    disabled={isAnalyzing}
                    style={{
                      width: isWeb && isLargeScreen ? 420 : SCREEN_WIDTH * 0.7,
                      marginRight: 16,
                      backgroundColor: '#FFF',
                      borderRadius: isWeb && isLargeScreen ? 24 : 20,
                      padding: isWeb && isLargeScreen ? 28 : 20,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.12,
                      shadowRadius: 12,
                      elevation: 6,
                      borderWidth: isWeb && isLargeScreen ? 3 : 1,
                      borderColor: COLORS.sand,
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isWeb && isLargeScreen ? 16 : 12 }}>
                      <View style={{
                        width: isWeb && isLargeScreen ? 52 : 40,
                        height: isWeb && isLargeScreen ? 52 : 40,
                        borderRadius: isWeb && isLargeScreen ? 26 : 20,
                        backgroundColor: COLORS.sand,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                        <Ionicons name={demo.iconName as any} size={isWeb && isLargeScreen ? 28 : 20} color={COLORS.copper} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ 
                          color: COLORS.gold, 
                          fontSize: 16, 
                          fontWeight: '700',
                        }}>
                          {demo.title}
                        </Text>
                        <Text style={{ 
                          color: COLORS.lightCopper, 
                          fontSize: 12,
                          marginTop: 2,
                        }}>
                          {demo.description}
                        </Text>
                      </View>
                      {demo.audioFile && (
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            playAudio(demo.audioFile!);
                          }}
                          style={{
                            backgroundColor: COLORS.saffron,
                            borderRadius: 12,
                            padding: 8,
                          }}
                        >
                          <Ionicons name="play" size={16} color="#FFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={{ 
                      color: COLORS.primaryBrown, 
                      fontSize: isWeb && isLargeScreen ? 18 : 15,
                      lineHeight: isWeb && isLargeScreen ? 28 : 24,
                      fontWeight: '500',
                    }} numberOfLines={2}>
                      {demo.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Mathematical Analysis Animation */}
          {isAnalyzing && analysisStage !== 'idle' && (
            <View style={{ 
              padding: isWeb && isLargeScreen ? 40 : 20,
              maxWidth: isWeb && isLargeScreen ? 1200 : '100%',
              marginHorizontal: 'auto',
              width: '100%',
            }}>
              <MathematicalAnalysisAnimation 
                stage={analysisStage} 
                text={inputShloka}
              />
            </View>
          )}

          {/* Analysis Results */}
          {analysisResult && !isAnalyzing && (
            <Animated.View style={{ 
              padding: isWeb && isLargeScreen ? 40 : 20,
              maxWidth: isWeb && isLargeScreen ? 1200 : '100%',
              marginHorizontal: 'auto',
              width: '100%',
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              }],
            }}>
              {/* Results Header */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 20,
                justifyContent: 'space-between',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: COLORS.gold,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                  </View>
                  <Text style={{ 
                    color: COLORS.primaryBrown, 
                    fontSize: 22, 
                    fontWeight: '700' 
                  }}>
                    Analysis Complete
                  </Text>
                </View>
              </View>

              {/* Main Chandas Card */}
              <LinearGradient
                colors={[COLORS.primaryBrown, COLORS.darkBrown]}
                style={{
                  borderRadius: isWeb && isLargeScreen ? 32 : 24,
                  padding: isWeb && isLargeScreen ? 40 : 24,
                  marginBottom: isWeb && isLargeScreen ? 24 : 16,
                  shadowColor: COLORS.darkBrown,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' }}>
                    Identified Chandas
                  </Text>
                  <Text style={{ 
                    color: COLORS.gold, 
                    fontSize: 36, 
                    fontWeight: '800',
                    marginTop: 8,
                    textAlign: 'center',
                  }}>
                    {analysisResult.chandasName}
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    marginTop: 16,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: 12,
                  }}>
                    <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
                      <Text style={{ color: COLORS.gold, fontSize: 24, fontWeight: '700' }}>
                        {analysisResult.totalSyllables}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Total</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
                      <Text style={{ color: COLORS.gold, fontSize: 24, fontWeight: '700' }}>
                        {analysisResult.guruCount}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Guru</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
                      <Text style={{ color: COLORS.copper, fontSize: 24, fontWeight: '700' }}>
                        {analysisResult.laghuCount}
                      </Text>
                      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Laghu</Text>
                    </View>
                  </View>
                </View>
                
                {/* Confidence Meter inside card */}
                <View style={{ marginTop: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 13 }}>
                      Confidence
                    </Text>
                    <Text style={{ color: COLORS.gold, fontWeight: '700', fontSize: 15 }}>
                      {Math.round(analysisResult.confidence * 100)}%
                    </Text>
                  </View>
                  <View style={{ 
                    height: 8, 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    <View
                      style={{
                        height: '100%',
                        backgroundColor: COLORS.gold,
                        borderRadius: 4,
                        width: `${analysisResult.confidence * 100}%`,
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>

              {/* Shloka Meaning Card - NEW SECTION */}
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 2,
                borderColor: meaningResult ? COLORS.gold : COLORS.sand,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: `${COLORS.saffron}20`,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="language" size={22} color={COLORS.saffron} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                      Shloka Meaning & Translation
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 12, marginTop: 2 }}>
                      Complete interpretation with word-by-word breakdown
                    </Text>
                  </View>
                </View>

                {!meaningResult ? (
                  <TouchableOpacity
                    onPress={() => extractMeaning(analysisResult.inputText)}
                    disabled={isExtractingMeaning}
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={isExtractingMeaning ? [COLORS.sand, COLORS.sand] : [COLORS.saffron, COLORS.copper]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons 
                        name={isExtractingMeaning ? 'hourglass-outline' : 'book-outline'} 
                        size={22} 
                        color={isExtractingMeaning ? COLORS.copper : '#FFF'} 
                        style={{ marginRight: 10 }} 
                      />
                      <Text style={{ 
                        color: isExtractingMeaning ? COLORS.copper : '#FFF', 
                        fontSize: 17, 
                        fontWeight: '700',
                      }}>
                        {isExtractingMeaning ? 'Extracting Meaning...' : 'Get Complete Meaning'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <View>
                    {/* Translation */}
                    <View style={{
                      backgroundColor: `${COLORS.gold}10`,
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 16,
                      borderLeftWidth: 4,
                      borderLeftColor: COLORS.gold,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="chatbox-ellipses" size={18} color={COLORS.gold} />
                        <Text style={{
                          color: COLORS.gold,
                          fontSize: 13,
                          fontWeight: '700',
                          marginLeft: 8,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          Translation
                        </Text>
                      </View>
                      <Text style={{
                        color: COLORS.primaryBrown,
                        fontSize: 15,
                        lineHeight: 24,
                        fontWeight: '500',
                      }}>
                        {meaningResult.translation}
                      </Text>
                    </View>

                    {/* Word-by-Word Meanings */}
                    {Object.keys(meaningResult.word_meanings).length > 0 && (
                      <View style={{
                        backgroundColor: COLORS.cream,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 16,
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                          <Ionicons name="list" size={18} color={COLORS.copper} />
                          <Text style={{
                            color: COLORS.copper,
                            fontSize: 13,
                            fontWeight: '700',
                            marginLeft: 8,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}>
                            Word Meanings (शब्दार्थ)
                          </Text>
                        </View>
                        <View style={{ gap: 8 }}>
                          {Object.entries(meaningResult.word_meanings).map(([word, meaning], index) => (
                            <View
                              key={index}
                              style={{
                                flexDirection: 'row',
                                backgroundColor: '#FFF',
                                borderRadius: 12,
                                padding: 12,
                                borderWidth: 1,
                                borderColor: COLORS.sand,
                              }}
                            >
                              <Text style={{
                                color: COLORS.saffron,
                                fontSize: 16,
                                fontWeight: '700',
                                marginRight: 12,
                                minWidth: 80,
                              }}>
                                {word}
                              </Text>
                              <Text style={{
                                color: COLORS.primaryBrown,
                                fontSize: 14,
                                flex: 1,
                                lineHeight: 20,
                              }}>
                                {meaning}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Context - Enhanced with Bold Highlighting */}
                    {meaningResult.context && (
                      <View style={{
                        backgroundColor: '#FFF',
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 16,
                        borderWidth: 3,
                        borderColor: COLORS.gold,
                        shadowColor: COLORS.gold,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 8,
                      }}>
                        <LinearGradient
                          colors={[COLORS.gold, COLORS.saffron]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 12,
                            padding: 8,
                            marginRight: 12,
                          }}>
                            <Ionicons name="time-outline" size={24} color="#FFF" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              color: '#FFF',
                              fontSize: 18,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              textShadowColor: 'rgba(0,0,0,0.2)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                            }}>
                              Historical Context
                            </Text>
                            <Text style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: 11,
                              fontWeight: '600',
                              marginTop: 2,
                            }}>
                              ऐतिहासिक संदर्भ
                            </Text>
                          </View>
                        </LinearGradient>
                        <Text style={{
                          color: COLORS.primaryBrown,
                          fontSize: 15,
                          lineHeight: 24,
                          fontWeight: '600',
                        }}>
                          {meaningResult.context.split(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|\d{1,4}(?:\s*(?:BCE|CE|BC|AD))?|Chapter \d+|Verse \d+|Book \d+)/g).map((part, idx) => {
                            // Bold: Proper nouns, dates, chapter/verse references
                            const shouldBold = /^(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|\d{1,4}\s*(?:BCE|CE|BC|AD)?|Chapter \d+|Verse \d+|Book \d+)$/.test(part.trim());
                            return shouldBold ? (
                              <Text key={idx} style={{ fontWeight: '900', color: COLORS.copper }}>
                                {part}
                              </Text>
                            ) : (
                              part
                            );
                          })}
                        </Text>
                      </View>
                    )}

                    {/* Manifestation of Chandas - NEW SECTION */}
                    {meaningResult.manifestation_of_chandas && (
                      <View style={{
                        backgroundColor: '#FFF',
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 16,
                        borderWidth: 3,
                        borderColor: COLORS.saffron,
                        shadowColor: COLORS.saffron,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 8,
                      }}>
                        <LinearGradient
                          colors={[COLORS.saffron, COLORS.copper]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 12,
                            padding: 8,
                            marginRight: 12,
                          }}>
                            <Ionicons name="flower" size={24} color="#FFF" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              color: '#FFF',
                              fontSize: 18,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              textShadowColor: 'rgba(0,0,0,0.2)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                            }}>
                              Manifestation of Chandas
                            </Text>
                            <Text style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: 11,
                              fontWeight: '600',
                              marginTop: 2,
                            }}>
                              छन्द की अभिव्यक्ति
                            </Text>
                          </View>
                        </LinearGradient>
                        
                        {/* Decorative quote marks */}
                        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                          <Ionicons name="quote" size={32} color={COLORS.sand} style={{ opacity: 0.5 }} />
                        </View>
                        
                        <Text style={{
                          color: COLORS.primaryBrown,
                          fontSize: 15,
                          lineHeight: 26,
                          fontWeight: '600',
                          letterSpacing: 0.3,
                        }}>
                          {meaningResult.manifestation_of_chandas}
                        </Text>
                        
                        {/* Decorative bottom quote */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                          <Ionicons 
                            name="quote" 
                            size={32} 
                            color={COLORS.sand} 
                            style={{ opacity: 0.5, transform: [{ rotate: '180deg' }] }} 
                          />
                        </View>
                        
                        {/* Info box about chandas influence */}
                        <View style={{
                          backgroundColor: `${COLORS.saffron}15`,
                          borderRadius: 12,
                          padding: 14,
                          marginTop: 12,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                          <Ionicons name="information-circle" size={20} color={COLORS.saffron} style={{ marginRight: 10, marginTop: 2 }} />
                          <Text style={{
                            color: COLORS.copper,
                            fontSize: 13,
                            lineHeight: 20,
                            flex: 1,
                            fontStyle: 'italic',
                          }}>
                            The rhythmic structure (chandas) of a verse influences its spiritual energy, emotional resonance, and memorability. Each meter carries unique qualities that enhance the shloka's essence.
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Unique Facts - NEW SECTION */}
                    {meaningResult.unique_facts && (
                      <View style={{
                        backgroundColor: '#FFF',
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 16,
                        borderWidth: 3,
                        borderColor: COLORS.copper,
                        shadowColor: COLORS.copper,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 8,
                      }}>
                        <LinearGradient
                          colors={[COLORS.copper, COLORS.saffron]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 12,
                            padding: 8,
                            marginRight: 12,
                          }}>
                            <Ionicons name="star" size={24} color="#FFF" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              color: '#FFF',
                              fontSize: 18,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              textShadowColor: 'rgba(0,0,0,0.2)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                            }}>
                              Unique Facts
                            </Text>
                            <Text style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: 11,
                              fontWeight: '600',
                              marginTop: 2,
                            }}>
                              विशिष्ट तथ्य
                            </Text>
                          </View>
                        </LinearGradient>
                        
                        {/* Star decorations */}
                        <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'space-around' }}>
                          <Ionicons name="star" size={20} color={COLORS.copper} style={{ opacity: 0.6 }} />
                          <Ionicons name="star" size={16} color={COLORS.saffron} style={{ opacity: 0.4 }} />
                          <Ionicons name="star" size={20} color={COLORS.copper} style={{ opacity: 0.6 }} />
                        </View>
                        
                        <Text style={{
                          color: COLORS.primaryBrown,
                          fontSize: 15,
                          lineHeight: 26,
                          fontWeight: '600',
                          letterSpacing: 0.3,
                        }}>
                          {meaningResult.unique_facts}
                        </Text>
                        
                        {/* Info box about unique facts */}
                        <View style={{
                          backgroundColor: `${COLORS.copper}15`,
                          borderRadius: 12,
                          padding: 14,
                          marginTop: 12,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                          <Ionicons name="diamond" size={20} color={COLORS.copper} style={{ marginRight: 10, marginTop: 2 }} />
                          <Text style={{
                            color: COLORS.primaryBrown,
                            fontSize: 13,
                            lineHeight: 20,
                            flex: 1,
                            fontStyle: 'italic',
                          }}>
                            Powerful insights about the historical significance, spiritual importance, and cultural impact of this sacred verse.
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Do You Know Section - Unknown Facts */}
                    {meaningResult.unknown_facts && (
                      <View style={{
                        backgroundColor: '#FFF',
                        borderRadius: 20,
                        padding: 20,
                        marginBottom: 16,
                        borderWidth: 3,
                        borderColor: COLORS.gold,
                        shadowColor: COLORS.gold,
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 8,
                      }}>
                        <LinearGradient
                          colors={[COLORS.gold, COLORS.saffron]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 14,
                            padding: 14,
                            marginBottom: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <View style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 12,
                            padding: 8,
                            marginRight: 12,
                          }}>
                            <Ionicons name="bulb" size={24} color="#FFF" />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{
                              color: '#FFF',
                              fontSize: 18,
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              textShadowColor: 'rgba(0,0,0,0.2)',
                              textShadowOffset: { width: 0, height: 1 },
                              textShadowRadius: 2,
                            }}>
                              Do You Know?
                            </Text>
                            <Text style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: 11,
                              fontWeight: '600',
                              marginTop: 2,
                            }}>
                              क्या आप जानते हैं?
                            </Text>
                          </View>
                        </LinearGradient>
                        
                        {/* Sparkle decorations */}
                        <View style={{ flexDirection: 'row', marginBottom: 12, justifyContent: 'space-around' }}>
                          <Ionicons name="sparkles" size={20} color={COLORS.gold} style={{ opacity: 0.6 }} />
                          <Ionicons name="sparkles" size={16} color={COLORS.gold} style={{ opacity: 0.4 }} />
                          <Ionicons name="sparkles" size={20} color={COLORS.gold} style={{ opacity: 0.6 }} />
                        </View>
                        
                        <Text style={{
                          color: COLORS.primaryBrown,
                          fontSize: 15,
                          lineHeight: 26,
                          fontWeight: '600',
                          letterSpacing: 0.3,
                        }}>
                          {meaningResult.unknown_facts}
                        </Text>
                        
                        {/* Info box about fascinating facts */}
                        <View style={{
                          backgroundColor: `${COLORS.gold}15`,
                          borderRadius: 12,
                          padding: 14,
                          marginTop: 12,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                        }}>
                          <Ionicons name="star" size={20} color={COLORS.gold} style={{ marginRight: 10, marginTop: 2 }} />
                          <Text style={{
                            color: COLORS.copper,
                            fontSize: 13,
                            lineHeight: 20,
                            flex: 1,
                            fontStyle: 'italic',
                          }}>
                            Fascinating insights that reveal the deeper layers of meaning, cultural significance, and hidden connections within this sacred verse.
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Grammatical Notes */}
                    {meaningResult.notes && (
                      <View style={{
                        backgroundColor: `${COLORS.primaryBrown}08`,
                        borderRadius: 16,
                        padding: 16,
                        borderWidth: 1,
                        borderColor: COLORS.sand,
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                          <Ionicons name="school-outline" size={18} color={COLORS.primaryBrown} />
                          <Text style={{
                            color: COLORS.primaryBrown,
                            fontSize: 13,
                            fontWeight: '700',
                            marginLeft: 8,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}>
                            Grammatical Notes (व्याकरण टिप्पणी)
                          </Text>
                        </View>
                        <Text style={{
                          color: COLORS.copper,
                          fontSize: 14,
                          lineHeight: 22,
                          fontStyle: 'italic',
                        }}>
                          {meaningResult.notes}
                        </Text>
                      </View>
                    )}

                    {/* Refresh button */}
                    <TouchableOpacity
                      onPress={() => extractMeaning(analysisResult.inputText)}
                      disabled={isExtractingMeaning}
                      style={{
                        marginTop: 12,
                        backgroundColor: COLORS.cream,
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: COLORS.sand,
                      }}
                    >
                      <Ionicons name="refresh" size={18} color={COLORS.copper} style={{ marginRight: 8 }} />
                      <Text style={{ color: COLORS.copper, fontSize: 14, fontWeight: '600' }}>
                        Refresh Meaning
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Colored Shloka Text Card - NEW SECTION */}
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 2,
                borderColor: COLORS.saffron,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: `${COLORS.saffron}20`,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="color-palette" size={22} color={COLORS.saffron} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                      Colored Shloka Text
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 12 }}>
                      Guru (Heavy) in Red, Laghu (Light) in Green
                    </Text>
                  </View>
                </View>

                {/* Legend */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  marginBottom: 16,
                  backgroundColor: COLORS.cream,
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                    <View style={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: 8, 
                      backgroundColor: COLORS.guruColor,
                      marginRight: 6,
                    }} />
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 13, fontWeight: '600' }}>Guru (●●)</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ 
                      width: 16, 
                      height: 16, 
                      borderRadius: 8, 
                      backgroundColor: COLORS.laghuColor,
                      marginRight: 6,
                    }} />
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 13, fontWeight: '600' }}>Laghu (○)</Text>
                  </View>
                </View>

                {/* Colored Shloka Text */}
                <View style={{
                  backgroundColor: COLORS.cream,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: COLORS.sand,
                }}>
                  <ColoredSyllableText 
                    text={analysisResult.inputText} 
                    syllableBreakdown={analysisResult.syllableBreakdown} 
                  />
                </View>

                {/* Explanation */}
                <View style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: `${COLORS.gold}10`,
                  borderRadius: 12,
                  borderLeftWidth: 3,
                  borderLeftColor: COLORS.gold,
                }}>
                  <Text style={{
                    color: COLORS.primaryBrown,
                    fontSize: 12,
                    lineHeight: 18,
                  }}>
                    💡 <Text style={{ fontWeight: '700' }}>Tip:</Text> Heavy syllables (Guru) are marked in <Text style={{ color: COLORS.guruColor, fontWeight: '700' }}>red</Text> and light syllables (Laghu) in <Text style={{ color: COLORS.laghuColor, fontWeight: '700' }}>green</Text>. This helps you understand the syllabic weight pattern of the shloka.
                  </Text>
                </View>
              </View>

              {/* Syllable Breakdown Card */}
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: `${COLORS.gold}20`,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="grid" size={22} color={COLORS.gold} />
                  </View>
                  <View>
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                      Syllable Breakdown
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 12 }}>
                      Each syllable with its classification
                    </Text>
                  </View>
                </View>
                
                {/* Legend */}
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'center', 
                  marginBottom: 16,
                  backgroundColor: COLORS.cream,
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24 }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: COLORS.guruColor,
                      marginRight: 8,
                    }} />
                    <Text style={{ color: COLORS.primaryBrown, fontWeight: '600' }}>Guru (गुरु) ●●</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: COLORS.laghuColor,
                      marginRight: 8,
                    }} />
                    <Text style={{ color: COLORS.primaryBrown, fontWeight: '600' }}>Laghu (लघु) ○</Text>
                  </View>
                </View>
                
                {/* Syllable Chips */}
                <View style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap', 
                  justifyContent: 'center',
                }}>
                  {analysisResult.syllableBreakdown.map((item, idx) => (
                    <SyllableChip
                      key={idx}
                      syllable={item.syllable}
                      type={item.type}
                    />
                  ))}
                </View>
                
                {/* Pattern String */}
                <View style={{ marginTop: 20 }}>
                  <Text style={{ 
                    color: COLORS.primaryBrown, 
                    fontWeight: '600', 
                    fontSize: 14,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                    Pattern Representation (G = Guru, L = Laghu)
                  </Text>
                  <PatternDisplay pattern={analysisResult.laghuGuruPattern} />
                </View>
              </View>

              {/* AI Process Journey - NEW SECTION */}
              {analysisResult.identificationProcess && analysisResult.identificationProcess.length > 0 && (
                <View style={{
                  backgroundColor: '#FFF',
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{
                      backgroundColor: `${COLORS.saffron}20`,
                      borderRadius: 12,
                      padding: 10,
                      marginRight: 12,
                    }}>
                      <Ionicons name="git-network-outline" size={22} color={COLORS.saffron} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                        AI Analysis Journey
                      </Text>
                      <Text style={{ color: COLORS.lightCopper, fontSize: 12, marginTop: 2 }}>
                        Step-by-step identification process (विश्लेषण प्रक्रिया)
                      </Text>
                    </View>
                  </View>
                  
                  {/* Process Timeline */}
                  <View style={{ marginTop: 8 }}>
                    {analysisResult.identificationProcess.map((step, index) => (
                      <ProcessStepCard
                        key={step.step_number}
                        step={step}
                        index={index}
                        total={analysisResult.identificationProcess.length}
                      />
                    ))}
                  </View>
                  
                  {/* Journey completion badge */}
                  <View style={{
                    marginTop: 20,
                    padding: 16,
                    backgroundColor: `${COLORS.gold}10`,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: COLORS.gold,
                    borderStyle: 'dashed',
                  }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: COLORS.gold,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Ionicons name="trophy" size={22} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        color: COLORS.primaryBrown, 
                        fontWeight: '700', 
                        fontSize: 15,
                        marginBottom: 2,
                      }}>
                        Analysis Complete!
                      </Text>
                      <Text style={{ color: COLORS.copper, fontSize: 12 }}>
                        All {analysisResult.identificationProcess.length} steps processed successfully with {(analysisResult.confidence * 100).toFixed(0)}% confidence
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Explanation Card */}
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: `${COLORS.copper}20`,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="book" size={22} color={COLORS.copper} />
                  </View>
                  <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                    Explanation
                  </Text>
                </View>
                
                <Text style={{ 
                  color: COLORS.primaryBrown, 
                  fontSize: 15,
                  lineHeight: 24,
                }}>
                  {analysisResult.explanation}
                </Text>
              </View>

              {/* Chandas Characteristics Card */}
              <View style={{
                backgroundColor: '#FFF',
                borderRadius: 24,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 2,
                borderColor: COLORS.saffron,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    backgroundColor: `${COLORS.saffron}20`,
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 12,
                  }}>
                    <Ionicons name="information-circle" size={22} color={COLORS.saffron} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 18, fontWeight: '700' }}>
                      Meter Characteristics
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 12, marginTop: 2 }}>
                      वृत्त विशेषताएँ (Vṛtta Viśeṣatāeṃ)
                    </Text>
                  </View>
                </View>
                
                {/* Characteristics Grid */}
                <View style={{ gap: 12 }}>
                  {/* Syllable Structure */}
                  <View style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 12,
                    padding: 14,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.gold,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="layers-outline" size={18} color={COLORS.gold} />
                      <Text style={{ 
                        color: COLORS.primaryBrown, 
                        fontSize: 14, 
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                        Syllable Structure
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.copper, fontSize: 13, lineHeight: 20 }}>
                      {analysisResult.totalSyllables} syllables total • {analysisResult.totalSyllables / 4} per quarter (पाद)
                    </Text>
                  </View>

                  {/* Metrical Pattern */}
                  <View style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 12,
                    padding: 14,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.copper,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="analytics-outline" size={18} color={COLORS.copper} />
                      <Text style={{ 
                        color: COLORS.primaryBrown, 
                        fontSize: 14, 
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                        Metrical Pattern (गण)
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.copper, fontSize: 13, lineHeight: 20 }}>
                      {analysisResult.laghuGuruPattern}
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                      G = Guru (heavy) • L = Laghu (light)
                    </Text>
                  </View>

                  {/* Mātrā Count */}
                  <View style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 12,
                    padding: 14,
                    borderLeftWidth: 4,
                    borderLeftColor: COLORS.saffron,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="timer-outline" size={18} color={COLORS.saffron} />
                      <Text style={{ 
                        color: COLORS.primaryBrown, 
                        fontSize: 14, 
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                        Mātrā Duration (मात्रा काल)
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.copper, fontSize: 13, lineHeight: 20 }}>
                      {analysisResult.guruCount * 2 + analysisResult.laghuCount} mātrās total
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                      ({analysisResult.guruCount} Guru × 2) + ({analysisResult.laghuCount} Laghu × 1)
                    </Text>
                  </View>

                  {/* Classification */}
                  <View style={{
                    backgroundColor: `${COLORS.gold}10`,
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: COLORS.gold,
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Ionicons name="ribbon-outline" size={18} color={COLORS.gold} />
                      <Text style={{ 
                        color: COLORS.primaryBrown, 
                        fontSize: 14, 
                        fontWeight: '700',
                        marginLeft: 8,
                      }}>
                        Meter Classification
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.copper, fontSize: 13, lineHeight: 20 }}>
                      {analysisResult.chandasName}
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
                      Based on {analysisResult.totalSyllables}-syllable vṛtta pattern analysis
                    </Text>
                  </View>
                </View>

                {/* AI Analysis Badge */}
                <View style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: `${COLORS.primaryBrown}05`,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 20, marginRight: 10 }}>🤖</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.primaryBrown, fontSize: 12, fontWeight: '600' }}>
                      AI-Powered Analysis
                    </Text>
                    <Text style={{ color: COLORS.lightCopper, fontSize: 11, marginTop: 2 }}>
                      Analyzed using deep learning trained on classical Sanskrit texts
                    </Text>
                  </View>
                </View>
              </View>

              {/* Input Text Reference */}
              <View style={{
                backgroundColor: COLORS.sand,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.lightCopper,
                borderStyle: 'dashed',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Ionicons name="text" size={18} color={COLORS.copper} />
                  <Text style={{ 
                    color: COLORS.copper, 
                    fontSize: 14, 
                    fontWeight: '600',
                    marginLeft: 8,
                  }}>
                    Analyzed Text
                  </Text>
                </View>
                <Text style={{ 
                  color: COLORS.primaryBrown, 
                  fontSize: 16,
                  lineHeight: 26,
                  fontWeight: '500',
                }}>
                  {analysisResult.inputText}
                </Text>
              </View>

              {/* Analyze Another Button */}
              <TouchableOpacity
                onPress={clearResults}
                style={{
                  marginTop: 20,
                  backgroundColor: COLORS.cream,
                  borderRadius: 16,
                  padding: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: COLORS.gold,
                }}
              >
                <Ionicons name="refresh" size={22} color={COLORS.gold} style={{ marginRight: 10 }} />
                <Text style={{ color: COLORS.gold, fontSize: 17, fontWeight: '700' }}>
                  Analyze Another Shloka
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* AI Chatbot - Embedded Botpress Widget */}
      
    </Modal>
  );
}
