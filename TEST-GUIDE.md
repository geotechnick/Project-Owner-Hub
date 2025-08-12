# 🧪 Project Owner Hub - Testing Guide

## Current Testing Status

**✅ All tests passing** - Frontend, Backend, and Database verified

## Available Tests

### 1. Database Connection Test

**Test:** Verify Supabase connection and schema
```bash
cd backend && node test-db.js
```

**Expected Output:**
```
✅ Database connection successful!
📊 Found 5 default rates in database:
   - labor (general): $25/hour
   - labor (skilled): $35/hour
   - labor (specialized): $50/hour
   - labor (supervisor): $45/hour
   - material (concrete): $120/cubic_yard

🗂️  Verifying all tables exist...
✅ Table 'users' - OK
✅ Table 'projects' - OK
✅ Table 'cost_estimates' - OK
✅ Table 'bookmarked_grants' - OK
✅ Table 'default_rates' - OK

🎉 Database setup complete! Ready for development.
```

### 2. Backend API Test

**Test:** Check backend server and API endpoints
```bash
curl http://localhost:3001/api/test
```

**Expected Output:**
```json
{
  "message": "Backend server is running!",
  "timestamp": "2025-08-12T12:23:16.490Z",
  "database": "Connected"
}
```

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Expected Output:**
```json
{
  "status": "OK",
  "service": "Project Owner Hub API"
}
```

### 3. Frontend React App Test

**Test:** Verify React development server
- **URL:** http://localhost:3000
- **Expected:** React welcome page with spinning logo
- **Console:** No errors in browser developer tools

### 4. Supabase Dashboard Test

**Test:** Manual database verification
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Check **default_rates** table - should show 12 rows
4. Verify other tables exist (users, projects, cost_estimates, bookmarked_grants)

## Server Status Verification

### Check Running Processes
```bash
# Check if frontend is running (port 3000)
lsof -i :3000

# Check if backend is running (port 3001)  
lsof -i :3001
```

### Start Servers (if not running)
```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm start
```

## Environment Verification

### Backend Environment Test
```bash
cd backend
cat .env | grep -E "(SUPABASE_URL|SUPABASE_ANON_KEY|JWT_SECRET)"
```

**Should show:**
- SUPABASE_URL=https://tfyutcrxwtyptpdzdqjr.supabase.co
- SUPABASE_ANON_KEY=eyJ... (long JWT string)
- JWT_SECRET=project_owner_hub_jwt_secret_key_32_chars_long_2024

## Troubleshooting

### Database Connection Issues
```bash
# Reset test
cd backend && node test-db.js

# Common fixes:
# 1. Check .env file exists and has correct values
# 2. Verify Supabase project is active
# 3. Confirm SQL schema was run in Supabase SQL Editor
```

### Server Won't Start
```bash
# Kill any existing processes
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already In Use
```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

## Testing Checklist

**Before continuing development, verify:**

- [ ] ✅ Database connection successful
- [ ] ✅ Backend API responding on http://localhost:3001/api/test
- [ ] ✅ Frontend loading on http://localhost:3000
- [ ] ✅ No console errors in browser
- [ ] ✅ Environment variables configured
- [ ] ✅ Supabase dashboard accessible
- [ ] ✅ All 5 database tables created
- [ ] ✅ 12 default rates loaded in database

**All tests passing?** ✅ Ready for Phase 3 (Backend API development)!