# 👀 Eye App

A macOS CLI tool and Web UI to help you practice eye exercises and take regular screen breaks.

## Features

- **CLI Timer**: Set a recurring timer to remind you to take breaks (e.g., the 20-20-20 rule).
- **macOS Notifications**: Native desktop alerts with exercise suggestions.
- **Visual Eye Exercises**: An interactive web-based visualizer with 5 different patterns (Infinity, Circle, Z-Pattern, Triangle, Cross).
- **Shuffle Session**: A 5-exercise randomized sequence to give your eyes a full workout.
- **Full-Screen Mode**: Immersive edge-to-edge animations for maximum muscle engagement.

> [!CAUTION]
> **Medical Disclaimer:** This application is intended for relaxation and relieving digital eye strain. It is not a medical device. These exercises are not a substitute for professional medical advice, diagnosis, or treatment. Always consult with an eye care professional if you experience persistent eye pain or vision changes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Eye-app.git
   cd Eye-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. (Optional) Link globally to use the `eye-app` command:
   ```bash
   npm link
   ```

## Usage

### Start the break timer
Starts a reminder every 20 minutes (default):
```bash
eye-app start --interval 20
```

### Launch Visual Exercises
Opens the interactive visualizer in your default browser:
```bash
eye-app ui
```

## How to Share Online

### 1. GitHub Repository
To share the code with others, create a new repository on GitHub and push these files:
```bash
git init
git add .
git commit -m "Initial commit: Eye App with CLI and Visual UI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Eye-app.git
git push -u origin main
```

### 2. Hosting the Visualizer Online
The visual exercise is built with static HTML/CSS/JS. You can host just the `src/public` folder online using **GitHub Pages**:
- Go to your repo settings on GitHub.
- Navigate to "Pages".
- Set the source to "Deploy from a branch" and select `main` (ensure your `index.html` is at the root or correctly linked).
- *Note: To make it work perfectly on GitHub Pages, you might want to move the contents of `src/public` to a `docs` folder or the root of a separate branch.*

## Development

Runs the test suite (Jest):
```bash
npm test
```

License: ISC
