# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Behavioral Guidelines

These guidelines reduce common LLM coding mistakes. They bias toward caution over speed — for trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Commands

- `npm install` — install dependencies (Node.js 18+ required)
- `npm run dev` — start Vite dev server (default http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built bundle

## Definition of Done
 
There is no test suite, linter, or formatter configured. Before finishing any change:
- `npm run build` exits with zero errors
- No runtime errors in the browser console
- Affected flow manually verified end-to-end

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

## Contributing

- Do not commit `package.json` or `package-lock.json` changes as part of feature PRs.
- Avoid `git add .` / `git add *` — stage specific files.
