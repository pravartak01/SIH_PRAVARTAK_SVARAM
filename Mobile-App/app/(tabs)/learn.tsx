import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CourseCard from '../../components/courses/CourseCard';
import SearchBar from '../../components/courses/SearchBar';
import FilterModal from '../../components/courses/FilterModal';
import courseService, { Course, CourseFilters } from '../../services/courseService';
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

type TabType = 'browse' | 'my-learning';

// Animated Tab Button Component
const AnimatedTabButton = ({ 
  active, 
  onPress, 
  icon, 
  label 
}: { 
  active: boolean; 
  onPress: () => void; 
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="flex-1">
      <View
        className={`rounded-xl flex-row items-center justify-center`}
        style={{ 
          backgroundColor: active ? SAFFRON : '#f3f4f6',
          paddingVertical: isLargeScreen ? 16 : 12,
          paddingHorizontal: isLargeScreen ? 24 : 16
        }}
      >
        <Ionicons 
          name={active ? icon : `${icon}-outline` as any} 
          size={isLargeScreen ? 24 : 18} 
          color={active ? '#ffffff' : '#6b7280'} 
        />
        <Text
          className={`ml-2 font-bold ${active ? 'text-white' : 'text-gray-600'}`}
          style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Animated Filter Chip Component
const FilterChip = ({ 
  active, 
  onPress, 
  label,
  icon 
}: { 
  active: boolean; 
  onPress: () => void; 
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        className={`rounded-full flex-row items-center ${!active && 'bg-gray-100 border border-gray-200'}`}
        style={{ 
          transform: [{ scale: scaleAnim }],
          backgroundColor: active ? COPPER : undefined,
          paddingHorizontal: isLargeScreen ? 24 : 16,
          paddingVertical: isLargeScreen ? 12 : 8,
          marginRight: isLargeScreen ? 16 : 8
        }}
      >
        {icon && (
          <Ionicons 
            name={icon} 
            size={isLargeScreen ? 20 : 14} 
            color={active ? '#ffffff' : '#6b7280'} 
            style={{ marginRight: isLargeScreen ? 8 : 4 }}
          />
        )}
        <Text 
          className={`font-bold ${active ? 'text-white' : 'text-gray-700'}`}
          style={isLargeScreen ? { fontSize: 18 } : { fontSize: 14 }}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Animated Course Card for Enrolled Courses
const EnrolledCourseCard = ({ 
  item, 
  index, 
  onPress 
}: { 
  item: any; 
  index: number; 
  onPress: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

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

  const course = item.courseId || item.course;
  if (!course || !course._id) return null;

  // Get thumbnail URL - check both course.thumbnail and course.metadata.thumbnail
  const thumbnailUrl = getFullImageUrl(course.thumbnail || course.metadata?.thumbnail);

  const calculateProgress = () => {
    if (!item.progress || !item.progress.sectionsProgress) return 0;
    const completedLectures = item.progress.sectionsProgress.reduce(
      (total: number, section: any) => total + (section.completedLectures?.length || 0),
      0
    );
    const totalLectures = item.progress.sectionsProgress.reduce(
      (total: number, section: any) => total + (section.totalLectures || 0),
      0
    );
    return totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
  };

  const progress = calculateProgress();
  const status = progress === 0 ? 'not-started' : progress === 100 ? 'completed' : 'in-progress';

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-emerald-500', icon: 'checkmark-circle', label: 'Completed', color: '#10b981' };
      case 'in-progress':
        return { bg: 'bg-[#DD7A1F]', icon: 'play-circle', label: 'Continue', color: SAFFRON };
      default:
        return { bg: 'bg-[#D4A017]', icon: 'rocket', label: 'Start Now', color: GOLD };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
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
          marginHorizontal: isLargeScreen ? 0 : 16,
          maxWidth: isLargeScreen ? 500 : undefined,
          borderRadius: isLargeScreen ? 24 : 20,
        }}
      >
        {/* Course Thumbnail */}
        <View className="relative">
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-full"
              style={{ height: isLargeScreen ? 360 : 224 }}
              resizeMode="cover"
            />
          ) : (
            <View 
              className="w-full bg-[#F3E4C8] items-center justify-center"
              style={{ height: isLargeScreen ? 360 : 224 }}
            >
              <View 
                className="bg-[#E5D1AF] rounded-full items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 100 : 80, 
                  height: isLargeScreen ? 100 : 80 
                }}
              >
                <Ionicons name="book" size={isLargeScreen ? 56 : 40} color={PRIMARY_BROWN} />
              </View>
            </View>
          )}

          {/* Overlay gradient */}
          <View 
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />

          {/* Status Badge */}
          <View 
            className={`absolute ${statusConfig.bg} rounded-full flex-row items-center`}
            style={{
              top: isLargeScreen ? 20 : 12,
              right: isLargeScreen ? 20 : 12,
              paddingHorizontal: isLargeScreen ? 20 : 12,
              paddingVertical: isLargeScreen ? 10 : 6
            }}
          >
            <Ionicons name={statusConfig.icon as any} size={isLargeScreen ? 20 : 14} color="#ffffff" />
            <Text 
              className="text-white font-bold ml-1"
              style={isLargeScreen ? { fontSize: 16 } : { fontSize: 12 }}
            >
              {statusConfig.label}
            </Text>
          </View>

          {/* Progress on image */}
          <View 
            className="absolute"
            style={{
              bottom: isLargeScreen ? 20 : 12,
              left: isLargeScreen ? 20 : 12,
              right: isLargeScreen ? 20 : 12
            }}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text 
                className="text-white font-bold"
                style={isLargeScreen ? { fontSize: 16 } : { fontSize: 12 }}
              >
                Your Progress
              </Text>
              <Text 
                className="text-white font-bold"
                style={isLargeScreen ? { fontSize: 16 } : { fontSize: 12 }}
              >
                {progress}%
              </Text>
            </View>
            <View 
              className="bg-white/30 rounded-full overflow-hidden"
              style={{ height: isLargeScreen ? 8 : 6 }}
            >
              <View
                className="h-full rounded-full"
                style={{ width: `${progress}%`, backgroundColor: statusConfig.color }}
              />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: isLargeScreen ? 28 : 16 }}>
          {/* Title */}
          <Text 
            className="text-gray-900 font-bold mb-2" 
            style={isLargeScreen ? { fontSize: 28, lineHeight: 36 } : { fontSize: 18, lineHeight: 24 }}
            numberOfLines={2}
          >
            {course.basic?.title || course.title || 'Untitled Course'}
          </Text>

          {/* Meta info */}
          <View 
            className="flex-row items-center flex-wrap"
            style={{ marginBottom: isLargeScreen ? 20 : 12 }}
          >
            {/* Instructor */}
            <View className="flex-row items-center mb-1" style={{ marginRight: isLargeScreen ? 24 : 16 }}>
              <View 
                className="bg-[#F9F0E6] rounded-full items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 36 : 24, 
                  height: isLargeScreen ? 36 : 24 
                }}
              >
                <Ionicons name="person" size={isLargeScreen ? 18 : 12} color={COPPER} />
              </View>
              <Text 
                className="text-gray-600 font-medium"
                style={isLargeScreen ? { fontSize: 18, marginLeft: 10 } : { fontSize: 14, marginLeft: 6 }}
              >
                {course.basic?.instructor || course.instructor?.name || 'Instructor'}
              </Text>
            </View>

            {/* Duration */}
            <View className="flex-row items-center mb-1">
              <View 
                className="bg-[#FDF8E8] rounded-full items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 36 : 24, 
                  height: isLargeScreen ? 36 : 24 
                }}
              >
                <Ionicons name="time" size={isLargeScreen ? 18 : 12} color={GOLD} />
              </View>
              <Text 
                className="text-gray-600 font-medium"
                style={isLargeScreen ? { fontSize: 18, marginLeft: 10 } : { fontSize: 14, marginLeft: 6 }}
              >
                {course.metadata?.duration || '10+ Hours'}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={onPress}
            className="rounded-2xl items-center flex-row justify-center"
            style={{ 
              backgroundColor: statusConfig.color,
              paddingVertical: isLargeScreen ? 18 : 14,
              borderRadius: isLargeScreen ? 16 : 12
            }}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={status === 'completed' ? 'trophy' : status === 'in-progress' ? 'play' : 'rocket'} 
              size={isLargeScreen ? 24 : 18} 
              color="#ffffff" 
            />
            <Text 
              className="text-white font-bold ml-2"
              style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
            >
              {status === 'completed' ? 'Review Course' : status === 'in-progress' ? 'Continue Learning' : 'Start Your Journey'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function LearnScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [learningFilter, setLearningFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [activeFilters, setActiveFilters] = useState<CourseFilters>({
    priceType: 'all',
    sort: 'popular',
  });

  // Animation refs
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Header entrance animation
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    loadCourses();
    loadEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload enrolled courses when screen comes into focus (e.g., after payment)
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Screen focused - reloading enrolled courses...');
      loadEnrolledCourses();
    }, [])
  );

  // Also reload when switching to My Learning tab
  useEffect(() => {
    if (activeTab === 'my-learning') {
      console.log('🔄 Switched to My Learning tab - reloading...');
      loadEnrolledCourses();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'browse') {
      applyFiltersAndSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeFilters, courses, enrolledCourses, activeTab]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses(activeFilters);
      const coursesData = response.data?.courses || response.courses || [];
      setCourses(coursesData);
    } catch (error: any) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledCourses = async () => {
    try {
      console.log('🎓 Loading enrolled courses...');
      const response = await courseService.getEnrolledCourses();
      console.log('🎓 Enrolled courses raw response:', JSON.stringify(response, null, 2));
      
      // Response structure: { success: true, data: { enrollments: [...] } }
      // courseService returns response.data, so we get: { success, data: { enrollments } }
      const enrollments = response?.data?.enrollments || response?.enrollments || [];
      console.log('🎓 Enrollments extracted:', enrollments.length, 'enrollments');
      
      if (enrollments.length === 0) {
        console.log('🎓 No enrollments found in response. Response keys:', Object.keys(response || {}));
      }
      
      const validEnrollments = enrollments.filter((enrollment: any) => {
        const course = enrollment.courseId || enrollment.course;
        const isValid = course && course._id;
        console.log('🎓 Enrollment validation:', { 
          enrollmentId: enrollment._id,
          courseId: course?._id,
          courseTitle: course?.title,
          isValid 
        });
        return isValid;
      });
      
      console.log('🎓 Valid enrollments count:', validEnrollments.length);
      setEnrolledCourses(validEnrollments);
    } catch (error) {
      console.error('❌ Error loading enrolled courses:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'browse') {
      await loadCourses();
    } else {
      await loadEnrolledCourses();
    }
    setRefreshing(false);
  };

  const applyFiltersAndSearch = () => {
    // Create a set of enrolled course IDs for quick lookup
    const enrolledCourseIds = new Set(
      enrolledCourses.map((enrollment: any) => {
        const course = enrollment.courseId || enrollment.course;
        return course?._id || course;
      }).filter(Boolean)
    );

    // Map courses with enrollment status
    let filtered = courses.map(course => ({
      ...course,
      isEnrolled: enrolledCourseIds.has(course._id)
    }));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query)
      );
    }

    if (activeFilters.category?.length) {
      filtered = filtered.filter((course) =>
        activeFilters.category!.some((cat) => course.metadata.category.includes(cat))
      );
    }

    if (activeFilters.difficulty?.length) {
      filtered = filtered.filter((course) =>
        activeFilters.difficulty!.includes(course.metadata.difficulty)
      );
    }

    if (activeFilters.priceType && activeFilters.priceType !== 'all') {
      filtered = filtered.filter(
        (course) => course.pricing.type === activeFilters.priceType
      );
    }

    switch (activeFilters.sort) {
      case 'popular':
        filtered.sort((a, b) => (b.stats?.enrollments || 0) - (a.stats?.enrollments || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.stats?.rating || 0) - (a.stats?.rating || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.pricing?.amount || 0) - (b.pricing?.amount || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.pricing?.amount || 0) - (a.pricing?.amount || 0));
        break;
    }

    setFilteredCourses(filtered);
  };

  const handleCoursePress = (course: Course) => {
    router.push(`/courses/${course._id}`);
  };

  const handleApplyFilters = (filters: CourseFilters) => {
    setActiveFilters(filters);
    setShowFilters(false);
    loadCourses();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category?.length) count += activeFilters.category.length;
    if (activeFilters.difficulty?.length) count += activeFilters.difficulty.length;
    if (activeFilters.language) count++;
    if (activeFilters.priceType && activeFilters.priceType !== 'all') count++;
    return count;
  };

  const filteredEnrolledCourses = enrolledCourses.filter((enrollment) => {
    if (learningFilter === 'all') return true;
    const progress = enrollment.progress?.completionPercentage || 0;
    if (learningFilter === 'in-progress') return progress > 0 && progress < 100;
    if (learningFilter === 'completed') return progress === 100;
    return true;
  });

  const renderEmptyState = () => (
    <View 
      className="flex-1 items-center justify-center px-6"
      style={{ paddingVertical: isLargeScreen ? 100 : 64 }}
    >
      <View 
        className="bg-[#F3E4C8] rounded-full items-center justify-center mb-4"
        style={{ 
          width: isLargeScreen ? 120 : 96, 
          height: isLargeScreen ? 120 : 96 
        }}
      >
        <Ionicons name="search" size={isLargeScreen ? 64 : 40} color={PRIMARY_BROWN} />
      </View>
      <Text 
        className="text-gray-800 font-bold text-center mb-2"
        style={isLargeScreen ? { fontSize: 32 } : { fontSize: 20 }}
      >
        No Courses Found
      </Text>
      <Text 
        className="text-gray-500 text-center leading-5"
        style={isLargeScreen ? { fontSize: 18, maxWidth: 500 } : { fontSize: 14 }}
      >
        Try adjusting your search or filters to discover amazing courses
      </Text>
    </View>
  );

  const renderMyLearningEmpty = () => (
    <View 
      className="flex-1 items-center justify-center px-6"
      style={{ paddingVertical: isLargeScreen ? 100 : 64 }}
    >
      <View 
        className="bg-[#F3E4C8] rounded-full items-center justify-center mb-4"
        style={{ 
          width: isLargeScreen ? 120 : 96, 
          height: isLargeScreen ? 120 : 96 
        }}
      >
        <Ionicons name="school" size={isLargeScreen ? 64 : 40} color={PRIMARY_BROWN} />
      </View>
      <Text 
        className="text-gray-800 font-bold text-center mb-2"
        style={isLargeScreen ? { fontSize: 32 } : { fontSize: 20 }}
      >
        Start Your Learning Journey
      </Text>
      <Text 
        className="text-gray-500 text-center leading-5"
        style={isLargeScreen ? { 
          fontSize: 18, 
          marginBottom: 32,
          maxWidth: 500 
        } : { 
          fontSize: 14, 
          marginBottom: 24 
        }}
      >
        Explore our courses and begin mastering Sanskrit wisdom today
      </Text>
      <TouchableOpacity
        onPress={() => setActiveTab('browse')}
        style={{ 
          backgroundColor: SAFFRON,
          paddingHorizontal: isLargeScreen ? 32 : 24,
          paddingVertical: isLargeScreen ? 16 : 12,
          borderRadius: isLargeScreen ? 16 : 12
        }}
        className="flex-row items-center"
        activeOpacity={0.8}
      >
        <Ionicons name="compass" size={isLargeScreen ? 24 : 18} color="#ffffff" />
        <Text 
          className="text-white font-bold ml-2"
          style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
        >
          Explore Courses
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <Animated.View 
      className="bg-white"
      style={{
        opacity: headerFade,
        transform: [{ translateY: headerSlide }],
        paddingHorizontal: isLargeScreen ? 60 : 16,
        paddingTop: isLargeScreen ? 120 : 16,
        paddingBottom: isLargeScreen ? 20 : 8
      }}
    >
      {/* Page Title */}
      <View 
        className="flex-row items-center justify-between"
        style={{ marginBottom: isLargeScreen ? 28 : 16 }}
      >
        <View>
          <Text 
            className="text-gray-400 font-medium"
            style={isLargeScreen ? { fontSize: 18 } : { fontSize: 14 }}
          >
            Discover & Learn
          </Text>
          <Text 
            className="text-gray-900 font-bold"
            style={isLargeScreen ? { fontSize: 36, fontFamily: 'Playfair Display' } : { fontSize: 28 }}
          >
            Sanskrit Courses
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="bg-[#FDF8E8] rounded-xl items-center justify-center"
            style={{ 
              width: isLargeScreen ? 56 : 44, 
              height: isLargeScreen ? 56 : 44 
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark" size={isLargeScreen ? 28 : 20} color={GOLD} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Switcher */}
      <View 
        className="flex-row bg-gray-100 rounded-2xl"
        style={{ 
          marginBottom: isLargeScreen ? 28 : 16,
          padding: isLargeScreen ? 8 : 6,
          gap: isLargeScreen ? 12 : 8,
          maxWidth: isLargeScreen ? 600 : undefined,
          marginHorizontal: isLargeScreen ? 'auto' : 0
        }}
      >
        <AnimatedTabButton
          active={activeTab === 'browse'}
          onPress={() => setActiveTab('browse')}
          icon="compass"
          label="Explore"
        />
        <AnimatedTabButton
          active={activeTab === 'my-learning'}
          onPress={() => setActiveTab('my-learning')}
          icon="book"
          label="My Learning"
        />
      </View>

      {activeTab === 'browse' ? (
        <>
          {/* Stats Row */}
          <View 
            className="flex-row items-center justify-between bg-[#F3E4C8] rounded-2xl"
            style={{ 
              padding: isLargeScreen ? 28 : 16,
              marginBottom: isLargeScreen ? 28 : 16,
              borderRadius: isLargeScreen ? 20 : 16
            }}
          >
            <View className="flex-row items-center">
              <View 
                className="rounded-xl items-center justify-center" 
                style={{ 
                  backgroundColor: SAFFRON,
                  width: isLargeScreen ? 56 : 40,
                  height: isLargeScreen ? 56 : 40
                }}
              >
                <Ionicons name="library" size={isLargeScreen ? 28 : 20} color="#ffffff" />
              </View>
              <View style={{ marginLeft: isLargeScreen ? 16 : 12 }}>
                <Text 
                  className="text-[#4A2E1C] font-bold"
                  style={isLargeScreen ? { fontSize: 32 } : { fontSize: 18 }}
                >
                  {filteredCourses.length}
                </Text>
                <Text 
                  className="text-[#8A5E44]"
                  style={isLargeScreen ? { fontSize: 16 } : { fontSize: 12 }}
                >
                  Courses Available
                </Text>
              </View>
            </View>
            <View 
              className="bg-[#E5D1AF]"
              style={{ 
                height: isLargeScreen ? 56 : 40, 
                width: 1 
              }}
            />
            <View className="flex-row items-center">
              <View 
                className="bg-emerald-500 rounded-xl items-center justify-center"
                style={{ 
                  width: isLargeScreen ? 56 : 40,
                  height: isLargeScreen ? 56 : 40
                }}
              >
                <Ionicons name="people" size={isLargeScreen ? 28 : 20} color="#ffffff" />
              </View>
              <View style={{ marginLeft: isLargeScreen ? 16 : 12 }}>
                <Text 
                  className="text-[#4A2E1C] font-bold"
                  style={isLargeScreen ? { fontSize: 32 } : { fontSize: 18 }}
                >
                  1.2K+
                </Text>
                <Text 
                  className="text-[#8A5E44]"
                  style={isLargeScreen ? { fontSize: 16 } : { fontSize: 12 }}
                >
                  Active Learners
                </Text>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={{ marginBottom: isLargeScreen ? 20 : 12 }}>
            <View 
              className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100"
              style={{ 
                paddingHorizontal: isLargeScreen ? 24 : 16,
                paddingVertical: isLargeScreen ? 18 : 12,
                borderRadius: isLargeScreen ? 16 : 12
              }}
            >
              <Ionicons name="search" size={isLargeScreen ? 28 : 20} color="#9ca3af" />
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search courses, topics, instructors..."
              />
            </View>
          </View>

          {/* Filter Row */}
          <View 
            className="flex-row items-center justify-between"
            style={{ marginBottom: isLargeScreen ? 20 : 8 }}
          >
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              className="flex-row items-center bg-[#F9F0E6] rounded-xl border border-[#E8D5C4]"
              style={{
                paddingHorizontal: isLargeScreen ? 24 : 16,
                paddingVertical: isLargeScreen ? 14 : 10,
                borderRadius: isLargeScreen ? 14 : 12
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="options" size={isLargeScreen ? 24 : 18} color={COPPER} />
              <Text 
                className="text-[#8A5626] font-bold ml-2"
                style={isLargeScreen ? { fontSize: 18 } : { fontSize: 14 }}
              >
                Filters
              </Text>
              {getActiveFilterCount() > 0 && (
                <View 
                  className="rounded-full items-center justify-center ml-2" 
                  style={{ 
                    backgroundColor: COPPER,
                    width: isLargeScreen ? 28 : 20,
                    height: isLargeScreen ? 28 : 20
                  }}
                >
                  <Text 
                    className="text-white font-bold"
                    style={isLargeScreen ? { fontSize: 14 } : { fontSize: 10 }}
                  >
                    {getActiveFilterCount()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <View 
              className="flex-row items-center bg-gray-50 rounded-xl"
              style={{
                paddingHorizontal: isLargeScreen ? 20 : 12,
                paddingVertical: isLargeScreen ? 12 : 8,
                borderRadius: isLargeScreen ? 12 : 8
              }}
            >
              <Ionicons name="funnel" size={isLargeScreen ? 20 : 14} color="#6b7280" />
              <Text 
                className="text-gray-600 font-semibold capitalize"
                style={{ 
                  fontSize: isLargeScreen ? 16 : 14,
                  marginLeft: isLargeScreen ? 8 : 6
                }}
              >
                {activeFilters.sort?.replace('-', ' ')}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* My Learning Header */}
          <View 
            className="bg-[#F3E4C8] rounded-2xl"
            style={{
              padding: isLargeScreen ? 28 : 16,
              marginBottom: isLargeScreen ? 28 : 16,
              borderRadius: isLargeScreen ? 20 : 16
            }}
          >
            <View className="flex-row items-center">
              <View 
                className="rounded-xl items-center justify-center" 
                style={{ 
                  backgroundColor: GOLD,
                  width: isLargeScreen ? 60 : 48,
                  height: isLargeScreen ? 60 : 48
                }}
              >
                <Ionicons name="trophy" size={isLargeScreen ? 32 : 24} color="#ffffff" />
              </View>
              <View style={{ marginLeft: isLargeScreen ? 20 : 12, flex: 1 }}>
                <Text 
                  className="text-[#4A2E1C] font-bold"
                  style={isLargeScreen ? { fontSize: 28 } : { fontSize: 18 }}
                >
                  {filteredEnrolledCourses.length} Course{filteredEnrolledCourses.length !== 1 ? 's' : ''} Enrolled
                </Text>
                <Text 
                  className="text-[#8A5E44]"
                  style={isLargeScreen ? { fontSize: 16 } : { fontSize: 14 }}
                >
                  Keep up the great work!
                </Text>
              </View>
            </View>
          </View>

          {/* Filter Chips */}
          <View className="flex-row mb-2">
            <FilterChip
              active={learningFilter === 'all'}
              onPress={() => setLearningFilter('all')}
              label="All Courses"
              icon="grid"
            />
            <FilterChip
              active={learningFilter === 'in-progress'}
              onPress={() => setLearningFilter('in-progress')}
              label="In Progress"
              icon="play-circle"
            />
            <FilterChip
              active={learningFilter === 'completed'}
              onPress={() => setLearningFilter('completed')}
              label="Completed"
              icon="checkmark-circle"
            />
          </View>
        </>
      )}
    </Animated.View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <View 
            className="bg-[#F3E4C8] rounded-full items-center justify-center mb-4"
            style={{
              width: isLargeScreen ? 100 : 64,
              height: isLargeScreen ? 100 : 64
            }}
          >
            <ActivityIndicator size="large" color={PRIMARY_BROWN} />
          </View>
          <Text 
            className="text-gray-600 font-semibold"
            style={isLargeScreen ? { fontSize: 24 } : { fontSize: 16 }}
          >
            Loading courses...
          </Text>
          <Text 
            className="text-gray-400 mt-1"
            style={isLargeScreen ? { fontSize: 18 } : { fontSize: 14 }}
          >
            Preparing your learning experience
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        ListHeaderComponent={renderHeader}
        data={activeTab === 'browse' ? filteredCourses : filteredEnrolledCourses}
        renderItem={activeTab === 'browse' ? 
          ({ item, index }) => (
            <Animated.View 
              style={{
                opacity: headerFade,
                paddingHorizontal: isLargeScreen ? 0 : 16,
                maxWidth: isLargeScreen ? 1440 : '100%',
                width: '100%',
                alignSelf: 'center'
              }}
            >
              <CourseCard course={item} onPress={handleCoursePress} />
            </Animated.View>
          ) :
          ({ item, index }) => (
            <View
              style={{
                maxWidth: isLargeScreen ? 1440 : '100%',
                width: '100%',
                alignSelf: 'center',
                paddingHorizontal: isLargeScreen ? 0 : 16
              }}
            >
              <EnrolledCourseCard
                item={item}
                index={index}
                onPress={() => {
                  const courseId = (item.courseId || item.course)?._id;
                  console.log('🎓 Navigating to course learn:', courseId);
                  router.push(`/courses/${courseId}/learn`);
                }}
              />
            </View>
          )
        }
        keyExtractor={(item) => 
          activeTab === 'browse' ? item._id : (item.courseId?._id || item.course?._id || item._id)
        }
        contentContainerStyle={{ 
          paddingBottom: isLargeScreen ? 120 : 100,
          paddingHorizontal: isLargeScreen ? 60 : 0
        }}
        ListEmptyComponent={activeTab === 'browse' ? renderEmptyState : renderMyLearningEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PRIMARY_BROWN}
            colors={[PRIMARY_BROWN]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters}
      />
    </SafeAreaView>
  );
}