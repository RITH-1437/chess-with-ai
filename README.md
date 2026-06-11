# Chess With AI

![HTML](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=111)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-45c4b0)

Chess With AI is a responsive browser chess game where you play White against a local JavaScript AI. It uses chess.js for rules, chessboard.js for drag-and-drop rendering, and a local minimax engine for computer moves.

## Features

- Complete legal move validation through chess.js.
- Drag-and-drop chessboard with automatic snapback for illegal moves.
- Pawn double moves, captures, en passant, castling, check, checkmate, stalemate, and queen promotion.
- Easy, Medium, and Hard AI levels.
- Local minimax AI with alpha-beta pruning, move ordering, and piece-square evaluation.
- Move history with temporary position preview.
- Timers, score tracking, captured pieces, hints, board flip, and sound toggle.
- Responsive glass-style gaming UI for desktop and mobile.

## Screenshots

Add screenshots or GIFs here after capturing the app in a browser.

```text
docs/screenshots/
```

## Installation

Clone the repository:

```bash
git clone https://github.com/RITH-1437/chess-with-ai.git
cd chess-with-ai
```

No package installation is required. The browser app loads chessboard.js, chess.js, and jQuery from CDNs.

## Local Development

Open the app directly:

```text
chess/index.html
```

Or serve the repository with any static file server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/chess/
```

## Project Structure

```text
.
├── chess.html
├── chess/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── README.md
├── docs/
│   ├── ai-logic.md
│   ├── architecture.md
│   └── game-rules.md
├── tests/
│   ├── browser-rule-harness.html
│   └── test_static_contracts.py
├── audit-report.md
└── README.md
```

## AI Explanation

The AI evaluates positions from Black's perspective. Easy mode uses a shallow weighted selector that prefers tactical and central moves. Medium and Hard use minimax with alpha-beta pruning. Move ordering prioritizes mate, captures, checks, promotions, castling, and center control so the search can prune more branches.

See [docs/ai-logic.md](docs/ai-logic.md) for details.

## Testing

Run static repository checks:

```bash
python3 tests/test_static_contracts.py
```

Open the browser rule harness for chess.js gameplay checks:

```text
tests/browser-rule-harness.html
```

## Future Roadmap

- Add promotion piece selection.
- Add optional human-vs-human mode.
- Add offline vendored dependencies or a build step with pinned SRI hashes.
- Add screenshot automation when a browser test runner is available.
- Add AI time controls and iterative deepening.
