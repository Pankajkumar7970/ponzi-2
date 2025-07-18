# Scam Spotter Guide - React Native

An educational React Native app that simulates Ponzi schemes to help users understand how they work and why they inevitably collapse.

## Features

- **Interactive Ponzi Scheme Simulator**: Watch how schemes grow and collapse
- **Educational Content**: Learn about warning signs and safe alternatives
- **Real-time Metrics**: Track investments, payouts, and losses
- **Mobile-First Design**: Optimized for iOS and Android devices

## Getting Started

### Prerequisites

- Node.js (>= 18)
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS (macOS only)
```bash
npm run ios
```

#### Development Server
```bash
npm start
```

## Project Structure

```
src/
├── screens/
│   ├── PonziSimulation.tsx    # Main simulator screen
│   └── PonziEducation.tsx     # Educational content screen
└── App.tsx                    # Main app component with navigation
```

## Key Components

### PonziSimulation
- Interactive simulation of Ponzi scheme mechanics
- Real-time financial metrics tracking
- Auto-run functionality to demonstrate inevitable collapse
- Educational insights about scheme dynamics

### PonziEducation
- Warning signs and red flags
- Consequences of participation
- Safe investment alternatives
- Links to regulatory resources

## Educational Goals

This app aims to:
- Demonstrate how Ponzi schemes operate
- Show why they inevitably collapse
- Educate users about warning signs
- Promote financial literacy and safe investing

## Building for Production

### Android
```bash
npm run build
```

### iOS
Use Xcode to build and archive the project for App Store submission.

## Contributing

This is an educational project. Contributions that improve the educational value or user experience are welcome.

## Disclaimer

This app is for educational purposes only. It simulates financial schemes to demonstrate their harmful nature and should not be used for any actual investment decisions.