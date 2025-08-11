# Secured Todo List Application

A React Native todo list application with biometric authentication built using Expo modules.

## Features

- ✅ **Biometric Authentication**: Secure todo operations with Face ID/Touch ID/Fingerprint
- ✅ **CRUD Operations**: Add, edit, delete, and complete todos
- ✅ **Dark/Light Theme**: Automatic theme detection with manual override
- ✅ **Clean Architecture**: Repository pattern, dependency injection, and clean separation of concerns
- ✅ **State Management**: Redux Toolkit for robust state management
- ✅ **Persistent Storage**: AsyncStorage with abstraction layer for future migration
- ✅ **Animated UI**: Smooth strikethrough animations for completed todos

## Architecture

```
src/
├── components/       # Reusable UI components
├── screens/         # Screen components
├── services/        # Business logic and external services
├── repositories/    # Data layer abstraction
├── interfaces/      # TypeScript interfaces for dependency injection
├── store/          # Redux store and slices
├── theme/          # Theme configuration
├── hooks/          # Custom React hooks
├── providers/      # Context providers
└── utils/          # Utility functions
```

## Tech Stack

- **React Native** 0.79.0
- **Expo** (Local Authentication, Checkbox, Vector Icons)
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **TypeScript** for type safety
- **Jest** for unit testing

## Getting Started

### Prerequisites

- Node.js >= 18
- Yarn or npm
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install
```

### Running the App

**Start Metro bundler:**
```bash
yarn start
```

**Run on iOS:**
```bash
yarn ios
```

**Run on Android:**
```bash
yarn android
```

## Testing

### Unit Tests
```bash
yarn test
```

### E2E Tests (WIP)
Maestro E2E tests are in progress. To run:
```bash
yarn test:e2e
```

## Project Structure Highlights

### Clean Architecture Implementation

- **Interfaces**: Define contracts for services (`IAuthService`, `IStorage`)
- **Services**: Implement business logic (`AuthService`, `StorageService`)
- **Repositories**: Handle data operations with abstraction (`AuthRepository`, `TodoRepository`)
- **Dependency Injection**: Services accept interfaces, allowing easy testing and swapping implementations

### State Management

- Redux Toolkit for predictable state updates
- Middleware for AsyncStorage persistence
- Typed hooks for Redux usage

### Authentication Flow

1. First launch shows `AuthSetupScreen` for biometric setup
2. All CRUD operations require authentication
3. Settings allow toggling authentication on/off
4. Separate tracking of setup status vs enabled status

## Security Features

- Biometric authentication required for todo operations
- Support for Face ID, Touch ID, and Fingerprint
- Fallback to device passcode when biometrics unavailable
- Demo mode for simulators

## Theming

- Automatic theme detection based on system preferences
- Manual theme override (Light/Dark/Auto)
- Comprehensive color system for both themes
- Smooth transitions between themes

## References

- **Strikethrough Animation**: [Expo Snack](https://snack.expo.dev/l9n-DBTtC)
- **Design Inspiration**: [Dribbble - Clean Minimal Todo List](https://dribbble.com/shots/24425951-Clean-Minimal-Todo-List-Design)

## License

MIT