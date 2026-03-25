import { Stats, ChimeraDef, ChimeraSlots, PartInstance } from '../types';
import { getPartDef } from '../data/parts';
import { calculateChimeraStats } from './battle';

export function recalculateChimera(
  chimera: ChimeraDef,
  inventory: PartInstance[]
): ChimeraDef {
  const headInstance = chimera.slots.head
    ? inventory.find(p => p.instanceId === chimera.slots.head)
    : null;
  const bodyInstance = chimera.slots.body
    ? inventory.find(p => p.instanceId === chimera.slots.body)
    : null;
  const legsInstance = chimera.slots.legs
    ? inventory.find(p => p.instanceId === chimera.slots.legs)
    : null;

  const headDef = headInstance ? getPartDef(headInstance.defId) : null;
  const bodyDef = bodyInstance ? getPartDef(bodyInstance.defId) : null;
  const legsDef = legsInstance ? getPartDef(legsInstance.defId) : null;

  const totalStats = calculateChimeraStats(
    headDef?.stats ?? null,
    bodyDef?.stats ?? null,
    legsDef?.stats ?? null
  );

  const power = totalStats.atk + totalStats.hp + totalStats.spd;

  return {
    ...chimera,
    totalStats,
    power,
  };
}
