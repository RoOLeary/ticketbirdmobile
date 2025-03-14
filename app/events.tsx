import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Calendar, MapPin, Clock, Users, Star, ChevronRight } from 'lucide-react-native';
import { useFavoritesStore } from '@/stores/favoritesStore';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  attendees: number;
  category: string;
  price: string;
}

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    date: 'March 15, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Innovation Center, Silicon Valley',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    attendees: 1200,
    category: 'Technology',
    price: '€1299',
  },
  {
    id: '2',
    title: 'Design Systems Workshop',
    date: 'April 5, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Creative Hub Downtown',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    attendees: 150,
    category: 'Design',
    price: '€1299',
  },
  {
    id: '3',
    title: 'Photography Exhibition',
    date: 'May 20, 2025',
    time: '11:00 AM - 8:00 PM',
    location: 'Metropolitan Gallery',
    image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&h=400&fit=crop',
    attendees: 500,
    category: 'Photography',
    price: '€25',
  },
];

const EventCard = ({ event }: { event: Event }) => {
  const router = useRouter();
  const { isFavorite } = useFavoritesStore();
  const isEventFavorite = isFavorite(`event-${event.id}`);

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.eventCard}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{event.category}</Text>
      </View>
      {isEventFavorite && (
        <View style={styles.favoriteIcon}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
        </View>
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.price}>{event.price}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={16} color="#666" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users size={16} color="#666" />
            <Text style={styles.detailText}>{event.attendees} attending</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => router.push(`/events/${event.id}`)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
          <ChevronRight size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function Events() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "My Events",
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 17,
          },
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom }
        ]}
      >
        {EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginBottom: 12,
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  viewButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
});