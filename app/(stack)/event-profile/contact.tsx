import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail, Phone, Globe, MapPin, MessageCircle, Share2, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Dummy contact data - would be fetched based on event ID
  const contactInfo = {
    organizerName: 'TechConf Inc.',
    email: 'info@techconf2025.com',
    phone: '+1 (555) 123-4567',
    website: 'www.techconf2025.com',
    address: '123 Convention Center Way, Tech City, TC 12345',
    logo: 'https://picsum.photos/200',
    contactPerson: 'Jane Smith',
    contactPersonRole: 'Event Coordinator',
    contactPersonImage: 'https://picsum.photos/100',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: contactInfo.logo }}
          style={styles.logo}
        />
        <Text style={styles.organizerName}>{contactInfo.organizerName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Person</Text>
        <View style={styles.contactPerson}>
          <Image 
            source={{ uri: contactInfo.contactPersonImage }}
            style={styles.contactPersonImage}
          />
          <View style={styles.contactPersonInfo}>
            <Text style={styles.contactPersonName}>{contactInfo.contactPerson}</Text>
            <Text style={styles.contactPersonRole}>{contactInfo.contactPersonRole}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <TouchableOpacity style={styles.contactItem}>
          <Mail size={20} color="#007AFF" />
          <Text style={styles.contactText}>{contactInfo.email}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem}>
          <Phone size={20} color="#007AFF" />
          <Text style={styles.contactText}>{contactInfo.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem}>
          <Globe size={20} color="#007AFF" />
          <Text style={styles.contactText}>{contactInfo.website}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.contactItem}>
          <MapPin size={20} color="#007AFF" />
          <Text style={styles.contactText}>{contactInfo.address}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={24} color="#007AFF" />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={24} color="#007AFF" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  organizerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  contactPerson: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPersonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  contactPersonInfo: {
    flex: 1,
  },
  contactPersonName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  contactPersonRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
}); 