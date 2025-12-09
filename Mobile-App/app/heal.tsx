import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { moodCategories, MoodCategory, HealingShloka, getRandomShloka } from '../data/healingShlokas';
import { getAudioUrlFromFilename } from '../data/shlokaAudioMap';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { aiApi } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  mediumBrown: '#8B6F47',
  lightBrown: '#F5E6D3',
};

// Search Bar Component
const SearchBar = ({
  value,
  onChangeText,
  onClear,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}) => {
  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: value ? COLORS.copper : COLORS.sand,
        shadowColor: COLORS.primaryBrown,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Ionicons name="search" size={20} color={COLORS.copper} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by mood, benefit, or keyword..."
        placeholderTextColor={COLORS.lightCopper}
        style={{
          flex: 1,
          marginLeft: 10,
          fontSize: 15,
          color: COLORS.primaryBrown,
          fontWeight: '500',
        }}
      />
      {value !== '' && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons name="close-circle" size={20} color={COLORS.copper} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Mood Category Card Component
const MoodCard = ({ 
  category, 
  index, 
  onPress, 
  isSelected 
}: { 
  category: MoodCategory; 
  index: number; 
  onPress: () => void;
  isSelected: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          width: (SCREEN_WIDTH - 48) / 2,
          marginBottom: 12,
        }}
      >
        <View
          style={{
            backgroundColor: isSelected ? category.color : category.bgColor,
            borderRadius: 20,
            padding: 16,
            borderWidth: 2,
            borderColor: isSelected ? category.color : 'transparent',
            shadowColor: category.color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isSelected ? 0.3 : 0.1,
            shadowRadius: 12,
            elevation: isSelected ? 8 : 3,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : category.color + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons 
              name={category.icon as any} 
              size={24} 
              color={isSelected ? '#ffffff' : category.color} 
            />
          </View>
          
          <Text
            style={{
              fontSize: 15,
              fontWeight: '700',
              color: isSelected ? '#ffffff' : '#1f2937',
              marginBottom: 4,
            }}
          >
            {category.name}
          </Text>
          
          <Text
            style={{
              fontSize: 11,
              color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280',
              marginBottom: 8,
            }}
            numberOfLines={2}
          >
            {category.description}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : category.color + '15',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: isSelected ? '#ffffff' : category.color,
                }}
              >
                {category.shlokas.length} Shlokas
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Shloka Card Component
const ShlokaCard = ({
  shloka,
  index,
  onPlay,
  isPlaying,
  categoryColor,
  onViewDetails,
}: {
  shloka: HealingShloka;
  index: number;
  onPlay: () => void;
  isPlaying: boolean;
  categoryColor: string;
  onViewDetails: (shloka: HealingShloka) => void;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ translateY: slideAnim }],
        marginBottom: 16,
      }}
    >
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: isPlaying ? categoryColor : '#f3f4f6',
          shadowColor: isPlaying ? categoryColor : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isPlaying ? 0.2 : 0.08,
          shadowRadius: 12,
          elevation: isPlaying ? 8 : 4,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: isPlaying ? categoryColor : '#f9fafb',
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: isPlaying ? '#ffffff' : '#1f2937',
                marginBottom: 2,
              }}
            >
              {shloka.name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: isPlaying ? 'rgba(255,255,255,0.8)' : '#6b7280',
              }}
            >
              {shloka.nameHindi}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={onPlay}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: isPlaying ? 'rgba(255,255,255,0.25)' : categoryColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={22}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <View style={{ padding: 16 }}>
          {/* Sanskrit Text */}
          <View
            style={{
              backgroundColor: '#faf5ff',
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: '#581c87',
                fontWeight: '500',
                lineHeight: 26,
                textAlign: 'center',
              }}
            >
              {shloka.shloka}
            </Text>
          </View>
          
          {/* Meaning */}
          <Text
            style={{
              fontSize: 14,
              color: '#4b5563',
              lineHeight: 22,
              marginBottom: 12,
              fontStyle: 'italic',
            }}
          >
            {`"${shloka.meaning}"`}
          </Text>
          
          {/* Meta Info */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f3f4f6',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Ionicons name="book-outline" size={12} color="#6b7280" />
              <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>
                {shloka.source}
              </Text>
            </View>
            
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: categoryColor + '15',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Ionicons name="sparkles" size={12} color={categoryColor} />
              <Text style={{ fontSize: 11, color: categoryColor, marginLeft: 4, fontWeight: '600' }}>
                {shloka.benefit}
              </Text>
            </View>
            
            {shloka.duration && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="time-outline" size={12} color="#6b7280" />
                <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 4 }}>
                  {shloka.duration}
                </Text>
              </View>
            )}
          </View>

          {/* Why This Works Button */}
          <TouchableOpacity
            onPress={() => onViewDetails(shloka)}
            style={{
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: categoryColor,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
            }}
          >
            <Ionicons name="information-circle-outline" size={16} color="#ffffff" />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#ffffff',
                marginLeft: 6,
              }}
            >
              Why this works for you
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Audio Player Component
const AudioPlayer = ({
  currentShloka,
  isPlaying,
  onPlayPause,
  onClose,
  progress,
  duration,
  onSeek,
  categoryColor,
}: {
  currentShloka: HealingShloka | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
  progress: number;
  duration: number;
  onSeek: (value: number) => void;
  categoryColor: string;
}) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (currentShloka) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentShloka]);

  if (!currentShloka) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 90 : 70,
        left: 0,
        right: 0,
        transform: [{ translateY: slideAnim }],
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}
    >
      <LinearGradient
        colors={[COLORS.primaryBrown, COLORS.darkBrown]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 16,
          shadowColor: COLORS.primaryBrown,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Ionicons name="close" size={16} color="#ffffff" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={onPlayPause}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.25)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={28}
              color="#ffffff"
            />
          </TouchableOpacity>

          {/* Info & Progress */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {currentShloka.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: 8,
              }}
            >
              {currentShloka.benefit}
            </Text>

            {/* Progress Bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', width: 35 }}>
                {formatTime(progress)}
              </Text>
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <Slider
                  minimumValue={0}
                  maximumValue={duration || 1}
                  value={progress}
                  onSlidingComplete={onSeek}
                  minimumTrackTintColor="#ffffff"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#ffffff"
                  style={{ height: 20 }}
                />
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', width: 35, textAlign: 'right' }}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Chandas Details Modal Component
const ChandasModal = ({
  visible,
  onClose,
  shloka,
  mood,
}: {
  visible: boolean;
  onClose: () => void;
  shloka: HealingShloka | null;
  mood: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [chandasInfo, setChandasInfo] = useState<any>(null);
  const [meaningInfo, setMeaningInfo] = useState<any>(null);

  useEffect(() => {
    if (visible && shloka) {
      loadInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, shloka]);

  const loadInfo = async () => {
    if (!shloka) return;
    
    setLoading(true);
    try {
      // Identify chandas pattern
      const chandasResponse = await aiApi.post('/chandas/identify', {
        shloka: shloka.shloka,
      });
      setChandasInfo(chandasResponse.data);

      // Get meaning extraction
      const meaningResponse = await aiApi.post('/meaning/extract', {
        verse: shloka.shloka,
        include_word_meanings: true,
        include_context: true,
      });
      setMeaningInfo(meaningResponse.data);
    } catch (error) {
      console.error('Error loading info:', error);
      Alert.alert('Error', 'Failed to load chandas and meaning information');
    } finally {
      setLoading(false);
    }
  };

  if (!shloka) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: COLORS.cream,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85%',
            paddingTop: 20,
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primaryBrown }}>
                Why This Works
              </Text>
              <Text style={{ fontSize: 13, color: COLORS.copper, marginTop: 2 }}>
                {shloka.name} for {mood}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: COLORS.sand,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={COLORS.primaryBrown} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            {loading ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.copper} />
                <Text style={{ marginTop: 12, color: COLORS.copper }}>Analyzing with AI...</Text>
              </View>
            ) : (
              <>
                {/* Chandas Pattern */}
                {chandasInfo && (
                  <View style={{ marginBottom: 20 }}>
                    <LinearGradient
                      colors={[COLORS.primaryBrown, COLORS.darkBrown]}
                      style={{ borderRadius: 16, padding: 16 }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Ionicons name="pulse" size={20} color={COLORS.gold} />
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff', marginLeft: 8 }}>
                          Chandas Pattern
                        </Text>
                      </View>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.gold, marginBottom: 8 }}>
                        {chandasInfo.chandas_name || 'Analyzing...'}
                      </Text>
                      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20 }}>
                        {chandasInfo.explanation || 'Pattern analysis in progress...'}
                      </Text>
                    </LinearGradient>
                  </View>
                )}

                {/* Meaning & Translation */}
                {meaningInfo && (
                  <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <Ionicons name="book" size={20} color={COLORS.copper} />
                      <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primaryBrown, marginLeft: 8 }}>
                        Meaning & Translation
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: COLORS.primaryBrown, lineHeight: 22 }}>
                      {meaningInfo.translation || shloka.meaning}
                    </Text>
                  </View>
                )}

                {/* Why It Works */}
                <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Ionicons name="heart" size={20} color={COLORS.saffron} />
                    <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primaryBrown, marginLeft: 8 }}>
                      Therapeutic Benefits
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.primaryBrown, lineHeight: 22 }}>
                    This shloka helps with {mood.toLowerCase()} through its rhythmic pattern and vibrational frequency. 
                    The specific chandas meter creates a calming effect on the mind and nervous system, promoting {shloka.benefit.toLowerCase()}.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function HealScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<MoodCategory | null>(null);
  const [currentShloka, setCurrentShloka] = useState<HealingShloka | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState({ position: 0, duration: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [dailyShloka, setDailyShloka] = useState<HealingShloka | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChandasModal, setShowChandasModal] = useState(false);
  const [selectedShlokaForDetails, setSelectedShlokaForDetails] = useState<HealingShloka | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    // Header animation
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Set daily shloka
    setDailyShloka(getRandomShloka());

    // Setup audio
    setupAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const playAudio = async (shloka: HealingShloka) => {
    try {
      setIsLoading(true);
      
      // Stop current audio if playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      // Get the audio asset from the filename
      const audioAsset = getAudioUrlFromFilename(shloka.audioFile);
      
      // Check if audio file is available
      if (!audioAsset) {
        console.warn(`Audio file not found for: ${shloka.audioFile}`);
        Alert.alert(
          'Audio Not Available',
          `Audio for "${shloka.name}" is not available yet. Please try another shloka.`,
          [{ text: 'OK' }]
        );
        setIsLoading(false);
        return;
      }
      
      // Create and load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioAsset,
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        }
      );
      
      setSound(newSound);
      setCurrentShloka(shloka);
      setIsPlaying(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert(
        'Playback Error',
        'Unable to play audio. Please try again.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      // If no sound loaded, just toggle UI state for demo
      setIsPlaying(!isPlaying);
      return;
    }
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
  };

  const closePlayer = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setCurrentShloka(null);
    setIsPlaying(false);
    setPlaybackStatus({ position: 0, duration: 0 });
  };

  const handleCategoryPress = (category: MoodCategory) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      // Scroll to shlokas section
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 400, animated: true });
      }, 100);
    }
  };

  const handleViewDetails = (shloka: HealingShloka) => {
    setSelectedShlokaForDetails(shloka);
    setShowChandasModal(true);
  };

  // Filter shlokas based on search query
  const getFilteredShlokas = () => {
    if (!selectedCategory) return [];
    if (!searchQuery.trim()) return selectedCategory.shlokas;

    const query = searchQuery.toLowerCase();
    return selectedCategory.shlokas.filter(
      (shloka) =>
        shloka.name.toLowerCase().includes(query) ||
        shloka.nameHindi.includes(query) ||
        shloka.meaning.toLowerCase().includes(query) ||
        shloka.benefit.toLowerCase().includes(query) ||
        shloka.source.toLowerCase().includes(query)
    );
  };

  // Filter categories based on search
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return moodCategories;

    const query = searchQuery.toLowerCase();
    return moodCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.nameHindi.includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.shlokas.some(
          (shloka) =>
            shloka.name.toLowerCase().includes(query) ||
            shloka.meaning.toLowerCase().includes(query)
        )
    );
  };

  const categoryColor = selectedCategory?.color || COLORS.primaryBrown;
  const filteredCategories = getFilteredCategories();
  const filteredShlokas = getFilteredShlokas();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentShloka ? 180 : 100 }}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[COLORS.primaryBrown, COLORS.darkBrown]}
          style={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 24,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <Animated.View
            style={{
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
            }}
          >
            {/* Back & Title */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#ffffff" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 26, fontWeight: '800', color: '#ffffff' }}>
                  Heal with Shlokas
                </Text>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
                  Chandas-powered mood therapy
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#ffffff' }}>AI ✨</Text>
              </View>
            </View>

            {/* Daily Recommendation */}
            {dailyShloka && (
              <TouchableOpacity
                onPress={() => playAudio(dailyShloka)}
                activeOpacity={0.9}
              >
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Ionicons name="sunny" size={18} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                      {"Today's Recommendation"}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                      {dailyShloka.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="play" size={20} color="#ffffff" />
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#ffffff',
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {dailyShloka.meaning}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          </Animated.View>
        </LinearGradient>

        {/* Mood Selection */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: COLORS.primaryBrown,
              marginBottom: 4,
            }}
          >
            How are you feeling?
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.mediumBrown,
              marginBottom: 16,
            }}
          >
            Select your mood to find the perfect healing shlokas
          </Text>

          {/* Mood Grid */}
          {filteredCategories.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {filteredCategories.map((category, index) => (
                <MoodCard
                  key={category.id}
                  category={category}
                  index={index}
                  onPress={() => handleCategoryPress(category)}
                  isSelected={selectedCategory?.id === category.id}
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                padding: 32,
                alignItems: 'center',
                backgroundColor: COLORS.lightBrown,
                borderRadius: 16,
              }}
            >
              <Ionicons name="search-outline" size={48} color={COLORS.mediumBrown} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.primaryBrown,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                No moods found
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.mediumBrown,
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                Try a different search term
              </Text>
            </View>
          )}
        </View>

        {/* Selected Category Shlokas */}
        {selectedCategory && (
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: selectedCategory.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name={selectedCategory.icon as any}
                  size={20}
                  color="#ffffff"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.primaryBrown }}>
                  {selectedCategory.name}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.mediumBrown }}>
                  {filteredShlokas.length} healing shloka{filteredShlokas.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {/* Shlokas List */}
            {filteredShlokas.length > 0 ? (
              filteredShlokas.map((shloka, index) => (
                <ShlokaCard
                  key={shloka.id}
                  shloka={shloka}
                  index={index}
                  onPlay={() => playAudio(shloka)}
                  isPlaying={currentShloka?.id === shloka.id && isPlaying}
                  categoryColor={selectedCategory.color}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <View
                style={{
                  padding: 32,
                  alignItems: 'center',
                  backgroundColor: COLORS.lightBrown,
                  borderRadius: 16,
                }}
              >
                <Ionicons name="search-outline" size={48} color={COLORS.mediumBrown} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: COLORS.primaryBrown,
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  No shlokas found
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.mediumBrown,
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  Try a different search term
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Empty State when no category selected */}
        {!selectedCategory && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 20,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="hand-left-outline" size={36} color="#9ca3af" />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              Select a mood above to see healing shlokas
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Loading Indicator */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              padding: 24,
              borderRadius: 16,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={categoryColor} />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading audio...</Text>
          </View>
        </View>
      )}

      {/* Audio Player */}
      <AudioPlayer
        currentShloka={currentShloka}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onClose={closePlayer}
        progress={playbackStatus.position / 1000}
        duration={playbackStatus.duration / 1000}
        onSeek={handleSeek}
        categoryColor={categoryColor}
      />

      {/* Chandas Details Modal */}
      <ChandasModal
        visible={showChandasModal}
        shloka={selectedShlokaForDetails}
        mood={selectedCategory?.name || ''}
        onClose={() => {
          setShowChandasModal(false);
          setSelectedShlokaForDetails(null);
        }}
      />
    </SafeAreaView>
  );
}