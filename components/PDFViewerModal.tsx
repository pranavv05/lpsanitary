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
  const [retryCount, setRetryCount] = useState(0);
  const [useAlternativeViewer, setUseAlternativeViewer] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);
      setRetryCount(0);
      setUseAlternativeViewer(false);
      
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
      
      // Set a timeout based on estimated file size
      const timeoutDuration = brandName === 'Blues' || brandName === 'Jaquar' || brandName === 'JAQUAR' ? 45000 : 30000;
      timeoutRef.current = setTimeout(() => {
        if (loading) {
          console.warn(`PDF loading timeout for ${brandName}`);
          setError(`The ${brandName} catalog is taking longer than expected to load. This might be due to the large file size (${sizeEstimates[brandName]?.split(' - ')[0] || 'unknown'}). You can try the alternative options below.`);
          setLoading(false);
        }
      }, timeoutDuration);
      
      // Simulate loading progress for user feedback
      progressRef.current = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 85) return prev;
          // Slower progress for larger files
          const increment = brandName === 'Blues' || brandName === 'Jaquar' ? Math.random() * 5 : Math.random() * 10;
          return Math.min(prev + increment, 85);
        });
      }, 1500);
      
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
      };
    }
  }, [isOpen, pdfUrl, brandName, loading]);

  const handleIframeLoad = () => {
    console.log(`PDF loaded successfully for ${brandName}`);
    setLoading(false);
    setError(null);
    setLoadingProgress(100);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
  };

  const handleIframeError = () => {
    console.error(`PDF loading error for ${brandName}`);
    setLoading(false);
    
    if (retryCount < 2 && !useAlternativeViewer) {
      // Try alternative viewer before showing error
      setRetryCount(prev => prev + 1);
      setUseAlternativeViewer(true);
      setError(null);
      setLoading(true);
      setLoadingProgress(0);
      
      console.log(`Retrying with alternative viewer for ${brandName} (attempt ${retryCount + 1})`);
    } else {
      setError(`Unable to display the ${brandName} catalog in the browser viewer. This might be due to browser compatibility or file size. Please use the options below to access the catalog.`);
    }
  };

  const openInNewTab = () => {
    try {
      console.log(`Opening ${brandName} catalog in new tab`);
      // Try enhanced new tab opening
      const newWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800,scrollbars=yes,toolbar=yes,menubar=yes');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // If popup is blocked, try direct navigation
        console.warn('Popup blocked, trying direct navigation');
        window.open(pdfUrl, '_blank');
        return;
      }
      
      // Set the URL after opening to avoid some popup blockers
      newWindow.location.href = pdfUrl;
      
      // Focus the new window
      newWindow.focus();
      
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
      
      // Ensure the link is not visible
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a brief delay
      setTimeout(() => {
        try {
          document.body.removeChild(link);
        } catch (e) {
          // Ignore if already removed
        }
      }, 100);
      
      // Show success message briefly
      setError(null);
      
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: try opening in same tab
      try {
        window.location.href = pdfUrl;
      } catch (navError) {
        alert(`Unable to download ${brandName} catalog. Please try opening in a new tab or contact support.`);
      }
    }
  };
  
  const retryLoading = () => {
    setError(null);
    setLoading(true);
    setLoadingProgress(0);
    setRetryCount(0);
    setUseAlternativeViewer(false);
    
    // Reload the iframe
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
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
                  <div className="space-x-2 space-y-1">
                    <button
                      onClick={openInNewTab}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <i className="ri-external-link-line mr-1"></i>
                      Open in New Tab
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <i className="ri-download-line mr-1"></i>
                      Download Instead
                    </button>
                    <button
                      onClick={() => setUseAlternativeViewer(!useAlternativeViewer)}
                      className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      <i className="ri-refresh-line mr-1"></i>
                      Try Alternative View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center p-8 max-w-md">
                <div className="text-yellow-500 text-4xl mb-4">
                  <i className="ri-information-line"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {brandName} Catalog Viewing Issue
                </h3>
                <p className="text-gray-700 text-sm mb-4">{error}</p>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={openInNewTab}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      <i className="ri-external-link-line mr-2"></i>
                      Open in New Tab
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      <i className="ri-download-line mr-2"></i>
                      Download PDF
                    </button>
                  </div>
                  <button
                    onClick={retryLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    Retry Loading
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    File size: {estimatedSize.split(' - ')[0] || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Try multiple iframe approaches for better compatibility */}
          <iframe
            ref={iframeRef}
            src={useAlternativeViewer ? 
              `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH` : 
              `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH&zoom=page-fit`
            }
            className="w-full h-full border-none"
            title={`${brandName} Product Catalog`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ minHeight: '600px' }}
            allow="fullscreen"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}