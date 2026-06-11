const MoveClassifier = {
    classify: function(player, scoreBefore, scoreAfter, notation, bestMoveBefore) {
        let diff = player === 'w' ? scoreAfter - scoreBefore : scoreBefore - scoreAfter;
        
        let classification = "";
        let explanation = "";
        
        if (notation === bestMoveBefore || diff > -0.20) {
            if (notation.includes('x') && diff > 0.5) {
                classification = "⭐ Brilliant";
                explanation = "An incredible move that sacrifices material for a greater advantage.";
            } else if (diff > 0.3) {
                classification = "💡 Great Move";
                explanation = "Finds a powerful continuation.";
            } else {
                classification = "✅ Best Move";
                explanation = "The best engine-approved move in this position.";
            }
        } else if (diff > -0.50) {
            classification = "👍 Excellent";
            explanation = "A very strong move that maintains the position.";
        } else if (diff > -1.00) {
            classification = "👌 Good";
            explanation = "A solid move, though slightly better alternatives existed.";
        } else if (diff > -2.00) {
            classification = "🤔 Inaccuracy";
            explanation = "A suboptimal move that gives away some advantage.";
        } else if (diff > -4.00) {
            classification = "⚠ Mistake";
            explanation = "A poor move that worsens the position significantly.";
        } else {
            classification = "❌ Blunder";
            explanation = "A critical error that severely damages your position.";
        }
        
        if (notation.includes('#')) {
            classification = "🔥 Forced Move";
            explanation = "Delivers checkmate.";
        }
        
        return { classification, explanation, diff };
    }
};