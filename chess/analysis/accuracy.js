const AccuracyCalculator = {
    calculate: function(moves) {
        let wScore = 0;
        let bScore = 0;
        let wCount = 0;
        let bCount = 0;
        
        moves.forEach(m => {
            const acc = Math.max(0, 100 + (m.diff * 20)); 
            
            if (m.player === 'w') {
                wScore += acc;
                wCount++;
            } else {
                bScore += acc;
                bCount++;
            }
        });
        
        return {
            white: wCount > 0 ? (wScore / wCount).toFixed(1) : 100,
            black: bCount > 0 ? (bScore / bCount).toFixed(1) : 100
        };
    }
};