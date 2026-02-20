import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Upload, Search, FileText, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import DocumentCard from '../components/DocumentCard';
import api from '../api/axios';
import AuthService from '../api/auth.service';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        filterDocuments();
    }, [documents, searchQuery, statusFilter]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/docs');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
            if (error.response && error.response.status === 401) {
                AuthService.logout();
                window.location.href = '/login';
            }
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const filterDocuments = () => {
        let filtered = documents;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(doc => (doc.status || 'pending') === statusFilter);
        }

        setFilteredDocs(filtered);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('Please upload a PDF file');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error('File size should not exceed 10MB');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        const toastId = toast.loading('Uploading document...');
        try {
            await api.post('/docs/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFile(null);
            // Reset file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) fileInput.value = '';

            await fetchDocuments();
            toast.success('Document uploaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Error uploading file', error);
            toast.error('Failed to upload document', { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (docId, docName) => {
        const toastId = toast.loading('Downloading...');
        try {
            const response = await api.get(`/docs/download/${docId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', docName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Download started', { id: toastId });
        } catch (error) {
            console.error('Download failed', error);
            toast.error('Download failed', { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
                    <p className="text-gray-600 mt-2">Manage and sign your documents</p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Upload className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                    </div>
                    <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="block">
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100 cursor-pointer"
                                />
                            </label>
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors ${(!file || uploading) && 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </form>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="signed">Signed</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Documents List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="text-gray-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Documents ({filteredDocs.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gray-200 h-40 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-500 text-lg">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'No documents match your filters'
                                    : 'No documents found. Upload one to get started.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocs.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    doc={doc}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
