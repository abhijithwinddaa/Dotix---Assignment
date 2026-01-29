// =====================================================
// Database Connection
// Creates a connection pool to MySQL database
// =====================================================

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Create a connection pool
// Pool is better than single connection because:
// - Handles multiple requests at once
// - Automatically reconnects if connection drops

// Debug: Print what password we're using (first 3 chars only)
const dbPassword = process.env.DB_PASSWORD || '';
console.log('🔧 DB Config:', {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'job_scheduler',
    passwordLength: dbPassword.length,
    passwordStart: dbPassword.substring(0, 3) + '***'
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: dbPassword,
    database: process.env.DB_NAME || 'job_scheduler',
    waitForConnections: true,
    connectionLimit: 10,      // Max 10 connections at a time
    queueLimit: 0,            // Unlimited queue
    // SSL config for cloud databases (Aiven, PlanetScale, etc.)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
