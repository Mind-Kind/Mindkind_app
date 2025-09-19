# MindKind - Your Mental Wellness Sanctuary

A beautiful, modern React application for mental wellness tracking, meditation, journaling, and personal growth challenges.

## Features

- 🧘‍♀️ **Guided Meditations** - Various meditation types with audio playback
- 📝 **Journaling** - Reflective writing with prompts and mood tracking
- 💖 **Mood Tracking** - Daily mood logging with intensity and tags
- 🎧 **Audio Library** - Healing sounds, affirmations, and guided content
- 🏆 **Challenges** - 7-30 day personal growth journeys
- 📊 **Dashboard** - Overview of your wellness journey and streaks
- 🎨 **Beautiful UI** - Modern, responsive design with glass effects

## Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
MindKind/
├── Components/
│   ├── audio/           # Audio player components
│   ├── challenges/      # Challenge data and templates
│   ├── meditations/     # Meditation data
│   └── ui/             # Reusable UI components
├── Entities/           # Data models and mock APIs
├── Pages/             # Main application pages
├── utils/             # Utility functions
├── src/               # Application entry point
└── Layout.js          # Main layout component
```

## Technology Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Date-fns** - Date utilities
- **Vite** - Build tool

## Features Overview

### 🧘‍♀️ Meditations
- Multiple meditation types (breathing, mindfulness, sleep, anxiety relief)
- Audio playback with progress tracking
- Session tracking and history

### 📝 Journal
- Writing prompts for inspiration
- Mood tracking before/after writing
- Tag system for organization
- Streak tracking

### 💖 Mood Tracker
- Daily mood logging with emojis
- Intensity levels (1-5)
- Tag system for context
- Weekly mood trends

### 🎧 Audio Library
- Affirmations, healing tracks, self-love content
- Mood-based filtering
- Goal-based recommendations
- Audio player integration

### 🏆 Challenges
- 7-30 day personal growth journeys
- Daily tasks with quotes and prompts
- Progress tracking
- Completion celebrations

## Development Notes

This application uses mock data for development. In a production environment, you would:

1. Replace mock entities with real API calls
2. Implement proper authentication
3. Add data persistence (database)
4. Add error handling and loading states
5. Implement real audio streaming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**MindKind** - Nurturing your mental wellness journey, one day at a time. 💜
