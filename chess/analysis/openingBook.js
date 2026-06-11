const OpeningBook = {
    detectOpening: function(moveHistory) {
        if (!moveHistory || moveHistory.length === 0) return { name: "None", eco: "000" };
        const moves = moveHistory.map(m => m.san).join(" ");
        if (moves.startsWith("e4 c5")) return { name: "Sicilian Defense", eco: "B20" };
        if (moves.startsWith("e4 e5 Nf3 Nc6 Bc4")) return { name: "Italian Game", eco: "C50" };
        if (moves.startsWith("e4 e5 Nf3 Nc6 Bb5")) return { name: "Ruy Lopez", eco: "C60" };
        if (moves.startsWith("e4 e6")) return { name: "French Defense", eco: "C00" };
        if (moves.startsWith("d4 d5 c4")) return { name: "Queen's Gambit", eco: "D06" };
        if (moves.startsWith("e4")) return { name: "King's Pawn Game", eco: "B00" };
        if (moves.startsWith("d4")) return { name: "Queen's Pawn Game", eco: "D00" };
        if (moves.startsWith("Nf3")) return { name: "Zukertort Opening", eco: "A04" };
        if (moves.startsWith("c4")) return { name: "English Opening", eco: "A10" };
        return { name: "Unknown Opening", eco: "???" };
    }
};