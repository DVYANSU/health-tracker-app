import { Activity, ActivityType, DailySummary } from '../types';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getIstDateComponents = (date: Date) => {
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
  return { year, month, day };
};

export const getTodaySummary = (activities: Activity[]): DailySummary => {
  // Get today's date in IST
  const now = new Date();
  const istTodayParts = getIstDateComponents(now);
  const istToday = new Date(istTodayParts.year, istTodayParts.month - 1, istTodayParts.day);
  istToday.setHours(0, 0, 0, 0);

  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.timestamp);
    // Convert activity date to IST for comparison
    const activityIstParts = getIstDateComponents(activityDate);
    const activityIstDate = new Date(activityIstParts.year, activityIstParts.month - 1, activityIstParts.day);
    activityIstDate.setHours(0, 0, 0, 0);
    return isSameDay(activityIstDate, istToday);
  });

  const summary: DailySummary = {
    date: istToday.toISOString(),
    water: 0,
    steps: 0,
    sleep: 0,
  };

  todayActivities.forEach((activity) => {
    if (activity.type === 'water') {
      summary.water += activity.value;
    } else if (activity.type === 'steps') {
      summary.steps += activity.value;
    } else if (activity.type === 'sleep') {
      summary.sleep += activity.value;
    }
  });

  return summary;
};

export type GroupedActivities = Array<{
  isoDate: string;
  displayLabel: string;
  activities: Activity[];
}>;

const getIstIsoDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const getIstDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const groupActivitiesByDate = (activities: Activity[]): GroupedActivities => {
  const groupedMap: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const activityDate = new Date(activity.timestamp);
    const isoKey = getIstIsoDate(activityDate);

    if (!groupedMap[isoKey]) {
      groupedMap[isoKey] = [];
    }

    groupedMap[isoKey].push(activity);
  });

  return Object.entries(groupedMap)
    .map(([isoDate, activityList]) => {
      const displayLabel = getIstDisplayDate(new Date(activityList[0].timestamp));
      const sortedActivities = activityList.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      return {
        isoDate,
        displayLabel,
        activities: sortedActivities,
      };
    })
    .sort((a, b) => {
      if (a.isoDate === b.isoDate) {
        return 0;
      }
      // Desc order (latest first)
      return a.isoDate < b.isoDate ? 1 : -1;
    });
};

export const getActivityTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case 'water':
      return 'Water';
    case 'steps':
      return 'Steps';
    case 'sleep':
      return 'Sleep';
    default:
      return type;
  }
};

export const getActivityUnit = (type: ActivityType): string => {
  switch (type) {
    case 'water':
      return 'glasses';
    case 'steps':
      return 'steps';
    case 'sleep':
      return 'hours';
    default:
      return '';
  }
};

