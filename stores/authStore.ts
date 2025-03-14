import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SocialNetwork {
  id: string;
  username: string;
  connected: boolean;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  emailUpdates: boolean;
  socialNetworks: SocialNetwork[];
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  preferences: UserPreferences;
  topics: string[];
}

export interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateTopics: (topics: string[]) => void;
  updateSocialNetworks: (networks: SocialNetwork[]) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: async (email: string, password: string) => {
        // Simulate login
        set({
          user: {
            id: '1',
            email,
            displayName: null,
            preferences: {
              darkMode: false,
              notifications: true,
              emailUpdates: true,
              socialNetworks: [],
            },
            topics: [],
          },
        });
      },
      logout: async () => {
        set({ user: null });
      },
      updateDisplayName: (name: string) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, displayName: name }
            : null,
        }));
      },
      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
            : null,
        }));
      },
      updateTopics: (topics: string[]) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, topics }
            : null,
        }));
      },
      updateSocialNetworks: (networks: SocialNetwork[]) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  socialNetworks: networks,
                },
              }
            : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

// Optional: Add type-safe selector hooks
export const useUser = () => useAuthStore((state) => state.user);