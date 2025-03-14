import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

const TOPICS = [
  { id: 'tech', label: 'Technology', icon: '💻' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'science', label: 'Science', icon: '🔬' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'food', label: 'Food', icon: '🍳' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'books', label: 'Books', icon: '📚' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'fitness', label: 'Fitness', icon: '💪' }
];

export default function Onboarding() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();
  const updateTopics = useAuthStore((state) => state.updateTopics);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleComplete = () => {
    updateTopics(selectedTopics.map(id => 
      TOPICS.find(t => t.id === id)?.label || ''
    ).filter(Boolean));
    router.replace('/(app)');
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>What interests you?</Text>
        <Text style={styles.subtitle}>
          Choose topics you'd like to see in your feed. You can always change these later.
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topicsGrid}>
          {TOPICS.map((topic, index) => (
            <Animated.View
              key={topic.id}
              entering={FadeInUp.delay(index * 50).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.topicChip,
                  selectedTopics.includes(topic.id) && styles.topicChipSelected
                ]}
                onPress={() => toggleTopic(topic.id)}
              >
                <Text style={styles.topicIcon}>{topic.icon}</Text>
                <Text style={[
                  styles.topicText,
                  selectedTopics.includes(topic.id) && styles.topicTextSelected
                ]}>
                  {topic.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionCount}>
            {selectedTopics.length} selected
          </Text>
          <Text style={styles.selectionHint}>
            Select at least 3 topics to continue
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTopics.length < 3 && styles.continueButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={selectedTopics.length < 3}
        >
          <Text style={[
            styles.continueButtonText,
            selectedTopics.length < 3 && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    minWidth: 120,
  },
  topicChipSelected: {
    backgroundColor: '#007AFF',
  },
  topicIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  topicText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-SemiBold',
  },
  topicTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  selectionInfo: {
    marginBottom: 16,
  },
  selectionCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginBottom: 4,
  },
  selectionHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  continueButtonTextDisabled: {
    color: '#fff8',
  },
});