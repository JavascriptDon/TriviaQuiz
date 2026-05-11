# Trivia Quiz App

A modular, category‑based trivia quiz built with HTML, CSS, and JavaScript, featuring multiple quiz types, dynamic rounds, progress tracking, and a clean UI.

## Features

The app supports a wide range of trivia categories:

- 🇬🇧 UK Trivia
- 🦸 DC Universe
- 🎬 Movie Trivia
- 📜 History
- 🌍 Geography
- ⚡ Mythology
- 🎨 Art
- ⚽ Sports
- 🏛️ Politics
- ⭐ Celebrities
- 🐾 Animals

Each category contains 10 questions, except UK/DC/Movie which use multi‑round formats.

## Project Structure

- `index.html` — main entry point
- `src/` — JavaScript and style sources
- `public/` — static assets (if used)
- `package.json` — project dependencies and scripts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

After running the command, open the local URL shown in the terminal (usually `http://localhost:5173`) to view the app.

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Your First Steps with Claude

[Claude Code](https://claude.ai/code) is an AI coding assistant that understands this entire codebase. You can use it to add new quiz categories, fix bugs, or extend the UI — all by describing what you want in plain English.

### Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Then run it from this project directory:

```bash
claude
```

### Example prompts to try

**Add a new quiz category**

```
Add a new "Science" quiz with 3 rounds of 5 questions each about biology, chemistry, and physics.
```

**Extend the UI**

```
Add a progress bar below the question that fills as the user moves through the round.
```

**Fix or improve behaviour**

```
The final score screen doesn't show which questions I got wrong. Can you add a review section?
```

Claude Code reads the codebase before suggesting changes, so it will follow the existing patterns in `src/quiz.js` and `src/main.js` automatically.

## Notes

This project is meant for learning and prototyping. It uses Vite for fast local development and bundling.
