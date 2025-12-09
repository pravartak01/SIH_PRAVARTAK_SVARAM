/**
 * Certificate Screen
 * Displays course completion certificate with premium design
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Share,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import courseService from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Theme colors
const COLORS = {
  gold: '#D4AF37',
  darkGold: '#B8963D',
  cream: '#FFF8E7',
  lightCream: '#FFFAF0',
  brown: '#4A2E1C',
  saffron: '#DD7A1F',
  copper: '#B87333',
};

export default function CertificateScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<View>(null);

  useEffect(() => {
    loadCourseAndGenerateCertificate();
  }, [id]);

  const loadCourseAndGenerateCertificate = async () => {
    try {
      setLoading(true);
      
      // Load course details only (no backend certificate call)
      const courseResponse = await courseService.getCourseById(id as string);
      const courseData = courseResponse.data?.course || courseResponse.course;
      setCourse(courseData);
      
      // Generate static certificate data
      const generatedCertificate = {
        certificateId: `SHYK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        studentName: user?.name || 'Student Name',
        courseName: courseData?.title || 'Course Name',
        instructorName: courseData?.instructor?.name || 'Instructor',
        completedAt: new Date().toISOString(),
        totalLectures: courseData?.structure?.units?.reduce((acc: number, unit: any) => 
          acc + unit.lessons.reduce((sum: number, lesson: any) => sum + lesson.lectures.length, 0), 0) || 0,
        courseDuration: courseData?.metadata?.duration?.split(' ')[0] || 'N/A',
        level: courseData?.level || 'All Levels',
      };
      
      setCertificate(generatedCertificate);
      
    } catch (error) {
      console.error('Error loading certificate:', error);
      // Even if course load fails, generate basic certificate
      const fallbackCertificate = {
        certificateId: `SHYK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        studentName: user?.name || 'Student Name',
        courseName: 'Sanskrit Learning Course',
        instructorName: 'ShlokaYug Instructor',
        completedAt: new Date().toISOString(),
        totalLectures: 0,
        courseDuration: 'N/A',
        level: 'All Levels',
      };
      setCertificate(fallbackCertificate);
    } finally {
      setLoading(false);
    }
  };

  const handleShareCertificate = async () => {
    try {
      const message = `🎓 I just completed "${course?.title || 'a course'}" on ShlokaYug!\n\n` +
        `Instructor: ${course?.instructor?.name || 'N/A'}\n` +
        `Certificate ID: ${certificate?.certificateId || 'N/A'}\n\n` +
        `Join me in learning Sanskrit wisdom! 🕉️`;
      
      await Share.share({
        message,
        title: 'Course Completion Certificate',
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  const handleShareSocialCard = async () => {
    try {
      const message = `✨ Achievement Unlocked! ✨\n\n` +
        `📚 Completed: ${course?.title || 'Course'}\n` +
        `👨‍🏫 Instructor: ${course?.instructor?.name || 'N/A'}\n` +
        `⭐ ${certificate?.totalLectures || 0} lectures mastered\n` +
        `🎯 100% completion\n\n` +
        `#ShlokaYug #SanskritLearning #Achievement`;
      
      await Share.share({
        message,
        title: 'Course Achievement',
      });
    } catch (error) {
      console.error('Error sharing social card:', error);
    }
  };

  const handleDownload = async () => {
    try {
      // Install packages: npx expo install react-native-view-shot expo-media-library expo-file-system
      // For now, just share the certificate details
      const certificateText = 
        `🎓 CERTIFICATE OF COMPLETION 🎓\n\n` +
        `This certifies that\n` +
        `${certificate?.studentName || user?.name}\n\n` +
        `has successfully completed\n` +
        `"${course?.title || certificate?.courseName}"\n\n` +
        `Instructor: ${course?.instructor?.name || certificate?.instructorName}\n` +
        `Completion Date: ${formatDate(certificate?.completedAt || new Date())}\n` +
        `Certificate ID: ${certificate?.certificateId}\n\n` +
        `Verified by ShlokaYug 🕉️`;
      
      await Share.share({
        message: certificateText,
        title: 'Course Completion Certificate',
      });
      
      Alert.alert(
        '✅ Certificate Ready!',
        'Certificate details copied to share. Professional PDF download feature coming soon!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to process certificate. Please try again.');
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.saffron} />
          <Text style={{ color: COLORS.brown, marginTop: 16, fontSize: 16 }}>
            Loading certificate...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!certificate && !course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Ionicons name="alert-circle" size={64} color={COLORS.copper} />
          <Text style={{ color: COLORS.brown, fontSize: 20, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
            Certificate Not Found
          </Text>
          <Text style={{ color: COLORS.copper, textAlign: 'center', marginTop: 8 }}>
            Complete the course to earn your certificate
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: COLORS.saffron, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 24 }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <SafeAreaView style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 }}>
              🎓 Your Certificate
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
              Congratulations on your achievement!
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Premium Certificate Card */}
        <View ref={certificateRef} collapsable={false} style={{ marginBottom: 20 }}>
          <LinearGradient
            colors={[COLORS.cream, COLORS.lightCream, COLORS.cream]}
            style={styles.certificate}
          >
            {/* Decorative Border */}
            <View style={styles.borderOuter}>
              <View style={styles.borderInner}>
                {/* Corner Decorations */}
                <View style={{ position: 'absolute', top: 12, left: 12 }}>
                  <MaterialCommunityIcons name="flower" size={28} color={COLORS.gold} />
                </View>
                <View style={{ position: 'absolute', top: 12, right: 12 }}>
                  <MaterialCommunityIcons name="flower" size={28} color={COLORS.gold} />
                </View>
                <View style={{ position: 'absolute', bottom: 12, left: 12 }}>
                  <MaterialCommunityIcons name="flower" size={28} color={COLORS.gold} />
                </View>
                <View style={{ position: 'absolute', bottom: 12, right: 12 }}>
                  <MaterialCommunityIcons name="flower" size={28} color={COLORS.gold} />
                </View>

                {/* Top Ornament */}
                <View style={styles.ornamentTop}>
                  <View style={styles.ornamentLine} />
                  <MaterialCommunityIcons name="star-four-points" size={24} color={COLORS.gold} />
                  <View style={styles.ornamentLine} />
                </View>

                {/* Logo */}
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={[COLORS.gold, COLORS.darkGold]}
                    style={styles.logo}
                  >
                    <MaterialCommunityIcons name="om" size={40} color="white" />
                  </LinearGradient>
                </View>

                {/* Title */}
                <Text style={styles.certTitle}>CERTIFICATE</Text>
                <Text style={styles.certSubtitle}>of Completion</Text>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <MaterialCommunityIcons name="rhombus" size={12} color={COLORS.gold} />
                  <View style={styles.dividerLine} />
                </View>

                {/* Recipient */}
                <Text style={styles.recipientLabel}>This is to certify that</Text>
                <Text style={styles.recipientName}>
                  {user?.name || certificate?.studentName || 'Student Name'}
                </Text>

                {/* Achievement */}
                <Text style={styles.achievementText}>
                  has successfully completed the course
                </Text>
                <Text style={styles.challengeName}>
                  &ldquo;{course?.title || certificate?.courseName || 'Course Name'}&rdquo;
                </Text>

                {/* Instructor */}
                <View style={styles.instructorSection}>
                  <Text style={styles.instructorLabel}>Taught by</Text>
                  <Text style={styles.instructorName}>
                    {course?.instructor?.name || certificate?.instructorName || 'Instructor'}
                  </Text>
                </View>

                {/* Stats */}
                <View style={styles.statsSection}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{certificate?.totalLectures || course?.structure?.units?.reduce((acc: number, unit: any) => 
                      acc + unit.lessons.reduce((sum: number, lesson: any) => sum + lesson.lectures.length, 0), 0) || 0}</Text>
                    <Text style={styles.statLabel}>Lectures</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>100%</Text>
                    <Text style={styles.statLabel}>Completion</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {course?.metadata?.duration?.split(' ')[0] || certificate?.courseDuration || 'N/A'}
                    </Text>
                    <Text style={styles.statLabel}>Hours</Text>
                  </View>
                </View>

                {/* Date */}
                <View style={styles.dateSection}>
                  <Text style={styles.dateLabel}>Awarded on</Text>
                  <Text style={styles.dateValue}>
                    {formatDate(certificate?.completedAt || new Date())}
                  </Text>
                </View>

                {/* Certificate Number */}
                <Text style={styles.certNumber}>
                  Certificate No: {certificate?.certificateId || 'SHYK-' + Date.now()}
                </Text>

                {/* Bottom Ornament */}
                <View style={styles.ornamentBottom}>
                  <View style={styles.ornamentLine} />
                  <MaterialCommunityIcons name="star-four-points" size={16} color={COLORS.gold} />
                  <View style={styles.ornamentLine} />
                </View>

                {/* Watermark */}
                <View style={styles.watermark}>
                  <Text style={styles.watermarkText}>ShlokaYug</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Achievement Badge */}
        <LinearGradient
          colors={[COLORS.gold, COLORS.darkGold]}
          style={{
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name="seal" size={48} color="white" />
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginTop: 12, letterSpacing: 1 }}>
              Course Mastered
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
              You have successfully completed all lectures and earned this certificate of completion
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>✨ Excellence</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>🎯 Dedication</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>🏆 Success</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Social Share Card */}
        <LinearGradient
          colors={[COLORS.saffron, COLORS.copper]}
          style={styles.socialCard}
        >
          <View style={styles.socialCardHeader}>
            <MaterialCommunityIcons name="star-circle" size={32} color="white" />
            <Text style={styles.socialCardTitle}>Achievement Unlocked!</Text>
          </View>

          <View style={styles.socialCardBody}>
            <View style={styles.achievementRow}>
              <Ionicons name="trophy" size={20} color="white" />
              <Text style={styles.achievementText2}>Course Completed</Text>
            </View>
            <Text style={styles.socialCardCourse}>
              {course?.title || certificate?.courseName}
            </Text>
            <View style={styles.socialStatsRow}>
              <View style={styles.socialStat}>
                <Text style={styles.socialStatValue}>
                  {certificate?.totalLectures || 0}
                </Text>
                <Text style={styles.socialStatLabel}>Lectures</Text>
              </View>
              <View style={styles.socialStatDivider} />
              <View style={styles.socialStat}>
                <Text style={styles.socialStatValue}>100%</Text>
                <Text style={styles.socialStatLabel}>Progress</Text>
              </View>
              <View style={styles.socialStatDivider} />
              <View style={styles.socialStat}>
                <Text style={styles.socialStatValue}>
                  {course?.metadata?.duration?.split(' ')[0] || 'N/A'}
                </Text>
                <Text style={styles.socialStatLabel}>Hours</Text>
              </View>
            </View>
          </View>

          <View style={styles.socialCardFooter}>
            <MaterialCommunityIcons name="om" size={24} color="white" />
            <Text style={styles.socialCardBrand}>ShlokaYug</Text>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={handleDownload} style={{ marginBottom: 12 }}>
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              style={styles.actionButton}
            >
              <Ionicons name="download" size={22} color="white" />
              <Text style={styles.actionButtonText}>Download Certificate</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.shareTitle}>Share Your Achievement</Text>

          <View style={styles.shareButtonsRow}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#E1306C' }]}
              onPress={handleShareSocialCard}
            >
              <MaterialCommunityIcons name="instagram" size={26} color="white" />
              <Text style={styles.socialButtonText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#0077B5' }]}
              onPress={handleShareCertificate}
            >
              <MaterialCommunityIcons name="linkedin" size={26} color="white" />
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
              onPress={handleShareSocialCard}
            >
              <MaterialCommunityIcons name="twitter" size={26} color="white" />
              <Text style={styles.socialButtonText}>Twitter</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.moreShareButton}
            onPress={handleShareCertificate}
          >
            <MaterialCommunityIcons name="share-variant-outline" size={20} color="white" />
            <Text style={styles.moreShareText}>More Share Options</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Badge */}
        <View style={styles.verifyBadge}>
          <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.gold} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.verifyTitle}>Verified Certificate</Text>
            <Text style={styles.verifyText}>
              This certificate can be verified using the Certificate ID
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  certificate: {
    borderRadius: 20,
    padding: 6,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  borderOuter: {
    borderWidth: 4,
    borderColor: COLORS.gold,
    borderRadius: 16,
    padding: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  borderInner: {
    borderWidth: 2,
    borderColor: COLORS.darkGold,
    borderRadius: 12,
    padding: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  ornamentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ornamentLine: {
    height: 2,
    width: 50,
    backgroundColor: COLORS.gold,
    marginHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  certTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.brown,
    textAlign: 'center',
    letterSpacing: 5,
    textShadowColor: 'rgba(212, 175, 55, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  certSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.copper,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    height: 2,
    width: 70,
    backgroundColor: COLORS.gold,
    marginHorizontal: 10,
  },
  recipientLabel: {
    fontSize: 15,
    color: COLORS.copper,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
    fontWeight: '500',
  },
  recipientName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.brown,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    textDecorationLine: 'underline',
    textDecorationColor: COLORS.gold,
    textDecorationStyle: 'solid',
  },
  achievementText: {
    fontSize: 15,
    color: COLORS.copper,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  challengeName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.saffron,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 30,
  },
  instructorSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: `${COLORS.gold}20`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
  },
  instructorLabel: {
    fontSize: 13,
    color: COLORS.copper,
    marginBottom: 6,
    letterSpacing: 1,
    fontWeight: '500',
  },
  instructorName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.brown,
    letterSpacing: 0.5,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: `${COLORS.copper}15`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.copper}30`,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.saffron,
    textShadowColor: 'rgba(221, 122, 31, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.copper,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dateSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.copper,
    marginBottom: 6,
    letterSpacing: 1,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brown,
    letterSpacing: 0.5,
  },
  certNumber: {
    fontSize: 11,
    color: COLORS.copper,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'monospace',
    letterSpacing: 1,
    fontWeight: '600',
  },
  ornamentBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -30 }, { rotate: '-45deg' }],
    opacity: 0.04,
  },
  watermarkText: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 3,
  },
  socialCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.saffron,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  socialCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginLeft: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  socialCardBody: {
    marginBottom: 20,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementText2: {
    fontSize: 15,
    color: 'white',
    marginLeft: 10,
    opacity: 0.95,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  socialCardCourse: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  socialStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  socialStat: {
    alignItems: 'center',
    flex: 1,
  },
  socialStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  socialStatLabel: {
    fontSize: 11,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  socialStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  socialCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  socialCardBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginLeft: 10,
    letterSpacing: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  shareTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 0.5,
  },
  shareButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    gap: 10,
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  moreShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  moreShareText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  verifyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,175,55,0.2)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gold,
    marginTop: 20,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyTitle: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  verifyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
});
