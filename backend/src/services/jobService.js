// =====================================================
// Job Service
// Handles all database operations for jobs
// =====================================================

const { pool } = require('../database/connection');

/**
 * Create a new job
 * @param {Object} jobData - { taskName, payload, priority }
 * @returns {Object} - Created job with id
 */
async function createJob(jobData) {
    const { taskName, payload, priority } = jobData;

    // Convert payload to JSON string for storage
    const payloadString = JSON.stringify(payload || {});

    const query = `
        INSERT INTO jobs (taskName, payload, priority, status)
        VALUES (?, ?, ?, 'pending')
    `;

    const [result] = await pool.execute(query, [taskName, payloadString, priority]);

    // Return the created job
    return {
        id: result.insertId,
        taskName,
        payload: payload || {},
        priority,
        status: 'pending'
    };
}

/**
 * Get all jobs with optional filters
 * @param {Object} filters - { status, priority }
 * @returns {Array} - List of jobs
 */
async function getAllJobs(filters = {}) {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    // Add status filter if provided
    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    // Add priority filter if provided
    if (filters.priority) {
        query += ' AND priority = ?';
        params.push(filters.priority);
    }

    // Order by newest first
    query += ' ORDER BY createdAt DESC';

    const [rows] = await pool.execute(query, params);

    // Parse JSON payload for each job
    return rows.map(job => ({
        ...job,
        payload: typeof job.payload === 'string' ? JSON.parse(job.payload) : job.payload
    }));
}

/**
 * Get a single job by ID
 * @param {number} id - Job ID
 * @returns {Object|null} - Job object or null if not found
 */
async function getJobById(id) {
    const query = 'SELECT * FROM jobs WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
        return null;
    }

    const job = rows[0];

    // Parse JSON payload
    return {
        ...job,
        payload: typeof job.payload === 'string' ? JSON.parse(job.payload) : job.payload
    };
}

/**
 * Update job status
 * @param {number} id - Job ID
 * @param {string} status - New status ('pending', 'running', 'completed')
 * @returns {boolean} - Success status
 */
async function updateJobStatus(id, status) {
    let query;
    let params;

    // If completing, also set completedAt timestamp
    if (status === 'completed') {
        query = 'UPDATE jobs SET status = ?, completedAt = NOW() WHERE id = ?';
        params = [status, id];
    } else {
        query = 'UPDATE jobs SET status = ? WHERE id = ?';
        params = [status, id];
    }

    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0;
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJobStatus
};
