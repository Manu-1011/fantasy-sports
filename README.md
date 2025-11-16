# Fantasy Sports – Team Creation App

A modern, responsive React application for creating and managing fantasy teams across upcoming matches. Users can discover matches, build multiple teams per match, preview and finalize captain/vice-captain selections, and review saved teams grouped by match—all using official API endpoints.

## Key Features

- Matches overview with tabs:
  - Matches: Upcoming matches available to join
  - Joined: Matches where at least one team has been created (tracked locally)
  - Completed: Matches whose start time has passed
- Create Team workflow:
  - Player table with filtering and sorting
  - Real-time validation against fantasy rules (roles, credits, etc.)
  - Select/deselect players (11 required to proceed)
  - Preview Team and captain/vice-captain selection
  - Save Team with persistence
- My Teams:
  - Teams grouped by match
  - Multiple teams per match supported
  - Expand “View/Edit” per team to adjust captain and vice-captain
  - Players displayed in a table for quick review
- Promotions preserved via a promotional ribbon component
- Clean UI without emojis; professional labels/icons only
- Strict usage of API endpoints provided by the official specification

## Tech Stack

- React 18
- React Router
- Bootstrap (styling and layout)
- LocalStorage (client-side persistence for saved teams)
- Official API endpoints for matches and players

## Environment Setup

Create a `.env` file in the project root to configure the application port and API base URL.

- PORT: set the development server port
- REACT_APP_API_BASE_URL: base URL for API requests (defaults to the official endpoint if not set)

Example `.env`:

PORT=3001

REACT_APP_API_BASE_URL=https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports

## Installation

Install dependencies:

```bash
npm install
```

Create the `.env` file (if you haven’t already) and set the variables shown above.

## Running Locally

Start the development server:

```bash
npm start
```

Open the app:

```bash
start http://localhost:3001/
```

Note:
- If you change the port in `.env`, use that port in the URL.
- The app reads `REACT_APP_API_BASE_URL` for fetching matches and players.

## Build for Production

Generate an optimized production build:

```bash
npm run build
```

Serve the built assets with your preferred static server or hosting platform. Ensure `REACT_APP_API_BASE_URL` is set appropriately in the production environment.

## API Endpoints Used

All data is fetched directly from the official endpoints:

- Matches: Get_All_upcoming_Matches.json
  - Base: `REACT_APP_API_BASE_URL`
  - Path: `/Get_All_upcoming_Matches.json`

- Players: Get_All_Players_of_match.json
  - Base: `REACT_APP_API_BASE_URL`
  - Path: `/Get_All_Players_of_match.json`

These endpoints are used for all match and player data in the app—no local mock data is used.

## Application Walkthrough (Step-by-Step)

### Home Page

- Sport selector: Choose your sport context (default is Cricket).
- Tabs:
  - Matches: Lists upcoming matches with logos, teams, date/time, and a “Create Team” button.
  - Joined: Shows matches where you have created at least one team (based on localStorage).
  - Completed: Shows matches that have passed their scheduled start time.
- Each match card includes:
  - Team logos and names
  - Date and time
  - Countdown to lock (and “Match Started” indicator once locked)
  - “Create Team” action (links to the Create Team page with match ID and sport in the query)

### Create Team Page

- Team counter: Displays counts of selected players per team and total credits used.
- Role tabs and filters:
  - Tabs (All Players, Batsmen, Bowlers, All-Rounders, Wicket-Keepers)
  - Filters by Role, Team, and Sort (Points, Credits, Name)
- Player table (see “Tables” below for columns):
  - Select button: Adds the player if it passes validation (roles/credits limits)
  - Deselect button: Appears only when the player is already selected (no separate remove button next to “Select”)
- Selected Sidebar:
  - Shows counts, credits, and a scrollable list of selected players
  - A remove icon (×) is shown only for selected players to deselect them
- Actions:
  - Preview Team: Enabled only when exactly 11 players are selected and match is not locked
  - Save Team: Appears in captain mode; disabled if match is locked or captain/vice-captain are not set

Captain/VC selection:
- After clicking Preview Team, you enter Captain/VC mode
- Select both Captain and Vice-Captain from your selected 11
- Finalize via Save Team to persist

Locking behavior:
- If the match start time has passed (locked), selection and saving are disabled

### My Teams Page

- Displays all saved teams grouped by match
- Each match section shows:
  - Team logos, names, and match date/time
  - “Create Another Team” button
- Teams list:
  - Each saved team shows name and created time
  - Click “View/Edit” to expand team details:
    - Captain and Vice-Captain selectors
    - “Save C/VC” to persist selections
    - Player table for the saved team

### Promotions

- Promotional ribbon component is preserved and visible
- Responsive behavior retained

## Tables

### Player List (Create Team)

Columns:
- Logo: Team logo of the player’s team
- Name: Player full name
- Role: Player role (Batsman, Bowler, All-Rounder, Wicket-Keeper)
- Team: Player’s team name
- Points: Total/event points (mapped from API)
- Credits: Player credits (mapped from API)
- Action: 
  - Select (if not selected and validation passes)
  - Deselect (only visible when player is already selected)

### Saved Team Players (My Teams)

Columns:
- Name: Player full name
- Role: Player role
- Team: Player’s team name
- Points: Total/event points
- Credits: Player credits

## Data Persistence

Saved teams are stored in `localStorage` under the key `fantasyTeams`:

Structure:
- `fantasyTeams`: `{ [matchId]: TeamEntry[] }`
- `TeamEntry` includes:
  - `id`: unique identifier (timestamp-based)
  - `name`: team name
  - `matchId`: associated match ID
  - `sport`: sport type
  - `players`: array of player objects (from the API mapping)
  - `captainId`: selected captain’s player ID
  - `viceCaptainId`: selected vice-captain’s player ID
  - `createdAt`: ISO timestamp

Captain/VC updates:
- Persisted per team using an update method that modifies only the specified team’s entry

## Rules & Validation

- Team must have exactly 11 players
- Credits total must not exceed the limit
- Roles distribution must satisfy the configured rules
- Select/Deselect actions respect these validations
- Captain and Vice-Captain must both be set before saving

## Accessibility & UX

- Clear labels (no emojis) and concise actions
- Disabled states for invalid actions (e.g., locked matches)
- Responsive design with tables for better information density
