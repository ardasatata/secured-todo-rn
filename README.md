# Tasku - Secured Todo List Application

A React Native todo list application with biometric authentication built using Expo modules.

## Features

- **Biometric Authentication**: Secure todo operations with Face ID/Touch ID/Fingerprint
- **CRUD Operations**: Add, edit, delete, and complete todos
- **Dark/Light Theme**: Automatic theme detection with manual override
- **Clean Architecture**: Repository pattern with dependency injection
- **State Management**: Redux Toolkit for robust state management
- **Persistent Storage**: AsyncStorage with abstraction layer

## Architecture

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── services/        # Business logic and external services
├── repositories/    # Data layer abstraction
├── interfaces/      # TypeScript interfaces
├── store/          # Redux store and slices
├── theme/          # Theme configuration
├── hooks/          # Custom React hooks
├── constants/      # Application constants
├── providers/      # Context providers
└── utils/          # Utility functions
```

## Tech Stack

- **React Native** 0.79.0 with Expo SDK 53 (Local Authentication, Checkbox, Vector Icons)
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **TypeScript** for type safety
- **Jest** for unit testing

## Getting Started

### Installation

```bash
npm install
```

For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install
```

### Running the App

**Start Metro:**
```bash
npm start
```

**Run on iOS:**
```bash
npm run ios
```

**Run on Android:**
```bash
npm run android
```

## Testing

```bash
npm test
```

## Authentication Flow

1. First launch shows biometric setup screen
2. All CRUD operations require authentication
3. Settings allow toggling authentication on/off
4. Demo mode available for simulators

## Security Features

- Biometric authentication for todo operations
- Support for Face ID, Touch ID, and Fingerprint
- Fallback to device passcode when biometrics unavailable

## References

- **Strikethrough Animation**: [Expo Snack](https://snack.expo.dev/l9n-DBTtC)
- **Design Inspiration**: [Dribbble - Clean Minimal Todo List](https://dribbble.com/shots/24425951-Clean-Minimal-Todo-List-Design)

## License

MIT
