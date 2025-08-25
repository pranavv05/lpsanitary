/**
 * Robust PDF Handler Utility
 * Provides multiple fallback methods for opening PDFs with enhanced reliability
 */

export interface PDFHandlerOptions {
  onLoading?: (loading: boolean) => void;
  onError?: (error: string) => void;
  onSuccess?: () => void;
  preferModal?: boolean; // New option to prefer modal over new tab
}

export class PDFHandler {
  private static async checkPDFExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const contentType = response.headers.get('content-type');
      return response.ok && (contentType?.includes('pdf') || url.toLowerCase().endsWith('.pdf'));
    } catch (error) {
      console.warn('PDF existence check failed:', error);
      return false;
    }
  }

  private static async downloadPDFAsBlob(url: string): Promise<Blob> {
    try {
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Empty PDF file');
      }
      return blob;
    } catch (error) {
      console.error('Failed to download PDF as blob:', error);
      throw error;
    }
  }

  private static createBlobURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  private static openInNewTab(url: string): boolean {
    try {
      // Enhanced new tab opening with better popup detection
      const newWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=800');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        return false;
      }
      
      // Set the URL after opening to avoid issues
      newWindow.location.href = url;
      
      // Check if window is still open after a brief delay
      setTimeout(() => {
        if (newWindow.closed) {
          console.warn('New window was closed by popup blocker');
        }
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Failed to open in new tab:', error);
      return false;
    }
  }

  private static triggerDownload(url: string, filename: string): void {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Ensure the link is not visible
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error('Download trigger failed:', error);
      // Fallback: try direct navigation
      window.location.href = url;
    }
  }

  private static navigateToURL(url: string): void {
    try {
      window.location.href = url;
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }

  public static async openPDF(
    pdfUrl: string, 
    brandName: string, 
    options: PDFHandlerOptions = {}
  ): Promise<void> {
    const { onLoading, onError, onSuccess, preferModal = false } = options;
    
    try {
      onLoading?.(true);
      
      // If user prefers modal or we're on mobile, skip new tab attempt
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (!preferModal && !isMobile) {
        // Method 1: Try direct PDF opening in new tab
        console.log(`Attempting to open ${brandName} catalog in new tab...`);
        const directTabOpened = this.openInNewTab(pdfUrl);
        
        if (directTabOpened) {
          console.log(`Successfully opened ${brandName} catalog in new tab`);
          onSuccess?.();
          return;
        }
        
        console.log('Direct tab opening failed, trying blob method...');
        
        // Method 2: Try blob URL approach for better compatibility
        try {
          const exists = await this.checkPDFExists(pdfUrl);
          if (exists) {
            console.log(`PDF exists, downloading ${brandName} catalog as blob...`);
            const blob = await this.downloadPDFAsBlob(pdfUrl);
            const blobURL = this.createBlobURL(blob);
            
            const blobTabOpened = this.openInNewTab(blobURL);
            if (blobTabOpened) {
              console.log(`Successfully opened ${brandName} catalog via blob URL`);
              onSuccess?.();
              // Clean up blob URL after a delay
              setTimeout(() => {
                URL.revokeObjectURL(blobURL);
                console.log('Blob URL cleaned up');
              }, 60000); // Longer delay for large files
              return;
            }
            
            // Clean up blob URL if opening failed
            URL.revokeObjectURL(blobURL);
            console.log('Blob tab opening failed');
          } else {
            console.warn(`PDF existence check failed for ${brandName}`);
          }
        } catch (blobError) {
          console.warn(`Blob method failed for ${brandName}:`, blobError);
        }
      }

      // Method 3: Fall back to modal viewer
      console.log(`Using modal viewer for ${brandName} catalog`);
      onError?.('SHOW_MODAL');

    } catch (error) {
      console.error(`Error opening ${brandName} catalog:`, error);
      onError?.('SHOW_MODAL');
    } finally {
      onLoading?.(false);
    }
  }

  /**
   * Alternative method: Create an embedded PDF viewer with enhanced options
   */
  public static createEmbeddedViewer(
    pdfUrl: string, 
    container: HTMLElement,
    options: { width?: string; height?: string; onLoad?: () => void; onError?: () => void } = {}
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    
    // Enhanced PDF URL with viewer parameters
    const enhancedUrl = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH&zoom=page-fit`;
    iframe.src = enhancedUrl;
    iframe.style.width = options.width || '100%';
    iframe.style.height = options.height || '600px';
    iframe.style.border = 'none';
    iframe.title = 'PDF Viewer';
    iframe.setAttribute('loading', 'lazy');
    
    // Add event listeners
    if (options.onLoad) {
      iframe.onload = options.onLoad;
    }
    if (options.onError) {
      iframe.onerror = options.onError;
    }
    
    container.appendChild(iframe);
    return iframe;
  }
  
  /**
   * Force download method as a last resort
   */
  public static forceDownload(pdfUrl: string, brandName: string): void {
    console.log(`Force downloading ${brandName} catalog...`);
    this.triggerDownload(pdfUrl, `${brandName}-Catalog.pdf`);
  }
  
  /**
   * Check if browser supports PDF viewing
   */
  public static supportsPDFViewing(): boolean {
    // Check if browser has native PDF support
    const hasPDFSupport = navigator.mimeTypes && navigator.mimeTypes.namedItem('application/pdf');
    const hasPlugins = navigator.plugins && navigator.plugins.length > 0;
    
    return !!(hasPDFSupport || hasPlugins || 'chrome' in window);
  }
}

/**
 * Simple function for easy integration with enhanced defaults
 */
export const openPDFCatalog = async (
  pdfUrl: string, 
  brandName: string, 
  options?: PDFHandlerOptions
): Promise<void> => {
  // Add default options for better user experience
  const defaultOptions: PDFHandlerOptions = {
    preferModal: false, // Prefer new tab by default
    ...options
  };
  
  return PDFHandler.openPDF(pdfUrl, brandName, defaultOptions);
};

/**
 * Utility function to open PDF with modal preference
 */
export const openPDFInModal = async (
  pdfUrl: string, 
  brandName: string, 
  options?: PDFHandlerOptions
): Promise<void> => {
  const modalOptions: PDFHandlerOptions = {
    preferModal: true,
    ...options
  };
  
  return PDFHandler.openPDF(pdfUrl, brandName, modalOptions);
};

/**
 * Utility function to force download
 */
export const downloadPDFCatalog = (pdfUrl: string, brandName: string): void => {
  PDFHandler.forceDownload(pdfUrl, brandName);
};