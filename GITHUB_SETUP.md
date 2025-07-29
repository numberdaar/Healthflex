# GitHub Repository Setup Guide

## 🚀 **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and sign in to your account
2. **Click "New repository"** or the "+" icon
3. **Repository name**: `healthflex-timer-app`
4. **Description**: `A comprehensive React Native timer application with categories, progress visualization, and history tracking`
5. **Make it Public** (or Private if preferred)
6. **Don't initialize** with README (we already have one)
7. **Click "Create repository"**

## 📁 **Step 2: Upload Source Code**

### Option A: Using Git Commands (Recommended)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HealthFlex Timer App"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/healthflex-timer-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Using GitHub Desktop

1. **Download GitHub Desktop** from https://desktop.github.com/
2. **Clone the repository** you just created
3. **Copy all project files** to the cloned folder
4. **Commit and push** through GitHub Desktop

## 📦 **Step 3: Create APK Build**

### Method 1: Using Expo EAS Build (Cloud)

1. **Install EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure the project**:
   ```bash
   eas build:configure
   ```

4. **Build APK**:
   ```bash
   eas build --platform android --profile preview
   ```

### Method 2: Using Expo Classic Build (Local)

1. **Install Expo CLI**:
   ```bash
   npm install -g @expo/cli
   ```

2. **Build APK**:
   ```bash
   expo build:android -t apk
   ```

### Method 3: Using React Native CLI (Advanced)

1. **Eject from Expo**:
   ```bash
   expo eject
   ```

2. **Build APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## 🏷️ **Step 4: Create GitHub Release**

1. **Go to your repository** on GitHub
2. **Click "Releases"** on the right side
3. **Click "Create a new release"**
4. **Tag version**: `v1.0.0`
5. **Release title**: `HealthFlex Timer v1.0.0`
6. **Description**:
   ```
   ## 🎉 HealthFlex Timer v1.0.0
   
   ### Features
   - ✅ Multiple customizable timers
   - ✅ Category-based grouping and filtering
   - ✅ Progress visualization with bars and percentages
   - ✅ Bulk actions for category management
   - ✅ Timer history with export functionality
   - ✅ Light/dark theme support
   - ✅ Halfway point and completion notifications
   - ✅ Local data persistence
   - ✅ Responsive design
   
   ### Installation
   - Download the APK file below
   - Install on your Android device
   - Grant notification permissions when prompted
   
   ### Technical Details
   - Built with React Native and Expo
   - Uses AsyncStorage for local data
   - Supports Android 5.0+ (API level 21+)
   - File size: ~15MB
   ```

7. **Upload APK file** by dragging it to the release
8. **Click "Publish release"**

## 📋 **Step 5: Repository Structure**

Your repository should look like this:

```
healthflex-timer-app/
├── README.md
├── package.json
├── app.json
├── eas.json
├── babel.config.js
├── .gitignore
├── GITHUB_SETUP.md
├── src/
│   ├── components/
│   │   ├── Timer.js
│   │   └── CategoryGroup.js
│   ├── context/
│   │   ├── ThemeContext.js
│   │   └── TimerContext.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── AddTimerScreen.js
│   │   └── HistoryScreen.js
│   └── utils/
│       ├── timeUtils.js
│       └── notificationUtils.js
└── assets/
```

## 🔧 **Step 6: Troubleshooting**

### If EAS Build fails:
1. **Create Expo account** at https://expo.dev
2. **Login**: `eas login`
3. **Try again**: `eas build --platform android --profile preview`

### If local build fails:
1. **Install Android Studio**
2. **Set up Android SDK**
3. **Configure environment variables**

### Alternative: Use Expo Go
- Share the QR code from `npm start`
- Users can test the app using Expo Go app

## 📞 **Support**

If you encounter issues:
1. Check the README.md troubleshooting section
2. Open an issue in the GitHub repository
3. Contact the development team

---

**Good luck with your submission! 🚀** 