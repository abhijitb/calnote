# CalNote - Calendar Note Application

A modern React-based calendar note application that combines calendar functionality with note-taking capabilities, allowing users to organize their thoughts and tasks by date.

## 🚀 Features

- **Calendar View** - Interactive calendar interface for navigating dates and viewing notes
- **Note Management** - Create, edit, and organize notes with rich text editing capabilities
- **Date-based Organization** - Associate notes with specific dates for better organization
- **Responsive Design** - Fully responsive layout that works on desktop, tablet, and mobile devices
- **Local Storage Persistence** - Notes are saved locally in the browser for offline access
- **Rich Text Editor** - Feature-rich text editor with formatting options (bold, italic, lists)
- **Tagging System** - Organize notes with custom tags and categories
- **Search Functionality** - Easily find notes by title, content, tags, or date
- **Favorites** - Mark important notes as favorites for quick access
- **Auto-save** - Automatic saving of notes as you type
- **Keyboard Shortcuts** - Efficient navigation and editing with keyboard shortcuts

## 🖼️ Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">

<img src="/screenshots/homepage.png" alt="Homepage" width="45%" style="min-width: 300px; border: 1px solid #ddd; border-radius: 8px;">

<img src="/screenshots/notes-dashboard.png" alt="Notes Dashboard" width="45%" style="min-width: 300px; border: 1px solid #ddd; border-radius: 8px;">

<img src="/screenshots/calendar-view.png" alt="Calendar View" width="45%" style="min-width: 300px; border: 1px solid #ddd; border-radius: 8px;">

<img src="/screenshots/note-editor.png" alt="Note Editor" width="45%" style="min-width: 300px; border: 1px solid #ddd; border-radius: 8px;">

<img src="/screenshots/notes-search.png" alt="Search Functionality" width="45%" style="min-width: 300px; border: 1px solid #ddd; border-radius: 8px;">

</div>

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
calnote/
├── public/             # Static assets
│   ├── favicon.svg     # Application favicon (SVG format)
│   ├── favicon-16x16.png # Application favicon (16x16 PNG)
│   ├── favicon-32x32.png # Application favicon (32x32 PNG)
│   ├── screenshots/    # Application screenshots (for documentation)
│   └── assets/         # Other static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (calendar-view, notes-dashboard, note-editor)
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── utils/          # Utility functions (localStorage management)
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🎯 Key Components

### Calendar View
- Interactive monthly calendar with date selection
- Notes panel that displays notes for selected dates
- Current date highlighting
- Responsive layout for all screen sizes

### Notes Dashboard
- Grid and list view options for browsing notes
- Filtering and sorting capabilities
- Bulk selection and actions
- Favorite notes section

### Note Editor
- Rich text editing with formatting toolbar
- Note details sidebar with tagging and categorization
- Auto-save functionality
- Word count tracking
- Responsive layout with sidebar on desktop and below editor on mobile

### Data Management
- LocalStorage integration for persistent note storage
- Default notes for initial user experience
- Real-time synchronization between UI and storage

## ⚙️ Favicon

The application includes a custom calendar icon favicon in multiple formats:
- `favicon.svg` - Scalable vector format for modern browsers
- `favicon-16x16.png` - Standard size for browser tabs
- `favicon-32x32.png` - Larger size for bookmarks and other uses

The favicon is automatically loaded by the browser as specified in the `index.html` file.

To customize the favicon:
1. Replace the existing favicon files in the `public/` directory
2. Ensure you provide all three formats for maximum browser compatibility
3. The favicon should represent the calendar functionality of the application

## 🎨 Styling

This project uses Tailwind CSS for styling with custom configurations for:
- Consistent color scheme and theming
- Responsive breakpoints
- Custom component styling
- Dark mode support

## 📱 Responsive Design

The app features a fully responsive design:
- Desktop: Three-column layout with calendar, notes panel, and editor
- Tablet: Two-column layout with adaptive components
- Mobile: Single column layout with optimized touch targets

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save current note
- **Ctrl/Cmd + B** - Toggle bold formatting
- **Ctrl/Cmd + I** - Toggle italic formatting
- **Ctrl/Cmd + U** - Toggle underline formatting
- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo
- **Escape** - Cancel/close current operation

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new