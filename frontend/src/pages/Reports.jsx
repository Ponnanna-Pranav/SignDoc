import React from 'react';

const Reports = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Envelope Status</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500">Chart Visualization Placeholder</p>
                    {/* Future: Integrate Recharts or Chart.js here */}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
                <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span>Envelopes Sent</span>
                        <span className="font-bold">124</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Envelopes Completed</span>
                        <span className="font-bold">98</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span>Average Turnaround Time</span>
                        <span className="font-bold">1 day 4 hours</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
