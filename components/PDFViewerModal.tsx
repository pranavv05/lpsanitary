'use client';

import { useState, useEffect } from 'react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  brandName: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, brandName }: PDFViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('PDF viewer not available. Use the buttons below to open or download the catalog.');
  };

  const openInNewTab = () => {
    try {
      const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // If popup is blocked, try direct navigation
        window.location.href = pdfUrl;
      }
    } catch (error) {
      console.error('Failed to open in new tab:', error);
      // Fallback to download
      downloadPDF();
    }
  };

  const downloadPDF = () => {
    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${brandName}-Catalog.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Unable to download. Please try opening in a new tab.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {brandName} Product Catalog
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={openInNewTab}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              title="Open in new tab"
            >
              <i className="ri-external-link-line mr-1"></i>
              New Tab
            </button>
            <button
              onClick={downloadPDF}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              title="Download PDF"
            >
              <i className="ri-download-line mr-1"></i>
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading catalog...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center p-8">
                <div className="text-yellow-500 text-4xl mb-4">
                  <i className="ri-information-line"></i>
                </div>
                <p className="text-gray-700 mb-4">{error}</p>
                <div className="space-x-4">
                  <button
                    onClick={openInNewTab}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    Open in New Tab
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Try multiple iframe approaches for better compatibility */}
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
            className="w-full h-full border-none"
            title={`${brandName} Product Catalog`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ minHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}