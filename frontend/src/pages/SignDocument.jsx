import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, PenTool, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import SignatureModal from '../components/SignatureModal';
import api from '../api/axios';


// Set worker src
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const SignDocument = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfFile, setPdfFile] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
    const [signatures, setSignatures] = useState([]);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [currentSignatureData, setCurrentSignatureData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedSigIndex, setDraggedSigIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await api.get(`/docs/download/${id}`, {
                    responseType: 'arraybuffer',
                });
                const file = new Blob([response.data], { type: 'application/pdf' });
                setPdfFile(file);
            } catch (error) {
                console.error('Error loading PDF', error);
                toast.error('Failed to load PDF');
            } finally {
                setLoading(false);
            }
        };

        fetchPdf();
    }, [id]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function onPageLoadSuccess(page) {
        setPdfDimensions({ width: page.width * scale, height: page.height * scale });
    }

    const handleAddSignature = () => {
        setIsSignatureModalOpen(true);
    };

    const handleSignatureSave = (signatureData) => {
        setCurrentSignatureData(signatureData);
        // Add signature to center of current page
        const newSig = {
            id: Date.now(),
            data: signatureData,
            x: pdfDimensions.width / 2 - 80,
            y: pdfDimensions.height / 2 - 30,
            width: 160,
            height: 60,
            page: pageNumber,
        };
        setSignatures([...signatures, newSig]);
        toast.success('Signature added! Drag to position it.');
    };

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        setIsDragging(true);
        setDraggedSigIndex(index);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || draggedSigIndex === null) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - 80; // Half of signature width
        const y = e.clientY - rect.top - 30; // Half of signature height

        setSignatures(prev => prev.map((sig, idx) =>
            idx === draggedSigIndex
                ? {
                    ...sig, x: Math.max(0, Math.min(x, pdfDimensions.width - sig.width)),
                    y: Math.max(0, Math.min(y, pdfDimensions.height - sig.height))
                }
                : sig
        ));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedSigIndex(null);
    };

    const handleRemoveSignature = (index) => {
        setSignatures(prev => prev.filter((_, idx) => idx !== index));
        toast.success('Signature removed');
    };

    const handleSaveAllSignatures = async () => {
        if (signatures.length === 0) {
            toast.error('Please add at least one signature');
            return;
        }

        const toastId = toast.loading('Saving signatures...');
        try {
            // Save each signature
            for (const sig of signatures) {
                if (sig.page === pageNumber) {
                    // Convert screen coordinates to PDF coordinates
                    const pdfY = pdfDimensions.height - sig.y - sig.height;

                    await api.post('/signatures/sign', {
                        documentId: id,
                        signatureData: sig.data,
                        x: sig.x / scale,
                        y: pdfY / scale,
                        pageNumber: sig.page,
                    });
                }
            }
            toast.success('Document signed successfully!', { id: toastId });
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error('Error signing', error);
            const errorMessage = error.response?.data || error.message || 'Failed to sign document';
            toast.error(`Error: ${errorMessage}`, { id: toastId });
        }
    };

    const currentPageSignatures = signatures.filter(sig => sig.page === pageNumber);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster position="top-right" />
            <Navbar />

            <div className="flex-1 flex flex-col p-4">
                {/* Top Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddSignature}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                                <PenTool size={20} />
                                Add Signature
                            </button>
                            <button
                                onClick={handleSaveAllSignatures}
                                disabled={signatures.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium ${signatures.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <Save size={20} />
                                Save Document
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                                className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
                                {Math.round(scale * 100)}%
                            </span>
                            <button
                                onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                                className="p-2 border border-gray-300 rounded hover:bg-gray-100"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto flex flex-col items-center">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : pdfFile && (
                        <div
                            className="relative inline-block border border-gray-300 bg-white"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <Document
                                file={pdfFile}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="flex justify-center"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    onLoadSuccess={onPageLoadSuccess}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    scale={scale}
                                />
                            </Document>

                            {/* Signature overlays */}
                            <div className="absolute inset-0 pointer-events-none">
                                {currentPageSignatures.map((sig, index) => (
                                    <div
                                        key={sig.id}
                                        className="absolute border-2 border-blue-500 bg-white bg-opacity-50 cursor-move pointer-events-auto group"
                                        style={{
                                            left: `${sig.x}px`,
                                            top: `${sig.y}px`,
                                            width: `${sig.width}px`,
                                            height: `${sig.height}px`,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(signatures.indexOf(sig), e)}
                                    >
                                        <img src={sig.data} alt="signature" className="w-full h-full object-contain" />
                                        <button
                                            onClick={() => handleRemoveSignature(signatures.indexOf(sig))}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Page Navigation */}
                {numPages && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
                        <div className="flex items-center justify-center gap-4">
                            <button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(pageNumber - 1)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                            >
                                <ChevronLeft size={20} />
                                Previous
                            </button>
                            <span className="px-4 py-2 bg-gray-50 rounded-lg font-medium">
                                Page {pageNumber} of {numPages}
                            </span>
                            <button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber(pageNumber + 1)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                            >
                                Next
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Signature Modal */}
            <SignatureModal
                isOpen={isSignatureModalOpen}
                onClose={() => setIsSignatureModalOpen(false)}
                onSave={handleSignatureSave}
            />
        </div>
    );
};

export default SignDocument;
