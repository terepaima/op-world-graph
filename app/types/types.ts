/**
 * Core domain types for the general web app interface.
 */
export interface SectionTitleProps {
  text1: string;
  text2: string;
  text3: string;
}

export interface TestimonialCardProps {
  testimonial: ITestimonial;
  index: number;
}

export interface ITestimonial {
  image: string;
  name: string;
  handle: string;
  date: string;
  quote: string;
}

export interface IFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IFooter {
  title: string;
  links: IFooterLink[];
}

export interface IFooterLink {
  name: string;
  href: string;
}

export interface NavbarProps {
  navlinks: INavLink[];
}

export interface INavLink {
  name: string;
  href: string;
}

/**
 * Core domain types for the One Piece World Graph.
 * These types are shared by:
 * - data build pipeline (scripts/build-data.ts)
 * - runtime app (/graph) for rendering + interaction
 */

// ---------- Node Types ----------

export type NodeType = 'crew' | 'character' | 'org';

/**
 * A stable Node id string.
 * Recommended convention:
 * - crew:<slug-or-api-id>
 * - character:<slug-or-api-id>
 * - org:<slug-or-api-id>
 */
export type NodeId = string;

export interface NodeBase {
  id: NodeId;
  type: NodeType;
  label: string;
  keywords?: string[];
  imageUrl?: string;
  subtitle?: string;
  source?: {
    provider: 'api-onepiece.com' | 'manual' | 'derived';
    rawId?: string | number;
    url?: string;
  };
}

export interface CrewNode extends NodeBase {
  type: 'crew';
  /** Display category for filtering (e.g., "Pirates", "Marines") */
  category?: string;
}

export interface CharacterStats {
  bounty?: number; // in berries
}

export interface CharacterNode extends NodeBase {
  type: 'character';
  /** Primary crew membership (if applicable) */
  crewId?: NodeId;
  stats?: CharacterStats;
}

export interface OrgNode extends NodeBase {
  type: 'org';
  category?: string;
}

export type Node = CrewNode | CharacterNode | OrgNode;

// ---------- Relationship / Edge Types ----------

export type RelationshipType =
  | 'membership'
  | 'ally'
  | 'enemy'
  | 'family'
  | 'mentor'
  | 'rival'
  | 'subordinate';

/**
 * Stable Edge id string.
 * Recommended convention:
 * edge:<type>:<sourceId>-><targetId>
 */
export type EdgeId = string;

export interface Edge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;

  type: RelationshipType;

  /**
   * membership edges are auto-generated from the dataset.
   * curated edges come from data/edges.curated.json
   */
  curated: boolean;

  /**
   * Optional: strength/importance for rendering or sorting.
   * Keep it small/simple to start (1..5 or 0..1).
   */
  weight?: number;

  /** Optional: human-friendly label used in UI ("Ally", "Enemy", etc.) */
  label?: string;

  /**
   * Optional: direction hint.
   * Most relationships can be treated as undirected visually,
   * but mentor/subordinate can benefit from direction.
   */
  direction?: 'directed' | 'undirected';

  /** Optional: provenance for debugging */
  evidence?: {
    note?: string;
    sourceUrl?: string;
  };
}

// ---------- Meta / Configuration Types ----------

export interface RelationshipDisplayConfig {
  type: RelationshipType;

  /** Label shown in legend & filters */
  label: string;

  /** Short helper text for “What am I seeing?” */
  description?: string;

  /**
   * Rendering hints (don’t encode actual colors here if you prefer,
   * but you can keep it as tokens).
   */
  style?: {
    /** e.g. "solid" | "dashed" */
    stroke?: 'solid' | 'dashed' | 'dotted';
    /** relative thickness token */
    width?: 'thin' | 'normal' | 'thick';
    /** optional priority: higher = drawn on top */
    zIndex?: number;
  };

  /** Default visibility in the graph */
  defaultVisible: boolean;

  /**
   * Whether filtering should treat it as directed.
   * Useful if you want "mentor -> mentee" semantics later.
   */
  isDirected?: boolean;
}

export interface NodeDisplayConfig {
  type: NodeType;
  label: string; // "Crew", "Character", "Organization"
  defaultVisible: boolean;
}

export interface MetaCounts {
  nodesTotal: number;
  edgesTotal: number;
  nodesByType: Record<NodeType, number>;
  edgesByType: Record<RelationshipType, number>;
}

export interface Meta {
  version: string;
  generatedAt: string; // ISO string
  source: {
    provider: 'api-onepiece.com';
    notes?: string;
  };

  /**
   * Planned UI/legend config.
   * This is what the app reads to render legend labels, filter toggles, etc.
   */
  display: {
    nodes: NodeDisplayConfig[];
    relationships: RelationshipDisplayConfig[];
  };

  /**
   * Optional data quality & dataset sizing stats.
   * Good for case study + debugging.
   */
  counts?: MetaCounts;
}

// ---------- Helpers (optional but handy) ----------

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  'membership',
  'ally',
  'enemy',
  'family',
  'mentor',
  'rival',
  'subordinate',
];
