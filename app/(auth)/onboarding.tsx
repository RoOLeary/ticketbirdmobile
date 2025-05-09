import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../stores/onboardingStore';

const INTERESTS = [
  'Music', 'Sports', 'Technology', 'Art', 'Food', 'Travel', 
  'Fashion', 'Movies', 'Books', 'Gaming', 'Fitness', 'Photography'
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { 
    selectedInterests,
    setSelectedInterests,
    saveInterests,
    isLoading,
    error
  } = useOnboardingStore();
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleComplete = async () => {
    await saveInterests();
    // User will be redirected by _layout.tsx after state updates
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What are you interested in?</Text>
      <Text style={styles.subtitle}>Select at least 3 topics to personalize your experience</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <FlatList
        data={INTERESTS}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.interestItem,
              selectedInterests.includes(item) && styles.selectedItem
            ]}
            onPress={() => toggleInterest(item)}
          >
            <Text style={[
              styles.interestText,
              selectedInterests.includes(item) && styles.selectedText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />
      
      <TouchableOpacity 
        style={[
          styles.button,
          selectedInterests.length < 3 && styles.buttonDisabled
        ]}
        onPress={handleComplete}
        disabled={selectedInterests.length < 3 || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  interestItem: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  interestText: {
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});