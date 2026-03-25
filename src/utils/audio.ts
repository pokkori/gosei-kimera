// ============================================================
// audio.ts - BGM / SE 管理
// [ユーザーアクション待ち] assets/audio/ に以下のMP3を配置してください:
//   bgm_battle.mp3 / se_attack.mp3 / se_merge.mp3
//   se_victory.mp3 / se_defeat.mp3 / se_purchase.mp3
// 音声ファイルが存在しない間は Haptics フォールバックで動作します。
// ============================================================

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

let bgmSound: Audio.Sound | null = null;

async function setAudioMode(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
  } catch { /* 非対応環境はスキップ */ }
}

export async function playBGM(): Promise<void> {
  try {
    if (bgmSound) return; // 二重起動防止
    await setAudioMode();
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/bgm_battle.mp3'),
      { isLooping: true, volume: 0.4, shouldPlay: true },
    );
    bgmSound = sound;
  } catch {
    // 音声ファイル未配置またはexpo-av未対応時はスキップ
  }
}

export async function stopBGM(): Promise<void> {
  try {
    if (bgmSound) {
      await bgmSound.stopAsync();
      await bgmSound.unloadAsync();
      bgmSound = null;
    }
  } catch {
    bgmSound = null;
  }
}

export type SEType = 'attack' | 'merge' | 'victory' | 'defeat' | 'purchase';

export async function playSE(type: SEType): Promise<void> {
  try {
    // require() はビルド時解決のため静的に列挙
    const files: Record<SEType, ReturnType<typeof require>> = {
      attack:   require('../../assets/audio/se_attack.mp3'),
      merge:    require('../../assets/audio/se_merge.mp3'),
      victory:  require('../../assets/audio/se_victory.mp3'),
      defeat:   require('../../assets/audio/se_defeat.mp3'),
      purchase: require('../../assets/audio/se_purchase.mp3'),
    };
    const { sound } = await Audio.Sound.createAsync(
      files[type],
      { volume: 0.8, shouldPlay: true },
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch {
    // SE失敗時は Haptics フォールバック
    switch (type) {
      case 'attack':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        break;
      case 'merge':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        break;
      case 'victory':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        break;
      case 'defeat':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        break;
      case 'purchase':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        break;
    }
  }
}
