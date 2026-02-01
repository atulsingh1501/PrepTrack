# 📋 PrepTrack — Placement Preparation Tracker

> **Your all-in-one MERN stack companion to crack placements.** Track your LeetCode grind, manage daily tasks, monitor skills, store resources, set goals, and visualise your readiness — all from one sleek dashboard.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Pages & Modules](#-pages--modules)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

PrepTrack is a **full-stack MERN application** built specifically for students preparing for campus placements and tech job interviews. Instead of juggling spreadsheets, Notion pages, and random sticky notes, PrepTrack brings everything into a single authenticated platform:

- Visualise your overall placement readiness at a glance
- Log every LeetCode / DSA problem you solve
- Keep a live skill inventory across DSA, dev stacks, and core CS subjects
- Manage a daily agenda with persistent task tracking
- Store study resources (PDFs, links, notes) organised by category
- Set measurable placement goals and watch your progress ring fill up
- Track your coding profiles (LeetCode, GitHub, Codeforces, etc.)
- Prepare for interviews with a structured mock-interview board

---

## ✨ Features

| Module | What it does |
|---|---|
| 🏠 **Dashboard** | Aggregated stats, topic heatmap, activity graph, AI readiness suggestions |
| 🧩 **LeetCode Tracker** | Log Easy / Medium / Hard problems, set weekly targets, filter by topic/status |
| 🛠️ **Skills & Git** | Rate skills as Strong / Learning / Weak; link GitHub project repos |
| 📅 **Daily Agenda** | Add, complete & delete tasks; set reminders; see a weekly overview |
| 📚 **Study Hub** | Upload & manage PDFs, external links, and rich-text notes per subject |
| 🎯 **Goals** | Define placement goals (CTC target, company list, interview rounds); animated readiness ring |
| 👤 **Platform Trackers** | Sync coding profile stats from LeetCode, GitHub, Codeforces, GeeksForGeeks |
| 🎙️ **Interview Board** | Kanban-style tracking of mock interviews — scheduled, done, feedback |
| 🔐 **Auth** | JWT-based registration, login & protected routes; passwords hashed with bcrypt |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | UI library (component-based SPA) |
| **Vite 5** | Lightning-fast dev server & bundler |
| **React Router DOM v6** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling |
| **Recharts** | Charts & data visualisations (dashboard graphs, heatmaps) |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client for REST API calls |
| **Lucide React** | Icon library |
| **React Hot Toast** | Non-intrusive toast notifications |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 4** | REST API framework |
| **MongoDB Atlas** | Cloud NoSQL database |
| **Mongoose 8** | MongoDB ODM (schema + validation) |
| **JSON Web Tokens** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **dotenv** | Environment variable management |
| **nodemon** | Auto-reload during development |

---

## 📁 Project Structure

```
PrepTrack/                          ← Monorepo root
├── package.json                    ← Workspace scripts (npm workspaces)
│
├── backend/                        ← Express REST API
│   ├── config/
│   │   └── db.js                   ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js                 ← JWT verify middleware
│   ├── models/                     ← Mongoose schemas
│   ├── routes/                     ← Route handlers
│   │   ├── auth.js                 ← POST /api/auth/register, /login
│   │   ├── tasks.js                ← CRUD /api/tasks
│   │   ├── leetcode.js             ← CRUD /api/leetcode
│   │   ├── goals.js                ← CRUD /api/goals
│   │   ├── skills.js               ← CRUD /api/skills
│   │   ├── resources.js            ← CRUD /api/resources
│   │   └── profiles.js             ← CRUD /api/profiles
│   ├── server.js                   ← App entry point
│   ├── .env.example                ← Environment template
│   └── package.json
│
├── client/                         ← React + Vite frontend
│   ├── src/
│   │   ├── api/                    ← Axios instance & API helpers
│   │   ├── components/             ← Reusable UI components
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       ← Main overview page
│   │   │   ├── Agenda.jsx          ← Daily tasks
│   │   │   ├── Goals.jsx           ← Goal setting & tracking
│   │   │   ├── StudyHub.jsx        ← Study resources
│   │   │   ├── PlatformTrackers.jsx← Coding profile stats
│   │   │   ├── InterviewBoard.jsx  ← Mock interview kanban
│   │   │   ├── Login.jsx           ← Auth — login
│   │   │   └── Register.jsx        ← Auth — register
│   │   ├── store/                  ← Zustand state stores
│   │   ├── App.jsx                 ← Router + layout
│   │   ├── main.jsx                ← React entry point
│   │   └── index.css               ← Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node)
- **MongoDB Atlas** account (free tier is fine) — [Sign up](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/PrepTrack.git
cd PrepTrack

# 2. Install ALL dependencies (root + client + backend) in one shot
npm install

# This uses npm workspaces — it wires up both the client and backend automatically
```

### Environment Variables

The backend needs a `.env` file. Copy the example and fill in your values:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set the following:

```env
# MongoDB connection string — get this from MongoDB Atlas → Connect → Drivers
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/preptrack?retryWrites=true&w=majority

# JWT secret — change this to a long, random string in production
JWT_SECRET=your_super_secret_jwt_key_change_me

# Port the Express server will listen on
PORT=5000

# Environment mode
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running the App

#### Option 1 — Run both servers in one terminal (recommended)

```bash
# From the root of the project
npm run dev
```

This starts **both** the backend (port 5000) and the frontend (port 5173) concurrently.

#### Option 2 — Run servers separately

```bash
# Terminal 1 — Backend
cd backend
npm run dev         # nodemon watches for file changes

# Terminal 2 — Frontend
cd client
npm run dev         # Vite dev server with HMR
```

#### Verify it's working

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/ |

Open your browser at `http://localhost:5173`, register a new account, and start tracking!

---

## 📡 API Reference

All endpoints (except auth) require a valid Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login & receive JWT |

### Tasks (Daily Agenda)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for logged-in user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task (toggle done, edit text) |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### LeetCode

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leetcode` | Get all logged problems |
| `POST` | `/api/leetcode` | Log a new problem |
| `PUT` | `/api/leetcode/:id` | Update a problem entry |
| `DELETE` | `/api/leetcode/:id` | Remove a problem entry |

### Goals

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/goals` | Get all placement goals |
| `POST` | `/api/goals` | Add a new goal |
| `PUT` | `/api/goals/:id` | Update goal progress |
| `DELETE` | `/api/goals/:id` | Delete a goal |

### Skills

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills` | Get skill inventory |
| `POST` | `/api/skills` | Add a skill |
| `PUT` | `/api/skills/:id` | Update skill level |
| `DELETE` | `/api/skills/:id` | Remove a skill |

### Resources (Study Hub)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | Get all study resources |
| `POST` | `/api/resources` | Add a resource (PDF / link / note) |
| `PUT` | `/api/resources/:id` | Edit a resource |
| `DELETE` | `/api/resources/:id` | Delete a resource |

### Coding Profiles

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profiles` | Get saved profile links |
| `POST` | `/api/profiles` | Add a coding profile |
| `PUT` | `/api/profiles/:id` | Update a profile |
| `DELETE` | `/api/profiles/:id` | Remove a profile |

---

## 🖥️ Pages & Modules

### 🏠 Dashboard
The central hub. Shows:
- Total tasks done, LeetCode problems solved (by difficulty), active goals
- A calendar heatmap of daily activity
- A bar/line chart of weekly problem-solving trends
- AI-style readiness suggestions based on your current data

### 📅 Agenda (Daily Tasks)
- Add tasks with optional due dates and reminders
- One-click completion toggle with strikethrough animation
- Weekly task overview to spot your busiest days
- Tasks are persisted per user in MongoDB

### 🧩 LeetCode Tracker
- Log each problem with: title, difficulty (Easy / Medium / Hard), topic tag, status (Solved / Revisit / Skip)
- Filter the list by difficulty or topic
- Visual counters and target-progress bars

### 🛠️ Skills & Git
- Maintain a personal skill inventory (e.g., "React → Strong", "OS → Learning")
- Link your GitHub projects with repo URLs and descriptions
- Color-coded badges for skill strength levels

### 📚 Study Hub
- Upload PDFs (stored as references), external links, or rich-text notes
- Organised by category: DSA, Core CS (OS/CN/DBMS), HR prep, System Design
- Quick-search and filter by category

### 🎯 Goals
- Set SMART placement goals (e.g., "Apply to 20 companies by May")
- Track numeric progress with an animated circular readiness ring
- Completion percentage is calculated automatically

### 👤 Platform Trackers
- Save your profiles on LeetCode, GitHub, Codeforces, GeeksForGeeks, HackerRank
- Quick-launch links to each platform from a single page

### 🎙️ Interview Board
- Kanban-style board with columns: Scheduled / In Progress / Done
- Log mock interview details (company, round, date, feedback)
- Drag-and-drop style status updates

---

## 🌐 Deployment

### Frontend — Vercel (Recommended)

```bash
# Build the production bundle
cd client
npm run build

# Or connect your GitHub repo to Vercel and it auto-deploys on every push
```

Set the **Root Directory** to `client` and the **Build Command** to `npm run build` in Vercel's settings.

Don't forget to add `VITE_API_URL` as an environment variable pointing to your deployed backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com
```

### Backend — Render (Recommended)

1. Create a new **Web Service** on [Render](https://render.com/)
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add all environment variables from your `.env` file in Render's dashboard

### Alternative Platforms

| Platform | Frontend | Backend |
|---|---|---|
| **Netlify** | ✅ Static deploy from `/client/dist` | ❌ Need separate backend host |
| **Railway** | ✅ | ✅ Full-stack support |
| **Heroku** | ✅ | ✅ Full-stack support |
| **GitHub Pages** | ✅ (static only, no SSR) | ❌ |

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for students who grind — <strong>track your prep, own your placement.</strong>
</p>
