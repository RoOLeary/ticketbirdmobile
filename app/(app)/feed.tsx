import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2, Calendar, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFavoritesStore } from '@/stores/useFavoritesStore';

interface Story {
  id: string;
  username: string;
  avatar: string;
  title: string;
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
  }
];

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  event: {
    title: string;
    date: string;
    location: string;
    image: string;
  };
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  timestamp: string;
}

const POSTS: Post[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    event: {
      title: 'Tech Conference 2025',
      date: 'March 15, 2025',
      location: 'Innovation Center, Silicon Valley',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    },
    content: "Just secured my ticket for #TechConf2025! Can't wait to learn about the latest in AI and meet fellow tech enthusiasts. Who else is going? 🚀",
    likes: 128,
    comments: 24,
    liked: false,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    event: {
      title: 'Design Systems Workshop',
      date: 'April 5, 2025',
      location: 'Creative Hub Downtown',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    },
    content: 'Excited to share my experience from the Design Systems Workshop! The insights on scalable design practices were invaluable. Here are some key takeaways... 🎨 #DesignSystems #UX',
    likes: 95,
    comments: 18,
    liked: true,
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    },
    event: {
      title: 'Photography Exhibition',
      date: 'May 20, 2025',
      location: 'Metropolitan Gallery',
      image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&h=400&fit=crop',
    },
    content: 'Honored to have my work featured in the upcoming Photography Exhibition! Here\'s a sneak peek of my collection "Urban Perspectives" 📸 #Photography #Art',
    likes: 256,
    comments: 42,
    liked: false,
    timestamp: '1 day ago',
  },
];

const StoryItem = ({ story }: { story: Story }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      style={styles.storyContainer} 
      onPress={() => router.push(`/user/${story.username}`)}
    >
      <View style={styles.storyRing}>
        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {story.username}
      </Text>
      <Text style={styles.storyTitle} numberOfLines={1}>
        {story.title}
      </Text>
    </TouchableOpacity>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isPostFavorite = isFavorite(post.id);

  const handleLike = () => {
    if (isPostFavorite) {
      removeFavorite(post.id);
    } else {
      addFavorite({
        id: post.id,
        type: 'post',
        user: post.user,
        event: post.event,
        content: post.content,
        timestamp: post.timestamp,
      });
    }
  };

  const handleShare = () => {
    // Implement share functionality
  };

  return (
    <Animated.View 
      entering={FadeInDown.duration(400)}
      style={styles.postCard}
    >
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.userName}>{post.user.name}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <Link href={`/events/${post.id}`} asChild>
        <TouchableOpacity style={styles.eventCard}>
          <Image source={{ uri: post.event.image }} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{post.event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Calendar size={14} color="#666" />
                <Text style={styles.detailText}>{post.event.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={14} color="#666" />
                <Text style={styles.detailText}>{post.event.location}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
            size={20} 
            color={isPostFavorite ? '#FF3B30' : '#666'} 
            fill={isPostFavorite ? '#FF3B30' : 'none'} 
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#666" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function Feed() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.storiesSection}>
        <Text style={styles.sectionTitle}>Stories</Text>
        <FlatList
          data={STORIES}
          renderItem={({ item }) => <StoryItem story={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      <View style={styles.feedContent}>
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
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
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 16,
    marginBottom: 12,
  },
  storiesList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyContainer: {
    alignItems: 'center',
    width: 72,
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
  feedContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  content: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  eventInfo: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
}); 