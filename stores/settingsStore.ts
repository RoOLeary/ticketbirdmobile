/**
 * Device Settings Store
 * 
 * This store manages device-specific settings and preferences that don't need
 * to sync with the server. These settings are stored locally using AsyncStorage
 * and persist across app restarts, but remain specific to this device.
 * 
 * Unlike the auth store, which handles server-synced data, this store is for
 * preferences that:
 * - Are specific to how the app behaves on this device
 * - Don't need to sync across different devices
 * - Should work offline
 * - Need to be instantly available without network requests
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Device-specific settings that don't need to sync with the server
 */
export interface Settings {
  // Visual preferences
  darkMode: boolean;     // Whether to use dark theme
  fontSize: 'small' | 'medium' | 'large';  // Text size preference
  
  // Localization
  language: string;      // Preferred language code (e.g., 'en', 'es')
  
  // Device behavior
  hapticFeedback: boolean;  // Whether to use haptic feedback
  autoPlayVideos: boolean;  // Auto-play videos in feed
  saveDataMode: boolean;    // Reduce data usage (lower quality images, no auto-play)

  // User preferences
  enableNotifications: boolean;  // Whether to receive push notifications
  enablePublicProfile: boolean;  // Whether profile is visible to public
  enable2FA: boolean;           // Whether two-factor authentication is enabled
}

/**
 * Settings store interface defining available actions
 */
interface SettingsStore {
  // Current settings state
  settings: Settings;
  
  // Update specific settings while preserving others
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Reset all settings to their defaults
  resetSettings: () => void;
}

/**
 * Default settings used for new installations and resets
 */
const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  language: 'en',
  fontSize: 'medium',
  hapticFeedback: true,
  autoPlayVideos: true,
  saveDataMode: false,
  enableNotifications: true,
  enablePublicProfile: false,
  enable2FA: false,
};

/**
 * Creates and exports the settings store with persistence
 * Uses Zustand's persist middleware to automatically save to AsyncStorage
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      
      // Update only the specified settings
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      // Reset all settings to defaults
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'settings-storage',  // Storage key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 