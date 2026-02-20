import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Upload, Search, Download, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Manage = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inbox'); // inbox, sent, deleted
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        filterDocuments();
    }, [documents, activeTab, searchQuery]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/docs');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching documents', error);
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const filterDocuments = () => {
        let docs = documents;

        // Search
        if (searchQuery) {
            docs = docs.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Tab logic (Mocking existing backend capabilities by filtering on client)
        // Inbox: All documents shared with me (For now, just all docs)
        // Sent: Documents I uploaded
        // This distinction might require backend support not present yet, so I'll just show 'All' for Inbox.
        if (activeTab === 'completed') {
            docs = docs.filter(doc => doc.status === 'signed');
        }
        // else 'inbox' shows all for now

        setFilteredDocs(docs);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Uploading...');
        try {
            await api.post('/docs/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchDocuments();
            toast.success('Uploaded successfully', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Upload failed', { id: toastId });
        }
    };

    const handleSign = (id) => {
        navigate(`/sign/${id}`);
    };

    const handleDownload = async (doc) => {
        try {
            const response = await api.get(`/docs/download/${doc.id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.name); // or doc.filePath
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
            toast.error("Download failed");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold">Inbox</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                    <label className="bg-blue-600 text-white px-4 py-2 rounded font-semibold cursor-pointer hover:bg-blue-700 transition flex items-center">
                        <Upload size={18} className="mr-2" />
                        New
                        <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} />
                    </label>
                </div>
            </div>

            {/* Sidebar + List Layout */}
            <div className="flex flex-1">
                <div className="w-48 border-r border-gray-200 p-4 bg-gray-50">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveTab('inbox')}
                                className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${activeTab === 'inbox' ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Inbox
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('sent')}
                                className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${activeTab === 'sent' ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Sent
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`w-full text-left px-3 py-2 rounded text-sm font-medium ${activeTab === 'completed' ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Completed
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 p-4">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">Loading...</div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">No documents found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                            <div className="text-sm text-gray-500">{doc.fileType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'signed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(doc.uploadTime).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button onClick={() => handleSign(doc.id)} className="text-indigo-600 hover:text-indigo-900">Sign</button>
                                            <button onClick={() => handleDownload(doc)} className="text-gray-600 hover:text-gray-900"><Download size={16} /></button>
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

export default Manage;
