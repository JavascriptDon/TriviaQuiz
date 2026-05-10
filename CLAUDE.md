# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (Node.js 18+ required)
- `npm run dev` — start Vite dev server (default http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built bundle

There is no test suite, linter, or formatter configured.

## Architecture

Vanilla JS single-page app bundled with Vite. No framework, no router, no state library.

### Data layer — `src/quiz.js`
Exports a single `quizzes` object. Each entry is keyed by a short id (`uk`, `dc`, `movie`, `history`, etc.) and has the shape:

```js
{
  title: '🇬🇧 UK Trivia Quiz',
  rounds: 5,                       // must equal the number of `roundN` keys in `data`
  data: {
    round1: [{ question, options: [...], correct }, ...],
    round2: [...],
    // ...
  }
}
```

`main.js` reads rounds dynamically via `quiz.data[`round${n}`]`, so adding a new quiz only requires a new entry here plus a matching `<option>` in `index.html`. The number of questions per round is not fixed — `loadRound` uses `quizQuestions.length` everywhere.

### UI/controller — `src/main.js`
Single module containing all runtime state as top-level `let` variables (`currentRound`, `totalScore`, `roundScores`, `selectedQuiz`, etc.). Three things to know when editing:

1. **Globals for `onclick` handlers.** HTML buttons in `index.html` use inline `onclick="startSelectedQuiz()"` etc. The bottom of `main.js` re-exposes these via `window.startSelectedQuiz = ...`. Any new handler called from inline HTML must be assigned to `window` the same way, or it won't be reachable from the module scope.
2. **Quiz selector dropdown is hardcoded.** `index.html` lists each quiz as a `<option value="...">`. The `value` must match a key in the `quizzes` object exactly.
3. **Final score breakdown assumes ≤5 rounds.** `index.html` hardcodes `<p id="final-round1">..<p id="final-round5">` rows, and `showFinalScore()` loops `i = 1..5`, hiding rows for rounds beyond `totalRounds`. Supporting >5 rounds requires editing both files.

### Assets
- `src/sounds/mouse-click.mp3` is imported as a module asset and bound to all clickable buttons via a `MutationObserver` on `#options-container` (so dynamically-rendered option buttons get the listener too).
- `vite.config.js` sets `base: './'` for relative asset paths — important for the GitHub Pages deploy (see `.github/workflows/jekyll-gh-pages.yml`).

## Contributing notes from CONTRIBUTING.md

- Do not commit `package.json` or `package-lock.json` changes as part of feature PRs.
- Avoid `git add .` / `git add *` — stage specific files.
