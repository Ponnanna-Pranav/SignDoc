import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Upload, File, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        // Mocking for now as backend endpoint might not be ready
        // In real impl: const res = await api.get('/templates');
        setTemplates([]);
        setLoading(false);
    };

    const handleCreateTemplate = () => {
        toast('Template creation coming soon!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                <button
                    onClick={handleCreateTemplate}
                    className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 flex items-center"
                >
                    <Plus size={20} className="mr-2" />
                    Create Template
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-50 p-4 rounded-full">
                        <File className="text-blue-600" size={32} />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Create your first template</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Create a template once and reuse it for multiple signers. Perfect for contracts, agreements, and forms you use often.
                </p>
                <button
                    onClick={handleCreateTemplate}
                    className="text-blue-600 font-semibold hover:text-blue-800"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Templates;
