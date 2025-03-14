import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Twitter, Linkedin, Globe } from 'lucide-react-native';

type Speaker = {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  image: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
};

const SPEAKERS: Speaker[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechCorp',
    bio: 'Sarah is a technology leader with over 15 years of experience...',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    twitter: '@sarahchen',
    linkedin: 'sarahchen',
    website: 'sarah.tech'
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'AI Research Lead',
    company: 'AI Labs',
    bio: 'Dr. Wilson leads groundbreaking research in artificial intelligence...',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    twitter: '@drwilson',
    linkedin: 'jameswilson'
  },
  // ... more speakers
];

export default function Speakers() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {SPEAKERS.map((speaker) => (
          <View key={speaker.id} style={styles.speakerCard}>
            <Image source={{ uri: speaker.image }} style={styles.speakerImage} />
            <View style={styles.speakerInfo}>
              <Text style={styles.speakerName}>{speaker.name}</Text>
              <Text style={styles.speakerRole}>{speaker.role}</Text>
              <Text style={styles.speakerCompany}>{speaker.company}</Text>
              <Text style={styles.speakerBio} numberOfLines={3}>
                {speaker.bio}
              </Text>
              
              <View style={styles.socialLinks}>
                {speaker.twitter && (
                  <TouchableOpacity style={styles.socialButton}>
                    <Twitter size={16} color="#1DA1F2" />
                  </TouchableOpacity>
                )}
                {speaker.linkedin && (
                  <TouchableOpacity style={styles.socialButton}>
                    <Linkedin size={16} color="#0A66C2" />
                  </TouchableOpacity>
                )}
                {speaker.website && (
                  <TouchableOpacity style={styles.socialButton}>
                    <Globe size={16} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid: {
    padding: 16,
  },
  speakerCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  speakerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  speakerRole: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  speakerCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  speakerBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 