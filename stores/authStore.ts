/**
 * Authentication and User Profile Store
 * 
 * This store handles all server-synced user data and authentication state.
 * When integrated with Supabase, this store will manage:
 * - User authentication (login/logout)
 * - User profile data that syncs across devices
 * - Server-side preferences and settings
 * 
 * The data in this store represents the source of truth for the user's account
 * and will be synchronized with the backend server. Any data that should persist
 * across devices or be available when the user logs in on a new device should
 * be stored here.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Represents a user's profile and preferences that sync with the server
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  topics: string[];  // User's interests/topics that affect content recommendations
  socialNetworks: {
    id: string;        // Social network identifier (e.g., 'twitter', 'github')
    username: string;  // Username on that network
    connected: boolean; // Whether the account is connected
  }[];
}

/**
 * Authentication store interface defining all available actions and state
 */
export interface AuthStore {
  // Current authenticated user or null if not logged in
  user: User | null;
  // Loading state for async operations
  isLoading: boolean;
  // Error message from the last failed operation
  error: string | null;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Profile update method - will sync with server when implemented
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

/**
 * Creates and exports the authentication store
 * Currently uses mock data and simulated delays, but will be replaced
 * with actual Supabase authentication and database calls
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      /**
       * Authenticates a user with their email and password
       * TODO: Replace with Supabase authentication
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({
            user: {
              id: '1',
              email,
              displayName: 'Danger Ro',
              bio: '',
              topics: [],
              socialNetworks: [
                { id: 'bluesky', username: '', connected: false },
                { id: 'instagram', username: '', connected: false },
                { id: 'linkedin', username: '', connected: false },
                { id: 'github', username: '', connected: false }
              ],
            },
          });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Logs out the current user and clears their data
       * TODO: Replace with Supabase logout
       */
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ user: null });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Updates the user's profile information
       * This will sync with the server when Supabase is integrated
       */
      updateProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          set(state => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);