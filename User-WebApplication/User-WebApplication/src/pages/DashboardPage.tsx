

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import dashboardService, {
  getGreeting,
  getFormattedDate,
  getDailyQuote,
  fetchPanchangData,
  type PanchangData,
  type Enrollment,
  type Course,
} from '../services/dashboardService';
import ShlokaAnalysisModal from '../components/ShlokaAnalysisModal';

// ============ TYPEWRITER EFFECT ============
const TypewriterText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span className={className}>{displayedText}<span className="animate-pulse">|</span></span>;
};

// ============ ENHANCED ICON COMPONENTS ============
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MusicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c1.242 3.5 3 5.5 5 8 0-3.5 1-5.5 3-7-5 8-1 13-1 16 0 2.21-1.79 4-4 4s-4-1.79-4-4c0-3 4-8-1-16z"/>
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const GameIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

// ============ DATA WITH MORE CONTENT ============
const moodFilters = [
  { id: 'peace', label: 'Peace', emoji: '🧘', color: 'bg-[#C1E1C1]' }, // Soft sage green
  { id: 'energy', label: 'Energy', emoji: '⚡', color: 'bg-[#FFD59E]' }, // Golden yellow
  { id: 'devotion', label: 'Devotion', emoji: '🙏', color: 'bg-[#E6B8AF]' }, // Terracotta pink
  { id: 'wisdom', label: 'Wisdom', emoji: '📚', color: 'bg-[#B4D7D8]' }, // Peaceful teal
];

const dailyRecommendations = [
  { title: 'Morning Prayer', time: '5-7 AM', icon: '🌅' },
  { title: 'Evening Mantra', time: '6-8 PM', icon: '🌆' },
  { title: 'Meditation', time: 'Anytime', icon: '🧘‍♂️' },
];

const liveEvents = [
  { title: 'Sanskrit Workshop', time: 'Today 6:00 PM', participants: 234 },
  { title: 'Vedic Chanting', time: 'Tomorrow 7:00 AM', participants: 156 },
  { title: 'Guru Session', time: 'Wed 5:00 PM', participants: 89 },
];

const featuredTools = [
  { id: 'chandas', name: 'Chandas Analyzer', desc: 'AI meter detection', icon: <ChartIcon />, color: 'bg-[#FADADD]' }, // Soft rose
  { id: 'karaoke', name: 'Divine Karaoke', desc: 'Sing with rhythm', icon: <MusicIcon />, color: 'bg-[#E6E6FA]' }, // Lavender
  { id: 'voice', name: 'Voice Coach', desc: 'Perfect pronunciation', icon: '🎤', color: 'bg-[#B0E0E6]' }, // Powder blue
  { id: 'games', name: 'Sanskrit Games', desc: 'Learn by playing', icon: <GameIcon />, color: 'bg-[#DDA15E]' }, // Earthy orange
];

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('peace');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisText, setAnalysisText] = useState('');

  const dailyQuote = getDailyQuote();
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  const stats = {
    shlokasCompleted: user?.gamification?.xp ? Math.floor(user.gamification.xp / 10) : 47,
    accuracy: 87,
    streakDays: user?.gamification?.streak || 12,
    totalTime: 145,
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const panchang = await fetchPanchangData();
      setPanchangData(panchang);

      try {
        const enrollmentResponse = await dashboardService.getEnrolledCourses();
        const enrollments = enrollmentResponse.data?.enrollments || [];
        setEnrolledCourses(enrollments.filter((e: Enrollment) => e.courseId || e.course));
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
      }

      try {
        const coursesResponse = await dashboardService.getCourses();
        const coursesData = (coursesResponse.data?.courses || (coursesResponse as unknown as { courses: Course[] }).courses || []) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const calculateProgress = (enrollment: Enrollment) => {
    if (!enrollment.progress?.sectionsProgress) return 0;
    const completed = enrollment.progress.sectionsProgress.reduce(
      (total, section) => total + (section.completedLectures?.length || 0),
      0
    );
    const total = enrollment.progress.sectionsProgress.reduce(
      (total, section) => total + (section.totalLectures || 0),
      0
    );
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex">
      <div className="flex w-full">
        {/* Sidebar - Fixed, Non-Scrolling */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-72 h-screen bg-[#FFFEF7] border-r border-[#D4C5A9] shadow-lg"
            >
              <div className="flex flex-col h-full overflow-hidden">
                {/* Logo */}
                <div className="flex items-center gap-3 p-6 border-b border-[#D4C5A9]">
                  <div className="w-12 h-12 rounded-lg bg-[#4A2E1C] flex items-center justify-center shadow-md">
                    <span className="text-white text-2xl font-bold">स</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#2C2416] font-samarkan">
                      SVARAM
                    </h2>
                    <p className="text-xs text-[#6B5D4F] font-sanskrit">स्वरम्</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                  {[
                    { icon: <BookIcon />, label: 'Shloka Library', path: '/shloka-library' },
                    { icon: <SparklesIcon />, label: 'AI Composer', path: '/ai-composer' },
                    { icon: <HeartIcon />, label: 'Heal With Shlokas', path: '/heal' },
                    { icon: <GameIcon />, label: 'Customization', path: '/customization' },
                    { icon: <LightningIcon />, label: 'Tagline Generator', path: '/tagline-generator' },
                    { icon: <StarIcon />, label: 'Achievements', path: '/achievements' },
                    { icon: <ChartIcon />, label: 'Settings', path: '/settings' },
                  ].map((item) => {
                    const isActive = item.path === location.pathname;
                    return item.path ? (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-[#4A2E1C] text-white shadow-md'
                            : 'text-[#2C2416] hover:bg-[#F3E4C8]'
                        }`}
                      >
                        <span className={isActive ? 'text-white' : 'text-[#D4A017]'}>{item.icon}</span>
                        <span className="font-semibold text-sm">{item.label}</span>
                      </Link>
                    ) : (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 5 }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[#2C2416] hover:bg-[#F3E4C8]"
                      >
                        <span className="text-[#D4A017]">{item.icon}</span>
                        <span className="font-semibold text-sm">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>

                {/* User Profile Card */}
                <div className="p-4 border-t border-[#D4C5A9]">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F3E4C8] border border-[#D4C5A9]">
                    <div className="w-10 h-10 rounded-full bg-[#4A2E1C] flex items-center justify-center text-white font-bold text-sm">
                      {(user?.profile?.firstName || user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#2C2416] text-sm">{user?.profile?.firstName || user?.username || 'User'}</p>
                      <p className="text-xs text-[#D4A017] font-semibold">Level {user?.gamification?.level || 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navigation Bar - Sticky */}
          <header className="flex-shrink-0 bg-[#FFFEF7] border-b border-[#D4C5A9] shadow-sm z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 rounded-lg bg-[#4A2E1C] text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  {/* Search Bar */}
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D4C5A9] w-96">
                    <svg className="w-5 h-5 text-[#D4A017]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search shlokas, courses, mantras..."
                      className="bg-transparent outline-none flex-1 text-[#2C2416] placeholder:text-[#6B5D4F] text-sm"
                    />
                  </div>
                </div>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  {[
                    { icon: <HomeIcon />, label: 'Home', active: true, path: '/dashboard' },
                    { icon: <BookIcon />, label: 'Learn', path: '/learn' },
                    { icon: <VideoIcon />, label: 'Videos', path: '/videos' },
                    { icon: <MusicIcon />, label: 'Practice', path: '/practice' },
                    { icon: <UsersIcon />, label: 'Community', path: '/community' },
                  ].map((item) => (
                    item.path ? (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                          item.active
                            ? 'bg-[#4A2E1C] text-white shadow-sm'
                            : 'text-[#2C2416] hover:bg-[#F3E4C8] hover:text-[#D4A017]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm text-[#2C2416] hover:bg-[#F3E4C8] hover:text-[#D4A017]"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    )
                  ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg bg-white border border-[#D4C5A9] text-[#D4A017] relative hover:bg-[#F3E4C8] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#DD7A1F] rounded-full" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-white border border-[#D4C5A9] text-[#D4A017] hover:bg-[#F3E4C8] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area - Scrollable */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Hero Section with Greeting & Daily Quote */}
            <div className="rounded-2xl bg-[#F3E4C8] border border-[#D4C5A9] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-[#2C2416]">
                    <TypewriterText text={`${greeting}, ${user?.profile?.firstName || user?.username || 'Learner'}!`} />
                  </h1>
                  <p className="text-[#6B5D4F] mb-4 text-base">{formattedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D4C5A9]">
                    <FireIcon />
                    <span className="font-semibold text-[#DD7A1F]">{stats.streakDays}d</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D4C5A9]">
                    <StarIcon />
                    <span className="font-semibold text-[#D4A017]">L{user?.gamification?.level || 1}</span>
                  </div>
                </div>
              </div>
              
              {/* Daily Quote Inline */}
              <div className="bg-white/60 rounded-lg p-4 border border-[#D4C5A9]">
                <p className="text-xs uppercase tracking-wider text-[#D4A017] mb-2 font-bold">✨ {dailyQuote.source}</p>
                <p className="font-sanskrit text-base mb-2 leading-relaxed text-[#2C2416]">{dailyQuote.sanskrit}</p>
                <p className="text-sm italic text-[#6B5D4F]">"{dailyQuote.translation}"</p>
              </div>
            </div>

            {/* 2. Quick Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Shlokas', value: stats.shlokasCompleted, icon: <BookIcon />, change: '+12', color: 'bg-[#FFE5B4]' },
                { label: 'Accuracy', value: `${stats.accuracy}%`, icon: <TrendingIcon />, change: '+5%', color: 'bg-[#E6D5B8]' },
                { label: 'Streak', value: `${stats.streakDays}d`, icon: <FireIcon />, change: 'Best!', color: 'bg-[#F4E4C1]' },
                { label: 'Time', value: `${stats.totalTime}m`, icon: '⏱️', change: '+23m', color: 'bg-[#FAF0DC]' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl ${stat.color} border border-[#D4C5A9] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase text-[#6B5D4F]">{stat.label}</p>
                    <span className="text-[#B87333]">{typeof stat.icon === 'string' ? stat.icon : stat.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#2C2416] mb-1">{stat.value}</p>
                  <p className="text-xs text-[#D4A017] font-semibold">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* 3. Heal with Shlokas - Mood Filters (Key USP) */}
            <div>
              <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                <HeartIcon />
                <span>Heal with Shlokas</span>
                <span className="text-xs bg-[#DD7A1F] text-white px-2 py-1 rounded-full font-semibold">Featured</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moodFilters.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-6 rounded-xl ${mood.color} border-2 transition-all hover:scale-105 ${
                      selectedMood === mood.id ? 'border-[#4A2E1C] shadow-lg scale-105' : 'border-[#D4C5A9] hover:border-[#D4A017]/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{mood.emoji}</div>
                    <p className="font-bold text-[#2C2416]">{mood.label}</p>
                    <p className="text-xs text-[#6B5D4F] mt-1">Therapeutic mantras</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Today's Featured Shloka */}
            <div className="bg-gradient-to-br from-[#F3E4C8] to-[#E6D5B8] rounded-2xl p-8 border border-[#D4C5A9] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#2C2416] flex items-center gap-2">
                  <span className="text-2xl">📿</span>
                  <span>Today's Shloka</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Easy</span>
                  <span className="px-3 py-1 bg-[#B87333] text-white rounded-full text-xs font-semibold">Anushtubh</span>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-xl p-6 mb-4">
                <p className="text-sm text-[#6B5D4F] mb-2 font-semibold">Bhagavad Gita 2.47</p>
                <p className="font-sanskrit text-2xl mb-4 leading-relaxed text-[#2C2416]">
                  कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br />
                  मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                </p>
                <p className="text-base text-[#6B5D4F] italic leading-relaxed">
                  "You have a right to perform your duty, but not to the fruits of your actions. Never consider yourself to be the cause of the results, and never be attached to inaction."
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 px-6 py-3 bg-[#DD7A1F] text-white rounded-xl font-semibold hover:bg-[#B87333] transition-colors flex items-center justify-center gap-2">
                  <span>▶</span>
                  <span>Listen & Learn</span>
                </button>
                <button 
                  onClick={() => {
                    setAnalysisText('कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥');
                    setShowAnalysisModal(true);
                  }}
                  className="flex-1 px-6 py-3 bg-white text-[#4A2E1C] border-2 border-[#4A2E1C] rounded-xl font-semibold hover:bg-[#4A2E1C] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <SparklesIcon />
                  <span>Analyze Meter</span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* 5. AI-Powered Quick Actions */}
                <div>
                  <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                    <SparklesIcon />
                    <span>AI-Powered Tools</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {featuredTools.map((tool) => (
                      <button
                        key={tool.id}
                        className={`p-6 rounded-xl ${tool.color} border border-[#D4C5A9] hover:border-[#D4A017] hover:scale-105 transition-all shadow-sm hover:shadow-md text-left relative`}
                      >
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-[#DD7A1F] text-white text-xs rounded-full font-bold">AI</span>
                        </div>
                        <div className="text-3xl mb-4 text-[#B87333]">{typeof tool.icon === 'string' ? tool.icon : tool.icon}</div>
                        <p className="font-bold mb-1 text-[#2C2416]">{tool.name}</p>
                        <p className="text-xs text-[#6B5D4F]">{tool.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Trending Shlokas */}
                <div>
                  <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                    <TrendingIcon />
                    <span>Trending Shlokas</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Gayatri Mantra', source: 'Rigveda', plays: '12.4k', difficulty: 'Medium', emoji: '🌅' },
                      { title: 'Mahamrityunjaya', source: 'Yajurveda', plays: '8.9k', difficulty: 'Hard', emoji: '🕉️' },
                      { title: 'Shanti Mantra', source: 'Upanishads', plays: '6.2k', difficulty: 'Easy', emoji: '☮️' },
                      { title: 'Vakratunda', source: 'Ganapati', plays: '5.1k', difficulty: 'Easy', emoji: '🙏' },
                    ].map((shloka, idx) => (
                      <div
                        key={shloka.title}
                        className="bg-white rounded-xl p-4 shadow-sm border border-[#D4C5A9] hover:shadow-md hover:border-[#D4A017] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#F3E4C8] flex items-center justify-center text-2xl">
                            {shloka.emoji}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#2C2416]">{shloka.title}</h3>
                            <p className="text-xs text-[#6B5D4F]">{shloka.source}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#D4A017]">{shloka.plays}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              shloka.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                              shloka.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                              {shloka.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. Continue Learning */}
                {enrolledCourses.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                      <LightningIcon />
                      <span>Continue Learning</span>
                    </h2>
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 3).map((enrollment) => {
                        const course = enrollment.courseId || enrollment.course;
                        if (!course) return null;
                        const progress = calculateProgress(enrollment);

                        return (
                          <div
                            key={enrollment._id}
                            className="bg-white rounded-xl p-5 shadow-sm border border-[#D4C5A9] hover:shadow-md hover:border-[#D4A017] transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#B87333] flex items-center justify-center text-3xl">
                                📖
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-[#2C2416] text-base">{course.basic?.title || course.title || 'Untitled Course'}</h3>
                                <div className="mt-2 flex items-center gap-3">
                                  <div className="flex-1 h-2 bg-[#F3E4C8] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-[#D4A017] to-[#DD7A1F] rounded-full transition-all duration-500"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-[#D4A017]">{progress}%</span>
                                </div>
                              </div>
                              <button className="px-5 py-2 bg-[#DD7A1F] text-white rounded-lg font-semibold hover:bg-[#B87333] transition-colors text-sm whitespace-nowrap">
                                Continue →
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. Live Events & Sessions */}
                <div>
                  <h2 className="text-xl font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                    <CalendarIcon />
                    <span>Live Events & Sessions</span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-bold animate-pulse">
                      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      LIVE
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {liveEvents.map((event, idx) => (
                      <div
                        key={event.title}
                        className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#DD7A1F] hover:shadow-md hover:border-[#B87333] transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DD7A1F] to-[#B87333] flex items-center justify-center text-white font-bold text-lg">
                              {idx === 0 ? '🔴' : '📅'}
                            </div>
                            <div>
                              <p className="font-bold text-[#2C2416]">{event.title}</p>
                              <p className="text-sm text-[#6B5D4F] flex items-center gap-2 mt-1">
                                <span>⏰ {event.time}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <UsersIcon />
                                  {event.participants} joined
                                </span>
                              </p>
                            </div>
                          </div>
                          <button className="px-6 py-3 bg-[#DD7A1F] text-white rounded-lg font-semibold hover:bg-[#B87333] transition-colors text-sm whitespace-nowrap">
                            {idx === 0 ? 'Join Now ▶' : 'Register'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="space-y-6">
                {/* Hindu Panchang */}
                {panchangData && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D4C5A9]">
                    <h3 className="text-lg font-bold text-[#2C2416] mb-4 flex items-center gap-2">
                      <CalendarIcon />
                      Hindu Panchang
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Tithi', value: panchangData.tithi, icon: '🌙' },
                        { label: 'Nakshatra', value: panchangData.nakshatra, icon: '⭐' },
                        { label: 'Sunrise', value: panchangData.sunrise, icon: '🌅' },
                        { label: 'Sunset', value: panchangData.sunset, icon: '🌇' },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center p-3 rounded-lg bg-[#F3E4C8]">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-[#6B5D4F] font-semibold text-sm">{item.label}</span>
                          </div>
                          <span className="font-bold text-[#D4A017] text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI-Curated Daily Recommendations */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D4C5A9]">
                  <h3 className="text-lg font-bold mb-4 text-[#2C2416] flex items-center gap-2">
                    <SparklesIcon />
                    <span>Daily Recommendations</span>
                  </h3>
                  <div className="space-y-3">
                    {dailyRecommendations.map((rec, idx) => (
                      <div
                        key={rec.title}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#F3E4C8] to-[#FAF0DC] hover:from-[#E6D5B8] hover:to-[#F3E4C8] transition-all cursor-pointer border border-[#D4C5A9]"
                      >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                          {rec.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#2C2416] text-sm">{rec.title}</p>
                          <p className="text-xs text-[#6B5D4F] flex items-center gap-1 mt-1">
                            <span>⏰</span>
                            <span>{rec.time}</span>
                          </p>
                        </div>
                        <button className="px-3 py-1 bg-[#DD7A1F] text-white rounded-lg text-xs font-semibold hover:bg-[#B87333] transition-colors">
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explore Categories */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D4C5A9]">
                  <h3 className="text-lg font-bold mb-4 text-[#2C2416]">🎯 Explore Categories</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Vedic Mantras', count: 245, icon: '📿' },
                      { name: 'Bhagavad Gita', count: 701, icon: '📖' },
                      { name: 'Upanishads', count: 108, icon: '🕉️' },
                      { name: 'Stotrams', count: 156, icon: '🙏' },
                    ].map((cat) => (
                      <button
                        key={cat.name}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F3E4C8] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-semibold text-[#2C2416]">{cat.name}</span>
                        </div>
                        <span className="text-sm text-[#6B5D4F] font-semibold">{cat.count}</span>
          </main>
        </div>
      </div>

      {/* Shloka Analysis Modal */}
      <ShlokaAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        initialText={analysisText}
      />
    </div>
  );
};

export default DashboardPage;
      </div>
    </div>
  );
};

export default DashboardPage;
