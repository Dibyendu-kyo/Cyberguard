# 🛡️ Cyberguard - Gamified Cybersecurity Awareness Battle

A fun and interactive cybersecurity quiz game that helps users learn about digital security through engaging gameplay. Battle against a virtual hacker while answering cybersecurity questions to improve your digital defense skills!

## 🎮 Features

- **Interactive Battle System**: Fight against a virtual hacker with health bars
- **Progressive Difficulty**: 3 rounds with increasing difficulty levels
- **Real-time Leaderboard**: Compete with other players using Google authentication
- **Sound Effects**: Immersive audio feedback for correct/wrong answers
- **Anime Avatars**: Cool random anime-style profile pictures
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **AI-Powered Questions**: Dynamic question generation using Google Gemini AI

## 🚀 Live Demo

[Add your deployed URL here]

## 📱 Screenshots

[Add screenshots of your game here]

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **CSS3** - Styling with cyberpunk theme
- **Firebase Auth** - Google authentication
- **Firestore** - Real-time leaderboard database
- **Axios** - API communication

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Google Gemini AI** - Question generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Google Firebase Account** (for authentication and database)
- **Google Gemini API Key** (for AI question generation)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cyberguard.git
cd cyberguard
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Environment Variables Setup

#### Frontend Environment (.env in frontend folder)
Create `frontend/.env` file:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Backend Environment (.env in backend folder)
Create `backend/.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** with Google provider
4. Enable **Firestore Database**
5. Copy your config keys to the frontend `.env` file

### 5. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your backend `.env` file

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

2. **Start the Frontend** (in a new terminal):
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# The build folder will contain the production-ready files
```

## 🎯 How to Play

1. **Sign In**: Use your Google account to sign in
2. **Start Game**: Click "Play the Game!" button
3. **Answer Questions**: Choose the correct answer from 4 options
4. **Battle System**: 
   - Correct answers damage the hacker
   - Wrong answers damage you
   - First to lose all health loses the game
5. **Progress**: Complete 5 questions per round
6. **Leaderboard**: Your high scores are saved and displayed

## 🏆 Game Rules

- **Health**: Both you and the hacker start with 5 health points
- **Scoring**: +10 points for each correct answer
- **Rounds**: 3 rounds with increasing difficulty
- **Questions**: 5 questions per round
- **Victory**: Defeat the hacker by answering correctly
- **Defeat**: Lose all health and the hacker wins

## 🔧 Configuration

### Firestore Database Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firebase Authentication
- Enable Google Sign-In in Firebase Console
- Add your domain to authorized domains

## 📁 Project Structure

```
cyberguard/
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   ├── sound/
│   │   └── index.html
│   ├── src/
│   │   ├── images/
│   │   ├── App.js
│   │   ├── firebase.js
│   │   └── styles.css
│   └── package.json
├── backend/
│   ├── routes/
│   │   └── quiz.js
│   ├── server.js
│   ├── gemini.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for dynamic question generation
- **Firebase** for authentication and database services
- **React Community** for the amazing framework
- **Cybersecurity Community** for educational content inspiration

## 📞 Support

If you have any questions or need help setting up the project:

1. Check the [Issues](https://github.com/yourusername/cyberguard/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your setup and the issue

## 🔒 Security

This project is designed to teach cybersecurity awareness. If you find any security vulnerabilities, please report them responsibly by creating a private issue or contacting the maintainers directly.

---

**Made with ❤️ for cybersecurity education**

*Help others stay safe online by sharing this game!*