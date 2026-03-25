import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Platform } from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { COLORS } from '../src/constants/colors';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function scheduleDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '合成キメラ',
        body: '新しいパーツが入荷しているかも！今日もバトルしよう',
        sound: true,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, hour: 20, minute: 0, repeats: true },
    });
  } catch (e) {
    console.warn('[notifications] schedule failed:', e);
  }
}

export default function RootLayout() {
  const loadGame = useGameStore(s => s.loadGame);

  useEffect(() => {
    loadGame();
    scheduleDailyReminder().catch(() => {});
  }, [loadGame]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg.primary },
          animation: 'slide_from_right',
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg.primary },
});
