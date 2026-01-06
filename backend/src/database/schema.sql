-- =====================================================
-- Job Scheduler Database Schema
-- Run this file in MySQL to set up the database
-- =====================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS job_scheduler;

-- Step 2: Use the database
USE job_scheduler;

-- Step 3: Create the jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskName VARCHAR(255) NOT NULL,
    payload JSON,
    priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
    status ENUM('pending', 'running', 'completed') NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL,
    
    -- Indexes for faster filtering
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- =====================================================
-- How to run this file:
-- 1. Open MySQL command line or workbench
-- 2. Run: source path/to/schema.sql
-- OR copy-paste the above commands
-- =====================================================
