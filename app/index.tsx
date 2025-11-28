import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { storage } from '../utils/storage';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasCompletedOnboarding = await storage.getOnboardingStatus();
      if (hasCompletedOnboarding) {
        router.replace('/dashboard');
      } else {
        router.replace('/welcome');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      router.replace('/welcome');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#b0b0b0',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
