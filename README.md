# Klavora - Pharmacy Inventory Management System

A modern, responsive web application for managing pharmacy inventory, built with React, Vite, and Material-UI.

## Features
- 📦 Inventory management
- 💊 Pharmacy dashboard
- 📊 Sales tracking
- 🔔 Low stock alerts
- 📱 Fully responsive design
- 🎨 Clean, modern UI with Google Material fonts

## Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Icons**: Google Material Icons
- **Fonts**: Google Roboto Font
- **Styling**: MUI sx prop & theme system

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Klavora
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Project Structure

```
Klavora/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom hooks
│   ├── styles/             # Theme and global styles
│   ├── utils/              # Utility functions
│   ├── mock.js             # Mock data for development
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                 # Static assets
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Mock Data

Mock data is centralized in `src/mock.js` and includes:
- Pharmacy information
- Inventory items
- Transactions
- Dashboard statistics

When ready for backend integration, simply replace mock data exports with API calls.

## Design & UI Guidelines

- **Typography**: Roboto font (Google Fonts)
- **Theme**: Custom MUI theme with primary blue (#1976d2)
- **Icons**: Material Icons from @mui/icons-material
- **Responsiveness**: Mobile-first approach using MUI Grid
- **Spacing**: Based on 8px grid system

## Contributing

When building new screens:
1. Request design/screenshot reference
2. Break into section-by-section components
3. Use MUI components for consistency
4. Update mock.js with new data structures
5. Ensure full mobile responsiveness
6. Follow existing code style and conventions

## License

Proprietary - Klavora Pharmacy System

## Contact

For questions or support regarding Klavora, please contact the development team.
