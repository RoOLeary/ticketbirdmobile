import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, Chrome as Home, Heart, LogOut, CircleHelp as HelpCircle } from 'lucide-react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type NavigationPaths = '/' | '/events' | '/favorites';

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const router = useRouter();
  const currentPath = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigation.dispatch(DrawerActions.closeDrawer());
    router.replace('/login');
  };

  const navigateAndClose = (path: NavigationPaths) => {
    navigation.dispatch(DrawerActions.closeDrawer());
    router.push(path);
  };

  const isRouteActive = (route: string) => {
    return currentPath.startsWith(route);
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop' }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Ticketbird</Text>
        {user?.displayName && (
          <Text style={styles.userEmail}>{user.displayName}</Text>
        )}
      </View>
      
      <View style={styles.drawerContent}>
        <AnimatedTouchableOpacity 
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.drawerItem,
            isRouteActive('/(app)') && styles.activeDrawerItem
          ]} 
          onPress={() => navigateAndClose('/')}
        >
          <Home size={24} color={isRouteActive('/(app)') ? "#007AFF" : "#666"} />
          <Text style={[
            styles.drawerItemText,
            isRouteActive('/(app)') && styles.activeDrawerItemText
          ]}>Home</Text>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity 
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.drawerItem,
            isRouteActive('/events') && styles.activeDrawerItem
          ]} 
          onPress={() => navigateAndClose('/events')}
        >
          <Calendar size={24} color={isRouteActive('/events') ? "#007AFF" : "#666"} />
          <Text style={[
            styles.drawerItemText,
            isRouteActive('/events') && styles.activeDrawerItemText
          ]}>My Events</Text>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity 
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            styles.drawerItem,
            isRouteActive('/favorites') && styles.activeDrawerItem
          ]} 
          onPress={() => navigateAndClose('/favorites')}
        >
          <Heart size={24} color={isRouteActive('/favorites') ? "#007AFF" : "#666"} />
          <Text style={[
            styles.drawerItemText,
            isRouteActive('/favorites') && styles.activeDrawerItemText
          ]}>My Favorites</Text>
        </AnimatedTouchableOpacity>
      </View>
      
      <View style={styles.drawerFooter}>
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

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ 
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 300,
        },
        drawerType: Platform.OS === 'ios' ? 'slide' : 'front',
        overlayColor: 'rgba(0,0,0,0.5)',
        swipeEnabled: true,
        swipeEdgeWidth: Platform.OS === 'ios' ? 30 : 50,
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
    </Drawer>
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
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  activeDrawerItem: {
    backgroundColor: '#F0F8FF',
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  activeDrawerItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  drawerFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  footerButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#FF3B30',
  },
}); 