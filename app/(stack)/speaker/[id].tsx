import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, MapPin, ExternalLink, Share2, Heart, ChevronLeft, Mail, Linkedin, Twitter, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SpeakerProfile() {
  const { id, eventId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFavorite, setIsFavorite] = React.useState(false);

  // In a real app, you would fetch the speaker data based on the ID
  const speaker = {
    id,
    name: 'Dr. Sarah Chen',
    role: 'AI Research Director',
    company: 'TechCorp',
    bio: 'Dr. Sarah Chen is a leading expert in artificial intelligence and machine learning with over 15 years of experience in the field. She has published numerous papers on deep learning algorithms and their applications in healthcare and finance. Prior to joining TechCorp, she was a research scientist at MIT and led AI initiatives at several Fortune 500 companies.',
    image: 'https://picsum.photos/200',
    sessions: [
      'Keynote: Future of Tech', 
      'Workshop: AI Development'
    ],
    contact: {
      email: 'sarah.chen@techcorp.com',
      linkedin: 'sarahchen',
      twitter: '@drsarahchen',
      website: 'www.sarahchen.com'
    },
    expertise: [
      'Artificial Intelligence',
      'Machine Learning',
      'Neural Networks',
      'Data Science',
      'Research Leadership'
    ],
    publications: [
      {
        title: 'Advances in Neural Network Architecture for Medical Imaging',
        year: '2023',
        journal: 'Journal of AI in Medicine'
      },
      {
        title: 'Ethical Considerations in AI Development',
        year: '2022',
        journal: 'Tech Ethics Review'
      }
    ]
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to the user's preferences
  };

  const handleBack = () => {
    if (eventId) {
      // Navigate back to the event landing page
      router.push({
        pathname: "/event-landing/[id]",
        params: { id: eventId as string }
      });
    } else {
      // Regular back navigation if no eventId
      router.back();
    }
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
        
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Heart 
            size={24} 
            color="#FF3B30"
            fill={isFavorite ? "#FF3B30" : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.scrollContainer, { marginTop: 56 + insets.top }]}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: speaker.image }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{speaker.name}</Text>
            <Text style={styles.role}>{speaker.role} at {speaker.company}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{speaker.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speaking Sessions</Text>
          {speaker.sessions.map((session, index) => (
            <View key={index} style={styles.sessionItem}>
              <Calendar size={16} color="#007AFF" />
              <Text style={styles.sessionText}>{session}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Areas of Expertise</Text>
          <View style={styles.tagsContainer}>
            {speaker.expertise.map((item, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publications</Text>
          {speaker.publications.map((pub, index) => (
            <View key={index} style={styles.publicationItem}>
              <Text style={styles.publicationTitle}>{pub.title}</Text>
              <Text style={styles.publicationDetails}>{pub.journal}, {pub.year}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          
          <TouchableOpacity style={styles.contactItem}>
            <Mail size={20} color="#007AFF" />
            <Text style={styles.contactText}>{speaker.contact.email}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Linkedin size={20} color="#007AFF" />
            <Text style={styles.contactText}>{speaker.contact.linkedin}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Twitter size={20} color="#007AFF" />
            <Text style={styles.contactText}>{speaker.contact.twitter}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem}>
            <Globe size={20} color="#007AFF" />
            <Text style={styles.contactText}>{speaker.contact.website}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={24} color="#007AFF" />
            <Text style={styles.actionText}>Share Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <ExternalLink size={24} color="#007AFF" />
            <Text style={styles.actionText}>View Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
    marginTop: 56,
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
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sessionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
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
  publicationItem: {
    marginBottom: 12,
  },
  publicationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 4,
  },
  publicationDetails: {
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