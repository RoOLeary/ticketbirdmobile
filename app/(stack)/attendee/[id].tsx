import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Mail, Briefcase, MapPin, Share2, MessageCircle, ChevronLeft, User, Calendar, Clock, Users, Link, Phone, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AttendeeProfile() {
  const { id, eventId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isConnected, setIsConnected] = useState(false);

  // In a real app, you would fetch the attendee data based on the ID
  const attendee = {
    id,
    name: 'Alex Johnson',
    role: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with expertise in React Native and mobile development. Currently working on innovative solutions at TechCorp.',
    image: 'https://picsum.photos/id/1/200',
    connections: 3,
    interests: [
      'Mobile Development',
      'React Native',
      'UI/UX Design',
      'Open Source',
      'AI'
    ],
    events: [
      {
        id: '1',
        title: 'Tech Conference 2025',
        date: 'March 15, 2025',
        location: 'Convention Center'
      },
      {
        id: '2',
        title: 'React Native Meetup',
        date: 'April 5, 2025',
        location: 'TechHub'
      }
    ],
    contact: {
      email: 'alex.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'linkedin.com/in/alexjohnson',
      website: 'alexjohnson.dev'
    },
    mutualConnections: [
      {
        id: '1',
        name: 'Sarah Lee',
        role: 'Product Manager',
        image: 'https://picsum.photos/id/2/100'
      },
      {
        id: '2',
        name: 'David Chen',
        role: 'UX Designer',
        image: 'https://picsum.photos/id/3/100'
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        role: 'CTO',
        image: 'https://picsum.photos/id/4/100'
      }
    ]
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    // In a real app, you would save this connection status
  };

  const handleMessage = () => {
    Alert.alert('Message', `Send a message to ${attendee.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK' }
    ]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container]}>
      <Stack.Screen 
        options={{
          headerShown: false
        }}
      />
      
      <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.favoriteButton} onPress={handleConnect}>
          <Heart 
            size={24} 
            color="#FF3B30"
            fill={isConnected ? "#FF3B30" : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.scrollContainer, { marginTop: 56 + insets.top }]}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: attendee.image }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{attendee.name}</Text>
            <Text style={styles.role}>{attendee.role} at {attendee.company}</Text>
            <Text style={styles.location}>{attendee.location}</Text>
            
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionText}>
                {attendee.connections} mutual connections
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[
                  styles.connectButton, 
                  isConnected && styles.connectedButton
                ]}
                onPress={handleConnect}
              >
                <Text style={[
                  styles.connectButtonText,
                  isConnected && styles.connectedButtonText
                ]}>
                  {isConnected ? 'Connected' : 'Connect'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessage}
              >
                <MessageCircle size={20} color="#007AFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{attendee.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tagsContainer}>
            {attendee.interests.map((interest, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attending Events</Text>
          {attendee.events.map((event, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.eventItem}
              onPress={() => {
                router.push({
                  pathname: "/(stack)/event-landing/[id]",
                  params: { id: event.id }
                });
              }}
            >
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                <View style={styles.eventDetail}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                
                <View style={styles.eventDetail}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mutual Connections</Text>
          {attendee.mutualConnections.map((connection, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.connectionItem}
              onPress={() => {
                router.push({
                  pathname: "/(stack)/attendee/[id]",
                  params: { id: connection.id, eventId }
                });
              }}
            >
              <Image 
                source={{ uri: connection.image }}
                style={styles.connectionImage}
              />
              <View style={styles.connectionDetails}>
                <Text style={styles.connectionName}>{connection.name}</Text>
                <Text style={styles.connectionRole}>{connection.role}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <TouchableOpacity style={styles.contactItem}>
            <Mail size={20} color="#007AFF" />
            <Text style={styles.contactText}>{attendee.contact.email}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Phone size={20} color="#007AFF" />
            <Text style={styles.contactText}>{attendee.contact.phone}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Link size={20} color="#007AFF" />
            <Text style={styles.contactText}>{attendee.contact.linkedin}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Globe size={20} color="#007AFF" />
            <Text style={styles.contactText}>{attendee.contact.website}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const Globe = ({ size, color }: { size: number, color: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Link size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  connectionInfo: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  connectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
  },
  connectedButton: {
    backgroundColor: '#007AFF',
    borderWidth: 0,
  },
  connectButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  connectedButtonText: {
    color: '#fff',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  eventItem: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  connectionDetails: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  connectionRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
}); 