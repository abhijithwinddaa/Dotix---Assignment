// =====================================================
// Job Table Component
// Displays list of jobs with actions
// =====================================================

import React from 'react';
import { Play, Eye, Clock, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { runJob } from '../services/api';

function JobTable({ jobs, isLoading, onViewJob, onJobUpdate }) {

    // Handle run job button click
    async function handleRunJob(job, event) {
        // Prevent row click
        event.stopPropagation();

        // Only pending jobs can be run
        if (job.status !== 'pending') {
            toast.error('Only pending jobs can be run');
            return;
        }

        try {
            await runJob(job.id);
            toast.success('Job started running!');

            // Refresh job list after a short delay
            setTimeout(() => {
                onJobUpdate();
            }, 500);

            // Refresh again when job should be completed
            setTimeout(() => {
                onJobUpdate();
            }, 3500);

        } catch (error) {
            console.error('Error running job:', error);
            toast.error(error.response?.data?.message || 'Failed to run job');
        }
    }

    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get status badge style
    function getStatusBadge(status) {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock size={14} />,
                    className: 'bg-yellow-100 text-yellow-700',
                    label: 'Pending'
                };
            case 'running':
                return {
                    icon: <Loader size={14} className="animate-spin" />,
                    className: 'bg-blue-100 text-blue-700',
                    label: 'Running'
                };
            case 'completed':
                return {
                    icon: <CheckCircle size={14} />,
                    className: 'bg-green-100 text-green-700',
                    label: 'Completed'
                };
            default:
                return {
                    icon: null,
                    className: 'bg-gray-100 text-gray-700',
                    label: status
                };
        }
    }

    // Get priority badge style
    function getPriorityBadge(priority) {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-700';
            case 'Medium':
                return 'bg-orange-100 text-orange-700';
            case 'Low':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading jobs...</span>
            </div>
        );
    }

    // Empty state
    if (jobs.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No jobs found</p>
                <p className="text-gray-400 text-sm mt-1">
                    Create a new job to get started
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-50 border-b">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            ID
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            Task Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            Status
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            Priority
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            Created
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                            Actions
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {jobs.map((job) => {
                        const statusBadge = getStatusBadge(job.status);

                        return (
                            <tr
                                key={job.id}
                                onClick={() => onViewJob(job)}
                                className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                {/* ID */}
                                <td className="px-4 py-3">
                                    <span className="font-mono text-gray-600">
                                        #{job.id}
                                    </span>
                                </td>

                                {/* Task Name */}
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-800">
                                        {job.taskName}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                        {statusBadge.icon}
                                        {statusBadge.label}
                                    </span>
                                </td>

                                {/* Priority */}
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityBadge(job.priority)}`}>
                                        {job.priority}
                                    </span>
                                </td>

                                {/* Created Date */}
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {formatDate(job.createdAt)}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {/* Run Button - only for pending jobs */}
                                        {job.status === 'pending' && (
                                            <button
                                                onClick={(e) => handleRunJob(job, e)}
                                                title="Run Job"
                                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Play size={16} />
                                            </button>
                                        )}

                                        {/* Running indicator */}
                                        {job.status === 'running' && (
                                            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Loader size={16} className="animate-spin" />
                                            </span>
                                        )}

                                        {/* View Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewJob(job);
                                            }}
                                            title="View Details"
                                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default JobTable;
