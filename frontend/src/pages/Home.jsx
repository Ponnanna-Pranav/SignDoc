import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import AuthService from '../api/auth.service';
import { FileText, Loader } from 'lucide-react';

const Home = () => {
    const [user, setUser] = useState(null);
    const [recentDocs, setRecentDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ completed: 0, actions_required: 0, waiting: 0 });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        fetchRecentActivity();
    }, []);

    const fetchRecentActivity = async () => {
        setLoading(true);
        try {
            const response = await api.get('/docs');
            const docs = response.data;
            // Mocking "Recent" by taking the last 5
            setRecentDocs(docs.slice(0, 5));

            // Mocking stats
            const completed = docs.filter(d => d.status === 'signed').length;
            const pending = docs.length - completed;
            setStats({ completed, actions_required: 0, waiting: pending });

        } catch (error) {
            console.error("Failed to fetch recent activity", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-indigo-900 text-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h1>
                    <p className="text-indigo-200 mb-6">Get Started: Send Documents for Signature</p>
                    <Link to="/manage" className="bg-white text-indigo-900 px-6 py-2 rounded font-semibold hover:bg-indigo-50 transition">
                        Show me
                    </Link>
                </div>

                {/* Abstract shapes for decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm text-center uppercase">Action Required</h3>
                    <p className="text-4xl font-bold text-center mt-2 text-yellow-600">{stats.actions_required}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm text-center uppercase">Waiting for Others</h3>
                    <p className="text-4xl font-bold text-center mt-2 text-blue-600">{stats.waiting}</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 font-medium text-sm text-center uppercase">Completed</h3>
                    <p className="text-4xl font-bold text-center mt-2 text-green-600">{stats.completed}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Loading...</div>
                    ) : recentDocs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No recent activity.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Change</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                                                <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {doc.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(doc.uploadTime).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
