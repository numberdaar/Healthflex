# HealthFlex Timer App

A comprehensive React Native timer application that allows users to create, manage, and interact with multiple customizable timers. The app includes features like categories, progress visualization, bulk actions, and history tracking.

## 🚀 Features

### Core Features
- ✅ **Add Timer**: Create new timers with name, duration, and category
- ✅ **Timer List with Grouping**: Display timers grouped by categories in expandable sections
- ✅ **Timer Management**: Start, pause, reset, and complete timers
- ✅ **Progress Visualization**: Show progress bars and percentages for each timer
- ✅ **Bulk Actions**: Start, pause, and reset all timers in a category
- ✅ **User Feedback**: Modal notifications when timers complete

### Enhanced Functionality
- ✅ **Timer History**: Maintain and display logs of completed timers
- ✅ **Customizable Alerts**: Halfway point notifications for each timer
- ✅ **Export Timer Data**: Export history as JSON files
- ✅ **Custom Themes**: Light and dark mode support
- ✅ **Category Filtering**: Filter timers and history by category

### Technical Features
- ✅ **State Management**: React Context with useReducer
- ✅ **Navigation**: React Navigation with stack navigator
- ✅ **Persistence**: AsyncStorage for local data storage
- ✅ **Styling**: Clean and responsive layouts with StyleSheet
- ✅ **Timers**: setInterval-based time management
- ✅ **Notifications**: Expo Notifications for alerts

## 📱 Screenshots

The app includes three main screens:
1. **Home Screen**: Timer list with grouping, statistics, and bulk actions
2. **Add Timer Screen**: Form to create new timers with quick-select options
3. **History Screen**: Completed timer logs with export functionality

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthflex-timer-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on your phone

## 📱 APK Build Instructions

### Option A: Quick APK Build (Recommended)

1. **Create Expo account** at https://expo.dev
2. **Login to EAS**:
   ```bash
   eas login
   ```
3. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

### Option B: Alternative Methods

If EAS build doesn't work, you can:

#### Use Expo Go for Testing
- Share the QR code from `npm start`
- Company can test using Expo Go app
- No APK needed for testing

#### Local Build (requires Android Studio)
1. **Install Android Studio** and set up Android SDK
2. **Eject from Expo**:
   ```bash
   expo eject
   ```
3. **Build APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
4. **Find APK** in `android/app/build/outputs/apk/release/`

### APK Installation
- Download the APK file
- Enable "Install from unknown sources" on Android device
- Install the APK file
- Grant notification permissions when prompted

## 📁 Project Structure

```
healthflex-timer-app/
├── App.js                 # Main app component with navigation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── src/
    ├── components/      # Reusable UI components
    │   ├── Timer.js      # Individual timer component
    │   └── CategoryGroup.js # Timer grouping component
    ├── context/         # React Context providers
    │   ├── ThemeContext.js # Theme management
    │   └── TimerContext.js # Timer state management
    ├── screens/         # App screens
    │   ├── HomeScreen.js # Main timer list screen
    │   ├── AddTimerScreen.js # Timer creation screen
    │   └── HistoryScreen.js # History and export screen
    └── utils/           # Utility functions
        ├── timeUtils.js  # Time formatting and calculations
        └── notificationUtils.js # Notification handling
```

## 🎯 Development Assumptions

### Technical Assumptions
1. **Platform Support**: Built for both iOS and Android using React Native with Expo
2. **State Management**: Used React Context with useReducer for complex state management
3. **Persistence**: AsyncStorage for local data storage (no backend required)
4. **Navigation**: React Navigation for screen management
5. **Styling**: StyleSheet for consistent and performant styling
6. **Notifications**: Expo Notifications for timer alerts and halfway notifications

### UI/UX Assumptions
1. **Theme Support**: Light and dark mode with automatic theme switching
2. **Responsive Design**: Works on various screen sizes and orientations
3. **Accessibility**: Basic accessibility features included
4. **User Feedback**: Clear visual feedback for all user actions
5. **Intuitive Navigation**: Simple and clear navigation structure

### Feature Assumptions
1. **Timer Categories**: Predefined categories with option for custom categories
2. **Duration Input**: Both manual input and quick-select options for common durations
3. **Progress Tracking**: Visual progress bars and percentage indicators
4. **Bulk Operations**: Category-level bulk actions for efficiency
5. **History Management**: Comprehensive history tracking with export functionality
6. **Alert System**: Halfway point notifications for better user experience

### Data Assumptions
1. **Timer Structure**: Each timer includes name, duration, category, status, and remaining time
2. **History Structure**: Completed timers include name, category, duration, and completion time
3. **Category System**: Flexible category system with predefined and custom options
4. **Persistence Strategy**: Local storage with automatic save/load functionality

### Performance Assumptions
1. **Timer Accuracy**: setInterval-based timing with 1-second precision
2. **Memory Management**: Proper cleanup of intervals and event listeners
3. **State Updates**: Efficient state updates using useReducer
4. **Rendering Optimization**: Memoized components and calculations where appropriate

## 📦 Dependencies

### Core Dependencies
- `expo`: ~50.0.0 - React Native framework
- `react`: 18.2.0 - React library
- `react-native`: 0.73.2 - React Native framework
- `@react-navigation/native`: ^6.1.9 - Navigation library
- `@react-navigation/stack`: ^6.3.20 - Stack navigation
- `@react-native-async-storage/async-storage`: 1.21.0 - Local storage
- `expo-notifications`: ~0.27.6 - Push notifications
- `expo-file-system`: ~16.0.5 - File system operations
- `react-native-web`: ~0.19.6 - Web support
- `react-dom`: 18.2.0 - Web DOM support
- `@expo/metro-runtime`: ~3.1.3 - Metro runtime for web

### Development Dependencies
- `@babel/core`: ^7.20.0 - JavaScript compiler

## 🎮 Usage

### Creating a Timer
1. Tap the "+ Add Timer" button on the home screen
2. Enter a timer name
3. Set the duration (use quick-select or enter manually)
4. Choose a category or create a custom one
5. Tap "Create Timer"

### Managing Timers
- **Start**: Tap the "Start" button to begin countdown
- **Pause**: Tap "Pause" to pause the timer
- **Reset**: Tap "Reset" to return to original duration
- **Bulk Actions**: Use category-level buttons to control all timers in a category

### Viewing History
1. Tap the "History" button on the home screen
2. View completed timers grouped by date
3. Filter by category using the filter buttons
4. Export data using the "Export" button

### Theme Switching
- Tap the sun/moon icon in the header to toggle between light and dark themes

## 🔧 Troubleshooting

### Common Issues

1. **Web version not loading**
   - Make sure you pressed 'w' in the terminal
   - Try refreshing the browser page
   - Check if the development server is running

2. **History button not visible**
   - Scroll down to see all buttons
   - Refresh the app by pressing 'r' in terminal
   - Check browser console for errors (F12)

3. **Notifications not working**
   - Grant notification permissions when prompted
   - Check device settings for app permissions

4. **App crashes or errors**
   - Restart the development server: `npm start`
   - Clear browser cache if using web version
   - Check terminal for error messages

### APK Build Issues

1. **EAS build fails**
   - Create Expo account at https://expo.dev
   - Login with: `eas login`
   - Try again: `eas build --platform android --profile preview`

2. **Local build fails**
   - Install Android Studio and set up Android SDK
   - Configure environment variables (ANDROID_HOME, JAVA_HOME)
   - Run: `expo eject` then `cd android && ./gradlew assembleRelease`

3. **APK installation fails**
   - Enable "Install from unknown sources" on Android device
   - Check if APK is compatible with your Android version
   - Try downloading APK again

### Getting Help

If you encounter issues:
1. Check the terminal logs for error messages
2. Try refreshing the app (press 'r' in terminal)
3. Restart the development server
4. Clear browser cache if using web version
5. For APK issues, check the build logs and error messages

## 🚀 Future Enhancements

Potential features for future versions:
- Cloud synchronization
- Timer templates
- Advanced statistics and analytics
- Social features (sharing timers)
- Custom notification sounds
- Timer chains and sequences
- Integration with calendar apps
- Widget support for quick access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏷️ GitHub Repository & Releases

### Repository Setup
1. **Create GitHub repository** named `healthflex-timer-app`
2. **Upload source code** using git commands or GitHub Desktop
3. **Create release** with APK file attached

### Creating GitHub Release
1. Go to repository → **Releases** → **Create new release**
2. **Tag version**: `v1.0.0`
3. **Release title**: `HealthFlex Timer v1.0.0`
4. **Upload APK file** to the release
5. **Add description** with features and installation instructions

### Repository Structure
```
healthflex-timer-app/
├── README.md              # This documentation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── eas.json              # EAS build configuration
├── babel.config.js       # Babel configuration
├── .gitignore           # Git ignore rules
├── GITHUB_SETUP.md      # Detailed GitHub setup guide
└── src/                 # Source code
    ├── components/      # UI components
    ├── context/         # State management
    ├── screens/         # App screens
    └── utils/           # Utility functions
```

## 📞 Support

For support or questions:
- Open an issue in the repository
- Check the troubleshooting section above
- Review the documentation

## 🙏 Acknowledgments

- Built with React Native and Expo
- Icons and UI components inspired by modern design principles
- Timer logic optimized for performance and accuracy

---

**Made with ❤️ for productivity and time management**