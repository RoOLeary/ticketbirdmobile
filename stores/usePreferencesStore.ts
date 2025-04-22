import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// State and actions for managing app-wide preferences
interface PreferencesState {
  darkMode: boolean;              // Toggle for dark/light theme
  hasCompletedOnboarding: boolean;  // Track if user has completed onboarding
  setDarkMode: (enabled: boolean) => void;  // Action to update theme preference
  setHasCompletedOnboarding: (completed: boolean) => void;  // Action to update onboarding status
  resetOnboarding: () => void;    // Action to reset onboarding state
}

// Create preferences store with persistence to AsyncStorage
export const usePreferencesStore = create<PreferencesState>((set) => ({
  darkMode: false,  // Default to light theme
  hasCompletedOnboarding: false,  // Default to not completed
  
  // Update dark mode setting and persist to storage
  setDarkMode: async (enabled) => {
    set({ darkMode: enabled });
    await AsyncStorage.setItem('darkMode', JSON.stringify(enabled));
  },

  // Update onboarding status and persist to storage
  setHasCompletedOnboarding: async (completed) => {
    set({ hasCompletedOnboarding: completed });
    await AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(completed));
  },

  // Reset onboarding state to trigger onboarding flow again
  resetOnboarding: async () => {
    set({ hasCompletedOnboarding: false });
    await AsyncStorage.setItem('hasCompletedOnboarding', JSON.stringify(false));
  },
}));

// Load saved preferences from storage on app initialization
Promise.all([
  AsyncStorage.getItem('darkMode'),
  AsyncStorage.getItem('hasCompletedOnboarding')
]).then(([darkMode, hasCompletedOnboarding]) => {
  const updates: Partial<PreferencesState> = {};
  
  if (darkMode !== null) {
    updates.darkMode = JSON.parse(darkMode);
  }
  
  if (hasCompletedOnboarding !== null) {
    updates.hasCompletedOnboarding = JSON.parse(hasCompletedOnboarding);
  }
  
  if (Object.keys(updates).length > 0) {
    usePreferencesStore.setState(updates);
  }
}); 