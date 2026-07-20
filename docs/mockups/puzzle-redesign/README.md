# Puzzle Section Redesign — Mockup

## Overview
Standalone HTML mockup demonstrating the redesigned puzzle section architecture inspired by Lichess.

## Structure

### 3 View States
1. **Category Selector** (`view-categories`) — 5 macro-categories as tabs + overview cards
2. **Subcategory Grid** (`view-subcategories`) — Grid of subcategories for selected category
3. **Puzzle List** (`view-puzzles`) — Filterable puzzle grid with difficulty filter

### 5 Macro-Categories
| Key | Label | Icon | Description |
|-----|-------|------|-------------|
| `mix` | Mix | 🎯 | All puzzles shuffled (Lichess "Healthy mix") |
| `phases` | Fasi di Gioco | 📚 | Opening, Middlegame, Endgame + specific endgames |
| `motifs` | Motivi Tattici | ⚡ | Fork, Pin, Skewer, Double Attack, etc. |
| `mates` | Scacco Matto | 🏁 | Mate in 1–5, generic checkmate |
| `mate-themes` | Temi di Matto | 🎨 | Anastasia, Arabian, Smothered, Opera, etc. |

## Features Demoed
- ✅ Responsive category tabs (horizontal scroll on mobile)
- ✅ Subcategory cards with icons, names, counters
- ✅ Breadcrumb navigation
- ✅ Puzzle cards with rendered FEN board (CSS-only)
- ✅ Difficulty badges (green/yellow/red)
- ✅ Phase badges (blue/purple/orange)
- ✅ Load more pagination
- ✅ Difficulty filter dropdown
- ✅ Empty state & loading spinner
- ✅ Keyboard accessible (tab, enter, space)
- ✅ Dark mode support (via `prefers-color-scheme`)
- ✅ Demo controls to simulate states

## How to View
Open `index.html` directly in a browser. No build step required.

## Demo Buttons (bottom-right)
- **Simula caricamento "Fork"** → Navigates to Motivi → Fork → loads puzzles
- **Simula stato vuoto** → Shows empty state
- **Simula "Matto in 2"** → Navigates to Matti → Mate in 2 → loads puzzles

## Design System Compliance
Uses the exact colors, radii, shadows, and typography from `design-mockup.html`:
- Sage green palette (`--sage-50` through `--sage-900`)
- Sand accent palette
- Board colors (`--board-light`, `--board-dark`)
- `--radius: 14px`, `--radius-sm: 10px`
- `--shadow`, `--shadow-lg`, `--shadow-xl`
- Inter font family

## Next Steps for Implementation
1. Create React components: `PuzzleCategoryTabs`, `PuzzleSubcategoryGrid`, `PuzzleListView`
2. Extend backend API: `/puzzles/stats/categories`, `category` filter param
3. Migrate existing puzzle themes to new taxonomy
4. Add React Router routes: `/puzzle`, `/puzzle/:category`, `/puzzle/:category/:subcategory`
5. Connect to `puzzleStore` for state management