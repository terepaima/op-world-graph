# OP World Graph (WIP) — One Piece relationship visualizer

Interactive graph explorer for crews/characters/affiliations and curated relationships.

Built to demonstrate skills: data-heavy UX, performance-first rendering, and clean architecture.

## Why this project...

One Piece is a perfect example of large data set that can be visuali stunning if shown properly.
Some goals to maintain during the development:

- progressive disclosure (show less first, reveal on intent)
- fast search & filtering
- performance-friendly rendering

## Architecture (high level)

- **Data pipeline (build-time):** fetch + normalize + validate → outputs `public/data/{nodes,edges,meta}.json`
- **Viz engine:** D3 computes layout & interactions
- **Renderer:** Canvas draws nodes/edges efficiently
- **UI state:** React/TypeScript + store for filters, selection, focus modes

## Data model

- `Node`: character | crew | org …
- `Edge`: membership | ally | enemy | family | mentor | rival | subordinate …
- `Meta`: legend labels + relationship display config

(See Issues #7 and #10 for current DoD and milestones.)

## Running locally

- pnpm run dev

## Roadmap

See GitHub Issues...

## Dev notes:

- `Prettier + Eslint` is installed to autoformat. Run manually with `pnpm run lint + pnpm run format`

## Data Pipeline

### How to add a crew to v1 dataset

The v1 dataset is controlled by `data/seedCrews.json`.

This keeps scope stable and guarantees a predictable graph size.

#### Step 1 — Add a new entry

Open `data/seedCrews.json` and append:

```json
{ "crewId": "<api crew id>", "label": "<Human name>", "group": "<Optional grouping>" }
```

#### Step 2 — Rebuild the dataset:

- pnpm data:build

#### Step 3 — Verify in the app:

Start the app and confirm the crew appears on /graph.

## Curated relationships (data/edges.curated.json)

Curated edges are handcrafted relationships that go beyond automatic membership links.

### Format

`data/edges.curated.json` is a JSON array. Each entry:

- `source` (required): node id (e.g. `character:luffy`)
- `target` (required): node id
- `type` (required): one of `membership | ally | enemy | family | mentor | rival | subordinate`
- `sinceArc` (optional): first arc where the relationship is relevant
- `note` (optional): short human note for context

### Examples (commented)

```jsonc
[
  // Mentor relationship (often treated as directed in UI)
  {
    "source": "character:rayleigh",
    "target": "character:luffy",
    "type": "mentor",
    "sinceArc": "Sabaody",
    "note": "Rayleigh trains Luffy during the timeskip.",
  },

  // Enemy relationship
  {
    "source": "character:luffy",
    "target": "character:blackbeard",
    "type": "enemy",
    "sinceArc": "Jaya",
  },
]
```

## Color pallete inspiration

https://colorhunt.co/palette/914f1edeac80f7dcb9b5c18e
