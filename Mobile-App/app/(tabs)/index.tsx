import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, StatusBar, Platform, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ENHANCED_SHLOKAS } from '../../data/enhancedData';
import Header from '../../components/home/Header';
import QuickActions from '../../components/home/QuickActions';
import DailyRecommendations from '../../components/home/DailyRecommendations';
import TrendingShlokas from '../../components/home/TrendingShlokas';
import MoodFilters from '../../components/home/MoodFilters';
import FeaturedAITools from '../../components/home/FeaturedAITools';
import ExploreCategories from '../../components/home/ExploreCategories';
import LiveEvents from '../../components/home/LiveEvents';
import CurrentShloka from '../../components/home/CurrentShloka';
import WelcomePopup from '../../components/home/WelcomePopup';
import ShlokaAnalysisModal from '../../components/home/ShlokaAnalysisModal';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const { user } = useAuth();
  
  // Memoize the selected shloka to prevent unnecessary re-renders
  const selectedShloka = useMemo(() => ENHANCED_SHLOKAS[0], []);
  
  // Use useCallback for stable function references
  const handleOpenAnalysis = useCallback(() => setShowAnalysisModal(true), []);
  const handleCloseAnalysis = useCallback(() => setShowAnalysisModal(false), []);

  // Web-specific styling
  const isWeb = Platform.OS === 'web';
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth > 1024;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Welcome Popup - Shows on app open */}
      <WelcomePopup userName={user?.profile?.firstName || user?.username || 'Friend'} />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isWeb ? {
          alignItems: 'center',
          paddingBottom: 100,
          paddingTop: isLargeScreen ? 100 : 0,
          backgroundColor: '#FAFAF9',
        } : { paddingBottom: 100 }}
      >
        {/* Web Container */}
        <View style={isWeb && isLargeScreen ? {
          width: '100%',
          maxWidth: 1440,
          backgroundColor: '#FFFFFF',
          borderRadius: 0,
          marginTop: 0,
        } : { width: '100%' }}>
        {/* 1. Header with User Greeting & Daily Quote */}
        <Header />

        {/* 2. Quick Actions - All USPs in one glance */}
        <QuickActions onAnalyze={handleOpenAnalysis} />

        {/* 3. Heal with Shlokas - Key USP Feature */}
        <MoodFilters />

        {/* 4. Today's Shloka - Daily Engagement */}
        <CurrentShloka shloka={selectedShloka} />

        {/* 5. AI-Curated Daily Recommendations */}
        <DailyRecommendations />

        {/* 6. Trending Shlokas - Social Proof */}
        <TrendingShlokas />

        {/* 7. Featured AI Tools */}
        <FeaturedAITools />

        {/* 8. Explore Categories */}
        <ExploreCategories />

        {/* 9. Live Events & Sessions */}
        <LiveEvents />
        </View>
      </ScrollView>

      {/* Shloka Analysis Modal */}
      <ShlokaAnalysisModal 
        visible={showAnalysisModal} 
        onClose={handleCloseAnalysis} 
      />
     
    </SafeAreaView>
  );
}

