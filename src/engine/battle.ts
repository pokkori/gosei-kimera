import { Stats, BattleResult, BattleTurn } from '../types';
import { GAME_CONFIG } from '../constants/config';

const SLOT_BONUS_MULTIPLIER = GAME_CONFIG.SLOT_BONUS_MULTIPLIER;

export function calculateChimeraStats(
  headStats: Stats | null,
  bodyStats: Stats | null,
  legsStats: Stats | null
): Stats {
  let atk = 0, hp = 0, spd = 0;

  if (headStats) {
    atk += Math.floor(headStats.atk * SLOT_BONUS_MULTIPLIER);
    hp += headStats.hp;
    spd += headStats.spd;
  }
  if (bodyStats) {
    atk += bodyStats.atk;
    hp += Math.floor(bodyStats.hp * SLOT_BONUS_MULTIPLIER);
    spd += bodyStats.spd;
  }
  if (legsStats) {
    atk += legsStats.atk;
    hp += legsStats.hp;
    spd += Math.floor(legsStats.spd * SLOT_BONUS_MULTIPLIER);
  }

  return { atk, hp, spd };
}

export function executeBattle(
  player: Stats,
  enemy: Stats
): BattleResult {
  let playerHp = player.hp;
  let enemyHp = enemy.hp;
  const turns: BattleTurn[] = [];

  let playerFirst: boolean;
  if (player.spd !== enemy.spd) {
    playerFirst = player.spd > enemy.spd;
  } else {
    playerFirst = Math.random() < 0.5;
  }

  const MAX_TURNS = GAME_CONFIG.MAX_TURNS;

  for (let i = 0; i < MAX_TURNS; i++) {
    const isPlayerTurn = (i % 2 === 0) === playerFirst;

    if (isPlayerTurn) {
      const { damage, isCritical } = calculateDamage(player.atk);
      enemyHp = Math.max(0, enemyHp - damage);
      turns.push({ turn: i + 1, attacker: 'player', damage, remainingHp: enemyHp, isCritical });
      if (enemyHp <= 0) break;
    } else {
      const { damage, isCritical } = calculateDamage(enemy.atk);
      playerHp = Math.max(0, playerHp - damage);
      turns.push({ turn: i + 1, attacker: 'enemy', damage, remainingHp: playerHp, isCritical });
      if (playerHp <= 0) break;
    }
  }

  let winner: 'player' | 'enemy' | 'draw';
  if (enemyHp <= 0 && playerHp > 0) {
    winner = 'player';
  } else if (playerHp <= 0 && enemyHp > 0) {
    winner = 'enemy';
  } else if (playerHp <= 0 && enemyHp <= 0) {
    winner = 'draw';
  } else {
    const playerRatio = player.hp > 0 ? playerHp / player.hp : 0;
    const enemyRatio = enemy.hp > 0 ? enemyHp / enemy.hp : 0;
    if (Math.abs(playerRatio - enemyRatio) < GAME_CONFIG.DRAW_THRESHOLD) {
      winner = 'draw';
    } else {
      winner = playerRatio > enemyRatio ? 'player' : 'enemy';
    }
  }

  return {
    winner,
    turns,
    playerFinalHp: playerHp,
    enemyFinalHp: enemyHp,
    rewardPart: null,
    coinsEarned: 0,
    timestamp: new Date().toISOString(),
  };
}

function calculateDamage(atk: number): { damage: number; isCritical: boolean } {
  const baseMultiplier = GAME_CONFIG.DAMAGE_MIN_MULTIPLIER +
    Math.random() * (GAME_CONFIG.DAMAGE_MAX_MULTIPLIER - GAME_CONFIG.DAMAGE_MIN_MULTIPLIER);
  const isCritical = Math.random() < GAME_CONFIG.CRITICAL_CHANCE;
  const critMultiplier = isCritical ? GAME_CONFIG.CRITICAL_MULTIPLIER : 1.0;
  const damage = Math.max(1, Math.floor(atk * baseMultiplier * critMultiplier));
  return { damage, isCritical };
}
