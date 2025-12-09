/**
 * CurriculumList Component
 * Displays course structure with units, lessons, and lectures
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isLargeScreen = isWeb && SCREEN_WIDTH > 768;

const PRIMARY_BROWN = '#4A2E1C';
const COPPER = '#B87333';
const SAFFRON = '#DD7A1F';

interface CurriculumListProps {
  course: any;
  selectedLecture: any;
  onSelectLecture: (unitIndex: number, lessonIndex: number, lectureIndex: number) => void;
  progress: any;
}

export default function CurriculumList({
  course,
  selectedLecture,
  onSelectLecture,
  progress,
}: CurriculumListProps) {
  const [expandedUnits, setExpandedUnits] = useState<number[]>([0]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>(['0-0']);

  const toggleUnit = (index: number) => {
    setExpandedUnits((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleLesson = (unitIndex: number, lessonIndex: number) => {
    const key = `${unitIndex}-${lessonIndex}`;
    setExpandedLessons((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isLectureCompleted = (lectureId: string) => {
    return progress?.completedLectures?.includes(lectureId) || false;
  };

  const isCurrentLecture = (unitIndex: number, lessonIndex: number, lectureIndex: number) => {
    return (
      selectedLecture?.unitIndex === unitIndex &&
      selectedLecture?.lessonIndex === lessonIndex &&
      selectedLecture?.lectureIndex === lectureIndex
    );
  };

  return (
    <ScrollView 
      style={{ 
        flex: 1,
        backgroundColor: isLargeScreen ? '#f9fafb' : '#1f2937' 
      }}
      contentContainerStyle={{ 
        paddingHorizontal: isLargeScreen ? 40 : 16,
        paddingVertical: isLargeScreen ? 32 : 16,
        paddingBottom: isLargeScreen ? 120 : 80
      }}
      showsVerticalScrollIndicator={true}
    >
      <Text 
        style={{ 
          color: isLargeScreen ? PRIMARY_BROWN : 'white',
          fontSize: isLargeScreen ? 32 : 20,
          fontWeight: 'bold',
          marginBottom: isLargeScreen ? 32 : 16
        }}
      >
        Course Content
      </Text>

      {course.structure?.units?.map((unit: any, unitIndex: number) => (
          <View key={unitIndex} className="mb-4">
            {/* Unit Header */}
            <TouchableOpacity
              onPress={() => toggleUnit(unitIndex)}
              style={{
                backgroundColor: isLargeScreen ? '#ffffff' : '#374151',
                borderRadius: isLargeScreen ? 16 : 12,
                padding: isLargeScreen ? 24 : 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isLargeScreen ? 0.08 : 0,
                shadowRadius: 8,
                elevation: isLargeScreen ? 3 : 0,
                borderWidth: isLargeScreen ? 1 : 0,
                borderColor: '#e5e7eb'
              }}
              className="flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text 
                  style={{ 
                    color: isLargeScreen ? PRIMARY_BROWN : 'white',
                    fontWeight: 'bold',
                    fontSize: isLargeScreen ? 20 : 16
                  }}
                >
                  Unit {unitIndex + 1}: {unit.title || 'Untitled Unit'}
                </Text>
                <Text 
                  style={{ 
                    color: isLargeScreen ? '#6b7280' : '#9ca3af',
                    fontSize: isLargeScreen ? 16 : 14,
                    marginTop: isLargeScreen ? 8 : 4
                  }}
                >
                  {unit.lessons?.length || 0} lessons
                </Text>
              </View>
              <Ionicons
                name={expandedUnits.includes(unitIndex) ? 'chevron-up' : 'chevron-down'}
                size={isLargeScreen ? 28 : 24}
                color={isLargeScreen ? COPPER : '#9ca3af'}
              />
            </TouchableOpacity>

            {/* Lessons */}
            {expandedUnits.includes(unitIndex) && (
              <View className="ml-4 mt-2">
                {unit.lessons?.map((lesson: any, lessonIndex: number) => (
                  <View key={lessonIndex} className="mb-3">
                    {/* Lesson Header */}
                    <TouchableOpacity
                      onPress={() => toggleLesson(unitIndex, lessonIndex)}
                      style={{
                        backgroundColor: isLargeScreen ? '#f9fafb' : '#4b5563',
                        borderRadius: isLargeScreen ? 12 : 8,
                        padding: isLargeScreen ? 20 : 12,
                        borderWidth: isLargeScreen ? 1 : 0,
                        borderColor: '#e5e7eb'
                      }}
                      className="flex-row items-center justify-between"
                    >
                      <View className="flex-1">
                        <Text 
                          style={{ 
                            color: isLargeScreen ? '#1f2937' : 'white',
                            fontWeight: '600',
                            fontSize: isLargeScreen ? 18 : 14
                          }}
                        >
                          Lesson {lessonIndex + 1}: {lesson.title || 'Untitled Lesson'}
                        </Text>
                        <Text 
                          style={{ 
                            color: isLargeScreen ? '#6b7280' : '#9ca3af',
                            fontSize: isLargeScreen ? 14 : 12,
                            marginTop: isLargeScreen ? 6 : 4
                          }}
                        >
                          {lesson.lectures?.length || 0} lectures
                        </Text>
                      </View>
                      <Ionicons
                        name={
                          expandedLessons.includes(`${unitIndex}-${lessonIndex}`)
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={isLargeScreen ? 24 : 20}
                        color={isLargeScreen ? COPPER : '#9ca3af'}
                      />
                    </TouchableOpacity>

                    {/* Lectures */}
                    {expandedLessons.includes(`${unitIndex}-${lessonIndex}`) && (
                      <View className="ml-4 mt-2">
                        {lesson.lectures?.map((lecture: any, lectureIndex: number) => {
                          const completed = isLectureCompleted(lecture.lectureId);
                          const current = isCurrentLecture(unitIndex, lessonIndex, lectureIndex);

                          return (
                            <TouchableOpacity
                              key={lectureIndex}
                              onPress={() => onSelectLecture(unitIndex, lessonIndex, lectureIndex)}
                              className="rounded-lg mb-2 flex-row items-center"
                              style={{
                                padding: isLargeScreen ? 16 : 12,
                                backgroundColor: current ? SAFFRON : (isLargeScreen ? '#ffffff' : '#374151'),
                                borderRadius: isLargeScreen ? 12 : 8,
                                borderWidth: isLargeScreen && !current ? 1 : 0,
                                borderColor: '#e5e7eb',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isLargeScreen && !current ? 0.05 : 0,
                                shadowRadius: 4,
                                elevation: isLargeScreen && !current ? 1 : 0
                              }}
                            >
                              {/* Completion Icon */}
                              <View className="mr-3">
                                {completed ? (
                                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                                ) : current ? (
                                  <Ionicons name="play-circle" size={24} color="white" />
                                ) : (
                                  <Ionicons
                                    name="play-circle-outline"
                                    size={24}
                                    color="#9ca3af"
                                  />
                                )}
                              </View>

                              {/* Lecture Info */}
                              <View className="flex-1">
                                <Text className={`font-medium ${current ? 'text-white' : 'text-gray-200'}`}>
                                  {lecture.title || `Lecture ${lectureIndex + 1}`}
                                </Text>
                                <View className="flex-row items-center mt-1">
                                  <Ionicons name="time-outline" size={12} color="#9ca3af" />
                                  <Text className="text-gray-400 text-xs ml-1">
                                    {lecture.duration || '10'} min
                                  </Text>
                                  {lecture.type && (
                                    <>
                                      <Text className="text-gray-400 mx-2">•</Text>
                                      <Text className="text-gray-400 text-xs capitalize">
                                        {lecture.type}
                                      </Text>
                                    </>
                                  )}
                                </View>
                              </View>

                              {/* Lock Icon for upcoming lectures */}
                              {!completed && !current && (
                                <Ionicons name="lock-closed" size={16} color="#9ca3af" />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
    </ScrollView>
  );
}
