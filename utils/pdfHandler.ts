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

      // Method 1: Try to open in new tab with PDF viewer
      const openedInTab = this.openInNewTab(pdfUrl);
      if (openedInTab) {
        onSuccess?.();
        return;
      }

      // Method 2: Check if PDF exists and try blob URL for inline viewing
      try {
        const exists = await this.checkPDFExists(pdfUrl);
        if (exists) {
          const blob = await this.downloadPDFAsBlob(pdfUrl);
          const blobURL = this.createBlobURL(blob);
          
          // Try to open blob URL in new tab for inline viewing
          const openedBlobInTab = this.openInNewTab(blobURL);
          if (openedBlobInTab) {
            onSuccess?.();
            // Clean up blob URL after a delay
            setTimeout(() => URL.revokeObjectURL(blobURL), 30000);
            return;
          }
          
          // Clean up blob URL if opening failed
          URL.revokeObjectURL(blobURL);
        }
      } catch (blobError) {
        console.warn('Blob method failed, trying modal viewer:', blobError);
      }

      // Method 3: If direct opening fails, show modal viewer for inline viewing
      // This will be handled by the calling component
      throw new Error('Direct PDF opening failed - use modal viewer');

    } catch (error) {
      console.log('PDF opening methods exhausted, falling back to modal viewer');
      // Don't show error - let the modal viewer handle it
      onError?.('SHOW_MODAL');
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