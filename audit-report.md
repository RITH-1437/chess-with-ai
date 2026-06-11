# Chess With AI Audit Report

Date: 2026-06-11
Branch: `refactor/chess-ai-upgrade`

## Repository Scan

The repository contains one maintained browser app under `chess/` and a root `chess.html` entry point. Before this refactor, `chess.html` duplicated an older inline chess game while `chess/index.html`, `chess/style.css`, and `chess/script.js` held the modern version.

## Architecture

### HTML Structure

- `chess/index.html` defines the application shell:
  - Header with AI style, difficulty, new game, undo, AI move, and hint controls.
  - Left status panel for turn state, timers, score, and captured pieces.
  - Center board panel rendered by chessboard.js.
  - Right analysis panel for move history, evaluation, and hints.
  - Modal for game-over results.
- `chess.html` now redirects to `chess/index.html` so there is one source of gameplay logic.

### CSS Structure

- `chess/style.css` uses CSS custom properties for theme colors, responsive board sizing, panel styling, buttons, timers, move history, highlights, and modal states.
- Layout uses CSS grid on desktop and collapses to a single-column mobile view.
- UI has glass-style panels, high-contrast status states, stable button sizes, and responsive board constraints.

### JavaScript Modules

- `ChessAI`: local engine with move ordering, minimax, alpha-beta pruning, transposition cache, material evaluation, piece-square tables, and difficulty settings.
- `ChessApp`: browser controller for chessboard.js setup, drag/drop, timers, move history, captured pieces, local storage stats, sound, hints, and AI turn flow.
- Third-party rule and board dependencies remain global CDN scripts:
  - jQuery 3.5.1, required by chessboard.js.
  - chessboard.js 1.0.0 for drag/drop board rendering.
  - chess.js 0.10.3 for legal move generation and chess rules.

### AI Logic

- The old AI mixed duplicate methods, random placeholder analysis, and unused remote Stockfish/Lichess calls.
- The new AI is fully local:
  - Easy: shallow tactical weighted selection.
  - Medium: depth-2 minimax with alpha-beta pruning.
  - Hard: depth-3 minimax with alpha-beta pruning.
  - Move ordering prioritizes mate, check, captures, promotions, castling, and center control.
  - Evaluation combines material, piece-square tables, check pressure, checkmate, and draw detection.

### Move Validation Logic

- All chess legality is delegated to chess.js through `game.move(...)`.
- This preserves pawn moves, first double moves, captures, en passant, promotion, rook/knight/bishop/queen/king movement, castling, check, checkmate, stalemate, draw, and illegal move rejection.
- Promotion still auto-promotes to queen to preserve existing behavior.

### Drag And Drop Implementation

- chessboard.js owns drag/drop rendering.
- `onDragStart` blocks dragging when the game is over, AI is thinking, it is not White's turn, or the selected piece is not White.
- `onDrop` sends `{ from, to, promotion: "q" }` to chess.js and returns `snapback` on illegal moves.
- `onSnapEnd` syncs the visual board to the chess.js FEN so castling, en passant, and promotion render correctly.

## Dependency Map

```text
chess/index.html
  -> chess/style.css
  -> jQuery 3.5.1
  -> chessboard.js 1.0.0
       -> jQuery
  -> chess.js 0.10.3
  -> chess/script.js
       -> ChessApp
           -> Chessboard global
           -> Chess global
           -> ChessAI
           -> localStorage
           -> Web Audio API
       -> ChessAI
           -> chess.js move generation and board state

chess.html
  -> redirects to chess/index.html
```

## Findings And Fixes

### Dead Code

- Removed remote AI methods (`getStockfishMove`, `getLichessMove`, `getChesscomMove`) that were not wired to the current selector and depended on external network calls.
- Removed unused auto-reload countdown/cancel methods.
- Removed placeholder advanced analysis functions that returned random values and did not improve gameplay.

### Duplicate Code

- Removed duplicate `determineGamePhase`, `selectFastStrategy`, `getFastBestMove`, `quickLearnFromMove`, `calculateMaterialBalance`, `identifyCurrentThreats`, `findTacticalOpportunities`, `evaluateCurrentPosition`, `predictLikelyMoves`, and `displayAnalysis`.
- Removed duplicate consecutive-AI-move guard in `makeComputerMove`.
- Consolidated root `chess.html` and `chess/index.html` into one maintained app.

### Unused Variables And Functions

- Removed unused `$pgn` from the legacy root page.
- Removed unused `board` and `position` parameters from drag handlers where not needed.
- Replaced unused AI personality fields with explicit difficulty and style state.

### Repeated DOM Queries

- Cached stable DOM references in `ChessApp.cacheElements()`.
- Kept dynamic board-square queries only for transient highlights.
- Replaced repeated jQuery rebuilds with `DocumentFragment` and `replaceChildren`.

### Memory Leaks

- Reused one AudioContext instead of creating a new context per sound.
- Cleared pending AI, preview, and timer handles during new games and undo flows.
- Replaced document-level delegated jQuery listeners with one scoped listener on the move list.

### Performance Bottlenecks

- Removed network AI calls from the move path.
- Added move ordering and alpha-beta pruning to reduce minimax search.
- Added a per-search transposition cache.
- Reduced full DOM rebuild cost by batching move-history rendering.
- Avoided random placeholder analysis during every move.

### Security Issues

- Removed remote AI `fetch` calls that leaked FEN positions to third-party services.
- Replaced template-string HTML injection for move history with DOM node creation and `textContent`.
- Continued using CDN dependencies; the chessboard.js stylesheet already has SRI, while script CDN SRI should be added when exact hashes are pinned.

## Play-Test Matrix

These rule behaviors are delegated to chess.js and covered in `tests/browser-rule-harness.html`:

- Pawn movement, first double move, capture, en passant, and promotion.
- Rook, knight, bishop, queen, and king movement.
- Castling.
- Check, checkmate, stalemate, and illegal move prevention.
- Turn switching.
- AI move generation and captures.
- Board reset.
- Drag/drop contracts and piece rendering selectors.

## Remaining Risks

- Browser execution depends on CDN availability for chess.js and chessboard.js.
- The available local environment does not include Node.js or a browser, so browser rule tests must be opened in a browser. Python static tests were added and run locally.
- Promotion selection remains automatic queen promotion by design to preserve existing behavior.
