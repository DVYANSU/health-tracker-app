import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { storage } from '../utils/storage';

export default function WelcomeScreen() {
  const handleGetStarted = async () => {
    await storage.setOnboardingCompleted();
    router.replace('/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="water" size={48} color="#3498db" />
          <Ionicons name="walk" size={48} color="#2ecc71" />
          <Ionicons name="moon" size={48} color="#9b59b6" />
        </View>
        <Text style={styles.title}>Personal Health Tracker</Text>
        <Text style={styles.subtitle}>
          Track your daily health activities and stay on top of your wellness
          goals.
        </Text>
        <Text style={styles.description}>
          Monitor your water intake, steps, and sleep hours all in one place.
          Start your journey to better health today!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 26,
  },
  description: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
    marginBottom: 56,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

