import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Calendar, Chrome as Home, Heart, LogOut, CircleHelp as HelpCircle } from 'lucide-react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const CustomDrawerContent = ({ navigation }: DrawerContentComponentProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop' }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Ticketbird</Text>
      </View>
      
      <View style={styles.drawerContent}>
        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigation.navigate('(app)')}
        >
          <Home size={24} color="#666" />
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigation.navigate('events')}
        >
          <Calendar size={24} color="#666" />
          <Text style={styles.drawerItemText}>My Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.drawerItem} 
          onPress={() => navigation.navigate('favorites')}
        >
          <Heart size={24} color="#666" />
          <Text style={styles.drawerItemText}>My Favorites</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {
            navigation.closeDrawer();
          }}
        >
          <HelpCircle size={20} color="#666" />
          <Text style={styles.footerButtonText}>Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {
            handleLogout();
            navigation.closeDrawer();
          }}
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
        headerShown: true,
        headerTitle: '',
        drawerStyle: {
          backgroundColor: '#fff',
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="(app)" 
        options={{ 
          headerShown: false,
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen 
        name="events" 
        options={{ 
          drawerLabel: 'My Events',
          drawerIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="favorites" 
        options={{ 
          drawerLabel: 'Favorites',
          drawerIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Drawer.Screen 
        name="events/[id]" 
        options={{
          headerShown: true,
          headerTitle: 'Event Details',
          swipeEnabled: false 
        }}
      />
      <Drawer.Screen 
        name="user/[id]" 
        options={{ 
          headerShown: true,
          headerTitle: 'Profile',
          swipeEnabled: false 
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  logoContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  drawerItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
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
  },
  logoutText: {
    color: '#FF3B30',
  },
}); 