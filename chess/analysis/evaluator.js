class ChessEvaluator {
    constructor() {
        this.pieceValues = { p: 1, n: 3.2, b: 3.3, r: 5, q: 9, k: 200 };
    }
    evaluate(game) {
        if (game.in_checkmate()) {
            return game.turn() === 'w' ? -1000 : 1000;
        }
        if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
            return 0;
        }
        let score = 0;
        const board = game.board();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece) {
                    let val = this.pieceValues[piece.type];
                    if (piece.type === 'p' || piece.type === 'n') {
                        if (r >= 3 && r <= 4 && c >= 3 && c <= 4) val += 0.2;
                    }
                    score += piece.color === 'w' ? val : -val;
                }
            }
        }
        return score;
    }
}