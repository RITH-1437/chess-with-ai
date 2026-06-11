# Architecture

## Overview

Chess With AI is a static browser application. It uses chess.js for chess rules, chessboard.js for the board UI, and a local JavaScript AI for computer moves.

## Files

```text
chess.html              Compatibility launcher for the app.
chess/index.html        Main UI shell.
chess/style.css         Responsive glass-style game interface.
chess/script.js         Game controller and AI engine.
docs/                  Project documentation.
tests/                 Static and browser test harnesses.
```

## Runtime Flow

1. `index.html` loads jQuery, chessboard.js, chess.js, then `script.js`.
2. `ChessApp` creates a chess.js `Chess` instance and a chessboard.js board.
3. Drag/drop moves are validated by `game.move(...)`.
4. Successful player moves update timers, history, captures, evaluation, and board state.
5. If it is Black's turn, `ChessAI` selects a legal move and `ChessApp` commits it.
6. Game-over states stop the clock, update stats, and show the result modal.

## JavaScript Classes

### `ChessAI`

- Reads legal moves from chess.js.
- Evaluates positions from Black's perspective.
- Uses minimax with alpha-beta pruning for Medium and Hard.
- Uses a weighted tactical selector for Easy.
- Orders moves before search to improve pruning.

### `ChessApp`

- Owns UI state and event listeners.
- Keeps DOM references cached.
- Owns timers, score persistence, captured pieces, sound, move history, hints, and modal state.
- Never implements chess legality directly; chess.js is the rule authority.

## Data Ownership

- `game`: authoritative chess state.
- `board`: visual state derived from `game.fen()`.
- `moveHistory`: committed moves plus FEN snapshots for preview.
- `capturedPieces`: rebuilt from committed captures when undoing.
- `stats`: persisted to `localStorage` under `chessWithAiStats`.
