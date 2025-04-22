import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { usePreferencesStore } from '@/stores/usePreferencesStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { 
  Laptop, 
  Palette, 
  Briefcase, 
  TestTube2, 
  Heart, 
  Trophy, 
  Music, 
  Paintbrush, 
  Plane, 
  UtensilsCrossed, 
  Shirt, 
  Camera 
} from 'lucide-react-native';

const TOPICS = [
  { 
    id: 'technology', 
    label: 'Technology',
    icon: (color: string) => <Laptop size={24} color={color} />,
    color: '#007AFF'
  },
  { 
    id: 'design', 
    label: 'Design',
    icon: (color: string) => <Palette size={24} color={color} />,
    color: '#FF2D55'
  },
  { 
    id: 'business', 
    label: 'Business',
    icon: (color: string) => <Briefcase size={24} color={color} />,
    color: '#FF9500'
  },
  { 
    id: 'science', 
    label: 'Science',
    icon: (color: string) => <TestTube2 size={24} color={color} />,
    color: '#5856D6'
  },
  { 
    id: 'health', 
    label: 'Health',
    icon: (color: string) => <Heart size={24} color={color} />,
    color: '#FF3B30'
  },
  { 
    id: 'sports', 
    label: 'Sports',
    icon: (color: string) => <Trophy size={24} color={color} />,
    color: '#4CD964'
  },
  { 
    id: 'music', 
    label: 'Music',
    icon: (color: string) => <Music size={24} color={color} />,
    color: '#AF52DE'
  },
  { 
    id: 'art', 
    label: 'Art',
    icon: (color: string) => <Paintbrush size={24} color={color} />,
    color: '#FF2D55'
  },
  { 
    id: 'travel', 
    label: 'Travel',
    icon: (color: string) => <Plane size={24} color={color} />,
    color: '#5AC8FA'
  },
  { 
    id: 'food', 
    label: 'Food',
    icon: (color: string) => <UtensilsCrossed size={24} color={color} />,
    color: '#FF9500'
  },
  { 
    id: 'fashion', 
    label: 'Fashion',
    icon: (color: string) => <Shirt size={24} color={color} />,
    color: '#FF2D55'
  },
  { 
    id: 'photography', 
    label: 'Photography',
    icon: (color: string) => <Camera size={24} color={color} />,
    color: '#8E8E93'
  },
];

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { updateProfile, user } = useAuthStore();
  const { setHasCompletedOnboarding } = usePreferencesStore();

  const handleContinue = async () => {
    if (selectedTopics.length > 0) {
      await updateProfile({
        ...user,
        topics: selectedTopics.map(id => TOPICS.find(t => t.id === id)?.label || id)
      });
    }
    await setHasCompletedOnboarding(true);
    router.push('/(app)');
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.title}>What are you interested in?</Text>
          <Text style={styles.subtitle}>
            Select topics you're interested in to personalize your experience
          </Text>
        </Animated.View>

        <View style={styles.topicsGrid}>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicButton,
                  { backgroundColor: isSelected ? topic.color : '#f5f5f5' }
                ]}
                onPress={() => toggleTopic(topic.id)}
              >
                {topic.icon(isSelected ? '#fff' : '#666')}
                <Text style={[
                  styles.topicText,
                  isSelected && styles.topicTextSelected
                ]}>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.continueButton, selectedTopics.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selectedTopics.length === 0}
        >
          <Text style={[styles.continueButtonText, selectedTopics.length === 0 && styles.continueButtonTextDisabled]}>
            {selectedTopics.length === 0 ? 'Select at least one topic' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  topicButton: {
    width: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  topicText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-SemiBold',
  },
  topicTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
});