'use client';

import { useState, useEffect } from 'react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  brandName: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, brandName }: PDFViewerModalProps) {
  const [showIframe, setShowIframe] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setShowIframe(true);
      setLoadingTime(0);
      
      // Start loading timer
      const timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-show fallback options after 5 seconds
      const fallbackTimer = setTimeout(() => {
        console.log(`PDF taking time to load for ${brandName}, showing options`);
      }, 5000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isOpen, brandName]);

  const openInNewTab = () => {
    console.log(`Opening ${brandName} PDF in new tab: ${pdfUrl}`);
    try {
      // Method 1: Direct window.open
      const newTab = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      if (newTab) {
        newTab.focus();
        return;
      }
      
      // Method 2: Create link and click
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('New tab failed:', error);
      downloadPDF();
    }
  };

  const downloadPDF = () => {
    console.log(`Downloading ${brandName} PDF: ${pdfUrl}`);
    try {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${brandName}-Catalog.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Show direct link as last resort
      window.location.href = pdfUrl;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + pdfUrl).then(() => {
      alert('PDF link copied to clipboard!');
    }).catch(() => {
      alert(`PDF Link: ${window.location.origin + pdfUrl}`);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {brandName} Product Catalog
            </h2>
            <p className="text-sm text-gray-600">
              Loading time: {loadingTime}s
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={openInNewTab}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
            >
              <i className="ri-external-link-line mr-2"></i>
              Open in New Tab
            </button>
            <button
              onClick={downloadPDF}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
            >
              <i className="ri-download-line mr-2"></i>
              Download
            </button>
            <button
              onClick={copyLink}
              className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center font-medium"
            >
              <i className="ri-link mr-2"></i>
              Copy Link
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-200 rounded"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-100">
          {showIframe ? (
            <>
              {/* Loading overlay */}
              {loadingTime < 3 && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Loading {brandName} Catalog</p>
                    <p className="text-gray-600 mb-4">Please wait while we load your PDF...</p>
                    <div className="space-x-2">
                      <button
                        onClick={openInNewTab}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Try New Tab
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Download Instead
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* PDF iframe with multiple fallback sources */}
              <iframe
                src={pdfUrl}
                className="w-full h-full border-none"
                title={`${brandName} Product Catalog`}
                onLoad={() => console.log(`PDF loaded for ${brandName}`)}
                onError={() => {
                  console.log(`PDF iframe failed for ${brandName}`);
                  setShowIframe(false);
                }}
              />
            </>
          ) : (
            /* Fallback when iframe fails */
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 max-w-md">
                <div className="text-6xl text-blue-500 mb-6">
                  <i className="ri-file-pdf-line"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {brandName} Catalog
                </h3>
                <p className="text-gray-600 mb-6">
                  The PDF viewer couldn't load in this browser. Please use one of the options below to access the catalog:
                </p>
                <div className="space-y-3">
                  <button
                    onClick={openInNewTab}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <i className="ri-external-link-line mr-3"></i>
                    Open in New Tab
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <i className="ri-download-line mr-3"></i>
                    Download PDF
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <i className="ri-link mr-3"></i>
                    Copy Direct Link
                  </button>
                  <button
                    onClick={() => setShowIframe(true)}
                    className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
                  >
                    <i className="ri-refresh-line mr-3"></i>
                    Try Again
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Direct URL: {window.location.origin + pdfUrl}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}