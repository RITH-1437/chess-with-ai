# AI Logic

## Goals

The AI is designed to be deterministic enough to play sensible chess while still offering lighter play on Easy. It runs locally and does not send positions to external services.

## Difficulty Levels

- Easy: one-ply weighted move selection. It prefers captures, checks, promotions, castling, and central moves but keeps a larger random candidate pool.
- Medium: depth-2 minimax with alpha-beta pruning.
- Hard: depth-3 minimax with alpha-beta pruning and minimal randomness.

## Evaluation

Scores are positive for Black and negative for White.

The evaluator considers:

- Checkmate and draw states.
- Material balance.
- Piece-square tables for pawns, knights, bishops, rooks, queens, and kings.
- Check pressure against the side to move.

## Move Ordering

The AI sorts legal moves before searching:

1. Checkmate.
2. Captures using most-valuable-victim/least-valuable-attacker scoring.
3. Promotions.
4. Checks.
5. Castling.
6. Center and extended-center moves.

Better move ordering lets alpha-beta pruning skip more branches.

## Search Cache

Each AI turn has a transposition table keyed by FEN, depth, and maximizing/minimizing state. The cache is cleared for each top-level move search so it never holds stale positions between turns.
