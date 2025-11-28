import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity } from '../types';
import {
    getActivityTypeLabel,
    getActivityUnit,
    groupActivitiesByDate,
    GroupedActivities
} from '../utils/helpers';
import { storage } from '../utils/storage';

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<GroupedActivities>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadActivities = useCallback(async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const fetchedActivities = await storage.getActivitiesByDateRange(
      startDate,
      endDate
    );

    
    fetchedActivities.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setActivities(fetchedActivities);
    setGroupedActivities(groupActivitiesByDate(fetchedActivities));
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleDeleteActivity = (activityId: string) => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await storage.deleteActivity(activityId);
            setActivities((prev) => {
              const updated = prev.filter((activity) => activity.id !== activityId);
              setGroupedActivities(groupActivitiesByDate(updated));
              return updated;
            });
          } catch (error) {
            Alert.alert('Error', 'Failed to delete activity. Please try again.');
            console.error('Error deleting activity:', error);
          }
        },
      },
    ]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  }, [loadActivities]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'water':
        return { name: 'water' as const, color: '#3498db' };
      case 'steps':
        return { name: 'walk' as const, color: '#2ecc71' };
      case 'sleep':
        return { name: 'moon' as const, color: '#9b59b6' };
      default:
        return { name: 'document-text' as const, color: '#b0b0b0' };
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const datePart = date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const timePart = date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return `${datePart} • ${timePart} IST`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Activity History</Text>
        <View style={styles.placeholder} />
      </View>

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
        {groupedActivities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activities logged yet</Text>
            <Text style={styles.emptySubtext}>
              Start tracking your health activities from the dashboard
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/dashboard')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          groupedActivities.map((group) => (
            <View key={group.isoDate} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{group.displayLabel}</Text>
              {group.activities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityHeader}>
                    <View style={styles.activityIconContainer}>
                      <Ionicons
                        name={getActivityIcon(activity.type).name}
                        size={36}
                        color={getActivityIcon(activity.type).color}
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityType}>
                        {getActivityTypeLabel(activity.type)}
                      </Text>
                      <Text style={styles.activityTime}>
                        {formatTime(activity.timestamp)}
                      </Text>
                    </View>
                    <View style={styles.activityActions}>
                      <Text style={styles.activityValue}>
                        {activity.value} {getActivityUnit(activity.type)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteActivity(activity.id)}
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash" size={18} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {activity.notes && (
                    <Text style={styles.activityNotes}>{activity.notes}</Text>
                  )}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    minHeight: 400,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#b0b0b0',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#3498db',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dateGroup: {
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    marginTop: 12,
    letterSpacing: 0.3,
  },
  activityCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconContainer: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  activityTime: {
    fontSize: 13,
    color: '#b0b0b0',
    letterSpacing: 0.2,
  },
  activityValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3498db',
    letterSpacing: 0.3,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  activityNotes: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    fontStyle: 'italic',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

