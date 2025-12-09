<div align="center">

# 🕉️ SVARAM

### *Preserving Ancient Wisdom Through Modern Technology*

[![SIH 2025](https://img.shields.io/badge/SIH-2024-orange?style=for-the-badge)](https://sih.gov.in/)
[![Smart India Hackathon](https://img.shields.io/badge/Smart_India-Hackathon-blue?style=for-the-badge)](https://sih.gov.in/)
[![Team Pravartak](https://img.shields.io/badge/Team-Pravartak-green?style=for-the-badge)]()

**A comprehensive Sanskrit learning ecosystem featuring Chandas (Prosody) analysis, LMS, AI-powered chatbot, and gamified learning experiences.**

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Team](#-team)

</div>

---

## 📖 About SVARAM

**SVARAM** (Sanskrit Vedic Ancient Rhythms & Metrics) is an innovative digital platform designed to revive and promote the study of Sanskrit prosody (Chandas). Built for the **Smart India Hackathon 2025**, this platform combines ancient wisdom with cutting-edge technology to create an immersive learning experience.

### 🎯 Mission
To make Sanskrit learning accessible, engaging, and scientifically rigorous through AI-powered tools, gamification, and a comprehensive learning management system.

---

## ✨ Features

### 🎓 **Learning Management System (LMS)**
- **Guru Portal**: Create and manage comprehensive Sanskrit courses
- **Student Portal**: Access structured learning paths with progress tracking
- **Course Hierarchy**: Units → Lessons → Lectures with rich multimedia content
- **Admin Dashboard**: Complete platform management and analytics
- **Certificate Generation**: Automated certificates upon course completion

### 🎵 **Chandas (Prosody) Analysis**
- **AI-Powered Detection**: Automatic identification of Sanskrit meters (Anushtup, Gayatri, Indravajra, etc.)
- **Pattern Recognition**: Advanced syllable and rhythm analysis
- **Audio Processing**: Real-time audio analysis for pronunciation guidance
- **Karaoke Mode**: Interactive singing with visual feedback

### 🤖 **AI Chatbot Assistant**
- **Multi-lingual Support**: English, Hindi, Sanskrit
- **Context-Aware**: Answers questions about shlokas, meanings, and philosophy
- **Voice Interaction**: Text-to-speech and speech-to-text capabilities
- **24/7 Learning Support**: Always available for doubts and queries

### 🎮 **Gamification & Engagement**
- **Challenge System**: Daily, weekly, and special challenges
- **Leaderboards**: Real-time rankings with performance metrics
- **Badges & Achievements**: Unlock rewards for learning milestones
- **Streak Tracking**: Maintain learning consistency with streak counters
- **Points & Rewards**: Earn points for activities and redeem benefits

### 👥 **Community Features**
- **Discussion Forums**: Topic-based discussions and Q&A
- **Study Groups**: Collaborative learning spaces
- **Peer Reviews**: Share and review translations
- **Social Sharing**: Share achievements and learning progress

### 🌍 **Multi-Language Support**
- **Interface Languages**: English, Hindi, Sanskrit, Marathi, Tamil, Telugu
- **Translation System**: i18n integration across all platforms
- **Content Localization**: Culturally adapted content delivery

---

## 🏗️ Architecture

### 🔧 Technology Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend Web** | React 19, Vite, TailwindCSS, Framer Motion |
| **Mobile App** | React Native, Expo 54, NativeWind |
| **Admin Portal** | React, TypeScript, Material-UI |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **AI/ML** | TensorFlow, OpenAI API, Natural Language Processing |
| **Cloud** | Cloudinary (Media), MongoDB Atlas (Database) |
| **Auth** | JWT, bcrypt, Google OAuth |
| **Payments** | Razorpay Integration |

</div>

### 📁 Project Structure

```
SVARAM/
├── 📱 Mobile-App/           # React Native Expo mobile application
│   ├── app/                 # Expo Router screens
│   ├── components/          # Reusable UI components
│   ├── locales/             # Multi-language translations
│   └── services/            # API integration & services
│
├── 🌐 Website/              # User web application (React + Vite)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route pages
│   │   └── services/        # API services
│   └── public/              # Static assets
│
├── 👨‍💼 Admin/               # Admin dashboard
│   └── svaram-admin-dashboard/
│       ├── src/
│       │   ├── components/  # Admin UI components
│       │   ├── pages/       # Admin pages
│       │   └── contexts/    # State management
│       └── public/
│
├── ⚙️ Backend/              # Node.js Express server
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation, etc.
│   │   └── services/        # External services
│   ├── docs/                # API documentation
│   └── tests/               # Unit & integration tests
│
├── 📚 Docs/                 # Comprehensive documentation
│   ├── API-Reference.md
│   ├── Setup-Guide.md
│   └── Technical guides
│
├── 🎵 ShlokaAudios/         # Audio resources
│   └── Heal_Audio/          # Meditation & healing shlokas
│
└── 🔤 Fonts/                # Sanskrit & Devanagari fonts
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **npm** or **yarn**
- **Expo CLI** (for mobile app)
- **Git**

### 🔥 One-Command Setup

```bash
# Clone the repository
git clone https://github.com/pravartak01/SIH_PRAVARTAK_SVARAM.git
cd SIH_PRAVARTAK_SVARAM

# Install all dependencies
npm install

# Set up environment variables (copy and configure)
cp Backend/.env.example Backend/.env

# Start development servers
npm run dev
```

### 📦 Individual Module Setup

#### **Backend Server**
```bash
cd Backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### **Website (User Portal)**
```bash
cd Website
npm install
npm run dev
# Runs on http://localhost:5173
```

#### **Mobile App**
```bash
cd Mobile-App
npm install
npx expo start
# Scan QR code with Expo Go app
```

#### **Admin Dashboard**
```bash
cd Admin/svaram-admin-dashboard
npm install
npm start
# Runs on http://localhost:3000
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the `Backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/svaram

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OpenAI (Chatbot)
OPENAI_API_KEY=your-openai-api-key

# Admin Credentials
ADMIN_EMAIL=admin@svaram.com
ADMIN_PASSWORD=secure-password

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

## 📚 Documentation

### 📖 Available Guides

| Document | Description |
|----------|-------------|
| [Setup Guide](./Docs/Setup-Guide.md) | Complete installation and configuration |
| [API Reference](./Docs/API-Reference.md) | RESTful API endpoints documentation |
| [LMS Requirements](./Docs/LMS-Requirements-Documentation.md) | Learning Management System specs |
| [Backend Authentication](./Docs/Backend-Authentication-Implementation.md) | Auth system implementation |
| [Translation Guide](./Mobile-App/COMPLETE_TRANSLATION_GUIDE.md) | Multi-language setup |
| [Chatbot README](./Mobile-App/CHATBOT_README.md) | AI assistant implementation |

### 🔗 Quick Links

- **Backend Documentation**: [Backend/docs/](./Backend/docs/)
- **Phase 1 Docs**: [PHASE1_DOCUMENTATION.md](./Backend/docs/PHASE1_DOCUMENTATION.md)
- **Phase 2 Architecture**: [PHASE2_ARCHITECTURE.md](./Backend/docs/PHASE2_ARCHITECTURE.md)
- **Phase 3 Completion**: [PHASE3_COMPLETION.md](./Backend/docs/PHASE3_COMPLETION.md)
- **API Routes**: [COMPLETE_ROUTES_LIST.md](./Backend/docs/COMPLETE_ROUTES_LIST.md)

---

## 🎮 Features in Detail

### **User Roles & Capabilities**

#### 👨‍🎓 **Students**
- Browse and enroll in Sanskrit courses
- Track learning progress with analytics
- Participate in challenges and earn badges
- Access AI chatbot for instant help
- Practice with karaoke mode
- Join community discussions

#### 👨‍🏫 **Gurus (Instructors)**
- Create comprehensive course content
- Upload multimedia lectures (video, audio, text)
- Track student progress and engagement
- Manage course pricing and enrollment
- Earn revenue from paid courses
- Receive detailed analytics

#### 👨‍💼 **Admins**
- Platform-wide analytics dashboard
- User management (approve gurus, manage students)
- Content moderation and quality control
- Challenge system management
- Certificate template customization
- Payment and commission tracking

---

## 🎯 API Endpoints

### **Authentication**
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/google            - Google OAuth
GET    /api/auth/verify-email      - Email verification
POST   /api/auth/forgot-password   - Password reset request
```

### **Courses**
```
GET    /api/courses                - List all courses
POST   /api/courses                - Create course (Guru)
GET    /api/courses/:id            - Get course details
PUT    /api/courses/:id            - Update course
DELETE /api/courses/:id            - Delete course
POST   /api/courses/:id/enroll     - Enroll in course
```

### **Challenges**
```
GET    /api/challenges             - List active challenges
POST   /api/challenges/:id/submit  - Submit challenge attempt
GET    /api/leaderboard            - Global leaderboard
GET    /api/user/achievements      - User badges & achievements
```

### **Community**
```
GET    /api/community/posts        - List community posts
POST   /api/community/posts        - Create post
POST   /api/community/posts/:id/comment - Add comment
POST   /api/community/posts/:id/like    - Like post
```

*Full API documentation: [API-Reference.md](./Docs/API-Reference.md)*

---

## 🧪 Testing

### Run Tests

```bash
cd Backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

### Test Coverage
- ✅ Unit Tests: Models, Controllers, Utilities
- ✅ Integration Tests: API Endpoints, Authentication
- ✅ Challenge System Tests
- ✅ Database Tests

---

## 🎨 Design Philosophy

### **UI/UX Principles**
- **Ancient Aesthetics**: Sanskrit-inspired design with modern minimalism
- **Responsive**: Seamless experience across devices
- **Accessible**: WCAG 2.1 AA compliant
- **Intuitive**: User-friendly navigation for all age groups
- **Cultural**: Respects traditional Sanskrit learning methods

### **Color Palette**
- **Primary**: Saffron (#FF9933) - Represents energy and purity
- **Secondary**: Deep Blue (#000080) - Wisdom and knowledge
- **Accent**: Gold (#FFD700) - Achievement and excellence
- **Backgrounds**: Cream (#F5F5DC) - Peaceful learning environment

---

## 🌟 Key Highlights

### **Sanskrit Prosody Analysis**
- Supports 15+ Chandas patterns (Anushtup, Gayatri, Indravajra, Upendravajra, etc.)
- Real-time syllable counting and pattern matching
- Visual representation of meter structures
- Audio pronunciation guides

### **Gamification Engine**
- **Daily Challenges**: Complete verses, pronunciation tests
- **Weekly Competitions**: Leaderboard rankings
- **Achievements**: 50+ badges to unlock
- **Streaks**: Maintain learning consistency
- **Points System**: Redeem for premium content

### **AI-Powered Learning**
- **Natural Language Processing**: Understands context and intent
- **Personalized Recommendations**: Suggests relevant content
- **Progress Prediction**: Estimates learning trajectory
- **Adaptive Difficulty**: Adjusts based on performance

---

## 📱 Mobile App Features

### **Native Capabilities**
- 📴 **Offline Mode**: Download content for offline learning
- 🔊 **Audio Playback**: High-quality audio lessons
- 📲 **Push Notifications**: Daily reminders and updates
- 📷 **Camera Integration**: Scan Sanskrit texts
- 🎤 **Voice Recording**: Practice pronunciation
- 📊 **Progress Tracking**: Visual learning analytics

### **Multi-Language Interface**
Available in: English, हिंदी, संस्कृत, मराठी, தமிழ், తెలుగు

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Password Hashing**: bcrypt encryption
- ✅ **Input Validation**: Prevents SQL injection & XSS
- ✅ **Rate Limiting**: API abuse prevention
- ✅ **CORS Protection**: Controlled cross-origin requests
- ✅ **Helmet.js**: Security headers
- ✅ **Environment Variables**: Sensitive data protection

---

## 🚧 Roadmap

### **Phase 4** (Upcoming)
- [ ] Advanced AI voice analysis for pronunciation
- [ ] AR/VR Sanskrit learning experiences
- [ ] Live guru-student video sessions
- [ ] Collaborative translation projects
- [ ] Sanskrit text OCR from images
- [ ] Integration with educational institutions

### **Future Enhancements**
- [ ] Desktop application (Electron)
- [ ] Browser extension for inline translations
- [ ] Smart speaker integration (Alexa, Google Home)
- [ ] Blockchain certificates (NFT)
- [ ] Marketplace for learning resources

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
1. 🐛 **Report Bugs**: Submit issues with detailed descriptions
2. 💡 **Suggest Features**: Share your ideas for improvements
3. 📝 **Improve Documentation**: Help us make docs clearer
4. 💻 **Code Contributions**: Submit pull requests
5. 🌍 **Translations**: Add support for more languages

### **Development Setup**
```bash
# Fork the repository
git clone https://github.com/YOUR-USERNAME/SIH_PRAVARTAK_SVARAM.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Create Pull Request
```

### **Code Standards**
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 👥 Team Pravartak

<div align="center">

**Smart India Hackathon 2024 - Problem Statement #1234**

*Building the future of Sanskrit education with passion and innovation*

</div>

### Team Members
- **Project Lead**: Coordination and architecture
- **Full-Stack Developers**: Backend, Frontend, Mobile
- **UI/UX Designers**: User experience and interface
- **AI/ML Engineers**: Chatbot and analysis systems
- **QA Engineers**: Testing and quality assurance

---

## 📄 License

This project is developed for **Smart India Hackathon 2024** and is currently under private development.

**Copyright © 2024 Team Pravartak. All Rights Reserved.**

---

## 📞 Contact & Support

### **Get Help**
- 📧 **Email**: pravartak99@gmail.com

### **Report Issues**
Found a bug or have suggestions? [Open an issue](https://github.com/pravartak01/SIH_PRAVARTAK_SVARAM/issues)

---

## 🙏 Acknowledgments

### **Special Thanks**
- **Smart India Hackathon** for the opportunity
- **Sanskrit scholars** for domain expertise
- **Open-source community** for amazing tools
- **Beta testers** for valuable feedback

### **Technologies We Love**
- React & React Native for incredible UX
- Node.js for robust backend
- MongoDB for flexible data storage
- OpenAI for AI capabilities
- Expo for simplified mobile development

---

<div align="center">

## ⭐ Show Your Support

If you find this project useful, please consider giving it a ⭐ on GitHub!

**Made with ❤️ and संस्कृत by Team Pravartak**

---

### 🕉️ ॐ शान्ति: शान्ति: शान्ति: 🕉️

*"यतो धर्मस्ततो जयः" - Where there is righteousness, there is victory*

[↑ Back to Top](#️-svaram---sanskrit-learning-platform)

</div>
