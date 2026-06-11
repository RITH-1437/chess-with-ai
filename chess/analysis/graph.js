const AnalysisGraph = {
    render: function(canvasId, moves) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const labels = moves.map(m => m.moveNumber + (m.player === 'w' ? 'w' : 'b'));
        const data = moves.map(m => m.scoreAfter);
        
        if (window.analysisChart) {
            window.analysisChart.destroy();
        }
        
        if (typeof Chart !== 'undefined') {
            window.analysisChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Evaluation (+ White / - Black)',
                        data: data,
                        borderColor: '#38bdf8',
                        backgroundColor: 'rgba(56, 189, 248, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            suggestedMin: -10,
                            suggestedMax: 10
                        }
                    }
                }
            });
        }
    }
};