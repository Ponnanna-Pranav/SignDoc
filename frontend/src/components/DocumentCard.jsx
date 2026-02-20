import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';

const DocumentCard = ({ doc, onSign, onDownload }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            signed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
            completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon size={12} />
                {status || 'pending'}
            </span>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded">
                        <FileText className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Uploaded on {formatDate(doc.uploadTime)}
                        </p>
                        <div className="mt-2">
                            {getStatusBadge(doc.status)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <Link
                    to={`/sign/${doc.id}`}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                    Sign Document
                </Link>
                <button
                    onClick={() => onDownload(doc.id, doc.name)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                    Download
                </button>
            </div>
        </div>
    );
};

export default DocumentCard;
