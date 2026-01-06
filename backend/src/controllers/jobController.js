// =====================================================
// Job Controller
// Handles HTTP requests and sends responses
// =====================================================

const jobService = require('../services/jobService');
const { sendWebhook } = require('../services/webhookService');

/**
 * POST /api/jobs
 * Create a new job
 */
async function createJob(req, res) {
    try {
        const { taskName, payload, priority } = req.body;

        // Validate required fields
        if (!taskName || !taskName.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task name is required'
            });
        }

        if (!priority || !['Low', 'Medium', 'High'].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Priority must be Low, Medium, or High'
            });
        }

        // Create the job
        const job = await jobService.createJob({
            taskName: taskName.trim(),
            payload: payload || {},
            priority
        });

        console.log('✅ Job created:', job);

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: job
        });

    } catch (error) {
        console.error('❌ Error creating job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create job',
            error: error.message
        });
    }
}

/**
 * GET /api/jobs
 * Get all jobs with optional filters
 */
async function getAllJobs(req, res) {
    try {
        // Get filter parameters from query string
        const { status, priority } = req.query;

        // Validate status if provided
        if (status && !['pending', 'running', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, running, or completed'
            });
        }

        // Validate priority if provided
        if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid priority. Must be Low, Medium, or High'
            });
        }

        const jobs = await jobService.getAllJobs({ status, priority });

        res.json({
            success: true,
            count: jobs.length,
            data: jobs
        });

    } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message
        });
    }
}

/**
 * GET /api/jobs/:id
 * Get a single job by ID
 */
async function getJobById(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        const job = await jobService.getJobById(parseInt(id));

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: job
        });

    } catch (error) {
        console.error('❌ Error fetching job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch job',
            error: error.message
        });
    }
}

/**
 * POST /api/run-job/:id
 * Run a job (simulate background processing)
 */
async function runJob(req, res) {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        const jobId = parseInt(id);

        // Get the job first
        const job = await jobService.getJobById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if job can be run (only pending jobs can be run)
        if (job.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot run job. Current status is "${job.status}". Only pending jobs can be run.`
            });
        }

        // Step 1: Set status to 'running'
        await jobService.updateJobStatus(jobId, 'running');
        console.log(`🔄 Job ${jobId} is now running...`);

        // Respond immediately (job runs in background)
        res.json({
            success: true,
            message: 'Job started running',
            data: { id: jobId, status: 'running' }
        });

        // Step 2: Simulate background processing (3 seconds)
        setTimeout(async () => {
            try {
                // Step 3: Set status to 'completed'
                await jobService.updateJobStatus(jobId, 'completed');
                console.log(`✅ Job ${jobId} completed!`);

                // Step 4: Get updated job and trigger webhook
                const completedJob = await jobService.getJobById(jobId);
                await sendWebhook(completedJob);

            } catch (error) {
                console.error(`❌ Error completing job ${jobId}:`, error);
            }
        }, 3000);  // 3 second delay

    } catch (error) {
        console.error('❌ Error running job:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to run job',
            error: error.message
        });
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    runJob
};
