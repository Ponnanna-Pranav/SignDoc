import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X } from 'lucide-react';

const SignatureModal = ({ isOpen, onClose, onSave }) => {
    const [signatureType, setSignatureType] = useState('draw'); // draw, type, upload
    const [typedName, setTypedName] = useState('');
    const [selectedFont, setSelectedFont] = useState('Dancing Script');
    const signatureRef = useRef(null);

    const fonts = [
        'Dancing Script',
        'Great Vibes',
        'Pacifico',
        'Satisfy',
        'Allura'
    ];

    const handleClear = () => {
        if (signatureRef.current) {
            signatureRef.current.clear();
        }
    };

    const handleSave = () => {
        let signatureData = null;

        if (signatureType === 'draw' && signatureRef.current) {
            if (signatureRef.current.isEmpty()) {
                alert('Please draw your signature');
                return;
            }
            signatureData = signatureRef.current.toDataURL();
        } else if (signatureType === 'type') {
            if (!typedName.trim()) {
                alert('Please enter your name');
                return;
            }
            // Create canvas with typed signature
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `48px "${selectedFont}", cursive`;
            ctx.fillStyle = 'black';
            ctx.textBaseline = 'middle';
            ctx.fillText(typedName, 20, 50);
            signatureData = canvas.toDataURL();
        }

        if (signatureData) {
            onSave(signatureData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create Signature</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Signature Type Tabs */}
                <div className="flex gap-2 mb-4 border-b">
                    <button
                        onClick={() => setSignatureType('draw')}
                        className={`px-4 py-2 font-medium ${signatureType === 'draw'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-600'
                            }`}
                    >
                        Draw
                    </button>
                    <button
                        onClick={() => setSignatureType('type')}
                        className={`px-4 py-2 font-medium ${signatureType === 'type'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-600'
                            }`}
                    >
                        Type
                    </button>
                </div>

                {/* Draw Signature */}
                {signatureType === 'draw' && (
                    <div className="space-y-4">
                        <div className="border-2 border-gray-300 rounded-lg bg-white">
                            <SignatureCanvas
                                ref={signatureRef}
                                canvasProps={{
                                    className: 'w-full h-48 cursor-crosshair',
                                }}
                                backgroundColor="white"
                            />
                        </div>
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Clear
                        </button>
                    </div>
                )}

                {/* Type Signature */}
                {signatureType === 'type' && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={typedName}
                            onChange={(e) => setTypedName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full p-3 border border-gray-300 rounded text-lg"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Choose Font
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {fonts.map((font) => (
                                    <button
                                        key={font}
                                        onClick={() => setSelectedFont(font)}
                                        className={`p-4 border-2 rounded text-2xl ${selectedFont === font
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300'
                                            }`}
                                        style={{ fontFamily: `"${font}", cursive` }}
                                    >
                                        {typedName || 'Your Name'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Save Signature
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Google Fonts for signatures */}
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Pacifico&family=Satisfy&family=Allura&display=swap" rel="stylesheet" />
        </div>
    );
};

export default SignatureModal;
