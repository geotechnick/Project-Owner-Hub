# Project Owner Hub

A web-based Project Owner Hub for infrastructure and construction project owners with project management, cost estimation, and grant discovery via Grants.gov API.

## Features

- 🏗️ **Project Management**: Create and manage infrastructure projects
- 💰 **Cost Estimation**: Automated cost calculation with customizable rates
- 🎯 **Grant Discovery**: Search grants via Grants.gov API with advanced filters
- 🔐 **User Authentication**: Secure JWT-based authentication
- 📱 **Responsive Design**: Works on desktop and mobile

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

## Documentation

- 📚 **Complete Build Guide**: See [CLAUDE.md](./CLAUDE.md) for step-by-step instructions
- 🚀 **API Documentation**: Available at `/api/docs` when running locally
- 🔧 **Deployment Guide**: Included in CLAUDE.md

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Submit a pull request

## License

MIT License - see LICENSE file for details
