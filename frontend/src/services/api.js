// =====================================================
// API Service
// Handles all HTTP requests to backend
// =====================================================

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// =====================================================
// Job API Functions
// =====================================================

/**
 * Create a new job
 * @param {Object} jobData - { taskName, payload, priority }
 */
export async function createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
}

/**
 * Get all jobs with optional filters
 * @param {Object} filters - { status, priority }
 */
export async function getJobs(filters = {}) {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) {
        params.append('status', filters.status);
    }
    if (filters.priority) {
        params.append('priority', filters.priority);
    }

    const queryString = params.toString();
    const url = queryString ? `/jobs?${queryString}` : '/jobs';

    const response = await api.get(url);
    return response.data;
}

/**
 * Get a single job by ID
 * @param {number} id - Job ID
 */
export async function getJobById(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
}

/**
 * Run a job
 * @param {number} id - Job ID
 */
export async function runJob(id) {
    const response = await api.post(`/run-job/${id}`);
    return response.data;
}

export default api;
