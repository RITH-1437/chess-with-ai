#!/usr/bin/env python3
"""Static regression checks for the browser chess app.

These tests are intentionally dependency-free because the execution environment
for this repository does not provide Node.js or a browser.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "chess" / "script.js"
INDEX = ROOT / "chess" / "index.html"
STYLE = ROOT / "chess" / "style.css"


def read(path):
    return path.read_text(encoding="utf-8")


def assert_true(condition, message):
    if not condition:
      raise AssertionError(message)


def test_script_contracts():
    source = read(SCRIPT)

    assert_true('"use strict";' in source, "script.js must enable strict mode")
    assert_true("var " not in source, "script.js must not use var")
    assert_true("fetch(" not in source, "AI must not call remote analysis APIs")
    assert_true(source.count("class ChessAI") == 1, "ChessAI should be defined once")
    assert_true(source.count("class ChessApp") == 1, "ChessApp should be defined once")
    assert_true(source.count("getBestMove(") >= 1, "AI should expose getBestMove")
    assert_true(source.count("minimax(") >= 1, "AI should use minimax")
    assert_true("alpha" in source and "beta" in source, "AI should use alpha-beta pruning")
    assert_true("promotion: \"q\"" in source, "promotion should preserve queen auto-promotion")
    assert_true("game.move(" in source, "moves should be validated by chess.js")
    assert_true("onDragStart" in source and "onDrop" in source, "drag/drop handlers must exist")


def test_html_contracts():
    html = read(INDEX)

    required_ids = [
        "board",
        "status",
        "difficultySelect",
        "aiEngineSelect",
        "newGameBtn",
        "undoBtn",
        "aiMoveBtn",
        "hintBtn",
        "flipBtn",
        "soundToggle",
        "moveList",
        "evaluation",
        "gameOverModal",
    ]

    for element_id in required_ids:
        assert_true(f'id="{element_id}"' in html, f"missing #{element_id}")

    for difficulty in ["easy", "medium", "hard"]:
        assert_true(f'value="{difficulty}"' in html, f"missing {difficulty} difficulty")

    assert_true("chessboard" in html.lower(), "chessboard.js dependency missing")
    assert_true("chess.min.js" in html, "chess.js dependency missing")


def test_style_contracts():
    css = read(STYLE)

    assert_true("--board-size" in css, "board should have responsive size variable")
    assert_true("@media (max-width: 760px)" in css, "mobile layout media query missing")
    assert_true(".highlight-square" in css, "move highlight style missing")
    assert_true(".thinking::after" in css, "AI thinking indicator missing")
    assert_true("backdrop-filter" in css, "glass UI treatment missing")


def test_documentation_exists():
    for relative_path in [
        "audit-report.md",
        "README.md",
        "docs/architecture.md",
        "docs/game-rules.md",
        "docs/ai-logic.md",
        "tests/browser-rule-harness.html",
    ]:
        path = ROOT / relative_path
        assert_true(path.exists(), f"missing {relative_path}")


def run():
    tests = [
        test_script_contracts,
        test_html_contracts,
        test_style_contracts,
        test_documentation_exists,
    ]

    for test in tests:
        test()
        print(f"PASS {test.__name__}")


if __name__ == "__main__":
    run()
