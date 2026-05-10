# 🧠 GenAI Tutor

**A free, production-quality AI education platform built with Vanilla HTML, CSS & JavaScript.**

Learn Artificial Intelligence from scratch — chat with an AI tutor, explore interactive modules, take quizzes, and track your progress.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Tutor Chat | Conversational AI tutor with typing indicators and conversation history |
| 📚 10 Learning Modules | From AI Basics to Computer Vision, Prompt Engineering & more |
| 🎯 Interactive Quizzes | 5 questions per topic with instant feedback, XP rewards, and result breakdowns |
| 📊 Dashboard | Overview of XP, streak, progress, recommendations, and weekly activity |
| 📈 Progress Tracker | Topic mastery, achievement badges, weekly charts |
| ⚙️ Settings | Dark/light mode, font size, API key, export/import data |
| ⚡ Gamification | XP points, levels, streaks, 12 achievement badges, confetti celebrations |
| 💾 Persistence | All progress auto-saved to localStorage |

---

## 🚀 Quick Start

### Option 1 — Open directly
Just open `index.html` in any modern browser. No server needed.

```bash
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

### Option 2 — Local server (recommended)
```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .

# Then open: http://localhost:8080
```

---

## 📁 Project Structure

```
genai-tutor/
├── index.html                    # App entry point
├── README.md
└── assets/
    ├── css/
    │   ├── styles.css            # Design system & CSS variables
    │   ├── layout.css            # Navbar, grid, hero layouts
    │   ├── components.css        # All UI components
    │   ├── animations.css        # Keyframe animations
    │   └── responsive.css        # Mobile-first breakpoints
    ├── data/
    │   ├── modules.json          # 10 AI learning modules
    │   ├── quizzes.json          # 10 quizzes (50 questions)
    │   └── prompts.json          # AI tutor suggested prompts
    └── js/
        ├── app.js                # Bootstrap & initialization
        ├── router.js             # Hash-based SPA router
        ├── state.js              # Centralized state + pub/sub
        ├── config.js             # App configuration
        ├── utils/
        │   ├── constants.js      # App-wide constants
        │   ├── helpers.js        # DOM, formatting, animation helpers
        │   └── validators.js     # Input validation
        ├── services/
        │   ├── aiService.js      # AI tutor logic (mock + real API)
        │   └── moduleService.js  # Modules, quizzes, progress services
        ├── components/
        │   ├── navbar.js         # Navigation bar
        │   ├── cards.js          # Reusable card components
        │   ├── modal.js          # Accessible modal dialogs
        │   ├── chat.js           # Chat bubble components
        │   ├── quiz.js           # Quiz UI components
        │   ├── progress.js       # Progress rings, bars, charts
        │   ├── sidebar.js        # Sidebar components
        │   └── dashboard.js      # Dashboard sections
        └── pages/
            ├── landingPage.js    # Hero landing page
            ├── dashboardPage.js  # Dashboard
            ├── tutorPage.js      # AI Tutor chat
            ├── modulesPage.js    # Learning modules
            ├── quizPage.js       # Quiz engine
            ├── progressPage.js   # Progress tracker
            └── settingsPage.js   # Settings
```

---

## 🤖 Using Real AI (Claude API)

By default the tutor uses pre-built educational responses. To enable real Claude AI:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Go to **Settings** → paste your key → click **Save**
3. Your key is stored locally only — never sent anywhere else

> ⚠️ Calling the Anthropic API directly from a browser exposes your key in network requests. For production, proxy requests through a backend server.

---

## 🎮 Gamification System

| Event | XP |
|-------|----|
| Module completed | 100 XP |
| Quiz completed (any score) | 25 XP |
| Quiz perfect score | 50 XP |
| Chat message (every 4) | 20 XP |
| Daily streak bonus | 15 XP/day |

**Levels:** Every 500 XP = Level Up (up to Level 11 — Grand Master)

**Achievements:** 12 badges including First Steps, Quiz Master, Streak Champion, and more.

---

## 🏗️ Architecture

- **SPA routing** — Hash-based (`#/`, `#/dashboard`, `#/tutor`, etc.)
- **State management** — IIFE singleton with pub/sub event system
- **Services** — Business logic separated from UI (AI, modules, progress)
- **Components** — Pure rendering functions returning HTML strings
- **No build step** — Pure Vanilla JS, works in any browser

---

## 📱 Browser Support

Works in all modern browsers: Chrome, Firefox, Safari, Edge (2020+).

---

## 📄 License

MIT — free to use, modify, and distribute.

Built with ❤️ for learners everywhere.
