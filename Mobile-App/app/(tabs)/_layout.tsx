import { Tabs, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Animated, Platform, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useEffect, useRef, useMemo, useState } from 'react';
import { useKidsMode } from '../../context/KidsModeContext';
import { useTranslation } from 'react-i18next';
import KidsHomeScreen from '../../components/kids/KidsHomeScreen';
import { SideDrawer } from '../../components/common';

// Theme colors - Vintage Brown with Gold/Saffron/Copper highlights
const COPPER = '#B87333';           // Copper for warmth (tab icons)
const SAND = '#F3E4C8';             // Sand/Beige for backgrounds

// Dark theme colors for Practice tab
const DARK_BG = '#0A0A0A';          // Deep black background matching Practice
const DARK_ACCENT = '#8D6E63';      // Brown accent for Practice
const DARK_INACTIVE = 'rgba(255,255,255,0.5)';  // Inactive icon color in dark mode

// Icon mapping - solid and outline variants
const iconMap: Record<string, { solid: keyof typeof Ionicons.glyphMap; outline: keyof typeof Ionicons.glyphMap }> = {
  home: { solid: 'home', outline: 'home-outline' },
  book: { solid: 'book', outline: 'book-outline' },
  'play-circle': { solid: 'play-circle', outline: 'play-circle-outline' },
  mic: { solid: 'mic', outline: 'mic-outline' },
  people: { solid: 'people', outline: 'people-outline' },
};

// Modern Professional Tab Icon with enhanced animations
const TabIcon = ({ name, color, focused, isDarkMode }: { name: string; color: string; focused: boolean; isDarkMode: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.15 : 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -3 : 0,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, scaleAnim, translateY, bgOpacity]);

  // Get the correct icon name
  const icons = iconMap[name] || { solid: 'help-circle', outline: 'help-circle-outline' };
  const iconName = focused ? icons.solid : icons.outline;

  // Dynamic colors based on dark mode
  const activeColor = isDarkMode ? DARK_ACCENT : COPPER;
  const inactiveColor = isDarkMode ? DARK_INACTIVE : '#64748b';
  const pillBgColor = isDarkMode ? 'rgba(141, 110, 99, 0.2)' : SAND;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', width: 60, height: 40 }}>
      {/* Background pill for active state */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 52,
          height: 34,
          borderRadius: 17,
          backgroundColor: pillBgColor,
          opacity: bgOpacity,
        }}
      />
      
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { translateY }],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={iconName}
          size={24}
          color={focused ? activeColor : inactiveColor}
        />
      </Animated.View>
      
      {/* Active indicator dot */}
      {focused && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: activeColor,
          }}
        />
      )}
    </View>
  );
};

// Top Navigation Bar Component for Web
const TopNavBar = ({ pathname, isDarkMode }: { pathname: string; isDarkMode: boolean }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth > 768;

  if (!isLargeScreen) return null;

  const navItems = [
    { route: '/', name: 'home', label: t('tabs.home'), icon: 'home' as keyof typeof Ionicons.glyphMap },
    { route: '/learn', name: 'learn', label: t('tabs.learn'), icon: 'book' as keyof typeof Ionicons.glyphMap },
    { route: '/videos', name: 'videos', label: t('tabs.videos'), icon: 'play-circle' as keyof typeof Ionicons.glyphMap },
    { route: '/practice', name: 'practice', label: t('tabs.practice'), icon: 'mic' as keyof typeof Ionicons.glyphMap },
    { route: '/community', name: 'community', label: t('tabs.community'), icon: 'people' as keyof typeof Ionicons.glyphMap },
  ];

  const activeColor = isDarkMode ? DARK_ACCENT : COPPER;
  const inactiveColor = isDarkMode ? DARK_INACTIVE : '#64748b';
  const bgColor = isDarkMode ? DARK_BG : '#FFFFFF';

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      backgroundColor: bgColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 60,
      borderBottomWidth: 2,
      borderBottomColor: isDarkMode ? 'rgba(141, 110, 99, 0.4)' : '#F3E4C8',
      shadowColor: isDarkMode ? '#000' : '#B87333',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDarkMode ? 0.3 : 0.15,
      shadowRadius: 20,
      elevation: 12,
      zIndex: 1000,
    }}>
      {/* Logo/Brand */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isDarkMode ? 'rgba(141, 110, 99, 0.2)' : SAND,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          borderWidth: 2,
          borderColor: COPPER,
        }}>
          <img src="https://res.cloudinary.com/dawppjhpb/image/upload/v1765191381/Untitled_design_2_ng58oi.png" alt="Logo"  className='h-24 w-24'/>
        </View>
        <Text style={{ 
          fontSize: 26, 
          fontWeight: '700', 
          color: isDarkMode ? '#FFFFFF' : '#374151',
          letterSpacing: 0.5,
        }}>
          Svaram
        </Text>
      </View>

      {/* Navigation Items */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {navItems.map((item) => {
          const isActive = pathname.includes(item.name) || (pathname === '/(tabs)' && item.name === 'home');
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 20,
                backgroundColor: isActive ? (isDarkMode ? 'rgba(141, 110, 99, 0.3)' : SAND) : 'transparent',
                borderWidth: isActive ? 2 : 0,
                borderColor: isActive ? activeColor : 'transparent',
              }}
            >
              <Ionicons 
                name={isActive ? (iconMap[item.icon]?.solid || item.icon) : (iconMap[item.icon]?.outline || item.icon)} 
                size={22} 
                color={isActive ? activeColor : inactiveColor} 
              />
              <Text style={{ 
                marginLeft: 10, 
                fontSize: 16, 
                fontWeight: isActive ? '700' : '500',
                color: isActive ? activeColor : inactiveColor,
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Empty space to balance layout - no menu button */}
      <View style={{ width: 52 }} />
    </View>
  );
};

export default function TabLayout() {
  const pathname = usePathname();
  const isPracticeTab = pathname === '/practice';
  const { isKidsMode } = useKidsMode();
  const { t } = useTranslation();
  const windowWidth = Dimensions.get('window').width;
  const isLargeScreen = windowWidth > 768;
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  
  // Animated value for smooth color transition
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(bgColorAnim, {
      toValue: isPracticeTab ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [isPracticeTab, bgColorAnim]);
  
  // Interpolate background color
  const animatedBgColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', DARK_BG],
  });
  
  // Dynamic styles based on practice tab
  const dynamicTabBarStyle = useMemo(() => ({
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingTop: 12,
    elevation: 24,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: isPracticeTab ? 0.3 : 0.08,
    shadowRadius: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute' as const,
    borderTopColor: isPracticeTab ? 'rgba(141, 110, 99, 0.3)' : 'transparent',
  }), [isPracticeTab]);

  // If Kids Mode is active, show Kids Home Screen instead of tabs
  if (isKidsMode) {
    return <KidsHomeScreen />;
  }

  return (
    <>
      {/* Side Drawer */}
      <SideDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      />

      {/* Top Navigation Bar for Web */}
      {Platform.OS === 'web' && isLargeScreen && (
        <TopNavBar 
          pathname={pathname} 
          isDarkMode={isPracticeTab}
        />
      )}
      
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: animatedBgColor,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                // Add subtle glow effect for dark mode
                ...(isPracticeTab && {
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderColor: 'rgba(141, 110, 99, 0.3)',
                }),
              }}
            />
          ),
          tabBarStyle: Platform.OS === 'web' && isLargeScreen ? { display: 'none' } : dynamicTabBarStyle,
          tabBarActiveTintColor: isPracticeTab ? DARK_ACCENT : COPPER,
          tabBarInactiveTintColor: isPracticeTab ? DARK_INACTIVE : '#94a3b8',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 4,
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" color={COPPER} focused={focused} isDarkMode={isPracticeTab} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="book" color={COPPER} focused={focused} isDarkMode={isPracticeTab} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: t('tabs.videos'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="play-circle" color={COPPER} focused={focused} isDarkMode={isPracticeTab} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: t('tabs.practice'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="mic" color={COPPER} focused={focused} isDarkMode={isPracticeTab} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: t('tabs.community'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="people" color={COPPER} focused={focused} isDarkMode={isPracticeTab} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-learning"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
    </>
  );
}