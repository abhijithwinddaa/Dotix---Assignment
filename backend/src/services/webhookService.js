// =====================================================
// Webhook Service
// Sends HTTP POST request when a job completes
// =====================================================

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * Send webhook notification when job completes
 * @param {Object} job - The completed job object
 * @returns {Object} - Result of webhook call
 */
async function sendWebhook(job) {
    const webhookUrl = process.env.WEBHOOK_URL;

    // If no webhook URL configured, skip
    if (!webhookUrl || webhookUrl.includes('your-unique-id')) {
        console.log('⚠️  Webhook URL not configured. Skipping webhook.');
        return { success: false, message: 'Webhook URL not configured' };
    }

    // Prepare the payload to send
    const payload = {
        jobId: job.id,
        taskName: job.taskName,
        priority: job.priority,
        payload: job.payload,
        completedAt: job.completedAt || new Date().toISOString()
    };

    try {
        console.log('📤 Sending webhook to:', webhookUrl);
        console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2));

        // Send POST request to webhook URL
        const response = await axios.post(webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000  // 10 second timeout
        });

        console.log('✅ Webhook sent successfully!');
        console.log('📥 Response status:', response.status);

        return {
            success: true,
            statusCode: response.status,
            message: 'Webhook sent successfully'
        };

    } catch (error) {
        console.error('❌ Webhook failed:', error.message);

        return {
            success: false,
            message: error.message,
            statusCode: error.response?.status || null
        };
    }
}

module.exports = {
    sendWebhook
};
