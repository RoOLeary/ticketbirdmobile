import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFavoritesStore, FavoriteItem } from '@/stores/favoritesStore';
import { Calendar, MapPin, Clock, Users, Star, ChevronRight, Heart } from 'lucide-react-native';

type GroupedFavorites = {
  [K in FavoriteItem['type']]: FavoriteItem[];
};

export default function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const groupedFavorites = useMemo(() => {
    return favorites.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as GroupedFavorites);
  }, [favorites]);

  const renderFavoriteItem = (item: FavoriteItem) => {
    const handleRemove = () => removeFavorite(item.id);

    return (
      <View key={item.id} style={styles.favoriteCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        )}
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
              <Heart size={20} color="#FF3B30" fill="#FF3B30" />
            </TouchableOpacity>
          </View>
          
          {item.author && (
            <View style={styles.authorRow}>
              <Image source={{ uri: item.author.avatar }} style={styles.authorAvatar} />
              <Text style={styles.authorName}>{item.author.username}</Text>
            </View>
          )}
          
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
          
          {item.date && (
            <Text style={styles.dateText}>{item.date}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderSection = (title: string, items: FavoriteItem[]) => {
    if (!items?.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map(renderFavoriteItem)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {renderSection('Stories', groupedFavorites.story)}
      {renderSection('Posts', groupedFavorites.post)}
      {renderSection('Events', groupedFavorites.event)}
      {renderSection('Topics', groupedFavorites.topic)}
      
      {favorites.length === 0 && (
        <View style={styles.emptyState}>
          <Heart size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No favorites yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Items you favorite will appear here
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  favoriteCard: {
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
  itemImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: '#007AFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});