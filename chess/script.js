"use strict";

const PIECE_THEME =
  "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png";

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const DIFFICULTY = {
  easy: { label: "Easy", depth: 1, randomness: 0.45, candidatePool: 5 },
  medium: { label: "Medium", depth: 2, randomness: 0.18, candidatePool: 3 },
  hard: { label: "Hard", depth: 3, randomness: 0.04, candidatePool: 1 },
};

const STARTING_PIECES = {
  white: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
  black: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
};

const PIECE_NAMES = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King",
};

const CENTER_SQUARES = new Set(["d4", "d5", "e4", "e5"]);
const EXTENDED_CENTER = new Set([
  "c3",
  "c4",
  "c5",
  "c6",
  "d3",
  "d6",
  "e3",
  "e6",
  "f3",
  "f4",
  "f5",
  "f6",
]);

const POSITION_TABLES = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 5, 5, 0, 0, 0],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [20, 30, 10, 0, 0, 10, 30, 20],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
  ],
};

/**
 * Local chess AI that evaluates every legal move produced by chess.js.
 * Scores are positive when Black is better and negative when White is better.
 */
class ChessAI {
  constructor() {
    this.nodesSearched = 0;
    this.transpositionTable = new Map();
    this.currentStyle = "balanced";
  }

  /**
   * Return a legal move for the side to move.
   * @param {Chess} game Active chess.js game.
   * @param {"easy"|"medium"|"hard"} difficulty Difficulty key.
   * @param {"balanced"|"tactical"|"defensive"} style AI style key.
   * @returns {object|null} Verbose chess.js move or null when no legal move exists.
   */
  getBestMove(game, difficulty = "medium", style = "balanced") {
    const settings = DIFFICULTY[difficulty] || DIFFICULTY.medium;
    this.currentStyle = style;
    const moves = this.orderMoves(game, game.moves({ verbose: true }));

    if (moves.length === 0) {
      return null;
    }

    this.nodesSearched = 0;
    this.transpositionTable.clear();

    if (settings.depth === 1) {
      return this.pickWeightedMove(game, moves, settings);
    }

    const maximizing = game.turn() === "b";
    const scoredMoves = moves.map((move) => {
      game.move(move);
      const score = this.minimax(
        game,
        settings.depth - 1,
        -Infinity,
        Infinity,
        !maximizing
      );
      game.undo();

      return {
        move,
        score: score + this.randomNoise(settings.randomness),
      };
    });

    scoredMoves.sort((a, b) =>
      maximizing ? b.score - a.score : a.score - b.score
    );

    const poolSize = Math.min(settings.candidatePool, scoredMoves.length);
    const pool = scoredMoves.slice(0, poolSize);
    return pool[Math.floor(Math.random() * pool.length)].move;
  }

  minimax(game, depth, alpha, beta, maximizing) {
    this.nodesSearched += 1;

    if (depth === 0 || game.game_over()) {
      return this.evaluate(game);
    }

    const cacheKey = `${game.fen()}|${depth}|${maximizing ? "max" : "min"}`;
    if (this.transpositionTable.has(cacheKey)) {
      return this.transpositionTable.get(cacheKey);
    }

    const moves = this.orderMoves(game, game.moves({ verbose: true }));
    let best = maximizing ? -Infinity : Infinity;

    for (const move of moves) {
      game.move(move);
      const score = this.minimax(game, depth - 1, alpha, beta, !maximizing);
      game.undo();

      if (maximizing) {
        best = Math.max(best, score);
        alpha = Math.max(alpha, score);
      } else {
        best = Math.min(best, score);
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) {
        break;
      }
    }

    this.transpositionTable.set(cacheKey, best);
    return best;
  }

  evaluate(game) {
    if (game.in_checkmate()) {
      return game.turn() === "b" ? -100000 : 100000;
    }

    if (game.in_draw()) {
      return 0;
    }

    let score = 0;
    const board = game.board();

    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[row].length; col += 1) {
        const piece = board[row][col];
        if (!piece) {
          continue;
        }

        const value = this.getPieceScore(piece, row, col);
        score += piece.color === "b" ? value : -value;
      }
    }

    score += this.evaluateKingPressure(game);
    return score;
  }

  getPieceScore(piece, row, col) {
    const table = POSITION_TABLES[piece.type] || POSITION_TABLES.p;
    const adjustedRow = piece.color === "w" ? row : 7 - row;
    return PIECE_VALUES[piece.type] + table[adjustedRow][col];
  }

  evaluateKingPressure(game) {
    if (!game.in_check()) {
      return 0;
    }

    return game.turn() === "b" ? -35 : 35;
  }

  orderMoves(game, moves) {
    return [...moves].sort((a, b) => this.scoreMove(game, b) - this.scoreMove(game, a));
  }

  scoreMove(game, move) {
    let score = 0;

    if (move.captured) {
      score += 1000 + PIECE_VALUES[move.captured] - PIECE_VALUES[move.piece] / 10;
      if (this.currentStyle === "tactical") {
        score += 150;
      }
    }

    if (move.promotion) {
      score += PIECE_VALUES[move.promotion] || PIECE_VALUES.q;
    }

    if (CENTER_SQUARES.has(move.to)) {
      score += 30;
    } else if (EXTENDED_CENTER.has(move.to)) {
      score += 12;
    }

    if (move.flags && (move.flags.includes("k") || move.flags.includes("q"))) {
      score += 45;
      if (this.currentStyle === "defensive") {
        score += 90;
      }
    }

    game.move(move);
    if (game.in_checkmate()) {
      score += 100000;
    } else if (game.in_check()) {
      score += 120;
      if (this.currentStyle === "tactical") {
        score += 80;
      }
    }
    game.undo();

    return score;
  }

  pickWeightedMove(game, moves, settings) {
    const scored = moves
      .map((move) => ({
        move,
        score: this.scoreMove(game, move) + this.randomNoise(settings.randomness),
      }))
      .sort((a, b) => b.score - a.score);

    const pool = scored.slice(0, Math.min(settings.candidatePool, scored.length));
    return pool[Math.floor(Math.random() * pool.length)].move;
  }

  randomNoise(randomness) {
    return (Math.random() - 0.5) * randomness * 200;
  }
}

/**
 * Browser controller for the chessboard, timers, move history, and AI turn flow.
 */
class ChessApp {
  constructor() {
    this.game = new Chess();
    this.ai = new ChessAI();
    this.board = null;
    this.difficulty = "medium";
    this.aiStyle = "balanced";
    this.engineThinking = false;
    this.gameEnded = false;
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.timers = { white: 600, black: 600 };
    this.activeTimer = "white";
    this.timerId = null;
    this.soundEnabled = true;
    this.audioContext = null;
    this.stats = { wins: 0, losses: 0, draws: 0 };
    this.pendingAiMove = null;
    this.previewTimer = null;

    this.elements = this.cacheElements();
    this.loadStats();
    this.initializeBoard();
    this.bindEvents();
    this.render();
    this.startTimer();
  }

  cacheElements() {
    return {
      status: document.querySelector("#status"),
      evaluation: document.querySelector("#evaluation"),
      bestMove: document.querySelector("#bestMove"),
      engineStatus: document.querySelector("#engineStatus"),
      moveList: document.querySelector("#moveList"),
      whiteCaptured: document.querySelector("#whiteCaptured"),
      blackCaptured: document.querySelector("#blackCaptured"),
      whiteTimer: document.querySelector("#whiteTimer"),
      blackTimer: document.querySelector("#blackTimer"),
      whiteScore: document.querySelector("#whiteScore"),
      blackScore: document.querySelector("#blackScore"),
      modal: document.querySelector("#gameOverModal"),
      gameResult: document.querySelector("#gameResult"),
      gameResultMessage: document.querySelector("#gameResultMessage"),
      difficultySelect: document.querySelector("#difficultySelect"),
      aiEngineSelect: document.querySelector("#aiEngineSelect"),
      soundToggle: document.querySelector("#soundToggle"),
      board: document.querySelector("#board"),
    };
  }

  initializeBoard() {
    this.board = Chessboard("board", {
      draggable: true,
      position: "start",
      pieceTheme: PIECE_THEME,
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this),
    });
  }

  bindEvents() {
    document.querySelector("#newGameBtn").addEventListener("click", () => this.newGame());
    document.querySelector("#newGameModalBtn").addEventListener("click", () => this.newGame());
    document.querySelector("#undoBtn").addEventListener("click", () => this.undoMovePair());
    document.querySelector("#aiMoveBtn").addEventListener("click", () => this.makeComputerMove());
    document.querySelector("#hintBtn").addEventListener("click", () => this.showHint());
    document.querySelector("#flipBtn").addEventListener("click", () => this.board.flip());
    document.querySelector("#closeModalBtn").addEventListener("click", () => this.hideModal());

    this.elements.soundToggle.addEventListener("click", () => this.toggleSound());
    this.elements.difficultySelect.addEventListener("change", (event) => {
      this.setDifficulty(event.target.value);
    });
    this.elements.aiEngineSelect.addEventListener("change", (event) => {
      this.setAiStyle(event.target.value);
    });
    this.elements.moveList.addEventListener("click", (event) => {
      const moveButton = event.target.closest("[data-move-index]");
      if (moveButton) {
        this.previewMove(Number(moveButton.dataset.moveIndex));
      }
    });
  }

  onDragStart(source, piece) {
    if (this.game.game_over() || this.engineThinking || this.game.turn() !== "w") {
      return false;
    }

    return piece.startsWith("w");
  }

  onDrop(source, target) {
    this.clearPreview();

    const move = this.game.move({
      from: source,
      to: target,
      promotion: "q",
    });

    if (move === null) {
      this.flashStatus("Illegal move");
      return "snapback";
    }

    this.commitMove(move);

    if (!this.checkGameOver() && this.game.turn() === "b") {
      this.pendingAiMove = window.setTimeout(() => this.makeComputerMove(), 180);
    }

    return undefined;
  }

  onSnapEnd() {
    this.board.position(this.game.fen());
  }

  makeComputerMove() {
    if (this.game.game_over() || this.engineThinking || this.game.turn() !== "b") {
      return;
    }

    window.clearTimeout(this.pendingAiMove);
    this.engineThinking = true;
    this.elements.board.classList.add("thinking");
    this.updateEngineStatus("AI is calculating...");

    window.setTimeout(() => {
      try {
        const move = this.ai.getBestMove(this.game, this.difficulty, this.aiStyle);
        if (move) {
          const playedMove = this.game.move({
            from: move.from,
            to: move.to,
            promotion: move.promotion || "q",
          });

          if (playedMove) {
            this.board.position(this.game.fen());
            this.commitMove(playedMove);
            this.checkGameOver();
          }
        }
      } catch (error) {
        console.error("AI move failed", error);
        this.updateEngineStatus("AI failed to move");
      } finally {
        this.engineThinking = false;
        this.elements.board.classList.remove("thinking");
        this.updateEngineStatus();
      }
    }, 20);
  }

  commitMove(move) {
    this.moveHistory.push({
      move,
      fen: this.game.fen(),
      san: move.san,
    });

    if (move.captured) {
      const capturedColor = move.color === "w" ? "black" : "white";
      this.capturedPieces[capturedColor].push(move.captured);
    }

    this.playSound(move.captured ? "capture" : "move");
    this.switchTimer();
    this.render();
  }

  render() {
    this.renderStatus();
    this.renderTimers();
    this.renderMoveHistory();
    this.renderCapturedPieces();
    this.renderScores();
    this.renderEvaluation();
  }

  renderStatus() {
    const activeColor = this.game.turn() === "w" ? "White" : "Black";
    let status = `${activeColor} to move`;

    if (this.game.in_checkmate()) {
      status = `Checkmate. ${activeColor === "White" ? "Black" : "White"} wins.`;
    } else if (this.game.in_stalemate()) {
      status = "Stalemate. The game is drawn.";
    } else if (this.game.in_draw()) {
      status = "Draw. The game is over.";
    } else if (this.game.in_check()) {
      status = `${activeColor} is in check.`;
    }

    this.elements.status.textContent = status;
    this.elements.status.classList.toggle("in-check", this.game.in_check() && !this.game.game_over());
  }

  renderTimers() {
    this.elements.whiteTimer.textContent = this.formatTime(this.timers.white);
    this.elements.blackTimer.textContent = this.formatTime(this.timers.black);

    document.querySelectorAll(".timer").forEach((timer) => {
      timer.classList.toggle("active", timer.dataset.timer === this.activeTimer);
    });
  }

  renderMoveHistory() {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < this.moveHistory.length; index += 2) {
      const row = document.createElement("div");
      row.className = "move-pair";

      const number = document.createElement("span");
      number.className = "move-number";
      number.textContent = `${Math.floor(index / 2) + 1}.`;
      row.append(number);

      row.append(this.createMoveButton(index));

      if (this.moveHistory[index + 1]) {
        row.append(this.createMoveButton(index + 1));
      }

      fragment.append(row);
    }

    this.elements.moveList.replaceChildren(fragment);
    this.elements.moveList.scrollTop = this.elements.moveList.scrollHeight;
  }

  createMoveButton(index) {
    const moveButton = document.createElement("button");
    moveButton.type = "button";
    moveButton.className = "move";
    moveButton.dataset.moveIndex = String(index);
    moveButton.textContent = this.moveHistory[index].san;
    return moveButton;
  }

  renderCapturedPieces() {
    this.elements.whiteCaptured.replaceChildren(
      ...this.capturedPieces.white.map((piece) => this.createCapturedPiece("w", piece))
    );
    this.elements.blackCaptured.replaceChildren(
      ...this.capturedPieces.black.map((piece) => this.createCapturedPiece("b", piece))
    );
  }

  createCapturedPiece(color, piece) {
    const captured = document.createElement("span");
    const pieceCode = `${color}${piece.toUpperCase()}`;
    captured.className = "captured-piece";
    captured.title = `${color === "w" ? "White" : "Black"} ${PIECE_NAMES[piece]}`;
    captured.style.backgroundImage = `url("${PIECE_THEME.replace("{piece}", pieceCode)}")`;
    return captured;
  }

  renderScores() {
    this.elements.whiteScore.textContent = String(this.stats.wins);
    this.elements.blackScore.textContent = String(this.stats.losses);
  }

  renderEvaluation() {
    const score = this.ai.evaluate(this.game);
    const absScore = Math.abs(score);
    let text = "Even position";

    if (absScore >= 900) {
      text = `${score > 0 ? "Black" : "White"} is winning`;
    } else if (absScore >= 300) {
      text = `${score > 0 ? "Black" : "White"} has an advantage`;
    } else if (absScore >= 120) {
      text = `${score > 0 ? "Black" : "White"} is slightly better`;
    }

    this.elements.evaluation.textContent = text;
  }

  checkGameOver() {
    if (!this.game.game_over()) {
      return false;
    }

    window.clearInterval(this.timerId);

    if (this.game.in_checkmate()) {
      const playerWon = this.game.turn() === "b";
      if (playerWon) {
        this.stats.wins += 1;
        this.showModal("You won", "White checkmated the AI.");
      } else {
        this.stats.losses += 1;
        this.showModal("You lost", "Black delivered checkmate.");
      }
      this.playSound("gameOver");
    } else {
      this.stats.draws += 1;
      this.showModal("Draw", "The game ended without a winner.");
      this.playSound("draw");
    }

    this.saveStats();
    this.renderScores();
    return true;
  }

  newGame() {
    window.clearTimeout(this.pendingAiMove);
    window.clearTimeout(this.previewTimer);
    window.clearInterval(this.timerId);

    this.game.reset();
    this.board.start();
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.timers = { white: 600, black: 600 };
    this.activeTimer = "white";
    this.engineThinking = false;
    this.gameEnded = false;
    this.elements.board.classList.remove("thinking");
    this.elements.bestMove.textContent = "";
    this.hideModal();
    this.clearHighlights();
    this.updateEngineStatus();
    this.render();
    this.startTimer();
    this.playSound("newGame");
  }

  undoMovePair() {
    if (this.engineThinking || this.moveHistory.length === 0) {
      return;
    }

    window.clearTimeout(this.pendingAiMove);
    const undoCount = this.game.turn() === "w" ? 2 : 1;

    for (let index = 0; index < undoCount; index += 1) {
      const undoneMove = this.game.undo();
      if (undoneMove) {
        this.moveHistory.pop();
      }
    }

    this.rebuildCapturedPieces();
    this.board.position(this.game.fen());
    this.activeTimer = this.game.turn() === "w" ? "white" : "black";
    this.render();
    this.playSound("move");
  }

  rebuildCapturedPieces() {
    this.capturedPieces = { white: [], black: [] };

    this.moveHistory.forEach(({ move }) => {
      if (move.captured) {
        const capturedColor = move.color === "w" ? "black" : "white";
        this.capturedPieces[capturedColor].push(move.captured);
      }
    });
  }

  showHint() {
    if (this.game.game_over() || this.engineThinking) {
      return;
    }

    const move = this.ai.getBestMove(this.game, this.difficulty, this.aiStyle);
    if (!move) {
      return;
    }

    this.highlightSquares(move.from, move.to);
    this.elements.bestMove.textContent = `Suggested move: ${move.san}`;

    window.setTimeout(() => {
      this.clearHighlights();
      this.elements.bestMove.textContent = "";
    }, 2500);
  }

  previewMove(moveIndex) {
    const historyEntry = this.moveHistory[moveIndex];
    if (!historyEntry) {
      return;
    }

    this.clearPreview();
    this.board.position(historyEntry.fen);
    this.highlightSquares(historyEntry.move.from, historyEntry.move.to);

    this.previewTimer = window.setTimeout(() => {
      this.board.position(this.game.fen());
      this.clearHighlights();
    }, 1800);
  }

  clearPreview() {
    window.clearTimeout(this.previewTimer);
    this.clearHighlights();
    this.board.position(this.game.fen());
  }

  startTimer() {
    this.timerId = window.setInterval(() => {
      if (this.game.game_over() || this.engineThinking) {
        return;
      }

      this.timers[this.activeTimer] = Math.max(0, this.timers[this.activeTimer] - 1);
      this.renderTimers();

      if (this.timers[this.activeTimer] === 0) {
        this.endGameByTime();
      }
    }, 1000);
  }

  switchTimer() {
    this.activeTimer = this.game.turn() === "w" ? "white" : "black";
  }

  endGameByTime() {
    window.clearInterval(this.timerId);
    const playerLost = this.activeTimer === "white";

    if (playerLost) {
      this.stats.losses += 1;
      this.showModal("Time expired", "White ran out of time. Black wins.");
    } else {
      this.stats.wins += 1;
      this.showModal("Time expired", "Black ran out of time. White wins.");
    }

    this.saveStats();
    this.renderScores();
    this.playSound("gameOver");
  }

  setDifficulty(difficulty) {
    this.difficulty = DIFFICULTY[difficulty] ? difficulty : "medium";
    this.elements.difficultySelect.value = this.difficulty;
    this.updateEngineStatus();
  }

  setAiStyle(style) {
    this.aiStyle = style;
    this.updateEngineStatus();
  }

  updateEngineStatus(message) {
    const styleLabel = this.aiStyle.charAt(0).toUpperCase() + this.aiStyle.slice(1);
    const difficultyLabel = DIFFICULTY[this.difficulty].label;
    this.elements.engineStatus.textContent =
      message || `AI: ${styleLabel} - ${difficultyLabel}`;
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.elements.soundToggle.textContent = this.soundEnabled ? "Sound On" : "Sound Off";
  }

  playSound(type) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!this.soundEnabled || !AudioContextClass) {
      return;
    }

    this.audioContext = this.audioContext || new AudioContextClass();
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const frequencies = {
      move: 720,
      capture: 520,
      gameOver: 260,
      newGame: 880,
      draw: 440,
    };

    oscillator.frequency.value = frequencies[type] || frequencies.move;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.06, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.18);
  }

  showModal(title, message) {
    if (this.gameEnded) {
      return;
    }

    this.gameEnded = true;
    this.elements.gameResult.textContent = title;
    this.elements.gameResultMessage.textContent = message;
    this.elements.modal.classList.remove("hidden");
  }

  hideModal() {
    this.elements.modal.classList.add("hidden");
  }

  flashStatus(message) {
    const original = this.elements.status.textContent;
    this.elements.status.textContent = message;
    window.setTimeout(() => {
      this.elements.status.textContent = original;
    }, 900);
  }

  highlightSquares(...squares) {
    this.clearHighlights();
    squares.forEach((square) => {
      document.querySelector(`#board .square-${square}`)?.classList.add("highlight-square");
    });
  }

  clearHighlights() {
    document.querySelectorAll("#board .highlight-square").forEach((square) => {
      square.classList.remove("highlight-square");
    });
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  loadStats() {
    try {
      const savedStats = window.localStorage.getItem("chessWithAiStats");
      if (savedStats) {
        this.stats = { ...this.stats, ...JSON.parse(savedStats) };
      }
    } catch (error) {
      console.warn("Unable to load saved stats", error);
    }
  }

  saveStats() {
    try {
      window.localStorage.setItem("chessWithAiStats", JSON.stringify(this.stats));
    } catch (error) {
      console.warn("Unable to save stats", error);
    }
  }
}

window.ChessWithAI = { ChessAI, ChessApp, DIFFICULTY, PIECE_VALUES };

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#board") && window.Chessboard && window.Chess) {
    window.chessGame = new ChessApp();
  }
});
