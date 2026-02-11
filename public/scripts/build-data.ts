import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Edge, Meta, Node, RelationshipType } from '@/types/types';
import { readCuratedEdges, validateCuratedEdgesNodesExist } from './validate-curated';

type SeedCrew = {
  crewId: number; // api-onepiece crew id (int)
  label: string;
  group?: string;
};

type ApiCrew = {
  id: number;
  name: string;
  description?: string;
  status?: string;
  roman_name?: string;
  total_prime?: string;
  is_yonko?: string;
};

type ApiCharacter = {
  id: number;
  name: string;
  job?: string;
  bounty?: string;
  status?: string;
  crew?: { id: number; name: string };
};

const API_BASE = 'https://api.api-onepiece.com/v2';
const LANG = 'en';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toNodeId(
  type: 'crew' | 'character' | 'org',
  rawId: number | string,
  fallbackLabel?: string,
) {
  // Keep stable ids:
  // crew:crew-<id> is safest (since API id is numeric)
  // character:char-<id>
  const suffix =
    typeof rawId === 'number'
      ? String(rawId)
      : fallbackLabel
        ? slugify(fallbackLabel)
        : String(rawId);
  return `${type}:${type === 'crew' ? 'crew' : type === 'character' ? 'char' : 'org'}-${suffix}`;
}

async function fetchJson<T>(url: string, opts?: { retries?: number }): Promise<T> {
  const retries = opts?.retries ?? 2;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (res.ok) return (await res.json()) as T;

    const text = await res.text().catch(() => '');
    if (attempt === retries) {
      throw new Error(`Fetch failed: ${url}\nStatus: ${res.status}\nBody: ${text.slice(0, 400)}`);
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }

  // unreachable
  throw new Error(`Fetch failed: ${url}`);
}

function parseBounty(bounty?: string): number | undefined {
  if (!bounty) return undefined;
  // API returns bounty as string; keep only digits
  const digits = bounty.replace(/[^\d]/g, '');
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isFinite(n) ? n : undefined;
}

function edgeId(type: RelationshipType, source: string, target: string) {
  return `edge:${type}:${source}->${target}`;
}

function writeJson(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
}

// ---- Main ----
async function main() {
  const root = process.cwd();
  const seedPath = join(root, 'data', 'seedCrews.json');
  const curatedPath = join(root, 'data', 'edges.curated.json');

  const outDir = join(root, 'public', 'data');
  mkdirSync(outDir, { recursive: true });

  // 1) Read seeds
  const seedsRaw = JSON.parse(readFileSync(seedPath, 'utf-8')) as SeedCrew[];
  assert(
    Array.isArray(seedsRaw) && seedsRaw.length > 0,
    `[seed] seedCrews.json must be a non-empty array`,
  );

  seedsRaw.forEach((s, i) => {
    assert(typeof s.crewId === 'number', `[seed] #${i} crewId must be number (api crew id)`);
    assert(typeof s.label === 'string' && s.label.length > 0, `[seed] #${i} label required`);
    if (s.group != null) assert(typeof s.group === 'string', `[seed] #${i} group must be string`);
  });

  const seedIds = new Set(seedsRaw.map((s) => s.crewId));

  // 2) Fetch all crews
  const crewsUrl = `${API_BASE}/crews/${LANG}`;
  const allCrews = await fetchJson<ApiCrew[]>(crewsUrl); // doc: GET /v2/crews/en :contentReference[oaicite:2]{index=2}
  assert(Array.isArray(allCrews), `[api] Expected crews array from ${crewsUrl}`);

  // 3) Filter to seed crews
  const crews = allCrews.filter((c) => seedIds.has(c.id));
  const foundIds = new Set(crews.map((c) => c.id));
  const missing = [...seedIds].filter((id) => !foundIds.has(id));
  if (missing.length) {
    throw new Error(`[seed] Missing crew ids in API response: ${missing.join(', ')}`);
  }

  // 4) Build crew nodes
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const crewIdToNodeId = new Map<number, string>();

  for (const crew of crews) {
    const seed = seedsRaw.find((s) => s.crewId === crew.id)!;
    const id = toNodeId('crew', crew.id);
    crewIdToNodeId.set(crew.id, id);

    nodes.push({
      id,
      type: 'crew',
      label: seed.label || crew.name,
      subtitle: seed.group,
      keywords: [crew.name, crew.roman_name, seed.group].filter(Boolean) as string[],
      source: {
        provider: 'api-onepiece.com',
        rawId: crew.id,
        url: `${API_BASE}/crews/${LANG}/${crew.id}`,
      },
      category: seed.group,
    });
  }

  // 5) For each seed crew: fetch characters by crew id
  // Doc: GET /v2/characters/en/crew/{id} :contentReference[oaicite:3]{index=3}
  const allCharacterNodeIds = new Set<string>();

  for (const seed of seedsRaw) {
    const crewNodeId = crewIdToNodeId.get(seed.crewId)!;

    const charsUrl = `${API_BASE}/characters/${LANG}/crew/${seed.crewId}`;
    const chars = await fetchJson<ApiCharacter[]>(charsUrl);

    assert(Array.isArray(chars), `[api] Expected characters array from ${charsUrl}`);

    for (const ch of chars) {
      const charNodeId = toNodeId('character', ch.id);

      // Add character node (avoid dupes across crews)
      if (!allCharacterNodeIds.has(charNodeId)) {
        allCharacterNodeIds.add(charNodeId);

        nodes.push({
          id: charNodeId,
          type: 'character',
          label: ch.name,
          subtitle: ch.job,
          crewId: crewNodeId,
          keywords: [ch.name, ch.job, seed.label, seed.group].filter(Boolean) as string[],
          stats: { bounty: parseBounty(ch.bounty) },
          source: {
            provider: 'api-onepiece.com',
            rawId: ch.id,
            url: `${API_BASE}/characters/${LANG}/${ch.id}`,
          },
        });
      }

      // Auto edge: membership (character ↔ crew)
      edges.push({
        id: edgeId('membership', charNodeId, crewNodeId),
        source: charNodeId,
        target: crewNodeId,
        type: 'membership',
        curated: false,
        direction: 'undirected',
        label: 'Membership',
      });
    }
  }

  // 6) Curated edges: read + validate format
  const curated = readCuratedEdges(curatedPath);

  // 7) Validate curated node references exist
  const nodeIds = new Set(nodes.map((n) => n.id));
  validateCuratedEdgesNodesExist(curated, nodeIds);

  // 8) Merge curated edges into final edges (also dedupe vs membership)
  const existing = new Set(edges.map((e) => `${e.source}|${e.target}|${e.type}`));
  for (const ce of curated) {
    const key = `${ce.source}|${ce.target}|${ce.type}`;
    if (existing.has(key)) continue;

    edges.push({
      id: edgeId(ce.type, ce.source, ce.target),
      source: ce.source,
      target: ce.target,
      type: ce.type,
      curated: true,
      direction: ce.type === 'mentor' || ce.type === 'subordinate' ? 'directed' : 'undirected',
      label: ce.type,
      evidence: { note: ce.note },
    });

    existing.add(key);
  }

  // 9) Build meta.json (planned shape for legend/filter config)
  const relDisplay = (
    type: RelationshipType,
    label: string,
    defaultVisible: boolean,
    isDirected?: boolean,
  ) => ({
    type,
    label,
    defaultVisible,
    isDirected,
  });

  const meta: Meta = {
    version: '0.1.0',
    generatedAt: new Date().toISOString(),
    source: { provider: 'api-onepiece.com', notes: 'Seeded crews + curated relationships' },
    display: {
      nodes: [
        { type: 'crew', label: 'Crews', defaultVisible: true },
        { type: 'character', label: 'Characters', defaultVisible: false },
        { type: 'org', label: 'Organizations', defaultVisible: true },
      ],
      relationships: [
        relDisplay('membership', 'Membership', true, false),
        relDisplay('ally', 'Ally', true, false),
        relDisplay('enemy', 'Enemy', true, false),
        relDisplay('family', 'Family', false, false),
        relDisplay('mentor', 'Mentor', false, true),
        relDisplay('rival', 'Rival', false, false),
        relDisplay('subordinate', 'Subordinate', false, true),
      ],
    },
    counts: {
      nodesTotal: nodes.length,
      edgesTotal: edges.length,
      nodesByType: {
        crew: nodes.filter((n) => n.type === 'crew').length,
        character: nodes.filter((n) => n.type === 'character').length,
        org: nodes.filter((n) => n.type === 'org').length,
      },
      edgesByType: {
        membership: edges.filter((e) => e.type === 'membership').length,
        ally: edges.filter((e) => e.type === 'ally').length,
        enemy: edges.filter((e) => e.type === 'enemy').length,
        family: edges.filter((e) => e.type === 'family').length,
        mentor: edges.filter((e) => e.type === 'mentor').length,
        rival: edges.filter((e) => e.type === 'rival').length,
        subordinate: edges.filter((e) => e.type === 'subordinate').length,
      },
    },
  };

  // 10) Write output files
  writeJson(join(outDir, 'nodes.json'), nodes);
  writeJson(join(outDir, 'edges.json'), edges);
  writeJson(join(outDir, 'meta.json'), meta);

  console.log(`✅ Wrote:
- public/data/nodes.json (${nodes.length})
- public/data/edges.json (${edges.length})
- public/data/meta.json`);
}

main().catch((err) => {
  console.error('\n❌ data:build failed\n');
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
