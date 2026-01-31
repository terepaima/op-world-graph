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
