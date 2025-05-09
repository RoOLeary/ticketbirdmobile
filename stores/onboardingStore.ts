import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  selectedInterests: string[];
  isLoading: boolean;
  error: string | null;
  
  setCompletedOnboarding: (completed: boolean) => void;
  setSelectedInterests: (interests: string[]) => void;
  saveInterests: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      selectedInterests: [],
      isLoading: false,
      error: null,
      
      setCompletedOnboarding: (completed) => {
        set({ hasCompletedOnboarding: completed });
      },
      
      setSelectedInterests: (interests) => {
        set({ selectedInterests: interests });
      },
      
      saveInterests: async () => {
        const user = useAuthStore.getState().user;
        
        console.log('[ONBOARDING] Saving interests:', {
          userId: user?.id,
          interests: get().selectedInterests
        });
        
        if (!user) {
          console.error('[ONBOARDING] Error: User not authenticated');
          set({ error: 'User not authenticated' });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Update user profile in Supabase
          console.log('[ONBOARDING] Updating topics in Supabase');
          
          const { error } = await supabase
            .from('profiles')
            .update({ topics: get().selectedInterests })
            .eq('id', user.id);
          
          console.log('[ONBOARDING] Topics update response:', { error });
            
          if (error) throw error;
          
          console.log('[ONBOARDING] Updating local user state');
          
          // Update local user state
          useAuthStore.setState({
            user: {
              ...user,
              topics: get().selectedInterests
            }
          });
          
          console.log('[ONBOARDING] Setting onboarding as completed');
          set({ hasCompletedOnboarding: true });
        } catch (error) {
          console.error('[ONBOARDING] Save interests error:', error);
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);