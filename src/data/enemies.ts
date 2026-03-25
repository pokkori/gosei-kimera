import { EnemyDef } from '../types';

export const ENEMY_DATA: EnemyDef[] = [
  // --- Rank 1 ---
  { id: 'enemy_r1_1', name: '\u30D7\u30C1\u30B9\u30E9\u30A4\u30E0', slotDefIds: { head: 'head_kraken_0', body: 'body_kraken_0', legs: 'legs_kraken_0' }, totalStats: { atk: 16, hp: 45, spd: 15 }, emoji: '\u{1F419}\u{1FAE7}\u{1F991}', arenaRank: 1 },
  { id: 'enemy_r1_2', name: '\u30B3\u30D2\u30C4\u30B8', slotDefIds: { head: 'head_phoenix_0', body: 'body_phoenix_0', legs: 'legs_phoenix_0' }, totalStats: { atk: 18, hp: 23, spd: 34 }, emoji: '\u{1F426}\u{1FAB6}\u{1F424}', arenaRank: 1 },
  { id: 'enemy_r1_3', name: '\u30EF\u30AB\u30C8\u30AB\u30B2', slotDefIds: { head: 'head_dragon_0', body: 'body_dragon_0', legs: 'legs_dragon_0' }, totalStats: { atk: 25, hp: 30, spd: 18 }, emoji: '\u{1F432}\u{1F7E4}\u{1F98E}', arenaRank: 1 },
  // --- Rank 2 ---
  { id: 'enemy_r2_1', name: '\u30B0\u30EA\u30FC\u30F3\u30B3\u30D6\u30E9', slotDefIds: { head: 'head_dragon_1', body: 'body_kraken_0', legs: 'legs_phoenix_0' }, totalStats: { atk: 30, hp: 40, spd: 30 }, emoji: '\u{1F432}\u{1FAE7}\u{1F424}', arenaRank: 2 },
  { id: 'enemy_r2_2', name: '\u30A2\u30AA\u30B5\u30AE', slotDefIds: { head: 'head_phoenix_1', body: 'body_phoenix_0', legs: 'legs_kraken_0' }, totalStats: { atk: 25, hp: 28, spd: 42 }, emoji: '\u{1F985}\u{1FAB6}\u{1F991}', arenaRank: 2 },
  { id: 'enemy_r2_3', name: '\u30C4\u30CE\u30A4\u30E2\u30EA', slotDefIds: { head: 'head_kraken_1', body: 'body_dragon_0', legs: 'legs_dragon_0' }, totalStats: { atk: 28, hp: 43, spd: 22 }, emoji: '\u{1F419}\u{1F7E4}\u{1F98E}', arenaRank: 2 },
  // --- Rank 3 ---
  { id: 'enemy_r3_1', name: '\u30D5\u30A1\u30A4\u30A2\u30D3\u30FC\u30C8\u30EB', slotDefIds: { head: 'head_dragon_1', body: 'body_dragon_1', legs: 'legs_phoenix_1' }, totalStats: { atk: 41, hp: 54, spd: 42 }, emoji: '\u{1F432}\u{1F536}\u{1F9B6}', arenaRank: 3 },
  { id: 'enemy_r3_2', name: '\u30B7\u30FC\u30B9\u30CD\u30FC\u30AF', slotDefIds: { head: 'head_kraken_1', body: 'body_kraken_1', legs: 'legs_phoenix_1' }, totalStats: { atk: 28, hp: 68, spd: 41 }, emoji: '\u{1F419}\u{1FAE7}\u{1F9B6}', arenaRank: 3 },
  { id: 'enemy_r3_3', name: '\u30A6\u30A3\u30F3\u30C9\u30DB\u30FC\u30AF', slotDefIds: { head: 'head_phoenix_1', body: 'body_phoenix_1', legs: 'legs_dragon_1' }, totalStats: { atk: 36, hp: 41, spd: 58 }, emoji: '\u{1F985}\u{1FAB6}\u{1F98E}', arenaRank: 3 },
  // --- Rank 4 ---
  { id: 'enemy_r4_1', name: '\u30C9\u30EC\u30A4\u30AF\u30CA\u30A4\u30C8', slotDefIds: { head: 'head_dragon_2', body: 'body_kraken_1', legs: 'legs_dragon_1' }, totalStats: { atk: 59, hp: 59, spd: 49 }, emoji: '\u{1F409}\u{1FAE7}\u{1F98E}', arenaRank: 4 },
  { id: 'enemy_r4_2', name: '\u30C7\u30A3\u30FC\u30D7\u30B7\u30FC\u30AB\u30FC', slotDefIds: { head: 'head_kraken_2', body: 'body_kraken_1', legs: 'legs_kraken_1' }, totalStats: { atk: 38, hp: 93, spd: 31 }, emoji: '\u{1F991}\u{1FAE7}\u{1F991}', arenaRank: 4 },
  { id: 'enemy_r4_3', name: '\u30B9\u30AB\u30A4\u30C0\u30F3\u30B5\u30FC', slotDefIds: { head: 'head_phoenix_1', body: 'body_phoenix_1', legs: 'legs_phoenix_2' }, totalStats: { atk: 35, hp: 40, spd: 80 }, emoji: '\u{1F985}\u{1FAB6}\u{1F9B6}', arenaRank: 4 },
  // --- Rank 5 ---
  { id: 'enemy_r5_1', name: '\u30D5\u30EC\u30A4\u30E0\u30D0\u30ED\u30F3', slotDefIds: { head: 'head_dragon_2', body: 'body_dragon_2', legs: 'legs_phoenix_2' }, totalStats: { atk: 68, hp: 83, spd: 68 }, emoji: '\u{1F409}\u{1F536}\u{1F9B6}', arenaRank: 5 },
  { id: 'enemy_r5_2', name: '\u30A2\u30D3\u30B9\u30AC\u30FC\u30C9', slotDefIds: { head: 'head_kraken_2', body: 'body_kraken_2', legs: 'legs_kraken_2' }, totalStats: { atk: 38, hp: 135, spd: 44 }, emoji: '\u{1F991}\u{1F30A}\u{1F419}', arenaRank: 5 },
  { id: 'enemy_r5_3', name: '\u30B5\u30F3\u30C0\u30FC\u30DB\u30FC\u30AF', slotDefIds: { head: 'head_phoenix_2', body: 'body_phoenix_2', legs: 'legs_phoenix_2' }, totalStats: { atk: 54, hp: 61, spd: 96 }, emoji: '\u{1F985}\u{1F525}\u{1F9B6}', arenaRank: 5 },
  // --- Rank 6 ---
  { id: 'enemy_r6_1', name: '\u30D6\u30EC\u30A4\u30BA\u30C9\u30E9\u30B4\u30F3', slotDefIds: { head: 'head_dragon_2', body: 'body_dragon_2', legs: 'legs_dragon_2' }, totalStats: { atk: 75, hp: 90, spd: 52 }, emoji: '\u{1F409}\u{1F536}\u{1F43E}', arenaRank: 6 },
  { id: 'enemy_r6_2', name: '\u30BF\u30A4\u30C0\u30EB\u30ED\u30FC\u30C9', slotDefIds: { head: 'head_kraken_2', body: 'body_kraken_2', legs: 'legs_dragon_2' }, totalStats: { atk: 53, hp: 120, spd: 52 }, emoji: '\u{1F991}\u{1F30A}\u{1F43E}', arenaRank: 6 },
  { id: 'enemy_r6_3', name: '\u30BD\u30FC\u30E9\u30FC\u30D0\u30FC\u30C9', slotDefIds: { head: 'head_phoenix_2', body: 'body_phoenix_2', legs: 'legs_phoenix_2' }, totalStats: { atk: 54, hp: 61, spd: 96 }, emoji: '\u{1F985}\u{1F525}\u{1F9B6}', arenaRank: 6 },
  // --- Rank 7 ---
  { id: 'enemy_r7_1', name: '\u30C9\u30E9\u30B4\u30F3\u30ED\u30FC\u30C9', slotDefIds: { head: 'head_dragon_3', body: 'body_dragon_2', legs: 'legs_dragon_2' }, totalStats: { atk: 95, hp: 100, spd: 52 }, emoji: '\u{1F409}\u{1F536}\u{1F43E}', arenaRank: 7 },
  { id: 'enemy_r7_2', name: '\u30C7\u30A3\u30FC\u30D7\u30B7\u30FC\u30AD\u30F3\u30B0', slotDefIds: { head: 'head_kraken_3', body: 'body_kraken_2', legs: 'legs_kraken_2' }, totalStats: { atk: 58, hp: 155, spd: 44 }, emoji: '\u{1F991}\u{1F30A}\u{1F419}', arenaRank: 7 },
  { id: 'enemy_r7_3', name: '\u30D5\u30EC\u30A4\u30E0\u30A8\u30F3\u30DA\u30E9\u30FC', slotDefIds: { head: 'head_phoenix_3', body: 'body_phoenix_2', legs: 'legs_phoenix_2' }, totalStats: { atk: 79, hp: 69, spd: 111 }, emoji: '\u{1F525}\u{1F525}\u{1F9B6}', arenaRank: 7 },
  // --- Rank 8 ---
  { id: 'enemy_r8_1', name: '\u30A4\u30F3\u30D5\u30A7\u30EB\u30CE\u30C9\u30E9\u30B4\u30F3', slotDefIds: { head: 'head_dragon_3', body: 'body_dragon_3', legs: 'legs_dragon_2' }, totalStats: { atk: 115, hp: 140, spd: 52 }, emoji: '\u{1F409}\u{1F7E0}\u{1F43E}', arenaRank: 8 },
  { id: 'enemy_r8_2', name: '\u30A2\u30D3\u30B9\u30A8\u30F3\u30DA\u30E9\u30FC', slotDefIds: { head: 'head_kraken_3', body: 'body_kraken_3', legs: 'legs_kraken_2' }, totalStats: { atk: 71, hp: 205, spd: 44 }, emoji: '\u{1F991}\u{1F30A}\u{1F419}', arenaRank: 8 },
  { id: 'enemy_r8_3', name: '\u30D5\u30A7\u30CB\u30C3\u30AF\u30B9\u30ED\u30FC\u30C9', slotDefIds: { head: 'head_phoenix_3', body: 'body_phoenix_3', legs: 'legs_phoenix_2' }, totalStats: { atk: 84, hp: 96, spd: 126 }, emoji: '\u{1F525}\u{1F525}\u{1F9B6}', arenaRank: 8 },
  // --- Rank 9 ---
  { id: 'enemy_r9_1', name: '\u53E4\u7ADC\u30A8\u30EB\u30C0\u30FC', slotDefIds: { head: 'head_dragon_3', body: 'body_dragon_3', legs: 'legs_dragon_3' }, totalStats: { atk: 125, hp: 150, spd: 86 }, emoji: '\u{1F409}\u{1F7E0}\u{1F43E}', arenaRank: 9 },
  { id: 'enemy_r9_2', name: '\u6DF1\u6D77\u7687\u30CD\u30E1\u30B7\u30B9', slotDefIds: { head: 'head_kraken_3', body: 'body_kraken_3', legs: 'legs_kraken_3' }, totalStats: { atk: 76, hp: 225, spd: 73 }, emoji: '\u{1F991}\u{1F30A}\u{1F419}', arenaRank: 9 },
  { id: 'enemy_r9_3', name: '\u7159\u7130\u7687\u30D5\u30EC\u30A2', slotDefIds: { head: 'head_phoenix_3', body: 'body_phoenix_3', legs: 'legs_phoenix_3' }, totalStats: { atk: 89, hp: 101, spd: 161 }, emoji: '\u{1F525}\u{1F525}\u{1F4A8}', arenaRank: 9 },
  // --- Rank 10 ---
  { id: 'enemy_r10_1', name: '\u8987\u7ADC\u30AB\u30A4\u30B6\u30FC', slotDefIds: { head: 'head_dragon_4', body: 'body_dragon_4', legs: 'legs_dragon_4' }, totalStats: { atk: 200, hp: 240, spd: 136 }, emoji: '\u{1F409}\u{1F7E0}\u{1F43E}', arenaRank: 10 },
  { id: 'enemy_r10_2', name: '\u6DF1\u6DF5\u738B\u30CD\u30D7\u30C1\u30E5\u30FC\u30F3', slotDefIds: { head: 'head_kraken_4', body: 'body_kraken_4', legs: 'legs_kraken_4' }, totalStats: { atk: 120, hp: 360, spd: 115 }, emoji: '\u{1F991}\u{1F30A}\u{1F419}', arenaRank: 10 },
  { id: 'enemy_r10_3', name: '\u6C38\u52AB\u9CE5\u30A2\u30DE\u30C6\u30E9\u30B9', slotDefIds: { head: 'head_phoenix_4', body: 'body_phoenix_4', legs: 'legs_phoenix_4' }, totalStats: { atk: 140, hp: 160, spd: 260 }, emoji: '\u{1F525}\u{1F525}\u{1F4A8}', arenaRank: 10 },
];
