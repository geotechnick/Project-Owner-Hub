const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const grantRoutes = require('./routes/grants');
const costRoutes = require('./routes/costs');
const dataRoutes = require('./routes/data');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add a simple direct route for testing
app.get('/api/direct-test', (req, res) => {
  res.json({ message: 'Direct route working!' });
});

// Temporarily add routes directly for testing
app.post('/api/auth/register', async (req, res) => {
  res.json({ message: 'Registration endpoint working!', data: req.body });
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth test route working!' });
});

console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/costs', costRoutes);
app.use('/api/data', dataRoutes);
console.log('Routes registered successfully');

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

module.exports = app;