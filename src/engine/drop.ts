import { Rarity, PartType, PartSpecies, RARITY_INDEX, PartInstance } from '../types';
import { generateUUID } from '../utils/uuid';

const DROP_TABLE: Record<number, number[]> = {
  1:  [0.60, 0.90, 0.98, 0.998, 1.0],
  2:  [0.60, 0.90, 0.98, 0.998, 1.0],
  3:  [0.45, 0.80, 0.95, 0.99,  1.0],
  4:  [0.45, 0.80, 0.95, 0.99,  1.0],
  5:  [0.30, 0.65, 0.90, 0.98,  1.0],
  6:  [0.30, 0.65, 0.90, 0.98,  1.0],
  7:  [0.15, 0.45, 0.80, 0.95,  1.0],
  8:  [0.15, 0.45, 0.80, 0.95,  1.0],
  9:  [0.05, 0.25, 0.65, 0.90,  1.0],
  10: [0.05, 0.25, 0.65, 0.90,  1.0],
};

const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const EQUIP_TYPES: PartType[] = ['head', 'body', 'legs'];
const SPECIES: PartSpecies[] = ['dragon', 'phoenix', 'kraken'];

export function generateRewardPart(arenaRank: number): { defId: string; rarity: Rarity } {
  const table = DROP_TABLE[Math.min(Math.max(arenaRank, 1), 10)];
  const roll = Math.random();

  let rarity: Rarity = 'common';
  for (let i = 0; i < table.length; i++) {
    if (roll < table[i]) {
      rarity = RARITIES[i];
      break;
    }
  }

  const type = EQUIP_TYPES[Math.floor(Math.random() * EQUIP_TYPES.length)];
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  const defId = `${type}_${species}_${RARITY_INDEX[rarity]}`;

  return { defId, rarity };
}

export function generateRewardPartInstance(arenaRank: number): PartInstance {
  const { defId } = generateRewardPart(arenaRank);
  return {
    instanceId: generateUUID(),
    defId,
    acquiredAt: new Date().toISOString(),
    locked: false,
  };
}

export function calculateCoinReward(arenaRank: number, winStreak: number): number {
  const base = 50 + arenaRank * 20;
  const streakBonus = Math.min(winStreak * 0.1, 0.5);
  return Math.floor(base * (1 + streakBonus));
}

// Gacha tables
export function generateGachaPart(premium: boolean): PartInstance {
  let rarity: Rarity;
  const roll = Math.random();

  if (premium) {
    // Uncommon40%/Rare35%/Epic20%/Legendary5%
    if (roll < 0.40) rarity = 'uncommon';
    else if (roll < 0.75) rarity = 'rare';
    else if (roll < 0.95) rarity = 'epic';
    else rarity = 'legendary';
  } else {
    // Common70%/Uncommon25%/Rare5%
    if (roll < 0.70) rarity = 'common';
    else if (roll < 0.95) rarity = 'uncommon';
    else rarity = 'rare';
  }

  const type = EQUIP_TYPES[Math.floor(Math.random() * EQUIP_TYPES.length)];
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  const defId = `${type}_${species}_${RARITY_INDEX[rarity]}`;

  return {
    instanceId: generateUUID(),
    defId,
    acquiredAt: new Date().toISOString(),
    locked: false,
  };
}
