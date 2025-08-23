/**
 * Robust PDF Handler Utility
 * Provides multiple fallback methods for opening PDFs
 */

export interface PDFHandlerOptions {
  onLoading?: (loading: boolean) => void;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export class PDFHandler {
  private static async checkPDFExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && (contentType?.includes('pdf') ?? false);
    } catch {
      return false;
    }
  }

  private static async downloadPDFAsBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  }

  private static createBlobURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  private static openInNewTab(url: string): boolean {
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      return !(!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined');
    } catch {
      return false;
    }
  }

  private static triggerDownload(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static navigateToURL(url: string): void {
    window.location.href = url;
  }

  public static async openPDF(
    pdfUrl: string, 
    brandName: string, 
    options: PDFHandlerOptions = {}
  ): Promise<void> {
    const { onLoading, onError, onSuccess } = options;
    
    try {
      onLoading?.(true);

      // Method 1: Check if PDF exists
      const exists = await this.checkPDFExists(pdfUrl);
      if (!exists) {
        throw new Error('PDF file not found or inaccessible');
      }

      // Method 2: Try to open in new tab first
      const openedInTab = this.openInNewTab(pdfUrl);
      if (openedInTab) {
        onSuccess?.();
        return;
      }

      // Method 3: Download as blob and create object URL
      try {
        const blob = await this.downloadPDFAsBlob(pdfUrl);
        const blobURL = this.createBlobURL(blob);
        
        const openedBlobInTab = this.openInNewTab(blobURL);
        if (openedBlobInTab) {
          onSuccess?.();
          // Clean up blob URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobURL), 30000);
          return;
        }

        // Method 4: Trigger download
        this.triggerDownload(blobURL, `${brandName}-Catalog.pdf`);
        onSuccess?.();
        
        // Clean up blob URL
        setTimeout(() => URL.revokeObjectURL(blobURL), 5000);
        return;
        
      } catch (blobError) {
        console.warn('Blob method failed:', blobError);
      }

      // Method 5: Direct navigation fallback
      this.navigateToURL(pdfUrl);
      onSuccess?.();

    } catch (error) {
      console.error('All PDF opening methods failed:', error);
      const errorMessage = `Unable to open ${brandName} catalog. Please try again or contact support.`;
      onError?.(errorMessage);
    } finally {
      onLoading?.(false);
    }
  }

  /**
   * Alternative method: Create an embedded PDF viewer
   */
  public static createEmbeddedViewer(
    pdfUrl: string, 
    container: HTMLElement,
    options: { width?: string; height?: string } = {}
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    iframe.src = pdfUrl;
    iframe.style.width = options.width || '100%';
    iframe.style.height = options.height || '600px';
    iframe.style.border = 'none';
    iframe.title = 'PDF Viewer';
    
    container.appendChild(iframe);
    return iframe;
  }
}

/**
 * Simple function for easy integration
 */
export const openPDFCatalog = async (
  pdfUrl: string, 
  brandName: string, 
  options?: PDFHandlerOptions
): Promise<void> => {
  return PDFHandler.openPDF(pdfUrl, brandName, options);
};