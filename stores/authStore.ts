/**
 * Authentication and User Profile Store
 * 
 * This store handles all server-synced user data and authentication state.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

/**
 * Represents a user's profile from Supabase
 */
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  website: string | null;
  timezone: string | null;
  language: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  bio: string | null;
  topics: string[];  
  socialNetworks: {
    id: string;      
    username: string;
    connected: boolean;
  }[];
  signup_source?: string;
}

export type SignupOrigin = 'mobile_app' | 'web' | 'marketing' | 'referral';

/**
 * Authentication store interface
 */
export interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (
    email: string, 
    password: string, 
    username: string, 
    origin?: SignupOrigin,
    referrer?: string
  ) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'linkedin' | 'github') => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateUser: (userData: User) => void;
  reloadUserProfile: () => Promise<any>;
}

/**
 * Creates and exports the authentication store
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      /**
       * Updates user data directly in the state
       */
      updateUser: (userData: User) => {
        set({ user: userData });
      },

      /**
       * Reloads user profile from Supabase
       */
      reloadUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current session
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData.session) {
            throw new Error('Not authenticated');
          }
          
          // Fetch latest profile data
          console.log('[AUTH] Fetching fresh profile data from Supabase');
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (profileError) throw profileError;
          
          console.log('[AUTH] Fresh profile data:', profileData);
          
          // Update the state with fresh data
          set(state => ({
            user: {
              id: sessionData.session!.user.id,
              email: sessionData.session!.user.email || '',
              username: profileData.username || '',
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url,
              website: profileData.website,
              timezone: profileData.timezone,
              language: profileData.language || 'en',
              phone: profileData.phone,
              company: profileData.company,
              position: profileData.position,
              bio: profileData.bio,
              topics: profileData.topics || [],
              socialNetworks: profileData.social_networks || [],
              signup_source: profileData.signup_source
            }
          }));
          
          return profileData;
        } catch (error) {
          console.error('[AUTH] Error reloading profile:', error);
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Authenticates a user with their email and password
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('[AUTH] Attempting login with:', { email });
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          console.log('[AUTH] Login response:', { data, error });
          
          // If there's an error, throw it
          if (error) throw error;
          
          // Only proceed if we have a valid user
          if (!data.user) throw new Error('Login failed: No user returned');
          
          // Fetch user profile from profiles table
          console.log('[AUTH] Fetching profile for user:', data.user.id);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          console.log('[AUTH] Profile fetch response:', { profileData, profileError });
            
          if (profileError) throw profileError;
          
          console.log('[AUTH] Setting user state with profile data');
          
          set({
            user: {
              id: data.user.id,
              email: data.user.email || '',
              username: profileData.username || '',
              full_name: profileData.full_name || '',
              avatar_url: profileData.avatar_url,
              website: profileData.website,
              timezone: profileData.timezone,
              language: profileData.language || 'en',
              phone: profileData.phone,
              company: profileData.company,
              position: profileData.position,
              bio: profileData.bio,
              topics: profileData.topics || [],
              socialNetworks: profileData.social_networks || [],
              signup_source: profileData.signup_source
            },
          });
          
          return true; // Explicitly return success
        } catch (error) {
          console.error('[AUTH] Login error:', error);
          set({ error: (error as Error).message, user: null });
          return false; // Explicitly return failure
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Signs in with a third-party provider
       */
      signInWithProvider: async (provider: 'google' | 'linkedin' | 'github') => {
        set({ isLoading: true, error: null });
        try {
          console.log(`[AUTH] Starting ${provider} sign-in flow`);
          
          let redirectURL = 'flutterpass://auth/callback';
          
          if (Platform.OS === 'web') {
            redirectURL = window.location.origin + '/auth/callback';
          }
          
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider as any,
            options: {
              redirectTo: redirectURL,
              queryParams: {
                signup_source: 'mobile_app'
              }
            }
          });
          
          if (error) throw error;
          
          if (!data?.url) {
            throw new Error(`No ${provider} authorization URL returned`);
          }
          
          console.log(`[AUTH] Opening ${provider} auth URL:`, data.url);
          
          // Open the URL in a browser
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectURL);
          
          if (result.type === 'success') {
            console.log(`[AUTH] ${provider} auth successful, reloading user data`);
            // The auth session callback should have handled setting the session
            // Just need to load the profile
            await get().reloadUserProfile();
          } else {
            console.log(`[AUTH] ${provider} auth cancelled or failed:`, result.type);
            throw new Error(`${provider} authentication ${result.type}`);
          }
        } catch (error) {
          console.error(`[AUTH] ${provider} sign-in error:`, error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Logs out the current user
       */
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('[AUTH] Attempting logout');
          
          const { error } = await supabase.auth.signOut();
          
          console.log('[AUTH] Logout response:', { error });
          
          if (error) throw error;
          
          console.log('[AUTH] Clearing user state');
          set({ user: null });
        } catch (error) {
          console.error('[AUTH] Logout error:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Signs up a new user
       */
      signup: async (
        email: string, 
        password: string, 
        username: string,
        origin: SignupOrigin = 'mobile_app',
        referrer?: string
      ) => {
        set({ isLoading: true, error: null });
        try {
          console.log('[AUTH] Attempting signup with:', { 
            email, 
            username, 
            origin,
            referrer: referrer || 'direct'
          });
          
          // Prepare user metadata
          const metadata = {
            username,
            signup_source: origin,
            referrer: referrer || 'direct',
            signup_platform: Platform.OS,
            device_type: Platform.OS
          };
          
          // Sign up with custom metadata
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: metadata
            }
          });
          
          console.log('[AUTH] Signup response:', { data, error });
          
          if (error) throw error;
          
          // The profile should be created automatically via the trigger
          // We can update additional profile data
          if (data.user) {
            console.log('[AUTH] Updating profile for:', data.user.id);
            
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                username,
                full_name: username,
                signup_source: origin,
                created_at: new Date().toISOString()
              })
              .eq('id', data.user.id);
            
            console.log('[AUTH] Profile update response:', { updateError });
              
            if (updateError) throw updateError;
          }
          
          // We'll let the login flow handle fetching the profile data
          // User will need to confirm email first if that's enabled
        } catch (error) {
          console.error('[AUTH] Signup error:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Updates the user's profile information
       */
      updateProfile: async (updates: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const userId = useAuthStore.getState().user?.id;
          console.log('[AUTH] Updating profile for user:', userId);
          console.log('[AUTH] Profile updates:', updates);
          
          if (!userId) throw new Error('User not authenticated');
          
          // First update local state immediately to make the UI responsive
          set(state => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }));
          
          // Format the updates to match the database schema
          const dbUpdates: any = {
            username: updates.username,
            full_name: updates.full_name,
            avatar_url: updates.avatar_url,
            website: updates.website,
            timezone: updates.timezone,
            language: updates.language,
            phone: updates.phone,
            company: updates.company,
            position: updates.position,
            bio: updates.bio,
            topics: updates.topics,
            social_networks: updates.socialNetworks,
            signup_source: updates.signup_source
          };
          
          // Only include defined fields
          Object.keys(dbUpdates).forEach(key => {
            if (dbUpdates[key] === undefined) {
              delete dbUpdates[key];
            }
          });
          
          console.log('[AUTH] Formatted updates for DB:', dbUpdates);
          
          const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId);
            
          console.log('[AUTH] Profile update response:', { error });
            
          if (error) {
            // If remote update fails, we should revert the local state
            console.error('[AUTH] Remote update failed, reverting local state');
            throw error;
          }
          
          console.log('[AUTH] Profile successfully updated in both local state and remote DB');
        } catch (error) {
          console.error('[AUTH] Profile update error:', error);
          set({ error: (error as Error).message });
          
          // Try to reload the profile to ensure local state matches remote
          try {
            await useAuthStore.getState().reloadUserProfile();
          } catch (reloadError) {
            console.error('[AUTH] Failed to reload profile after error:', reloadError);
          }
          
          throw error;
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