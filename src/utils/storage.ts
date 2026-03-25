import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types';

export const STORAGE_KEYS = {
  GAME_STATE: '@chimera_game_state',
  BGM_ENABLED: '@chimera_bgm_enabled',
  SE_ENABLED: '@chimera_se_enabled',
  HAPTICS_ENABLED: '@chimera_haptics_enabled',
  NOTIFICATIONS_GRANTED: '@chimera_notifications_granted',
  FIRST_LAUNCH_DONE: '@chimera_first_launch',
  AD_WATCH_COUNT: '@chimera_ad_watch_count',
  APP_VERSION: '@chimera_app_version',
} as const;

export async function saveGameState(state: GameState): Promise<void> {
  const json = JSON.stringify(state);
  await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, json);
}

export async function loadGameState(): Promise<GameState | null> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
  if (!json) return null;
  try {
    return JSON.parse(json) as GameState;
  } catch {
    return null;
  }
}

export function createInitialGameState(): GameState {
  return {
    inventory: [],
    inventoryLimit: 50,
    chimera: {
      name: '\u30AD\u30E1\u30E9',
      slots: { head: null, body: null, legs: null },
      totalStats: { atk: 0, hp: 0, spd: 0 },
      power: 0,
    },
    record: {
      totalBattles: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      maxWinStreak: 0,
      currentWinStreak: 0,
      tournamentWins: 0,
    },
    coins: 0,
    codexDiscovered: [],
    currentTournament: null,
    arenaRank: 1,
    totalMerges: 0,
    lastPlayedAt: new Date().toISOString(),
    tutorialCompleted: false,
    adFree: false,
    achievementsUnlocked: [],
    lastDailyRewardDate: null,
    dailyStreak: 0,
  };
}

export async function getSetting(key: string): Promise<boolean> {
  const val = await AsyncStorage.getItem(key);
  return val === 'true';
}

export async function setSetting(key: string, value: boolean): Promise<void> {
  await AsyncStorage.setItem(key, value.toString());
}

export async function getAdWatchCount(): Promise<number> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.AD_WATCH_COUNT);
  if (!json) return 0;
  try {
    const data = JSON.parse(json);
    const today = new Date().toISOString().split('T')[0];
    if (data.date !== today) return 0;
    return data.count;
  } catch {
    return 0;
  }
}

export async function incrementAdWatchCount(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const current = await getAdWatchCount();
  await AsyncStorage.setItem(
    STORAGE_KEYS.AD_WATCH_COUNT,
    JSON.stringify({ date: today, count: current + 1 })
  );
}
