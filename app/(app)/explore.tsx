import { View, Text, StyleSheet, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { Search, Calendar, MapPin, Heart } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFavoritesStore, FavoriteItem } from '@/stores/useFavoritesStore';
import { useRouter } from 'expo-router';

const FEATURED_EVENTS: FavoriteItem[] = [
  {
    id: '1',
    title: 'TechCon 2024',
    date: 'March 20-22, 2024',
    location: 'Innovation Center',
    type: 'event',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    title: 'AI Summit',
    date: 'April 5-6, 2024',
    location: 'Tech Hub',
    type: 'event',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    title: 'DevOps World',
    date: 'April 15-17, 2024',
    location: 'Convention Center',
    type: 'event',
    image: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=800&auto=format&fit=crop&q=60',
  },
];

const UPCOMING_EVENTS: FavoriteItem[] = [
  {
    id: '4',
    title: 'Web3 Development Workshop',
    description: 'Learn the fundamentals of blockchain and decentralized applications.',
    date: 'March 25, 2024',
    location: 'Digital Academy',
    category: 'Workshop',
    type: 'event',
  },
  {
    id: '5',
    title: 'UX Design Conference',
    description: 'Explore the latest trends in user experience design.',
    date: 'March 28, 2024',
    location: 'Design Center',
    category: 'Conference',
    type: 'event',
  },
  {
    id: '6',
    title: 'Mobile App Development Summit',
    description: 'Join industry experts for insights into mobile development.',
    date: 'April 2, 2024',
    location: 'Tech Campus',
    category: 'Summit',
    type: 'event',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const handleFavoritePress = (event: FavoriteItem) => {
    if (isFavorite(event.id)) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(500)}
        style={styles.content}
      >
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, talks, or workshops..."
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.featuredScroll}
            contentContainerStyle={styles.featuredContent}
          >
            {FEATURED_EVENTS.map((event) => (
              <Pressable 
                key={event.id} 
                style={styles.featuredCard}
                onPress={() => handleEventPress(event.id)}
              >
                <Image source={{ uri: event.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredHeader}>
                    <Text style={styles.featuredTitle}>{event.title}</Text>
                    <Pressable 
                      style={styles.heartButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleFavoritePress(event);
                      }}
                    >
                      <Heart 
                        size={20} 
                        color={isFavorite(event.id) ? '#FF3B30' : '#fff'} 
                        fill={isFavorite(event.id) ? '#FF3B30' : 'none'}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.featuredDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color="#fff" />
                      <Text style={styles.featuredDetailText}>{event.date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color="#fff" />
                      <Text style={styles.featuredDetailText}>{event.location}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {UPCOMING_EVENTS.map((event) => (
            <Pressable 
              key={event.id} 
              style={styles.eventCard}
              onPress={() => handleEventPress(event.id)}
            >
              <View style={styles.eventHeader}>
                <View>
                  <Text style={styles.eventCategory}>{event.category}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
                <Pressable 
                  style={styles.heartButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleFavoritePress(event);
                  }}
                >
                  <Heart 
                    size={20} 
                    color={isFavorite(event.id) ? '#FF3B30' : '#666'} 
                    fill={isFavorite(event.id) ? '#FF3B30' : 'none'}
                  />
                </Pressable>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.detailText}>{event.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: 12,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  featuredScroll: {
    marginHorizontal: -20,
  },
  featuredContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 300,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  featuredDetails: {
    gap: 8,
  },
  featuredDetailText: {
    fontFamily: 'Inter-Regular',
    color: '#fff',
    fontSize: 14,
  },
  heartButton: {
    padding: 4,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventCategory: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  eventTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1a1a1a',
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
});