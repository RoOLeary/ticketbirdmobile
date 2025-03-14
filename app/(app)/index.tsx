import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import Animated, { 
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Calendar,
  Newspaper,
  Compass,
  Heart,
  TrendingUp,
  Users,
  MessageCircle,
  Bell,
  Bookmark,
  Star,
  MapPin,
  Clock
} from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const QuickAccessTile = ({ icon: Icon, title, subtitle, onPress, color }) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchableOpacity 
      style={[styles.quickAccessTile, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Icon size={24} color="#fff" />
      </View>
      <Text style={styles.tileTitle}>{title}</Text>
      <Text style={styles.tileSubtitle}>{subtitle}</Text>
    </AnimatedTouchableOpacity>
  );
};

const TrendingTopic = ({ title, image, followers }) => (
  <View style={styles.trendingTopic}>
    <Image source={{ uri: image }} style={styles.trendingImage} />
    <View style={styles.trendingContent}>
      <Text style={styles.trendingTitle}>{title}</Text>
      <Text style={styles.trendingFollowers}>{followers} followers</Text>
    </View>
  </View>
);

const UpcomingEvent = ({ event, onPress }) => (
  <TouchableOpacity style={styles.eventCard} onPress={onPress}>
    <Image source={{ uri: event.image }} style={styles.eventImage} />
    <View style={styles.eventContent}>
      <Text style={styles.eventDate}>{event.date}</Text>
      <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
      <View style={styles.eventDetails}>
        <View style={styles.eventDetailRow}>
          <Clock size={16} color="#666" />
          <Text style={styles.eventDetailText}>{event.time}</Text>
        </View>
        <View style={styles.eventDetailRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.eventDetailText}>{event.location}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const displayName = user?.displayName?.trim() || user?.email;

  const QUICK_ACCESS = [
    {
      icon: Calendar,
      title: 'Events',
      subtitle: 'Upcoming events',
      color: '#FF6B6B',
      onPress: () => router.push('/events'),
    },
    {
      icon: Newspaper,
      title: 'Feed',
      subtitle: 'Latest updates',
      color: '#4ECDC4',
      onPress: () => router.push('/feed'),
    },
    {
      icon: Compass,
      title: 'Discover',
      subtitle: 'Explore content',
      color: '#45B7D1',
      onPress: () => router.push('/discover'),
    },
    {
      icon: Heart,
      title: 'Favorites',
      subtitle: 'Saved items',
      color: '#96CEB4',
      onPress: () => router.push('/favorites'),
    },
  ];

  const TRENDING_TOPICS = [
    {
      title: 'Web Development',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
      followers: '125K',
    },
    {
      title: 'UI/UX Design',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
      followers: '98K',
    },
    {
      title: 'Mobile Development',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
      followers: '76K',
    },
  ];

  const UPCOMING_EVENTS = [
    {
      id: '1',
      title: 'Tech Conference 2025',
      date: 'Mar 15',
      time: '9:00 AM',
      location: 'Innovation Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    },
    {
      id: '2',
      title: 'Design Systems Workshop',
      date: 'Apr 5',
      time: '10:00 AM',
      location: 'Creative Hub',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    },
    {
      id: '3',
      title: 'AI Summit 2025',
      date: 'Apr 20',
      time: '9:30 AM',
      location: 'Tech Campus',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.username}>{displayName}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={20} color="#007AFF" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>New Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={20} color="#007AFF" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={20} color="#007AFF" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {QUICK_ACCESS.map((item, index) => (
            <QuickAccessTile key={index} {...item} index={index} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.recommendationText}>
          Based on your interests in {user?.topics.slice(0, 2).join(' and ')}, here are some events you might like:
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsScroll}
        >
          {UPCOMING_EVENTS.map((event, index) => (
            <Animated.View
              key={event.id}
            >
              <UpcomingEvent 
                event={event}
                onPress={() => router.push(`/events/${event.id}`)}
              />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
          {user?.topics.map((topic, index) => (
            <View key={index} style={styles.activityCard}>
              <Star size={20} color="#FFD700" />
              <Text style={styles.activityText}>Following {topic}</Text>
              <Text style={styles.activityTime}>2h ago</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        {TRENDING_TOPICS.map((topic, index) => (
          <TrendingTopic key={index} {...topic} />
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeSection: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  seeAllButton: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickAccessTile: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  tileTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  activityScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  activityCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  trendingTopic: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingImage: {
    width: 80,
    height: 80,
  },
  trendingContent: {
    flex: 1,
    padding: 16,
  },
  trendingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  trendingFollowers: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  eventsScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 16,
  },
  eventCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  eventContent: {
    padding: 16,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 24,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});