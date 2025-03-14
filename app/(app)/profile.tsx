import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Camera, Bell, Globe, Lock, Moon, Share2, CreditCard, Plus, Mail } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  label: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Visa',
    lastFour: '4242',
    expiryDate: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    label: 'Mastercard',
    lastFour: '8888',
    expiryDate: '09/24',
    isDefault: false,
  },
  {
    id: '3',
    type: 'paypal',
    label: 'PayPal',
    isDefault: false,
  },
];

const TOPICS = [
  'Technology', 'Design', 'Business', 'Science',
  'Health', 'Sports', 'Music', 'Art', 'Travel',
  'Food', 'Fashion', 'Photography'
];

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateDisplayName = useAuthStore((state) => state.updateDisplayName);
  const updatePreferences = useAuthStore((state) => state.updatePreferences);
  const updateTopics = useAuthStore((state) => state.updateTopics);

  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode || false);
  const [notifications, setNotifications] = useState(user?.preferences?.notifications || true);
  const [emailUpdates, setEmailUpdates] = useState(user?.preferences?.emailUpdates || true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(user?.topics || []);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasNameChanged = name !== user?.displayName;
    const hasTopicsChanged = JSON.stringify(selectedTopics) !== JSON.stringify(user?.topics);
    const hasPreferencesChanged = 
      darkMode !== user?.preferences?.darkMode ||
      notifications !== user?.preferences?.notifications ||
      emailUpdates !== user?.preferences?.emailUpdates;
    
    setHasChanges(hasNameChanged || hasTopicsChanged || hasPreferencesChanged);
  }, [name, selectedTopics, darkMode, notifications, emailUpdates, user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleSave = () => {
    if (name !== user?.displayName) {
      updateDisplayName(name);
    }

    updatePreferences({
      darkMode,
      notifications,
      emailUpdates,
    });

    updateTopics(selectedTopics);
    setHasChanges(false);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity key={method.id} style={styles.paymentMethod}>
      <View style={styles.paymentMethodIcon}>
        {method.type === 'card' ? (
          <CreditCard size={24} color="#007AFF" />
        ) : (
          <Image 
            source={{ uri: 'https://www.paypalobjects.com/webstatic/icon/pp258.png' }}
            style={styles.paypalIcon}
          />
        )}
      </View>
      <View style={styles.paymentMethodInfo}>
        <Text style={styles.paymentMethodLabel}>
          {method.label}
          {method.lastFour && ` •••• ${method.lastFour}`}
        </Text>
        {method.expiryDate && (
          <Text style={styles.paymentMethodExpiry}>Expires {method.expiryDate}</Text>
        )}
      </View>
      {method.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://ronan-oleary.com/assets/ro-bw.d434f415.png' }}
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
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your display name"
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
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            {PAYMENT_METHODS.map(renderPaymentMethod)}
            <TouchableOpacity style={styles.addPaymentMethod}>
              <Plus size={24} color="#007AFF" />
              <Text style={styles.addPaymentMethodText}>Add Payment Method</Text>
            </TouchableOpacity>
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
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Bell size={20} color="#007AFF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive push notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Globe size={20} color="#007AFF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Email Updates</Text>
              <Text style={styles.settingDescription}>Receive email newsletters</Text>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Lock size={20} color="#007AFF" />
            <Text style={styles.menuText}>Privacy Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Share2 size={20} color="#007AFF" />
            <Text style={styles.menuText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
              {hasChanges ? 'Save Changes' : 'No Changes to Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
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
  email: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  saveButtonTextDisabled: {
    color: '#fff8',
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
});