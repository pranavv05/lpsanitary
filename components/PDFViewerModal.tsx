'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  brandName: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, brandName }: PDFViewerModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showError, setShowError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIframeLoaded(false);
      setShowError(false);
    }
  }, [isOpen, pdfUrl]);

  const handleIframeLoad = () => {
    console.log(`PDF loaded successfully for ${brandName}`);
    setIframeLoaded(true);
    setShowError(false);
  };

  const handleIframeError = () => {
    console.log(`PDF iframe failed for ${brandName}, showing alternative options`);
    setShowError(true);
    setIframeLoaded(true); // Hide loading state
  };

  const openInNewTab = () => {
    try {
      console.log(`Opening ${brandName} catalog in new tab`);
      // Use window.open with the PDF URL directly
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow) {
        // If popup is blocked, try a different approach
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to open in new tab:', error);
      // Fallback to download
      downloadPDF();
    }
  };

  const downloadPDF = () => {
    try {
      console.log(`Downloading ${brandName} catalog`);
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
      alert(`Unable to download ${brandName} catalog. Please try the direct link: ${pdfUrl}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {brandName} Product Catalog
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              PDF Catalog Viewer
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={openInNewTab}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              title="Open in new tab"
            >
              <i className="ri-external-link-line mr-2"></i>
              New Tab
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              title="Download PDF"
            >
              <i className="ri-download-line mr-2"></i>
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1 hover:bg-gray-200 rounded"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-gray-100">
          {/* Loading indicator */}
          {!iframeLoaded && !showError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-800 font-medium mb-2">Loading {brandName} Catalog</p>
                <p className="text-gray-600 text-sm">Please wait...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {showError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center p-8 max-w-md">
                <div className="text-blue-500 text-4xl mb-4">
                  <i className="ri-file-pdf-line"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  PDF Viewer Not Available
                </h3>
                <p className="text-gray-700 text-sm mb-4">
                  The built-in PDF viewer couldn't load the catalog. Please use one of the options below:
                </p>
                <div className="space-y-3">
                  <button
                    onClick={openInNewTab}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <i className="ri-external-link-line mr-2"></i>
                    Open in New Tab
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF iframe */}
          <iframe
            ref={iframeRef}
            src={pdfUrl}
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