# Personal Health Tracker App

A React Native mobile application built with Expo that helps users track their daily health activities including water intake, steps, and sleep hours.

## Features

### Core Features

#### 1. Welcome/Onboarding Screen
- Simple introduction to the app
- Button to proceed to the main application
- Onboarding status is saved to prevent showing the screen again

#### 2. Dashboard Screen
- Displays today's date in a readable format
- Summary cards showing:
  - **Water intake** (glasses per day)
  - **Steps walked**
  - **Sleep hours**
- Quick action buttons to log each activity type
- Pull-to-refresh functionality to update data
- Navigation to history screen

#### 3. Activity Logging Screen
- Form to add/log activities with:
  - **Activity type** selection (water, steps, sleep)
  - **Value/amount** input with validation
  - **Time of logging** (date and time picker)
  - **Optional notes** field
- Input validation:
  - Required fields validation
  - Positive number validation
  - Sleep hours cannot exceed 24
- Pre-filled activity type when accessed from quick actions

#### 4. History Screen
- List of logged activities from the last 7 days
- Activities grouped by date
- Pull-to-refresh functionality
- Displays:
  - Activity type with icon
  - Value and unit
  - Time of logging
  - Optional notes
- Empty state with navigation to dashboard

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **AsyncStorage** - Local data persistence
- **React Native Gesture Handler** - For pull-to-refresh

## Project Structure

```
healthTrackerApp/
├── app/
│   ├── _layout.tsx          # Root layout with navigation
│   ├── index.tsx            # Entry point with onboarding check
│   ├── welcome.tsx          # Welcome/Onboarding screen
│   ├── dashboard.tsx        # Main dashboard with summary cards
│   ├── log-activity.tsx     # Activity logging form
│   └── history.tsx          # Activity history screen
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── storage.ts           # AsyncStorage wrapper for data persistence
│   └── helpers.ts            # Utility functions (date formatting, grouping, etc.)
├── assets/                  # Images and static assets
└── package.json             # Dependencies and scripts
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, can use npx)
- Expo Go app on your mobile device (for testing) or iOS Simulator/Android Emulator

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthTrackerApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your device/emulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your physical device

## Usage

### First Launch
1. The app will show the Welcome screen on first launch
2. Tap "Get Started" to proceed to the Dashboard
3. The onboarding status is saved, so you won't see the welcome screen again

### Logging Activities
1. From the Dashboard, tap any "Quick Action" button (Log Water, Log Steps, Log Sleep)
2. Or navigate to the Activity Logging screen directly
3. Fill in the required fields:
   - Select activity type
   - Enter value/amount
   - Set the time (defaults to current time)
   - Add optional notes
4. Tap "Save Activity" to log the activity

### Viewing History
1. From the Dashboard, tap "View History"
2. View activities grouped by date (last 7 days)
3. Pull down to refresh the list
4. Each activity shows type, value, time, and notes

### Dashboard Summary
- The Dashboard automatically calculates and displays:
  - Total water glasses consumed today
  - Total steps walked today
  - Total sleep hours today
- Pull down to refresh the summary

## Data Persistence

All activities are stored locally on the device using AsyncStorage. Data persists between app sessions and includes:
- Activity type, value, timestamp, and optional notes
- Onboarding completion status

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with React Hooks
- Consistent styling with StyleSheet
- Error handling for async operations

## Future Enhancements

Potential features for future versions:
- Charts and graphs for activity trends
- Weekly/monthly summaries
- Goal setting and tracking
- Notifications and reminders
- Data export functionality
- Multiple user profiles
- Integration with health apps (Apple Health, Google Fit)

## License

This project is created as an assignment submission.

## Author

React Native Intern Assignment - Personal Health Tracker App
