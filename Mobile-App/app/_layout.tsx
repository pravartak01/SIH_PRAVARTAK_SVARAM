import { useEffect, useCallback, useState } from 'react';
import { Slot, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { KidsModeProvider } from '../context/KidsModeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ChatBotProvider } from '../context/ChatBotContext';
import { FloatingChatBot } from '../components/chatbot/FloatingChatBot';
import SplashScreen from '../components/SplashScreen';
import { View, ActivityIndicator, Text } from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useFonts } from '../hooks/useFonts';
import "../global.css";
import '../i18n.config'; // Initialize i18n

// Keep the splash screen visible while we fetch resources
SplashScreenExpo.preventAutoHideAsync();

/**
 * Protected Route Logic
 * Redirects users based on authentication state
 */
function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation Debug:', { 
      isAuthenticated, 
      isLoading, 
      segments, 
      inAuthGroup, 
      inTabsGroup 
    });

    if (!isAuthenticated) {
      // User is not authenticated
      if (!inAuthGroup && segments[0] !== undefined) {
        // Redirect to login if not already on auth screens
        console.log('Redirecting to login...');
        router.replace('/auth/login');
      }
      setShowChatBot(false);
    } else {
      // User is authenticated
      if (inAuthGroup || segments[0] === undefined) {
        // Redirect to home if on auth screens or no route
        console.log('Redirecting to home...');
        router.replace('/(tabs)');
      }
      
      // Show chatbot only when on main tabs
      setShowChatBot(inTabsGroup);
    }
  }, [isAuthenticated, segments, isLoading, router]);

  return (
    <>
      <Slot />
      {showChatBot && <FloatingChatBot />}
    </>
  );
}

function AppContent() {
  const { isLoading: authLoading } = useAuth();
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowCustomSplash(false);
  };

  // Show custom splash screen with auth loading
  if (showCustomSplash) {
    return <SplashScreen onFinish={handleSplashFinish} isAuthLoading={authLoading} />;
  }

  return <RootLayoutNav />;
}

export default function RootLayout() {
  const { fontsLoaded, fontError } = useFonts();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  // Show loading screen while fonts are loading
  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-ancient-50">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4 text-sandalwood-700 text-base">Loading ShlokaYug...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <KidsModeProvider>
            <ChatBotProvider>
              <AppContent />
            </ChatBotProvider>
          </KidsModeProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
