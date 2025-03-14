import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { MapPin, Calendar, Clock, TicketCheck, Users, Info, ArrowRight } from 'lucide-react-native';

// This would come from your API/database in a real app
const DUMMY_TICKET = {
  id: '1',
  event: {
    title: 'Tech Conference 2024',
    date: 'March 20, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center, San Francisco',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    description: 'Join us for the biggest tech conference of the year! Featuring keynote speakers from leading tech companies, hands-on workshops, networking opportunities, and the latest in technology innovations.',
    organizer: 'Tech Events Inc.',
    capacity: '2,500 attendees',
  },
  ticketType: 'VIP Pass',
  ticketNumber: 'TKT-2024-001',
  price: '€1299',
  perks: [
    'Priority seating',
    'Access to VIP lounge',
    'Exclusive networking session',
    'Conference swag bag'
  ]
};

export default function TicketDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const ticket = DUMMY_TICKET; // In real app, fetch ticket by id

  const handleEventHubPress = () => {
    router.push(`/event-landing/${id}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: ticket.event.image }} 
          style={styles.eventImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <Text style={styles.description}>{ticket.event.description}</Text>
        </View>

        <View style={styles.ticketInfo}>
          <View style={styles.row}>
            <Calendar size={20} color="#666" />
            <Text style={styles.detailText}>{ticket.event.date}</Text>
          </View>
          <View style={styles.row}>
            <Clock size={20} color="#666" />
            <Text style={styles.detailText}>{ticket.event.time}</Text>
          </View>
          <View style={styles.row}>
            <MapPin size={20} color="#666" />
            <Text style={styles.detailText}>{ticket.event.location}</Text>
          </View>
          <View style={styles.row}>
            <Users size={20} color="#666" />
            <Text style={styles.detailText}>{ticket.event.capacity}</Text>
          </View>
          <View style={styles.row}>
            <Info size={20} color="#666" />
            <Text style={styles.detailText}>Organized by {ticket.event.organizer}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Ticket</Text>
          <View style={styles.ticketTypeContainer}>
            <TicketCheck size={24} color="#007AFF" />
            <View style={styles.ticketTypeInfo}>
              <Text style={styles.ticketType}>{ticket.ticketType}</Text>
              <Text style={styles.price}>{ticket.price}</Text>
            </View>
          </View>
          
          <View style={styles.perksContainer}>
            <Text style={styles.perksTitle}>Ticket Perks:</Text>
            {ticket.perks.map((perk, index) => (
              <View key={index} style={styles.perkRow}>
                <View style={styles.perkBullet} />
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={`TICKET-${ticket.id}-${ticket.ticketNumber}`}
            size={200}
            backgroundColor="white"
          />
          <Text style={styles.ticketNumber}>#{ticket.ticketNumber}</Text>
          <Text style={styles.qrHint}>Show this QR code at the event entrance</Text>

          <TouchableOpacity style={styles.eventHubButton} onPress={handleEventHubPress}>
            <Text style={styles.eventHubButtonText}>Take me to the event</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  ticketInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  ticketTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
  },
  ticketTypeInfo: {
    flex: 1,
  },
  ticketType: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  perksContainer: {
    gap: 12,
    marginTop: 16,
  },
  perksTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  perkText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketNumber: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  qrHint: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
  },
  eventHubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  eventHubButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 