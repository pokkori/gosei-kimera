import { Tournament, TournamentMatch, EnemyDef } from '../types';
import { ENEMY_DATA } from '../data/enemies';

export function createTournament(
  playerPower: number,
  arenaRank: number
): Tournament {
  const today = new Date().toISOString().split('T')[0];

  const qfEnemy = selectEnemy(playerPower * 0.9, playerPower * 1.1, arenaRank);
  const sfEnemy = selectEnemy(playerPower * 1.0, playerPower * 1.2, arenaRank);
  const fEnemy  = selectEnemy(playerPower * 1.1, playerPower * 1.3, arenaRank);

  const matches: TournamentMatch[] = [
    { matchId: `${today}_qf`, phase: 'quarter', enemyId: qfEnemy.id, result: null },
    { matchId: `${today}_sf`, phase: 'semi',    enemyId: sfEnemy.id, result: null },
    { matchId: `${today}_f`,  phase: 'final',   enemyId: fEnemy.id,  result: null },
  ];

  return {
    id: today,
    startedAt: new Date().toISOString(),
    matches,
    currentPhase: 'quarter',
    completed: false,
  };
}

function selectEnemy(minPower: number, maxPower: number, arenaRank: number): EnemyDef {
  const candidates = ENEMY_DATA.filter(e => {
    const power = e.totalStats.atk + e.totalStats.hp + e.totalStats.spd;
    return power >= minPower && power <= maxPower && e.arenaRank <= arenaRank + 2;
  });

  if (candidates.length === 0) {
    const fallback = ENEMY_DATA.filter(e => e.arenaRank <= arenaRank + 2);
    if (fallback.length === 0) {
      return ENEMY_DATA[0];
    }
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const TOURNAMENT_REWARDS: Record<string, { coins: number; minRarity: number }> = {
  'quarter_lose': { coins: 100, minRarity: 0 },
  'semi_lose':    { coins: 200, minRarity: 1 },
  'final_lose':   { coins: 300, minRarity: 2 },
  'champion':     { coins: 500, minRarity: 3 },
};
