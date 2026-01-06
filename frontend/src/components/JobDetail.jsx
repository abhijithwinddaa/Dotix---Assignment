// =====================================================
// Job Detail Component
// Shows full details of a selected job
// =====================================================

import React from 'react';
import { X, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';

function JobDetail({ job, onClose }) {
    // Don't render if no job selected
    if (!job) return null;

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get status icon and color
    function getStatusInfo(status) {
        switch (status) {
            case 'pending':
                return {
                    icon: <Clock size={18} />,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    label: 'Pending'
                };
            case 'running':
                return {
                    icon: <Loader size={18} className="animate-spin" />,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    label: 'Running'
                };
            case 'completed':
                return {
                    icon: <CheckCircle size={18} />,
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    label: 'Completed'
                };
            default:
                return {
                    icon: <AlertCircle size={18} />,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    label: status
                };
        }
    }

    // Get priority color
    function getPriorityColor(priority) {
        switch (priority) {
            case 'High':
                return 'text-red-600 bg-red-100';
            case 'Medium':
                return 'text-orange-600 bg-orange-100';
            case 'Low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    }

    const statusInfo = getStatusInfo(job.status);

    // Format payload for display
    function formatPayload(payload) {
        try {
            // If it's a string, parse it first
            const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
            return JSON.stringify(data, null, 2);
        } catch {
            return String(payload || '{}');
        }
    }

    return (
        // Slide-in panel overlay
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
            {/* Panel */}
            <div className="bg-white w-full max-w-lg h-full shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Job Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Job ID */}
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Job ID</p>
                        <p className="text-lg font-mono text-gray-800">#{job.id}</p>
                    </div>

                    {/* Task Name */}
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Task Name</p>
                        <p className="text-lg font-semibold text-gray-800">{job.taskName}</p>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex gap-4">
                        {/* Status */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                            </span>
                        </div>

                        {/* Priority */}
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-2">Priority</p>
                            <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(job.priority)}`}>
                                {job.priority}
                            </span>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Created At</p>
                            <p className="text-gray-800">{formatDate(job.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Updated At</p>
                            <p className="text-gray-800">{formatDate(job.updatedAt)}</p>
                        </div>
                        {job.completedAt && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500 mb-1">Completed At</p>
                                <p className="text-green-600 font-medium">
                                    {formatDate(job.completedAt)}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payload */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Payload</p>
                        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800">
                            {formatPayload(job.payload)}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetail;
