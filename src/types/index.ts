// ========================================
// Part Types
// ========================================

export type PartType = 'head' | 'body' | 'arms' | 'legs' | 'wings' | 'tail';

export type SlotType = 'head' | 'body' | 'legs';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export const RARITY_INDEX: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'コモン',
  uncommon: 'アンコモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンダリー',
};

// ========================================
// Part Definitions
// ========================================

export type PartSpecies = 'dragon' | 'phoenix' | 'kraken';

export interface Stats {
  atk: number;
  hp: number;
  spd: number;
}

export interface PartDef {
  id: string;
  type: PartType;
  species: PartSpecies;
  rarity: Rarity;
  stats: Stats;
  emoji: string;
  name: string;
  description: string;
  svgKey: string;
}

export interface PartInstance {
  instanceId: string;
  defId: string;
  acquiredAt: string;
  locked: boolean;
}

// ========================================
// Chimera
// ========================================

export interface ChimeraSlots {
  head: string | null;
  body: string | null;
  legs: string | null;
}

export interface ChimeraDef {
  name: string;
  slots: ChimeraSlots;
  totalStats: Stats;
  power: number;
}

// ========================================
// Battle
// ========================================

export interface BattleTurn {
  turn: number;
  attacker: 'player' | 'enemy';
  damage: number;
  remainingHp: number;
  isCritical: boolean;
}

export interface BattleResult {
  winner: 'player' | 'enemy' | 'draw';
  turns: BattleTurn[];
  playerFinalHp: number;
  enemyFinalHp: number;
  rewardPart: PartInstance | null;
  coinsEarned: number;
  timestamp: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  slotDefIds: { head: string; body: string; legs: string };
  totalStats: Stats;
  emoji: string;
  arenaRank: number;
}

// ========================================
// Tournament
// ========================================

export type TournamentPhase = 'idle' | 'quarter' | 'semi' | 'final' | 'champion';

export interface TournamentMatch {
  matchId: string;
  phase: TournamentPhase;
  enemyId: string;
  result: BattleResult | null;
}

export interface Tournament {
  id: string;
  startedAt: string;
  matches: TournamentMatch[];
  currentPhase: TournamentPhase;
  completed: boolean;
}

// ========================================
// Game State
// ========================================

export interface BattleRecord {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  maxWinStreak: number;
  currentWinStreak: number;
  tournamentWins: number;
}

export interface GameState {
  inventory: PartInstance[];
  inventoryLimit: number;
  chimera: ChimeraDef;
  record: BattleRecord;
  coins: number;
  codexDiscovered: string[];
  currentTournament: Tournament | null;
  arenaRank: number;
  totalMerges: number;
  lastPlayedAt: string;
  tutorialCompleted: boolean;
  adFree: boolean;
  achievementsUnlocked: string[];
  lastDailyRewardDate: string | null;
  dailyStreak: number;
}

// ========================================
// Store Actions
// ========================================

export interface GameActions {
  addPart: (part: PartInstance) => void;
  removePart: (instanceId: string) => void;
  mergeParts: (instanceId1: string, instanceId2: string) => PartInstance | null;
  equipPart: (slot: SlotType, instanceId: string) => void;
  unequipPart: (slot: SlotType) => void;
  renameChimera: (name: string) => void;
  executeBattle: (enemy: EnemyDef) => BattleResult;
  addCoins: (amount: number) => void;
  discoverPart: (defId: string) => void;
  startTournament: () => void;
  advanceTournament: (result: BattleResult) => void;
  claimDailyReward: () => PartInstance;
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  resetGame: () => void;
}

// ========================================
// UI Types
// ========================================

export interface DragState {
  draggingPartId: string | null;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  dropTarget: 'merge' | SlotType | null;
}
