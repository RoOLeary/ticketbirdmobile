import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Linking } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
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
  | '/login';

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
        {user?.displayName && (
          <Text style={styles.userEmail}>{user.displayName}</Text>
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