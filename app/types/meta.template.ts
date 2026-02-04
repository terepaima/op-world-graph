import type { Meta } from './types';

export const META_TEMPLATE: Meta = {
  version: '0.1.0',
  generatedAt: new Date().toISOString(),
  source: {
    provider: 'api-onepiece.com',
    notes: 'Planned meta config for legend/filters',
  },
  display: {
    nodes: [
      { type: 'crew', label: 'Crews', defaultVisible: true },
      { type: 'character', label: 'Characters', defaultVisible: false },
      { type: 'org', label: 'Organizations', defaultVisible: true },
    ],
    relationships: [
      { type: 'membership', label: 'Membership', defaultVisible: true },
      { type: 'ally', label: 'Ally', defaultVisible: true },
      { type: 'enemy', label: 'Enemy', defaultVisible: true },
      { type: 'family', label: 'Family', defaultVisible: false },
      { type: 'mentor', label: 'Mentor', defaultVisible: false, isDirected: true },
      { type: 'rival', label: 'Rival', defaultVisible: false },
      { type: 'subordinate', label: 'Subordinate', defaultVisible: false, isDirected: true },
    ],
  },
};
