import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

export interface FavoriteItem {
  id: string;
  type: 'story' | 'post' | 'event' | 'topic';
  title: string;
  image?: string;
  author?: {
    username: string;
    avatar: string;
  };
  date?: string;
  category?: string;
  addedAt: string;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,
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
      isFavorite: (id) => get().favorites.some((item) => item.id === id),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);

// Optional: Add type-safe selector hooks
export const useFavorites = () => useFavoritesStore((state) => state.favorites);
export const useFavoritesError = () => useFavoritesStore((state) => state.error);
export const useIsFavorite = (id: string) => useFavoritesStore((state) => state.isFavorite(id));