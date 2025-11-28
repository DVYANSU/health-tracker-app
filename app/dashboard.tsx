import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, getTodaySummary } from '../utils/helpers';
import { storage } from '../utils/storage';

export default function DashboardScreen() {
  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadSummary = useCallback(async () => {
    const activities = await storage.getActivities();
    const summary = getTodaySummary(activities);
    setWater(summary.water);
    setSteps(summary.steps);
    setSleep(summary.sleep);
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSummary();
    setRefreshing(false);
  }, [loadSummary]);

  const handleLogActivity = (type: 'water' | 'steps' | 'sleep') => {
    router.push({
      pathname: '/log-activity',
      params: { type },
    });
  };


  const today = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(now);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    return new Date(year, month - 1, day);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={['#3498db']}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.date}>{formatDate(today)}</Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <Ionicons name="water" size={44} color="#3498db" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{water}</Text>
            <Text style={styles.cardLabel}>Glasses of Water</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="walk" size={44} color="#2ecc71" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{steps.toLocaleString()}</Text>
            <Text style={styles.cardLabel}>Steps</Text>
          </View>

          <View style={styles.card}>
            <Ionicons name="moon" size={44} color="#9b59b6" style={styles.cardIcon} />
            <Text style={styles.cardValue}>{sleep.toFixed(1)}</Text>
            <Text style={styles.cardLabel}>Hours of Sleep</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={[styles.actionButton, styles.waterButton]}
            onPress={() => handleLogActivity('water')}
            activeOpacity={0.8}
          >
            <Ionicons name="water" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Log Water</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.stepsButton]}
            onPress={() => handleLogActivity('steps')}
            activeOpacity={0.8}
          >
            <Ionicons name="walk" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Log Steps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.sleepButton]}
            onPress={() => handleLogActivity('sleep')}
            activeOpacity={0.8}
          >
            <Ionicons name="moon" size={20} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.actionButtonText}>Log Sleep</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history')}
          activeOpacity={0.8}
        >
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 15,
    fontWeight: '300',
    color: '#b0b0b0',
    letterSpacing: 0.2,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardIcon: {
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardLabel: {
    fontSize: 13,
    color: '#b0b0b0',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  actionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  waterButton: {
    backgroundColor: '#3498db',
  },
  stepsButton: {
    backgroundColor: '#2ecc71',
  },
  sleepButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  historyButton: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3498db',
    elevation: 2,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  historyButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

