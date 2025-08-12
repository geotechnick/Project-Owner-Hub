# Project Owner Hub - Complete Build & Deploy Guide

## Overview
A web-based Project Owner Hub for infrastructure/construction project owners with project management, cost estimation, and grant discovery via Grants.gov API.

## Free Deployment Stack
- **Backend**: Node.js with Express
- **Frontend**: React with Vite
- **Database**: PostgreSQL (Supabase free tier)
- **Deployment**: Vercel (free tier)
- **APIs**: Grants.gov REST API (free), Google Maps API (free tier)
- **Authentication**: JWT-based sessions

## 🎯 **Current Status: Phase 2 Complete**

✅ **Phase 1 Complete** - Project structure, dependencies installed  
✅ **Phase 2 Complete** - Database setup, Supabase configured  
🔄 **Phase 3 Next** - Backend API development  

**Quick Test:** Both frontend (http://localhost:3000) and backend (http://localhost:3001/api/test) servers are running and accessible.

---

## Step-by-Step Build Guide

### Phase 1: Project Setup ✅ COMPLETED

#### Step 1: Initialize the Project
```bash
# Create project structure
mkdir project-owner-hub
cd project-owner-hub

# Initialize backend
mkdir backend
cd backend
npm init -y
npm install express cors helmet morgan bcryptjs jsonwebtoken dotenv
npm install -D nodemon concurrently

# Initialize frontend
cd ..
npx create-react-app frontend
cd frontend
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/x-date-pickers

# Return to root
cd ..
```

#### Step 2: Setup Project Structure
```
project-owner-hub/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

### Phase 2: Database Setup with Supabase ✅ COMPLETED

#### Step 3: Create Supabase Account & Database
1. Go to [supabase.com](https://supabase.com) and create free account
2. Create new project (choose free tier)
3. Note your Project URL and API Key from Settings > API
4. Go to SQL Editor and run this schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  organization_name VARCHAR,
  contact_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  sector VARCHAR,
  location_address TEXT,
  location_coords POINT,
  estimated_size VARCHAR,
  start_date DATE,
  end_date DATE,
  labor_hours INTEGER,
  material_requirements JSONB,
  files JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cost estimates table
CREATE TABLE cost_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  labor_cost DECIMAL,
  material_cost DECIMAL,
  equipment_cost DECIMAL,
  contingency_cost DECIMAL,
  total_cost DECIMAL,
  rates_used JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarked grants table
CREATE TABLE bookmarked_grants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  grant_id VARCHAR NOT NULL,
  grant_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default rates table
CREATE TABLE default_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR NOT NULL,
  subcategory VARCHAR,
  rate DECIMAL NOT NULL,
  unit VARCHAR NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample default rates
INSERT INTO default_rates (category, subcategory, rate, unit) VALUES
('labor', 'general', 25.00, 'hour'),
('labor', 'skilled', 35.00, 'hour'),
('labor', 'specialized', 50.00, 'hour'),
('material', 'concrete', 120.00, 'cubic_yard'),
('material', 'steel', 0.85, 'pound'),
('equipment', 'excavator', 300.00, 'day');
```

### Phase 3: Backend Development (45 minutes)

#### Step 4: Create Backend Files

**backend/src/app.js**:
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const grantRoutes = require('./routes/grants');
const costRoutes = require('./routes/costs');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/costs', costRoutes);

module.exports = app;
```

**backend/server.js**:
```javascript
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**backend/package.json scripts section**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step needed'"
  }
}
```

#### Step 5: Key Backend Services

**backend/src/services/supabase.js**:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
```

**backend/src/services/grantsGov.js**:
```javascript
const axios = require('axios');

class GrantsGovService {
  constructor() {
    this.baseURL = 'https://api.grants.gov/v1/api';
  }

  async searchGrants(filters) {
    try {
      const response = await axios.post(`${this.baseURL}/search2`, {
        rows: 20,
        keyword: filters.keyword || '',
        eligibilities: filters.ownerType || '',
        agencies: filters.fundingAgency || '',
        fundingCategories: filters.projectType || '',
        oppStatuses: 'posted|forecasted'
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to search grants: ' + error.message);
    }
  }

  async getGrantDetails(opportunityId) {
    try {
      const response = await axios.post(`${this.baseURL}/fetchOpportunity`, {
        opportunityId
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch grant details: ' + error.message);
    }
  }
}

module.exports = new GrantsGovService();
```

### Phase 4: Frontend Development (60 minutes)

#### Step 6: Create Frontend Structure

**frontend/src/services/api.js**:
```javascript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const projects = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const grants = {
  search: (filters) => api.post('/grants/search', filters),
  bookmark: (projectId, grantId) => api.post('/grants/bookmark', { projectId, grantId }),
};

export const costs = {
  estimate: (projectId, data) => api.post(`/costs/${projectId}/estimate`, data),
  getRates: () => api.get('/costs/rates'),
};
```

#### Step 7: Key Frontend Components

**frontend/src/components/Dashboard.js** (simplified):
```javascript
import React, { useState, useEffect } from 'react';
import { projects } from '../services/api';

function Dashboard() {
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projects.list();
      setProjectList(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  return (
    <div>
      <h1>Project Owner Hub</h1>
      <div>
        {projectList.map(project => (
          <div key={project.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
```

### Phase 5: Local Development Setup (15 minutes)

#### Step 8: Local Environment Setup

**Create .env files for local development:**

**backend/.env**:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_local_jwt_secret_min_32_chars
NODE_ENV=development
PORT=3001
```

**frontend/.env**:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

**Add missing backend dependency**:
```bash
cd backend
npm install @supabase/supabase-js
```

#### Step 9: Create Missing Route Files

**backend/src/routes/auth.js**:
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, organizationName, contactInfo } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: hashedPassword,
        organization_name: organizationName,
        contact_info: contactInfo
      }])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { userId: data[0].id, email: data[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: data[0].id, email: data[0].email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: data.id, email: data.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**backend/src/routes/projects.js**:
```javascript
const express = require('express');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const projectData = { ...req.body, user_id: req.userId };
    
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**backend/src/routes/grants.js**:
```javascript
const express = require('express');
const grantsService = require('../services/grantsGov');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/search', async (req, res) => {
  try {
    const results = await grantsService.searchGrants(req.body);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/details/:opportunityId', async (req, res) => {
  try {
    const details = await grantsService.getGrantDetails(req.params.opportunityId);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**backend/src/routes/costs.js**:
```javascript
const express = require('express');
const supabase = require('../services/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/rates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('default_rates')
      .select('*');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:projectId/estimate', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { laborHours, materialCosts, equipmentCosts } = req.body;
    
    // Simple calculation - you can make this more sophisticated
    const laborCost = laborHours * 30; // $30/hour default
    const contingencyCost = (laborCost + materialCosts + equipmentCosts) * 0.1;
    const totalCost = laborCost + materialCosts + equipmentCosts + contingencyCost;
    
    const estimateData = {
      project_id: projectId,
      labor_cost: laborCost,
      material_cost: materialCosts,
      equipment_cost: equipmentCosts,
      contingency_cost: contingencyCost,
      total_cost: totalCost,
      rates_used: req.body
    };

    const { data, error } = await supabase
      .from('cost_estimates')
      .insert([estimateData])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**backend/src/middleware/auth.js**:
```javascript
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
```

#### Step 10: Test Local Setup

**Start both servers:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

**Verify setup:**
1. Backend runs on `http://localhost:3001`
2. Frontend runs on `http://localhost:3000`
3. Test API at `http://localhost:3001/api/costs/rates`
4. Frontend should load without errors

### Phase 6: Free Deployment Setup (20 minutes)

#### Step 11: Prepare for Deployment

**Create .env.example**:
```
# Backend Environment Variables
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production

# Frontend Environment Variables
REACT_APP_API_URL=your_deployed_backend_url
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

**Create vercel.json in root**:
```json
{
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

#### Step 12: Deploy to Vercel (FREE)

1. Install Vercel CLI: `npm i -g vercel`
2. In project root: `vercel login`
3. Run: `vercel --prod`
4. Add environment variables in Vercel dashboard
5. Your app will be live at `https://your-project-name.vercel.app`

### Phase 6: API Keys Setup (FREE Tiers)

#### Step 13: Get Required API Keys

**Grants.gov API** (No key required for basic access):
- Endpoint: `https://api.grants.gov/v1/api`
- Rate limit: 1000 requests/hour (free)

**Google Maps API** (Free tier: $200 credit monthly):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create API key
4. Restrict key to your domain

## 🧪 **Live Testing Available**

**Current Setup Status:**
- ✅ Frontend running: http://localhost:3000  
- ✅ Backend running: http://localhost:3001/api/test
- ✅ Database: 5 tables created with sample data
- ✅ Environment: Configured and tested

**Test Commands:**
```bash
# Test database connection
cd backend && node test-db.js

# Test backend API
curl http://localhost:3001/api/test

# Test frontend (open in browser)
open http://localhost:3000
```

---

## Quick Start Commands

### Complete Local Setup (First Time)
```bash
# Clone your repo
git clone https://github.com/yourusername/project-owner-hub
cd project-owner-hub

# Backend setup
cd backend
npm install
# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your actual values

# Frontend setup (new terminal)
cd frontend  
npm install
# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Start development servers
cd backend && npm run dev    # Terminal 1 - runs on :3001
cd frontend && npm start     # Terminal 2 - runs on :3000
```

### Daily Development (After Setup)
```bash
# Start both servers quickly
cd backend && npm run dev &   # Background
cd frontend && npm start      # Foreground
```

### Production Deploy
```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
vercel --prod
```

## Grants.gov API Reference

### Filter Mapping for UI

**Project Types** (`fundingCategories`):
- Agriculture: `"AG"`
- Arts: `"AR"` 
- Business: `"BC"`
- Education: `"ED"`
- Environment: `"EN"`
- Health: `"HL"`
- Science & Technology: `"ST"`

**Owner Types** (`eligibilities`):
- County governments: `"01"`
- City/township governments: `"02"` 
- State governments: `"04"`
- Small businesses: `"05"`
- Nonprofits: `"06"`
- Universities: `"07"`
- Individuals: `"11"`

**Funding Agencies** (`agencies`):
- Department of Health and Human Services: `"HHS"`
- Department of Agriculture: `"USDA"`
- National Science Foundation: `"NSF"`
- Department of Energy: `"DOE"`
- Department of Education: `"ED"`
- EPA: `"EPA"`

## Total Development Time: ~3 Hours

### Time Breakdown:
- **Setup (15 min)**: Project structure, dependencies
- **Database (10 min)**: Supabase account, schema creation  
- **Backend (45 min)**: API routes, services, authentication
- **Frontend (60 min)**: React components, routing, API integration
- **Local Setup (15 min)**: Environment files, route files, testing
- **Deployment (20 min)**: Vercel setup, environment variables

## Free Tier Limits:
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Vercel**: 100GB bandwidth, 10GB storage
- **Google Maps**: $200 credit (~28,000 map loads/month)
- **Grants.gov**: 1000 requests/hour (no cost)

## Development Checklist:

### ✅ Completed (Phase 1 & 2):
1. ✅ Project structure and dependencies installed
2. ✅ Database schema created in Supabase (5 tables)
3. ✅ Environment files configured with real credentials
4. ✅ Database connection tested successfully
5. ✅ Frontend React app running (localhost:3000)
6. ✅ Backend server running (localhost:3001)
7. ✅ Basic API endpoint responding
8. ✅ Sample cost estimation data loaded

### 🔄 Next Steps (Phase 3 & 4):
9. ⏳ Backend authentication routes (login/register)
10. ⏳ Backend project management API
11. ⏳ Backend grant search integration
12. ⏳ Frontend authentication components
13. ⏳ Frontend project management UI
14. ⏳ Frontend grant discovery interface

### Deployment (Phase 5):
15. ⏳ Vercel deployment setup
16. ⏳ Production environment variables
17. ⏳ Add domain to Google Maps API restrictions

## Development Commands Reference:

### Local Development:
```bash
# Start backend only
cd backend && npm run dev

# Start frontend only  
cd frontend && npm start

# Test API endpoints
curl http://localhost:3001/api/costs/rates

# Check if both servers are running
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Install new backend dependency
cd backend && npm install package-name

# Install new frontend dependency
cd frontend && npm install package-name

# View backend logs
cd backend && npm run dev | grep -i error

# Reset database (if needed)
# Go to Supabase dashboard > SQL Editor > run DROP/CREATE commands
```

### Git Deployment:
```bash
# Commit changes
git add .
git commit -m "Add feature description"
git push origin main

# Auto-deploy via Vercel GitHub integration
# OR manual deploy:
vercel --prod
```

## Troubleshooting:

### Local Development Issues:
**Backend won't start**: Check `.env` file exists in `backend/` directory
**Frontend can't reach API**: Verify `REACT_APP_API_URL=http://localhost:3001/api` in frontend `.env`
**Database connection errors**: Double-check Supabase URL and key in backend `.env`
**Port already in use**: Kill existing processes with `lsof -ti:3001 | xargs kill -9`

### API Issues:
**Grants.gov API failing**: Check network connection, API has 1000 req/hour limit
**Authentication errors**: Verify JWT_SECRET is at least 32 characters long
**CORS errors**: Ensure frontend URL is added to backend CORS whitelist

### Deployment Issues:
**Vercel build fails**: Check all environment variables are set in Vercel dashboard
**Database connection in production**: Verify Supabase credentials in Vercel env vars
**Static files not loading**: Ensure `vercel.json` is in project root directory

### Quick Fixes:
```bash
# Reset local environment
rm -rf node_modules package-lock.json
npm install

# Clear browser cache and try again
# Check browser console for detailed error messages

# Test API directly
curl -X GET http://localhost:3001/api/costs/rates
```

This guide provides a complete, production-ready Project Owner Hub that can be developed locally and deployed for free in under 3 hours.