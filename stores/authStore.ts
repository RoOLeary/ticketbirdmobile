import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from './storage';

interface User {
  email: string;
  displayName?: string;
  topics: string[];
  preferences?: {
    darkMode: boolean;
    notifications: boolean;
    emailUpdates: boolean;
  };
  lastLogin?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTopics: (topics: string[]) => void;
  updateDisplayName: (displayName: string) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: true, error: null }),
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          // In a real app, implement actual authentication here
          // Simulating API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ 
            isAuthenticated: true,
            user: {
              email,
              topics: [],
              displayName: '',
              preferences: {
                darkMode: false,
                notifications: true,
                emailUpdates: true,
              },
              lastLogin: new Date().toISOString(),
            },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ isAuthenticated: false, user: null, error: null });
        } finally {
          set({ isLoading: false });
        }
      },
      updateTopics: (topics) => 
        set((state) => ({
          user: state.user ? { ...state.user, topics } : null,
          error: null,
        })),
      updateDisplayName: (displayName) =>
        set((state) => ({
          user: state.user ? { ...state.user, displayName } : null,
          error: null,
        })),
      updatePreferences: (preferences) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  ...preferences,
                },
              }
            : null,
          error: null,
        })),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Optional: Add type-safe selector hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);