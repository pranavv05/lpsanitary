'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  brandName: string;
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, brandName }: PDFViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [estimatedSize, setEstimatedSize] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      // Estimate file size based on brand name
      const sizeEstimates: { [key: string]: string } = {
        'Blues': '~76 MB - Large file, may take 30-60 seconds',
        'Jaquar': '~60 MB - Large file, may take 25-50 seconds', 
        'JAQUAR': '~60 MB - Large file, may take 25-50 seconds',
        'Steellera': '~32 MB - Medium file, may take 15-30 seconds',
        'Karoma': '~21 MB - Medium file, may take 10-25 seconds',
        'Nirali': '~8 MB - Small file, should load quickly',
        'Cera': '~6 MB - Small file, should load quickly',
        'Roff': '~2 MB - Very small, loads instantly'
      };
      
      setEstimatedSize(sizeEstimates[brandName] || 'Loading...');
      
      // Set a timeout for very large files (30 seconds)
      timeoutRef.current = setTimeout(() => {
        if (loading) {
          setError(`Large file taking longer than expected. You can still open it in a new tab or download it directly.`);
          setLoading(false);
        }
      }, 30000);
      
      // Simulate loading progress for user feedback
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 1000);
      
      return () => {
        clearTimeout(timeoutRef.current!);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, pdfUrl, brandName, loading]);

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
    setLoadingProgress(100);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
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
              <div className="text-center max-w-md px-6">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-800 font-medium mb-2">Loading {brandName} Catalog</p>
                <p className="text-gray-600 text-sm mb-4">{estimatedSize}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-500 text-xs">Taking too long?</p>
                  <div className="space-x-2">
                    <button
                      onClick={openInNewTab}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Open in New Tab
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Download Instead
                    </button>
                  </div>
                </div>
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