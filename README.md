# Atlas Demo App

A modern Next.js application demonstrating Atlas feature management and user authentication with a beautiful, responsive UI.

## Features

- **Modern UI Design**: Clean, gradient-based design with smooth animations and hover effects
- **User Authentication**: Mock authentication system with multiple user profiles
- **Feature Management**: Integration with Atlas for feature flags and usage limits
- **Dice Rolling Feature**: Interactive dice rolling with usage tracking and limits
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Tab Navigation**: Organized interface with Features, Pricing, and Customer Portal tabs
- **Custom User Login**: Support for custom user IDs for testing

## Tech Stack

- **Framework**: Next.js 15.4.5 with TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **UI Components**: shadcn/ui and Radix UI
- **Icons**: Lucide React
- **Feature Management**: Atlas (@runonatlas/next)
- **State Management**: React hooks with TanStack React Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Login Screen

The app features a modern login screen with three pre-configured users:
- **User 1**: Purple gradient button
- **User 2**: Pink gradient button  
- **User 3**: Blue gradient button

You can also use the custom user login section to test with any user ID.

### Features Tab

Displays Atlas-protected features with visual indicators for access levels:
- **Basic Feature**: Available to all users
- **Premium Feature**: Requires premium plan
- **Enterprise Feature**: Requires enterprise plan

### Dice Rolling Feature

Interactive dice rolling with:
- Configurable number of dice (1-6)
- Smooth rolling animations
- Usage tracking and limits
- Recent rolls history
- Visual progress indicators

### Pricing Tab

Displays pricing information and upgrade options.

### Customer Portal Tab

Provides access to subscription and billing management.

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── atlas-buttons.tsx
│   ├── dice-rolls-feature.tsx
│   └── login-screen.tsx
├── atlas/              # Atlas configuration
│   └── server.ts
└── lib/                # Utility functions
    ├── dice-usage-tracker.ts
    └── mock-auth.ts
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling Guidelines

The project uses a consistent design system with:
- Custom gradient backgrounds
- Smooth hover animations
- Responsive grid layouts
- Consistent spacing and typography
- Dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
