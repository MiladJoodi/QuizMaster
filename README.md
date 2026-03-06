# Quez - Online Quiz Platform

A modern, feature-rich online quiz platform built with Next.js 16 and React 19. Take quizzes with real-time countdown timers, track your progress, earn achievements, and compete on the global leaderboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwindcss)

## Features

### Quiz Engine
- **Countdown Timer** with color-coded progress bar (green → yellow → red)
- **Pause/Resume** timer controls
- **Auto-submit** when time runs out with 1-minute warning toast
- **Question Flagging** for review before submission
- **Multi-select & Single-choice** question types
- **Question Navigation Grid** with answered/unanswered/flagged indicators
- **Anti-cheat** tab-switch detection with warnings
- **Mobile-optimized** bottom-sheet question navigator

### Results & Analytics
- **Animated Score Counter** with circular progress ring
- **Confetti Celebration** on passed quizzes
- **Per-question Review** with correct/incorrect highlighting and explanations
- **Score Distribution** pie chart
- **Performance Trend** area chart across all attempts
- **Grade System** (A+ through F)

### Dashboard
- KPI stat cards (Quizzes Taken, Average Score, Total Points, Global Rank)
- Performance Over Time chart (Recharts AreaChart)
- Category Performance horizontal bar chart
- Score Distribution donut chart
- Recent Activity feed
- Achievement highlights

### Gamification
- **Leaderboard** with top-3 podium display and full rankings table
- **Achievements System** with unlocked, in-progress, and locked badges
- **Points & Ranking** system
- **Streak Tracking**

### Other Pages
- **Browse Quizzes** — filter by category, difficulty, search
- **Create Quiz** — build custom quizzes with question builder
- **Categories** — organized quiz categories with icons
- **Question Bank** — searchable question database
- **Profile** — editable user profile with stats
- **Settings** — General, Notifications, and Appearance (theme) tabs
- **Notifications** — notification center with mark-as-read and delete
- **Custom 404** page

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App Router, Turbopack, SSR |
| **React 19** | UI Components |
| **TypeScript 5** | Type Safety |
| **Tailwind CSS v4** | Styling with oklch colors |
| **Zustand** | State Management with persist middleware |
| **Framer Motion** | Animations & Transitions |
| **Recharts** | Data Visualization (Area, Bar, Pie charts) |
| **React Hook Form + Zod** | Form Validation |
| **Radix UI** | Accessible Headless Components |
| **shadcn/ui** | Component Library (25 components) |
| **next-themes** | Dark/Light/System Theme |
| **Sonner** | Toast Notifications |
| **react-confetti** | Quiz Pass Celebration |
| **Lucide React** | Icons |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MiladJoodi/QuizMaster.git

# Navigate to the project
cd QuizMaster

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

| Email | Password |
|---|---|
| `admin@example.com` | `admin123` |

## Project Structure

```
quez/
├── app/
│   ├── achievements/       # Achievements & badges
│   ├── categories/         # Quiz categories
│   ├── dashboard/          # Main dashboard with charts
│   ├── forgot-password/    # Password reset
│   ├── leaderboard/        # Global rankings
│   ├── login/              # Login page
│   ├── notifications/      # Notification center
│   ├── profile/            # User profile
│   ├── questions/          # Question bank
│   ├── quiz/[id]/          # Quiz engine (countdown timer)
│   │   └── results/        # Quiz results (confetti + review)
│   ├── quizzes/            # Browse quizzes
│   │   └── create/         # Create custom quiz
│   ├── register/           # Registration
│   ├── results/            # Results history
│   ├── settings/           # App settings
│   ├── globals.css         # Theme (oklch colors, dark mode)
│   ├── layout.tsx          # Root layout
│   ├── not-found.tsx       # Custom 404
│   └── page.tsx            # Auth redirect
├── components/
│   ├── ui/                 # 25 shadcn/ui components
│   ├── dashboard-layout.tsx
│   ├── empty-state.tsx
│   ├── page-header.tsx
│   ├── sidebar.tsx
│   ├── stat-card.tsx
│   └── theme-provider.tsx
├── hooks/
│   ├── use-mobile.ts       # Mobile breakpoint detection
│   └── use-timer.ts        # Quiz countdown timer hook
├── lib/
│   ├── data.ts             # Mock data (8 users, 12 quizzes, 83 questions)
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
└── store/
    ├── auth-store.ts       # Authentication state
    ├── notification-store.ts
    ├── quiz-store.ts       # Quiz engine state (timer, answers, flagging)
    └── ui-store.ts         # Sidebar & search state
```

## Routes

| Route | Description |
|---|---|
| `/` | Auth redirect |
| `/login` | Login with demo button |
| `/register` | User registration |
| `/forgot-password` | Password reset |
| `/dashboard` | KPI stats, charts, activity feed |
| `/quizzes` | Browse all quizzes with filters |
| `/quizzes/create` | Create custom quiz |
| `/quiz/[id]` | **Quiz engine with countdown timer** |
| `/quiz/[id]/results` | Results with confetti & question review |
| `/categories` | Quiz categories grid |
| `/questions` | Question bank |
| `/results` | Results history with trend chart |
| `/leaderboard` | Global rankings with podium |
| `/achievements` | Badges & progress tracking |
| `/profile` | User profile with edit form |
| `/settings` | General, Notifications, Appearance |
| `/notifications` | Notification center |

## Quiz Data

- **6 Categories**: Science, Mathematics, Programming, History, Language, General Knowledge
- **12 Quizzes**: Physics, Chemistry, Biology, Algebra, Calculus, JavaScript, React, HTML/CSS, World History, Ancient Civilizations, English Grammar, General Trivia
- **83 Questions**: Real educational content with explanations
- **8 Users**: Pre-configured with stats and rankings
- **15 Achievements**: Unlockable badges with progress tracking

## Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Theme

The app uses an **indigo/violet** color scheme with oklch colors and supports:
- Light mode
- Dark mode
- System preference

## Author

**Milad Joodi** — Frontend Developer

- GitHub: [github.com/MiladJoodi](https://github.com/MiladJoodi)
- LinkedIn: [linkedin.com/in/joodi](https://www.linkedin.com/in/joodi/)
- Project: [github.com/MiladJoodi/QuizMaster](https://github.com/MiladJoodi/QuizMaster)

## License

This project is open source and available under the [MIT License](LICENSE).
