# QA Engineering Final Review

## 🔴 Critical Issues

1. **Difficulty Dropdown Parsing Error**
   - **Bug**: The HTML `<select>` options for difficulty utilized string values (`"easy"`, `"medium"`). The JS configuration subsequently called `parseInt(e.target.value)`, leading to `NaN`. This effectively broke the primary difficulty selector.
   - **Fix**: Re-mapped the HTML `<option>` values to standard integers (`1`, `2`, `3`, `4`).

2. **AI Move Evaluation Perspective Issue**
   - **Bug**: The core Minimax algorithms (`getBestMoveEnhanced` and `getBasicLocalMove`) defaulted to maximizing scores unconditionally. Paired with a flawed evaluation algorithm that yielded `1000` points to a side when that side was checkmated, requesting a move through the "Hint" system (or falling back to the local engines) would purposefully force White to pick positions resulting in suicide. 
   - **Fix**: Implemented turn-based dynamic root tracking (`!isMaximizingPlayer`) to properly alternate maximizing for Black and minimizing for White across the Alpha-Beta parameters. Realigned checkmate scoring correctly.

3. **State Corruption During Async AI Calls**
   - **Bug**: The UI allowed players to issue game-breaking actions (`Undo`, `New Game`) while the AI engine was asynchronously querying for moves (`this.engineThinking === true`). Attempting to resolve moves on a stale or destroyed board layout resulted in hard console crashes.
   - **Fix**: Explicitly added `if (this.engineThinking) return;` guard clauses in the undo and reset workflows to lock the interface responsibly.

4. **Statistics Double-Counting Upon Timer Depletion**
   - **Bug**: Inside `endGameByTime()`, the `losses` and `wins` counters were effectively multiplied by `2`, and written to `localStorage` redundantly.
   - **Fix**: Isolated the win/loss conditionals and stripped the duplicate updates.

5. **Recursive Execution Overhead**
   - **Bug**: Multiple cascading interactions could re-trigger `checkGameOver()`, ignoring `clearInterval` execution limits and continuously padding statistics repeatedly.
   - **Fix**: Secured state progression strictly via a `if (this.gameEnded) return true;` blocker pattern.

## 🟠 Medium Issues

1. **Duplicated AI Architectures**
   - **Bug**: Methods dictating baseline logic (e.g. `calculateMaterialBalance`, `evaluateCurrentPosition`, `displayAnalysis`) were consecutively and needlessly duplicated within `ModernChessGame` class (lines 1032-1144 vs lines 1146-1260).
   - **Fix**: Cleared out the redundantly overridden blocks.

2. **AI Configuration Drift**
   - **Bug**: `index.html` contained engine settings like `"balanced"` out of sync with `this.engines` logic in `script.js` which used settings like `"master"` and `"adaptive"`. The default `"stockfish"` fallback did not align to configured behaviors.
   - **Fix**: Matched the HTML `<select>` variables to the actual configuration objects present in memory, while assigning `"master"` as the default core.

3. **Static Turn Splicing on Undo**
   - **Bug**: Utilizing `.splice(-2)` assumed constant move parity. When ending early (Checkmates or AI Timeouts), reversing 2 turns forced human players to mistakenly control Black pieces.
   - **Fix**: Wrote a smart loop that pulls single turns conditionally to safely return player control back to White.

## 🟡 Minor Issues

1. **Redundant Check Loops**
   - Removed sequentially duplicated conditionals verifying `this.lastMoveWasUser`.

## 💡 Suggested Improvements

1. **Integrate True AI Architectures**: The newly minted "Master AI" currently uses a simple, highly-greedy 1-ply search wrapper (`selectOptimalMove`). Relying on Alpha-Beta Minimax arrays (like the `getAdvancedLocalMove` method mapped) would radically challenge seasoned human players by forecasting multiple moves ahead.
2. **Adopt Web Workers for Deep Evaluators**: Large search depth calculations should be completely abstracted into background Web Workers (e.g. `Worker()`) to ensure the user interface DOM layout does not temporarily lock or freeze visually.
3. **Introduce Proper Caching**: Method calls repeatedly query `this.game.moves({ verbose: true })` inside nested iterations unnecessarily. Caching move generators once per turn would eliminate high CPU overheads.