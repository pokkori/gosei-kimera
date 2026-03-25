import { PartInstance, PartDef, Rarity, RARITY_INDEX, PartSpecies } from '../types';
import { PARTS_DATA } from '../data/parts';
import { generateUUID } from '../utils/uuid';

export function canMerge(part1: PartDef, part2: PartDef): boolean {
  if (part1.type !== part2.type) return false;
  if (part1.rarity !== part2.rarity) return false;
  if (part1.rarity === 'legendary') return false;
  return true;
}

export function executeMerge(
  instance1: PartInstance,
  instance2: PartInstance,
  allParts: PartDef[] = PARTS_DATA
): PartInstance | null {
  const def1 = allParts.find(p => p.id === instance1.defId);
  const def2 = allParts.find(p => p.id === instance2.defId);
  if (!def1 || !def2) return null;
  if (!canMerge(def1, def2)) return null;

  const nextRarity = getNextRarity(def1.rarity);
  if (!nextRarity) return null;

  const resultSpecies = determineSpecies(def1.species, def2.species);
  const newDefId = `${def1.type}_${resultSpecies}_${RARITY_INDEX[nextRarity]}`;
  const newDef = allParts.find(p => p.id === newDefId);
  if (!newDef) return null;

  const newInstance: PartInstance = {
    instanceId: generateUUID(),
    defId: newDefId,
    acquiredAt: new Date().toISOString(),
    locked: false,
  };

  return newInstance;
}

function getNextRarity(current: Rarity): Rarity | null {
  const order: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const idx = order.indexOf(current);
  if (idx >= order.length - 1) return null;
  return order[idx + 1];
}

function determineSpecies(s1: PartSpecies, s2: PartSpecies): PartSpecies {
  if (s1 === s2) return s1;
  return Math.random() < 0.5 ? s1 : s2;
}
