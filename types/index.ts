export type ActivityType = 'water' | 'steps' | 'sleep';

export interface Activity {
  id: string;
  type: ActivityType;
  value: number;
  timestamp: string;
  notes?: string;
}

export interface DailySummary {
  date: string;
  water: number;
  steps: number;
  sleep: number;
}

