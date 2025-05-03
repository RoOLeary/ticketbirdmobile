import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet, View, Platform, Text } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Home, User, Telescope, Newspaper, Search, Menu, TicketCheck } from 'lucide-react-native';
import SearchDialog from '@/app/components/SearchDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostHogProvider } from 'posthog-react-native';
import { TicketbirdLogo } from '@/app/components/TicketbirdLogo';

export function MyApp() {
    return (
        <PostHogProvider apiKey="phc_F9jRNr97mnaco40w0Dm7Bm5Cob0Kpkh4LfvnWBoXsQ5" options={{
            host: "https://eu.i.posthog.com",
            
        }}>
            <RestOfApp />
        </PostHogProvider>
    )
}

const HeaderTitle = () => (
  <View style={styles.headerTitle}>
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <TicketbirdLogo size={22} color="#000" />
      <Text style={styles.headerText}>Ticketbird</Text>
    </View>
  </View>
);

export default function AppLayout() {
  const [searchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: {
            height: 56 + insets.top,
          },
          headerTitle: route.name === 'index' ? () => <HeaderTitle /> : undefined,
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: 'Inter-SemiBold',
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <Menu size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setSearchVisible(true)}
            >
              <Search size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            height: 56 + insets.bottom,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Inter-Medium',
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#666',
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: () => <HeaderTitle />,
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            headerTitle: 'Explore Events',
            tabBarIcon: ({ color, size }) => <Telescope size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: 'My Tickets',
            headerTitle: 'My Tickets',
            tabBarIcon: ({ color, size }) => <TicketCheck size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Feed',
            headerTitle: 'My Feed',
            tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerTitle: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <SearchDialog visible={searchVisible} onClose={() => setSearchVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
});