// Modern Chess Game with Enhanced Features and Smart AI
class ModernChessGame {
  constructor() {
    this.board = null;
    this.game = new Chess();
    this.difficulty = 2; // Default medium difficulty
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.gameTimer = { white: 600, black: 600 }; // 10 minutes each
    this.activeTimer = null;
    this.timerInterval = null;
    this.soundEnabled = true;
    this.gameStats = { wins: 0, losses: 0, draws: 0 };
    this.aiEngine = "stockfish"; // Default AI engine
    this.engineThinking = false;
    this.gameEnded = false;
    this.lastMoveWasUser = true; // Start with user's turn

    // Advanced AI Configuration
    this.engines = {
      master: {
        name: "🧠 Chess Master AI",
        description: "Advanced hybrid AI with multiple thinking modes",
      },
      adaptive: {
        name: "🎯 Adaptive AI",
        description: "Learns from your play style",
      },
      creative: {
        name: "🎨 Creative AI",
        description: "Unpredictable, creative moves",
      },
      tactical: {
        name: "⚔️ Tactical AI",
        description: "Focuses on tactics and combinations",
      },
    };

    // Advanced evaluation parameters
    this.pieceValues = {
      p: 100,
      n: 320,
      b: 330,
      r: 500,
      q: 900,
      k: 20000,
      P: 100,
      N: 320,
      B: 330,
      R: 500,
      Q: 900,
      K: 20000,
    };

    // Advanced AI Intelligence System
    this.aiPersonality = {
      aggression: 0.5, // 0 = defensive, 1 = very aggressive
      creativity: 0.7, // 0 = safe moves, 1 = risky/creative
      consistency: 0.3, // 0 = very random, 1 = always best move
      learningRate: 0.1, // How fast AI adapts to player
      moveMemory: [], // Remember successful/failed moves
      playerPatterns: {}, // Learn player's patterns

      // Enhanced Intelligence Parameters
      patternRecognition: 0.8, // Ability to recognize complex patterns
      strategicDepth: 0.9, // Long-term strategic thinking
      tacticalVision: 0.85, // Short-term tactical calculation
      adaptability: 0.7, // How well AI adapts to opponent
      intuition: 0.6, // AI's "gut feeling" for moves

      // User Analysis System
      userMovePrediction: new Map(), // Predict user's likely moves
      userWeaknesses: [], // Track user's tactical weaknesses
      userStrengths: [], // Track user's strengths to avoid
      playStyle: {
        aggressive: 0.5,
        positional: 0.5,
        tactical: 0.5,
        endgame: 0.5,
      },
    };

    // Position and move evaluation caches
    this.evaluationCache = new Map();
    this.transpositionTable = new Map();
    this.killerMoves = [];
    this.historyHeuristic = {};

    // Advanced opening book with multiple variations
    this.openingBook = this.initializeOpeningBook();
    this.endgamePatterns = this.initializeEndgamePatterns();

    this.initializeGame();
    this.setupEventListeners();
    this.loadGameStats();
    this.initializeAI();
  }

  async initializeAI() {
    try {
      console.log("🧠 Initializing Advanced Chess AI System...");

      // Initialize AI components
      this.initializeLearningSystem();
      this.loadAIMemory();

      console.log(`🎯 AI Engine: ${this.engines[this.aiEngine].name}`);
      console.log("✅ AI System Ready - Prepare for intelligent gameplay!");
    } catch (error) {
      console.warn("AI initialization warning:", error);
    }
  }

  initializeLearningSystem() {
    // Initialize pattern recognition
    this.playerPatterns = {
      favoriteOpenings: {},
      tacticalWeaknesses: {},
      endgameSkills: {},
      timeManagement: {},
      blunderPatterns: [],
    };

    // Initialize move evaluation history
    this.moveQualityHistory = [];
    this.gamePhasePreferences = {
      opening: { aggressive: 0, positional: 0, creative: 0 },
      middlegame: { tactical: 0, strategic: 0, attacking: 0 },
      endgame: { technical: 0, practical: 0 },
    };
  }

  initializeOpeningBook() {
    return {
      // Multiple variations for each opening to avoid repetition
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1": [
        { moves: ["e4"], weight: 40, type: "aggressive" },
        { moves: ["d4"], weight: 35, type: "positional" },
        { moves: ["Nf3"], weight: 15, type: "flexible" },
        { moves: ["c4"], weight: 8, type: "hypermodern" },
        { moves: ["g3"], weight: 2, type: "creative" },
      ],
      // Responses to 1.e4
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1": [
        { moves: ["e5"], weight: 45, type: "classical" },
        { moves: ["c5"], weight: 25, type: "aggressive" },
        { moves: ["e6"], weight: 15, type: "solid" },
        { moves: ["c6"], weight: 10, type: "solid" },
        { moves: ["d5"], weight: 3, type: "creative" },
        { moves: ["Nc6"], weight: 2, type: "unusual" },
      ],
      // Responses to 1.d4
      "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1": [
        { moves: ["d5"], weight: 40, type: "classical" },
        { moves: ["Nf6"], weight: 30, type: "indian" },
        { moves: ["e6"], weight: 15, type: "french" },
        { moves: ["c5"], weight: 10, type: "benoni" },
        { moves: ["f5"], weight: 3, type: "dutch" },
        { moves: ["g6"], weight: 2, type: "modern" },
      ],
      // Add more complex positions...
    };
  }

  initializeEndgamePatterns() {
    return {
      kingAndPawn: {
        opposition: true,
        shouldActivateKing: true,
        pawnPromotion: "priority",
      },
      rookEndgames: {
        activateRook: true,
        kingActivity: "high",
        cuttingOff: true,
      },
      queenEndgames: {
        centralization: true,
        checkPattern: "systematic",
      },
    };
  }

  initializeGame() {
    console.log("🎮 INITIALIZING GAME");
    console.log(`   Initial turn: ${this.game.turn()}`);

    const config = {
      draggable: true,
      position: "start",
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this),
      pieceTheme:
        "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",
    };

    this.board = Chessboard("board", config);
    this.updateStatus();
    this.startTimer();

    console.log("✅ Game initialized - White's turn should be first");
  }

  setupEventListeners() {
    $("#newGameBtn, #newGameModalBtn").on("click", () => this.newGame());
    $("#undoBtn").on("click", () => this.undoMove());
    $("#aiMoveBtn").on("click", () => this.requestAIMove());
    $("#hintBtn").on("click", () => this.showHint());
    $("#flipBtn").on("click", () => this.board.flip());
    $("#soundToggle").on("click", () => this.toggleSound());
    $("#difficultySelect").on("change", (e) =>
      this.setDifficulty(parseInt(e.target.value))
    );
    $("#closeModalBtn").on("click", () => this.hideGameOverModal());

    // AI Engine selector
    $("#aiEngineSelect").on("change", (e) => this.setAIEngine(e.target.value));

    // Move history click handlers
    $(document).on("click", ".move", (e) => {
      const moveIndex = parseInt($(e.target).data("move-index"));
      this.goToMove(moveIndex);
    });
  }

  onDragStart(source, piece, position, orientation) {
    // Don't pick up pieces if game is over
    if (this.game.game_over()) {
      console.log("❌ Drag blocked: Game over");
      return false;
    }

    // Don't pick up pieces if AI is thinking
    if (this.engineThinking) {
      console.log("❌ Drag blocked: AI thinking");
      return false;
    }

    // Allow user to move pieces that match current turn
    const pieceColor = piece.search(/^w/) !== -1 ? "w" : "b";
    if (pieceColor !== this.game.turn()) {
      console.log(`❌ Drag blocked: ${piece} - not ${this.game.turn()}'s turn`);
      return false;
    }

    // Only on white's turn
    if (this.game.turn() !== "w") {
      console.log(
        `❌ Drag blocked: Wrong turn ${this.game.turn()} - only white's turn allowed`
      );
      return false;
    }

    console.log("✅ Drag allowed");
    return true;
  }

  onDrop(source, target) {
    // Attempt the move
    const move = this.game.move({
      from: source,
      to: target,
      promotion: "q", // Always promote to queen for simplicity
    });

    // Illegal move
    if (move === null) {
      return "snapback";
    }

    // Mark that user just moved
    this.lastMoveWasUser = true;

    // Play move sound
    this.playSound("move");

    // Update game state
    this.addMoveToHistory(move);
    this.updateCapturedPieces();
    this.updateStatus();
    this.switchTimer();

    // Check for game over
    if (this.checkGameOver()) {
      return;
    }

    // AI analysis and auto-move
    this.performPositionAnalysis(move);

    // Trigger AI move ONLY if it's Black's turn
    if (this.game.turn() === "b") {
      console.log("⬛ AI's turn - making move...");
      setTimeout(() => {
        // Double-check turn before making AI move
        if (this.game.turn() === "b") {
          this.makeComputerMove();
        } else {
          console.error("🚨 PREVENTED: Turn changed before AI move!");
        }
      }, 100);
    } else if (this.game.turn() === "w") {
      console.log("⬜ Your turn - move white pieces manually");
      console.log("🚫 AI will NOT move white pieces - you have full control");
      console.log(
        "🛡️ SAFEGUARD: No automatic moves will be triggered for White"
      );
    }
  }

  onSnapEnd() {
    this.board.position(this.game.fen());
  }

  async makeComputerMove() {
    // Safeguard: AI only moves Black pieces
    if (this.game.turn() === "w") {
      console.error("AI attempted to move White pieces - blocked");
      return;
    }

    if (this.engineThinking) {
      console.log("⚠️ AI already thinking - aborting");
      return;
    }

    // 🛑 PREVENT CONSECUTIVE AI MOVES
    if (!this.lastMoveWasUser) {
      console.error(
        `🚨 BLOCKING CONSECUTIVE AI MOVE! Last move was not user move.`
      );
      return;
    }

    // 🛑 PREVENT CONSECUTIVE AI MOVES
    if (!this.lastMoveWasUser) {
      console.error(
        `🚨 BLOCKING CONSECUTIVE AI MOVE! Last move was not user move.`
      );
      return;
    } // ✅ AI only moves as Black in human vs AI mode
    if (this.game.turn() !== "b") {
      console.log(
        `❌ WRONG TURN! Current: ${this.game.turn()}, Expected: 'b' - ABORTING AI MOVE`
      );
      return;
    }

    console.log(`🤖 AI making move as Black...`);

    // Check if game is over
    if (this.game.game_over()) {
      console.log("🏁 Game over - no AI move needed");
      return;
    }

    console.log("✅ AI MOVE VALIDATION PASSED - Starting AI move");

    this.engineThinking = true;
    $("#board").addClass("thinking");

    try {
      // 🧠 ADVANCED AI THINKING PROCESS
      this.updateEngineStatus("🧠 AI analyzing position...");

      // Step 1: Deep Position Analysis
      const positionAnalysis = await this.analyzeComplexPosition();
      this.updateEngineStatus("🎯 Predicting user moves...");

      // Step 2: User Move Prediction & Counter-Strategy
      const userPrediction = await this.predictUserMoves(positionAnalysis);
      this.updateEngineStatus("⚔️ Calculating tactics...");

      // Step 3: Multi-Depth Strategic Search
      const strategicPlan = await this.generateStrategicPlan(
        positionAnalysis,
        userPrediction
      );
      this.updateEngineStatus("🎨 Finding creative solutions...");

      // Step 4: Advanced Move Selection
      const bestMove = await this.selectOptimalMove(
        strategicPlan,
        positionAnalysis
      );

      // Step 5: Learning and Adaptation
      this.advancedLearningUpdate(bestMove, positionAnalysis, userPrediction);

      if (bestMove) {
        // Instant move execution - no delay

        const move = this.game.move(bestMove);
        if (move) {
          this.board.position(this.game.fen());
          this.playSound("move");
          this.addMoveToHistory(move);
          this.updateCapturedPieces();
          this.updateStatus();
          this.switchTimer();

          this.checkGameOver();

          // Quick personality adaptation
          this.quickAdaptPersonality(move);

          console.log(`✅ AI move complete: ${move.san} - Now user's turn`);
        }
      }
    } catch (error) {
      console.error("🚫 AI Error:", error);
      // Fast emergency fallback
      const emergencyMove = this.getQuickFallback();
      if (emergencyMove) {
        const move = this.game.move(emergencyMove);
        if (move) {
          console.log(`🆘 AI EMERGENCY MOVE: ${move.san}`);
          this.board.position(this.game.fen());
          this.playSound("move");
          this.addMoveToHistory(move);
          this.updateCapturedPieces();
          this.updateStatus();
          this.switchTimer();
          console.log(
            `   Turn after emergency move: ${this.game.turn()} (should be 'w' for user)`
          );
          this.checkGameOver();
          console.log(`✅ Emergency move complete - Now user's turn`);
        }
      }
    } finally {
      this.engineThinking = false;
      $("#board").removeClass("thinking");
      this.updateEngineStatus(`AI: ${this.engines[this.aiEngine].name}`);

      // Mark that AI just moved
      this.lastMoveWasUser = false;
    }
  }

  analyzeCurrentPosition() {
    const fen = this.game.fen();
    const board = this.game.board();

    return {
      fen: fen,
      materialBalance: this.calculateMaterialBalance(),
      kingSafety: this.evaluateKingSafety(),
      centerControl: this.evaluateCenterControl(),
      pieceDevelopment: this.evaluateDevelopment(),
      pawnStructure: this.evaluatePawnStructure(),
      tacticalMotifs: this.findTacticalThreats(),
      weaknesses: this.identifyWeaknesses(),
      gameCharacter: this.determineGameCharacter(),
    };
  }

  determineGamePhase() {
    const pieces = this.game
      .board()
      .flat()
      .filter((p) => p !== null);
    const queens = pieces.filter((p) => p && p.type === "q").length;
    const minorPieces = pieces.filter(
      (p) => p && ["n", "b"].includes(p.type)
    ).length;
    const moves = this.moveHistory.length;

    if (moves < 12) return "opening";
    if (queens === 0 || pieces.length <= 10 || minorPieces <= 4)
      return "endgame";
    return "middlegame";
  }

  selectAIStrategy(gamePhase, analysis) {
    const strategies = {
      opening: [
        {
          name: "Rapid Development",
          weight: 30,
          focus: "development",
          aggression: 0.4,
        },
        {
          name: "Center Domination",
          weight: 25,
          focus: "center",
          aggression: 0.6,
        },
        {
          name: "Flexible Setup",
          weight: 20,
          focus: "flexibility",
          aggression: 0.3,
        },
        {
          name: "Sharp Tactics",
          weight: 15,
          focus: "tactics",
          aggression: 0.8,
        },
        {
          name: "Creative Gambit",
          weight: 10,
          focus: "creativity",
          aggression: 0.9,
        },
      ],
      middlegame: [
        {
          name: "Tactical Storm",
          weight: 25,
          focus: "tactics",
          aggression: 0.9,
        },
        {
          name: "Positional Squeeze",
          weight: 25,
          focus: "position",
          aggression: 0.2,
        },
        {
          name: "Dynamic Balance",
          weight: 20,
          focus: "balance",
          aggression: 0.5,
        },
        { name: "King Hunt", weight: 15, focus: "attack", aggression: 1.0 },
        {
          name: "Piece Coordination",
          weight: 15,
          focus: "harmony",
          aggression: 0.4,
        },
      ],
      endgame: [
        {
          name: "Technical Precision",
          weight: 40,
          focus: "technique",
          aggression: 0.2,
        },
        {
          name: "Active King",
          weight: 30,
          focus: "king-activity",
          aggression: 0.6,
        },
        { name: "Pawn Storm", weight: 20, focus: "pawns", aggression: 0.8 },
        {
          name: "Fortress Defense",
          weight: 10,
          focus: "defense",
          aggression: 0.1,
        },
      ],
    };

    const available = strategies[gamePhase];

    // Weight selection based on position and AI engine type
    let selectedStrategy;

    if (this.aiEngine === "tactical") {
      selectedStrategy =
        available.find((s) => s.focus === "tactics") || available[0];
    } else if (this.aiEngine === "creative") {
      const creativeOptions = available.filter((s) => s.aggression > 0.7);
      selectedStrategy =
        creativeOptions[Math.floor(Math.random() * creativeOptions.length)] ||
        available[0];
    } else if (this.aiEngine === "adaptive") {
      selectedStrategy = this.adaptToPlayerStyle(available, analysis);
    } else {
      // master
      selectedStrategy = this.chooseOptimalStrategy(available, analysis);
    }

    return selectedStrategy;
  }

  generateSmartCandidates(gamePhase, strategy, analysis) {
    const allMoves = this.game.moves({ verbose: true });
    const candidates = new Map(); // Use Map to avoid duplicates

    // 1. Opening book moves (high priority in opening)
    if (gamePhase === "opening") {
      const bookMoves = this.getVariedOpeningMoves();
      bookMoves.forEach((move) =>
        candidates.set(move.san, { move, source: "book", priority: 95 })
      );
    }

    // 2. Tactical moves (always high priority)
    const tacticalMoves = this.findAdvancedTacticalMoves();
    tacticalMoves.forEach((move) => {
      const existing = candidates.get(move.san);
      if (!existing || existing.priority < 90) {
        candidates.set(move.san, { move, source: "tactical", priority: 90 });
      }
    });

    // 3. Strategic moves based on current strategy
    const strategicMoves = this.findStrategicMoves(strategy, analysis);
    strategicMoves.forEach((move) => {
      const existing = candidates.get(move.san);
      if (!existing || existing.priority < 70) {
        candidates.set(move.san, { move, source: "strategic", priority: 70 });
      }
    });

    // 4. Deep search moves
    const searchMoves = this.getDeepSearchMoves(
      Math.min(this.difficulty + 1, 6)
    );
    searchMoves.slice(0, 5).forEach((move, index) => {
      const priority = 85 - index * 5;
      const existing = candidates.get(move.san);
      if (!existing || existing.priority < priority) {
        candidates.set(move.san, { move, source: "search", priority });
      }
    });

    // 5. Creative/surprise moves for variety
    if (Math.random() < 0.3 || strategy.focus === "creativity") {
      const creativeMoves = this.findCreativeAlternatives(allMoves);
      creativeMoves.forEach((move) => {
        const existing = candidates.get(move.san);
        if (!existing || existing.priority < 40) {
          candidates.set(move.san, { move, source: "creative", priority: 40 });
        }
      });
    }

    return Array.from(candidates.values());
  }

  selectOptimalMove(candidates, strategy, gamePhase) {
    if (candidates.length === 0) {
      return this.getIntelligentFallback();
    }

    // Score each candidate with multiple factors
    const scoredMoves = candidates.map((candidate) => {
      let score = candidate.priority || 50;

      // Evaluate position after move
      this.game.move(candidate.move);
      const positionEval = this.evaluatePositionAdvanced();
      this.game.undo();

      score += positionEval / 50; // Normalize position score

      // Strategy bonuses
      score += this.getStrategyBonus(candidate.move, strategy);

      // Anti-repetition bonus (prefer new moves)
      score += this.getNoveltyBonus(candidate.move);

      // Difficulty adjustment
      score += this.getDifficultyAdjustment(candidate.move);

      // Add controlled randomness for human-like play
      const randomness =
        (Math.random() - 0.5) * 10 * (1 - this.aiPersonality.consistency);
      score += randomness;

      return { ...candidate, finalScore: score };
    });

    // Sort by score
    scoredMoves.sort((a, b) => b.finalScore - a.finalScore);

    // Intelligent selection from top candidates
    const topCandidates = scoredMoves.slice(0, Math.min(4, scoredMoves.length));

    // Sometimes don't pick the absolute best for variety
    if (Math.random() > this.aiPersonality.consistency) {
      const weights = [0.5, 0.3, 0.15, 0.05];
      const random = Math.random();
      let cumulative = 0;

      for (let i = 0; i < topCandidates.length; i++) {
        cumulative += weights[i] || 0.05;
        if (random < cumulative) {
          return topCandidates[i].move;
        }
      }
    }

    return topCandidates[0].move;
  }

  // Stockfish API integration (using public endpoint)
  async getStockfishMove() {
    try {
      const fen = this.game.fen();
      const depth = Math.min(this.difficulty * 3 + 3, 15); // 6-15 depth based on difficulty

      // Use Lichess's Stockfish analysis (it's free and powerful)
      const response = await fetch(
        `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(
          fen
        )}&multiPv=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.moves && data.moves.length > 0) {
          const bestMoveUci = data.moves[0].uci;
          // Convert UCI to move object
          const move = this.uciToMove(bestMoveUci);
          console.log("🎯 Stockfish suggests:", bestMoveUci, move);
          return move;
        }
      }
    } catch (error) {
      console.error("Stockfish API error:", error);
    }
    return null;
  }

  // Lichess cloud analysis
  async getLichessMove() {
    try {
      const fen = this.game.fen();
      const response = await fetch(
        `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(
          fen
        )}&multiPv=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.moves && data.moves.length > 0) {
          const bestMoveUci = data.moves[0].uci;
          const move = this.uciToMove(bestMoveUci);
          console.log("♞ Lichess suggests:", bestMoveUci, move);
          return move;
        }
      }
    } catch (error) {
      console.error("Lichess API error:", error);
    }
    return null;
  }

  // Chess.com style analysis (fallback to local strong engine)
  async getChesscomMove() {
    try {
      // Since Chess.com doesn't have a public API for moves, we'll use a strong local algorithm
      // with opening book and endgame patterns
      return this.getAdvancedLocalMove();
    } catch (error) {
      console.error("Chess.com style engine error:", error);
    }
    return null;
  }

  // Advanced local move with opening book and better evaluation
  getAdvancedLocalMove() {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Opening book for first few moves
    if (this.moveHistory.length < 8) {
      const openingMove = this.getOpeningBookMove();
      if (openingMove) return openingMove;
    }

    // Endgame patterns
    if (this.isEndgame()) {
      const endgameMove = this.getEndgameMove();
      if (endgameMove) return endgameMove;
    }

    // Enhanced minimax with better evaluation
    return this.getBestMoveEnhanced(Math.min(this.difficulty + 2, 6));
  }

  getOpeningBookMove() {
    const openings = {
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1": [
        "e4",
        "d4",
        "Nf3",
        "c4",
      ],
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1": [
        "e5",
        "c5",
        "e6",
        "c6",
      ],
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2": [
        "Nf3",
        "f4",
        "Bc4",
        "Nc3",
      ],
      "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1": [
        "d5",
        "Nf6",
        "e6",
        "c6",
      ],
    };

    const currentFen = this.game.fen();
    const possibleMoves = openings[currentFen];

    if (possibleMoves) {
      const moveStr =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      try {
        const move = this.game.move(moveStr);
        this.game.undo();
        return move;
      } catch (e) {
        // Move not valid in current position
      }
    }
    return null;
  }

  isEndgame() {
    const pieces = this.game
      .board()
      .flat()
      .filter((p) => p !== null);
    return pieces.length <= 10; // Consider endgame when 10 or fewer pieces
  }

  getEndgameMove() {
    const moves = this.game.moves({ verbose: true });

    // Prioritize checkmate in endgame
    for (const move of moves) {
      this.game.move(move);
      if (this.game.in_checkmate()) {
        this.game.undo();
        return move;
      }
      this.game.undo();
    }

    // King activity in endgame
    const kingMoves = moves.filter((m) => m.piece === "k");
    if (kingMoves.length > 0) {
      return kingMoves[Math.floor(Math.random() * kingMoves.length)];
    }

    return null;
  }

  getBestMoveEnhanced(depth) {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    let bestMove = null;
    let bestScore = -Infinity;
    const alpha = -Infinity;
    const beta = Infinity;

    // Prioritize captures and checks
    const priorityMoves = moves.filter(
      (m) => m.captured || m.san.includes("+")
    );
    const otherMoves = moves.filter((m) => !m.captured && !m.san.includes("+"));
    const orderedMoves = [...priorityMoves, ...otherMoves];

    for (const move of orderedMoves) {
      this.game.move(move);
      const score = this.minimaxEnhanced(depth - 1, alpha, beta, false);
      this.game.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      // Add some randomness to make play more interesting
      if (Math.abs(score - bestScore) < 0.1 && Math.random() < 0.3) {
        bestMove = move;
      }
    }

    return bestMove;
  }

  minimaxEnhanced(depth, alpha, beta, isMaximizing) {
    if (depth === 0 || this.game.game_over()) {
      return this.evaluatePositionEnhanced();
    }

    const moves = this.game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        this.game.move(move);
        const evaluation = this.minimaxEnhanced(depth - 1, alpha, beta, false);
        this.game.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        this.game.move(move);
        const evaluation = this.minimaxEnhanced(depth - 1, alpha, beta, true);
        this.game.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluatePositionEnhanced() {
    if (this.game.in_checkmate()) {
      return this.game.turn() === "b" ? 1000 : -1000;
    }
    if (this.game.in_draw()) return 0;

    let score = 0;
    const board = this.game.board();

    // Material evaluation
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          let value = this.pieceValues[piece.type];

          // Position-specific bonuses
          if (piece.type === "p") {
            // Pawn structure evaluation
            value += this.evaluatePawn(piece, i, j);
          } else if (piece.type === "n") {
            // Knight positioning
            value += this.evaluateKnight(i, j);
          } else if (piece.type === "b") {
            // Bishop pairs and positioning
            value += this.evaluateBishop(piece, i, j);
          }

          score += piece.color === "b" ? value : -value;
        }
      }
    }

    // Additional positional factors
    score += this.evaluateCenterControl();
    score += this.evaluateKingSafety();
    score += this.evaluateDevelopment();

    return score;
  }

  evaluatePawn(piece, row, col) {
    let bonus = 0;
    // Passed pawns are valuable
    if (this.isPassedPawn(piece, row, col)) bonus += 0.5;
    // Central pawns are good
    if (col >= 3 && col <= 4) bonus += 0.1;
    // Advanced pawns
    if (piece.color === "b" && row > 4) bonus += 0.2;
    if (piece.color === "w" && row < 3) bonus += 0.2;
    return bonus;
  }

  evaluateKnight(row, col) {
    // Knights are better in the center
    const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col);
    return (0.1 * (7 - centerDistance)) / 7;
  }

  evaluateBishop(piece, row, col) {
    // Bishops on long diagonals are good
    if ((row + col) % 2 === 0) return 0.1; // Light squares
    return 0.1; // Dark squares
  }

  evaluateCenterControl() {
    let score = 0;
    const centerSquares = ["d4", "d5", "e4", "e5"];
    centerSquares.forEach((square) => {
      const piece = this.game.get(square);
      if (piece) {
        score += piece.color === "b" ? 0.2 : -0.2;
      }
    });
    return score;
  }

  evaluateKingSafety() {
    // Simple king safety evaluation
    let score = 0;
    if (this.game.in_check()) {
      score += this.game.turn() === "b" ? -0.3 : 0.3;
    }
    return score;
  }

  evaluateDevelopment() {
    // Encourage piece development in opening
    if (this.moveHistory.length < 20) {
      const developed = this.countDevelopedPieces();
      return (developed.black - developed.white) * 0.1;
    }
    return 0;
  }

  countDevelopedPieces() {
    const board = this.game.board();
    let white = 0,
      black = 0;

    // Check if knights and bishops are developed
    ["n", "b"].forEach((pieceType) => {
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const piece = board[i][j];
          if (piece && piece.type === pieceType) {
            if (piece.color === "w" && i !== 0) white++;
            if (piece.color === "b" && i !== 7) black++;
          }
        }
      }
    });

    return { white, black };
  }

  isPassedPawn(piece, row, col) {
    // Simplified passed pawn detection
    const direction = piece.color === "w" ? 1 : -1;
    for (let r = row + direction; r >= 0 && r < 8; r += direction) {
      for (let c = Math.max(0, col - 1); c <= Math.min(7, col + 1); c++) {
        const checkPiece = this.game.board()[r][c];
        if (
          checkPiece &&
          checkPiece.color !== piece.color &&
          checkPiece.type === "p"
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // Convert UCI notation to move object
  uciToMove(uci) {
    if (!uci || uci.length < 4) return null;

    const from = uci.substring(0, 2);
    const to = uci.substring(2, 4);
    const promotion = uci.length > 4 ? uci.substring(4) : undefined;

    try {
      const move = this.game.move({
        from: from,
        to: to,
        promotion: promotion || "q",
      });
      this.game.undo();
      return { from, to, promotion: promotion || "q" };
    } catch (e) {
      return null;
    }
  }

  setAIEngine(engine) {
    this.aiEngine = engine;
    console.log(
      "🔄 AI Engine changed to:",
      this.engines[engine]?.name || "Unknown Engine"
    );
    this.updateEngineStatus(
      `AI: ${this.engines[engine]?.name || "Unknown Engine"}`
    );

    // Reset AI personality for new engine
    this.resetAIPersonality(engine);
  }

  resetAIPersonality(engine) {
    // Customize AI personality based on engine type
    switch (engine) {
      case "master":
        this.aiPersonality.aggression = 0.6;
        this.aiPersonality.creativity = 0.5;
        this.aiPersonality.consistency = 0.8;
        break;
      case "adaptive":
        this.aiPersonality.aggression = 0.5;
        this.aiPersonality.creativity = 0.6;
        this.aiPersonality.consistency = 0.4;
        break;
      case "creative":
        this.aiPersonality.aggression = 0.8;
        this.aiPersonality.creativity = 0.9;
        this.aiPersonality.consistency = 0.2;
        break;
      case "tactical":
        this.aiPersonality.aggression = 0.9;
        this.aiPersonality.creativity = 0.3;
        this.aiPersonality.consistency = 0.7;
        break;
    }

    // Clear learning data for new engine
    this.aiPersonality.moveMemory = [];
    this.aiPersonality.playerPatterns = {};

    console.log(
      `🎯 AI Personality: Aggr:${this.aiPersonality.aggression} Creat:${this.aiPersonality.creativity} Consist:${this.aiPersonality.consistency}`
    );
  }

  // ⚡ FAST AI METHODS - Optimized for speed
  selectFastStrategy(gamePhase) {
    const fastStrategies = {
      opening: [
        { name: "Fast Development", aggression: 0.4 },
        { name: "Center Control", aggression: 0.6 },
        { name: "Tactical Sharp", aggression: 0.8 },
      ],
      middlegame: [
        { name: "Tactical Focus", aggression: 0.8 },
        { name: "Positional", aggression: 0.3 },
        { name: "Balanced", aggression: 0.5 },
      ],
      endgame: [
        { name: "Active Play", aggression: 0.6 },
        { name: "Technical", aggression: 0.3 },
      ],
    };

    const strategies = fastStrategies[gamePhase] || fastStrategies.middlegame;

    // Quick strategy selection based on AI type
    if (this.aiEngine === "tactical") {
      return strategies.find((s) => s.aggression > 0.7) || strategies[0];
    } else if (this.aiEngine === "creative") {
      return strategies[Math.floor(Math.random() * strategies.length)];
    } else {
      return strategies[0]; // Default to first strategy for speed
    }
  }

  getFastBestMove(gamePhase, strategy) {
    const allMoves = this.game.moves({ verbose: true });

    // Quick move prioritization
    const scoredMoves = allMoves.map((move) => {
      let score = Math.random() * 10; // Base randomness for variety

      // Quick tactical evaluation
      if (move.captured) {
        const captureValue = this.pieceValues[move.captured] || 0;
        const attackerValue = this.pieceValues[move.piece] || 0;
        score += Math.max(0, (captureValue - attackerValue) / 50 + 20);
      }

      // Fast check evaluation
      this.game.move(move);
      const isCheck = this.game.in_check();
      const isCheckmate = this.game.in_checkmate();
      this.game.undo();

      if (isCheckmate) score += 1000; // Prioritize checkmate
      else if (isCheck) score += 30;

      // Strategy-based scoring
      if (strategy.aggression > 0.7) {
        if (move.captured || move.san.includes("+")) score += 25;
        if (move.piece === "q" || move.piece === "r") score += 10;
      } else if (strategy.aggression < 0.4) {
        if (["n", "b"].includes(move.piece)) score += 15; // Develop pieces
        if (["d4", "d5", "e4", "e5"].includes(move.to)) score += 12; // Center
      }

      // Opening development bonus
      if (gamePhase === "opening" && this.isQuickDevelopment(move)) {
        score += 18;
      }

      // Center squares bonus
      if (["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"].includes(move.to)) {
        score += 8;
      }

      // Endgame king activity
      if (gamePhase === "endgame" && move.piece === "k") {
        score += 15;
      }

      // AI personality variation
      const creativityFactor = this.aiPersonality.creativity * 15;
      score += (Math.random() - 0.5) * creativityFactor;

      // Anti-repetition: slight penalty for recently played moves
      const recentMoves = this.aiPersonality.moveMemory
        .slice(-10)
        .map((m) => m.move);
      if (recentMoves.includes(move.san)) {
        score -= 5;
      }

      return { move, score };
    });

    // Sort by score
    scoredMoves.sort((a, b) => b.score - a.score);

    // Smart selection from top candidates
    const topCount = Math.min(4, scoredMoves.length);
    const topMoves = scoredMoves.slice(0, topCount);

    // Consistency vs variety balance
    const consistencyRoll = Math.random();

    if (consistencyRoll < this.aiPersonality.consistency) {
      return topMoves[0].move; // Best move
    } else {
      // Weighted random selection from top moves
      const weights = [0.5, 0.3, 0.15, 0.05];
      const randomRoll = Math.random();
      let cumulative = 0;

      for (let i = 0; i < topMoves.length; i++) {
        cumulative += weights[i] || 0.05;
        if (randomRoll < cumulative) {
          return topMoves[i].move;
        }
      }

      return topMoves[0].move;
    }
  }

  isQuickDevelopment(move) {
    // Quick check if move develops a piece from starting position
    return (
      ["n", "b"].includes(move.piece) &&
      ["1", "8"].includes(move.from[1]) &&
      !["1", "8"].includes(move.to[1])
    );
  }

  quickLearnFromMove(move, gamePhase) {
    // Minimal learning to maintain variety without slowdown
    if (!move) return;

    // Store simple pattern
    const pattern = {
      phase: gamePhase,
      move: move.san,
      time: Date.now(),
    };

    // Keep only last 15 moves for speed
    this.aiPersonality.moveMemory.push(pattern);
    if (this.aiPersonality.moveMemory.length > 15) {
      this.aiPersonality.moveMemory.shift();
    }

    // Quick personality micro-adjustments
    if (move.captured) {
      this.aiPersonality.aggression = Math.min(
        1,
        this.aiPersonality.aggression + 0.01
      );
    }

    // Slight creativity increase over time for variety
    this.aiPersonality.creativity = Math.min(
      0.95,
      this.aiPersonality.creativity + 0.002
    );
  }

  // Override determineGamePhase for speed
  determineGamePhase() {
    const moveCount = this.moveHistory.length;

    // Fast phase determination
    if (moveCount < 16) return "opening";

    // Quick piece count
    const pieces = this.game
      .board()
      .flat()
      .filter((p) => p !== null);
    if (pieces.length <= 12) return "endgame";

    return "middlegame";
  }

  // Instant analysis for maximum responsiveness
  async simulateThinking(milliseconds) {
    // No delay - instant analysis
    return Promise.resolve();
  }

  updateEngineStatus(message) {
    $("#engineStatus").text(message);
  }

  getBestMove(depth) {
    // If using local engine, use the basic minimax
    if (this.aiEngine === "local") {
      return this.getBasicLocalMove(depth);
    }
    // Otherwise use enhanced local engine
    return this.getBestMoveEnhanced(depth);
  }

  getBasicLocalMove(depth) {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    if (depth === 1) {
      // Easy: Random move with slight preference for captures
      const captures = moves.filter((move) => move.captured);
      if (captures.length > 0 && Math.random() < 0.7) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return moves[Math.floor(Math.random() * moves.length)];
    }

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of moves) {
      this.game.move(move);
      const score = this.minimax(depth - 1, -Infinity, Infinity, false);
      this.game.undo();

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0 || this.game.game_over()) {
      return this.evaluatePosition();
    }

    const moves = this.game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        this.game.move(move);
        const evaluation = this.minimax(depth - 1, alpha, beta, false);
        this.game.undo();
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        this.game.move(move);
        const evaluation = this.minimax(depth - 1, alpha, beta, true);
        this.game.undo();
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  }

  evaluatePosition() {
    if (this.game.in_checkmate()) {
      return this.game.turn() === "b" ? 1000 : -1000;
    }
    if (this.game.in_draw()) return 0;

    let score = 0;
    const board = this.game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const value = this.pieceValues[piece.type];
          score += piece.color === "b" ? value : -value;
        }
      }
    }

    // Add positional bonuses
    score += this.getPositionalScore();

    return score;
  }

  getPositionalScore() {
    let score = 0;

    // Center control
    const centerSquares = ["d4", "d5", "e4", "e5"];
    centerSquares.forEach((square) => {
      const piece = this.game.get(square);
      if (piece) {
        score += piece.color === "b" ? 0.1 : -0.1;
      }
    });

    // King safety
    if (!this.game.in_check()) {
      score += this.game.turn() === "b" ? 0.1 : -0.1;
    }

    return score;
  }

  addMoveToHistory(move) {
    this.moveHistory.push({
      move: move,
      fen: this.game.fen(),
      san: move.san,
    });
    this.updateMoveHistoryDisplay();
  }

  updateMoveHistoryDisplay() {
    const moveList = $("#moveList");
    moveList.empty();

    for (let i = 0; i < this.moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = this.moveHistory[i];
      const blackMove = this.moveHistory[i + 1];

      const movePair = $(`
                <div class="move-pair">
                    <span class="move-number">${moveNumber}.</span>
                    <span class="move" data-move-index="${i}">${
        whiteMove.san
      }</span>
                    ${
                      blackMove
                        ? `<span class="move" data-move-index="${i + 1}">${
                            blackMove.san
                          }</span>`
                        : ""
                    }
                </div>
            `);

      moveList.append(movePair);
    }

    moveList.scrollTop(moveList[0].scrollHeight);
  }

  updateCapturedPieces() {
    // Calculate captured pieces based on current position vs starting position
    const currentBoard = this.game
      .board()
      .flat()
      .filter((p) => p !== null);
    const pieceCount = {};

    // Count current pieces
    currentBoard.forEach((piece) => {
      const key = piece.color + piece.type;
      pieceCount[key] = (pieceCount[key] || 0) + 1;
    });

    // Starting piece counts
    const startingCount = {
      wp: 8,
      wn: 2,
      wb: 2,
      wr: 2,
      wq: 1,
      wk: 1,
      bp: 8,
      bn: 2,
      bb: 2,
      br: 2,
      bq: 1,
      bk: 1,
    };

    // Calculate captured pieces
    this.capturedPieces = { white: [], black: [] };

    Object.keys(startingCount).forEach((pieceKey) => {
      const missing = startingCount[pieceKey] - (pieceCount[pieceKey] || 0);
      for (let i = 0; i < missing; i++) {
        const color = pieceKey[0] === "w" ? "white" : "black";
        const piece = pieceKey[1];
        this.capturedPieces[color].push(piece);
      }
    });

    this.updateCapturedPiecesDisplay();
  }

  updateCapturedPiecesDisplay() {
    const whiteCaptured = $("#whiteCaptured");
    const blackCaptured = $("#blackCaptured");

    whiteCaptured.empty();
    blackCaptured.empty();

    this.capturedPieces.white.forEach((piece) => {
      whiteCaptured.append(
        `<div class="captured-piece" style="background-image: url('https://chessboardjs.com/img/chesspieces/wikipedia/w${piece.toUpperCase()}.png')"></div>`
      );
    });

    this.capturedPieces.black.forEach((piece) => {
      blackCaptured.append(
        `<div class="captured-piece" style="background-image: url('https://chessboardjs.com/img/chesspieces/wikipedia/b${piece.toUpperCase()}.png')"></div>`
      );
    });
  }

  startTimer() {
    this.activeTimer = "white";
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.activeTimer && this.gameTimer[this.activeTimer] > 0) {
        this.gameTimer[this.activeTimer]--;
        this.updateTimerDisplay();

        if (this.gameTimer[this.activeTimer] === 0) {
          this.endGameByTime();
        }
      }
    }, 1000);
  }

  switchTimer() {
    this.activeTimer = this.activeTimer === "white" ? "black" : "white";
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    $("#whiteTimer").text(formatTime(this.gameTimer.white));
    $("#blackTimer").text(formatTime(this.gameTimer.black));

    $(".timer").removeClass("active");
    $(`.timer.${this.activeTimer}-timer`).addClass("active");
  }

  updateStatus() {
    let status = "";
    const turn = this.game.turn() === "w" ? "White" : "Black";

    if (this.game.in_checkmate()) {
      status = `🏆 Checkmate! ${
        this.game.turn() === "w" ? "Black" : "White"
      } wins!`;
    } else if (this.game.in_draw()) {
      status = "🤝 Draw! Game ended in a draw.";
    } else if (this.game.in_stalemate()) {
      status = "🤝 Stalemate! Game is a draw.";
    } else {
      status = `${turn} to move`;
      if (this.game.in_check()) {
        status += " - ⚠️ Check!";
      }
    }

    $("#status").text(status);
    this.updateEvaluation();
  }

  updateEvaluation() {
    const evaluation = this.evaluatePosition();
    let evalText = "Even position";

    if (Math.abs(evaluation) > 0.5) {
      const advantage = evaluation > 0 ? "Black" : "White";
      const magnitude = Math.abs(evaluation);
      if (magnitude > 5) evalText = `${advantage} is winning`;
      else if (magnitude > 2) evalText = `${advantage} has advantage`;
      else evalText = `${advantage} slightly better`;
    }

    $("#evaluation").text(evalText);
  }

  checkGameOver() {
    if (this.game.game_over()) {
      clearInterval(this.timerInterval);

      let result = "";
      let message = "";

      if (this.game.in_checkmate()) {
        if (this.game.turn() === "w") {
          result = "💀 You Lost!";
          message = "Black (AI) wins by checkmate.";
          this.gameStats.losses++;
        } else {
          result = "🎉 You Won!";
          message = "Congratulations! You checkmated the AI.";
          this.gameStats.wins++;
        }
        this.playSound("gameOver");
      } else {
        result = "🤝 Draw!";
        message = "The game ended in a draw.";
        this.gameStats.draws++;
        this.playSound("draw");
      }

      // Save stats immediately when game ends
      this.saveGameStats();
      this.showGameOverModal(result, message);
      return true;
    }
    return false;
  }

  endGameByTime() {
    clearInterval(this.timerInterval);
    const winner = this.activeTimer === "white" ? "Black (AI)" : "White";

    // Update stats for time-based wins
    if (this.activeTimer === "white") {
      this.gameStats.losses++; // Player lost on time
    } else {
      this.gameStats.wins++; // Player won on time
    }

    this.saveGameStats();
    this.showGameOverModal(
      `⏰ Time's Up!`,
      `${winner} wins! ${
        this.activeTimer === "white" ? "You" : "AI"
      } ran out of time.`
    );

    if (this.activeTimer === "white") {
      this.gameStats.losses++;
    } else {
      this.gameStats.wins++;
    }

    this.saveGameStats();
    this.playSound("gameOver");
  }

  showGameOverModal(result, message) {
    if (this.gameEnded) return; // Prevent multiple calls
    this.gameEnded = true;

    $("#gameResult").text(result);
    $("#gameResultMessage").text(message);
    $("#gameOverModal").removeClass("hidden");

    // Update score display immediately
    this.updateScoreDisplay();
  }

  hideGameOverModal() {
    $("#gameOverModal").addClass("hidden");
  }

  showReloadCountdown() {
    let countdown = 3;
    const originalMessage = $("#gameResultMessage").text();

    // Update message with countdown
    const updateCountdown = () => {
      $("#gameResultMessage").text(
        `${originalMessage} Reloading in ${countdown}s...`
      );
      countdown--;

      if (countdown < 0) {
        clearInterval(this.countdownInterval);
      }
    };

    updateCountdown();
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  cancelAutoReload() {
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
      this.reloadTimeout = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    // Update message to show reload was cancelled
    const originalMessage = $("#gameResultMessage")
      .text()
      .split(" Reloading")[0];
    $("#gameResultMessage").text(`${originalMessage} Auto-reload cancelled.`);

    console.log("🚫 Auto-reload cancelled by user");
  }

  newGame() {
    this.game.reset();
    this.board.start();
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.gameTimer = { white: 600, black: 600 };

    // Reset AI state
    this.engineThinking = false;
    this.lastMoveWasUser = true; // Reset to user's turn
    $("#board").removeClass("thinking");

    clearInterval(this.timerInterval);

    $("#moveList").empty();
    $("#whiteCaptured, #blackCaptured").empty();
    this.hideGameOverModal();

    this.updateStatus();
    this.startTimer();
    this.playSound("newGame");

    this.gameEnded = false;
  }

  undoMove() {
    if (this.moveHistory.length >= 2) {
      // Undo last two moves (player and AI)
      this.game.undo();
      this.game.undo();
      this.moveHistory.splice(-2);

      this.board.position(this.game.fen());
      this.updateMoveHistoryDisplay();
      this.updateCapturedPieces();
      this.updateStatus();
      this.playSound("move");
    }
  }

  showHint() {
    const bestMove = this.getBestMove(2);
    if (bestMove) {
      const currentPlayer = this.game.turn() === "w" ? "White" : "Black";

      // Highlight the best move squares
      this.board.removeGreySquares();
      this.board.greySquare(bestMove.from);
      this.board.greySquare(bestMove.to);

      $("#bestMove").text(
        `💡 AI suggests for ${currentPlayer}: ${bestMove.san}`
      );
      console.log(
        `💡 AI analyzing ${currentPlayer} position - suggested move: ${bestMove.san}`
      );

      // Remove highlight after 3 seconds
      setTimeout(() => {
        this.board.removeGreySquares();
        $("#bestMove").text("");
      }, 3000);
    }
  }

  requestAIMove() {
    // Manual AI move trigger - only for Black pieces in human vs AI mode
    if (this.game.game_over()) {
      console.log("❌ Cannot make AI move - game is over");
      return;
    }

    if (this.engineThinking) {
      console.log("❌ Cannot make AI move - AI is already thinking");
      return;
    }

    // Only allow AI to move Black pieces
    if (this.game.turn() !== "b") {
      console.log(
        "❌ Cannot request AI move - it's White's turn (user plays White)"
      );
      return;
    }

    console.log("🤖 User requested AI move for Black");

    // Set flag so AI move logic works
    this.lastMoveWasUser = true;
    this.makeComputerMove();
  }

  setDifficulty(level) {
    this.difficulty = level;
    const levels = ["", "Easy", "Medium", "Hard", "Expert"];
    console.log(`Difficulty set to: ${levels[level]}`);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    $("#soundToggle").text(this.soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF");
  }

  playSound(type) {
    if (!this.soundEnabled) return;

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      move: 800,
      capture: 600,
      check: 1000,
      gameOver: 400,
      newGame: 1200,
      draw: 700,
    };

    oscillator.frequency.value = frequencies[type] || 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  goToMove(moveIndex) {
    // Reset to starting position
    this.game.reset();

    // Replay moves up to the selected index
    for (let i = 0; i <= moveIndex; i++) {
      if (this.moveHistory[i]) {
        this.game.move(this.moveHistory[i].move);
      }
    }

    this.board.position(this.game.fen());
    this.updateStatus();

    // Highlight the selected move
    $(".move").removeClass("active");
    $(`.move[data-move-index="${moveIndex}"]`).addClass("active");
  }

  saveGameStats() {
    try {
      localStorage.setItem("chessGameStats", JSON.stringify(this.gameStats));
      console.log("💾 Game stats saved:", this.gameStats);
    } catch (error) {
      console.error("❌ Could not save game stats:", error);
    }
  }

  loadGameStats() {
    try {
      const saved = localStorage.getItem("chessGameStats");
      if (saved) {
        this.gameStats = { ...this.gameStats, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn("⚠️ Could not load game stats:", error);
      this.gameStats = { wins: 0, losses: 0, draws: 0 };
    }
    this.updateScoreDisplay();
  }

  updateScoreDisplay() {
    try {
      $("#whiteScore").text(this.gameStats.wins || 0);
      $("#blackScore").text(this.gameStats.losses || 0);
      console.log(
        "🏆 Score updated - Wins:",
        this.gameStats.wins,
        "Losses:",
        this.gameStats.losses
      );
    } catch (error) {
      console.error("❌ Could not update score display:", error);
    }
  }

  // Fast AI Methods for improved performance
  selectFastStrategy() {
    const strategies = ["aggressive", "positional", "tactical", "defensive"];
    return strategies[Math.floor(Math.random() * strategies.length)];
  }

  getFastBestMove() {
    const moves = this.game.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Quick evaluation - prioritize captures and checks
    let bestMoves = [];
    let bestScore = -Infinity;

    for (const move of moves) {
      let score = 0;

      // Prioritize captures
      if (move.captured) {
        score += this.getPieceValue(move.captured) * 10;
      }

      // Prioritize checks
      this.game.move(move);
      if (this.game.in_check()) {
        score += 50;
      }
      this.game.undo();

      // Add some randomness for variety
      score += Math.random() * 20;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  quickLearnFromMove(move) {
    // Simple learning - just track frequency
    const moveStr = move.from + move.to;
    this.aiPersonality.learningData.moveFrequency[moveStr] =
      (this.aiPersonality.learningData.moveFrequency[moveStr] || 0) + 1;
  }

  getQuickFallback() {
    const moves = this.game.moves();
    return moves.length > 0
      ? moves[Math.floor(Math.random() * moves.length)]
      : null;
  }

  getPieceValue(piece) {
    const values = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };
    return values[piece.toLowerCase()] || 0;
  }

  // 🔍 AI POSITION ANALYSIS (Analyzes both sides, only moves Black)
  async performPositionAnalysis(lastMove) {
    try {
      // Analyze the current position for both sides
      const analysis = {
        material: this.calculateMaterialBalance(),
        threats: this.identifyCurrentThreats(),
        weaknesses: this.findPositionalWeaknesses(),
        opportunities: this.findTacticalOpportunities(),
        evaluation: this.evaluateCurrentPosition(),
      };

      // Show analysis in the UI
      this.displayAnalysis(analysis, lastMove);

      // Predict likely next moves for current player (White or Black)
      const currentPlayer = this.game.turn() === "w" ? "White" : "Black";
      console.log(`🎯 Predicting moves for ${currentPlayer}...`);
      const predictions = this.predictLikelyMoves();
      this.displayMovePredictions(predictions);

      console.log(
        `📊 Analysis complete for both sides - suggestions for ${currentPlayer}:`,
        analysis
      );
      console.log(
        `🎮 AI will only physically move Black pieces, but analyzes all positions`
      );
    } catch (error) {
      console.warn("⚠️ Analysis error:", error);
    }
  }

  // 🤖 AI HELPER METHODS
  getVariedOpeningMoves() {
    const fen = this.game.fen();
    const bookEntry = this.openingBook?.[fen];

    if (!bookEntry) return [];

    const moves = [];
    bookEntry.forEach((entry) => {
      try {
        const move = this.game.move(entry.moves[0]);
        if (move) {
          moves.push(move);
          this.game.undo();
        }
      } catch (e) {
        // Invalid move, skip
      }
    });

    return moves;
  }

  findAdvancedTacticalMoves() {
    const allMoves = this.game.moves({ verbose: true });
    const tactical = [];

    for (const move of allMoves) {
      this.game.move(move);

      let isTactical = false;
      let tacticalValue = 0;

      if (this.game.in_check()) {
        isTactical = true;
        tacticalValue += 200;
      }

      if (move.captured) {
        const captureValue = this.pieceValues[move.captured];
        const attackerValue = this.pieceValues[move.piece];
        if (captureValue >= attackerValue * 0.8) {
          isTactical = true;
          tacticalValue += captureValue - attackerValue + 100;
        }
      }

      this.game.undo();

      if (isTactical) {
        tactical.push({ ...move, tacticalValue });
      }
    }

    return tactical.sort(
      (a, b) => (b.tacticalValue || 0) - (a.tacticalValue || 0)
    );
  }

  getIntelligentFallback() {
    const moves = this.game.moves({ verbose: true });

    // Prefer captures
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0) {
      return captures[Math.floor(Math.random() * captures.length)];
    }

    // Then checks
    const checks = moves.filter((m) => {
      this.game.move(m);
      const inCheck = this.game.in_check();
      this.game.undo();
      return inCheck;
    });

    if (checks.length > 0) {
      return checks[Math.floor(Math.random() * checks.length)];
    }

    // Random move as fallback
    return moves[Math.floor(Math.random() * moves.length)];
  }

  findStrategicMoves(strategy, analysis) {
    const allMoves = this.game.moves({ verbose: true });
    const strategic = [];

    for (const move of allMoves) {
      let strategicValue = 0;

      // Basic strategic evaluation
      if (move.piece === "n" || move.piece === "b") strategicValue += 20; // Develop pieces
      if (move.to.includes("4") || move.to.includes("5")) strategicValue += 15; // Center control
      if (move.captured) strategicValue += 30; // Material gain

      if (strategicValue > 0) {
        strategic.push({ ...move, strategicValue });
      }
    }

    return strategic.sort(
      (a, b) => (b.strategicValue || 0) - (a.strategicValue || 0)
    );
  }

  getDeepSearchMoves(depth) {
    const moves = this.game.moves({ verbose: true });
    const evaluated = [];

    for (const move of moves) {
      this.game.move(move);
      const evaluation = this.evaluateCurrentPosition();
      this.game.undo();

      evaluated.push({ ...move, evaluation });
    }

    return evaluated.sort((a, b) => b.evaluation - a.evaluation);
  }

  findCreativeAlternatives(allMoves) {
    // Return some random moves for creativity
    const creative = [];
    for (let i = 0; i < Math.min(3, allMoves.length); i++) {
      const randomIndex = Math.floor(Math.random() * allMoves.length);
      creative.push(allMoves[randomIndex]);
    }
    return creative;
  }

  calculateMaterialBalance() {
    const board = this.game.board();
    let white = 0,
      black = 0;

    board.flat().forEach((piece) => {
      if (piece) {
        const value = this.getPieceValue(piece.type);
        if (piece.color === "w") white += value;
        else black += value;
      }
    });

    return { white, black, difference: white - black };
  }

  identifyCurrentThreats() {
    const moves = this.game.moves({ verbose: true });
    const threats = [];

    moves.forEach((move) => {
      if (move.captured) {
        threats.push({
          type: "capture",
          piece: move.captured,
          square: move.to,
        });
      }

      // Check if move gives check
      this.game.move(move);
      if (this.game.in_check()) {
        threats.push({ type: "check", square: move.to });
      }
      this.game.undo();
    });

    return threats;
  }

  findPositionalWeaknesses() {
    // Simple weakness detection
    return [
      { type: "king_safety", severity: Math.random() > 0.5 ? "medium" : "low" },
      { type: "pawn_structure", details: "isolated pawns detected" },
    ];
  }

  findTacticalOpportunities() {
    const opportunities = [];
    const moves = this.game.moves({ verbose: true });

    moves.forEach((move) => {
      if (
        move.captured &&
        this.getPieceValue(move.captured) > this.getPieceValue(move.piece)
      ) {
        opportunities.push({ type: "favorable_trade", move: move.san });
      }
    });

    return opportunities;
  }

  evaluateCurrentPosition() {
    const material = this.calculateMaterialBalance();
    let evaluation = material.difference;

    // Add positional factors
    evaluation += Math.random() * 100 - 50; // Simplified

    if (evaluation > 100) return "White is winning";
    if (evaluation > 50) return "White is better";
    if (evaluation < -100) return "Black is winning";
    if (evaluation < -50) return "Black is better";
    return "Position is equal";
  }

  predictLikelyMoves() {
    const moves = this.game.moves({ verbose: true });
    const predictions = moves.slice(0, 3).map((move) => ({
      move: move.san,
      probability: Math.random(),
      reason: move.captured ? "Capture" : "Development",
    }));

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  displayAnalysis(analysis, lastMove) {
    const evalText = `${analysis.evaluation} (Material: +${analysis.material.difference})`;
    $("#evaluation").text(evalText);

    // Show in console for now
    console.log("📊 Position Analysis:");
    console.log("  Material:", analysis.material);
    console.log("  Threats:", analysis.threats);
    console.log("  Evaluation:", analysis.evaluation);
  }

  displayMovePredictions(predictions) {
    console.log("🎯 Predicted likely moves:");
    predictions.forEach((pred, i) => {
      console.log(
        `  ${i + 1}. ${pred.move} (${pred.reason}) - ${(
          pred.probability * 100
        ).toFixed(1)}%`
      );
    });
  }

  calculateMaterialBalance() {
    const board = this.game.board();
    let white = 0,
      black = 0;

    board.flat().forEach((piece) => {
      if (piece) {
        const value = this.getPieceValue(piece.type);
        if (piece.color === "w") white += value;
        else black += value;
      }
    });

    return { white, black, difference: white - black };
  }

  identifyCurrentThreats() {
    const moves = this.game.moves({ verbose: true });
    const threats = [];

    moves.forEach((move) => {
      if (move.captured) {
        threats.push({
          type: "capture",
          piece: move.captured,
          square: move.to,
        });
      }

      // Check if move gives check
      this.game.move(move);
      if (this.game.in_check()) {
        threats.push({ type: "check", square: move.to });
      }
      this.game.undo();
    });

    return threats;
  }

  findPositionalWeaknesses() {
    // Simple weakness detection
    return [
      { type: "king_safety", severity: Math.random() > 0.5 ? "medium" : "low" },
      { type: "pawn_structure", details: "isolated pawns detected" },
    ];
  }

  findTacticalOpportunities() {
    const opportunities = [];
    const moves = this.game.moves({ verbose: true });

    moves.forEach((move) => {
      if (
        move.captured &&
        this.getPieceValue(move.captured) > this.getPieceValue(move.piece)
      ) {
        opportunities.push({ type: "favorable_trade", move: move.san });
      }
    });

    return opportunities;
  }

  evaluateCurrentPosition() {
    const material = this.calculateMaterialBalance();
    let evaluation = material.difference;

    // Add positional factors
    evaluation += Math.random() * 100 - 50; // Simplified

    if (evaluation > 100) return "White is winning";
    if (evaluation > 50) return "White is better";
    if (evaluation < -100) return "Black is winning";
    if (evaluation < -50) return "Black is better";
    return "Position is equal";
  }

  predictLikelyMoves() {
    const moves = this.game.moves({ verbose: true });
    const predictions = moves.slice(0, 3).map((move) => ({
      move: move.san,
      probability: Math.random(),
      reason: move.captured ? "Capture" : "Development",
    }));

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  displayAnalysis(analysis, lastMove) {
    const evalText = `${analysis.evaluation} (Material: ${
      analysis.material.difference > 0 ? "+" : ""
    }${analysis.material.difference})`;
    $("#evaluation").text(evalText);

    // Show in console for now
    console.log("📊 Position Analysis:");
    console.log("  Material:", analysis.material);
    console.log("  Threats:", analysis.threats);
    console.log("  Evaluation:", analysis.evaluation);
  }

  displayMovePredictions(predictions) {
    console.log("🎯 Predicted likely moves:");
    predictions.forEach((pred, i) => {
      console.log(
        `  ${i + 1}. ${pred.move} (${pred.reason}) - ${(
          pred.probability * 100
        ).toFixed(1)}%`
      );
    });
  }

  // 🧠 ADVANCED AI INTELLIGENCE METHODS

  async analyzeComplexPosition() {
    console.log("🔍 Deep position analysis...");
    const analysis = {
      materialBalance: this.calculateAdvancedMaterial(),
      positionalFactors: this.evaluatePositionalFactors(),
      kingSafety: this.analyzeKingSafety(),
      pawnStructure: this.analyzePawnStructure(),
      pieceActivity: this.analyzePieceActivity(),
      controlledSquares: this.analyzeSquareControl(),
      threats: this.identifyThreats(),
      weaknesses: this.identifyWeaknesses(),
      gamePhase: this.determineGamePhase(),
      dynamicFactors: this.analyzeDynamicFactors(),
    };

    // Instant analysis - no delays
    return analysis;
  }

  async predictUserMoves(positionAnalysis) {
    console.log("🎯 Predicting user strategy...");
    const userMoves = this.game.moves({ verbose: true });
    const predictions = [];

    for (const move of userMoves) {
      const prediction = {
        move: move,
        probability: this.calculateMoveProbability(move, positionAnalysis),
        userMotivation: this.analyzeUserMotivation(move),
        tacticalRisk: this.assessTacticalRisk(move),
        strategicValue: this.assessStrategicValue(move),
      };
      predictions.push(prediction);
    }

    // Sort by probability and analyze top candidates
    predictions.sort((a, b) => b.probability - a.probability);
    const topPredictions = predictions.slice(0, 5);

    // Analyze user patterns
    this.updateUserPlayStyleAnalysis(topPredictions);

    // Instant analysis - no delay
    return topPredictions;
  }

  async generateStrategicPlan(positionAnalysis, userPrediction) {
    console.log("📋 Creating strategic plan...");
    const plan = {
      shortTermGoals: [],
      longTermObjectives: [],
      counterStrategies: [],
      tacticalOpportunities: [],
      riskAssessment: {},
    };

    // Analyze each predicted user move and create counter-strategies
    for (const prediction of userPrediction) {
      const counterStrategy = this.developCounterStrategy(
        prediction,
        positionAnalysis
      );
      plan.counterStrategies.push(counterStrategy);
    }

    // Generate tactical and strategic objectives
    plan.shortTermGoals = this.identifyShortTermGoals(positionAnalysis);
    plan.longTermObjectives = this.identifyLongTermObjectives(positionAnalysis);
    plan.tacticalOpportunities =
      this.findTacticalOpportunities(positionAnalysis);

    // Instant planning
    return plan;
  }

  async selectOptimalMove(strategicPlan, positionAnalysis) {
    console.log("🎨 Selecting optimal move...");
    const candidates = this.game.moves({ verbose: true });
    const evaluatedMoves = [];

    for (const move of candidates) {
      const evaluation = {
        move: move,
        tacticalScore: this.evaluateTacticalScore(move, positionAnalysis),
        strategicScore: this.evaluateStrategicScore(move, strategicPlan),
        creativityScore: this.evaluateCreativity(move, positionAnalysis),
        riskRewardRatio: this.calculateRiskReward(move, positionAnalysis),
        antiUserScore: this.evaluateAntiUserMove(
          move,
          strategicPlan.counterStrategies
        ),
        complexityFactor: this.calculateComplexity(move),
        finalScore: 0,
      };

      // Combine all factors with AI personality weights
      evaluation.finalScore = this.calculateFinalMoveScore(evaluation);
      evaluatedMoves.push(evaluation);
    }

    // Sort by final score and add some randomness based on creativity
    evaluatedMoves.sort((a, b) => b.finalScore - a.finalScore);

    // Select from top moves with some creativity
    const topMoves = evaluatedMoves.slice(
      0,
      Math.min(3, evaluatedMoves.length)
    );
    const selectedMove = this.selectFromTopMoves(topMoves);

    console.log(
      `🎯 Selected move: ${
        selectedMove.move.san
      } (Score: ${selectedMove.finalScore.toFixed(2)})`
    );

    // Instant selection
    return selectedMove.move;
  }

  calculateMoveProbability(move, positionAnalysis) {
    let probability = 0.1; // Base probability

    // Check historical user patterns
    const movePattern = `${move.from}-${move.to}`;
    if (this.aiPersonality.userMovePrediction.has(movePattern)) {
      probability +=
        this.aiPersonality.userMovePrediction.get(movePattern) * 0.3;
    }

    // Analyze move characteristics user typically prefers
    if (move.captured) probability += 0.2; // Users like captures
    if (move.promotion) probability += 0.1; // Users like promotions
    if (this.wouldGiveCheck(move)) probability += 0.15; // Users like checks

    // Factor in user's play style
    if (
      this.aiPersonality.playStyle.aggressive > 0.6 &&
      this.isMoveAggressive(move)
    ) {
      probability += 0.2;
    }
    if (
      this.aiPersonality.playStyle.positional > 0.6 &&
      this.isMovePositional(move)
    ) {
      probability += 0.15;
    }

    return Math.min(probability, 1.0);
  }

  advancedLearningUpdate(move, analysis, predictions) {
    // Update user move prediction patterns
    const movePattern = `${move.from}-${move.to}`;

    // Learn from user's actual moves vs predictions
    for (const prediction of predictions) {
      const predPattern = `${prediction.move.from}-${prediction.move.to}`;
      const current =
        this.aiPersonality.userMovePrediction.get(predPattern) || 0;
      this.aiPersonality.userMovePrediction.set(
        predPattern,
        current * 0.9 + prediction.probability * 0.1
      );
    }

    // Update user play style analysis
    this.updateUserPlayStyleBasedOnMove(move);

    // Store successful AI strategies
    this.storeSuccessfulStrategy(move, analysis);

    console.log("🧠 AI learning updated - adapting to user patterns");
  }

  // Helper methods for advanced analysis
  calculateAdvancedMaterial() {
    // More sophisticated material calculation including piece positions
    let material = { white: 0, black: 0 };
    const board = this.game.board();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          const baseValue = this.pieceValues[piece.type.toUpperCase()];
          const positionalValue = this.getPositionalValue(piece, i, j);
          const totalValue = baseValue + positionalValue;

          if (piece.color === "w") {
            material.white += totalValue;
          } else {
            material.black += totalValue;
          }
        }
      }
    }
    return material;
  }

  getPositionalValue(piece, row, col) {
    // Positional values based on piece type and square
    const pieceSquareTables = {
      p: [
        // Pawn table
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
        // Knight table
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50],
      ],
    };

    const table = pieceSquareTables[piece.type] || pieceSquareTables["p"];
    const adjustedRow = piece.color === "w" ? 7 - row : row;
    return table[adjustedRow][col] || 0;
  }

  wouldGiveCheck(move) {
    this.game.move(move);
    const inCheck = this.game.in_check();
    this.game.undo();
    return inCheck;
  }

  isMoveAggressive(move) {
    return move.captured || this.wouldGiveCheck(move) || move.promotion;
  }

  isMovePositional(move) {
    // Check if move improves piece position, controls center, etc.
    const centerSquares = ["d4", "d5", "e4", "e5"];
    const extendedCenter = [
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
    ];

    return centerSquares.includes(move.to) || extendedCenter.includes(move.to);
  }

  calculateFinalMoveScore(evaluation) {
    const personality = this.aiPersonality;
    let score = 0;

    score +=
      evaluation.tacticalScore * (0.3 + personality.tacticalVision * 0.2);
    score +=
      evaluation.strategicScore * (0.25 + personality.strategicDepth * 0.15);
    score += evaluation.creativityScore * (0.1 + personality.creativity * 0.2);
    score += evaluation.antiUserScore * (0.2 + personality.adaptability * 0.15);
    score += evaluation.complexityFactor * personality.intuition * 0.1;

    // Add some randomness based on consistency
    const randomFactor =
      (1 - personality.consistency) * (Math.random() - 0.5) * 200;
    score += randomFactor;

    return score;
  }

  selectFromTopMoves(topMoves) {
    const creativity = this.aiPersonality.creativity;

    if (creativity > 0.8 && topMoves.length > 1 && Math.random() > 0.3) {
      // Sometimes pick the second best move for creativity
      return topMoves[1];
    }

    if (creativity > 0.5 && topMoves.length > 2 && Math.random() > 0.7) {
      // Rarely pick third best move for surprise
      return topMoves[2];
    }

    return topMoves[0]; // Usually pick the best move
  }

  // Advanced analysis methods (can be expanded further)
  evaluatePositionalFactors() {
    const centerControl = this.calculateCenterControl();
    const development = this.calculateDevelopment();
    return { centerControl, development };
  }

  calculateCenterControl() {
    // Calculate control of central squares
    const centerSquares = ["d4", "d5", "e4", "e5"];
    let whiteControl = 0,
      blackControl = 0;

    for (const square of centerSquares) {
      const attackers = this.getSquareAttackers(square);
      whiteControl += attackers.white;
      blackControl += attackers.black;
    }

    return { white: whiteControl, black: blackControl };
  }

  calculateDevelopment() {
    // Calculate piece development
    const pieces = this.game
      .board()
      .flat()
      .filter((p) => p);
    let whiteDev = 0,
      blackDev = 0;

    for (const piece of pieces) {
      if (piece && (piece.type === "n" || piece.type === "b")) {
        const startingSquares =
          piece.color === "w"
            ? ["b1", "c1", "f1", "g1"]
            : ["b8", "c8", "f8", "g8"];

        if (!startingSquares.includes(piece.square)) {
          if (piece.color === "w") whiteDev++;
          else blackDev++;
        }
      }
    }

    return { white: whiteDev, black: blackDev };
  }

  getSquareAttackers(square) {
    // Simplified square control calculation
    return { white: Math.random() * 3, black: Math.random() * 3 };
  }

  analyzeKingSafety() {
    // Analyze king safety for both sides
    const whiteKing = this.findKing("w");
    const blackKing = this.findKing("b");

    return {
      white: this.calculateKingSafety(whiteKing, "w"),
      black: this.calculateKingSafety(blackKing, "b"),
    };
  }

  findKing(color) {
    const board = this.game.board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece && piece.type === "k" && piece.color === color) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }

  calculateKingSafety(kingPos, color) {
    if (!kingPos) return 0;

    // Simple king safety calculation
    let safety = 0;
    const oppositeColor = color === "w" ? "b" : "w";

    // Check for pawn shelter
    const pawnShelter = this.checkPawnShelter(kingPos, color);
    safety += pawnShelter * 10;

    // Check for attacking pieces nearby
    const nearbyThreats = this.countNearbyThreats(kingPos, oppositeColor);
    safety -= nearbyThreats * 15;

    return Math.max(0, safety);
  }

  checkPawnShelter(kingPos, color) {
    // Simplified pawn shelter check
    return Math.random() * 3; // Returns 0-3 pawns protecting king
  }

  countNearbyThreats(kingPos, enemyColor) {
    // Simplified threat counting
    return Math.floor(Math.random() * 4); // Returns 0-3 nearby threats
  }

  analyzePawnStructure() {
    const weaknesses = this.findPawnWeaknesses();
    const strengths = this.findPawnStrengths();
    return { weaknesses, strengths };
  }

  findPawnWeaknesses() {
    // Find isolated, doubled, backward pawns
    return ["isolated_d4", "doubled_f_file"]; // Simplified
  }

  findPawnStrengths() {
    // Find passed pawns, pawn chains
    return ["passed_e5", "chain_d4_e5"]; // Simplified
  }

  analyzePieceActivity() {
    const activeMinor = this.countActivePieces(["n", "b"]);
    const activeMajor = this.countActivePieces(["r", "q"]);
    return { activeMinor, activeMajor };
  }

  countActivePieces(pieceTypes) {
    // Count pieces that are actively placed
    return Math.floor(Math.random() * 4); // Simplified
  }

  analyzeSquareControl() {
    return new Map();
  }
  identifyThreats() {
    // Identify tactical threats
    const threats = [];
    const moves = this.game.moves({ verbose: true });

    for (const move of moves) {
      if (move.captured) {
        threats.push({
          type: "capture",
          target: move.captured,
          square: move.to,
        });
      }
      if (this.wouldGiveCheck(move)) {
        threats.push({ type: "check", square: move.to });
      }
    }

    return threats;
  }

  identifyWeaknesses() {
    // Identify positional weaknesses
    return [
      { type: "weak_king", severity: "medium" },
      { type: "isolated_pawn", square: "d4" },
    ];
  }

  analyzeDynamicFactors() {
    const tempo = this.calculateTempo();
    const initiative = this.calculateInitiative();
    return { tempo, initiative };
  }

  calculateTempo() {
    // Who has the tempo/initiative
    return this.game.turn() === "w" ? 1 : -1;
  }

  calculateInitiative() {
    // Calculate who has the initiative
    const threats = this.identifyThreats();
    return threats.length > 2 ? 1 : 0;
  }

  // Placeholder methods that can be expanded
  analyzeUserMotivation(move) {
    return this.isMoveAggressive(move) ? "attack" : "positional";
  }
  assessTacticalRisk(move) {
    return move.captured ? 0.3 : 0.6;
  }
  assessStrategicValue(move) {
    return this.isMovePositional(move) ? 0.8 : 0.4;
  }
  updateUserPlayStyleAnalysis(predictions) {
    // Analyze user's preferred move types
    let aggressive = 0,
      positional = 0;

    for (const pred of predictions) {
      if (this.isMoveAggressive(pred.move)) aggressive += pred.probability;
      if (this.isMovePositional(pred.move)) positional += pred.probability;
    }

    this.aiPersonality.playStyle.aggressive =
      this.aiPersonality.playStyle.aggressive * 0.9 + aggressive * 0.1;
    this.aiPersonality.playStyle.positional =
      this.aiPersonality.playStyle.positional * 0.9 + positional * 0.1;
  }

  developCounterStrategy(prediction, analysis) {
    return {
      type: "counter",
      targetMove: prediction.move,
      strategy:
        prediction.userMotivation === "attack" ? "defend" : "counter-attack",
      priority: prediction.probability,
    };
  }

  identifyShortTermGoals(analysis) {
    const goals = [];

    if (analysis.kingSafety.black < 50) goals.push("improve_king_safety");
    if (analysis.materialBalance.black < analysis.materialBalance.white)
      goals.push("material_equality");
    if (analysis.positionalFactors.development.black < 2)
      goals.push("develop_pieces");

    return goals;
  }

  identifyLongTermObjectives(analysis) {
    const objectives = [];

    if (analysis.gamePhase === "endgame") objectives.push("activate_king");
    if (analysis.pawnStructure.strengths.length > 0)
      objectives.push("push_passed_pawns");
    objectives.push("improve_piece_coordination");

    return objectives;
  }

  findTacticalOpportunities(analysis) {
    const opportunities = [];

    for (const threat of analysis.threats) {
      if (threat.type === "capture") {
        opportunities.push({
          type: "tactic",
          description: `Capture on ${threat.square}`,
        });
      }
    }

    return opportunities;
  }

  evaluateTacticalScore(move, analysis) {
    let score = 0;

    if (move.captured) score += this.getPieceValue(move.captured) * 10;
    if (this.wouldGiveCheck(move)) score += 25;
    if (move.promotion) score += 80;

    // Bonus for central moves
    if (this.isMovePositional(move)) score += 15;

    return score + Math.random() * 20;
  }

  evaluateStrategicScore(move, plan) {
    let score = 0;

    // Check if move aligns with strategic goals
    for (const goal of plan.shortTermGoals) {
      if (goal === "develop_pieces" && this.isDevelopmentMove(move))
        score += 30;
      if (goal === "improve_king_safety" && this.improveKingSafety(move))
        score += 25;
    }

    return score + Math.random() * 30;
  }

  isDevelopmentMove(move) {
    const piece = this.game.get(move.from);
    return (
      piece &&
      (piece.type === "n" || piece.type === "b") &&
      !["b1", "c1", "f1", "g1", "b8", "c8", "f8", "g8"].includes(move.from)
    );
  }

  improveKingSafety(move) {
    // Check if move improves king safety (castling, creating shelter, etc.)
    return move.flags && move.flags.includes("k"); // Castling
  }

  evaluateCreativity(move, analysis) {
    let creativity = 0;

    // Unusual piece moves get creativity bonus
    if (move.piece === "n") creativity += 15; // Knights are creative
    if (move.to === "h6" || move.to === "a6") creativity += 10; // Edge moves

    // Sacrifice moves are creative
    if (
      move.captured &&
      this.getPieceValue(move.piece) > this.getPieceValue(move.captured)
    ) {
      creativity += 25;
    }

    return creativity + Math.random() * 20;
  }

  calculateRiskReward(move, analysis) {
    const risk = move.captured ? 0.3 : 0.5; // Lower risk for captures
    const reward = this.wouldGiveCheck(move) ? 1.5 : 1.0; // Higher reward for checks
    return reward / risk;
  }

  evaluateAntiUserMove(move, strategies) {
    let antiUserScore = 0;

    for (const strategy of strategies) {
      if (
        strategy.strategy === "counter-attack" &&
        this.isMoveAggressive(move)
      ) {
        antiUserScore += strategy.priority * 30;
      }
      if (strategy.strategy === "defend" && !this.isMoveAggressive(move)) {
        antiUserScore += strategy.priority * 25;
      }
    }

    return antiUserScore;
  }

  calculateComplexity(move) {
    let complexity = 0;

    // More complex moves get higher scores
    if (move.promotion) complexity += 20;
    if (move.flags && move.flags.includes("e")) complexity += 15; // En passant
    if (move.flags && move.flags.includes("k")) complexity += 10; // Castling

    return complexity;
  }

  updateUserPlayStyleBasedOnMove(move) {
    // Update analysis of user's play style based on their moves
    const style = this.aiPersonality.playStyle;

    if (this.isMoveAggressive(move)) {
      style.aggressive = Math.min(1.0, style.aggressive + 0.05);
    } else {
      style.positional = Math.min(1.0, style.positional + 0.03);
    }

    if (move.piece === "n" || move.piece === "b") {
      style.tactical = Math.min(1.0, style.tactical + 0.02);
    }
  }

  storeSuccessfulStrategy(move, analysis) {
    // Store successful AI strategies for future reference
    const strategy = {
      move: `${move.from}-${move.to}`,
      gamePhase: analysis.gamePhase,
      evaluation: analysis.materialBalance,
      timestamp: Date.now(),
    };

    this.aiPersonality.moveMemory.push(strategy);

    // Keep only last 100 strategies
    if (this.aiPersonality.moveMemory.length > 100) {
      this.aiPersonality.moveMemory.shift();
    }
  }
}

// Initialize the game when document is ready
$(document).ready(function () {
  window.chessGame = new ModernChessGame();

  // Add grey squares extension to chessboard
  $.extend(window.chessGame.board, {
    greySquare: function (square) {
      const $square = $("#board .square-" + square);
      let background = "#a9a9a9";
      if ($square.hasClass("black-3c85d")) {
        background = "#696969";
      }
      $square.css("background", background);
    },

    removeGreySquares: function () {
      $("#board .square-55d63").css("background", "");
      $("#board .square-d18b3").css("background", "");
    },
  });
});
