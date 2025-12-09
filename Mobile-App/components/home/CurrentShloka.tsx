import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CurrentShlokaProps {
  shloka: {
    source: string;
    devanagari: string;
    translation: string;
    difficulty: string;
    chandas: {
      name: string;
    };
  };
}

export default function CurrentShloka({ shloka }: CurrentShlokaProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getDifficultyColor = () => {
    switch (shloka.difficulty.toLowerCase()) {
      case 'easy': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'hard': return { bg: 'bg-red-100', text: 'text-red-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const diffColors = getDifficultyColor();

  const isWeb = Platform.OS === 'web';
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth > 768;

  return (
    <View className="py-6 bg-white px-5" style={isWeb && isLargeScreen ? {
      paddingVertical: 64,
      paddingHorizontal: 60,
      backgroundColor: '#F9FAFB',
      marginBottom: 16,
    } : {}}>
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-4" style={isWeb && isLargeScreen ? {
        marginBottom: 40,
      } : {}}>
        <View className="flex-row items-center">
          <View className="rounded-lg items-center justify-center mr-2" style={isWeb && isLargeScreen ? {
            width: 48,
            height: 48,
            backgroundColor: '#FDF8E8',
            borderWidth: 2,
            borderColor: '#F0E4C0',
          } : {
            width: 32,
            height: 32,
            backgroundColor: '#FDF8E8',
          }}>
            <Ionicons name="document-text" size={isWeb && isLargeScreen ? 24 : 18} color="#D4A017" />
          </View>
          <Text 
            className="text-gray-900 font-playfair-bold"
            style={isWeb && isLargeScreen ? { fontSize: 32, fontWeight: '700', color: '#4A2E1C' } : { fontSize: 18 }}
          >
            Today&apos;s Shloka
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center" style={isWeb && isLargeScreen ? {
          backgroundColor: '#FDF8E8',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: '#F0E4C0',
        } : {}}>
          <Text 
            className="text-[#4A2E1C] font-poppins-semibold mr-1"
            style={isWeb && isLargeScreen ? { fontSize: 16, fontWeight: '600' } : { fontSize: 14 }}
          >
            Archive
          </Text>
          <Ionicons name="chevron-forward" size={isWeb && isLargeScreen ? 18 : 14} color="#4A2E1C" />
        </TouchableOpacity>
      </View>

      {/* Shloka Card */}
      <Animated.View 
        style={{ 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View 
          className="bg-[#F3E4C8] rounded-2xl overflow-hidden border border-[#E5D1AF]"
          style={{ 
            shadowColor: '#4A2E1C',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Header */}
          <View className="bg-[#B87333] px-4 py-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="book" size={16} color="white" />
              <Text className="text-white font-poppins-semibold text-sm ml-2">{shloka.source}</Text>
            </View>
            <View className={`${diffColors.bg} px-2.5 py-0.5 rounded-full`}>
              <Text className={`${diffColors.text} text-xs font-poppins-bold`}>
                {shloka.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="p-5" style={isWeb && isLargeScreen ? {
            padding: 32,
          } : {}}>
            {/* Sanskrit Text */}
            <Text 
              className="text-gray-800 font-sanskrit-medium mb-3 text-center"
              style={isWeb && isLargeScreen ? {
                fontSize: 26,
                lineHeight: 42,
                color: '#4A2E1C',
              } : {
                fontSize: 18,
                lineHeight: 28,
              }}
            >
              {shloka.devanagari}
            </Text>
            
            {/* Divider */}
            <View className="bg-[#E5D1AF]" style={isWeb && isLargeScreen ? {
              height: 2,
              marginVertical: 24,
            } : {
              height: 1,
              marginVertical: 12,
            }} />
            
            {/* Translation */}
            <Text 
              className="text-gray-600 text-center italic font-poppins"
              style={isWeb && isLargeScreen ? {
                fontSize: 18,
                lineHeight: 28,
                color: '#6B5744',
              } : {
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {shloka.translation}
            </Text>

            {/* Footer */}
            <View className="flex-row items-center justify-between" style={isWeb && isLargeScreen ? {
              marginTop: 32,
            } : {
              marginTop: 20,
            }}>
              <View className="flex-row items-center bg-white rounded-full border border-[#E5D1AF]" style={isWeb && isLargeScreen ? {
                paddingHorizontal: 20,
                paddingVertical: 12,
              } : {
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}>
                <Ionicons name="musical-notes" size={isWeb && isLargeScreen ? 18 : 14} color="#B87333" />
                <Text 
                  className="text-gray-600 font-poppins-medium ml-1.5"
                  style={isWeb && isLargeScreen ? { fontSize: 16, color: '#6B5744' } : { fontSize: 12 }}
                >
                  {shloka.chandas.name}
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <TouchableOpacity className="bg-white rounded-full items-center justify-center mr-2 border border-[#E5D1AF]" style={isWeb && isLargeScreen ? {
                  width: 52,
                  height: 52,
                } : {
                  width: 40,
                  height: 40,
                }}>
                  <Ionicons name="volume-high" size={isWeb && isLargeScreen ? 24 : 18} color="#B87333" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-[#D4A017] rounded-xl flex-row items-center" style={isWeb && isLargeScreen ? {
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                } : {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}>
                  <Ionicons name="play" size={isWeb && isLargeScreen ? 18 : 14} color="white" />
                  <Text 
                    className="text-white font-poppins-bold ml-1.5"
                    style={isWeb && isLargeScreen ? { fontSize: 16 } : { fontSize: 14 }}
                  >
                    Practice
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
