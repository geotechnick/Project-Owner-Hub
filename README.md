# Project Owner Hub

A web-based Project Owner Hub for infrastructure and construction project owners with project management, cost estimation, and grant discovery via Grants.gov API.

## 🎯 **Current Status: Phase 2 Complete**

✅ **Setup Complete** - Dependencies installed, structure ready  
✅ **Database Ready** - Supabase configured with 5 tables + sample data  
✅ **Servers Running** - Frontend & Backend accessible for testing  
🔄 **Next Phase** - API routes development

**Quick Test:** Visit http://localhost:3000 (frontend) & http://localhost:3001/api/test (backend)

## Features

- 🏗️ **Project Management**: Create and manage infrastructure projects
- 💰 **Cost Estimation**: Automated cost calculation with customizable rates
- 🎯 **Grant Discovery**: Search grants via Grants.gov API with advanced filters
- 🔐 **User Authentication**: Secure JWT-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile

## 🧪 **Live Testing Available**

**Both servers are currently running and ready for testing:**

```bash
# Test database connection  
cd backend && node test-db.js

# Test backend API
curl http://localhost:3001/api/test

# Test frontend (open in browser)
open http://localhost:3000
```

**Current Setup:**
- ✅ Frontend: http://localhost:3000 (React app running)
- ✅ Backend: http://localhost:3001/api/test (API responding)  
- ✅ Database: Supabase with 12 cost estimation rates
- ✅ Environment: Fully configured

---

## Quick Start

### Local Development

1. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/project-owner-hub
   cd project-owner-hub
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your Supabase credentials
   npm run dev
   ```

3. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your API keys
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Deploy to Production

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Tech Stack

- **Backend**: Node.js, Express, JWT, Supabase
- **Frontend**: React, Material-UI, Axios
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel (free)
- **APIs**: Grants.gov, Google Maps

## Project Structure

```
project-owner-hub/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
├── CLAUDE.md           # Complete build guide
└── README.md
```

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Files Created

**Project Files:**
- `backend/server.js` - Express server with test endpoints
- `backend/test-db.js` - Database connection verification  
- `backend/.env` - Environment variables (configured)
- `database-schema.sql` - Complete database schema
- Frontend React app - Material-UI components ready

## Development Status

**✅ Completed:**
- Project structure & dependencies
- Database schema (5 tables) with sample data
- Environment configuration & testing
- Basic server setup with API endpoints
- Frontend React app initialization

**🔄 Next Steps:**
- Authentication routes (login/register)
- Project management API endpoints  
- Grant search integration with Grants.gov
- Frontend components development
- UI/UX implementation

## Documentation

- 📚 **Complete Build Guide**: See [CLAUDE.md](./CLAUDE.md) for step-by-step instructions
- 🧪 **Testing Guide**: Database, API, and frontend tests included
- 🔧 **Deployment Guide**: Vercel deployment instructions in CLAUDE.md

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

## License

MIT License - see LICENSE file for details
