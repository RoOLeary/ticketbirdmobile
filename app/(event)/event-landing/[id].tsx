import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Pressable, TextInput, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, Users, MessageCircle, Share2, Bell, CalendarCheck, ChevronRight, AlertCircle, Heart, ChevronLeft, X, ExternalLink, Bookmark, Star, UserCircle, Search, Filter, Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Speaker Detail Modal Component
const SpeakerDetailModal = ({ visible, speaker, onClose }: { visible: boolean, speaker: any, onClose: () => void }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Speaker Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Image 
            source={{ uri: speaker?.image }}
            style={styles.speakerDetailImage}
          />
          
          <View style={styles.modalContentPadded}>
            <Text style={styles.speakerDetailName}>{speaker?.name}</Text>
            <Text style={styles.speakerDetailRole}>{speaker?.role} at {speaker?.company}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.speakerDetailBio}>{speaker?.bio}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Speaking Sessions</Text>
            {speaker?.sessions.map((session: string, index: number) => (
              <View key={index} style={styles.sessionItem}>
                <Calendar size={16} color="#007AFF" />
                <Text style={styles.sessionItemText}>{session}</Text>
              </View>
            ))}
            
            <View style={styles.divider} />
            
            <View style={styles.speakerActions}>
              <TouchableOpacity style={styles.speakerActionButton}>
                <ExternalLink size={20} color="#007AFF" />
                <Text style={styles.speakerActionText}>View Website</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.speakerActionButton}>
                <Share2 size={20} color="#007AFF" />
                <Text style={styles.speakerActionText}>Share Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Talk Detail Modal Component
const TalkDetailModal = ({ visible, talk, onClose }: { visible: boolean, talk: any, onClose: () => void }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Session Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalContentPadded}>
            <View style={styles.talkDetailHeader}>
              <Text style={styles.talkDetailTitle}>{talk?.title}</Text>
              <View style={styles.talkDetailTime}>
                <Clock size={16} color="#666" />
                <Text style={styles.talkDetailTimeText}>{talk?.time}</Text>
              </View>
            </View>
            
            <View style={styles.talkDetailLocation}>
              <MapPin size={16} color="#666" />
              <Text style={styles.talkDetailLocationText}>{talk?.location}</Text>
            </View>
            
            {talk?.speaker && (
              <View style={styles.talkDetailSpeaker}>
                <Text style={styles.sectionTitle}>Speaker</Text>
                <Text style={styles.talkDetailSpeakerName}>{talk?.speaker}</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.talkDetailDescription}>
              {talk?.description || "Join us for this exciting session where we'll explore cutting-edge technologies and industry best practices. This session is designed for all experience levels and will provide valuable insights for your professional development."}
            </Text>
            
            <View style={styles.divider} />
            
            <View style={styles.talkActions}>
              <TouchableOpacity style={styles.talkActionButton}>
                <Bookmark size={20} color="#007AFF" />
                <Text style={styles.talkActionText}>Add to My Schedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.talkActionButton}>
                <Star size={20} color="#007AFF" />
                <Text style={styles.talkActionText}>Rate Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Search Modal Component
const SearchModal = ({ 
  visible, 
  searchType, 
  searchQuery, 
  setSearchQuery, 
  onClose,
  filteredSpeakers,
  filteredAttendees,
  filteredCompanies,
  renderSpeaker,
  renderAttendee,
  renderCompany,
  navigateToSpeakerProfile,
  navigateToAttendeeProfile,
  navigateToCompanyProfile
}: { 
  visible: boolean, 
  searchType: 'speakers' | 'attendees' | 'companies', 
  searchQuery: string, 
  setSearchQuery: (query: string) => void, 
  onClose: () => void,
  filteredSpeakers: any[],
  filteredAttendees: any[],
  filteredCompanies: any[],
  renderSpeaker: (speaker: any) => React.ReactNode,
  renderAttendee: (attendee: any) => React.ReactNode,
  renderCompany: (company: any) => React.ReactNode,
  navigateToSpeakerProfile: (speaker: any) => void,
  navigateToAttendeeProfile: (attendee: any) => void,
  navigateToCompanyProfile: (company: any) => void
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.searchModalTitle}>
            Search {searchType === 'speakers' ? 'Speakers' : searchType === 'attendees' ? 'Attendees' : 'Companies'}
          </Text>
        </View>
        
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${searchType === 'speakers' ? 'speakers' : searchType === 'attendees' ? 'attendees' : 'companies'}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            clearButtonMode="while-editing"
          />
        </View>
        
        <ScrollView style={styles.searchResultsContainer}>
          <View style={styles.modalContentPadded}>
            {searchType === 'speakers' ? (
              filteredSpeakers.length > 0 ? (
                filteredSpeakers.map(speaker => (
                  <TouchableOpacity 
                    key={speaker.id} 
                    style={styles.searchResultItem}
                    onPress={() => navigateToSpeakerProfile(speaker)}
                  >
                    {renderSpeaker(speaker)}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No speakers found</Text>
              )
            ) : searchType === 'attendees' ? (
              filteredAttendees.length > 0 ? (
                filteredAttendees.map(attendee => (
                  <TouchableOpacity 
                    key={attendee.id} 
                    style={styles.searchResultItem}
                    onPress={() => navigateToAttendeeProfile(attendee)}
                  >
                    {renderAttendee(attendee)}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No attendees found</Text>
              )
            ) : (
              filteredCompanies.length > 0 ? (
                filteredCompanies.map(company => (
                  <TouchableOpacity 
                    key={company.id} 
                    style={styles.searchResultItem}
                    onPress={() => navigateToCompanyProfile(company)}
                  >
                    {renderCompany(company)}
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>No companies found</Text>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Add ImageCarousel component before the EventLanding component
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const pageNum = Math.floor(contentOffset.x / viewSize);
    setCurrentIndex(pageNum);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * Dimensions.get('window').width,
      animated: true
    });
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>
      
      <View style={styles.carouselPagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.carouselDot,
              currentIndex === index && styles.carouselDotActive
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

// Add these type definitions before the EventLanding component

interface Stage {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  speaker?: string;
  description?: string;
}

interface DaySchedule {
  [key: string]: ScheduleItem[];
}

interface EventSchedule {
  [key: number]: DaySchedule;
}

interface Event {
  id: string | string[];
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  images: string[];
  stages: Stage[];
  scheduleByDay: EventSchedule;
  speakers: any[]; // Add proper type if needed
  attendeesList: any[]; // Add proper type if needed
  announcements: any[]; // Add proper type if needed
  sideEvents: any[]; // Add proper type if needed
  networkingEvents: any[]; // Add proper type if needed
  companies: any[]; // Add proper type if needed
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginLeft: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  heroContainer: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    opacity: 0.95,
  },
  heroTitleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  heroInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  heroInfoColumn: {
    flex: 1,
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  heroProfileButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    backdropFilter: 'blur(10px)',
  },
  heroInfoText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoHeader: {
    position: 'relative',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  scheduleContainer: {
    position: 'relative',
    paddingTop: 8,
  },
  timeline: {
    position: 'absolute',
    left: 72,
    top: 24,
    bottom: 24,
    width: 2,
    backgroundColor: '#eee',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  scheduleTime: {
    width: 72,
    alignItems: 'center',
    position: 'relative',
  },
  scheduleTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  timelineDot: {
    position: 'absolute',
    right: -5,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  scheduleSpeaker: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  scheduleLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  announcementsContainer: {
    gap: 16,
  },
  announcement: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  announcementPriority: {
    width: 4,
  },
  announcementContent: {
    flex: 1,
    padding: 16,
  },
  announcementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  announcementMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginBottom: 8,
  },
  announcementTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  tabsScroll: {
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  speakersContainer: {
    paddingTop: 16,
  },
  speakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  speakerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    color: '#333',
  },
  speakerRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  speakerCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  speakerBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  speakerSessionsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  speakerSession: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
  sideEventsContainer: {
    gap: 16,
  },
  sideEventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sideEventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  sideEventContent: {
    padding: 16,
  },
  sideEventTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  sideEventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sideEventInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  sideEventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
    marginTop: 8,
  },
  networkingEventsContainer: {
    gap: 16,
  },
  networkingEventCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 16,
  },
  networkingEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  networkingEventTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  networkingEventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkingEventAttendeesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
    marginLeft: 4,
  },
  networkingEventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkingEventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  networkingEventInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  networkingEventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  networkingEventLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  networkingEventDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    flex: 1,
  },
  searchModalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  modalContentPadded: {
    padding: 16,
  },
  speakerDetailImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  speakerDetailName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    color: '#333',
  },
  speakerDetailRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  speakerDetailBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
  },
  speakerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  speakerActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  speakerActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sessionItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  talkDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  talkDetailTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 16,
  },
  talkDetailTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  talkDetailTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  talkDetailLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  talkDetailLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  talkDetailSpeaker: {
    marginTop: 16,
  },
  talkDetailSpeakerName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  talkDetailDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 20,
  },
  talkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  talkActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  talkActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  attendeesContainer: {
    paddingHorizontal: 16,
  },
  attendeesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  attendeesCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  attendeesActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchButton: {
    padding: 8,
  },
  filterAttendees: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 16,
  },
  filterAttendeesText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attendeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    color: '#333',
  },
  attendeeRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  attendeeCompanyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  attendeeCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  connectionBadge: {
    backgroundColor: '#E6F2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  connectionCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#007AFF',
  },
  connectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 16,
  },
  connectedButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    borderWidth: 0,
  },
  connectButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  connectedButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  searchResultsContainer: {
    flex: 1,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    padding: 16,
  },
  searchResultItem: {
    padding: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    gap: 16,
  },
  paginationButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    borderColor: '#ccc',
  },
  paginationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  dayTabs: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  dayTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  dayTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  dayTabTextActive: {
    color: '#007AFF',
  },
  carouselContainer: {
    height: 280,
    position: 'relative',
  },
  carouselImage: {
    width: Dimensions.get('window').width,
    height: 280,
    resizeMode: 'cover',
  },
  carouselPagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  carouselDotActive: {
    backgroundColor: '#fff',
    width: 24,
    borderRadius: 4,
  },
  companiesContainer: {
    padding: 16,
  },
  companyTypeTabs: {
    marginBottom: 16,
  },
  companyTypeTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  companyTypeTabActive: {
    backgroundColor: '#007AFF',
  },
  companyTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  companyTypeTextActive: {
    color: '#fff',
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  sponsorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sponsorBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  companyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  companyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  companyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  companyStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});

const EventLanding: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current as Animated.Value;
  const [selectedTab, setSelectedTab] = useState('about');
  const [favoriteSpeakers, setFavoriteSpeakers] = useState<string[]>([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null);
  const [selectedTalk, setSelectedTalk] = useState<any>(null);
  const [speakerModalVisible, setSpeakerModalVisible] = useState(false);
  const [talkModalVisible, setTalkModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'speakers' | 'attendees' | 'companies'>('attendees');
  const [filteredSpeakers, setFilteredSpeakers] = useState<any[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedStage, setSelectedStage] = useState<string>('main');
  const [showFloatingHeader, setShowFloatingHeader] = useState(true);
  const [selectedCompanyType, setSelectedCompanyType] = useState('all');
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);

  const event: Event = {
    id,
    title: 'Tech Conference 2025',
    date: 'March 15-17, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Convention Center',
    description: 'Join us for an immersive three-day conference that brings together the brightest minds in technology. From groundbreaking AI innovations to sustainable tech solutions, Tech Conference 2025 features over 40 expert-led sessions, hands-on workshops, and unique networking opportunities. \n\nWhether you\'re a seasoned professional, startup founder, or tech enthusiast, you\'ll discover the latest trends, connect with industry leaders, and gain practical insights to drive your projects forward. Highlights include quantum computing demonstrations, AI ethics panels, and exclusive startup showcases. Don\'t miss this opportunity to be part of shaping the future of technology.',
    attendees: 250,
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
    ],
    speakers: [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        role: 'AI Research Director',
        company: 'TechCorp',
        bio: 'Leading expert in artificial intelligence and machine learning.',
        image: 'https://picsum.photos/200',
        sessions: ['Keynote: Future of Tech', 'Workshop: AI Development'],
      },
      {
        id: '2',
        name: 'Michael Rodriguez',
        role: 'CTO',
        company: 'StartupX',
        bio: 'Serial entrepreneur with multiple successful tech exits.',
        image: 'https://picsum.photos/201',
        sessions: ['Panel: Startup Success Stories'],
      },
      {
        id: '3',
        name: 'Emily Watson',
        role: 'Product Lead',
        company: 'InnovateLabs',
        bio: 'Product strategy expert specializing in emerging technologies.',
        image: 'https://picsum.photos/202',
        sessions: ['Workshop: Product Innovation'],
      },
      {
        id: '4',
        name: 'Dr. James Mitchell',
        role: 'Quantum Computing Researcher',
        company: 'QuantumTech',
        bio: 'Pioneer in quantum computing applications and quantum cryptography.',
        image: 'https://picsum.photos/203',
        sessions: ['The Future of Quantum Computing', 'Quantum Security Workshop'],
      },
      {
        id: '5',
        name: 'Lisa Zhang',
        role: 'VP of Engineering',
        company: 'CloudScale',
        bio: 'Expert in cloud architecture and distributed systems.',
        image: 'https://picsum.photos/204',
        sessions: ['Building Resilient Cloud Systems', 'DevOps Best Practices'],
      },
      {
        id: '6',
        name: 'Alex Thompson',
        role: 'Cybersecurity Director',
        company: 'SecureNet',
        bio: 'Specializes in enterprise security and threat detection.',
        image: 'https://picsum.photos/205',
        sessions: ['Modern Security Threats', 'Zero Trust Architecture'],
      },
      {
        id: '7',
        name: 'Dr. Maya Patel',
        role: 'Head of ML Research',
        company: 'DataMinds',
        bio: 'Leading researcher in machine learning and neural networks.',
        image: 'https://picsum.photos/206',
        sessions: ['Deep Learning Advances', 'AI Ethics Panel'],
      },
      {
        id: '8',
        name: 'Robert Kim',
        role: 'Blockchain Architect',
        company: 'ChainWorks',
        bio: 'Expert in blockchain technology and decentralized systems.',
        image: 'https://picsum.photos/207',
        sessions: ['Web3 Architecture', 'Smart Contract Security'],
      },
      {
        id: '9',
        name: 'Sofia Martinez',
        role: 'UX Research Director',
        company: 'DesignFirst',
        bio: 'Pioneer in user experience research and inclusive design.',
        image: 'https://picsum.photos/208',
        sessions: ['Inclusive Design Practices', 'UX Research Methods'],
      },
      {
        id: '10',
        name: 'David Anderson',
        role: 'IoT Solutions Architect',
        company: 'ConnectedTech',
        bio: 'Specialist in IoT architecture and smart city solutions.',
        image: 'https://picsum.photos/209',
        sessions: ['IoT at Scale', 'Smart City Infrastructure'],
      },
      {
        id: '11',
        name: 'Rachel Foster',
        role: 'VP of Product',
        company: 'InnovateAI',
        bio: 'Product leader focused on AI-driven solutions.',
        image: 'https://picsum.photos/210',
        sessions: ['AI Product Strategy', 'Product Leadership'],
      },
      {
        id: '12',
        name: 'Thomas Wright',
        role: 'Cloud Security Expert',
        company: 'SecureCloud',
        bio: 'Specializes in cloud security and compliance.',
        image: 'https://picsum.photos/211',
        sessions: ['Cloud Security Best Practices', 'Compliance in the Cloud'],
      }
    ],
    stages: [
      { id: 'main', name: 'Main Stage' },
      { id: 'workshop', name: 'Workshop Room' },
      { id: 'breakout', name: 'Breakout Room' },
      { id: 'innovation', name: 'Innovation Lab' }
    ],
    scheduleByDay: {
      1: {
        main: [
          {
            id: '1-1',
            time: '8:30 AM',
            title: 'Registration & Breakfast',
            location: 'Main Hall',
          },
          {
            id: '1-2',
            time: '10:00 AM',
            title: 'Opening Keynote: Future of Tech',
            speaker: 'Dr. Sarah Chen',
            location: 'Main Stage',
            description: 'An inspiring look at how emerging technologies will shape our future over the next decade.'
          },
          {
            id: '1-3',
            time: '2:00 PM',
            title: 'AI in Enterprise',
            speaker: 'Dr. Maya Patel',
            location: 'Main Stage',
            description: 'Exploring practical applications of AI in enterprise environments.'
          },
          {
            id: '1-4',
            time: '4:30 PM',
            title: 'Future of Cloud Computing',
            speaker: 'Lisa Zhang',
            location: 'Main Stage',
            description: 'Latest trends and future predictions in cloud computing.'
          }
        ],
        workshop: [
          {
            id: '1-5',
            time: '11:30 AM',
            title: 'Workshop: AI Development',
            speaker: 'John Doe',
            location: 'Workshop Room',
            description: 'Hands-on workshop exploring the latest frameworks and methodologies for developing AI applications.'
          },
          {
            id: '1-6',
            time: '2:00 PM',
            title: 'Quantum Computing Workshop',
            speaker: 'Dr. James Mitchell',
            location: 'Workshop Room',
            description: 'Introduction to quantum computing principles and programming.'
          },
          {
            id: '1-7',
            time: '4:00 PM',
            title: 'DevOps Best Practices',
            speaker: 'Lisa Zhang',
            location: 'Workshop Room',
            description: 'Learn modern DevOps practices and tools.'
          }
        ],
        breakout: [
          {
            id: '1-8',
            time: '11:00 AM',
            title: 'Cybersecurity Trends',
            speaker: 'Alex Thompson',
            location: 'Breakout Room',
            description: 'Latest developments in cybersecurity.'
          },
          {
            id: '1-9',
            time: '2:00 PM',
            title: 'Panel: Startup Success Stories',
            speaker: 'Michael Rodriguez & Guests',
            location: 'Breakout Room',
            description: 'Hear from successful founders about their journeys, challenges, and lessons learned.'
          },
          {
            id: '1-10',
            time: '4:00 PM',
            title: 'Web3 Architecture',
            speaker: 'Robert Kim',
            location: 'Breakout Room',
            description: 'Deep dive into Web3 architecture patterns.'
          }
        ],
        innovation: [
          {
            id: '1-11',
            time: '10:30 AM',
            title: 'IoT Solutions Workshop',
            speaker: 'David Anderson',
            location: 'Innovation Lab',
            description: 'Hands-on IoT development workshop.'
          },
          {
            id: '1-12',
            time: '1:30 PM',
            title: 'UX Research Methods',
            speaker: 'Sofia Martinez',
            location: 'Innovation Lab',
            description: 'Modern UX research techniques and tools.'
          },
          {
            id: '1-13',
            time: '3:30 PM',
            title: 'Workshop: Cloud Architecture',
            speaker: 'Lisa Johnson',
            location: 'Innovation Lab',
            description: 'Learn best practices for designing scalable and resilient cloud architectures.'
          }
        ]
      },
      2: {
        main: [
          {
            id: '2-1',
            time: '9:00 AM',
            title: 'Day 2 Opening Remarks',
            location: 'Main Stage',
          },
          {
            id: '2-2',
            time: '10:00 AM',
            title: 'Keynote: Cybersecurity Trends',
            speaker: 'Alex Thompson',
            location: 'Main Stage',
            description: 'An in-depth look at emerging cybersecurity threats and strategies.'
          },
          {
            id: '2-3',
            time: '2:00 PM',
            title: 'The Future of Work',
            speaker: 'Rachel Foster',
            location: 'Main Stage',
            description: 'How AI and automation will transform the workplace.'
          },
          {
            id: '2-4',
            time: '4:30 PM',
            title: 'Panel: Tech Ethics',
            speaker: 'Dr. Maya Patel & Panel',
            location: 'Main Stage',
            description: 'Exploring ethical considerations in AI and technology.'
          }
        ],
        workshop: [
          {
            id: '2-5',
            time: '11:30 AM',
            title: 'Workshop: Product Innovation',
            speaker: 'Emily Watson',
            location: 'Workshop Room',
            description: 'Practical techniques for fostering innovation within product teams.'
          },
          {
            id: '2-6',
            time: '2:00 PM',
            title: 'Cloud Security Workshop',
            speaker: 'Thomas Wright',
            location: 'Workshop Room',
            description: 'Hands-on cloud security implementation.'
          },
          {
            id: '2-7',
            time: '4:00 PM',
            title: 'Mobile Development',
            speaker: 'Sofia Martinez',
            location: 'Workshop Room',
            description: 'Building modern mobile applications.'
          }
        ],
        breakout: [
          {
            id: '2-8',
            time: '11:00 AM',
            title: 'Blockchain Deep Dive',
            speaker: 'Robert Kim',
            location: 'Breakout Room',
            description: 'Technical deep dive into blockchain architecture.'
          },
          {
            id: '2-9',
            time: '2:00 PM',
            title: 'Panel: Diversity in Tech',
            speaker: 'Various Industry Leaders',
            location: 'Breakout Room',
            description: 'Creating inclusive tech workplaces.'
          },
          {
            id: '2-10',
            time: '4:00 PM',
            title: 'Startup Funding',
            speaker: 'Michael Rodriguez',
            location: 'Breakout Room',
            description: 'Navigate the startup funding landscape.'
          }
        ],
        innovation: [
          {
            id: '2-11',
            time: '10:30 AM',
            title: 'Smart City Solutions',
            speaker: 'David Anderson',
            location: 'Innovation Lab',
            description: 'IoT applications in smart cities.'
          },
          {
            id: '2-12',
            time: '1:30 PM',
            title: 'AI Product Strategy',
            speaker: 'Rachel Foster',
            location: 'Innovation Lab',
            description: 'Building successful AI-driven products.'
          },
          {
            id: '2-13',
            time: '3:30 PM',
            title: 'Future of Cloud',
            speaker: 'Lisa Zhang',
            location: 'Innovation Lab',
            description: 'Next-generation cloud architectures.'
          }
        ]
      },
      3: {
        main: [
          {
            id: '3-1',
            time: '9:00 AM',
            title: 'Final Day Opening',
            location: 'Main Stage',
          },
          {
            id: '3-2',
            time: '10:00 AM',
            title: 'Quantum Computing Future',
            speaker: 'Dr. James Mitchell',
            location: 'Main Stage',
            description: 'The impact of quantum computing on technology.'
          },
          {
            id: '3-3',
            time: '2:00 PM',
            title: 'AI in Healthcare',
            speaker: 'Dr. Maya Patel',
            location: 'Main Stage',
            description: 'AI applications in healthcare and medicine.'
          },
          {
            id: '3-4',
            time: '4:30 PM',
            title: 'Closing Keynote',
            speaker: 'Dr. Sarah Chen',
            location: 'Main Stage',
            description: 'Reflecting on the future of technology.'
          }
        ],
        workshop: [
          {
            id: '3-5',
            time: '11:30 AM',
            title: 'Workshop: Blockchain Apps',
            speaker: 'Robert Kim',
            location: 'Workshop Room',
            description: 'Building decentralized applications.'
          },
          {
            id: '3-6',
            time: '2:00 PM',
            title: 'UX Research Methods',
            speaker: 'Sofia Martinez',
            location: 'Workshop Room',
            description: 'Advanced UX research techniques.'
          },
          {
            id: '3-7',
            time: '4:00 PM',
            title: 'DevSecOps Practices',
            speaker: 'Thomas Wright',
            location: 'Workshop Room',
            description: 'Integrating security into DevOps.'
          }
        ],
        breakout: [
          {
            id: '3-8',
            time: '11:00 AM',
            title: 'Edge Computing',
            speaker: 'Lisa Zhang',
            location: 'Breakout Room',
            description: 'The future of edge computing.'
          },
          {
            id: '3-9',
            time: '2:00 PM',
            title: 'Panel: Sustainable Tech',
            speaker: 'Environmental Tech Leaders',
            location: 'Breakout Room',
            description: 'Technology\'s role in sustainability.'
          },
          {
            id: '3-10',
            time: '4:00 PM',
            title: 'Future of Work',
            speaker: 'Rachel Foster',
            location: 'Breakout Room',
            description: 'Preparing for the future workplace.'
          }
        ],
        innovation: [
          {
            id: '3-11',
            time: '10:30 AM',
            title: 'AR/VR Workshop',
            speaker: 'David Anderson',
            location: 'Innovation Lab',
            description: 'Hands-on AR/VR development.'
          },
          {
            id: '3-12',
            time: '1:30 PM',
            title: 'ML Model Deployment',
            speaker: 'Dr. Maya Patel',
            location: 'Innovation Lab',
            description: 'Production ML deployment strategies.'
          },
          {
            id: '3-13',
            time: '3:30 PM',
            title: 'Innovation Workshop',
            speaker: 'Emily Watson',
            location: 'Innovation Lab',
            description: 'Fostering innovation in teams.'
          }
        ]
      }
    },
    announcements: [
      {
        id: '1',
        title: 'Wi-Fi Information',
        message: 'Network: TechConf2024, Password: innovation2024',
        timestamp: '2 hours ago',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Parking Update',
        message: 'Additional parking available in Lot B',
        timestamp: '5 hours ago',
        priority: 'medium',
      },
    ],
    sideEvents: [
      {
        id: '1',
        title: 'Startup Showcase',
        date: 'March 14, 2025',
        time: '2:00 PM - 6:00 PM',
        location: 'Innovation Hall',
        description: 'Preview the latest innovations from emerging startups in the tech industry.',
        image: 'https://picsum.photos/300/150',
      },
      {
        id: '2',
        title: 'Tech Career Fair',
        date: 'March 16, 2025',
        time: '10:00 AM - 4:00 PM',
        location: 'Grand Ballroom',
        description: 'Connect with leading tech companies looking for talent in all areas of technology.',
        image: 'https://picsum.photos/301/150',
      },
      {
        id: '3',
        title: 'Hackathon Challenge',
        date: 'March 14-15, 2025',
        time: '9:00 AM - 9:00 PM',
        location: 'Developer Zone',
        description: '24-hour coding challenge with prizes for the most innovative solutions.',
        image: 'https://picsum.photos/302/150',
      },
    ],
    networkingEvents: [
      {
        id: '1',
        title: 'Welcome Reception',
        date: 'March 14, 2025',
        time: '7:00 PM - 10:00 PM',
        location: 'Rooftop Lounge',
        description: 'Kick off the conference with drinks, appetizers, and connections with fellow attendees.',
        attendees: 150,
      },
      {
        id: '2',
        title: 'Women in Tech Breakfast',
        date: 'March 15, 2025',
        time: '7:30 AM - 9:00 AM',
        location: 'Executive Dining Room',
        description: 'Networking breakfast for women in technology to share experiences and build connections.',
        attendees: 75,
      },
      {
        id: '3',
        title: 'Industry Mixer',
        date: 'March 15, 2025',
        time: '6:00 PM - 8:00 PM',
        location: 'Grand Ballroom',
        description: 'Connect with professionals across different technology sectors in a relaxed setting.',
        attendees: 200,
      },
      {
        id: '4',
        title: 'Closing Party',
        date: 'March 16, 2025',
        time: '8:00 PM - 12:00 AM',
        location: 'Skyline Club',
        description: 'Celebrate the end of a successful conference with music, food, and networking.',
        attendees: 300,
      },
    ],
    companies: [
      {
        id: '1',
        name: 'TechCorp',
        type: 'sponsor',
        tier: 'platinum',
        logo: 'https://picsum.photos/301',
        description: 'Leading provider of enterprise AI solutions',
        employeesAttending: 5,
        booth: 'A1',
        website: 'https://techcorp.com'
      },
      {
        id: '2',
        name: 'StartupX',
        type: 'attendee',
        logo: 'https://picsum.photos/302',
        description: 'Innovative startup in the fintech space',
        employeesAttending: 3,
        website: 'https://startupx.com'
      },
      {
        id: '3',
        name: 'InnovateLabs',
        type: 'sponsor',
        tier: 'gold',
        logo: 'https://picsum.photos/303',
        description: 'Research and development in quantum computing',
        employeesAttending: 4,
        booth: 'B2',
        website: 'https://innovatelabs.com'
      },
      {
        id: '4',
        name: 'DesignFirst',
        type: 'sponsor',
        tier: 'silver',
        logo: 'https://picsum.photos/304',
        description: 'UX design and research consultancy',
        employeesAttending: 2,
        booth: 'C3',
        website: 'https://designfirst.com'
      },
      {
        id: '5',
        name: 'CloudScale',
        type: 'sponsor',
        tier: 'gold',
        logo: 'https://picsum.photos/305',
        description: 'Cloud infrastructure and scaling solutions',
        employeesAttending: 6,
        booth: 'B1',
        website: 'https://cloudscale.com'
      },
      {
        id: '6',
        name: 'SecureNet',
        type: 'attendee',
        logo: 'https://picsum.photos/306',
        description: 'Cybersecurity consulting and solutions',
        employeesAttending: 2,
        website: 'https://securenet.com'
      },
      {
        id: '7',
        name: 'DataMinds',
        type: 'sponsor',
        tier: 'platinum',
        logo: 'https://picsum.photos/307',
        description: 'AI and machine learning solutions',
        employeesAttending: 8,
        booth: 'A2',
        website: 'https://dataminds.com'
      },
      {
        id: '8',
        name: 'ChainWorks',
        type: 'attendee',
        logo: 'https://picsum.photos/308',
        description: 'Blockchain development and consulting',
        employeesAttending: 3,
        website: 'https://chainworks.com'
      },
      {
        id: '9',
        name: 'RoboTech Industries',
        type: 'sponsor',
        tier: 'gold',
        logo: 'https://picsum.photos/309',
        description: 'Robotics and automation solutions for manufacturing',
        employeesAttending: 7,
        booth: 'B3',
        website: 'https://robotech.com'
      },
      {
        id: '10',
        name: 'GreenTech Solutions',
        type: 'sponsor',
        tier: 'silver',
        logo: 'https://picsum.photos/310',
        description: 'Sustainable technology and renewable energy solutions',
        employeesAttending: 4,
        booth: 'C1',
        website: 'https://greentech.com'
      },
      {
        id: '11',
        name: 'QuantumLeap',
        type: 'attendee',
        logo: 'https://picsum.photos/311',
        description: 'Quantum computing research and development',
        employeesAttending: 2,
        website: 'https://quantumleap.com'
      },
      {
        id: '12',
        name: 'CyberShield',
        type: 'sponsor',
        tier: 'silver',
        logo: 'https://picsum.photos/312',
        description: 'Enterprise cybersecurity and threat detection',
        employeesAttending: 5,
        booth: 'C2',
        website: 'https://cybershield.com'
      },
      {
        id: '13',
        name: 'BioTech Innovations',
        type: 'attendee',
        logo: 'https://picsum.photos/313',
        description: 'Biotechnology and healthcare tech solutions',
        employeesAttending: 3,
        website: 'https://biotechinnovations.com'
      },
      {
        id: '14',
        name: 'SmartCity Solutions',
        type: 'sponsor',
        tier: 'gold',
        logo: 'https://picsum.photos/314',
        description: 'IoT and smart city infrastructure technology',
        employeesAttending: 6,
        booth: 'B4',
        website: 'https://smartcity.com'
      },
      {
        id: '15',
        name: 'VRWorld',
        type: 'sponsor',
        tier: 'silver',
        logo: 'https://picsum.photos/315',
        description: 'Virtual and augmented reality solutions',
        employeesAttending: 4,
        booth: 'C4',
        website: 'https://vrworld.com'
      },
      {
        id: '16',
        name: 'DevOps Pro',
        type: 'attendee',
        logo: 'https://picsum.photos/316',
        description: 'DevOps tools and automation solutions',
        employeesAttending: 3,
        website: 'https://devopspro.com'
      },
      {
        id: '17',
        name: 'EdgeCompute',
        type: 'sponsor',
        tier: 'platinum',
        logo: 'https://picsum.photos/317',
        description: 'Edge computing and distributed systems',
        employeesAttending: 7,
        booth: 'A3',
        website: 'https://edgecompute.com'
      },
      {
        id: '18',
        name: 'AIEthics',
        type: 'attendee',
        logo: 'https://picsum.photos/318',
        description: 'AI ethics and responsible innovation',
        employeesAttending: 2,
        website: 'https://aiethics.com'
      },
      {
        id: '19',
        name: 'DataSecurity Plus',
        type: 'sponsor',
        tier: 'gold',
        logo: 'https://picsum.photos/319',
        description: 'Data security and privacy solutions',
        employeesAttending: 5,
        booth: 'B5',
        website: 'https://datasecurity.com'
      },
      {
        id: '20',
        name: 'CloudNative Systems',
        type: 'attendee',
        logo: 'https://picsum.photos/320',
        description: 'Cloud-native application development',
        employeesAttending: 4,
        website: 'https://cloudnative.com'
      }
    ],
    attendeesList: [
      {
        id: '1',
        name: 'Alex Johnson',
        role: 'Software Engineer',
        company: 'TechCorp',
        image: 'https://picsum.photos/id/1/100',
        connections: 3,
        isConnected: false,
      },
      {
        id: '2',
        name: 'Samantha Lee',
        role: 'Product Manager',
        company: 'InnovateLabs',
        image: 'https://picsum.photos/id/2/100',
        connections: 5,
        isConnected: true,
      },
      {
        id: '3',
        name: 'David Chen',
        role: 'UX Designer',
        company: 'DesignStudio',
        image: 'https://picsum.photos/id/3/100',
        connections: 2,
        isConnected: false,
      },
      {
        id: '4',
        name: 'Maria Rodriguez',
        role: 'CTO',
        company: 'StartupX',
        image: 'https://picsum.photos/id/4/100',
        connections: 7,
        isConnected: true,
      },
      {
        id: '5',
        name: 'James Wilson',
        role: 'Data Scientist',
        company: 'DataDriven',
        image: 'https://picsum.photos/id/5/100',
        connections: 4,
        isConnected: false,
      },
      {
        id: '6',
        name: 'Emma Taylor',
        role: 'Marketing Director',
        company: 'GrowthHackers',
        image: 'https://picsum.photos/id/6/100',
        connections: 6,
        isConnected: false,
      },
      {
        id: '7',
        name: 'Michael Brown',
        role: 'Blockchain Developer',
        company: 'ChainTech',
        image: 'https://picsum.photos/id/7/100',
        connections: 2,
        isConnected: true,
      },
      {
        id: '8',
        name: 'Olivia Garcia',
        role: 'AI Researcher',
        company: 'NeuralSystems',
        image: 'https://picsum.photos/id/8/100',
        connections: 3,
        isConnected: false,
      },
    ],
  };

  const getSponsorBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return '#E5E4E2';
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      default:
        return '#B87333';
    }
  };

  useEffect(() => {
    if (searchType === 'speakers') {
      const filtered = event.speakers.filter(speaker => 
        speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpeakers(filtered);
    } else if (searchType === 'attendees') {
      const filtered = event.attendeesList.filter(attendee => 
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAttendees(filtered);
    } else if (searchType === 'companies') {
      const filtered = event.companies.filter(company => {
        if (selectedCompanyType !== 'all' && company.type !== selectedCompanyType) {
          return false;
        }
        return (
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, searchType, selectedCompanyType]);

  // Add new effect to initialize filtered companies
  useEffect(() => {
    const filtered = event.companies.filter(company => {
      if (selectedCompanyType !== 'all' && company.type !== selectedCompanyType) {
        return false;
      }
      return true;
    });
    setFilteredCompanies(filtered);
  }, [selectedCompanyType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  const totalPages = Math.ceil(event.attendeesList.length / pageSize);
  const paginatedAttendees = event.attendeesList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const navigateToProfile = () => {
    router.push({
      pathname: "/event-profile/contact",
      params: { id }
    });
  };

  const navigateToSpeakerProfile = (speakerId: string) => {
    router.push(`/speaker/${speakerId}`);
  };

  const navigateToAttendeeProfile = (attendeeId: string) => {
    router.push(`/attendee/${attendeeId}`);
  };

  const toggleSpeakerFavorite = (speakerId: string) => {
    setFavoriteSpeakers(prev => 
      prev.includes(speakerId)
        ? prev.filter(id => id !== speakerId)
        : [...prev, speakerId]
    );
  };

  const openSpeakerDetail = (speaker: any) => {
    setSelectedSpeaker(speaker);
    setSpeakerModalVisible(true);
  };

  const openTalkDetail = (talk: any) => {
    setSelectedTalk(talk);
    setTalkModalVisible(true);
  };

  const openSearchModal = (type: 'speakers' | 'attendees' | 'companies') => {
    setSearchType(type);
    setSearchQuery('');
    setSearchModalVisible(true);
  };

  const renderSpeaker = (speaker: any) => (
    <TouchableOpacity 
      key={speaker.id} 
      style={styles.speakerCard}
      onPress={() => navigateToSpeakerProfile(speaker.id)}
    >
      <Image 
        source={{ uri: speaker.image }}
        style={styles.speakerImage}
      />
      <View style={styles.speakerInfo}>
        <Text style={styles.speakerName}>{speaker.name}</Text>
        <Text style={styles.speakerRole}>{speaker.role}</Text>
        <Text style={styles.speakerCompany}>{speaker.company}</Text>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleSpeakerFavorite(speaker.id);
        }}
      >
        <Heart 
          size={20} 
          color="#FF3B30"
          fill={favoriteSpeakers.includes(speaker.id) ? "#FF3B30" : "none"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const currentSchedule = selectedStage === 'all'
    ? Object.values(event.scheduleByDay[selectedDay] || {}).flat().sort((a, b) => {
        const timeA = new Date(`2024-01-01 ${a.time}`);
        const timeB = new Date(`2024-01-01 ${b.time}`);
        return timeA.getTime() - timeB.getTime();
      })
    : event.scheduleByDay[selectedDay]?.[selectedStage] || [];

  const renderAnnouncement = (announcement: any) => (
    <View key={announcement.id} style={styles.announcement}>
      <View style={[styles.announcementPriority, { backgroundColor: announcement.priority === 'high' ? '#FF3B30' : '#FF9500' }]} />
      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle}>{announcement.title}</Text>
        <Text style={styles.announcementMessage}>{announcement.message}</Text>
        <Text style={styles.announcementTime}>{announcement.timestamp}</Text>
      </View>
    </View>
  );

  const renderSideEvent = (sideEvent: any) => (
    <TouchableOpacity key={sideEvent.id} style={styles.sideEventCard}>
      <Image 
        source={{ uri: sideEvent.image }}
        style={styles.sideEventImage}
      />
      <View style={styles.sideEventContent}>
        <Text style={styles.sideEventTitle}>{sideEvent.title}</Text>
        <View style={styles.sideEventInfo}>
          <Calendar size={16} color="#666" />
          <Text style={styles.sideEventInfoText}>{sideEvent.date}</Text>
        </View>
        <View style={styles.sideEventInfo}>
          <Clock size={16} color="#666" />
          <Text style={styles.sideEventInfoText}>{sideEvent.time}</Text>
        </View>
        <View style={styles.sideEventInfo}>
          <MapPin size={16} color="#666" />
          <Text style={styles.sideEventInfoText}>{sideEvent.location}</Text>
        </View>
        <Text style={styles.sideEventDescription}>{sideEvent.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNetworkingEvent = (networkingEvent: any) => (
    <TouchableOpacity key={networkingEvent.id} style={styles.networkingEventCard}>
      <View style={styles.networkingEventHeader}>
        <Text style={styles.networkingEventTitle}>{networkingEvent.title}</Text>
        <View style={styles.networkingEventAttendees}>
          <Users size={16} color="#007AFF" />
          <Text style={styles.networkingEventAttendeesText}>{networkingEvent.attendees}</Text>
        </View>
      </View>
      <View style={styles.networkingEventInfo}>
        <View style={styles.networkingEventInfoItem}>
          <Calendar size={16} color="#666" />
          <Text style={styles.networkingEventInfoText}>{networkingEvent.date}</Text>
        </View>
        <View style={styles.networkingEventInfoItem}>
          <Clock size={16} color="#666" />
          <Text style={styles.networkingEventInfoText}>{networkingEvent.time}</Text>
        </View>
      </View>
      <View style={styles.networkingEventLocation}>
        <MapPin size={16} color="#666" />
        <Text style={styles.networkingEventLocationText}>{networkingEvent.location}</Text>
      </View>
      <Text style={styles.networkingEventDescription}>{networkingEvent.description}</Text>
    </TouchableOpacity>
  );

  const renderAttendee = (attendee: any) => (
    <TouchableOpacity 
      key={attendee.id} 
      style={styles.attendeeCard}
      onPress={() => navigateToAttendeeProfile(attendee.id)}
    >
      <Image 
        source={{ uri: attendee.image }}
        style={styles.attendeeImage}
      />
      <View style={styles.attendeeInfo}>
        <Text style={styles.attendeeName}>{attendee.name}</Text>
        <Text style={styles.attendeeRole}>{attendee.role}</Text>
        <View style={styles.attendeeCompanyContainer}>
          <Text style={styles.attendeeCompany}>{attendee.company}</Text>
          <View style={styles.connectionBadge}>
            <Text style={styles.connectionCount}>{attendee.connections} mutual</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.connectButton, 
          attendee.isConnected && styles.connectedButton
        ]}
        onPress={(e) => {
          e.stopPropagation();
        }}
      >
        <Text style={[
          styles.connectButtonText,
          attendee.isConnected && styles.connectedButtonText
        ]}>
          {attendee.isConnected ? 'Connected' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCompany = (company: any) => (
    <View style={styles.companyCard}>
      <Image source={{ uri: company.logo }} style={styles.companyLogo} />
      <View style={styles.companyInfo}>
        <View style={styles.companyHeader}>
          <Text style={styles.companyName}>{company.name}</Text>
          {company.type === 'sponsor' && (
            <View style={[styles.sponsorBadge, { backgroundColor: getSponsorBadgeColor(company.tier) }]}>
              <Text style={styles.sponsorBadgeText}>{company.tier}</Text>
            </View>
          )}
        </View>
        <Text style={styles.companyDescription} numberOfLines={2}>
          {company.description}
        </Text>
        <View style={styles.companyStats}>
          <View style={styles.companyStat}>
            <Users size={14} color="#666" />
            <Text style={styles.companyStatText}>{company.employeesAttending} attending</Text>
          </View>
          {company.type === 'sponsor' && company.booth && (
            <View style={styles.companyStat}>
              <MapPin size={14} color="#666" />
              <Text style={styles.companyStatText}>Booth {company.booth}</Text>
            </View>
          )}
        </View>
      </View>
      <ChevronRight size={20} color="#ccc" />
    </View>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-56, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const listener = scrollY.addListener((state: { value: number }) => {
      setShowFloatingHeader(state.value > 80);
    });
    return () => scrollY.removeListener(listener);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const navigateToCompanyProfile = (companyId: string) => {
    router.push(`/company/${companyId}`);
  };

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      <Animated.View 
        style={[
          styles.floatingHeader, 
          { 
            opacity: headerOpacity,
            transform: [{
              translateY: headerTranslateY
            }]
          }
        ]}
      >
        <View style={styles.floatingHeaderContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text style={[styles.backButtonText, { flex: 1, textAlign: 'center', marginLeft: 0 }]}>
            {event.title}
          </Text>

          <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
            <UserCircle size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.heroContainer}>
          <ImageCarousel images={event.images} />
          
          <View style={styles.heroOverlay}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.85)']}
              style={styles.heroGradient}
              locations={[0, 0.4, 1]}
            />
            
            <View style={styles.heroTitleContainer}>
              <Text style={styles.heroTitle}>{event.title}</Text>
              
              <View style={styles.heroInfoContainer}>
                <View style={styles.heroInfoColumn}>
                  <View style={styles.heroInfoRow}>
                    <Calendar size={16} color="#fff" />
                    <Text style={styles.heroInfoText}>{event.date}</Text>
                  </View>
                  <View style={styles.heroInfoRow}>
                    <MapPin size={16} color="#fff" />
                    <Text style={styles.heroInfoText}>{event.location}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.heroProfileButton} onPress={navigateToProfile}>
                  <UserCircle size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoRow}>
                <Calendar size={20} color="#666" />
                <Text style={styles.infoText}>{event.date}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Clock size={20} color="#666" />
                <Text style={styles.infoText}>{event.time}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={20} color="#666" />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>

              <View style={styles.infoRow}>
                <Users size={20} color="#666" />
                <Text style={styles.infoText}>{event.attendees} attendees</Text>
              </View>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
          >
            <View style={styles.tabs}>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
                onPress={() => setSelectedTab('about')}
              >
                <Text style={[styles.tabText, selectedTab === 'about' && styles.tabTextActive]}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'schedule' && styles.tabActive]}
                onPress={() => setSelectedTab('schedule')}
              >
                <Text style={[styles.tabText, selectedTab === 'schedule' && styles.tabTextActive]}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'speakers' && styles.tabActive]}
                onPress={() => setSelectedTab('speakers')}
              >
                <Text style={[styles.tabText, selectedTab === 'speakers' && styles.tabTextActive]}>Speakers</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'attendees' && styles.tabActive]}
                onPress={() => setSelectedTab('attendees')}
              >
                <Text style={[styles.tabText, selectedTab === 'attendees' && styles.tabTextActive]}>Attendees</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'companies' && styles.tabActive]}
                onPress={() => setSelectedTab('companies')}
              >
                <Text style={[styles.tabText, selectedTab === 'companies' && styles.tabTextActive]}>Companies</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'side-events' && styles.tabActive]}
                onPress={() => setSelectedTab('side-events')}
              >
                <Text style={[styles.tabText, selectedTab === 'side-events' && styles.tabTextActive]}>Side Events</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'networking' && styles.tabActive]}
                onPress={() => setSelectedTab('networking')}
              >
                <Text style={[styles.tabText, selectedTab === 'networking' && styles.tabTextActive]}>Networking</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === 'announcements' && styles.tabActive]}
                onPress={() => setSelectedTab('announcements')}
              >
                <Text style={[styles.tabText, selectedTab === 'announcements' && styles.tabTextActive]}>Updates</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {selectedTab === 'about' && (
            <>
              <Text style={styles.description}>{event.description}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                  <MessageCircle size={24} color="#007AFF" />
                  <Text style={styles.actionText}>Event Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                  <Share2 size={24} color="#007AFF" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {selectedTab === 'schedule' && (
            <View style={styles.scheduleContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.dayTabs]}>
                <TouchableOpacity 
                  style={[styles.dayTab, selectedDay === 1 && styles.dayTabActive]}
                  onPress={() => setSelectedDay(1)}
                >
                  <Text style={[styles.dayTabText, selectedDay === 1 && styles.dayTabTextActive]}>Day 1</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dayTab, selectedDay === 2 && styles.dayTabActive]}
                  onPress={() => setSelectedDay(2)}
                >
                  <Text style={[styles.dayTabText, selectedDay === 2 && styles.dayTabTextActive]}>Day 2</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dayTab, selectedDay === 3 && styles.dayTabActive]}
                  onPress={() => setSelectedDay(3)}
                >
                  <Text style={[styles.dayTabText, selectedDay === 3 && styles.dayTabTextActive]}>Day 3</Text>
                </TouchableOpacity>
              </ScrollView>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={[styles.dayTabs, { marginTop: 8 }]}
              >
                <TouchableOpacity 
                  style={[styles.dayTab, selectedStage === 'all' && styles.dayTabActive]}
                  onPress={() => setSelectedStage('all')}
                >
                  <Text style={[styles.dayTabText, selectedStage === 'all' && styles.dayTabTextActive]}>
                    All Stages
                  </Text>
                </TouchableOpacity>
                {event.stages.map((stage) => (
                  <TouchableOpacity 
                    key={stage.id}
                    style={[styles.dayTab, selectedStage === stage.id && styles.dayTabActive]}
                    onPress={() => setSelectedStage(stage.id)}
                  >
                    <Text style={[styles.dayTabText, selectedStage === stage.id && styles.dayTabTextActive]}>
                      {stage.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <ScrollView style={{ flex: 1, paddingBottom: 20 }}>
                <View style={styles.timeline} />
                {(selectedStage === 'all' 
                  ? Object.values(event.scheduleByDay[selectedDay] || {}).flat().sort((a, b) => {
                      const timeA = new Date(`2024-01-01 ${a.time}`);
                      const timeB = new Date(`2024-01-01 ${b.time}`);
                      return timeA.getTime() - timeB.getTime();
                    })
                  : event.scheduleByDay[selectedDay]?.[selectedStage] || []
                ).map(item => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.scheduleItem}
                    onPress={() => openTalkDetail(item)}
                  >
                    <View style={styles.scheduleTime}>
                      <Text style={styles.scheduleTimeText}>{item.time}</Text>
                      <View style={styles.timelineDot} />
                    </View>
                    <View style={styles.scheduleContent}>
                      <Text style={styles.scheduleTitle}>{item.title}</Text>
                      {item.speaker && (
                        <Text style={styles.scheduleSpeaker}>Speaker: {item.speaker}</Text>
                      )}
                      <View style={styles.scheduleLocation}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.scheduleLocationText}>{item.location}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedTab === 'speakers' && (
            <View style={styles.speakersContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Speakers ({event.speakers.length})</Text>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => openSearchModal('speakers')}
                >
                  <Search size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
              {event.speakers.map(renderSpeaker)}
            </View>
          )}

          {selectedTab === 'attendees' && (
            <View style={styles.attendeesContainer}>
              <View style={styles.attendeesHeader}>
                <Text style={styles.attendeesCount}>{event.attendeesList.length} of {event.attendees} Attendees</Text>
                <View style={styles.attendeesActions}>
                  <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={() => openSearchModal('attendees')}
                  >
                    <Search size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterAttendees}>
                    <Filter size={16} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
              {paginatedAttendees.map(renderAttendee)}
              
              <View style={styles.paginationContainer}>
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                  onPress={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} color={currentPage === 1 ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>
                
                <Text style={styles.paginationText}>
                  Page {currentPage} of {totalPages}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} color={currentPage === totalPages ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {selectedTab === 'companies' && (
            <View style={styles.companiesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Companies ({event.companies.length})</Text>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => openSearchModal('companies')}
                >
                  <Search size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.companyTypeTabs}>
                <TouchableOpacity 
                  style={[styles.companyTypeTab, selectedCompanyType === 'all' && styles.companyTypeTabActive]}
                  onPress={() => setSelectedCompanyType('all')}
                >
                  <Text style={[styles.companyTypeText, selectedCompanyType === 'all' && styles.companyTypeTextActive]}>
                    All Companies
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.companyTypeTab, selectedCompanyType === 'sponsor' && styles.companyTypeTabActive]}
                  onPress={() => setSelectedCompanyType('sponsor')}
                >
                  <Text style={[styles.companyTypeText, selectedCompanyType === 'sponsor' && styles.companyTypeTextActive]}>
                    Sponsors
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.companyTypeTab, selectedCompanyType === 'attendee' && styles.companyTypeTabActive]}
                  onPress={() => setSelectedCompanyType('attendee')}
                >
                  <Text style={[styles.companyTypeText, selectedCompanyType === 'attendee' && styles.companyTypeTextActive]}>
                    Attending Companies
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {filteredCompanies.map((company) => (
                <TouchableOpacity 
                  key={company.id} 
                  style={styles.companyCard}
                  onPress={() => navigateToCompanyProfile(company.id)}
                >
                  <Image source={{ uri: company.logo }} style={styles.companyLogo} />
                  <View style={styles.companyInfo}>
                    <View style={styles.companyHeader}>
                      <Text style={styles.companyName}>{company.name}</Text>
                      {company.type === 'sponsor' && (
                        <View style={[styles.sponsorBadge, { backgroundColor: getSponsorBadgeColor(company.tier) }]}>
                          <Text style={styles.sponsorBadgeText}>{company.tier}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.companyDescription} numberOfLines={2}>
                      {company.description}
                    </Text>
                    <View style={styles.companyStats}>
                      <View style={styles.companyStat}>
                        <Users size={14} color="#666" />
                        <Text style={styles.companyStatText}>{company.employeesAttending} attending</Text>
                      </View>
                      {company.type === 'sponsor' && company.booth && (
                        <View style={styles.companyStat}>
                          <MapPin size={14} color="#666" />
                          <Text style={styles.companyStatText}>Booth {company.booth}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <ChevronRight size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedTab === 'side-events' && (
            <View style={styles.sideEventsContainer}>
              {event.sideEvents.map(renderSideEvent)}
            </View>
          )}

          {selectedTab === 'networking' && (
            <View style={styles.networkingEventsContainer}>
              {event.networkingEvents.map(renderNetworkingEvent)}
            </View>
          )}

          {selectedTab === 'announcements' && (
            <View style={styles.announcementsContainer}>
              {event.announcements.map(renderAnnouncement)}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <SpeakerDetailModal 
        visible={speakerModalVisible}
        speaker={selectedSpeaker}
        onClose={() => setSpeakerModalVisible(false)}
      />

      <TalkDetailModal 
        visible={talkModalVisible}
        talk={selectedTalk}
        onClose={() => setTalkModalVisible(false)}
      />

      <SearchModal 
        visible={searchModalVisible}
        searchType={searchType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClose={() => setSearchModalVisible(false)}
        filteredSpeakers={filteredSpeakers}
        filteredAttendees={filteredAttendees}
        filteredCompanies={filteredCompanies}
        renderSpeaker={renderSpeaker}
        renderAttendee={renderAttendee}
        renderCompany={renderCompany}
        navigateToSpeakerProfile={navigateToSpeakerProfile}
        navigateToAttendeeProfile={navigateToAttendeeProfile}
        navigateToCompanyProfile={navigateToCompanyProfile}
      />
    </View>
  );
};

export default EventLanding; 