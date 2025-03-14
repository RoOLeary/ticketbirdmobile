import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Users, Plus, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  company: string;
  logo: string;
};

type MeetingsData = {
  upcoming: Meeting[];
  past: Meeting[];
};

type FilterType = 'upcoming' | 'past';

export default function Meetings() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('upcoming');

  // Dummy meetings data - would be fetched based on event ID
  const meetings: MeetingsData = {
    upcoming: [
      {
        id: '1',
        title: 'Product Demo',
        date: 'March 15, 2025',
        time: '11:30 AM - 12:30 PM',
        location: 'Booth #42',
        attendees: ['Jane Smith', 'John Doe', 'You'],
        company: 'TechCorp',
        logo: 'https://picsum.photos/100',
      },
      {
        id: '2',
        title: 'Networking Coffee',
        date: 'March 15, 2025',
        time: '3:00 PM - 3:30 PM',
        location: 'Café Area',
        attendees: ['Michael Rodriguez', 'You', '3 others'],
        company: 'StartupX',
        logo: 'https://picsum.photos/101',
      },
    ],
    past: [
      {
        id: '3',
        title: 'Pre-event Briefing',
        date: 'March 14, 2025',
        time: '4:00 PM - 4:30 PM',
        location: 'Virtual',
        attendees: ['Event Team', 'You', '12 others'],
        company: 'TechConf Inc.',
        logo: 'https://picsum.photos/102',
      },
    ],
  };

  const renderMeeting = (meeting: Meeting) => (
    <TouchableOpacity key={meeting.id} style={styles.meetingCard}>
      <View style={styles.meetingHeader}>
        <Image 
          source={{ uri: meeting.logo }}
          style={styles.companyLogo}
        />
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingTitle}>{meeting.title}</Text>
          <Text style={styles.companyName}>{meeting.company}</Text>
        </View>
        <ChevronRight size={20} color="#ccc" />
      </View>
      
      <View style={styles.meetingDetails}>
        <View style={styles.meetingDetailItem}>
          <Calendar size={16} color="#666" />
          <Text style={styles.meetingDetailText}>{meeting.date}</Text>
        </View>
        
        <View style={styles.meetingDetailItem}>
          <Clock size={16} color="#666" />
          <Text style={styles.meetingDetailText}>{meeting.time}</Text>
        </View>
        
        <View style={styles.meetingDetailItem}>
          <MapPin size={16} color="#666" />
          <Text style={styles.meetingDetailText}>{meeting.location}</Text>
        </View>
        
        <View style={styles.meetingDetailItem}>
          <Users size={16} color="#666" />
          <Text style={styles.meetingDetailText}>{meeting.attendees.join(', ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedFilter === 'upcoming' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[styles.filterText, selectedFilter === 'upcoming' && styles.filterTextActive]}>Upcoming</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, selectedFilter === 'past' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('past')}
        >
          <Text style={[styles.filterText, selectedFilter === 'past' && styles.filterTextActive]}>Past</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.meetingsContainer}>
        {meetings[selectedFilter].length > 0 ? (
          meetings[selectedFilter].map(renderMeeting)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No {selectedFilter} meetings found</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  meetingsContainer: {
    flex: 1,
    padding: 16,
  },
  meetingCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  companyLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  meetingDetails: {
    padding: 16,
  },
  meetingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  meetingDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
}); 