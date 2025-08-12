require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend server is running!', 
    timestamp: new Date(),
    database: process.env.SUPABASE_URL ? 'Connected' : 'Not configured'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Project Owner Hub API' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.SUPABASE_URL ? 'Connected' : 'Not configured'}`);
});