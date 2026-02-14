# Elegant Wedding Invitation

A beautiful, modern, and fully customizable wedding invitation web application built with React and TypeScript. This application provides an elegant way to share your wedding details, manage RSVPs in real-time, collect guest wishes, and showcase your gift registry.

## ✨ Features

- **Welcome Screen**: Elegant entry point with smooth transition to main content.
- **Hero Section**: Beautiful introduction with couple names and wedding date.
- **Couple Section**: Showcase bride and groom information with photos and parent details.
- **Timeline Section**: Display wedding day schedule with an interactive vertical/horizontal timeline.
- **Location Section**: Interactive maps with Google Maps and Waze integration.
- **RSVP System**: Collect guest responses with real-time statistics and deadline enforcement.
- **Guestbook**: Allow guests to leave wishes and messages that update instantly for all users.
- **Gift Registry**: Display and manage gift items with real-time reservation functionality.
- **Music Player**: Background music with auto-play and manual controls.
- **Responsive Design**: Fully responsive layout optimized for mobile (Quick-Nav) and Desktop.
- **Admin Panel**: Hidden configuration suite (at `/#admin`) to update all wedding details, theme colors, and music without code.
- **Real-time Sync**: Powered by Firebase Realtime Database for instant updates across all guests.

## 🛠️ Tech Stack

- **React 19.2.3**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite 6.2.0**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Google Fonts**: Playfair Display, Montserrat, Cormorant Garamond

## 📁 Project Structure

```
e-wedcard/
├── components/          # React components
│   ├── WelcomeScreen.tsx    # Initial entry screen
│   ├── Navbar.tsx           # Top navigation bar (branding + desktop menu)
│   ├── Hero.tsx             # Hero section with couple names
│   ├── CoupleSection.tsx    # Bride and groom details
│   ├── TimelineSection.tsx  # Wedding day schedule
│   ├── LocationSection.tsx  # Venue and maps
│   ├── RSVPSection.tsx      # RSVP form & real-time stats
│   ├── GuestbookSection.tsx # Guest wishes (real-time)
│   ├── RegistrySection.tsx  # Gift registry & bank info
│   ├── AdminPanel.tsx       # Live site editor (/#admin)
│   └── MusicPlayer.tsx      # Background music controls
├── services/
│   └── storage.ts       # Firebase Realtime Database utilities
├── constants.tsx        # Fallback wedding configuration
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application & Quick-Nav
├── index.tsx           # Application entry point
├── firebase.ts         # Firebase configuration & initialization
└── index.html          # HTML template & Global CSS
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## ⚙️ Configuration

While you can use the **Admin Panel** for live updates, the initial data is set in `constants.tsx`.

### Customizing Wedding Information

The system utilizes a central configuration object:

- **Couple Information**: Names, parent names, and image URLs.
- **Event Details**: Date, venue, and navigation links.
- **Timeline**: Array of events for the wedding day.
- **Theme**: Primary, secondary, and accent colors defined via Hex codes.

## 🏗️ Architecture

### Component Structure

- **App.tsx**: The root orchestrator. It manages the theme injection into CSS variables and handles the transition from the Welcome Screen to the main content.
- **Quick-Nav**: A mobile-specific floating glass bar for easy navigation.

### Data Synchronization

The application uses a **Publisher/Subscriber** model via Firebase:
- The `storage` service listens for changes on the database.
- When any user RSVPs or the Admin updates a setting, the `onValue` listener triggers a re-render for every active guest, ensuring the "Total Tetamu" count is always accurate.

## 🎨 Styling

- **Tailwind CSS**: Responsive utilities loaded via CDN.
- **CSS Variables**: Dynamic themes. Changing a color in the Admin Panel updates the `--color-primary` variable globally.
- **Responsive Navigation**: 
  - **Desktop**: Traditional top-bar links.
  - **Mobile**: Minimalist branding at top + Floating Quick-Nav at bottom.

### Code Organization

- **Components**: Reusable UI components in `components/`
- **Services**: Business logic and utilities in `services/`
- **Constants**: Configuration data in `constants.tsx`
- **Types**: TypeScript definitions in `types.ts`

## 🚢 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your hosting service:
   - Vercel

## 📄 License

This project is private and intended for personal use.

## 🤝 Contributing

This is a personal wedding invitation project. For questions or suggestions, please contact the project owner.

---
