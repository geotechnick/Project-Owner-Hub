# API Testing Guide - Project Owner Hub

## Backend API Endpoints - All Functional & Tested ✅

**Base URL:** `http://localhost:3001/api`

---

## 🔐 Authentication Endpoints

### 1. User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "organizationName": "My Construction Company",
    "contactInfo": {
      "phone": "555-123-4567",
      "address": "123 Main St"
    }
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  }
}
```

### 2. User Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com"
  }
}
```

---

## 🏗️ Project Management Endpoints

**Note:** All project endpoints require authentication header: `Authorization: Bearer <your-jwt-token>`

### 3. List User Projects
```bash
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create New Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Highway Bridge Repair",
    "description": "Structural repairs and maintenance for downtown bridge",
    "sector": "infrastructure",
    "location_address": "123 Bridge St, City, State",
    "estimated_size": "large",
    "start_date": "2024-03-01",
    "end_date": "2024-08-15",
    "labor_hours": 2000,
    "material_requirements": {
      "concrete": "500 cubic yards",
      "steel": "10000 pounds"
    }
  }'
```

### 5. Update Project
```bash
curl -X PUT http://localhost:3001/api/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description"
  }'
```

### 6. Delete Project
```bash
curl -X DELETE http://localhost:3001/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Grant Search Endpoints

### 7. Search Grants
```bash
curl -X POST http://localhost:3001/api/grants/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "keyword": "infrastructure",
    "ownerType": "02",
    "fundingAgency": "DOT",
    "projectType": "ST"
  }'
```

**Filter Values:**
- **Owner Types**: `"01"` (County), `"02"` (City), `"04"` (State), `"05"` (Small Business), etc.
- **Agencies**: `"DOT"`, `"HHS"`, `"USDA"`, `"NSF"`, `"DOE"`, etc.
- **Project Types**: `"AG"` (Agriculture), `"ST"` (Science & Tech), `"EN"` (Environment), etc.

### 8. Get Grant Details
```bash
curl -X GET http://localhost:3001/api/grants/details/OPPORTUNITY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💰 Cost Estimation Endpoints

### 9. Get Default Rates
```bash
curl -X GET http://localhost:3001/api/costs/rates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "id": "uuid",
    "category": "labor",
    "subcategory": "general",
    "rate": 25.00,
    "unit": "hour"
  },
  {
    "id": "uuid",
    "category": "material",
    "subcategory": "concrete",
    "rate": 120.00,
    "unit": "cubic_yard"
  }
]
```

### 10. Create Cost Estimate
```bash
curl -X POST http://localhost:3001/api/costs/PROJECT_ID/estimate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "laborHours": 500,
    "materialCosts": 15000,
    "equipmentCosts": 8000
  }'
```

**Expected Response:**
```json
{
  "id": "uuid",
  "project_id": "project-uuid",
  "labor_cost": 15000.00,
  "material_cost": 15000.00,
  "equipment_cost": 8000.00,
  "contingency_cost": 3800.00,
  "total_cost": 41800.00,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 🩺 Health & Status Endpoints

### 11. Health Check
```bash
curl http://localhost:3001/api/health
```

**Response:** `{"status":"OK","service":"Project Owner Hub API"}`

### 12. Server Status
```bash
curl http://localhost:3001/api/test
```

**Response:**
```json
{
  "message": "Backend server is running!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "Connected"
}
```

---

## 🧪 Complete Test Sequence

### Step 1: Test Server Health
```bash
curl http://localhost:3001/api/health
```

### Step 2: Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","organizationName":"Test Org"}'
```

### Step 3: Save the JWT Token
Copy the `token` from the response above and use it in subsequent requests.

### Step 4: Test Protected Endpoints
```bash
# Replace YOUR_JWT_TOKEN with the actual token
export JWT_TOKEN="your-actual-jwt-token-here"

# Test projects endpoint
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer $JWT_TOKEN"

# Test cost rates
curl -X GET http://localhost:3001/api/costs/rates \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## 🚫 Error Testing

### Test Authentication Failures
```bash
# No token provided
curl http://localhost:3001/api/projects
# Expected: {"error":"Access denied. No token provided."}

# Invalid token
curl http://localhost:3001/api/projects \
  -H "Authorization: Bearer invalid_token"
# Expected: {"error":"Invalid token"}

# Wrong login credentials
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
# Expected: {"error":"Invalid credentials"}
```

---

## 📊 Functional Test Results Summary

**✅ All Tests Passed:**

1. **Authentication System**: Registration, login, JWT tokens ✅
2. **Route Protection**: Middleware correctly blocks unauthorized access ✅  
3. **Database Integration**: All CRUD operations working ✅
4. **Grant API**: External API integration functional ✅
5. **Cost Calculation**: Mathematical operations and database rates ✅
6. **Error Handling**: Proper error responses for all failure cases ✅

**Backend API Status: 100% Operational** 🎉

---

**Ready for Phase 4: Frontend Development**

All backend endpoints are fully tested and ready for frontend integration. The authentication system, database connectivity, and all business logic are operational.