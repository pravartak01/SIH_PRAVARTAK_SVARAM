
// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// const Videos = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.iconContainer}>
//           <Ionicons name="videocam" size={80} color="#B87333" />
//         </View>
//         <Text style={styles.title}>Videos</Text>
//         <Text style={styles.subtitle}>Will be Implemented Soon</Text>
//         <Text style={styles.description}>
//           Discover educational videos, shorts, and tutorials about Sanskrit, Chandas, and spiritual knowledge.
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   iconContainer: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#B87333',
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 15,
//     color: '#6B7280',
//     textAlign: 'center',
//     lineHeight: 22,
//   },
// });

// export default Videos;


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import videoService, { Video } from '../../services/videoService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = isWeb && SCREEN_WIDTH > 768;

type TabMode = 'discover' | 'studio';
type VideoFilter = 'all' | 'videos' | 'shorts';
type FeedType = 'trending' | 'popular' | 'recent';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'sanskrit', name: 'Sanskrit', icon: 'book' },
  { id: 'chandas', name: 'Chandas', icon: 'musical-notes' },
  { id: 'spiritual', name: 'Spiritual', icon: 'flower' },
  { id: 'educational', name: 'Educational', icon: 'school' },
  { id: 'tutorials', name: 'Tutorials', icon: 'bulb' },
];

export default function VideosScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabMode>('discover');
  const [videos, setVideos] = useState<Video[]>([]);
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [videoFilter, setVideoFilter] = useState<VideoFilter>('all');
  const [feedType, setFeedType] = useState<FeedType>('trending');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        type: feedType,
        limit: 20,
        page: 1,
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const response = await videoService.getVideoFeed(params);
      let videosData = response.data?.videos || response.videos || [];

      // Filter by video type
      if (videoFilter === 'videos') {
        videosData = videosData.filter((v: Video) => v.type === 'video');
      } else if (videoFilter === 'shorts') {
        videosData = videosData.filter((v: Video) => v.type === 'short');
      }

      setVideos(videosData);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  }, [feedType, selectedCategory, videoFilter]);

  const loadMyVideos = useCallback(async () => {
    try {
      const params: any = { limit: 50, page: 1 };
      if (videoFilter !== 'all') {
        params.type = videoFilter === 'videos' ? 'video' : 'short';
      }

      const response = await videoService.getMyVideos(params);
      setMyVideos(response.data?.videos || response.videos || []);
    } catch (error) {
      console.error('Error loading my videos:', error);
    }
  }, [videoFilter]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    if (activeTab === 'studio') {
      loadMyVideos();
    }
  }, [activeTab, loadMyVideos]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'discover') {
      await loadVideos();
    } else {
      await loadMyVideos();
    }
    setRefreshing(false);
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears}y ago`;
    if (diffMonths > 0) return `${diffMonths}mo ago`;
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const renderVideoCard = (video: Video) => {
    // Get thumbnail URL with fallback
    const thumbnailUrl = video.video?.thumbnail?.url || 
                         video.video?.originalFile?.url ||
                         null;
    
    return (
      <TouchableOpacity
        key={video._id}
        onPress={() => router.push(`/videos/${video._id}`)}
        className="bg-white"
        style={isLargeScreen ? { 
          marginBottom: 40,
          maxWidth: 1000,
          width: '100%',
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 6,
          padding: 20
        } : { marginBottom: 16 }}
      >
        {/* Thumbnail */}
        <View className="relative">
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-full bg-gray-200"
              style={isLargeScreen ? { 
                height: 480, 
                borderRadius: 20,
                backgroundColor: '#e5e7eb'
              } : { height: 208, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View 
              className="w-full items-center justify-center"
              style={isLargeScreen ? { 
                height: 480, 
                borderRadius: 20,
                backgroundColor: '#F3E4C8'
              } : { height: 208, borderRadius: 12, backgroundColor: '#F3E4C8' }}
            >
              <Ionicons name="videocam" size={isLargeScreen ? 96 : 48} color="#B87333" />
              <Text 
                className="text-[#B87333] font-bold mt-2"
                style={isLargeScreen ? { fontSize: 22 } : { fontSize: 14 }}
              >
                Video Processing
              </Text>
            </View>
          )}
          {/* Duration Badge */}
          <View 
            className="absolute bg-black/90"
            style={isLargeScreen ? { 
              bottom: 20, 
              right: 20, 
              paddingHorizontal: 16, 
              paddingVertical: 10,
              borderRadius: 10
            } : { bottom: 8, right: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}
          >
            <Text 
              className="text-white font-bold"
              style={isLargeScreen ? { fontSize: 18 } : { fontSize: 12 }}
            >
              {formatDuration(video.video?.duration || 0)}
            </Text>
          </View>
          {/* Short Badge */}
          {video.type === 'short' && (
            <View 
              className="absolute bg-[#DD7A1F] rounded-full"
              style={isLargeScreen ? { 
                top: 20, 
                left: 20, 
                paddingHorizontal: 20, 
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3
              } : { top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 4 }}
            >
              <Text 
                className="text-white font-bold"
                style={isLargeScreen ? { fontSize: 16 } : { fontSize: 10 }}
              >
                SHORT
              </Text>
            </View>
          )}
          {/* Draft Badge */}
          {(video as any).status === 'draft' && (
            <View 
              className="absolute bg-yellow-500 rounded-full"
              style={isLargeScreen ? { 
                top: 20, 
                right: 20, 
                paddingHorizontal: 20, 
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3
              } : { top: 8, right: 8, paddingHorizontal: 8, paddingVertical: 4 }}
            >
              <Text 
                className="text-white font-bold"
                style={isLargeScreen ? { fontSize: 16 } : { fontSize: 10 }}
              >
                DRAFT
              </Text>
            </View>
          )}
        </View>

        {/* Video Info */}
        <View 
          className="flex-row"
          style={isLargeScreen ? { marginTop: 28, paddingHorizontal: 12 } : { marginTop: 12, paddingHorizontal: 4 }}
        >
          {/* Creator Avatar */}
          <View style={isLargeScreen ? { marginRight: 20 } : { marginRight: 12 }}>
            {video.creator?.avatar ? (
              <Image
                source={{ uri: video.creator.avatar }}
                className="rounded-full bg-gray-300"
                style={isLargeScreen ? { 
                  width: 64, 
                  height: 64,
                  borderWidth: 3,
                  borderColor: '#f3f4f6'
                } : { width: 36, height: 36 }}
              />
            ) : (
              <View 
                className="rounded-full bg-[#B87333] items-center justify-center"
                style={isLargeScreen ? { 
                  width: 64, 
                  height: 64,
                  borderWidth: 3,
                  borderColor: '#f3f4f6'
                } : { width: 36, height: 36 }}
              >
                <Text 
                  className="text-white font-bold"
                  style={isLargeScreen ? { fontSize: 24 } : { fontSize: 14 }}
                >
                  {(video.creator?.displayName || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          {/* Title and Stats */}
          <View className="flex-1">
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { 
                fontSize: 28, 
                lineHeight: 38,
                marginBottom: 12,
                fontFamily: 'Playfair Display'
              } : { fontSize: 16, lineHeight: 20 }}
              numberOfLines={2}
            >
              {video.title}
            </Text>
            <View 
              className="flex-row items-center flex-wrap"
              style={isLargeScreen ? { gap: 16, marginTop: 8 } : { marginTop: 4 }}
            >
              <Text 
                className="text-gray-600 font-semibold"
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
              >
                {video.creator?.displayName || 'Unknown'}
              </Text>
              <View 
                className="bg-gray-400 rounded-full"
                style={isLargeScreen ? { width: 8, height: 8 } : { width: 4, height: 4, marginHorizontal: 8 }}
              />
              <Text 
                className="text-gray-600"
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
              >
                {formatViews(video.metrics?.views || 0)} views
              </Text>
              <View 
                className="bg-gray-400 rounded-full"
                style={isLargeScreen ? { width: 8, height: 8 } : { width: 4, height: 4, marginHorizontal: 8 }}
              />
              <Text 
                className="text-gray-600"
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
              >
                {formatTimeAgo(video.createdAt)}
              </Text>
            </View>
          </View>

          {/* More Options */}
          <TouchableOpacity 
            className="items-center justify-center"
            style={isLargeScreen ? { 
              marginLeft: 20, 
              padding: 12,
              borderRadius: 12,
              backgroundColor: '#f9fafb'
            } : { marginLeft: 8, padding: 4 }}
          >
            <Ionicons name="ellipsis-vertical" size={isLargeScreen ? 32 : 20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderShortsCard = (video: Video) => {
    const thumbnailUrl = video.video?.thumbnail?.url || 
                         video.video?.originalFile?.url ||
                         null;
    
    return (
      <TouchableOpacity
        key={video._id}
        onPress={() => router.push(`/videos/${video._id}` as any)}
        className="bg-white"
        style={isLargeScreen ? { 
          width: 280,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 6,
          overflow: 'hidden'
        } : { width: 160, marginRight: 12 }}
      >
        <View className="relative">
          {thumbnailUrl ? (
            <Image
              source={{ uri: thumbnailUrl }}
              className="w-full bg-gray-200"
              style={isLargeScreen ? { 
                height: 480, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20 
              } : { height: 256, borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View 
              className="w-full items-center justify-center"
              style={isLargeScreen ? { 
                height: 480, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20,
                backgroundColor: '#F3E4C8'
              } : { height: 256, borderRadius: 12, backgroundColor: '#F3E4C8' }}
            >
              <Ionicons name="videocam" size={isLargeScreen ? 64 : 32} color="#B87333" />
              <Text 
                className="text-[#B87333] font-bold mt-2"
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 12 }}
              >
                Processing
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            className="absolute bottom-0 left-0 right-0 justify-end"
            style={isLargeScreen ? { 
              height: 160, 
              padding: 24,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20
            } : { height: 96, padding: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}
          >
            <View className="flex-row items-center">
              <Ionicons name="play-circle" size={isLargeScreen ? 28 : 16} color="white" />
              <Text 
                className="text-white font-bold ml-2"
                style={isLargeScreen ? { fontSize: 22 } : { fontSize: 14 }}
              >
                {formatViews(video.metrics?.views || 0)}
              </Text>
            </View>
            <Text 
              className="text-white font-bold" 
              style={isLargeScreen ? { 
                fontSize: 22, 
                lineHeight: 30,
                marginTop: 12
              } : { fontSize: 14, lineHeight: 18, marginTop: 4 }}
              numberOfLines={2}
            >
              {video.title}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDiscoverTab = () => (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DD7A1F" />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header with gradient */}
      <LinearGradient
        colors={['#DD7A1F', '#B87333', '#4A2E1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingTop: 48, 
          paddingBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 4
        } : undefined}
        className={!isLargeScreen ? "px-5 pt-6 pb-4" : ""}
      >
        <View 
          className="flex-row items-center justify-between"
          style={isLargeScreen ? { 
            marginBottom: 32,
            maxWidth: 1440,
            marginHorizontal: 'auto',
            width: '100%'
          } : { marginBottom: 16 }}
        >
          <View className="flex-row items-center">
            <View 
              className="bg-white/20 rounded-full items-center justify-center"
              style={isLargeScreen ? { 
                width: 64, 
                height: 64, 
                marginRight: 20 
              } : { width: 48, height: 48, marginRight: 12 }}
            >
              <Ionicons name="play-circle" size={isLargeScreen ? 36 : 24} color="white" />
            </View>
            <Text 
              className="text-white font-bold"
              style={isLargeScreen ? { 
                fontSize: 48, 
                fontFamily: 'Playfair Display',
                letterSpacing: -1
              } : { fontSize: 28 }}
            >
              Discover Videos
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/videos/search')}
            className="bg-white/20 rounded-full items-center justify-center"
            style={isLargeScreen ? { 
              padding: 16,
              width: 56,
              height: 56
            } : { padding: 8 }}
          >
            <Ionicons name="search" size={isLargeScreen ? 28 : 24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Feed Type Tabs */}
        <View 
          className="flex-row bg-white/20 rounded-full"
          style={isLargeScreen ? { 
            padding: 8, 
            maxWidth: 800, 
            marginHorizontal: 'auto',
            backdropFilter: 'blur(10px)'
          } : { padding: 4 }}
        >
          {(['trending', 'popular', 'recent'] as FeedType[]).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFeedType(type)}
              className={`flex-1 rounded-full flex-row items-center justify-center ${
                feedType === type ? 'bg-white' : 'bg-transparent'
              }`}
              style={isLargeScreen ? { 
                paddingVertical: 18,
                gap: 12
              } : { paddingVertical: 8 }}
            >
              <Ionicons 
                name={
                  type === 'trending' ? 'trending-up' : 
                  type === 'popular' ? 'flame' : 'time'
                } 
                size={isLargeScreen ? 24 : 16} 
                color={feedType === type ? '#DD7A1F' : 'white'} 
              />
              <Text
                className={`font-bold capitalize ${
                  feedType === type ? 'text-[#DD7A1F]' : 'text-white'
                }`}
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Category Chips */}
      <View 
        className="bg-white border-b border-gray-200"
        style={isLargeScreen ? { 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2
        } : undefined}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={isLargeScreen ? { paddingHorizontal: 80, paddingVertical: 24 } : { paddingHorizontal: 20, paddingVertical: 12 }}
          contentContainerStyle={isLargeScreen ? { gap: 20 } : { gap: 8 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              className={`rounded-full flex-row items-center ${
                selectedCategory === cat.id
                  ? 'bg-[#DD7A1F]'
                  : 'bg-gray-100 border border-gray-300'
              }`}
              style={isLargeScreen ? { 
                paddingHorizontal: 28, 
                paddingVertical: 16, 
                marginRight: 0,
                shadowColor: selectedCategory === cat.id ? '#DD7A1F' : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: selectedCategory === cat.id ? 3 : 0
              } : { paddingHorizontal: 16, paddingVertical: 10, marginRight: 8 }}
            >
              <Ionicons
                name={cat.icon as any}
                size={isLargeScreen ? 26 : 16}
                color={selectedCategory === cat.id ? 'white' : '#6b7280'}
              />
              <Text
                className={`ml-2 font-bold ${
                  selectedCategory === cat.id ? 'text-white' : 'text-gray-700'
                }`}
                style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Video Type Filter */}
      <View 
        className="flex-row bg-white border-b border-gray-200"
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingVertical: 28, 
          gap: 20,
          maxWidth: 1440,
          marginHorizontal: 'auto',
          width: '100%'
        } : { paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}
      >
        {(['all', 'videos', 'shorts'] as VideoFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setVideoFilter(filter)}
            className={`rounded-full flex-row items-center justify-center ${
              videoFilter === filter ? 'bg-[#FEF3E8] border-2 border-[#DD7A1F]' : 'bg-gray-100'
            }`}
            style={isLargeScreen ? { 
              paddingHorizontal: 40, 
              paddingVertical: 18,
              minWidth: 180,
              shadowColor: videoFilter === filter ? '#DD7A1F' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: videoFilter === filter ? 3 : 0
            } : { paddingHorizontal: 16, paddingVertical: 10 }}
          >
            <Ionicons 
              name={
                filter === 'all' ? 'apps' :
                filter === 'videos' ? 'play-circle' : 'flash'
              }
              size={isLargeScreen ? 24 : 16}
              color={videoFilter === filter ? '#DD7A1F' : '#6b7280'}
            />
            <Text
              className={`font-bold capitalize ml-2 ${
                videoFilter === filter ? 'text-[#DD7A1F]' : 'text-gray-600'
              }`}
              style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shorts Section (if showing shorts or all) */}
      {(videoFilter === 'all' || videoFilter === 'shorts') && videos.filter(v => v.type === 'short').length > 0 && (
        <View 
          className="bg-gradient-to-br from-[#FDF8E8] to-[#FEF3E8]"
          style={isLargeScreen ? { 
            paddingVertical: 60,
            borderBottom: '1px solid #e5e7eb'
          } : { paddingVertical: 16 }}
        >
          <View 
            className="flex-row items-center justify-between"
            style={isLargeScreen ? { 
              paddingHorizontal: 80, 
              marginBottom: 36,
              maxWidth: 1440,
              marginHorizontal: 'auto',
              width: '100%'
            } : { paddingHorizontal: 20, marginBottom: 12 }}
          >
            <View className="flex-row items-center">
              <View 
                className="bg-[#DD7A1F] rounded-full items-center justify-center"
                style={isLargeScreen ? { 
                  width: 60, 
                  height: 60, 
                  marginRight: 20 
                } : { width: 40, height: 40, marginRight: 12 }}
              >
                <Ionicons name="flash" size={isLargeScreen ? 36 : 24} color="white" />
              </View>
              <Text 
                className="text-gray-900 font-bold"
                style={isLargeScreen ? { 
                  fontSize: 40, 
                  fontFamily: 'Playfair Display',
                  letterSpacing: -0.5
                } : { fontSize: 20 }}
              >
                Shorts
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/videos' as any)}
              className="flex-row items-center bg-white rounded-full"
              style={isLargeScreen ? { 
                paddingHorizontal: 24, 
                paddingVertical: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 2
              } : { paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text 
                className="text-[#DD7A1F] font-bold"
                style={isLargeScreen ? { fontSize: 18, marginRight: 8 } : { fontSize: 14 }}
              >
                View All
              </Text>
              <Ionicons name="arrow-forward" size={isLargeScreen ? 22 : 16} color="#DD7A1F" />
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={isLargeScreen ? { paddingHorizontal: 80 } : { paddingHorizontal: 20 }}
            contentContainerStyle={isLargeScreen ? { gap: 32, paddingRight: 80 } : { gap: 12 }}
          >
            {videos.filter(v => v.type === 'short').slice(0, 10).map((video) => renderShortsCard(video))}
          </ScrollView>
        </View>
      )}

      {/* Regular Videos */}
      {loading ? (
        <View 
          className="items-center justify-center bg-white"
          style={isLargeScreen ? { paddingVertical: 160 } : { paddingVertical: 80 }}
        >
          <View 
            className="bg-[#FEF3E8] rounded-full items-center justify-center"
            style={isLargeScreen ? { width: 120, height: 120, marginBottom: 24 } : { width: 80, height: 80, marginBottom: 16 }}
          >
            <ActivityIndicator size={isLargeScreen ? 'large' : 'small'} color="#DD7A1F" />
          </View>
          <Text 
            className="text-gray-600 font-semibold"
            style={isLargeScreen ? { fontSize: 24 } : { fontSize: 14 }}
          >
            Loading amazing videos...
          </Text>
          <Text 
            className="text-gray-400 mt-2"
            style={isLargeScreen ? { fontSize: 18 } : { fontSize: 12 }}
          >
            Please wait a moment
          </Text>
        </View>
      ) : videos.length === 0 ? (
        <View 
          className="items-center justify-center bg-white"
          style={isLargeScreen ? { paddingVertical: 160 } : { paddingVertical: 80 }}
        >
          <View 
            className="bg-gray-100 rounded-full items-center justify-center"
            style={isLargeScreen ? { width: 140, height: 140, marginBottom: 32 } : { width: 100, height: 100, marginBottom: 20 }}
          >
            <Ionicons name="videocam-off-outline" size={isLargeScreen ? 64 : 48} color="#9ca3af" />
          </View>
          <Text 
            className="text-gray-700 font-bold"
            style={isLargeScreen ? { fontSize: 32, fontFamily: 'Playfair Display' } : { fontSize: 18 }}
          >
            No videos found
          </Text>
          <Text 
            className="text-gray-400 mt-3 text-center"
            style={isLargeScreen ? { fontSize: 20, paddingHorizontal: 100 } : { fontSize: 14, paddingHorizontal: 40 }}
          >
            Try changing your filters or check back later
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory('all');
              setVideoFilter('all');
            }}
            className="bg-[#DD7A1F] rounded-full"
            style={isLargeScreen ? { 
              marginTop: 32, 
              paddingHorizontal: 40, 
              paddingVertical: 18 
            } : { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text 
              className="text-white font-bold"
              style={isLargeScreen ? { fontSize: 18 } : { fontSize: 14 }}
            >
              Reset Filters
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View 
          className="bg-gray-50"
          style={isLargeScreen ? { 
            paddingHorizontal: 80, 
            paddingVertical: 60, 
            maxWidth: 1440, 
            marginHorizontal: 'auto',
            width: '100%'
          } : { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white' }}
        >
          <View 
            className="flex-row items-center justify-between"
            style={isLargeScreen ? { marginBottom: 48 } : { marginBottom: 16 }}
          >
            <View className="flex-row items-center">
              <View 
                className="bg-white rounded-full items-center justify-center"
                style={isLargeScreen ? { 
                  width: 56, 
                  height: 56, 
                  marginRight: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2
                } : { display: 'none' }}
              >
                <Ionicons 
                  name={videoFilter === 'shorts' ? 'flash' : 'play-circle'} 
                  size={32} 
                  color="#DD7A1F" 
                />
              </View>
              <Text 
                className="text-gray-900 font-bold"
                style={isLargeScreen ? { 
                  fontSize: 40, 
                  fontFamily: 'Playfair Display',
                  letterSpacing: -0.5
                } : { fontSize: 18 }}
              >
                {videoFilter === 'shorts' ? 'All Shorts' : 'Recommended Videos'}
              </Text>
            </View>
            {isLargeScreen && (
              <Text className="text-gray-500" style={{ fontSize: 18 }}>
                {videos.filter(v => videoFilter === 'all' ? v.type === 'video' : true).length} videos
              </Text>
            )}
          </View>
          <View style={isLargeScreen ? { gap: 40 } : { gap: 16 }}>
            {videos.filter(v => videoFilter === 'all' ? v.type === 'video' : true).map((video) => renderVideoCard(video))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderStudioTab = () => (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#B87333" />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#B87333', '#8B5A2B', '#4A2E1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingTop: 48, 
          paddingBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 4
        } : undefined}
        className={!isLargeScreen ? "px-5 pt-6 pb-4" : ""}
      >
        <View 
          className="flex-row items-center justify-between"
          style={isLargeScreen ? { 
            marginBottom: 32,
            maxWidth: 1440,
            marginHorizontal: 'auto',
            width: '100%'
          } : { marginBottom: 16 }}
        >
          <View className="flex-row items-center">
            <View 
              className="bg-white/20 rounded-full items-center justify-center"
              style={isLargeScreen ? { 
                width: 64, 
                height: 64, 
                marginRight: 20 
              } : { width: 48, height: 48, marginRight: 12 }}
            >
              <Ionicons name="create" size={isLargeScreen ? 36 : 24} color="white" />
            </View>
            <Text 
              className="text-white font-bold"
              style={isLargeScreen ? { 
                fontSize: 48, 
                fontFamily: 'Playfair Display',
                letterSpacing: -1
              } : { fontSize: 28 }}
            >
              Creator Studio
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/videos/analytics' as any)} 
            className="bg-white/20 rounded-full items-center justify-center"
            style={isLargeScreen ? { 
              padding: 16,
              width: 56,
              height: 56
            } : { padding: 8 }}
          >
            <Ionicons name="stats-chart" size={isLargeScreen ? 28 : 24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={() => router.push('/videos/upload' as any)}
          className="bg-white rounded-xl flex-row items-center justify-center"
          style={isLargeScreen ? { 
            paddingVertical: 24, 
            borderRadius: 20,
            maxWidth: 600,
            marginHorizontal: 'auto',
            width: '100%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 6
          } : { paddingVertical: 16 }}
        >
          <View 
            className="bg-[#B87333] rounded-full items-center justify-center"
            style={isLargeScreen ? { width: 48, height: 48, marginRight: 16 } : { marginRight: 8 }}
          >
            <Ionicons name="add" size={isLargeScreen ? 32 : 24} color="white" />
          </View>
          <View>
            <Text 
              className="text-[#B87333] font-bold"
              style={isLargeScreen ? { fontSize: 24 } : { fontSize: 18 }}
            >
              Upload Video
            </Text>
            {isLargeScreen && (
              <Text className="text-gray-500" style={{ fontSize: 16 }}>
                Share your knowledge with the world
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Cards */}
      <View 
        className="bg-gray-50"
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingVertical: 60,
          borderBottom: '1px solid #e5e7eb'
        } : { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white' }}
      >
        <View 
          className="flex-row items-center"
          style={isLargeScreen ? { 
            marginBottom: 40,
            maxWidth: 1440,
            marginHorizontal: 'auto',
            width: '100%'
          } : { marginBottom: 12 }}
        >
          <View 
            className="bg-white rounded-full items-center justify-center"
            style={isLargeScreen ? { 
              width: 56, 
              height: 56, 
              marginRight: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2
            } : { display: 'none' }}
          >
            <Ionicons name="stats-chart" size={32} color="#B87333" />
          </View>
          <Text 
            className="text-gray-900 font-bold"
            style={isLargeScreen ? { 
              fontSize: 40, 
              fontFamily: 'Playfair Display',
              letterSpacing: -0.5
            } : { fontSize: 18 }}
          >
            Channel Overview
          </Text>
        </View>
        <View 
          className="flex-row flex-wrap"
          style={isLargeScreen ? { 
            gap: 32,
            maxWidth: 1440,
            marginHorizontal: 'auto',
            width: '100%'
          } : { gap: 12 }}
        >
          <View 
            className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
            style={isLargeScreen ? { 
              minWidth: 'calc(50% - 16px)', 
              padding: 36,
              borderRadius: 24,
              shadowColor: '#3b82f6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4
            } : { minWidth: '45%', padding: 16, borderRadius: 12 }}
          >
            <View className="flex-row items-center justify-between">
              <View 
                className="bg-blue-200 rounded-full items-center justify-center"
                style={isLargeScreen ? { width: 60, height: 60 } : { width: 40, height: 40 }}
              >
                <Ionicons name="eye" size={isLargeScreen ? 36 : 24} color="#3b82f6" />
              </View>
              <Text 
                className="text-blue-600 font-bold"
                style={isLargeScreen ? { fontSize: 16, letterSpacing: 1 } : { fontSize: 10 }}
              >
                TOTAL VIEWS
              </Text>
            </View>
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { fontSize: 48, marginTop: 20 } : { fontSize: 24, marginTop: 8 }}
            >
              {formatViews(myVideos.reduce((sum, v) => sum + (v.metrics?.views || 0), 0))}
            </Text>
          </View>

          <View 
            className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
            style={isLargeScreen ? { 
              minWidth: 'calc(50% - 16px)', 
              padding: 36,
              borderRadius: 24,
              shadowColor: '#10b981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4
            } : { minWidth: '45%', padding: 16, borderRadius: 12 }}
          >
            <View className="flex-row items-center justify-between">
              <View 
                className="bg-green-200 rounded-full items-center justify-center"
                style={isLargeScreen ? { width: 60, height: 60 } : { width: 40, height: 40 }}
              >
                <Ionicons name="heart" size={isLargeScreen ? 36 : 24} color="#10b981" />
              </View>
              <Text 
                className="text-green-600 font-bold"
                style={isLargeScreen ? { fontSize: 16, letterSpacing: 1 } : { fontSize: 10 }}
              >
                TOTAL LIKES
              </Text>
            </View>
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { fontSize: 48, marginTop: 20 } : { fontSize: 24, marginTop: 8 }}
            >
              {formatViews(myVideos.reduce((sum, v) => sum + (v.metrics?.likes || 0), 0))}
            </Text>
          </View>

          <View 
            className="flex-1 bg-[#F9F0E6] border border-[#E5D1AF]"
            style={isLargeScreen ? { 
              minWidth: 'calc(50% - 16px)', 
              padding: 36,
              borderRadius: 24,
              shadowColor: '#B87333',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4
            } : { minWidth: '45%', padding: 16, borderRadius: 12 }}
          >
            <View className="flex-row items-center justify-between">
              <View 
                className="bg-[#E5D1AF] rounded-full items-center justify-center"
                style={isLargeScreen ? { width: 60, height: 60 } : { width: 40, height: 40 }}
              >
                <Ionicons name="videocam" size={isLargeScreen ? 36 : 24} color="#B87333" />
              </View>
              <Text 
                className="text-[#B87333] font-bold"
                style={isLargeScreen ? { fontSize: 16, letterSpacing: 1 } : { fontSize: 10 }}
              >
                VIDEOS
              </Text>
            </View>
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { fontSize: 48, marginTop: 20 } : { fontSize: 24, marginTop: 8 }}
            >
              {myVideos.filter(v => v.type === 'video').length}
            </Text>
          </View>

          <View 
            className="flex-1 bg-[#FEF3E8] border border-[#F5D4B3]"
            style={isLargeScreen ? { 
              minWidth: 'calc(50% - 16px)', 
              padding: 36,
              borderRadius: 24,
              shadowColor: '#DD7A1F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4
            } : { minWidth: '45%', padding: 16, borderRadius: 12 }}
          >
            <View className="flex-row items-center justify-between">
              <View 
                className="bg-[#F5D4B3] rounded-full items-center justify-center"
                style={isLargeScreen ? { width: 60, height: 60 } : { width: 40, height: 40 }}
              >
                <Ionicons name="flash" size={isLargeScreen ? 36 : 24} color="#DD7A1F" />
              </View>
              <Text 
                className="text-[#DD7A1F] font-bold"
                style={isLargeScreen ? { fontSize: 16, letterSpacing: 1 } : { fontSize: 10 }}
              >
                SHORTS
              </Text>
            </View>
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { fontSize: 48, marginTop: 20 } : { fontSize: 24, marginTop: 8 }}
            >
              {myVideos.filter(v => v.type === 'short').length}
            </Text>
          </View>
        </View>
      </View>

      {/* Video Type Filter */}
      <View 
        className="flex-row bg-white border-t border-gray-200"
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingVertical: 28, 
          gap: 20,
          maxWidth: 1440,
          marginHorizontal: 'auto',
          width: '100%',
          borderBottom: '1px solid #e5e7eb'
        } : { paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}
      >
        {(['all', 'videos', 'shorts'] as VideoFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setVideoFilter(filter)}
            className={`rounded-full flex-row items-center justify-center ${
              videoFilter === filter ? 'bg-[#F9F0E6] border-2 border-[#B87333]' : 'bg-gray-100'
            }`}
            style={isLargeScreen ? { 
              paddingHorizontal: 40, 
              paddingVertical: 18,
              minWidth: 180,
              shadowColor: videoFilter === filter ? '#B87333' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: videoFilter === filter ? 3 : 0
            } : { paddingHorizontal: 16, paddingVertical: 10 }}
          >
            <Ionicons 
              name={
                filter === 'all' ? 'apps' :
                filter === 'videos' ? 'play-circle' : 'flash'
              }
              size={isLargeScreen ? 24 : 16}
              color={videoFilter === filter ? '#B87333' : '#6b7280'}
            />
            <Text
              className={`font-bold capitalize ml-2 ${
                videoFilter === filter ? 'text-[#B87333]' : 'text-gray-600'
              }`}
              style={isLargeScreen ? { fontSize: 20 } : { fontSize: 14 }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* My Videos List */}
      <View 
        className="bg-gray-50"
        style={isLargeScreen ? { 
          paddingHorizontal: 80, 
          paddingVertical: 60,
          maxWidth: 1440,
          marginHorizontal: 'auto',
          width: '100%'
        } : { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'white' }}
      >
        <View 
          className="flex-row items-center justify-between"
          style={isLargeScreen ? { marginBottom: 48 } : { marginBottom: 16 }}
        >
          <View className="flex-row items-center">
            <View 
              className="bg-white rounded-full items-center justify-center"
              style={isLargeScreen ? { 
                width: 56, 
                height: 56, 
                marginRight: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2
              } : { display: 'none' }}
            >
              <Ionicons name="folder-open" size={32} color="#B87333" />
            </View>
            <Text 
              className="text-gray-900 font-bold"
              style={isLargeScreen ? { 
                fontSize: 40, 
                fontFamily: 'Playfair Display',
                letterSpacing: -0.5
              } : { fontSize: 18 }}
            >
              My Uploads
            </Text>
          </View>
          {isLargeScreen && myVideos.length > 0 && (
            <Text className="text-gray-500" style={{ fontSize: 18 }}>
              {myVideos.length} videos
            </Text>
          )}
        </View>
        {myVideos.length === 0 ? (
          <View 
            className="items-center justify-center bg-white"
            style={isLargeScreen ? { 
              paddingVertical: 160,
              borderRadius: 24
            } : { paddingVertical: 80 }}
          >
            <View 
              className="bg-[#F9F0E6] rounded-full items-center justify-center"
              style={isLargeScreen ? { width: 160, height: 160, marginBottom: 40 } : { width: 100, height: 100, marginBottom: 20 }}
            >
              <Ionicons name="videocam-outline" size={isLargeScreen ? 80 : 64} color="#B87333" />
            </View>
            <Text 
              className="text-gray-700 font-bold"
              style={isLargeScreen ? { fontSize: 36, fontFamily: 'Playfair Display' } : { fontSize: 18 }}
            >
              No videos yet
            </Text>
            <Text 
              className="text-gray-500 mt-3 text-center"
              style={isLargeScreen ? { fontSize: 22, paddingHorizontal: 120, lineHeight: 32 } : { fontSize: 14, paddingHorizontal: 32 }}
            >
              Start creating content and share your knowledge with the world!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/videos/upload' as any)}
              className="bg-[#B87333] rounded-full flex-row items-center"
              style={isLargeScreen ? { 
                marginTop: 48, 
                paddingHorizontal: 48, 
                paddingVertical: 20,
                shadowColor: '#B87333',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 4
              } : { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12 }}
            >
              <Ionicons name="add-circle" size={isLargeScreen ? 28 : 20} color="white" />
              <Text 
                className="text-white font-bold ml-2"
                style={isLargeScreen ? { fontSize: 22 } : { fontSize: 14 }}
              >
                Upload Your First Video
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={isLargeScreen ? { gap: 40 } : { gap: 16 }}>
            {myVideos.map((video) => renderVideoCard(video))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Tab Switcher */}
      <View 
        className="bg-white border-b border-gray-200"
        style={isLargeScreen ? { 
          position: 'sticky',
          top: 0,
          zIndex: 50,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4
        } : undefined}
      >
        <View 
          className="flex-row bg-gray-100 rounded-full"
          style={isLargeScreen ? { 
            padding: 10, 
            marginHorizontal: 80, 
            marginVertical: 32,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 3
          } : { padding: 8, marginHorizontal: 20, marginVertical: 12 }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('discover')}
            className={`flex-1 rounded-full flex-row items-center justify-center`}
            style={[
              activeTab === 'discover' ? { 
                backgroundColor: '#DD7A1F',
                shadowColor: '#DD7A1F',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4
              } : undefined,
              isLargeScreen ? { paddingVertical: 20, gap: 12 } : { paddingVertical: 12 }
            ]}
          >
            <Ionicons
              name="compass"
              size={isLargeScreen ? 30 : 20}
              color={activeTab === 'discover' ? 'white' : '#6b7280'}
            />
            <Text
              className={`font-bold ${
                activeTab === 'discover' ? 'text-white' : 'text-gray-600'
              }`}
              style={isLargeScreen ? { fontSize: 22 } : { fontSize: 14, marginLeft: 8 }}
            >
              Discover
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('studio')}
            className={`flex-1 rounded-full flex-row items-center justify-center`}
            style={[
              activeTab === 'studio' ? { 
                backgroundColor: '#B87333',
                shadowColor: '#B87333',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4
              } : undefined,
              isLargeScreen ? { paddingVertical: 20, gap: 12 } : { paddingVertical: 12 }
            ]}
          >
            <Ionicons
              name="create"
              size={isLargeScreen ? 30 : 20}
              color={activeTab === 'studio' ? 'white' : '#6b7280'}
            />
            <Text
              className={`font-bold ${
                activeTab === 'studio' ? 'text-white' : 'text-gray-600'
              }`}
              style={isLargeScreen ? { fontSize: 22 } : { fontSize: 14, marginLeft: 8 }}
            >
              Studio
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'discover' ? renderDiscoverTab() : renderStudioTab()}
    </SafeAreaView>
  );
}
