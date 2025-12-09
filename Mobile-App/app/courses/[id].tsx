/**
 * CourseDetailScreen - Comprehensive Course Details
 * Displays all course information with creative design
 * Videos are only shown to enrolled users
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import courseService, { Course } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
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

// Section Header Component
const SectionHeader = ({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) => (
  <View 
    className="flex-row items-center"
    style={{ marginBottom: isLargeScreen ? 24 : 16 }}
  >
    <View 
      className="bg-[#F3E4C8] rounded-xl items-center justify-center"
      style={{ 
        width: isLargeScreen ? 52 : 40, 
        height: isLargeScreen ? 52 : 40 
      }}
    >
      <Ionicons name={icon as any} size={isLargeScreen ? 28 : 20} color={PRIMARY_BROWN} />
    </View>
    <View style={{ marginLeft: isLargeScreen ? 16 : 12, flex: 1 }}>
      <Text 
        className="text-gray-900 font-bold"
        style={{ fontSize: isLargeScreen ? 26 : 18 }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text 
          className="text-gray-500"
          style={{ fontSize: isLargeScreen ? 16 : 14 }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  </View>
);

// Info Card Component
const InfoCard = ({ icon, label, value, color = COPPER }: { icon: string; label: string; value: string; color?: string }) => (
  <View 
    className="bg-white rounded-2xl flex-1 mx-1 border border-gray-100" 
    style={{ 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 }, 
      shadowOpacity: isLargeScreen ? 0.08 : 0.05, 
      shadowRadius: isLargeScreen ? 12 : 8, 
      elevation: isLargeScreen ? 4 : 2,
      padding: isLargeScreen ? 24 : 16
    }}
  >
    <View 
      className="rounded-xl items-center justify-center"
      style={{ 
        backgroundColor: `${color}15`,
        width: isLargeScreen ? 48 : 36,
        height: isLargeScreen ? 48 : 36,
        marginBottom: isLargeScreen ? 16 : 8
      }}
    >
      <Ionicons name={icon as any} size={isLargeScreen ? 24 : 18} color={color} />
    </View>
    <Text 
      className="text-gray-500 mb-1"
      style={{ fontSize: isLargeScreen ? 14 : 12 }}
    >
      {label}
    </Text>
    <Text 
      className="text-gray-900 font-bold" 
      style={{ fontSize: isLargeScreen ? 20 : 16 }}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

// Objective/Prerequisite Item Component
const ListItem = ({ text, icon = 'checkmark-circle' }: { text: string; icon?: string }) => (
  <View 
    className="flex-row items-start mb-3"
    style={{ paddingVertical: isLargeScreen ? 8 : 4 }}
  >
    <View 
      className="bg-emerald-100 rounded-full items-center justify-center mt-0.5"
      style={{ 
        width: isLargeScreen ? 32 : 24, 
        height: isLargeScreen ? 32 : 24 
      }}
    >
      <Ionicons name={icon as any} size={isLargeScreen ? 18 : 14} color="#10b981" />
    </View>
    <Text 
      className="flex-1 text-gray-700 ml-3 leading-6"
      style={{ fontSize: isLargeScreen ? 18 : 16 }}
    >
      {text}
    </Text>
  </View>
);

// Expandable Unit Card Component
const UnitCard = ({ unit, index, isEnrolled, totalUnits }: { unit: any; index: number; isEnrolled: boolean; totalUnits: number }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const totalLessons = unit.lessons?.length || 0;
  const totalLectures = unit.lessons?.reduce((sum: number, lesson: any) => sum + (lesson.lectures?.length || 0), 0) || 0;

  return (
    <View 
      className="bg-white rounded-2xl mb-3 overflow-hidden border border-gray-100" 
      style={{ 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 }, 
        shadowOpacity: isLargeScreen ? 0.1 : 0.05, 
        shadowRadius: isLargeScreen ? 16 : 8, 
        elevation: isLargeScreen ? 4 : 2,
        marginBottom: isLargeScreen ? 16 : 12
      }}
    >
      <TouchableOpacity 
        onPress={toggleExpand} 
        activeOpacity={0.8} 
        style={{ padding: isLargeScreen ? 24 : 16 }}
      >
        <View className="flex-row items-center">
          <View 
            className="bg-[#F3E4C8] rounded-xl items-center justify-center"
            style={{ 
              width: isLargeScreen ? 56 : 40, 
              height: isLargeScreen ? 56 : 40 
            }}
          >
            <Text 
              className="text-[#B87333] font-bold"
              style={{ fontSize: isLargeScreen ? 20 : 16 }}
            >
              {index + 1}
            </Text>
          </View>
          <View className="flex-1 ml-3">
            <Text 
              className="text-gray-900 font-bold" 
              style={{ fontSize: isLargeScreen ? 20 : 16 }}
              numberOfLines={2}
            >
              {unit.title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text 
                className="text-gray-500"
                style={{ fontSize: isLargeScreen ? 16 : 14 }}
              >
                {totalLessons} Lessons • {totalLectures} Lectures
              </Text>
              {unit.estimatedDuration > 0 && (
                <Text 
                  className="text-gray-400 ml-2"
                  style={{ fontSize: isLargeScreen ? 16 : 14 }}
                >
                  • {unit.estimatedDuration} min
                </Text>
              )}
            </View>
          </View>
          <View 
            className="bg-gray-100 rounded-lg items-center justify-center"
            style={{ 
              width: isLargeScreen ? 44 : 32, 
              height: isLargeScreen ? 44 : 32 
            }}
          >
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={isLargeScreen ? 24 : 18} color="#6b7280" />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View 
          className="border-t border-gray-100"
          style={{ 
            paddingHorizontal: isLargeScreen ? 24 : 16, 
            paddingBottom: isLargeScreen ? 24 : 16 
          }}
        >
          {unit.description && (
            <Text 
              className="text-gray-600 mt-3 mb-4 leading-5"
              style={{ fontSize: isLargeScreen ? 16 : 14 }}
            >
              {unit.description}
            </Text>
          )}
          
          {/* Lessons */}
          {unit.lessons?.map((lesson: any, lessonIndex: number) => (
            <View key={lesson.lessonId || lessonIndex} className="mb-4">
              <View className="flex-row items-center mb-2">
                <View 
                  className="bg-[#FDF8E8] rounded-lg items-center justify-center"
                  style={{ 
                    width: isLargeScreen ? 36 : 28, 
                    height: isLargeScreen ? 36 : 28 
                  }}
                >
                  <Text 
                    className="text-[#D4A017] font-bold"
                    style={{ fontSize: isLargeScreen ? 14 : 12 }}
                  >
                    {lessonIndex + 1}
                  </Text>
                </View>
                <Text 
                  className="text-gray-800 font-semibold ml-2 flex-1" 
                  style={{ fontSize: isLargeScreen ? 18 : 14 }}
                  numberOfLines={2}
                >
                  {lesson.title}
                </Text>
              </View>
              
              {lesson.description && (
                <Text 
                  className="text-gray-500 ml-9 mb-2"
                  style={{ fontSize: isLargeScreen ? 14 : 12 }}
                >
                  {lesson.description}
                </Text>
              )}

              {/* Lectures */}
              {lesson.lectures?.map((lecture: any, lectureIndex: number) => (
                <View 
                  key={lecture.lectureId || lectureIndex} 
                  className="ml-9 flex-row items-center border-b border-gray-50"
                  style={{ paddingVertical: isLargeScreen ? 12 : 8 }}
                >
                  <View 
                    className="rounded-full items-center justify-center" 
                    style={{ 
                      backgroundColor: lecture.content?.videoUrl ? '#dbeafe' : '#f3f4f6',
                      width: isLargeScreen ? 36 : 24,
                      height: isLargeScreen ? 36 : 24
                    }}
                  >
                    <Ionicons 
                      name={lecture.content?.videoUrl ? 'play-circle' : 'document-text'} 
                      size={isLargeScreen ? 20 : 14} 
                      color={lecture.content?.videoUrl ? '#3b82f6' : '#6b7280'} 
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Text 
                      className="text-gray-700" 
                      style={{ fontSize: isLargeScreen ? 16 : 14 }}
                      numberOfLines={1}
                    >
                      {lecture.title}
                    </Text>
                    {lecture.content?.duration > 0 && (
                      <Text 
                        className="text-gray-400"
                        style={{ fontSize: isLargeScreen ? 14 : 12 }}
                      >
                        {lecture.content.duration} min
                      </Text>
                    )}
                  </View>
                  {!isEnrolled && lecture.content?.videoUrl && (
                    <View 
                      className="bg-gray-100 rounded"
                      style={{ paddingHorizontal: isLargeScreen ? 10 : 8, paddingVertical: isLargeScreen ? 6 : 4 }}
                    >
                      <Ionicons name="lock-closed" size={isLargeScreen ? 16 : 12} color="#6b7280" />
                    </View>
                  )}
                  {lecture.metadata?.isFree && (
                    <View 
                      className="bg-emerald-100 rounded ml-1"
                      style={{ paddingHorizontal: isLargeScreen ? 10 : 8, paddingVertical: isLargeScreen ? 6 : 4 }}
                    >
                      <Text 
                        className="text-emerald-700 font-medium"
                        style={{ fontSize: isLargeScreen ? 14 : 12 }}
                      >
                        Free
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'curriculum' | 'instructor'>('overview');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadCourse();
  }, [id]);

  // Helper function to calculate content stats from units array
  const calculateContentStats = (units: any[]) => {
    if (!units || !Array.isArray(units)) {
      return { totalUnits: 0, totalLessons: 0, totalLectures: 0, totalDuration: 0 };
    }
    
    let totalLessons = 0;
    let totalLectures = 0;
    let totalDuration = 0;
    
    units.forEach(unit => {
      const lessons = unit.lessons || [];
      totalLessons += lessons.length;
      
      lessons.forEach((lesson: any) => {
        const lectures = lesson.lectures || [];
        totalLectures += lectures.length;
        
        lectures.forEach((lecture: any) => {
          totalDuration += lecture.content?.duration || 0;
        });
      });
    });
    
    return {
      totalUnits: units.length,
      totalLessons,
      totalLectures,
      totalDuration
    };
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(id as string);
      console.log('Course response:', response);
      
      // Get course data and userAccess from response
      const courseData = response.data?.course || response.course;
      const userAccess = response.data?.userAccess || response.userAccess;
      
      // Calculate content stats from actual units array
      const units = courseData?.structure?.units || [];
      const contentStats = calculateContentStats(units);
      
      // Merge course data with calculated stats and enrollment status
      const enrichedCourse = {
        ...courseData,
        isEnrolled: userAccess?.isEnrolled || false,
        enrollmentStatus: userAccess?.enrollmentStatus,
        userProgress: userAccess?.progress,
        structure: {
          ...courseData?.structure,
          totalUnits: contentStats.totalUnits,
          totalLessons: contentStats.totalLessons,
          totalLectures: contentStats.totalLectures,
          totalDuration: courseData?.structure?.totalDuration || contentStats.totalDuration
        }
      };
      
      console.log('Enriched course structure:', {
        units: enrichedCourse.structure?.units?.length,
        totalUnits: enrichedCourse.structure?.totalUnits,
        totalLessons: enrichedCourse.structure?.totalLessons,
        totalLectures: enrichedCourse.structure?.totalLectures,
        isEnrolled: enrichedCourse.isEnrolled
      });
      
      setCourse(enrichedCourse);
    } catch (error) {
      console.error('Failed to load course:', error);
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollFree = async () => {
    try {
      setEnrolling(true);
      await courseService.enrollInCourse(course!._id);
      Alert.alert('🎉 Congratulations!', 'You have been enrolled in this course!', [
        { text: 'Start Learning', onPress: () => router.push(`/courses/${course!._id}/learn`) }
      ]);
      loadCourse();
    } catch (error: any) {
      console.error('Enrollment failed:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase this course');
      router.push('/auth/login');
      return;
    }

    try {
      setEnrolling(true);
      
      const oneTimeAmount = course?.pricing?.oneTime?.amount;
      const subscriptionAmount = course?.pricing?.subscription?.monthly?.amount;
      const paymentAmount = oneTimeAmount || subscriptionAmount || course?.pricing?.amount || 0;
      
      const orderResponse = await courseService.createPaymentOrder(course!._id, paymentAmount);
      const { orderId, amount, currency, razorpayKeyId } = orderResponse.data;

      const checkoutHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 400px; margin: 0 auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    h2 { color: #333; text-align: center; }
    .info { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 6px; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; }
    button { width: 100%; padding: 14px; background: #4A2E1C; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Complete Payment</h2>
    <div class="info"><div class="label">Course</div><div class="value">${course!.title}</div></div>
    <div class="info"><div class="label">Amount</div><div class="value">₹${(amount / 100).toFixed(2)}</div></div>
    <button onclick="startPayment()">Pay Now</button>
  </div>
  <script>
    function startPayment() {
      var options = {
        key: '${razorpayKeyId}', amount: ${amount}, currency: '${currency}',
        name: 'ShlokaYug', description: '${course!.title}', order_id: '${orderId}',
        prefill: { name: '${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}', email: '${user?.email || ''}' },
        theme: { color: '#4A2E1C' },
        handler: function(response) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', data: response })); },
        modal: { ondismiss: function() { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'cancelled' })); } }
      };
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(response) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'failed', error: response.error })); });
      rzp.open();
    }
    setTimeout(startPayment, 500);
  </script>
</body>
</html>`;

      setPaymentHtml(checkoutHtml);
      setShowPaymentModal(true);
      setEnrolling(false);
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      Alert.alert('Error', 'Failed to initiate payment');
      setEnrolling(false);
    }
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      console.log('📱 WebView message received:', event.nativeEvent.data);
      const message = JSON.parse(event.nativeEvent.data);
      console.log('📱 Parsed message:', message);
      
      if (message.type === 'success') {
        setShowPaymentModal(false);
        setEnrolling(true);
        
        try {
          console.log('🔐 Verifying payment...', {
            order_id: message.data.razorpay_order_id,
            payment_id: message.data.razorpay_payment_id,
            courseId: course!._id
          });
          
          const verifyResponse = await courseService.verifyPayment({
            razorpay_order_id: message.data.razorpay_order_id,
            razorpay_payment_id: message.data.razorpay_payment_id,
            razorpay_signature: message.data.razorpay_signature,
            courseId: course!._id,
          });
          
          console.log('✅ Payment verification response:', JSON.stringify(verifyResponse, null, 2));

          // Wait a moment for backend enrollment to complete
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Reload course to get updated enrollment status
          await loadCourse();

          Alert.alert('🎉 Success!', 'Payment successful! You are now enrolled.', [
            { text: 'Start Learning', onPress: () => router.push(`/courses/${course!._id}/learn`) }
          ]);
        } catch (verifyError: any) {
          console.error('❌ Payment verification error:', verifyError);
          console.error('❌ Error response:', verifyError.response?.data);
          // Even if verification API fails, the payment might have succeeded on Razorpay side
          // and the webhook might handle enrollment. Show a softer error message.
          Alert.alert(
            'Payment Processing', 
            'Your payment may have been processed. Please check your "My Learning" section. If the course is not visible, contact support.',
            [
              { text: 'Check My Learning', onPress: () => router.push('/(tabs)/learn') },
              { text: 'OK', style: 'cancel' }
            ]
          );
        } finally {
          setEnrolling(false);
        }
      } else if (message.type === 'cancelled') {
        console.log('📱 Payment cancelled by user');
        setShowPaymentModal(false);
      } else if (message.type === 'failed') {
        console.log('📱 Payment failed:', message.error);
        setShowPaymentModal(false);
        Alert.alert('Payment Failed', message.error?.description || 'Payment failed. Please try again.');
      } else {
        console.log('📱 Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('WebView message parse error:', error);
      console.error('Raw message data:', event.nativeEvent?.data);
      // Don't show error alert for parse errors - might be internal Razorpay messages
      // setShowPaymentModal(false);
    }
  };

  const handleEnroll = () => {
    const oneTimeAmount = course?.pricing?.oneTime?.amount;
    const subscriptionAmount = course?.pricing?.subscription?.monthly?.amount;
    const oldAmount = course?.pricing?.amount;
    const oldType = course?.pricing?.type;
    
    const isFree = oldType === 'free' || 
                   (!oneTimeAmount && !subscriptionAmount && !oldAmount) ||
                   (oneTimeAmount === 0 && subscriptionAmount === 0);
    
    if (isFree) {
      handleEnrollFree();
    } else {
      handlePayment();
    }
  };

  const getPrice = () => {
    const oneTimeAmount = course?.pricing?.oneTime?.amount;
    const subscriptionAmount = course?.pricing?.subscription?.monthly?.amount;
    const oldAmount = course?.pricing?.amount;
    const oldType = course?.pricing?.type;
    
    if (oldType === 'free') return { text: 'Free', isFree: true };
    if (oneTimeAmount && oneTimeAmount > 0) return { text: `₹${oneTimeAmount}`, isFree: false };
    if (subscriptionAmount && subscriptionAmount > 0) return { text: `₹${subscriptionAmount}/mo`, isFree: false };
    if (oldAmount && oldAmount > 0) return { text: `₹${oldAmount}`, isFree: false };
    return { text: 'Free', isFree: true };
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { color: '#10b981', bg: '#d1fae5', label: 'Beginner', icon: 'leaf' };
      case 'intermediate': return { color: SAFFRON, bg: '#FEF3E8', label: 'Intermediate', icon: 'trending-up' };
      case 'advanced': return { color: '#ef4444', bg: '#fee2e2', label: 'Advanced', icon: 'flash' };
      case 'expert': return { color: '#7c3aed', bg: '#ede9fe', label: 'Expert', icon: 'diamond' };
      default: return { color: COPPER, bg: SAND, label: 'All Levels', icon: 'school' };
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'vedic_chanting': 'Vedic Chanting',
      'sanskrit_language': 'Sanskrit Language',
      'philosophy': 'Philosophy',
      'rituals_ceremonies': 'Rituals & Ceremonies',
      'yoga_meditation': 'Yoga & Meditation',
      'ayurveda': 'Ayurveda',
      'music_arts': 'Music & Arts',
      'scriptures': 'Scriptures',
      'other': 'Other',
    };
    return labels[cat] || cat;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <View className="w-16 h-16 bg-[#F3E4C8] rounded-full items-center justify-center mb-4">
          <ActivityIndicator size="large" color={PRIMARY_BROWN} />
        </View>
        <Text className="text-gray-600 font-medium">Loading course details...</Text>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="alert-circle" size={60} color="#ef4444" />
        <Text className="text-gray-600 text-lg mt-4">Course not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3 rounded-xl" style={{ backgroundColor: SAFFRON }}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const priceInfo = getPrice();
  const difficultyConfig = getDifficultyConfig(course.metadata?.difficulty);
  const thumbnailUrl = getFullImageUrl(course.thumbnail);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Animated Header */}
      <Animated.View 
        className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
        style={{ 
          opacity: headerOpacity,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8
        }}
      >
        <SafeAreaView edges={['top']}>
          <View 
            className="flex-row items-center justify-between"
            style={{ 
              paddingHorizontal: isLargeScreen ? 60 : 16, 
              paddingVertical: isLargeScreen ? 16 : 12,
              maxWidth: isLargeScreen ? 1400 : '100%',
              marginHorizontal: 'auto',
              width: '100%'
            }}
          >
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="bg-gray-100 rounded-full items-center justify-center"
              style={{ width: isLargeScreen ? 48 : 40, height: isLargeScreen ? 48 : 40 }}
            >
              <Ionicons name="arrow-back" size={isLargeScreen ? 24 : 20} color="#333" />
            </TouchableOpacity>
            <Text 
              className="text-gray-900 font-bold flex-1 text-center mx-4" 
              style={{ fontSize: isLargeScreen ? 22 : 18 }}
              numberOfLines={1}
            >
              {course.title}
            </Text>
            <TouchableOpacity 
              className="bg-gray-100 rounded-full items-center justify-center"
              style={{ width: isLargeScreen ? 48 : 40, height: isLargeScreen ? 48 : 40 }}
            >
              <Ionicons name="share-social" size={isLargeScreen ? 24 : 20} color="#333" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        contentContainerStyle={{ 
          paddingBottom: isLargeScreen ? 120 : 80
        }}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {/* Hero Section with Thumbnail */}
        <View className="relative">
          {thumbnailUrl ? (
            <Image 
              source={{ uri: thumbnailUrl }} 
              style={{ width: '100%', height: isLargeScreen ? 480 : 288 }}
              resizeMode="cover" 
            />
          ) : (
            <View 
              className="w-full bg-[#E5D1AF] items-center justify-center"
              style={{ height: isLargeScreen ? 480 : 288 }}
            >
              <Ionicons name="book" size={isLargeScreen ? 120 : 80} color={PRIMARY_BROWN} />
            </View>
          )}
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            className="absolute bottom-0 left-0 right-0 h-32"
          />

          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-4 left-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity className="absolute top-4 right-4 w-10 h-10 bg-black/30 rounded-full items-center justify-center">
            <Ionicons name="share-social" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Enrolled Badge */}
          {course.isEnrolled && (
            <View className="absolute top-4 left-16 bg-emerald-500 px-3 py-1.5 rounded-full flex-row items-center">
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text className="text-white text-sm font-bold ml-1">Enrolled</Text>
            </View>
          )}

          {/* Price Badge */}
          <View className={`absolute top-4 right-16 px-4 py-1.5 rounded-full ${priceInfo.isFree ? 'bg-emerald-500' : ''}`} style={!priceInfo.isFree ? { backgroundColor: SAFFRON } : undefined}>
            <Text className="text-white text-base font-bold">{priceInfo.text}</Text>
          </View>

          {/* Title on Image */}
          <View 
            className="absolute left-4 right-4"
            style={{ 
              bottom: isLargeScreen ? 40 : 16,
              left: isLargeScreen ? 60 : 16,
              right: isLargeScreen ? 60 : 16
            }}
          >
            <Text 
              className="text-white font-bold" 
              style={{ 
                fontSize: isLargeScreen ? 40 : 24,
                lineHeight: isLargeScreen ? 48 : 32
              }}
              numberOfLines={2}
            >
              {course.title}
            </Text>
            <Text 
              className="text-white/80 mt-1" 
              style={{ fontSize: isLargeScreen ? 18 : 14 }}
              numberOfLines={1}
            >
              by {course.instructor?.name}
            </Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View 
          className="flex-row bg-white rounded-t-3xl"
          style={{
            paddingHorizontal: isLargeScreen ? 60 : 16,
            paddingVertical: isLargeScreen ? 32 : 16,
            marginTop: isLargeScreen ? -32 : -16,
            borderTopLeftRadius: isLargeScreen ? 32 : 24,
            borderTopRightRadius: isLargeScreen ? 32 : 24
          }}
        >
          <View 
            className="flex-1 items-center"
            style={{ paddingVertical: isLargeScreen ? 16 : 8 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="star" size={isLargeScreen ? 28 : 18} color="#fbbf24" />
              <Text 
                className="text-gray-900 font-bold ml-1"
                style={{ fontSize: isLargeScreen ? 28 : 18 }}
              >
                {(course.stats?.rating || course.stats?.ratings?.average || 0).toFixed(1)}
              </Text>
            </View>
            <Text 
              className="text-gray-500 mt-1"
              style={{ fontSize: isLargeScreen ? 16 : 12 }}
            >
              {course.stats?.reviews || course.stats?.ratings?.count || 0} reviews
            </Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View 
            className="flex-1 items-center"
            style={{ paddingVertical: isLargeScreen ? 16 : 8 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="people" size={isLargeScreen ? 28 : 18} color={COPPER} />
              <Text 
                className="text-gray-900 font-bold ml-1"
                style={{ fontSize: isLargeScreen ? 28 : 18 }}
              >
                {course.stats?.enrollments || course.stats?.enrollment?.total || 0}
              </Text>
            </View>
            <Text 
              className="text-gray-500 mt-1"
              style={{ fontSize: isLargeScreen ? 16 : 12 }}
            >
              students
            </Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View 
            className="flex-1 items-center"
            style={{ paddingVertical: isLargeScreen ? 16 : 8 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="time" size={isLargeScreen ? 28 : 18} color="#3b82f6" />
              <Text 
                className="text-gray-900 font-bold ml-1"
                style={{ fontSize: isLargeScreen ? 28 : 18 }}
              >
                {Math.floor((course.structure?.totalDuration || 0) / 60)}h
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">{(course.structure?.totalDuration || 0) % 60}m</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View 
          className="flex-row bg-white border-b border-gray-100"
          style={{
            paddingHorizontal: isLargeScreen ? 60 : 16,
            paddingBottom: isLargeScreen ? 20 : 12,
            maxWidth: isLargeScreen ? 1200 : '100%',
            width: '100%',
            marginHorizontal: 'auto'
          }}
        >
          {(['overview', 'curriculum', 'instructor'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveSection(tab)}
              className={`flex-1 rounded-xl ${activeSection !== tab && 'bg-gray-100'} mx-1`}
              style={{
                ...(activeSection === tab ? { backgroundColor: COPPER } : undefined),
                paddingVertical: isLargeScreen ? 16 : 12,
                borderRadius: isLargeScreen ? 14 : 12
              }}
              activeOpacity={0.8}
            >
              <Text 
                className={`text-center font-bold capitalize ${activeSection === tab ? 'text-white' : 'text-gray-600'}`}
                style={{ fontSize: isLargeScreen ? 18 : 14 }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Sections */}
        <View 
          style={{
            paddingHorizontal: isLargeScreen ? 60 : 16,
            paddingVertical: isLargeScreen ? 48 : 24,
            maxWidth: isLargeScreen ? 1200 : '100%',
            width: '100%',
            marginHorizontal: 'auto'
          }}
        >
          {activeSection === 'overview' && (
            <>
              {/* Course Info Cards - Grid for Web */}
              <View 
                style={{ 
                  flexDirection: 'row', 
                  flexWrap: 'wrap',
                  marginBottom: isLargeScreen ? 32 : 24 
                }}
              >
                <InfoCard icon="school" label="Difficulty" value={difficultyConfig.label} color={difficultyConfig.color} />
                <InfoCard icon="language" label="Language" value={course.metadata?.language?.instruction || 'English'} color="#3b82f6" />
                <InfoCard icon="pricetag" label="Category" value={getCategoryLabel(course.metadata?.category?.[0] || 'other')} color="#8b5cf6" />
                <InfoCard icon="layers" label="Content" value={`${course.structure?.totalLectures || 0} Lectures`} color="#f59e0b" />
              </View>

              {/* Short Description */}
              {course.shortDescription && (
                <View 
                  className="bg-[#FDF8E8] rounded-2xl border border-[#EDD999]"
                  style={{ 
                    padding: isLargeScreen ? 24 : 16, 
                    marginBottom: isLargeScreen ? 32 : 24,
                    borderRadius: isLargeScreen ? 20 : 16
                  }}
                >
                  <Text 
                    className="text-[#8B6914] italic"
                    style={{ 
                      fontSize: isLargeScreen ? 20 : 16, 
                      lineHeight: isLargeScreen ? 32 : 24 
                    }}
                  >
                    &ldquo;{course.shortDescription}&rdquo;
                  </Text>
                </View>
              )}

              {/* Full Description */}
              <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                <SectionHeader icon="document-text" title="About This Course" />
                <View 
                  className="bg-white border border-gray-100"
                  style={{ 
                    padding: isLargeScreen ? 28 : 16, 
                    borderRadius: isLargeScreen ? 20 : 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
                    shadowOpacity: isLargeScreen ? 0.08 : 0.05,
                    shadowRadius: isLargeScreen ? 12 : 8,
                    elevation: isLargeScreen ? 4 : 2
                  }}
                >
                  <Text 
                    className="text-gray-700"
                    style={{ 
                      fontSize: isLargeScreen ? 18 : 16, 
                      lineHeight: isLargeScreen ? 32 : 26 
                    }}
                  >
                    {course.description}
                  </Text>
                </View>
              </View>

              {/* Learning Objectives - if available from course data */}
              {course.learningObjectives && course.learningObjectives.length > 0 && (
                <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                  <SectionHeader icon="bulb" title="What You'll Learn" subtitle="Key learning outcomes" />
                  <View 
                    className="bg-white border border-gray-100"
                    style={{ 
                      padding: isLargeScreen ? 28 : 16, 
                      borderRadius: isLargeScreen ? 20 : 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
                      shadowOpacity: isLargeScreen ? 0.08 : 0.05,
                      shadowRadius: isLargeScreen ? 12 : 8,
                      elevation: isLargeScreen ? 4 : 2
                    }}
                  >
                    {course.learningObjectives.map((objective: string, index: number) => (
                      <ListItem key={index} text={objective} />
                    ))}
                  </View>
                </View>
              )}

              {/* Prerequisites - if available */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                  <SectionHeader icon="clipboard" title="Prerequisites" subtitle="What you need to know" />
                  <View 
                    className="bg-white border border-gray-100"
                    style={{ 
                      padding: isLargeScreen ? 28 : 16, 
                      borderRadius: isLargeScreen ? 20 : 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
                      shadowOpacity: isLargeScreen ? 0.08 : 0.05,
                      shadowRadius: isLargeScreen ? 12 : 8,
                      elevation: isLargeScreen ? 4 : 2
                    }}
                  >
                    {course.prerequisites.map((prereq: string, index: number) => (
                      <ListItem key={index} text={prereq} icon="alert-circle" />
                    ))}
                  </View>
                </View>
              )}

              {/* Target Audience - if available */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                  <SectionHeader icon="people" title="Who This Course is For" subtitle="Target audience" />
                  <View 
                    className="bg-white border border-gray-100"
                    style={{ 
                      padding: isLargeScreen ? 28 : 16, 
                      borderRadius: isLargeScreen ? 20 : 16,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
                      shadowOpacity: isLargeScreen ? 0.08 : 0.05,
                      shadowRadius: isLargeScreen ? 12 : 8,
                      elevation: isLargeScreen ? 4 : 2
                    }}
                  >
                    {course.targetAudience.map((audience: string, index: number) => (
                      <ListItem key={index} text={audience} icon="person" />
                    ))}
                  </View>
                </View>
              )}

              {/* Course Stats */}
              <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                <SectionHeader icon="stats-chart" title="Course Details" subtitle="What's included" />
                <View 
                  className="bg-white border border-gray-100"
                  style={{ 
                    padding: isLargeScreen ? 28 : 16, 
                    borderRadius: isLargeScreen ? 20 : 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: isLargeScreen ? 4 : 2 },
                    shadowOpacity: isLargeScreen ? 0.08 : 0.05,
                    shadowRadius: isLargeScreen ? 12 : 8,
                    elevation: isLargeScreen ? 4 : 2
                  }}
                >
                  <View 
                    className="flex-row items-center justify-between border-b border-gray-50"
                    style={{ paddingVertical: isLargeScreen ? 16 : 12 }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="folder" size={isLargeScreen ? 24 : 20} color={PRIMARY_BROWN} />
                      <Text 
                        className="text-gray-700 ml-3"
                        style={{ fontSize: isLargeScreen ? 18 : 16 }}
                      >
                        Total Units
                      </Text>
                    </View>
                    <Text 
                      className="text-gray-900 font-bold"
                      style={{ fontSize: isLargeScreen ? 22 : 18 }}
                    >
                      {course.structure?.totalUnits || 0}
                    </Text>
                  </View>
                  <View 
                    className="flex-row items-center justify-between border-b border-gray-50"
                    style={{ paddingVertical: isLargeScreen ? 16 : 12 }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="book" size={isLargeScreen ? 24 : 20} color={COPPER} />
                      <Text 
                        className="text-gray-700 ml-3"
                        style={{ fontSize: isLargeScreen ? 18 : 16 }}
                      >
                        Total Lessons
                      </Text>
                    </View>
                    <Text 
                      className="text-gray-900 font-bold"
                      style={{ fontSize: isLargeScreen ? 22 : 18 }}
                    >
                      {course.structure?.totalLessons || 0}
                    </Text>
                  </View>
                  <View 
                    className="flex-row items-center justify-between border-b border-gray-50"
                    style={{ paddingVertical: isLargeScreen ? 16 : 12 }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="play-circle" size={isLargeScreen ? 24 : 20} color={GOLD} />
                      <Text 
                        className="text-gray-700 ml-3"
                        style={{ fontSize: isLargeScreen ? 18 : 16 }}
                      >
                        Total Lectures
                      </Text>
                    </View>
                    <Text 
                      className="text-gray-900 font-bold"
                      style={{ fontSize: isLargeScreen ? 22 : 18 }}
                    >
                      {course.structure?.totalLectures || 0}
                    </Text>
                  </View>
                  <View 
                    className="flex-row items-center justify-between"
                    style={{ paddingVertical: isLargeScreen ? 16 : 12 }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={isLargeScreen ? 24 : 20} color={SAFFRON} />
                      <Text 
                        className="text-gray-700 ml-3"
                        style={{ fontSize: isLargeScreen ? 18 : 16 }}
                      >
                        Total Duration
                      </Text>
                    </View>
                    <Text 
                      className="text-gray-900 font-bold"
                      style={{ fontSize: isLargeScreen ? 22 : 18 }}
                    >
                      {Math.floor((course.structure?.totalDuration || 0) / 60)}h {(course.structure?.totalDuration || 0) % 60}m
                    </Text>
                  </View>
                </View>
              </View>

              {/* Tags */}
              {course.metadata?.tags && course.metadata.tags.length > 0 && (
                <View style={{ marginBottom: isLargeScreen ? 32 : 24 }}>
                  <SectionHeader icon="pricetags" title="Tags" />
                  <View className="flex-row flex-wrap">
                    {course.metadata.tags.map((tag: string, index: number) => (
                      <View 
                        key={index} 
                        className="bg-[#F3E4C8] rounded-full mr-2 mb-2"
                        style={{ 
                          paddingHorizontal: isLargeScreen ? 16 : 12, 
                          paddingVertical: isLargeScreen ? 10 : 6 
                        }}
                      >
                        <Text 
                          className="text-[#B87333]"
                          style={{ fontSize: isLargeScreen ? 16 : 14 }}
                        >
                          #{tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}

          {activeSection === 'curriculum' && (
            <>
              {/* Curriculum Header */}
              <View 
                className="bg-[#FDF8E8] border border-[#EDD999]"
                style={{ 
                  padding: isLargeScreen ? 24 : 16, 
                  marginBottom: isLargeScreen ? 24 : 16,
                  borderRadius: isLargeScreen ? 20 : 16
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text 
                      className="text-[#8B6914] font-bold"
                      style={{ fontSize: isLargeScreen ? 24 : 18 }}
                    >
                      Course Curriculum
                    </Text>
                    <Text 
                      className="text-[#B87333] mt-1"
                      style={{ fontSize: isLargeScreen ? 18 : 14 }}
                    >
                      {course.structure?.totalUnits || 0} Units • {course.structure?.totalLessons || 0} Lessons • {course.structure?.totalLectures || 0} Lectures
                    </Text>
                  </View>
                  {!course.isEnrolled && (
                    <View 
                      className="bg-[#FEF3E8] rounded-lg flex-row items-center"
                      style={{ 
                        paddingHorizontal: isLargeScreen ? 16 : 12, 
                        paddingVertical: isLargeScreen ? 10 : 6 
                      }}
                    >
                      <Ionicons name="lock-closed" size={isLargeScreen ? 18 : 14} color={SAFFRON} />
                      <Text 
                        className="text-[#DD7A1F] font-medium ml-1"
                        style={{ fontSize: isLargeScreen ? 14 : 12 }}
                      >
                        Preview
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Units List */}
              {course.structure?.units && course.structure.units.length > 0 ? (
                course.structure.units
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((unit: any, index: number) => (
                    <UnitCard 
                      key={unit.unitId || index} 
                      unit={unit} 
                      index={index} 
                      isEnrolled={course.isEnrolled}
                      totalUnits={course.structure.units.length}
                    />
                  ))
              ) : (
                <View 
                  className="bg-gray-100 items-center"
                  style={{ 
                    padding: isLargeScreen ? 48 : 32, 
                    borderRadius: isLargeScreen ? 20 : 16 
                  }}
                >
                  <Ionicons name="folder-open" size={isLargeScreen ? 64 : 48} color="#9ca3af" />
                  <Text 
                    className="text-gray-500 mt-3"
                    style={{ fontSize: isLargeScreen ? 18 : 16 }}
                  >
                    Curriculum coming soon
                  </Text>
                </View>
              )}
            </>
          )}

          {activeSection === 'instructor' && (
            <>
              {/* Instructor Card */}
              <View 
                className="bg-white border border-gray-100" 
                style={{ 
                  padding: isLargeScreen ? 32 : 24, 
                  marginBottom: isLargeScreen ? 32 : 24,
                  borderRadius: isLargeScreen ? 24 : 16,
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: isLargeScreen ? 8 : 4 }, 
                  shadowOpacity: isLargeScreen ? 0.12 : 0.08, 
                  shadowRadius: isLargeScreen ? 20 : 12, 
                  elevation: isLargeScreen ? 6 : 4 
                }}
              >
                <View 
                  className="flex-row items-center"
                  style={{ marginBottom: isLargeScreen ? 24 : 16 }}
                >
                  <View 
                    className="bg-[#F3E4C8] rounded-full items-center justify-center"
                    style={{ 
                      width: isLargeScreen ? 100 : 80, 
                      height: isLargeScreen ? 100 : 80 
                    }}
                  >
                    {course.instructor?.avatar ? (
                      <Image 
                        source={{ uri: getFullImageUrl(course.instructor.avatar) || undefined }} 
                        style={{ 
                          width: isLargeScreen ? 100 : 80, 
                          height: isLargeScreen ? 100 : 80,
                          borderRadius: isLargeScreen ? 50 : 40
                        }} 
                      />
                    ) : (
                      <Ionicons name="person" size={isLargeScreen ? 48 : 40} color={PRIMARY_BROWN} />
                    )}
                  </View>
                  <View className="flex-1 ml-4">
                    <Text 
                      className="text-gray-900 font-bold"
                      style={{ fontSize: isLargeScreen ? 28 : 20 }}
                    >
                      {course.instructor?.name || 'Unknown Instructor'}
                    </Text>
                    <Text 
                      className="text-[#B87333] mt-1"
                      style={{ fontSize: isLargeScreen ? 18 : 14 }}
                    >
                      {course.instructor?.credentials || 'Instructor'}
                    </Text>
                  </View>
                </View>

                {course.instructor?.bio && (
                  <Text 
                    className="text-gray-700"
                    style={{ 
                      fontSize: isLargeScreen ? 18 : 16, 
                      lineHeight: isLargeScreen ? 28 : 24,
                      marginBottom: isLargeScreen ? 24 : 16
                    }}
                  >
                    {course.instructor.bio}
                  </Text>
                )}

                {course.instructor?.specializations && course.instructor.specializations.length > 0 && (
                  <View 
                    className="border-t border-gray-100"
                    style={{ paddingTop: isLargeScreen ? 24 : 16 }}
                  >
                    <Text 
                      className="text-gray-500 font-medium"
                      style={{ 
                        fontSize: isLargeScreen ? 16 : 14,
                        marginBottom: isLargeScreen ? 12 : 8
                      }}
                    >
                      Specializations
                    </Text>
                    <View className="flex-row flex-wrap">
                      {course.instructor.specializations.map((spec: string, index: number) => (
                        <View 
                          key={index} 
                          className="bg-[#F3E4C8] rounded-full mr-2 mb-2"
                          style={{ 
                            paddingHorizontal: isLargeScreen ? 16 : 12, 
                            paddingVertical: isLargeScreen ? 10 : 6 
                          }}
                        >
                          <Text 
                            className="text-[#B87333]"
                            style={{ fontSize: isLargeScreen ? 16 : 14 }}
                          >
                            {spec}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-32" />
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200" 
        style={{ 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: -4 }, 
          shadowOpacity: isLargeScreen ? 0.15 : 0.1, 
          shadowRadius: isLargeScreen ? 16 : 12, 
          elevation: 10,
          paddingHorizontal: isLargeScreen ? 60 : 16,
          paddingVertical: isLargeScreen ? 24 : 16
        }}
      >
        <SafeAreaView edges={['bottom']}>
          <View 
            className="flex-row items-center"
            style={{
              maxWidth: isLargeScreen ? 1200 : '100%',
              marginHorizontal: 'auto',
              width: '100%'
            }}
          >
            {/* Price Section */}
            <View className="flex-1">
              <Text 
                className="text-gray-500"
                style={{ fontSize: isLargeScreen ? 14 : 12 }}
              >
                Total Price
              </Text>
              <Text 
                className={`font-bold ${priceInfo.isFree ? 'text-emerald-600' : 'text-gray-900'}`}
                style={{ fontSize: isLargeScreen ? 32 : 24 }}
              >
                {priceInfo.text}
              </Text>
            </View>

            {/* Action Button */}
            {course.isEnrolled ? (
              <TouchableOpacity
                onPress={() => router.push(`/courses/${course._id}/learn`)}
                className="bg-emerald-500 rounded-2xl flex-row items-center"
                style={{
                  paddingHorizontal: isLargeScreen ? 40 : 32,
                  paddingVertical: isLargeScreen ? 20 : 16,
                  borderRadius: isLargeScreen ? 16 : 12
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="play-circle" size={isLargeScreen ? 28 : 22} color="#fff" />
                <Text 
                  className="text-white font-bold ml-2"
                  style={{ fontSize: isLargeScreen ? 20 : 18 }}
                >
                  Study Now
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleEnroll}
                disabled={enrolling}
                className="rounded-2xl flex-row items-center"
                style={{ 
                  backgroundColor: SAFFRON,
                  paddingHorizontal: isLargeScreen ? 40 : 32,
                  paddingVertical: isLargeScreen ? 20 : 16,
                  borderRadius: isLargeScreen ? 16 : 12
                }}
                activeOpacity={0.8}
              >
                {enrolling ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons 
                      name={priceInfo.isFree ? 'checkmark-circle' : 'card'} 
                      size={isLargeScreen ? 28 : 22} 
                      color="#fff" 
                    />
                    <Text 
                      className="text-white font-bold ml-2"
                      style={{ fontSize: isLargeScreen ? 20 : 18 }}
                    >
                      {priceInfo.isFree ? 'Enroll Free' : 'Buy Now'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Complete Payment</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ html: paymentHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={PRIMARY_BROWN} />
                <Text className="mt-4 text-gray-600">Loading payment gateway...</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
