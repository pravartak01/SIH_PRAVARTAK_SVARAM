/**
 * CourseCard Component - Vintage Brown with Gold/Saffron/Copper Theme
 * Reusable card component for displaying course information with animations
 */

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../../services/courseService';
import { getFullImageUrl } from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = isWeb && SCREEN_WIDTH > 768;

// Theme colors - Vintage Brown with Gold/Saffron/Copper highlights
const PRIMARY_BROWN = '#4A2E1C';    // Vintage brown for theme
const COPPER = '#B87333';           // Copper for warmth
const GOLD = '#D4A017';             // Gold for highlights
const SAFFRON = '#DD7A1F';          // Saffron for actions
const SAND = '#F3E4C8';             // Sand/Beige for backgrounds

interface CourseCardProps {
  course: Course;
  onPress: (course: Course) => void;
}

export default function CourseCard({ course, onPress }: CourseCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': 
        return { color: '#10b981', bg: '#d1fae5', label: 'Beginner', icon: 'leaf' };
      case 'intermediate': 
        return { color: SAFFRON, bg: '#FEF3E8', label: 'Intermediate', icon: 'trending-up' };
      case 'advanced': 
        return { color: '#ef4444', bg: '#fee2e2', label: 'Advanced', icon: 'flash' };
      default: 
        return { color: COPPER, bg: SAND, label: 'All Levels', icon: 'school' };
    }
  };

  const formatPrice = () => {
    const oneTimeAmount = (course.pricing as any)?.oneTime?.amount;
    const subscriptionAmount = (course.pricing as any)?.subscription?.monthly?.amount;
    const oldAmount = course.pricing?.amount;
    const oldType = course.pricing?.type;
    
    if (oldType === 'free') return { text: 'Free', isFree: true };
    if (oneTimeAmount && oneTimeAmount > 0) return { text: `₹${oneTimeAmount}`, isFree: false };
    if (subscriptionAmount && subscriptionAmount > 0) return { text: `₹${subscriptionAmount}/mo`, isFree: false };
    if (oldAmount && oldAmount > 0) return { text: `₹${oldAmount}`, isFree: false };
    
    return { text: 'Free', isFree: true };
  };

  const difficulty = course.metadata?.difficulty || 'beginner';
  const difficultyConfig = getDifficultyConfig(difficulty);
  const rating = course.stats?.rating || 0;
  const reviews = course.stats?.reviews || 0;
  const enrollments = course.stats?.enrollments || 0;
  const totalLessons = course.structure?.totalLessons || 0;
  const priceInfo = formatPrice();
  
  // Get full thumbnail URL
  const thumbnailUrl = getFullImageUrl(course.thumbnail);

  return (
    <Animated.View 
      style={{ 
        transform: [{ scale: scaleAnim }],
        maxWidth: isLargeScreen ? 600 : '100%',
        width: '100%',
        marginHorizontal: 'auto'
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(course)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        className="bg-white rounded-3xl overflow-hidden"
        style={{
          shadowColor: PRIMARY_BROWN,
          shadowOffset: { width: 0, height: isLargeScreen ? 8 : 4 },
          shadowOpacity: isLargeScreen ? 0.15 : 0.1,
          shadowRadius: isLargeScreen ? 20 : 12,
          elevation: isLargeScreen ? 8 : 5,
          marginBottom: isLargeScreen ? 32 : 16,
          borderRadius: isLargeScreen ? 24 : 20
        }}
      >
        {/* Thumbnail */}
        <View className="relative">
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: '100%', height: isLargeScreen ? 320 : 224 }}
              resizeMode="cover"
            />
          ) : (
            <View 
              className="w-full bg-[#F3E4C8] items-center justify-center"
              style={{ height: isLargeScreen ? 320 : 224 }}
            >
              <View 
                className="bg-[#E5D1AF] rounded-full items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 100 : 80, 
                  height: isLargeScreen ? 100 : 80 
                }}
              >
                <Ionicons name="book" size={isLargeScreen ? 52 : 40} color={PRIMARY_BROWN} />
              </View>
            </View>
          )}

          {/* Gradient overlay */}
          <View 
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />

          {/* Enrolled Badge */}
          {course.isEnrolled && (
            <View 
              className="absolute bg-emerald-500 rounded-full flex-row items-center"
              style={{
                top: isLargeScreen ? 20 : 12,
                left: isLargeScreen ? 20 : 12,
                paddingHorizontal: isLargeScreen ? 16 : 12,
                paddingVertical: isLargeScreen ? 10 : 6
              }}
            >
              <Ionicons name="checkmark-circle" size={isLargeScreen ? 18 : 14} color="#ffffff" />
              <Text 
                className="text-white font-bold ml-1"
                style={{ fontSize: isLargeScreen ? 14 : 12 }}
              >
                Already Enrolled
              </Text>
            </View>
          )}

          {/* Price Badge */}
          <View 
            className="absolute rounded-full"
            style={{ 
              backgroundColor: priceInfo.isFree ? '#10b981' : SAFFRON,
              top: isLargeScreen ? 20 : 12,
              right: isLargeScreen ? 20 : 12,
              paddingHorizontal: isLargeScreen ? 16 : 12,
              paddingVertical: isLargeScreen ? 10 : 6
            }}
          >
            <Text 
              className="text-white font-bold"
              style={{ fontSize: isLargeScreen ? 16 : 14 }}
            >
              {priceInfo.text}
            </Text>
          </View>

          {/* Rating on thumbnail */}
          <View 
            className="absolute flex-row items-center bg-black/50 rounded-full"
            style={{
              bottom: isLargeScreen ? 20 : 12,
              left: isLargeScreen ? 20 : 12,
              paddingHorizontal: isLargeScreen ? 14 : 10,
              paddingVertical: isLargeScreen ? 8 : 4
            }}
          >
            <Ionicons name="star" size={isLargeScreen ? 18 : 14} color="#fbbf24" />
            <Text 
              className="text-white font-bold ml-1"
              style={{ fontSize: isLargeScreen ? 16 : 14 }}
            >
              {rating.toFixed(1)}
            </Text>
            <Text 
              className="text-white/70 ml-1"
              style={{ fontSize: isLargeScreen ? 14 : 12 }}
            >
              ({reviews})
            </Text>
          </View>

          {/* Duration/Lessons badge */}
          <View 
            className="absolute bg-black/50 rounded-full flex-row items-center"
            style={{
              bottom: isLargeScreen ? 20 : 12,
              right: isLargeScreen ? 20 : 12,
              paddingHorizontal: isLargeScreen ? 14 : 10,
              paddingVertical: isLargeScreen ? 8 : 4
            }}
          >
            <Ionicons name="videocam" size={isLargeScreen ? 18 : 14} color="#ffffff" />
            <Text 
              className="text-white font-medium ml-1"
              style={{ fontSize: isLargeScreen ? 16 : 14 }}
            >
              {totalLessons} Lessons
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: isLargeScreen ? 28 : 16 }}>
          {/* Title */}
          <Text 
            className="text-gray-900 font-bold"
            style={{ 
              fontSize: isLargeScreen ? 24 : 18,
              lineHeight: isLargeScreen ? 32 : 24,
              marginBottom: isLargeScreen ? 16 : 8
            }}
            numberOfLines={2}
          >
            {course.title}
          </Text>

          {/* Instructor */}
          <View 
            className="flex-row items-center"
            style={{ marginBottom: isLargeScreen ? 20 : 12 }}
          >
            <View 
              className="bg-[#F9F0E6] rounded-full items-center justify-center"
              style={{ 
                width: isLargeScreen ? 36 : 28, 
                height: isLargeScreen ? 36 : 28 
              }}
            >
              <Ionicons name="person" size={isLargeScreen ? 18 : 14} color={COPPER} />
            </View>
            <Text 
              className="text-gray-600 font-medium" 
              style={{ 
                fontSize: isLargeScreen ? 16 : 14,
                marginLeft: isLargeScreen ? 12 : 8
              }}
              numberOfLines={1}
            >
              {course.instructor.name}
            </Text>
          </View>

          {/* Meta Info Row */}
          <View 
            className="flex-row items-center justify-between"
            style={{ marginBottom: isLargeScreen ? 24 : 16 }}
          >
            {/* Difficulty Badge */}
            <View 
              className="rounded-xl flex-row items-center"
              style={{ 
                backgroundColor: difficultyConfig.bg,
                paddingHorizontal: isLargeScreen ? 16 : 12,
                paddingVertical: isLargeScreen ? 10 : 6
              }}
            >
              <Ionicons 
                name={difficultyConfig.icon as any} 
                size={isLargeScreen ? 18 : 14} 
                color={difficultyConfig.color} 
              />
              <Text 
                className="font-bold"
                style={{ 
                  color: difficultyConfig.color,
                  fontSize: isLargeScreen ? 14 : 12,
                  marginLeft: isLargeScreen ? 8 : 4
                }}
              >
                {difficultyConfig.label}
              </Text>
            </View>

            {/* Enrollments */}
            <View className="flex-row items-center">
              <View 
                className="bg-[#FDF8E8] rounded-full items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 32 : 24, 
                  height: isLargeScreen ? 32 : 24 
                }}
              >
                <Ionicons name="people" size={isLargeScreen ? 16 : 12} color={GOLD} />
              </View>
              <Text 
                className="text-gray-600 font-medium"
                style={{ 
                  fontSize: isLargeScreen ? 16 : 14,
                  marginLeft: isLargeScreen ? 10 : 6
                }}
              >
                {enrollments > 1000 ? `${(enrollments/1000).toFixed(1)}K` : enrollments}+ learners
              </Text>
            </View>
          </View>

          {/* Enroll Button */}
          <TouchableOpacity
            onPress={() => onPress(course)}
            className="rounded-2xl items-center flex-row justify-center"
            style={{ 
              backgroundColor: course.isEnrolled ? '#10b981' : SAFFRON,
              paddingVertical: isLargeScreen ? 18 : 14,
              borderRadius: isLargeScreen ? 16 : 12
            }}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={course.isEnrolled ? 'book' : 'play-circle'} 
              size={isLargeScreen ? 24 : 18} 
              color="#ffffff" 
            />
            <Text 
              className="text-white font-bold"
              style={{ 
                fontSize: isLargeScreen ? 18 : 16,
                marginLeft: isLargeScreen ? 12 : 8
              }}
            >
              {course.isEnrolled ? 'Study Now' : 'View Course'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
