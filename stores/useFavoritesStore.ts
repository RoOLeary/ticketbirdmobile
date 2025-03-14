import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteEvent {
  id: string;
  title: string;
  type: 'event';
  image?: string;
  date: string;
  location: string;
  category?: string;
  description?: string;
}

export interface FavoritePost {
  id: string;
  type: 'post';
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
  timestamp: string;
}

export type FavoriteItem = FavoriteEvent | FavoritePost;

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  
  addFavorite: async (item) => {
    set((state) => {
      const newFavorites = [...state.favorites, item];
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  removeFavorite: async (id) => {
    set((state) => {
      const newFavorites = state.favorites.filter(item => item.id !== id);
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
  
  isFavorite: (id) => {
    return get().favorites.some(item => item.id === id);
  },
}));

// Load favorites from AsyncStorage on app start
const initializeFavorites = async () => {
  try {
    const storedFavorites = await AsyncStorage.getItem('favorites');
    if (storedFavorites) {
      useFavoritesStore.setState({ favorites: JSON.parse(storedFavorites) });
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

initializeFavorites(); 