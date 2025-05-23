import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Switch, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuthStore, type AuthStore, type User } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePaymentsStore, type PaymentMethod } from '@/stores/paymentsStore';
import { Camera, Moon, Mail, Github, Instagram, Linkedin, AtSign, CreditCard, Plus, Trash2, Bell, Globe, Lock, QrCode } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { supabase } from '@/lib/supabase';

const TOPICS = [
  'Technology', 'Design', 'Business', 'Science',
  'Health', 'Sports', 'Music', 'Art', 'Travel',
  'Food', 'Fashion', 'Photography'
];

interface SocialLink {
  id: string;
  name: string;
  icon: React.ReactNode;
  username: string;
  connected: boolean;
}

export default function Profile() {
  const router = useRouter();
  const { user, updateProfile, logout, reloadUserProfile } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();
  const { paymentMethods, isLoadingPayments, paymentsError, deletePaymentMethod, setDefaultPaymentMethod } = usePaymentsStore();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [company, setCompany] = useState(user?.company || '');
  const [position, setPosition] = useState(user?.position || '');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(user?.topics || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: 'bluesky', name: 'Bluesky', icon: <AtSign size={24} color="#1DA1F2" />, username: '', connected: false },
    { id: 'instagram', name: 'Instagram', icon: <Instagram size={24} color="#E4405F" />, username: '', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} color="#0A66C2" />, username: '', connected: false },
    { id: 'github', name: 'GitHub', icon: <Github size={24} color="#333" />, username: '', connected: false }
  ]);
  const [hasChanges, setHasChanges] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [isPaymentMethodModalVisible, setIsPaymentMethodModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  console.log("RENDER - socialLinks:", socialLinks);
  console.log("RENDER - user?.socialNetworks:", user?.socialNetworks);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBio(user.bio || '');
      setCompany(user.company || '');
      setPosition(user.position || '');
      
      // Default social links to ensure they always appear
      const defaultSocialLinks: SocialLink[] = [
        { id: 'bluesky', name: 'Bluesky', icon: <AtSign size={24} color="#1DA1F2" />, username: '', connected: false },
        { id: 'instagram', name: 'Instagram', icon: <Instagram size={24} color="#E4405F" />, username: '', connected: false },
        { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={24} color="#0A66C2" />, username: '', connected: false },
        { id: 'github', name: 'GitHub', icon: <Github size={24} color="#333" />, username: '', connected: false }
      ];
      
      // If user has social networks, use them to update defaults
      if (user.socialNetworks && user.socialNetworks.length > 0) {
        const updatedSocialLinks = defaultSocialLinks.map(defaultLink => {
          // Find matching network from user data
          const userNetwork = user.socialNetworks.find(network => network.id === defaultLink.id);
          if (userNetwork) {
            return {
              ...defaultLink,
              username: userNetwork.username || '',
              connected: userNetwork.connected || false
            };
          }
          return defaultLink;
        });
        setSocialLinks(updatedSocialLinks);
      } else {
        // Use defaults if no social networks exist
        setSocialLinks(defaultSocialLinks);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("USER CHANGED - user:", user);
    console.log("USER CHANGED - socialNetworks:", user?.socialNetworks);
    
    const hasSocialNetworksChanged = JSON.stringify(socialLinks.map(({ id, username, connected }) => ({ id, username, connected }))) !==
      JSON.stringify(user?.socialNetworks || []);
    
    const hasNameChanged = fullName !== user?.full_name;
    const hasBioChanged = bio !== user?.bio;
    const hasTopicsChanged = JSON.stringify(selectedTopics) !== JSON.stringify(user?.topics);
    const hasCompanyChanged = company !== user?.company;
    const hasPositionChanged = position !== user?.position;
    
    setHasChanges(
      hasNameChanged || 
      hasBioChanged || 
      hasTopicsChanged || 
      hasSocialNetworksChanged ||
      hasCompanyChanged ||
      hasPositionChanged
    );
  }, [fullName, bio, selectedTopics, socialLinks, user, company, position]);

  const handleSave = async () => {
    try {
      console.log("Saving social links:", socialLinks);
      
      await updateProfile({
        full_name: fullName,
        bio,
        topics: selectedTopics,
        socialNetworks: socialLinks.map(({ id, username, connected }) => ({
          id,
          username,
          connected,
        })),
        company,
        position
      });
      
      // Confirm the changes were saved
      console.log("Profile updated, changes saved");
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Error', 'Failed to save profile changes');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleUsernameChange = (id: string, value: string) => {
    setSocialLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, username: value } : link
      )
    );
  };

  const handleToggleConnection = (id: string) => {
    console.log("Toggle connection for:", id);
    setSocialLinks(prev => {
      const updated = prev.map(link =>
        link.id === id ? { ...link, connected: !link.connected } : link
      );
      console.log("Updated social links:", updated);
      return updated;
    });
  };

  const handleAddPaymentMethod = () => {
    setSelectedPaymentMethod(undefined);
    setIsPaymentMethodModalVisible(true);
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setIsPaymentMethodModalVisible(true);
  };

  const handleClosePaymentMethodModal = () => {
    setIsPaymentMethodModalVisible(false);
    setSelectedPaymentMethod(undefined);
  };

  const handleDeletePaymentMethod = async (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to delete this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePaymentMethod(id),
        },
      ]
    );
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setDefaultPaymentMethod(id);
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity 
      key={method.id} 
      style={styles.paymentMethod}
      onPress={() => handleEditPaymentMethod(method)}
    >
      <View style={styles.paymentMethodIcon}>
        {method.type === 'card' ? (
          <CreditCard size={24} color="#007AFF" />
        ) : method.type === 'paypal' ? (
          <Image 
            source={{ uri: 'https://www.paypalobjects.com/webstatic/icon/pp258.png' }}
            style={styles.paypalIcon}
          />
        ) : method.type === 'mollie' ? (
          <Image 
            source={{ uri: 'https://www.mollie.com/images/favicon/favicon-96x96.png' }}
            style={styles.paypalIcon}
          />
        ) : (
          <Image 
            source={{ uri: 'https://www.ideal.nl/img/ideal-logo.png' }}
            style={styles.paypalIcon}
          />
        )}
      </View>
      <View style={styles.paymentMethodInfo}>
        <Text style={styles.paymentMethodLabel}>
          {method.label}
          {method.last_four && ` •••• ${method.last_four}`}
        </Text>
        {method.expiry_date && (
          <Text style={styles.paymentMethodExpiry}>Expires {method.expiry_date}</Text>
        )}
      </View>
      <View style={styles.paymentMethodActions}>
        {!method.is_default && (
          <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => handleSetDefaultPaymentMethod(method.id)}
          >
            <Text style={styles.defaultButtonText}>Make Default</Text>
          </TouchableOpacity>
        )}
        {method.is_default && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePaymentMethod(method.id)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const initializeProfile = async () => {
    if (!user) return;
    
    try {
      // Check if social_networks is empty
      const { data } = await supabase
        .from('profiles')
        .select('social_networks')
        .eq('id', user.id)
        .single();
        
      // If empty or null, initialize with defaults
      if (!data.social_networks || (Array.isArray(data.social_networks) && data.social_networks.length === 0)) {
        const defaultNetworks = [
          { id: 'bluesky', username: '', connected: false },
          { id: 'instagram', username: '', connected: false },
          { id: 'linkedin', username: '', connected: false },
          { id: 'github', username: '', connected: false }
        ];
        
        await supabase
          .from('profiles')
          .update({ social_networks: defaultNetworks })
          .eq('id', user.id);
          
        // Update local state
        const updatedUser = {...user, socialNetworks: defaultNetworks};
        // Update your auth store with the new user object
      }
    } catch (error) {
      console.error("Error initializing profile:", error);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      initializeProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    // Fetch fresh data from Supabase when the profile screen mounts
    const fetchFreshProfileData = async () => {
      try {
        setIsLoading(true);
        await useAuthStore.getState().reloadUserProfile();
      } catch (error) {
        console.error('Error loading fresh profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreshProfileData();
  }, []); // Empty dependency array means this runs once when component mounts

  useEffect(() => {
    if (user) {
      console.log('Current user data source check:');
      console.log('- Local user object:', user);
      
      // Check what's in the database
      const checkDatabase = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          console.log('- Database profile:', data);
          console.log('- Bio comparison:', {
            'local': user.bio,
            'database': data?.bio,
            'matches': user.bio === data?.bio
          });
        } catch (error) {
          console.error('Error checking database:', error);
        }
      };
      
      checkDatabase();
    }
  }, [user]);

  // Add onRefresh callback
  const onRefresh = useCallback(async () => {
    console.log('[PROFILE] Pull-to-refresh triggered');
    setRefreshing(true);
    
    try {
      // Get current user ID
      const userId = user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Fetch fresh profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      console.log('[PROFILE] Fresh profile data received');
      
      // Update auth store with fresh data
      useAuthStore.getState().updateUser({
        ...user!,
        full_name: profileData.full_name,
        bio: profileData.bio,
        company: profileData.company,
        position: profileData.position,
        topics: profileData.topics || [],
        socialNetworks: profileData.social_networks || [],
        avatar_url: profileData.avatar_url,
      });
      
      // Update local component state
      setFullName(profileData.full_name || '');
      setBio(profileData.bio || '');
      setCompany(profileData.company || '');
      setPosition(profileData.position || '');
      setSelectedTopics(profileData.topics || []);
      
      // Update social links
      if (profileData.social_networks && profileData.social_networks.length > 0) {
        const updatedSocialLinks = socialLinks.map(link => {
          const networkData = profileData.social_networks.find(n => n.id === link.id);
          if (networkData) {
            return {
              ...link,
              username: networkData.username || '',
              connected: networkData.connected || false,
            };
          }
          return link;
        });
        setSocialLinks(updatedSocialLinks);
      }
      
      console.log('[PROFILE] Profile refreshed successfully');
      Alert.alert('Profile Updated', 'Profile data has been refreshed.');
    } catch (error) {
      console.error('[PROFILE] Error refreshing profile:', error);
      Alert.alert('Refresh Failed', 'Could not refresh profile data.');
    } finally {
      setRefreshing(false);
    }
  }, [user?.id]);
  
  // Update existing effect for initial profile load
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setLoadingProfile(true);
      try {
        // Fetch latest profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Update auth store
        useAuthStore.getState().updateUser({
          ...user,
          full_name: data.full_name,
          bio: data.bio,
          company: data.company,
          position: data.position,
          topics: data.topics || [],
          socialNetworks: data.social_networks || [],
          avatar_url: data.avatar_url,
        });
      } catch (error) {
        console.error('[PROFILE] Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    loadProfileData();
  }, []);

  return (
    <View style={[styles.container]}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#fff'
          },
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: 'Inter-SemiBold',
          },
          // Add a loading indicator in the header when refreshing
          headerRight: () => loadingProfile ? (
            <ActivityIndicator color="#007AFF" style={{ marginRight: 15 }} />
          ) : null
        }}
      />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor={'#007AFF'}
            title={'Refreshing profile...'}  // iOS only
            titleColor={'#007AFF'}           // iOS only
            progressBackgroundColor={'#ffffff'}
            progressViewOffset={20}
          />
        }
      >
        {/* Show loading overlay when first loading */}
        {loadingProfile && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        )}
        
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: user?.avatar_url || 'https://via.placeholder.com/150' }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.avatarOverlay}>
                  <Camera size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.emailContainer}>
                <Mail size={20} color="#666" style={styles.emailIcon} />
                <Text style={styles.emailText}>{user?.email}</Text>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Info</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company</Text>
              <TextInput
                style={styles.input}
                value={company}
                onChangeText={setCompany}
                placeholder="Enter your company"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Position</Text>
              <TextInput
                style={styles.input}
                value={position}
                onChangeText={setPosition}
                placeholder="Enter your position"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={[styles.scanButton, styles.contactButton]}
                onPress={() => router.push('/(modals)/scan' as any)}
              >
                <Camera size={24} color="#007AFF" />
                <Text style={styles.scanButtonText}>Scan Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.scanButton, styles.contactButton]}
                onPress={() => router.push('/(modals)/mycode' as any)}
              >
                <QrCode size={24} color="#007AFF" />
                <Text style={styles.scanButtonText}>My Code</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <View style={styles.topicsGrid}>
              {TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[
                    styles.topicButton,
                    selectedTopics.includes(topic) && styles.topicButtonSelected
                  ]}
                  onPress={() => toggleTopic(topic)}
                >
                  <Text style={[
                    styles.topicText,
                    selectedTopics.includes(topic) && styles.topicTextSelected
                  ]}>
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Networks</Text>
            <Text style={styles.sectionDescription}>
              Connect your social media accounts to share your events and activities
            </Text>
            
            
            
            {/* Original links mapping */}
            {socialLinks.map(link => (
              <View key={link.id} style={styles.socialLink}>
                <View style={styles.socialLinkHeader}>
                  <View style={styles.socialLinkInfo}>
                    {link.icon}
                    <Text style={styles.socialLinkName}>{link.name}</Text>
                  </View>
                  <Switch
                    value={link.connected}
                    onValueChange={() => handleToggleConnection(link.id)}
                    trackColor={{ false: '#ddd', true: '#34C759' }}
                  />
                </View>

                {link.connected && (
                  <View style={styles.usernameInput}>
                    <TextInput
                      placeholder={`Enter your ${link.name} username`}
                      value={link.username}
                      onChangeText={(value) => handleUsernameChange(link.id, value)}
                      style={styles.input}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                )}
              </View>
            ))}
            
            
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.paymentMethods}>
              {isLoadingPayments ? (
                <ActivityIndicator size="large" color="#007AFF" />
              ) : paymentsError ? (
                <Text style={styles.errorText}>{paymentsError}</Text>
              ) : (
                <>
                  {paymentMethods.map(renderPaymentMethod)}
                  <TouchableOpacity 
                    style={styles.addPaymentMethod}
                    onPress={handleAddPaymentMethod}
                  >
                    <Plus size={24} color="#007AFF" />
                    <Text style={styles.addPaymentMethodText}>Add Payment Method</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Moon size={20} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch to dark theme</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSettings({ darkMode: value })}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Bell size={20} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Enable Notifications</Text>
                <Text style={styles.settingDescription}>Receive push notifications</Text>
              </View>
              <Switch
                value={settings.enableNotifications}
                onValueChange={(value) => updateSettings({ enableNotifications: value })}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Globe size={20} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Public Profile</Text>
                <Text style={styles.settingDescription}>Make your profile visible to others</Text>
              </View>
              <Switch
                value={settings.enablePublicProfile}
                onValueChange={(value) => updateSettings({ enablePublicProfile: value })}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Lock size={20} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Enable 2FA for enhanced security</Text>
              </View>
              <Switch
                value={settings.enable2FA}
                onValueChange={(value) => {
                  if (value) {
                    // TODO: Implement 2FA setup flow
                    Alert.alert(
                      'Set Up 2FA',
                      'Would you like to set up two-factor authentication now?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                          onPress: () => updateSettings({ enable2FA: false }),
                        },
                        {
                          text: 'Set Up',
                          style: 'default',
                          onPress: () => {
                            // TODO: Navigate to 2FA setup screen
                            updateSettings({ enable2FA: true });
                          },
                        },
                      ]
                    );
                  } else {
                    Alert.alert(
                      'Disable 2FA',
                      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Disable',
                          style: 'destructive',
                          onPress: () => updateSettings({ enable2FA: false }),
                        },
                      ]
                    );
                  }
                }}
                trackColor={{ false: '#ddd', true: '#007AFF' }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
                  {hasChanges ? 'Save Changes' : 'No Changes to Save'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <PaymentMethodModal
        visible={isPaymentMethodModalVisible}
        onClose={handleClosePaymentMethodModal}
        existingMethod={selectedPaymentMethod}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  contactsSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  topicButtonSelected: {
    backgroundColor: '#007AFF',
  },
  topicText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  topicTextSelected: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  emailIcon: {
    marginRight: 12,
  },
  emailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  socialLink: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  socialLinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialLinkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialLinkName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1a1a1a',
  },
  usernameInput: {
    marginTop: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E5EA',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  saveButtonTextDisabled: {
    color: '#8E8E93',
  },
  paymentMethods: {
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paypalIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  paymentMethodExpiry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  defaultBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  addPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addPaymentMethodText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  defaultButton: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'Inter-Regular',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  myCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
});
