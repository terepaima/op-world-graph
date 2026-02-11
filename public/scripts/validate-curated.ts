import { readFileSync } from 'node:fs';
import type { RelationshipType } from '@/types/types';

export type CuratedEdgeInput = {
  source: string;
  target: string;
  type: RelationshipType;
  sinceArc?: string;
  note?: string;
};

const REL_TYPES: RelationshipType[] = [
  'membership',
  'ally',
  'enemy',
  'family',
  'mentor',
  'rival',
  'subordinate',
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function readCuratedEdges(path: string): CuratedEdgeInput[] {
  const raw = readFileSync(path, 'utf-8');
  const data = JSON.parse(raw);

  assert(Array.isArray(data), `[curated] Expected an array in ${path}`);

  data.forEach((e, i) => {
    assert(e && typeof e === 'object', `[curated] Entry #${i} must be an object`);
    assert(typeof e.source === 'string' && e.source.length > 0, `[curated] #${i} missing source`);
    assert(typeof e.target === 'string' && e.target.length > 0, `[curated] #${i} missing target`);
    assert(
      typeof e.type === 'string' && REL_TYPES.includes(e.type),
      `[curated] #${i} invalid type: ${e.type}`,
    );
    if (e.sinceArc != null)
      assert(typeof e.sinceArc === 'string', `[curated] #${i} sinceArc must be string`);
    if (e.note != null) assert(typeof e.note === 'string', `[curated] #${i} note must be string`);
  });

  // Deduplicate exact duplicates: source|target|type
  const seen = new Set<string>();
  data.forEach((e, i) => {
    const key = `${e.source}|${e.target}|${e.type}`;
    assert(!seen.has(key), `[curated] Duplicate edge at #${i}: ${key}`);
    seen.add(key);
  });

  return data as CuratedEdgeInput[];
}

export function validateCuratedEdgesNodesExist(curated: CuratedEdgeInput[], nodeIds: Set<string>) {
  curated.forEach((e, i) => {
    assert(nodeIds.has(e.source), `[curated] #${i} source not found in nodes: ${e.source}`);
    assert(nodeIds.has(e.target), `[curated] #${i} target not found in nodes: ${e.target}`);
  });
}
