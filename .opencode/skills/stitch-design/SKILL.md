---
name: stitch-design
description: Generate UI designs from images or prompts using Google Stitch MCP, then convert to React components
---

## What I do
- Fetch designs from your Stitch projects via MCP
- Convert Stitch HTML output to React + Tailwind components
- Match output to existing design tokens (--color-bg-base, --color-surface, etc.)

## When to use me
Use this when the user wants to:
- Turn a screenshot/image into code
- Generate UI from a description
- Import a Stitch design into the React project

## Workflow
1. Use `stitch_list_projects` to find the project
2. Use `stitch_list_screens` to see available screens
3. Use `stitch_get_screen_html` to get the HTML
4. Convert HTML → JSX, replace hardcoded colors with CSS variables
5. Place component in `src/pages/` or `src/components/`

## Design token mapping
| Stitch value | Replace with |
|---|---|
| `#080a14`, `#0A0C10` | `var(--color-bg-base)` |
| Dark surface colors | `var(--color-surface)` |
| Accent colors | `var(--color-accent)` |
| White text at low opacity | `text-[var(--color-text-secondary)]` |
