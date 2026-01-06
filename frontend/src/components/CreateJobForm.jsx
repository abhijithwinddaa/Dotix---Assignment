// =====================================================
// Create Job Form Component
// Form to create a new job
// =====================================================

import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createJob } from '../services/api';

function CreateJobForm({ isOpen, onClose, onJobCreated }) {
    // Form state
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [payload, setPayload] = useState('{}');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payloadError, setPayloadError] = useState('');

    // Validate JSON payload
    function validatePayload(value) {
        try {
            JSON.parse(value);
            setPayloadError('');
            return true;
        } catch (error) {
            setPayloadError('Invalid JSON format');
            return false;
        }
    }

    // Handle payload change
    function handlePayloadChange(event) {
        const value = event.target.value;
        setPayload(value);
        if (value.trim()) {
            validatePayload(value);
        } else {
            setPayloadError('');
        }
    }

    // Handle form submit
    async function handleSubmit(event) {
        event.preventDefault();

        // Validate task name
        if (!taskName.trim()) {
            toast.error('Task name is required');
            return;
        }

        // Validate payload JSON
        if (payload.trim() && !validatePayload(payload)) {
            toast.error('Please fix the JSON payload');
            return;
        }

        setIsSubmitting(true);

        try {
            // Parse payload or use empty object
            const parsedPayload = payload.trim() ? JSON.parse(payload) : {};

            // Create the job
            await createJob({
                taskName: taskName.trim(),
                priority,
                payload: parsedPayload
            });

            toast.success('Job created successfully!');

            // Reset form
            setTaskName('');
            setPriority('Medium');
            setPayload('{}');

            // Notify parent to refresh list
            onJobCreated();
            onClose();

        } catch (error) {
            console.error('Error creating job:', error);
            toast.error(error.response?.data?.message || 'Failed to create job');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Don't render if not open
    if (!isOpen) return null;

    return (
        // Modal overlay
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Modal content */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Create New Job
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Task Name */}
                    <div>
                        <label
                            htmlFor="taskName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Task Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="taskName"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="e.g., Send Email, Generate Report"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Payload */}
                    <div>
                        <label
                            htmlFor="payload"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Payload (JSON)
                        </label>
                        <textarea
                            id="payload"
                            value={payload}
                            onChange={handlePayloadChange}
                            placeholder='{"key": "value"}'
                            rows={4}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent font-mono text-sm ${payloadError
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                        />
                        {payloadError && (
                            <p className="mt-1 text-sm text-red-500">{payloadError}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateJobForm;
