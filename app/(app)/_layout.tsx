import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Chrome as Home, User, Telescope, Newspaper, Search, Menu, TicketCheck } from 'lucide-react-native';
import SearchDialog from '@/components/SearchDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { usePathname } from 'expo-router';

type DrawerParamList = {
  '(drawer)': undefined;
};

export default function AppLayout() {
  const [searchVisible, setSearchVisible] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isMainLandingPage = pathname === '/(app)' || pathname === '/(app)/index';

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: {
            height: 56 + insets.top,
          },
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: 'Inter-SemiBold',
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                const parent = navigation.getParent();
                if (parent) {
                  parent.dispatch(DrawerActions.toggleDrawer());
                }
              }}
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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
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
});