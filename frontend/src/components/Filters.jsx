// =====================================================
// Filters Component
// Dropdown filters for status and priority
// =====================================================

import React from 'react';

function Filters({ filters, onFilterChange }) {
    // Handle filter change
    function handleChange(event) {
        const { name, value } = event.target;
        onFilterChange({
            ...filters,
            [name]: value
        });
    }

    // Clear all filters
    function handleClear() {
        onFilterChange({ status: '', priority: '' });
    }

    return (
        <div className="flex flex-wrap gap-4 items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-600"
                >
                    Status:
                </label>
                <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="priority"
                    className="text-sm font-medium text-gray-600"
                >
                    Priority:
                </label>
                <select
                    id="priority"
                    name="priority"
                    value={filters.priority}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            {(filters.status || filters.priority) && (
                <button
                    onClick={handleClear}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
}

export default Filters;
