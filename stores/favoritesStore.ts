import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

// Defines the structure of items that can be favorited
export interface FavoriteItem {
  id: string;
  type: 'story' | 'post' | 'event' | 'topic';  // Different types of content that can be favorited
  title: string;
  image?: string;
  location?: string;
  author?: {
    username: string;
    avatar: string;
  };
  date?: string;
  category?: string;
  addedAt?: Date;  // Timestamp when item was added to favorites
}

// State and actions available in the favorites store
interface FavoritesState {
  favorites: FavoriteItem[];      // List of favorited items
  isLoading: boolean;             // Loading state indicator
  error: string | null;           // Error message if operation fails
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearError: () => void;
}

// Create the favorites store with persistence
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      // Add an item to favorites with current timestamp
      addFavorite: (item) => {
        try {
          set((state) => ({
            favorites: [
              ...state.favorites,
              {
                ...item,
                addedAt: new Date().toISOString(),
              },
            ],
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to add favorite' });
        }
      },

      // Remove an item from favorites by its ID
      removeFavorite: (id) => {
        try {
          set((state) => ({
            favorites: state.favorites.filter((item) => item.id !== id),
            error: null,
          }));
        } catch (error) {
          set({ error: 'Failed to remove favorite' });
        }
      },

      // Check if an item is already in favorites
      isFavorite: (id) => get().favorites.some((item) => item.id === id),

      // Clear any error state
      clearError: () => set({ error: null }),
    }),
    {
      // Persistence configuration
      name: 'favorites-storage',
      storage: createJSONStorage(() => storage),
      // Only persist the favorites array, not loading/error states
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

// Type-safe selector hooks for accessing store state
export const useFavorites = () => useFavoritesStore((state) => state.favorites);
export const useFavoritesError = () => useFavoritesStore((state) => state.error);
export const useIsFavorite = (id: string) => useFavoritesStore((state) => state.isFavorite(id));