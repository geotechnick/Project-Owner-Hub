# Project Owner Hub

A web-based Project Owner Hub for infrastructure and construction project owners with project management, cost estimation, and grant discovery via Grants.gov API.

## 🎯 **Current Status: Phase 3 Complete - Backend API Fully Operational**

✅ **Phase 1 Complete** - Project setup, dependencies installed  
✅ **Phase 2 Complete** - Database configured with Supabase (5 tables)  
✅ **Phase 3 Complete** - Backend API development & functional testing  
🔄 **Phase 4 Next** - Frontend React components development  

**Servers Status:**
- ✅ Backend API: http://localhost:3001 (Fully tested & operational)
- ✅ Frontend: http://localhost:3000 (React app ready for development)
- ✅ Database: Connected to Supabase with authentication system

## Features

- 🏗️ **Project Management**: Create and manage infrastructure projects
- 💰 **Cost Estimation**: Automated cost calculation with customizable rates
- 🎯 **Grant Discovery**: Search grants via Grants.gov API with advanced filters
- 🔐 **User Authentication**: Secure JWT-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile

## 🧪 **Backend API Testing Complete**

**All backend endpoints tested and operational:**

```bash
# Health check
curl http://localhost:3001/api/health

# Test registration 
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","organizationName":"Test Org"}'

# Test protected routes (requires authentication)
curl http://localhost:3001/api/projects -H "Authorization: Bearer <your-token>"
curl http://localhost:3001/api/costs/rates -H "Authorization: Bearer <your-token>"
```

**Functional Test Results:**
- ✅ Authentication system (JWT tokens)
- ✅ User registration & login endpoints
- ✅ Protected API routes with middleware
- ✅ Database connectivity confirmed
- ✅ Grant search service integration
- ✅ Cost estimation endpoints

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

**✅ Phase 3 Complete - Backend API:**
- ✅ Project structure & dependencies installed
- ✅ Database schema (5 tables) with Supabase integration
- ✅ Authentication system (JWT-based login/register)
- ✅ Protected API routes with middleware
- ✅ Project management endpoints
- ✅ Grant search integration (Grants.gov API)
- ✅ Cost estimation with database rates
- ✅ Complete functional testing verified

**🔄 Phase 4 Next - Frontend Development:**
- React authentication components (login/register forms)
- Project management UI (create, edit, list projects)
- Grant discovery interface with filters
- Cost estimation calculator
- Dashboard and navigation components
- Material-UI integration and styling

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
