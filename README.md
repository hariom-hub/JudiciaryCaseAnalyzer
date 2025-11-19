# ⚖️ Judiciary Case Analyzer

> AI-powered legal case management and analysis platform

A comprehensive web application designed for legal professionals to manage cases, analyze legal documents, and leverage artificial intelligence for legal research and predictions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [AI Providers](#-ai-providers)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### 📁 Case Management
- **Create and manage legal cases** with comprehensive details
- **Upload documents** (PDF, DOCX, DOC) with automatic text extraction
- **Track case timeline** with important dates and events
- **Organize with tags** and categories
- **Advanced search** and filtering capabilities
- **Case status tracking** (Active, Pending, Closed, etc.)

### 🤖 AI-Powered Analysis
- **Multiple AI Providers**: OpenAI GPT, Google Gemini, Groq
- **Analysis Types**:
  - Case Summary
  - Legal Issues Identification
  - Precedent Research
  - Outcome Prediction
  - Risk Assessment
  - Strategy Recommendations
- **Quality Scoring** and performance metrics
- **User feedback** and rating system

### 📊 Dashboard & Analytics
- **Real-time statistics** and case overview
- **AI provider status** monitoring
- **Recent activity** tracking
- **Performance metrics** for AI analyses
- **Usage analytics** and cost tracking

### 🎨 Modern User Interface
- **Professional design** tailored for legal professionals
- **Responsive layout** for desktop, tablet, and mobile
- **Dark/Light themes** support
- **Collapsible sidebar** for space optimization
- **Advanced search** with suggestions
- **Notifications system** for important updates

### 🔒 Security & Privacy
- **Confidential case handling**
- **Access level controls** (Public, Internal, Confidential, Restricted)
- **API key security** (stored server-side)
- **Data encryption** ready
- **Audit trail** for all actions

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: 
  - OpenAI API (GPT-3.5, GPT-4)
  - Google Gemini API
  - Groq API (Llama 3, Mixtral)
- **File Processing**: 
  - Multer (file uploads)
  - pdf-parse (PDF extraction)
  - mammoth (DOCX extraction)
- **Middleware**: CORS, dotenv

### Frontend
- **Library**: React.js (v18.2.0)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Custom CSS with modern design system
- **Icons**: Emoji-based iconography

### Database Schema
- **Cases**: Comprehensive case information with relationships
- **Analyses**: AI analysis results with structured data
- **Documents**: File metadata and references
- **Timeline**: Event tracking and history

---

## 📁 Project Structure

```
judiciary-analyzer/
├── backend/
│   ├── models/
│   │   ├── Case.js              # Case schema with validations
│   │   └── Analysis.js          # Analysis schema with metrics
│   ├── routes/
│   │   ├── cases.js             # Case CRUD operations
│   │   └── analysis.js          # AI analysis endpoints
│   ├── services/
│   │   ├── openaiService.js     # OpenAI integration
│   │   ├── geminiService.js     # Gemini integration
│   │   └── groqService.js       # Groq integration
│   ├── server.js                # Express server setup
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   │       ├── Header.jsx   # Navigation header
│   │   │       ├── Footer.jsx   # Footer with status
│   │   │       └── Sidebar.jsx  # Collapsible sidebar
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Dashboard page
│   │   │   ├── Cases.jsx        # Cases listing
│   │   │   └── CaseDetailPage.jsx # Case details
│   │   ├── App.js               # Main application
│   │   ├── App.css              # Global styles
│   │   └── index.js             # Entry point
│   ├── package.json             # Frontend dependencies
│   └── public/                  # Static assets
│
└── README.md                    # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Git** (for cloning the repository)

### API Keys Required
- **OpenAI API Key** (from [OpenAI Platform](https://platform.openai.com/))
- **Google Gemini API Key** (from [Google AI Studio](https://makersuite.google.com/))
- **Groq API Key** (from [Groq Console](https://console.groq.com/))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/judiciary-analyzer.git
cd judiciary-analyzer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Additional packages for file processing
npm install pdf-parse mammoth multer mongoose axios dotenv
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Additional packages (if needed)
npm install react-router-dom axios
```

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/judiciary-analyzer

# AI Provider API Keys
OPENAI_API_KEY=sk-your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
GROQ_API_KEY=gsk_your-groq-api-key-here

# Optional: Advanced Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=.pdf,.docx,.doc,.txt
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /path/to/data/directory

# MongoDB will run on mongodb://localhost:27017
```

**Option 2: MongoDB Atlas (Cloud)**
```bash
# Sign up at https://www.mongodb.com/cloud/atlas
# Create a cluster
# Get connection string
# Update MONGODB_URI in .env
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# React app running on http://localhost:3000
```

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve Application:**
```bash
cd backend
NODE_ENV=production npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## 📚 API Documentation

### Cases API

#### Get All Cases
```http
GET /api/cases
Query Parameters:
  - page: Page number (default: 1)
  - limit: Items per page (default: 10)
  - type: Case type filter
  - status: Case status filter
  - sort: Sort field (default: createdAt)
```

#### Get Single Case
```http
GET /api/cases/:id
```

#### Create Case
```http
POST /api/cases
Body: {
  "title": "Case Title",
  "caseType": "Civil",
  "caseText": "Case description...",
  "parties": {
    "plaintiff": "John Doe",
    "defendant": "Company Inc"
  }
}
```

#### Update Case
```http
PUT /api/cases/:id
Body: { /* fields to update */ }
```

#### Delete Case
```http
DELETE /api/cases/:id
```

#### Search Cases
```http
GET /api/cases/search/:query
```

### Analysis API

#### Create Analysis
```http
POST /api/analysis
Body: {
  "caseId": "case_id_here",
  "analysisType": "summary",
  "aiProvider": "openai",
  "model": "gpt-4"
}
```

#### Get Case Analyses
```http
GET /api/analysis/case/:caseId
Query Parameters:
  - type: Filter by analysis type
```

#### Get Single Analysis
```http
GET /api/analysis/:id
```

#### Batch Analysis
```http
POST /api/analysis/batch
Body: {
  "caseId": "case_id_here",
  "analysisTypes": ["summary", "legal_issues", "precedents"],
  "aiProvider": "openai"
}
```

---

## 🤖 AI Providers

### OpenAI GPT

**Models Available:**
- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-4` - Most capable model
- `gpt-4-turbo` - Enhanced performance

**Use Cases:**
- Complex legal reasoning
- Detailed case analysis
- Precedent research

### Google Gemini

**Models Available:**
- `gemini-pro` - Advanced reasoning
- `gemini-1.5-pro` - Enhanced capabilities

**Use Cases:**
- Multi-modal analysis
- Long context understanding
- Document analysis

### Groq

**Models Available:**
- `llama3-8b-8192` - Fast inference
- `llama3-70b-8192` - Better accuracy
- `mixtral-8x7b-32768` - Large context window

**Use Cases:**
- Real-time analysis
- Cost-effective processing
- Quick summaries

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard with case statistics and quick actions*

### Case Management
![Cases](./screenshots/cases.png)
*Advanced case management with search and filters*

### AI Analysis
![Analysis](./screenshots/analysis.png)
*AI-powered legal analysis with multiple providers*

### Case Details
![Details](./screenshots/case-detail.png)
*Comprehensive case view with timeline and documents*

---

## 🔑 Key Features Explained

### Document Upload & Processing
- Supports PDF, DOCX, DOC, and TXT files
- Maximum file size: 10MB
- Automatic text extraction using industry-standard libraries
- Preview and edit extracted content

### AI Analysis Engine
- Intelligent prompt engineering for legal context
- Structured result formatting
- Quality scoring and confidence levels
- Cost tracking and optimization

### Case Timeline
- Automatic event tracking
- Manual event addition
- Visual timeline representation
- Important date reminders

### Search & Filter
- Full-text search across cases
- Filter by type, status, priority
- Sort by various criteria
- Real-time results

---

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Ensure MongoDB is running
sudo systemctl start mongod

# Or for Mac with Homebrew
brew services start mongodb-community
```

**Port Already in Use:**
```bash
# Change PORT in .env file
# Or kill process using port
kill -9 $(lsof -t -i:5000)
```

**API Key Errors:**
- Verify API keys are correctly set in `.env`
- Ensure no extra spaces or quotes
- Check API key validity on provider websites

**File Upload Issues:**
- Check file size (max 10MB)
- Verify file type is supported
- Ensure proper permissions on upload directory

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💡 Roadmap

### Phase 1 (Current)
- ✅ Basic case management
- ✅ AI analysis integration
- ✅ Document upload
- ✅ Dashboard and analytics

### Phase 2 (Planned)
- 🔄 User authentication and authorization
- 🔄 Team collaboration features
- 🔄 Advanced document OCR
- 🔄 Email notifications
- 🔄 Calendar integration

### Phase 3 (Future)
- 📅 Mobile application
- 📅 Advanced AI models
- 📅 Court filing integration
- 📅 Video conferencing
- 📅 Blockchain verification

---

## 👥 Authors

**Hariom Singh Thakur**
- Legal Tech Enthusiast
- AI & Full-Stack Developer

---

## 🙏 Acknowledgments

- **OpenAI** for GPT models
- **Google** for Gemini AI
- **Groq** for ultra-fast inference
- **MongoDB** for database solution
- **React** team for excellent UI library
- Legal professionals who provided feedback and insights

---

## 📞 Support

For support, questions, or feedback:

- **Email**: support@judiciaryanalyzer.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/judiciary-analyzer/issues)
- **Documentation**: [Full Docs](https://docs.judiciaryanalyzer.com)
- **Community**: [Discord Server](https://discord.gg/judiciary-analyzer)

---

## 📊 Statistics

- **Total Lines of Code**: ~8,000+
- **Components**: 15+
- **API Endpoints**: 20+
- **Supported File Types**: 4
- **AI Providers**: 3
- **Analysis Types**: 12

---

## ⚠️ Disclaimer

This software is designed to assist legal professionals and should not be considered as a replacement for professional legal advice. Always consult with qualified legal counsel for important legal matters. The AI-generated analyses are based on patterns and may contain errors or inaccuracies.

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for the legal community**

© 2024 Judiciary Case Analyzer. All rights reserved.
