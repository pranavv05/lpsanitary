'use client';

import { useState, useEffect } from 'react';
import { getDownloadUrl } from '@/config/cloudConfig';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  brandName: string;
  filename?: string; // Add filename for better download handling
}

export default function PDFViewerModal({ isOpen, onClose, pdfUrl, brandName, filename }: PDFViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleDownload = async () => {
    try {
      console.log(`📥 Downloading ${brandName} catalog`);
      
      // Use download URL if filename is provided (for Google Drive)
      const downloadUrl = filename ? getDownloadUrl(filename) : pdfUrl;
      
      // For Google Drive, we'll open the download URL in a new tab
      // as it handles the download automatically
      if (downloadUrl.includes('drive.google.com/uc?export=download')) {
        window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        console.log(`✅ Google Drive download initiated for ${brandName}`);
        return;
      }
      
      // For other providers, try blob download
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }
      
      const blob = await response.blob();
      const downloadUrlBlob = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrlBlob;
      link.download = `${brandName}-Catalog.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrlBlob);
      }, 30000);
      
      console.log(`✅ Download initiated for ${brandName}`);
    } catch (error) {
      console.error(`❌ Download failed for ${brandName}:`, error);
      // Fallback to opening in new tab
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl transition-all duration-300 w-[95vw] h-[90vh] max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="ri-file-pdf-line text-xl text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{brandName} Catalog</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download PDF"
            >
              <i className="ri-download-line text-gray-600"></i>
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-[calc(100%-80px)]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-600">Loading PDF...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a moment for large files</p>
              </div>
            </div>
          )}

          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-error-warning-line text-2xl text-red-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Display PDF</h3>
                <p className="text-gray-600 mb-6">
                  The PDF viewer couldn't load. You can download the PDF instead:
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={`${brandName} Catalog`}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>
      </div>
    </div>
  );
}