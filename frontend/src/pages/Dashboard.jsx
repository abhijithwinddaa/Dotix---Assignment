// =====================================================
// Dashboard Page
// Main page showing all jobs with filters and actions
// =====================================================

import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { getJobs } from '../services/api';
import Filters from '../components/Filters';
import JobTable from '../components/JobTable';
import CreateJobForm from '../components/CreateJobForm';
import JobDetail from '../components/JobDetail';

function Dashboard() {
    // State for jobs list
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // State for filters
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });

    // State for modals
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch jobs on component mount and when filters change
    useEffect(() => {
        fetchJobs();
    }, [filters]);

    // Fetch jobs from API
    async function fetchJobs() {
        setIsLoading(true);
        try {
            const response = await getJobs(filters);
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // Handle filter change
    function handleFilterChange(newFilters) {
        setFilters(newFilters);
    }

    // Handle view job details
    function handleViewJob(job) {
        setSelectedJob(job);
    }

    // Handle close job detail
    function handleCloseDetail() {
        setSelectedJob(null);
    }

    // Handle job created
    function handleJobCreated() {
        fetchJobs();
    }

    // Handle job update (after running)
    function handleJobUpdate() {
        fetchJobs();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Job Scheduler
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage and run your background jobs
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateFormOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus size={20} />
                            Create Job
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters and Refresh */}
                <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Filters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                        <button
                            onClick={fetchJobs}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw
                                size={18}
                                className={isLoading ? 'animate-spin' : ''}
                            />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-white rounded-lg border shadow-sm">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b">
                        <h2 className="font-semibold text-gray-800">
                            All Jobs
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                ({jobs.length} {jobs.length === 1 ? 'job' : 'jobs'})
                            </span>
                        </h2>
                    </div>

                    {/* Table Content */}
                    <JobTable
                        jobs={jobs}
                        isLoading={isLoading}
                        onViewJob={handleViewJob}
                        onJobUpdate={handleJobUpdate}
                    />
                </div>
            </main>

            {/* Create Job Form Modal */}
            <CreateJobForm
                isOpen={isCreateFormOpen}
                onClose={() => setIsCreateFormOpen(false)}
                onJobCreated={handleJobCreated}
            />

            {/* Job Detail Panel */}
            <JobDetail
                job={selectedJob}
                onClose={handleCloseDetail}
            />
        </div>
    );
}

export default Dashboard;
