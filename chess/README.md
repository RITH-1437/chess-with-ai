# 🏆 Modern Chess vs AI

A feature-rich, modern chess game where you can play against an intelligent AI opponent. Built with vanilla JavaScript, this game includes advanced features like move history, timers, multiple difficulty levels, and a beautiful responsive design.

![Chess Game Preview](https://via.placeholder.com/800x600/2c3e50/ecf0f1?text=Modern+Chess+vs+AI)

## 🎯 Features

### 🎮 Core Game Features

- **Interactive Chess Board**: Drag and drop pieces with smooth animations
- **Smart AI Opponent**: Multiple difficulty levels using minimax algorithm with alpha-beta pruning
- **Complete Chess Rules**: Full implementation including castling, en passant, pawn promotion
- **Game Timer**: 10-minute timer for each player with visual indicators
- **Move Validation**: Only legal moves are allowed

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful dark theme with smooth animations
- **Real-time Status**: Live game status and move indicators
- **Visual Feedback**: Hover effects, transitions, and loading states

### 📊 Advanced Features

- **Move History**: Complete move history with ability to review previous positions
- **Captured Pieces**: Visual display of captured pieces for both sides
- **Game Analysis**: Real-time position evaluation
- **Hint System**: Get AI suggestions for your next move
- **Undo Moves**: Take back your last move (undoes both player and AI moves)
- **Sound Effects**: Optional sound effects for moves and game events
- **Statistics**: Track wins, losses, and draws across sessions
- **Board Flipping**: Flip the board to play from Black's perspective

### 🤖 Advanced AI Engines

Choose from multiple AI engines for varied gameplay:

1. **🏆 Stockfish (Smart)**: Uses Lichess's Stockfish cloud analysis - world-class engine
2. **♞ Lichess Cloud**: Lichess cloud-based analysis engine
3. **📊 Advanced Local**: Enhanced local engine with opening book & endgame patterns
4. **🤖 Basic Local**: Simple minimax algorithm (original engine)

### 🎯 AI Difficulty Levels

- **Easy**: Beginner-friendly with some random moves
- **Medium**: Balanced play with 3-4 ply search depth
- **Hard**: Strong tactical play with 5-6 ply depth
- **Expert**: Master-level play with 6+ ply depth and advanced evaluation

## 🚀 Quick Start

### Option 1: Direct File Access

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

## 🎯 How to Play

### Basic Controls

- **Make a Move**: Drag and drop your pieces (White pieces only)
- **New Game**: Click "New Game" button to start fresh
- **Undo Move**: Click "Undo Move" to take back your last move
- **Get Hint**: Click "Hint" to see AI's suggested move
- **Flip Board**: Click "Flip Board" to change perspective

### Game Interface

#### Left Panel - Game Information

- **Timer**: Shows remaining time for both players
- **Score**: Displays wins/losses across sessions
- **Captured Pieces**: Visual representation of taken pieces

#### Center - Chess Board

- **Interactive Board**: Drag pieces to make moves
- **Status Display**: Shows whose turn and game status
- **Board Controls**: Flip board and toggle sound

#### Right Panel - Analysis

- **Move History**: Complete list of all moves played
- **Position Evaluation**: AI's assessment of current position
- **Best Move Suggestion**: AI's recommended move (when hint is used)

### Difficulty Settings

Choose your challenge level from the dropdown:

- **Easy**: Perfect for beginners
- **Medium**: Good for casual players
- **Hard**: Challenging for intermediate players
- **Expert**: Difficult for advanced players

## 🛠️ Technical Details

### Architecture

```
chess/
├── index.html      # Main HTML structure and layout
├── style.css       # Modern CSS with variables and responsive design
├── script.js       # Game logic, AI, and user interactions
└── README.md       # This documentation
```

### Dependencies

- **jQuery 3.5.1**: DOM manipulation and event handling
- **Chessboard.js 1.0.0**: Visual chess board rendering
- **Chess.js 0.10.3**: Chess game logic and move validation

All dependencies are loaded via CDN, so no installation required!

### Key Classes and Functions

#### `ModernChessGame` Class

Main game controller that handles:

- Game initialization and board setup
- Move validation and execution
- AI opponent logic
- Timer management
- UI updates and user interactions

#### Core Methods

```javascript
// Game Control
newGame(); // Start a new game
undoMove(); // Undo last move
makeComputerMove(); // AI makes its move

// AI Intelligence
getBestMove(depth); // Get best move using minimax
minimax(); // Minimax algorithm with alpha-beta pruning
evaluatePosition(); // Evaluate current board position

// Game State
updateStatus(); // Update game status display
checkGameOver(); // Check for game end conditions
switchTimer(); // Switch active timer

// User Interface
showHint(); // Display move suggestion
toggleSound(); // Enable/disable sound effects
updateMoveHistory(); // Update move history display
```

## 🎨 Customization

### Styling

The game uses CSS custom properties (variables) for easy theming:

```css
:root {
  --primary-color: #2980b9; /* Main accent color */
  --bg-primary: #2c3e50; /* Background color */
  --text-primary: #ecf0f1; /* Text color */
  --border-radius: 8px; /* Border radius */
  --transition: all 0.3s ease; /* Animation timing */
}
```

### AI Behavior

Modify AI difficulty by changing the search depth:

```javascript
// In getBestMove() method
const depths = {
  1: 1, // Easy
  2: 2, // Medium
  3: 3, // Hard
  4: 4, // Expert
};
```

### Timer Settings

Change game timer duration:

```javascript
// In constructor
this.gameTimer = {
  white: 600, // 10 minutes in seconds
  black: 600, // 10 minutes in seconds
};
```

## 📱 Responsive Design

The game is fully responsive and adapts to different screen sizes:

- **Desktop (1200px+)**: Three-panel layout with full features
- **Tablet (768px-1200px)**: Adjusted panel sizes
- **Mobile (<768px)**: Single column layout, optimized for touch

## 🔧 Troubleshooting

### Common Issues

**Q: The board doesn't load properly**  
A: Make sure you have internet connection for CDN resources, or use a local server instead of opening the file directly.

**Q: AI moves seem too slow**  
A: Lower the difficulty level or reduce the thinking delay in `makeComputerMove()` method.

**Q: Sound doesn't work**  
A: Some browsers require user interaction before playing audio. Click somewhere on the page first.

**Q: Game doesn't save statistics**  
A: Make sure your browser supports localStorage and isn't in private/incognito mode.

### Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 Contributing

Want to improve the game? Here are some ideas:

### Easy Improvements

- Add more sound effects
- Create new piece themes
- Add game export/import functionality
- Implement puzzle mode

### Medium Improvements

- Add online multiplayer
- Create tournament mode
- Implement chess engine analysis
- Add move annotations

### Advanced Improvements

- Implement proper chess engine (like Stockfish)
- Add opening book database
- Create machine learning training mode
- Build mobile app version

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Chessboard.js** - For the beautiful chess board visualization
- **Chess.js** - For robust chess game logic
- **jQuery** - For DOM manipulation simplicity
- **Chess community** - For inspiration and feedback

## 📞 Support

Having trouble? Here are your options:

1. **Check this README** - Most questions are answered here
2. **Browser Console** - Press F12 to see any error messages
3. **GitHub Issues** - Report bugs or request features
4. **Stack Overflow** - Tag your questions with `chess` and `javascript`

---

**Made with ❤️ for chess enthusiasts worldwide**

_Happy Playing! 🎉_
