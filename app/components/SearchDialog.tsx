import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown 
} from 'react-native-reanimated';

interface SearchResult {
  id: string;
  type: 'event' | 'user' | 'topic';
  title: string;
  subtitle?: string;
  image?: string;
  route: `/events/${string}` | `/user/${string}` | `/topics/${string}`;
}

const TRENDING_SEARCHES = [
  'Tech Conference',
  'Design Workshop',
  'Photography',
  'Web Development',
  'Mobile Apps',
];

const RECENT_SEARCHES = [
  'AI Summit 2025',
  'UX Design Meetup',
  'JavaScript Conference',
];

const QUICK_SUGGESTIONS: SearchResult[] = [
  {
    id: '1',
    type: 'event',
    title: 'Tech Conference 2025',
    subtitle: 'March 15, 2025',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop',
    route: '/events/1',
  },
  {
    id: '2',
    type: 'user',
    title: 'Sarah Chen',
    subtitle: '@sarah_tech',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    route: '/user/sarah_tech',
  },
  {
    id: '3',
    type: 'topic',
    title: 'Artificial Intelligence',
    subtitle: '125K followers',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
    route: '/topics/ai',
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SearchDialog({ visible, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query) {
      // In a real app, implement actual search logic here
      setResults(QUICK_SUGGESTIONS.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultPress = (result: SearchResult) => {
    router.push(result.route as any);
    onClose();
  };

  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <Animated.View 
        style={styles.container}
        entering={SlideInDown.duration(300)}
        exiting={SlideOutDown.duration(300)}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Search events, people, topics..."
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
              {query ? (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {!query ? (
            <View style={styles.suggestions}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={20} color="#666" />
                  <Text style={styles.sectionTitle}>Trending Searches</Text>
                </View>
                <View style={styles.tags}>
                  {TRENDING_SEARCHES.map((term) => (
                    <TouchableOpacity 
                      key={term} 
                      style={styles.tag}
                      onPress={() => setQuery(term)}
                    >
                      <Text style={styles.tagText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color="#666" />
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                </View>
                {RECENT_SEARCHES.map((term) => (
                  <TouchableOpacity 
                    key={term}
                    style={styles.recentItem}
                    onPress={() => setQuery(term)}
                  >
                    <Clock size={16} color="#666" />
                    <Text style={styles.recentText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultItem}
                  onPress={() => handleResultPress(item)}
                >
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.resultImage} />
                  )}
                  <View style={styles.resultContent}>
                    <Text style={styles.resultTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                  {item.type === 'topic' && (
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  suggestions: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});