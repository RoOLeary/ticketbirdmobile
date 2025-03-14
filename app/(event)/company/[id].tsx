import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Users, Globe, Building2, MessageCircle, Star, ExternalLink, Calendar, Clock } from 'lucide-react-native';

const CompanyProfile: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);

  // This would typically come from an API or global state
  const company = {
    id: '1',
    name: 'TechCorp',
    type: 'sponsor',
    tier: 'platinum',
    logo: 'https://picsum.photos/301',
    description: 'Leading provider of enterprise AI solutions',
    employeesAttending: 5,
    booth: 'A1',
    website: 'https://techcorp.com',
    location: 'San Francisco, CA',
    founded: '2010',
    employees: '1000+',
    industry: 'Enterprise Software',
    specialties: ['AI Solutions', 'Cloud Computing', 'Enterprise Software'],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp'
    },
    attendingEmployees: [
      {
        id: '1',
        name: 'Alex Johnson',
        role: 'Software Engineer',
        image: 'https://picsum.photos/id/1/100'
      },
      {
        id: '2',
        name: 'Sarah Chen',
        role: 'AI Research Director',
        image: 'https://picsum.photos/id/2/100'
      }
    ],
    sessions: [
      {
        id: '1',
        title: 'Enterprise AI Implementation',
        time: '10:00 AM',
        date: 'March 15, 2025',
        location: 'Main Stage'
      },
      {
        id: '2',
        title: 'AI Ethics Panel',
        time: '2:00 PM',
        date: 'March 16, 2025',
        location: 'Workshop Room'
      }
    ]
  };

  const handleBack = () => router.back();
  const handleWebsitePress = () => Linking.openURL(company.website);
  const handleFollow = () => setIsFollowing(!isFollowing);

  const getBadgeColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return '#E5E4E2';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      default: return '#B87333';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{company.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <Image source={{ uri: company.logo }} style={styles.logo} />
            <Text style={styles.companyName}>{company.name}</Text>
            {company.type === 'sponsor' && (
              <View style={[styles.sponsorBadgeHero, { backgroundColor: getBadgeColor(company.tier) }]}>
                <Text style={styles.sponsorBadgeHeroText}>{company.tier} Sponsor</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Building2 size={16} color="#666" />
                <Text style={styles.infoText}>{company.location}</Text>
              </View>
              <View style={styles.infoItem}>
                <Users size={16} color="#666" />
                <Text style={styles.infoText}>{company.employees} employees</Text>
              </View>
              {company.type === 'sponsor' && company.booth && (
                <View style={styles.infoItem}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.infoText}>Booth {company.booth}</Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.primaryButton, isFollowing && styles.primaryButtonActive]}
                onPress={handleFollow}
              >
                <Star size={20} color={isFollowing ? "#fff" : "#007AFF"} />
                <Text style={[styles.primaryButtonText, isFollowing && styles.primaryButtonTextActive]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={handleWebsitePress}>
                  <Globe size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <MessageCircle size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.industry}>{company.industry}</Text>
            <Text style={styles.description}>{company.description}</Text>
            <View style={styles.specialtiesList}>
              {company.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {company.type === 'sponsor' && company.sessions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Speaking Sessions</Text>
              {company.sessions.map((session) => (
                <TouchableOpacity key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Calendar size={16} color="#007AFF" />
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <View style={styles.sessionDetails}>
                    <View style={styles.sessionDetail}>
                      <Clock size={14} color="#666" />
                      <Text style={styles.sessionDetailText}>{session.time}</Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <MapPin size={14} color="#666" />
                      <Text style={styles.sessionDetailText}>{session.location}</Text>
                    </View>
                  </View>
                  <ExternalLink size={16} color="#007AFF" style={styles.sessionArrow} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Team Attending</Text>
              <Text style={styles.sectionCount}>{company.employeesAttending}</Text>
            </View>
            {company.attendingEmployees.map((employee) => (
              <TouchableOpacity key={employee.id} style={styles.employeeCard}>
                <Image source={{ uri: employee.image }} style={styles.employeeImage} />
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeRole}>{employee.role}</Text>
                </View>
                <ChevronLeft size={20} color="#007AFF" style={styles.employeeArrow} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 56,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerRight: {
    width: 32,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  industry: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  primaryButtonActive: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  primaryButtonTextActive: {
    color: '#fff',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionCount: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#007AFF',
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 14,
    color: '#666',
  },
  sessionCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionDetailText: {
    fontSize: 14,
    color: '#666',
  },
  sessionArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
  },
  employeeImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  employeeRole: {
    fontSize: 14,
    color: '#666',
  },
  employeeArrow: {
    transform: [{ rotate: '180deg' }],
  },
  sponsorBadgeHero: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  sponsorBadgeHeroText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
});

export default CompanyProfile; 