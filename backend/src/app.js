// =====================================================
// Express Application Entry Point
// Main file that starts the server
// =====================================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobs');
const { testConnection } = require('./database/connection');

// Create Express app
const app = express();

// =====================================================
// Middleware
// =====================================================

// Enable CORS (allows frontend to call backend)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Log all requests (helpful for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
});

// =====================================================
// Routes
// =====================================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Job Scheduler API is running!',
        version: '1.0.0',
        endpoints: {
            'POST /api/jobs': 'Create a new job',
            'GET /api/jobs': 'Get all jobs (with filters)',
            'GET /api/jobs/:id': 'Get job by ID',
            'POST /api/run-job/:id': 'Run a job'
        }
    });
});

// Mount job routes under /api
app.use('/api', jobRoutes);

// =====================================================
// Error Handling
// =====================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🔥 Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// =====================================================
// Start Server
// =====================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
    // Test database connection first
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('⚠️  Server starting without database connection.');
        console.error('   Please check your MySQL configuration in .env file.');
    }

    app.listen(PORT, () => {
        console.log('='.repeat(50));
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
        console.log('='.repeat(50));
    });
}

startServer();
