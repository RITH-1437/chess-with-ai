class AnalysisEngine {
    constructor() {
        this.evaluator = new ChessEvaluator();
    }
    
    async analyzeMoves(moveHistory, progressCallback) {
        const game = new Chess();
        const results = [];
        
        for (let i = 0; i < moveHistory.length; i++) {
            const move = moveHistory[i];
            
            const evalBefore = await this.getEvaluation(game, 3);
            const bestMoveBefore = evalBefore.bestMove;
            const scoreBefore = evalBefore.score;
            
            game.move(move.san);
            
            const evalAfter = await this.getEvaluation(game, 3);
            const scoreAfter = evalAfter.score;
            
            results.push({
                moveNumber: Math.floor(i / 2) + 1,
                player: i % 2 === 0 ? 'w' : 'b',
                notation: move.san,
                fenBefore: moveHistory[i].fenBefore || game.fen(),
                fenAfter: game.fen(),
                scoreBefore,
                scoreAfter,
                bestMoveBefore
            });
            
            if (progressCallback) progressCallback(i + 1, moveHistory.length);
            
            await new Promise(res => setTimeout(res, 20));
        }
        
        return results;
    }
    
    async getEvaluation(game, depth) {
        let bestMove = null;
        
        const minimax = (g, d, alpha, beta, isMaximizing) => {
            if (d === 0 || g.game_over()) {
                return this.quiesce(g, alpha, beta, isMaximizing);
            }
            const moves = g.moves({ verbose: true });
            moves.sort((a, b) => (b.captured ? 1 : 0) - (a.captured ? 1 : 0));
            
            if (isMaximizing) {
                let maxEval = -Infinity;
                for (let m of moves) {
                    g.move(m);
                    const ev = minimax(g, d - 1, alpha, beta, false);
                    g.undo();
                    if (ev > maxEval) {
                        maxEval = ev;
                        if (d === depth) bestMove = m.san;
                    }
                    alpha = Math.max(alpha, ev);
                    if (beta <= alpha) break;
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (let m of moves) {
                    g.move(m);
                    const ev = minimax(g, d - 1, alpha, beta, true);
                    g.undo();
                    if (ev < minEval) {
                        minEval = ev;
                        if (d === depth) bestMove = m.san;
                    }
                    beta = Math.min(beta, ev);
                    if (beta <= alpha) break;
                }
                return minEval;
            }
        };
        
        const score = minimax(game, depth, -Infinity, Infinity, game.turn() === 'w');
        return { score, bestMove };
    }
    
    quiesce(g, alpha, beta, isMaximizing) {
        const stand_pat = this.evaluator.evaluate(g);
        if (isMaximizing) {
            if (stand_pat >= beta) return beta;
            if (alpha < stand_pat) alpha = stand_pat;
        } else {
            if (stand_pat <= alpha) return alpha;
            if (beta > stand_pat) beta = stand_pat;
        }
        
        const moves = g.moves({ verbose: true }).filter(m => m.captured);
        
        if (isMaximizing) {
            for (let m of moves) {
                g.move(m);
                const score = this.quiesce(g, alpha, beta, false);
                g.undo();
                if (score >= beta) return beta;
                if (score > alpha) alpha = score;
            }
            return alpha;
        } else {
            for (let m of moves) {
                g.move(m);
                const score = this.quiesce(g, alpha, beta, true);
                g.undo();
                if (score <= alpha) return alpha;
                if (score < beta) beta = score;
            }
            return beta;
        }
    }
}