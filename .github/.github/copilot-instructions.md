# Klavora Development Guidelines

## Project Overview
Klavora is a pharmacy inventory management system built with React and Vite. The application uses Google Material fonts, Material-UI components, and follows a clean, modern design approach.

## Key Development Principles
- **Mock Data**: All mock data is stored in `src/mock.js` for easy backend integration
- **Component Structure**: Screens are built section-by-section in reusable React components
- **Design System**: Google Material fonts (Roboto) with Material-UI theming
- **Responsiveness**: All components must be fully responsive across desktop, tablet, and mobile
- **Code Style**: Clean, readable TypeScript/React code with proper typing

## Folder Structure
```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page-level components
  ├── hooks/         # Custom React hooks
  ├── styles/        # Global styles and theme
  ├── utils/         # Utility functions
  ├── mock.js        # Mock data
  ├── App.tsx        # Main app component
  └── main.tsx       # Entry point
```

## Important Notes
- When building new screens, request and implement them section-by-section
- Keep components modular and reusable
- Use Material-UI Grid system for responsive layouts
- Leverage Google Material icons (@mui/icons-material)
- Update mock.js when adding new data structures
- Maintain clean CSS with minimal custom styling (prefer Material-UI sx prop or theme)

## Building New Screens
When receiving UI designs:
1. Request screenshot/design reference
2. Break down into logical components
3. Build section by section, showing progress
4. Store mock data in src/mock.js
5. Ensure full responsiveness with Material-UI Grid