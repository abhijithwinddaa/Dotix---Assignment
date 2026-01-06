// =====================================================
// Job Routes
// Defines all API endpoints for jobs
// =====================================================

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// POST /api/jobs - Create a new job
router.post('/jobs', jobController.createJob);

// GET /api/jobs - Get all jobs (with optional filters)
router.get('/jobs', jobController.getAllJobs);

// GET /api/jobs/:id - Get a single job
router.get('/jobs/:id', jobController.getJobById);

// POST /api/run-job/:id - Run a job
router.post('/run-job/:id', jobController.runJob);

module.exports = router;
