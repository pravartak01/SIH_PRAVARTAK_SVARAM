import React, { useState } from 'react';
import { ScrollView, StatusBar, View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
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
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const [selectedShloka] = useState(ENHANCED_SHLOKAS[0]);
  const { user } = useAuth();

  const botpressHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SVARAM App</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
      }
      /* Position chat bubble above bottom navbar */
      #bp-web-widget-container {
        bottom: ${Platform.OS === 'ios' ? '90px' : '80px'} !important;
      }
      /* Constrain chat window height */
      .bpWebChat {
        max-height: calc(100vh - 140px) !important;
        bottom: ${Platform.OS === 'ios' ? '90px' : '80px'} !important;
      }
    </style>
  </head>
  <body>
    <script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js"></script>
    <script src="https://files.bpcontent.cloud/2025/12/07/16/20251207164035-GI07ZFLU.js" defer></script>
  </body>
</html>`;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Welcome Popup - Shows on app open */}
      <WelcomePopup userName={user?.profile?.firstName || user?.username || 'Friend'} />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 1. Header with User Greeting & Daily Quote */}
        <Header />

        {/* 2. Quick Actions - All USPs in one glance */}
        <QuickActions />

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
      </ScrollView>

      {/* Botpress Chat Widget - Native Botpress UI */}
      <View style={styles.botpressContainer} pointerEvents="box-none">
        <WebView
          style={styles.botpressWebView}
          source={{ html: botpressHTML }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={false}
          mixedContentMode="always"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          originWhitelist={['*']}
          backgroundColor="transparent"
          pointerEvents="auto"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  botpressContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    pointerEvents: 'box-none',
  },
  botpressWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});