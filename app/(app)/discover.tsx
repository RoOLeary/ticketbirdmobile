import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { MessageCircle, ArrowBigUp, ArrowBigDown, Share2, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';

interface Post {
  id: string;
  title: string;
  content: string;
  subreddit: string;
  author: string;
  upvotes: number;
  comments: number;
  timePosted: string;
  image?: string;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  topics: string[];
}

const ALL_POSTS: Post[] = [
  {
    id: '1',
    title: "The Future of AI Development: What's Next?",
    content: 'A comprehensive look at emerging trends in artificial intelligence and machine learning...',
    subreddit: 'technology',
    author: 'tech_enthusiast',
    upvotes: 15243,
    comments: 892,
    timePosted: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    topics: ['Technology', 'Science'],
  },
  {
    id: '2',
    title: 'Minimalist Design Principles for Modern Web Apps',
    content: 'Exploring the key principles of minimalist design in modern web applications...',
    subreddit: 'webdev',
    author: 'design_master',
    upvotes: 8976,
    comments: 445,
    timePosted: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop',
    topics: ['Design', 'Technology'],
  },
  {
    id: '3',
    title: 'Building Scalable Backend Systems: Best Practices',
    content: 'A deep dive into architectural patterns and best practices for scalable backends...',
    subreddit: 'programming',
    author: 'backend_guru',
    upvotes: 6543,
    comments: 234,
    timePosted: '12 hours ago',
    topics: ['Technology'],
  },
  {
    id: '4',
    title: 'The Rise of Cross-Platform Development',
    content: 'Analyzing the growing trend of cross-platform development frameworks...',
    subreddit: 'programming',
    author: 'mobile_dev',
    upvotes: 4321,
    comments: 167,
    timePosted: '1 day ago',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    topics: ['Technology', 'Design'],
  },
  {
    id: '5',
    title: 'Latest Photography Techniques for Urban Landscapes',
    content: 'Master the art of urban photography with these cutting-edge techniques...',
    subreddit: 'photography',
    author: 'photo_pro',
    upvotes: 3254,
    comments: 198,
    timePosted: '3 hours ago',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop',
    topics: ['Photography', 'Art'],
  },
  {
    id: '6',
    title: 'The Evolution of Music Production',
    content: 'From analog to digital: How music production has transformed...',
    subreddit: 'music',
    author: 'music_producer',
    upvotes: 2876,
    comments: 312,
    timePosted: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=400&fit=crop',
    topics: ['Music', 'Art'],
  },
];

const TABS = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'popular', label: 'Popular' },
  { id: 'latest', label: 'Latest' },
];

const TabBar = ({ currentTab, onChangeTab }: { 
  currentTab: string;
  onChangeTab: (tab: string) => void;
}) => {
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: number }>({});
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(indicatorPosition.value, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }) }],
    width: withTiming(indicatorWidth.value, {
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }),
  }));

  const updateIndicator = (id: string, layout: { x: number; width: number }) => {
    setTabLayouts(prev => ({
      ...prev,
      [id]: layout.x,
    }));

    if (id === currentTab) {
      indicatorPosition.value = layout.x;
      indicatorWidth.value = layout.width;
    }
  };

  useEffect(() => {
    if (tabLayouts[currentTab] !== undefined) {
      indicatorPosition.value = tabLayouts[currentTab];
    }
  }, [currentTab, tabLayouts]);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              updateIndicator(tab.id, { x: layout.x, width: layout.width });
            }}
            style={[
              styles.tab,
              currentTab === tab.id && styles.activeTab
            ]}
          >
            <Text style={[
              styles.tabText,
              currentTab === tab.id && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View style={[styles.tabIndicator, animatedStyle]} />
    </View>
  );
};

const PostCard = ({ post, onUpvote, onDownvote }: { 
  post: Post;
  onUpvote: () => void;
  onDownvote: () => void;
}) => (
  <Animated.View 
    entering={FadeIn.duration(400)}
    style={styles.postCard}
  >
    <View style={styles.postHeader}>
      <Text style={styles.subredditName}>r/{post.subreddit}</Text>
      <Text style={styles.postMeta}>
        Posted by u/{post.author} • {post.timePosted}
      </Text>
    </View>

    <Text style={styles.postTitle}>{post.title}</Text>
    <Text style={styles.postContent} numberOfLines={3}>
      {post.content}
    </Text>

    {post.image && (
      <Image 
        source={{ uri: post.image }} 
        style={styles.postImage}
      />
    )}

    <View style={styles.topicsContainer}>
      {post.topics.map((topic) => (
        <View key={topic} style={styles.topicBadge}>
          <Text style={styles.topicText}>{topic}</Text>
        </View>
      ))}
    </View>

    <View style={styles.postActions}>
      <View style={styles.votingButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onUpvote}
        >
          <ArrowBigUp 
            size={24} 
            color={post.isUpvoted ? '#FF4500' : '#666'} 
            fill={post.isUpvoted ? '#FF4500' : 'none'}
          />
        </TouchableOpacity>
        <Text style={styles.voteCount}>
          {post.upvotes.toLocaleString()}
        </Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onDownvote}
        >
          <ArrowBigDown 
            size={24} 
            color={post.isDownvoted ? '#7193FF' : '#666'} 
            fill={post.isDownvoted ? '#7193FF' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <MessageCircle size={20} color="#666" />
        <Text style={styles.actionText}>
          {post.comments.toLocaleString()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Share2 size={20} color="#666" />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <MoreHorizontal size={20} color="#666" />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export default function Discover() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [currentTab, setCurrentTab] = useState('for-you');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const userTopics = user?.topics || [];
    let filteredPosts: Post[] = [];

    switch (currentTab) {
      case 'for-you':
        // Show posts that match user's interests
        filteredPosts = ALL_POSTS.filter(post =>
          post.topics.some(topic => userTopics.includes(topic))
        );
        break;
      case 'following':
        // Show posts from followed subreddits (for demo, showing tech posts)
        filteredPosts = ALL_POSTS.filter(post =>
          post.topics.includes('Technology')
        );
        break;
      case 'popular':
        // Show posts with highest upvotes
        filteredPosts = [...ALL_POSTS].sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'latest':
        // Show most recent posts (using the demo data as is)
        filteredPosts = ALL_POSTS;
        break;
      default:
        filteredPosts = ALL_POSTS;
    }

    setPosts(filteredPosts);
  }, [currentTab, user?.topics]);

  const handleUpvote = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const wasUpvoted = post.isUpvoted;
        return {
          ...post,
          upvotes: wasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          isUpvoted: !wasUpvoted,
          isDownvoted: false,
        };
      }
      return post;
    }));
  };

  const handleDownvote = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const wasDownvoted = post.isDownvoted;
        return {
          ...post,
          upvotes: wasDownvoted ? post.upvotes + 1 : post.upvotes - 1,
          isDownvoted: !wasDownvoted,
          isUpvoted: false,
        };
      }
      return post;
    }));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <TabBar 
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No posts found</Text>
            <Text style={styles.emptyStateText}>
              {currentTab === 'for-you' 
                ? "Update your interests in the profile to see more relevant content"
                : "Check back later for new posts"}
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={() => handleUpvote(post.id)}
              onDownvote={() => handleDownvote(post.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabBarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  activeTab: {
    backgroundColor: '#f8f9fa',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#007AFF',
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 12,
  },
  postHeader: {
    marginBottom: 8,
  },
  subredditName: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  postMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4a4a4a',
    marginBottom: 12,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  topicBadge: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  votingButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
  },
  voteCount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginHorizontal: 4,
    minWidth: 40,
    textAlign: 'center',
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
});