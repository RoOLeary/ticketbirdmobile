import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Home, Calendar, Ticket, Heart, User as Profile, LogOut, CircleHelp as HelpCircle } from 'lucide-react-native';
import { AuthProvider } from '@/lib/auth';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostHogProvider } from 'posthog-react-native';
import NetInfo from '@react-native-community/netinfo';
import useOfflineQueueStore from '@/stores/offlineQueueStore';
import { TicketbirdLogo } from './components/TicketbirdLogo';

type AppRoute = 
  | '/'
  | '/events'
  | '/tickets'
  | '/settings'
  | '/support'
  | '/login'
  | '/signup'
  | '/onboarding'
  | '/profile';

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigation.closeDrawer();
    router.replace('/login');
  };

  const navigateAndClose = (path: string) => {
    navigation.closeDrawer();
    router.push(path as any);
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop' }}
          style={styles.logo}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TicketbirdLogo size={24} color="#000" />
          <Text style={styles.logoText}>FlutterPass</Text>
        </View>
        <TouchableOpacity 
          onPress={() => Linking.openURL('https://busylittlepixels.com')}
        >
          <Text style={styles.creditText}>by busylittlepixels</Text>
        </TouchableOpacity>
        {user?.full_name && (
          <Text style={styles.userEmail}>{user.full_name}</Text>
        )}
      </View>
      
      <View style={styles.drawerContent}>
        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateAndClose('/')}
        >
          <Home size={24} color="#666" />
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateAndClose('/events')}
        >
          <Calendar size={24} color="#666" />
          <Text style={styles.drawerItemText}>My Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateAndClose('/tickets')}
        >
          <Ticket size={24} color="#666" />
          <Text style={styles.drawerItemText}>My Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateAndClose('/favorites')}
        >
          <Heart size={24} color="#666" />
          <Text style={styles.drawerItemText}>My Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigateAndClose('/profile')}
        >
          <Profile size={24} color="#666" />
          <Text style={styles.drawerItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigateAndClose('/support')}
        >
          <HelpCircle size={20} color="#666" />
          <Text style={styles.footerButtonText}>Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={[styles.footerButtonText, styles.logoutText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function RootLayoutNav() {
  const { user } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavigation, setLastNavigation] = useState<{
    timestamp: number;
    destination: string;
  } | null>(null);

  useEffect(() => {
    // Don't attempt navigation if the navigation state isn't ready
    // or if we're already in the middle of a navigation
    if (!navigationState?.key || isNavigating) {
      console.log('[NAVIGATION] Skipping navigation:', {
        reason: !navigationState?.key ? 'navigation state not ready' : 'already navigating',
        isNavigating,
        navigationKey: navigationState?.key
      });
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    const currentPath = segments.join('/');
    
    console.log('[NAVIGATION] Evaluating navigation:', { 
      user: !!user, 
      userId: user?.id,
      hasCompletedOnboarding,
      currentSegment: segments[0],
      currentPath,
      inAuthGroup,
      inAppGroup,
      lastNavigation: lastNavigation ? 
        `${lastNavigation.destination} (${Date.now() - lastNavigation.timestamp}ms ago)` : 'none'
    });

    const handleNavigation = async () => {
      // Set navigating flag to prevent multiple navigation attempts
      setIsNavigating(true);
      let destination = '';
      
      try {
        if (!user) {
          // If not logged in, redirect to login unless already in auth group
          if (!inAuthGroup) {
            destination = '/login';
            console.log('[NAVIGATION] Redirecting to login (no user)');
            await router.replace('/login' as any);
          }
        } else if (user && !hasCompletedOnboarding) {
          // If logged in but hasn't completed onboarding
          destination = '/onboarding';
          console.log('[NAVIGATION] Redirecting to onboarding');
          await router.replace('/onboarding' as any);
        } else if (user && hasCompletedOnboarding && inAuthGroup) {
          // If logged in and completed onboarding but still in auth group
          destination = '/profile';
          console.log('[NAVIGATION] Redirecting to profile (auth complete)');
          await router.replace('/profile' as any);
        }
        
        if (destination) {
          setLastNavigation({
            timestamp: Date.now(),
            destination
          });
        }
      } catch (error) {
        console.error('[NAVIGATION] Navigation error:', error);
      } finally {
        // Reset navigating flag after navigation completes or fails
        // with a slightly longer delay to ensure router has time to settle
        setTimeout(() => {
          console.log('[NAVIGATION] Resetting navigation flag');
          setIsNavigating(false);
        }, 500);
      }
    };
    
    // Use setTimeout to ensure we're not blocking the main thread
    // and to allow previous navigations to complete
    const timeoutId = setTimeout(handleNavigation, 200);
    
    // Clean up timeout if component unmounts or dependencies change
    return () => clearTimeout(timeoutId);
  }, [user, hasCompletedOnboarding, segments, navigationState?.key, isNavigating, lastNavigation]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(auth)/onboarding" />
      <Stack.Screen name="(app)/profile" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offlineQueue = useOfflineQueueStore.getState();
      const isConnected = state.isConnected && state.isInternetReachable;
      
      console.log('Network Status:', {
        isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
        details: state.details
      });
      
      offlineQueue.setOnlineStatus(!!isConnected);
      
      if (isConnected) {
        // Process queued operations when coming back online
        offlineQueue.processQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <PostHogProvider apiKey="phc_F9jRNr97mnaco40w0Dm7Bm5Cob0Kpkh4LfvnWBoXsQ5" options={{
      host: "https://eu.i.posthog.com",
    }}>
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Drawer
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: '#fff',
              width: 300,
            }
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen 
            name="(app)"
            options={{
              headerShown: false,
              swipeEnabled: true,
            }}
          />
          <Drawer.Screen 
            name="(auth)" 
            options={{
              headerShown: false,
              swipeEnabled: false,
            }}
          />
        </Drawer>
      </SafeAreaProvider>
    </AuthProvider>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 47 : 0,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  footerButtonText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  logoutText: {
    color: '#FF3B30',
  },
  creditText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});