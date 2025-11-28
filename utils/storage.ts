import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from '../types';

const ACTIVITIES_KEY = '@health_tracker_activities';
const ONBOARDING_KEY = '@health_tracker_onboarding';

export const storage = {
  
  async getActivities(): Promise<Activity[]> {
    try {
      const data = await AsyncStorage.getItem(ACTIVITIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  },

  async saveActivity(activity: Activity): Promise<void> {
    try {
      const activities = await this.getActivities();
      activities.push(activity);
      await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  },

  async getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<Activity[]> {
    try {
      const activities = await this.getActivities();
      
      
      const getIstComponents = (date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        });
        const parts = formatter.formatToParts(date);
        const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
        const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
        const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
        return new Date(year, month - 1, day);
      };
      
      const startIst = getIstComponents(startDate);
      const endIst = getIstComponents(endDate);
      
      return activities.filter((activity) => {
        const activityDate = new Date(activity.timestamp);
        const activityIst = getIstComponents(activityDate);
        return activityIst >= startIst && activityIst <= endIst;
      });
    } catch (error) {
      console.error('Error getting activities by date range:', error);
      return [];
    }
  },

  async deleteActivity(activityId: string): Promise<void> {
    try {
      const activities = await this.getActivities();
      const updatedActivities = activities.filter((activity) => activity.id !== activityId);
      await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updatedActivities));
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  
  async getOnboardingStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(ONBOARDING_KEY);
      return status === 'completed';
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return false;
    }
  },

  async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'completed');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
      throw error;
    }
  },
};

