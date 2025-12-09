import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onFinish: () => void;
  isAuthLoading: boolean;
}

/**
 * 🎨 AWESOME Splash Screen for SVARAM Application
 * 
 * Features:
 * - Beautiful Samarkan font for branding
 * - Welcoming Sanskrit shloka highlighting all app services
 * - Smooth entrance animations using React Native Animated
 * - Elegant floating particles effect
 * - Warm, inviting color scheme (no dark/gradient backgrounds)
 * - Integrated authentication loading
 */
export default function SplashScreen({ onFinish, isAuthLoading }: SplashScreenProps) {
  // Animation values
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(30)).current;
  const shlokaOpacity = useRef(new Animated.Value(0)).current;
  const shlokaTranslateY = useRef(new Animated.Value(30)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;
  const loadingWidth = useRef(new Animated.Value(0)).current;
  const particleFloat = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const decorOpacity = useRef(new Animated.Value(0)).current;

  // Track if minimum time has elapsed - using state to trigger useEffect
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Icon bounce in animation
    Animated.spring(iconScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Icon subtle rotation
    Animated.timing(iconRotate, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Name fade in and slide up
    Animated.parallel([
      Animated.timing(nameOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(nameTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Shloka fade in and slide up
    Animated.parallel([
      Animated.timing(shlokaOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 1400,
        useNativeDriver: true,
      }),
      Animated.timing(shlokaTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Loading indicator
    Animated.timing(loadingOpacity, {
      toValue: 1,
      duration: 800,
      delay: 2000,
      useNativeDriver: true,
    }).start();

    Animated.timing(loadingWidth, {
      toValue: 1,
      duration: 2500,
      delay: 2000,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Decorative element
    Animated.timing(decorOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 1800,
      useNativeDriver: true,
    }).start();

    // Floating particles animation (loop)
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleFloat, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(particleFloat, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animations for icon rings (loop)
    // Pulse animations for icon rings (loop)
    Animated.loop(
      Animated.timing(pulse1, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(pulse2, {
        toValue: 1,
        duration: 2000,
        delay: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Minimum 5 second timer - always wait this long
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 5000);

    return () => clearTimeout(minTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Additional effect to handle auth loading completion after minimum time
  useEffect(() => {
    if (!isAuthLoading && minTimeElapsed) {
      // Both conditions met: auth done AND 5 seconds passed
      onFinish();
    }
  }, [isAuthLoading, minTimeElapsed, onFinish]);

  const iconRotation = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particleTranslateY = particleFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const particleOpacity = particleFloat.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.3],
  });

  const pulse1Scale = pulse1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulse1Opacity = pulse1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.1],
  });

  const pulse2Scale = pulse2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulse2Opacity = pulse2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.2],
  });

  const loadingWidthInterpolated = loadingWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Beautiful warm background */}
      <LinearGradient
        colors={['#FFF7ED', '#FFEDD5', '#FED7AA']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative floating particles */}
      <Animated.View
        style={[
          styles.particlesContainer,
          {
            transform: [{ translateY: particleTranslateY }],
            opacity: particleOpacity,
          },
        ]}
      >
        {[...Array(15)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${(i * 6.67) % 100}%`,
                top: `${(i * 13.33) % 100}%`,
                width: 8 + (i % 4) * 4,
                height: 8 + (i % 4) * 4,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Main content container */}
      <View style={styles.contentContainer}>
        {/* Welcoming Icon - Animated entrance */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { scale: iconScale },
                { rotate: iconRotation },
              ],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Image 
              source={{ uri: 'https://res.cloudinary.com/dawppjhpb/image/upload/v1765191381/Untitled_design_2_ng58oi.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Decorative rings around icon */}
          <Animated.View
            style={[
              styles.iconRing,
              styles.iconRingOuter,
              {
                transform: [{ scale: pulse1Scale }],
                opacity: pulse1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.iconRing,
              styles.iconRingMiddle,
              {
                transform: [{ scale: pulse2Scale }],
                opacity: pulse2Opacity,
              },
            ]}
          />
        </Animated.View>

        {/* App Name - SVARAM with Samarkan Font */}
        <Animated.View
          style={[
            styles.nameContainer,
            {
              opacity: nameOpacity,
              transform: [{ translateY: nameTranslateY }],
            },
          ]}
        >
          <Text style={styles.appName}>SVARAM</Text>
          <View style={styles.nameDivider} />
          <Text style={styles.tagline}>Journey Through Sacred Wisdom</Text>
        </Animated.View>

        {/* Welcoming Shloka - Mentions all services */}
        <Animated.View
          style={[
            styles.shlokaContainer,
            {
              opacity: shlokaOpacity,
              transform: [{ translateY: shlokaTranslateY }],
            },
          ]}
        >
          <Text style={styles.shlokaDevanagari}>
            ज्ञानं योगश्च संगश्च चुनौती कर्मणि च।
          </Text>
          <Text style={styles.shlokaDevanagari}>
            स्वरमाप्पे समाहिता सर्वे भवन्तु सुखिनः॥
          </Text>
          
          <Text style={styles.shlokaTranslation}>
            Knowledge, Practice, Community & Challenges Combined,
          </Text>
          <Text style={styles.shlokaTranslation}>
            In SVARAM App, All Find Joy & Peace of Mind
          </Text>
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            { opacity: loadingOpacity },
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                { width: loadingWidthInterpolated },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>
            {isAuthLoading ? 'Checking Authentication...' : 'Loading Sacred Experience...'}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom decorative element */}
      <Animated.View
        style={[
          styles.bottomDecor,
          { opacity: decorOpacity },
        ]}
      >
        <View style={styles.decorLine} />
        <Text style={styles.decorText}>✦</Text>
        <View style={styles.decorLine} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FB923C',
    borderRadius: 100,
    opacity: 0.15,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
    overflow: 'hidden',
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  iconRing: {
    position: 'absolute',
    borderRadius: 200,
    borderWidth: 2,
    borderColor: '#FB923C',
  },
  iconRingOuter: {
    width: 180,
    height: 180,
    opacity: 0.3,
  },
  iconRingMiddle: {
    width: 160,
    height: 160,
    opacity: 0.5,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  appName: {
    fontSize: 72,
    fontFamily: 'Samarkan',
    color: '#C2410C',
    letterSpacing: 8,
    textShadowColor: '#FB923C',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  nameDivider: {
    width: 100,
    height: 3,
    backgroundColor: '#F97316',
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: '#EA580C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  shlokaContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  shlokaDevanagari: {
    fontSize: 16,
    fontFamily: 'NotoSansDevanagari-SemiBold',
    color: '#7C2D12',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 4,
  },
  shlokaTranslation: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: '#9A3412',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#FED7AA',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: 'Outfit-Medium',
    color: '#C2410C',
    letterSpacing: 1,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorLine: {
    width: 60,
    height: 1,
    backgroundColor: '#FB923C',
    opacity: 0.5,
  },
  decorText: {
    fontSize: 20,
    color: '#F97316',
    marginHorizontal: 15,
  },
});
