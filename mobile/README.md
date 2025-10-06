# Mobile App - forjustice.ca

React Native mobile application (Expo) for the forjustice.ca platform.

## Features

- **Cross-Platform**: iOS and Android support
- **Expo Managed Workflow**: Easy development and deployment
- **Secure Storage**: Token storage with expo-secure-store
- **Native UI**: Platform-specific components

## Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## Installation

```bash
npm install
```

Install Expo CLI globally:
```bash
npm install -g expo-cli
```

## Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Building

For production builds, use Expo Application Services (EAS):

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

## Testing

```bash
npm test
```

## Project Structure

```
mobile/
├── App.js              # Main app entry
├── AuthScreen.js       # Authentication screen
├── app.json           # Expo configuration
├── assets/            # Images and fonts
└── package.json
```

## Environment Variables

See `.env.example` for configuration options.

## Deployment

The mobile app can be deployed to:
- Apple App Store (iOS)
- Google Play Store (Android)
- Expo Go for development/testing

See Expo documentation for detailed deployment instructions.
