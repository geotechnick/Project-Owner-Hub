# Project Owner Hub

A comprehensive web-based platform for infrastructure and construction project owners featuring project management, cost estimation, grant discovery, and enhanced data analytics through government APIs.

## 🎯 **Current Status: Backend Complete with Data.gov Integrations**

✅ **Phase 1 Complete** - Project setup, dependencies installed  
✅ **Phase 2 Complete** - Database configured with Supabase (5 tables)  
✅ **Phase 3 Complete** - Backend API development & functional testing  
✅ **Phase 3+ Complete** - Data.gov integrations with 4 government data sources  
🔄 **Phase 4 Next** - Frontend React components development  

**System Status:**
- ✅ Backend API: http://localhost:3001 (Fully tested & operational)
- ✅ Data Sources: EPA, Census Bureau, USDA APIs integrated
- ✅ Frontend: http://localhost:3000 (React app ready for development)
- ✅ Database: Connected to Supabase with authentication system

## 🚀 **Quick Start Guide**

### 1. **System Requirements**

- Node.js 16+ and npm
- Git for version control
- Text editor (VS Code recommended)
- Modern web browser

### 2. **Get the Code**

```bash
# Clone the repository
git clone https://github.com/yourusername/project-owner-hub
cd project-owner-hub
```

### 3. **Backend Setup (Terminal 1)**

```bash
# Navigate to backend and install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
```

**Edit `backend/.env` with your credentials:**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_32_character_secret_key
NODE_ENV=development
PORT=3001

# Optional: Enhanced data.gov functionality
CENSUS_API_KEY=your_census_api_key
USDA_API_KEY=your_usda_api_key
```

```bash
# Start the backend server
npm run dev
```

✅ **Backend running at:** http://localhost:3001

### 4. **Frontend Setup (Terminal 2)**

```bash
# Open new terminal, navigate to frontend
cd frontend
npm install

# Set up environment variables
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

```bash
# Start the frontend development server
npm start
```

✅ **Frontend running at:** http://localhost:3000

### 5. **Database Setup**

1. **Create Supabase Account:**
   - Go to [supabase.com](https://supabase.com) and create free account
   - Create new project (choose free tier)
   - Note your Project URL and API Key from Settings > API

2. **Run Database Schema:**
   - Go to Supabase SQL Editor
   - Copy and run the schema from `CLAUDE.md` (lines 89-158)
   - This creates 5 tables: users, projects, cost_estimates, bookmarked_grants, default_rates

### 6. **Verify Setup**

**Test Backend API:**
```bash
# Health check
curl http://localhost:3001/api/health

# Test data sources (public endpoint)
curl http://localhost:3001/api/data/sources
```

**Expected Response:**
```json
{"status":"OK","service":"Project Owner Hub API"}
```

## 🔧 **How to Use the System**

### **User Registration & Login**

1. **Register a New Account:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "password":"your-password",
    "organizationName":"Your Organization",
    "contactInfo":{"phone":"555-1234"}
  }'
```

2. **Login to Get Token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "password":"your-password"
  }'
```

**Save the returned token - you'll need it for authenticated requests.**

### **Project Management**

1. **Create a Project:**
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"Highway Bridge Repair",
    "description":"Repair and maintenance of downtown bridge",
    "sector":"infrastructure",
    "location_address":"123 Main St, Springfield, IL",
    "estimated_size":"large",
    "labor_hours":500
  }'
```

2. **List Your Projects:**
```bash
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Cost Estimation**

1. **Get Available Rates:**
```bash
curl http://localhost:3001/api/costs/rates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

2. **Generate Cost Estimate:**
```bash
curl -X POST http://localhost:3001/api/costs/PROJECT_ID/estimate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "laborHours":500,
    "materialCosts":10000,
    "equipmentCosts":5000
  }'
```

### **Grant Discovery**

1. **Search for Grants:**
```bash
curl -X POST http://localhost:3001/api/grants/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "keyword":"infrastructure",
    "ownerType":"02",
    "fundingAgency":"DOT",
    "projectType":"EN"
  }'
```

### **Data Analytics (NEW)**

1. **View Available Data Sources:**
```bash
curl http://localhost:3001/api/data/sources
```

2. **Get Demographic Data:**
```bash
curl "http://localhost:3001/api/data/demographics?state=IL&county=Cook" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Comprehensive Site Analysis:**
```bash
curl -X POST http://localhost:3001/api/data/site-analysis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "location":{"state":"IL","county":"Cook","address":"Chicago, IL"},
    "projectType":"urban_planning"
  }'
```

4. **Enhanced Grant Matching:**
```bash
curl -X POST http://localhost:3001/api/data/enhance-grants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "location":{"state":"IL","county":"Cook"},
    "sector":"infrastructure",
    "name":"Bridge Project"
  }'
```

## 📊 **Available Data Sources**

**Government APIs Integrated:**

1. **EPA Walkability Index**
   - **Use Case:** Urban planning and infrastructure site analysis
   - **Data:** Walkability scores, pedestrian infrastructure
   - **Project Types:** Urban planning, infrastructure

2. **Census Bureau Population Estimates**
   - **Use Case:** Demographic analysis for community development
   - **Data:** Population, demographic breakdowns
   - **Project Types:** Community development, infrastructure

3. **USDA Quick Stats Agricultural Database**
   - **Use Case:** Agricultural and rural development projects
   - **Data:** Crop statistics, agricultural economics
   - **Project Types:** Agricultural, rural development

4. **USDA Food Environment Atlas**
   - **Use Case:** Community development and public health
   - **Data:** Food access, nutrition environment
   - **Project Types:** Community development, public health

## 🏗️ **Features**

### **Core Functionality**
- 🏗️ **Project Management**: Create, edit, and track infrastructure projects
- 💰 **Cost Estimation**: Automated calculations with customizable labor/material rates
- 🎯 **Grant Discovery**: Search Grants.gov with advanced filtering options
- 🔐 **User Authentication**: Secure JWT-based user system
- 📱 **API-First Design**: RESTful API ready for mobile apps

### **Enhanced Analytics (NEW)**
- 📊 **Site Analysis**: Multi-source government data analysis based on location and project type
- 🗺️ **Demographic Insights**: Census data integration for community impact assessment
- 🌾 **Agricultural Data**: USDA statistics for rural and farming projects
- 🚶 **Walkability Analysis**: EPA data for urban planning and accessibility
- 🎯 **Smart Grant Matching**: Enhanced grant discovery using demographic and economic indicators

## 🛠️ **Tech Stack**

- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: PostgreSQL (Supabase free tier)
- **Frontend**: React, Material-UI Components, Axios
- **External APIs**: Grants.gov, EPA, Census Bureau, USDA, Google Maps
- **Deployment**: Vercel (free tier)
- **Version Control**: Git/GitHub

## 📁 **Project Structure**

```
project-owner-hub/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── middleware/        # JWT auth, validation
│   │   ├── routes/           # API endpoints
│   │   │   ├── auth.js       # Login/register
│   │   │   ├── projects.js   # Project CRUD
│   │   │   ├── grants.js     # Grant search
│   │   │   ├── costs.js      # Cost estimation
│   │   │   └── data.js       # Data.gov integrations (NEW)
│   │   ├── services/         # External API clients
│   │   │   ├── supabase.js   # Database client
│   │   │   ├── grantsGov.js  # Grants.gov API
│   │   │   └── dataGov.js    # Government data APIs (NEW)
│   │   └── app.js            # Express app setup
│   └── server.js             # Server entry point
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Page components
│   │   └── services/         # API clients
│   └── public/               # Static assets
├── .env.example              # Environment template
├── CLAUDE.md                 # Complete build guide
└── README.md                 # This file
```

## 🔑 **API Reference**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Projects**
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### **Grants**
- `POST /api/grants/search` - Search grants with filters
- `GET /api/grants/details/:opportunityId` - Get grant details

### **Cost Estimation**
- `GET /api/costs/rates` - Get default rates
- `POST /api/costs/:projectId/estimate` - Generate cost estimate

### **Data Analytics (NEW)**
- `GET /api/data/sources` - List available data sources (public)
- `GET /api/data/walkability?location=ADDRESS` - EPA walkability data
- `GET /api/data/demographics?state=ST&county=COUNTY` - Census data
- `GET /api/data/agricultural?commodity=CROP&state=ST` - USDA agricultural data
- `POST /api/data/site-analysis` - Comprehensive location analysis
- `POST /api/data/enhance-grants` - Enhanced grant matching

## 🧪 **Testing & Verification**

### **Backend API Testing**

All endpoints have been functionally tested:

```bash
# Health check
curl http://localhost:3001/api/health
# Response: {"status":"OK","service":"Project Owner Hub API"}

# Data sources
curl http://localhost:3001/api/data/sources
# Response: Complete list of integrated government data sources

# Authentication test
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Response: JWT token and user data

# Protected route test
curl http://localhost:3001/api/projects
# Response: {"error":"Access denied. No token provided."}
```

**Test Results:**
- ✅ Authentication system (registration/login)
- ✅ Protected routes with JWT middleware
- ✅ Database connectivity confirmed
- ✅ Grant search API integration
- ✅ Cost estimation with database rates
- ✅ Data.gov API integrations operational

## 🌍 **Getting API Keys (Optional)**

### **Free Government API Keys**

1. **Census Bureau API** (Optional - enhances demographic data)
   - Go to: https://api.census.gov/data/key_signup.html
   - Free, instant approval
   - Add to `backend/.env` as `CENSUS_API_KEY`

2. **USDA NASS Quick Stats API** (Optional - for agricultural data)
   - Go to: https://quickstats.nass.usda.gov/api/
   - Free registration required
   - Add to `backend/.env` as `USDA_API_KEY`

3. **Google Maps API** (Optional - for frontend maps)
   - Go to: https://console.cloud.google.com
   - Enable Maps JavaScript API
   - $200 free monthly credit (~28,000 map loads)
   - Add to `frontend/.env` as `REACT_APP_GOOGLE_MAPS_KEY`

**Note:** The system works without these API keys, but they enhance functionality.

## 🚀 **Deploy to Production**

### **Free Deployment with Vercel**

```bash
# Install Vercel CLI (one-time setup)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Set environment variables in Vercel dashboard
# - SUPABASE_URL
# - SUPABASE_ANON_KEY  
# - JWT_SECRET
# - CENSUS_API_KEY (optional)
# - USDA_API_KEY (optional)
```

**Your app will be live at:** `https://your-project-name.vercel.app`

## 📚 **Additional Documentation**

- **Complete Build Guide**: [CLAUDE.md](./CLAUDE.md) - Comprehensive step-by-step instructions
- **Database Schema**: Lines 89-158 in CLAUDE.md
- **API Reference**: Lines 777-936 in CLAUDE.md  
- **Deployment Guide**: Lines 634-684 in CLAUDE.md
- **Troubleshooting**: Lines 894-923 in CLAUDE.md

## 🛠️ **Development Commands**

```bash
# Start backend development server
cd backend && npm run dev

# Start frontend development server  
cd frontend && npm start

# Install new backend dependency
cd backend && npm install package-name

# Install new frontend dependency
cd frontend && npm install package-name

# Test all API endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/data/sources
```

## ⚡ **Performance & Limits**

### **Free Tier Limits:**
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Vercel**: 100GB bandwidth, 10GB storage, 32 serverless functions
- **Grants.gov**: 1000 requests/hour (no cost)
- **Google Maps**: $200 credit (~28,000 map loads/month)
- **Census API**: No official limit (reasonable use)
- **USDA API**: No official limit (reasonable use)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test locally
4. Commit changes: `git commit -m "Add feature description"`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.

## 💡 **Support**

- **Issues**: GitHub Issues for bug reports and feature requests
- **Documentation**: See CLAUDE.md for detailed technical documentation
- **API Testing**: Use the curl examples above to verify your setup

---

**Total Development Time**: ~3-4 hours from scratch to fully functional backend with data integrations. Frontend development is Phase 4.

**Ready for:** Local development, API integration testing, and production deployment.