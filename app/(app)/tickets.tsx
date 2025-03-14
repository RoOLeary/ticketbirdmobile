import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Calendar, QrCode, Clock, Tag, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Ticket {
  id: string;
  eventName: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: number;
  status: 'upcoming' | 'past' | 'cancelled';
  ticketCode: string;
  category: string;
  tags: string[];
}

const TICKETS: Ticket[] = [
  {
    id: '1',
    eventName: 'Tech Conference 2025',
    description: 'Join the biggest tech conference of the year featuring industry leaders and innovative workshops.',
    date: '2025-03-15',
    time: '09:00 AM',
    location: 'Convention Center, New York',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    price: 299,
    status: 'upcoming',
    ticketCode: 'TECH2025-001',
    category: 'Technology',
    tags: ['conference', 'networking', 'tech']
  },
  {
    id: '2',
    eventName: 'Design Systems Workshop',
    description: 'Learn how to create and maintain scalable design systems for your organization.',
    date: '2025-04-20',
    time: '10:00 AM',
    location: 'Design Hub, San Francisco',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    price: 149,
    status: 'upcoming',
    ticketCode: 'DSW2025-002',
    category: 'Design',
    tags: ['design', 'workshop', 'systems']
  },
  {
    id: '3',
    eventName: 'AI Summit 2024',
    description: 'Past event showcasing the latest in artificial intelligence and machine learning.',
    date: '2024-12-10',
    time: '09:30 AM',
    location: 'Tech Center, Seattle',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    price: 199,
    status: 'past',
    ticketCode: 'AI2024-003',
    category: 'Technology',
    tags: ['ai', 'technology', 'conference']
  }
];

const CATEGORIES = [
  { id: '1', name: 'All Tickets' },
  { id: '2', name: 'Upcoming' },
  { id: '3', name: 'Past' },
  { id: '4', name: 'Cancelled' },
];

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const router = useRouter();
  
  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'upcoming':
        return '#2ecc71';
      case 'past':
        return '#95a5a6';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#666';
    }
  };

  return (
    <Animated.View 
      entering={FadeInDown.duration(400)} 
      style={styles.card}
    >
      <Image source={{ uri: ticket.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </Text>
          <Text style={styles.ticketCode}>{ticket.ticketCode}</Text>
        </View>

        <Text style={styles.eventName}>{ticket.eventName}</Text>
        <Text style={styles.description} numberOfLines={2}>{ticket.description}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#666" />
            <Text style={styles.detailText}>
              {new Date(ticket.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Clock size={16} color="#666" />
            <Text style={styles.detailText}>{ticket.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <Tag size={16} color="#666" />
            <Text style={styles.detailText}>{ticket.category}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => router.push(`/ticket/${ticket.id}`)}
        >
          <Text style={styles.viewButtonText}>View Ticket</Text>
          <ChevronRight size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tickets');

  const filteredTickets = TICKETS.filter(ticket => {
    const matchesSearch = 
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All Tickets' ||
      (selectedCategory === 'Upcoming' && ticket.status === 'upcoming') ||
      (selectedCategory === 'Past' && ticket.status === 'past') ||
      (selectedCategory === 'Cancelled' && ticket.status === 'cancelled');

    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your tickets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoriesContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  ticketCode: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  eventName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginRight: 4,
  },
});