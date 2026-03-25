import { create } from 'zustand';
import {
  GameState, GameActions, PartInstance, SlotType, EnemyDef,
  BattleResult, RARITY_INDEX,
} from '../types';
import { PARTS_DATA, getPartDef } from '../data/parts';
import { executeMerge } from '../engine/merge';
import { executeBattle } from '../engine/battle';
import { generateRewardPartInstance, calculateCoinReward } from '../engine/drop';
import { recalculateChimera } from '../engine/chimera';
import { createTournament } from '../engine/tournament';
import { saveGameState, loadGameState, createInitialGameState } from '../utils/storage';
import { generateUUID } from '../utils/uuid';

type Store = GameState & GameActions;

export const useGameStore = create<Store>((set, get) => ({
  ...createInitialGameState(),

  addPart: (part: PartInstance) => {
    set(state => {
      const newInventory = [...state.inventory, part];
      const newCodex = state.codexDiscovered.includes(part.defId)
        ? state.codexDiscovered
        : [...state.codexDiscovered, part.defId];
      return { inventory: newInventory, codexDiscovered: newCodex };
    });
  },

  removePart: (instanceId: string) => {
    set(state => {
      const newSlots = { ...state.chimera.slots };
      if (newSlots.head === instanceId) newSlots.head = null;
      if (newSlots.body === instanceId) newSlots.body = null;
      if (newSlots.legs === instanceId) newSlots.legs = null;
      const newInventory = state.inventory.filter(p => p.instanceId !== instanceId);
      const chimera = recalculateChimera({ ...state.chimera, slots: newSlots }, newInventory);
      return { inventory: newInventory, chimera };
    });
  },

  mergeParts: (instanceId1: string, instanceId2: string) => {
    const state = get();
    const inst1 = state.inventory.find(p => p.instanceId === instanceId1);
    const inst2 = state.inventory.find(p => p.instanceId === instanceId2);
    if (!inst1 || !inst2) return null;

    const result = executeMerge(inst1, inst2, PARTS_DATA);
    if (!result) return null;

    set(s => {
      const newSlots = { ...s.chimera.slots };
      if (newSlots.head === instanceId1 || newSlots.head === instanceId2) newSlots.head = null;
      if (newSlots.body === instanceId1 || newSlots.body === instanceId2) newSlots.body = null;
      if (newSlots.legs === instanceId1 || newSlots.legs === instanceId2) newSlots.legs = null;

      const newInventory = s.inventory
        .filter(p => p.instanceId !== instanceId1 && p.instanceId !== instanceId2)
        .concat(result);

      const newCodex = s.codexDiscovered.includes(result.defId)
        ? s.codexDiscovered
        : [...s.codexDiscovered, result.defId];

      const chimera = recalculateChimera({ ...s.chimera, slots: newSlots }, newInventory);

      return {
        inventory: newInventory,
        chimera,
        totalMerges: s.totalMerges + 1,
        codexDiscovered: newCodex,
      };
    });

    return result;
  },

  equipPart: (slot: SlotType, instanceId: string) => {
    set(state => {
      const newSlots = { ...state.chimera.slots, [slot]: instanceId };
      const chimera = recalculateChimera({ ...state.chimera, slots: newSlots }, state.inventory);
      return { chimera };
    });
  },

  unequipPart: (slot: SlotType) => {
    set(state => {
      const newSlots = { ...state.chimera.slots, [slot]: null };
      const chimera = recalculateChimera({ ...state.chimera, slots: newSlots }, state.inventory);
      return { chimera };
    });
  },

  renameChimera: (name: string) => {
    set(state => ({
      chimera: { ...state.chimera, name: name.slice(0, 10) },
    }));
  },

  executeBattle: (enemy: EnemyDef) => {
    const state = get();
    const result = executeBattle(state.chimera.totalStats, enemy.totalStats);

    const isWin = result.winner === 'player';
    const isDraw = result.winner === 'draw';

    let rewardPart: PartInstance | null = null;
    let coinsEarned = 0;

    if (isWin) {
      rewardPart = generateRewardPartInstance(state.arenaRank);
      coinsEarned = calculateCoinReward(state.arenaRank, state.record.currentWinStreak + 1);
    } else if (isDraw) {
      coinsEarned = 25;
    }

    result.rewardPart = rewardPart;
    result.coinsEarned = coinsEarned;

    set(s => {
      const newRecord = { ...s.record };
      newRecord.totalBattles += 1;
      if (isWin) {
        newRecord.wins += 1;
        newRecord.currentWinStreak += 1;
        newRecord.maxWinStreak = Math.max(newRecord.maxWinStreak, newRecord.currentWinStreak);
      } else if (isDraw) {
        newRecord.draws += 1;
        newRecord.currentWinStreak = 0;
      } else {
        newRecord.losses += 1;
        newRecord.currentWinStreak = 0;
      }

      const newInventory = rewardPart ? [...s.inventory, rewardPart] : s.inventory;
      const newCodex = rewardPart && !s.codexDiscovered.includes(rewardPart.defId)
        ? [...s.codexDiscovered, rewardPart.defId]
        : s.codexDiscovered;

      return {
        record: newRecord,
        coins: s.coins + coinsEarned,
        inventory: newInventory,
        codexDiscovered: newCodex,
      };
    });

    return result;
  },

  addCoins: (amount: number) => {
    set(s => ({ coins: Math.max(0, s.coins + amount) }));
  },

  discoverPart: (defId: string) => {
    set(s => {
      if (s.codexDiscovered.includes(defId)) return {};
      return { codexDiscovered: [...s.codexDiscovered, defId] };
    });
  },

  startTournament: () => {
    const state = get();
    const tournament = createTournament(state.chimera.power, state.arenaRank);
    set({ currentTournament: tournament });
  },

  advanceTournament: (result: BattleResult) => {
    set(s => {
      if (!s.currentTournament) return {};
      const tournament = { ...s.currentTournament };
      const matches = [...tournament.matches];
      const currentIdx = matches.findIndex(m => m.result === null);
      if (currentIdx === -1) return {};

      matches[currentIdx] = { ...matches[currentIdx], result };

      if (result.winner !== 'player') {
        return { currentTournament: { ...tournament, matches, completed: true } };
      }

      const phases: Array<typeof tournament.currentPhase> = ['quarter', 'semi', 'final', 'champion'];
      const phaseIdx = phases.indexOf(tournament.currentPhase);
      const nextPhase = phaseIdx < phases.length - 1 ? phases[phaseIdx + 1] : 'champion';

      return {
        currentTournament: {
          ...tournament,
          matches,
          currentPhase: nextPhase,
          completed: nextPhase === 'champion',
        },
      };
    });
  },

  claimDailyReward: () => {
    const today = new Date().toISOString().split('T')[0];
    const state = get();
    const isConsecutive = state.lastDailyRewardDate &&
      (new Date(today).getTime() - new Date(state.lastDailyRewardDate).getTime()) <= 86400000 * 1.5;

    const newStreak = isConsecutive ? state.dailyStreak + 1 : 1;
    const rewardPart = generateRewardPartInstance(Math.min(newStreak, 10));

    set(s => ({
      inventory: [...s.inventory, rewardPart],
      lastDailyRewardDate: today,
      dailyStreak: newStreak,
      coins: s.coins + newStreak * 10,
      codexDiscovered: s.codexDiscovered.includes(rewardPart.defId)
        ? s.codexDiscovered
        : [...s.codexDiscovered, rewardPart.defId],
    }));

    return rewardPart;
  },

  saveGame: async () => {
    const state = get();
    const {
      addPart, removePart, mergeParts, equipPart, unequipPart,
      renameChimera, executeBattle: _, addCoins, discoverPart,
      startTournament, advanceTournament, claimDailyReward,
      saveGame, loadGame, resetGame, ...gameState
    } = state;
    await saveGameState(gameState as GameState);
  },

  loadGame: async () => {
    const saved = await loadGameState();
    if (saved) {
      set(saved);
    }
  },

  resetGame: () => {
    set(createInitialGameState());
  },
}));
