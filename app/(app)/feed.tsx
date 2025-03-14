import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Heart } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Story {
  id: string;
  username: string;
  avatar: string;
  title: string;
}

interface Post {
  id: string;
  username: string;
  avatar: string;
  image: string;
  caption: string;
  topic: string;
  likes: number;
  timestamp: string;
}

const STORIES: Story[] = [
  { 
    id: '1',
    username: 'alex_design',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    title: 'Design Updates'
  },
  { 
    id: '2',
    username: 'sarah_tech',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    title: 'Tech News'
  },
  { 
    id: '3',
    username: 'mike_photo',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    title: 'Photography Tips'
  },
  { 
    id: '4',
    username: 'lisa_art',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    title: 'Art Gallery'
  },
  { 
    id: '5',
    username: 'john_dev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    title: 'Coding Journey'
  },
  { 
    id: '6',
    username: 'emma_ux',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    title: 'UX Insights'
  },
  { 
    id: '7',
    username: 'david_ai',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    title: 'AI Updates'
  },
  { 
    id: '8',
    username: 'sophia_web',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    title: 'Web Trends'
  }
];

const POSTS: Post[] = [
  {
    id: '1',
    username: 'techie_sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
    caption: 'Just finished setting up my new development environment! #coding #tech',
    topic: 'Technology',
    likes: 234,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    username: 'design_master',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    caption: 'New design exploration for the upcoming project 🎨 #design #creativity',
    topic: 'Design',
    likes: 456,
    timestamp: '3 hours ago'
  },
  {
    id: '3',
    username: 'ai_innovator',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    caption: 'Exploring the latest developments in AI and machine learning 🤖 #AI #future',
    topic: 'Technology',
    likes: 789,
    timestamp: '4 hours ago'
  },
  {
    id: '4',
    username: 'ux_expert',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    caption: 'User experience is all about understanding human behavior 🧠 #UX #design',
    topic: 'Design',
    likes: 567,
    timestamp: '5 hours ago'
  },
  {
    id: '5',
    username: 'web_developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    caption: 'Clean code is not just about writing code, it\'s about crafting solutions 💻 #coding #webdev',
    topic: 'Technology',
    likes: 345,
    timestamp: '6 hours ago'
  },
  {
    id: '6',
    username: 'mobile_guru',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    caption: 'The future of mobile development is cross-platform 📱 #mobile #development',
    topic: 'Technology',
    likes: 678,
    timestamp: '7 hours ago'
  },
  {
    id: '7',
    username: 'data_scientist',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    caption: 'Data tells stories that words cannot express 📊 #data #analytics',
    topic: 'Technology',
    likes: 890,
    timestamp: '8 hours ago'
  },
  {
    id: '8',
    username: 'creative_designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    caption: 'Design is not just what it looks like, design is how it works ✨ #design #creativity',
    topic: 'Design',
    likes: 432,
    timestamp: '9 hours ago'
  }
];

const StoryItem = ({ item, onPress }: { item: Story; onPress: () => void }) => (
  <TouchableOpacity style={styles.storyContainer} onPress={onPress}>
    <View style={styles.storyRing}>
      <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
    </View>
    <Text style={styles.storyUsername} numberOfLines={1}>
      {item.username}
    </Text>
    <Text style={styles.storyTitle} numberOfLines={1}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

const PostCard = ({ item, isFavorite, onToggleFavorite, onUserPress }: { 
  item: Post; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onUserPress: () => void;
}) => (
  <Animated.View 
    entering={FadeIn.duration(400)} 
    style={styles.postCard}
  >
    <View style={styles.postHeader}>
      <TouchableOpacity style={styles.userInfo} onPress={onUserPress}>
        <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
        <View>
          <Text style={styles.postUsername}>{item.username}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={onToggleFavorite}
      >
        <Heart 
          size={20} 
          color={isFavorite ? '#fff' : '#666'} 
          fill={isFavorite ? '#fff' : 'none'}
        />
      </TouchableOpacity>
    </View>
    <Image source={{ uri: item.image }} style={styles.postImage} />
    <View style={styles.postFooter}>
      <View style={styles.topicBadge}>
        <Text style={styles.topicText}>{item.topic}</Text>
      </View>
      <Text style={styles.likes}>{item.likes} likes</Text>
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  </Animated.View>
);

export default function Feed() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userTopics = user?.topics || [];
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const handleStoryPress = (username: string) => {
    router.push(`/user/${username}`);
  };

  const handleToggleFavorite = (post: Post) => {
    const id = `post-${post.id}`;
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        type: 'post',
        title: post.caption,
        image: post.image,
        author: {
          username: post.username,
          avatar: post.avatar,
        },
        category: post.topic,
        date: post.timestamp,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Stories</Text>
        <FlatList
          data={STORIES}
          renderItem={({ item }) => (
            <StoryItem 
              item={item} 
              onPress={() => handleStoryPress(item.username)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storiesList}
        />
      </View>
      
      <View style={styles.feedSection}>
        <Text style={styles.sectionTitle}>Your Feed</Text>
        <FlatList
          data={POSTS.filter(post => userTopics.includes(post.topic))}
          renderItem={({ item }) => (
            <PostCard 
              item={item}
              isFavorite={isFavorite(`post-${item.id}`)}
              onToggleFavorite={() => handleToggleFavorite(item)}
              onUserPress={() => handleStoryPress(item.username)}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  storiesSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  storiesList: {
    paddingRight: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: '#007AFF',
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyUsername: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  storyTitle: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  feedSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  postCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUsername: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF3B30',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  postFooter: {
    padding: 12,
  },
  topicBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  topicText: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  likes: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4a4a4a',
  },
});