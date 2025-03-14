import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useFavoritesStore, FavoriteEvent, FavoritePost } from '@/stores/useFavoritesStore';
import { Calendar, MapPin, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favorites, removeFavorite } = useFavoritesStore();

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handlePostPress = (postId: string) => {
    router.push('/events');
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerTitle: "My Favorites",
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
        <View style={styles.emptyContainer}>
          <Heart size={48} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Events and posts you favorite will appear here
          </Text>
        </View>
      </View>
    );
  }

  const events = favorites.filter((item): item is FavoriteEvent => item.type === 'event');
  const posts = favorites.filter((item): item is FavoritePost => item.type === 'post');

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "My Favorites",
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
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.contentInner}
        >
          {events.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Events</Text>
              {events.map((event) => (
                event.image ? (
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
                            removeFavorite(event.id);
                          }}
                        >
                          <Heart size={20} color="#FF3B30" fill="#FF3B30" />
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
                ) : (
                  <Pressable 
                    key={event.id} 
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event.id)}
                  >
                    <View style={styles.eventHeader}>
                      <View>
                        {event.category && (
                          <Text style={styles.eventCategory}>{event.category}</Text>
                        )}
                        <Text style={styles.eventTitle}>{event.title}</Text>
                      </View>
                      <Pressable 
                        style={styles.heartButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          removeFavorite(event.id);
                        }}
                      >
                        <Heart size={20} color="#FF3B30" fill="#FF3B30" />
                      </Pressable>
                    </View>
                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}
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
                )
              ))}
            </View>
          )}

          {posts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Posts</Text>
              {posts.map((post) => (
                <Pressable 
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => handlePostPress(post.id)}
                >
                  <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
                      <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                      <View>
                        <Text style={styles.userName}>{post.user.name}</Text>
                        <Text style={styles.timestamp}>{post.timestamp}</Text>
                      </View>
                    </View>
                    <Pressable 
                      style={styles.heartButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        removeFavorite(post.id);
                      }}
                    >
                      <Heart size={20} color="#FF3B30" fill="#FF3B30" />
                    </Pressable>
                  </View>

                  <Text style={styles.postContent}>{post.content}</Text>

                  <View style={styles.eventCard}>
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
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </Animated.View>
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
  contentInner: {
    gap: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  // Event card styles
  featuredCard: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
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
    marginRight: 16,
  },
  featuredDetails: {
    gap: 8,
  },
  featuredDetailText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
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
  heartButton: {
    padding: 8,
    marginRight: -8,
  },
  // Post card styles
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  postContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventInfo: {
    gap: 8,
  },
});