import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MapPin, Link, Calendar, Users } from 'lucide-react-native';

const MOCK_USERS = {
  'alex_design': {
    username: 'alex_design',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    bio: 'Senior UI/UX Designer | Creating meaningful digital experiences',
    location: 'San Francisco, CA',
    website: 'alexdesign.com',
    followers: 12400,
    following: 891,
    joinDate: 'January 2020',
    topics: ['Design', 'Technology', 'Art'],
    recentPosts: [
      {
        id: '1',
        title: 'The Future of Design Systems',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
        likes: 234,
        comments: 45,
      },
      {
        id: '2',
        title: 'Creating Accessible Interfaces',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop',
        likes: 189,
        comments: 32,
      },
    ],
  },
  'sarah_tech': {
    username: 'sarah_tech',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Tech Enthusiast | Full Stack Developer | AI Researcher',
    location: 'Seattle, WA',
    website: 'sarahtech.dev',
    followers: 8900,
    following: 645,
    joinDate: 'March 2021',
    topics: ['Technology', 'AI', 'Programming'],
    recentPosts: [
      {
        id: '1',
        title: 'Understanding Neural Networks',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
        likes: 567,
        comments: 89,
      },
      {
        id: '2',
        title: 'The Rise of Edge Computing',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
        likes: 432,
        comments: 67,
      },
    ],
  },
};

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const user = MOCK_USERS[id as keyof typeof MOCK_USERS];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.following.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.infoText}>{user.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Link size={16} color="#666" />
          <Text style={styles.infoText}>{user.website}</Text>
        </View>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#666" />
          <Text style={styles.infoText}>Joined {user.joinDate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Topics</Text>
        <View style={styles.topicsGrid}>
          {user.topics.map((topic) => (
            <View key={topic} style={styles.topicBadge}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {user.recentPosts.map((post) => (
          <TouchableOpacity key={post.id} style={styles.postCard}>
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>❤️ {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Inter-Regular',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicBadge: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});