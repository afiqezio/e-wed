# Elegant Wedding Invitation

A beautiful, modern, and fully customizable wedding invitation web application built with React and TypeScript. This single-page application provides an elegant way to share your wedding details, manage RSVPs, collect guest wishes, and showcase your gift registry.

## ✨ Features

- **Welcome Screen**: Elegant entry point with smooth transition to main content
- **Hero Section**: Beautiful introduction with couple names and wedding date
- **Couple Section**: Showcase bride and groom information with photos and contact details
- **Timeline Section**: Display wedding day schedule with times and descriptions
- **Location Section**: Interactive maps with Google Maps and Waze integration
- **RSVP System**: Collect guest responses with form validation and local storage
- **Guestbook**: Allow guests to leave wishes and messages
- **Gift Registry**: Display and manage gift items with reservation functionality
- **Music Player**: Background music with auto-play option
- **Responsive Design**: Fully responsive layout for all devices
- **Theme Customization**: Easy-to-configure color schemes and fonts
- **Local Storage**: Persistent data storage for RSVPs, wishes, and gift reservations

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
│   ├── Navbar.tsx           # Navigation bar
│   ├── Hero.tsx             # Hero section with couple names
│   ├── CoupleSection.tsx    # Bride and groom details
│   ├── TimelineSection.tsx  # Wedding day schedule
│   ├── LocationSection.tsx  # Venue and maps
│   ├── RSVPSection.tsx      # RSVP form
│   ├── GuestbookSection.tsx # Guest wishes
│   ├── RegistrySection.tsx  # Gift registry
│   └── MusicPlayer.tsx      # Background music
├── services/
│   └── storage.ts       # LocalStorage utilities
├── constants.tsx        # Wedding configuration (couple info, theme, etc.)
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
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

All wedding-specific data is centralized in `constants.tsx` for easy customization.

### Customizing Wedding Information

Edit `constants.tsx` to update:

- **Couple Information**: Names, short names, parent names, contact details
- **Event Details**: Date, time, venue, location links (Google Maps, Waze)
- **Timeline/Schedule**: Wedding day events with times and descriptions
- **Gift Registry**: Bank details, gift items with images
- **Theme**: Colors and fonts
- **Music**: Background music URL and volume

### Example Configuration

```typescript
export const WEDDING_CONFIG = {
  couple: {
    groom: {
      name: 'YOUR_GROOM_NAME',
      shortName: 'ShortName',
      // ... more fields
    },
    bride: {
      name: 'YOUR_BRIDE_NAME',
      // ... more fields
    }
  },
  event: {
    date: new Date('2028-02-20T10:00:00'),
    venueName: 'Your Venue Name',
    // ... more fields
  },
  theme: {
    colors: {
      primary: '#A64B6D',    // Rosewood
      secondary: '#A1B39D',  // Dusty Sage
      // ... more colors
    },
    fonts: {
      display: "'Playfair Display', serif",
      // ... more fonts
    }
  }
};
```

### Theme Customization

The theme system uses CSS custom properties (CSS variables) that are dynamically injected:

- **Colors**: Primary, secondary, accent, background, text, muted
- **Fonts**: Display font (headings), body font (content), serif font (decorative)

These are set in `App.tsx` and can be customized in `constants.tsx`.

## 🏗️ Architecture

### Component Structure

- **App.tsx**: Main application component that manages:
  - Welcome screen state
  - Music player state
  - Theme injection via CSS variables
  - Component composition

- **Components**: Each section is a self-contained component:
  - Receives data from `constants.tsx`
  - Manages its own local state if needed
  - Uses the storage service for persistence

### Data Storage

The `services/storage.ts` module provides a simple interface to localStorage:

- **RSVPs**: Guest responses stored as an array
- **Wishes**: Guestbook messages stored as an array
- **Gifts**: Gift registry with reservation status

All data persists in the browser's localStorage, so it remains available across sessions.

### State Management

- **Local State**: React hooks (`useState`, `useEffect`) for component-level state
- **Persistent State**: localStorage via the storage service
- **Theme State**: CSS custom properties set on document root

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework loaded via CDN
- **Custom CSS**: Additional styles in `index.html` for:
  - Scrollbar styling
  - Animations (fadeIn, slideUp)
  - Islamic pattern background
  - Mobile menu transitions

- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## 📝 Type Definitions

TypeScript types are defined in `types.ts`:

- `RSVPData`: RSVP form data structure
- `Wish`: Guestbook message structure
- `Gift`: Gift registry item structure
- `EventSchedule`: Timeline event structure

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server (port 3000)
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Development Server

The Vite dev server runs on `http://localhost:3000` with:
- Hot Module Replacement (HMR)
- Fast refresh
- TypeScript support

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
   - Netlify
   - GitHub Pages
   - Any static hosting service

3. **Environment Variables**: Ensure `.env` variables are set in your hosting platform if needed.

## 📄 License

This project is private and intended for personal use.

## 🤝 Contributing

This is a personal wedding invitation project. For questions or suggestions, please contact the project owner.

---

**Made with ❤️ for your special day**
