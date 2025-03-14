import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Calendar, MapPin, Clock, Users, Star, Share2, ChevronLeft, Ticket } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EventDetails {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  attendees: number;
  category: string;
  price: string;
  organizer: {
    name: string;
    image: string;
  };
  ticketUrl: string;
}

const EVENTS: Record<string, EventDetails> = {
  '1': {
    id: '1',
    title: 'Tech Conference 2025',
    date: 'March 15, 2025',
    time: '9:00 AM - 6:00 PM',
    location: 'Innovation Center, Silicon Valley',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    description: 'Join us for the biggest tech conference of 2025! Featuring keynote speakers from leading tech companies, hands-on workshops, and networking opportunities. \n\nTopics include AI, Web3, Cloud Computing, and more.',
    attendees: 1200,
    category: 'Technology',
    price: '€1299',
    organizer: {
      name: 'TechEvents Inc.',
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'
    },
    ticketUrl: 'https://example.com/tickets/tech-conf-2025'
  },
  '2': {
    id: '2',
    title: 'Design Systems Workshop',
    date: 'April 5, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Creative Hub Downtown',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    description: 'A comprehensive workshop on building and maintaining design systems. Learn about component libraries, documentation, and collaboration between designers and developers.',
    attendees: 150,
    category: 'Design',
    price: '€1299',
    organizer: {
      name: 'DesignOps Pro',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop'
    },
    ticketUrl: 'https://example.com/tickets/design-workshop'
  },
  '3': {
    id: '3',
    title: 'Photography Exhibition',
    date: 'May 20, 2025',
    time: '11:00 AM - 8:00 PM',
    location: 'Metropolitan Gallery',
    image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&h=400&fit=crop',
    description: 'Experience stunning photography from renowned artists around the world. This exhibition showcases various styles and techniques in modern photography.',
    attendees: 500,
    category: 'Photography',
    price: '$25',
    organizer: {
      name: 'Art & Culture Society',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
    },
    ticketUrl: 'https://example.com/tickets/photo-exhibition'
  }
};

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const event = EVENTS[id as string];
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isEventFavorite = isFavorite(`event-${event.id}`);

  const handleToggleFavorite = () => {
    const favoriteId = `event-${event.id}`;
    if (isEventFavorite) {
      removeFavorite(favoriteId);
    } else {
      addFavorite({
        id: favoriteId,
        type: 'event',
        title: event.title,
        image: event.image,
        category: event.category,
        date: event.date,
      });
    }
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleBuyTickets = () => {
    Linking.openURL(event.ticketUrl);
  };

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.header}>
          <Image source={{ uri: event.image }} style={styles.coverImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, isEventFavorite && styles.actionButtonActive]}
              onPress={handleToggleFavorite}
            >
              <Star 
                size={20} 
                color={isEventFavorite ? '#fff' : '#fff'} 
                fill={isEventFavorite ? '#fff' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Calendar size={20} color="#666" />
              <Text style={styles.infoText}>{event.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={20} color="#666" />
              <Text style={styles.infoText}>{event.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#666" />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Users size={20} color="#666" />
              <Text style={styles.infoText}>{event.attendees} attending</Text>
            </View>
          </View>

          <View style={styles.organizerSection}>
            <Image source={{ uri: event.organizer.image }} style={styles.organizerImage} />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerLabel}>Organized by</Text>
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>{event.price}</Text>
          </View>
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyTickets}>
            <Ticket size={20} color="#fff" />
            <Text style={styles.buyButtonText}>Buy Tickets</Text>
          </TouchableOpacity>
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
  header: {
    position: 'relative',
    height: 300,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    position: 'absolute',
    top: 44,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#007AFF',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  organizerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  organizerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  descriptionSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});