import { CloudCatalog, cloudCatalogs, addNewCatalog, getConfigStatus } from '../config/cloudConfig';

/**
 * Utility functions for managing cloud storage catalogs
 */

// Validate a cloud URL
export const validateCloudUrl = async (url: string): Promise<{ valid: boolean; error?: string; size?: number }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      return { valid: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('pdf')) {
      return { valid: false, error: `Invalid content type: ${contentType}` };
    }
    
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength) : undefined;
    
    return { valid: true, size };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if file size should have a warning
export const shouldWarnFileSize = (sizeString: string): boolean => {
  const size = parseFloat(sizeString);
  const unit = sizeString.split(' ')[1]?.toUpperCase();
  
  if (unit === 'MB' && size > 20) return true;
  if (unit === 'GB') return true;
  
  return false;
};

// Add a new catalog with validation
export const addCatalogWithValidation = async (
  name: string,
  filename: string,
  cloudUrl: string
): Promise<{ success: boolean; catalog?: CloudCatalog; error?: string }> => {
  try {
    // Validate the cloud URL
    const validation = await validateCloudUrl(cloudUrl);
    
    if (!validation.valid) {
      return { success: false, error: `URL validation failed: ${validation.error}` };
    }
    
    // Format file size
    const size = validation.size ? formatFileSize(validation.size) : 'Unknown';
    const warning = shouldWarnFileSize(size);
    
    // Create the catalog entry
    const catalog = addNewCatalog({
      name,
      filename,
      size,
      warning
    });
    
    return { success: true, catalog };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Get catalog statistics
export const getCatalogStats = () => {
  const configStatus = getConfigStatus();
  const totalCatalogs = cloudCatalogs.length;
  const largeCatalogs = cloudCatalogs.filter(c => c.warning).length;
  
  return {
    configured: configStatus.status === 'configured',
    totalCatalogs,
    largeCatalogs,
    configStatus: configStatus.message
  };
};

// Test all catalog URLs
export const testAllCatalogs = async (): Promise<{
  total: number;
  successful: number;
  failed: Array<{ name: string; error: string }>;
}> => {
  const results = {
    total: cloudCatalogs.length,
    successful: 0,
    failed: [] as Array<{ name: string; error: string }>
  };
  
  for (const catalog of cloudCatalogs) {
    const validation = await validateCloudUrl(catalog.cloudUrl);
    
    if (validation.valid) {
      results.successful++;
    } else {
      results.failed.push({
        name: catalog.name,
        error: validation.error || 'Unknown error'
      });
    }
  }
  
  return results;
};

// Generate cloud storage setup commands
export const generateSetupCommands = (provider: 'aws' | 'google' | 'azure' | 'cloudinary') => {
  const commands = {
    aws: [
      'aws s3 mb s3://your-catalogs-bucket',
      'aws s3 cp public/resources/ s3://your-catalogs-bucket/catalogs/ --recursive --include=\"*.pdf\"',
      'aws s3api put-bucket-policy --bucket your-catalogs-bucket --policy file://bucket-policy.json'
    ],
    google: [
      'gsutil mb gs://your-catalogs-bucket',
      'gsutil cp -r public/resources/*.pdf gs://your-catalogs-bucket/catalogs/',
      'gsutil iam ch allUsers:objectViewer gs://your-catalogs-bucket'
    ],
    azure: [
      'az storage account create --name yourstorageaccount --resource-group yourgroup',
      'az storage container create --name catalogs --account-name yourstorageaccount',
      'az storage blob upload-batch -d catalogs -s public/resources --pattern \"*.pdf\"'
    ],
    cloudinary: [
      '// Use Cloudinary upload widget or API',
      '// Upload PDFs to \"catalogs\" folder',
      '// Get public URLs for each PDF'
    ]
  };
  
  return commands[provider] || [];
};

// Export all catalogs as JSON for backup
export const exportCatalogsConfig = () => {
  return {
    exportDate: new Date().toISOString(),
    configStatus: getConfigStatus(),
    catalogs: cloudCatalogs,
    stats: getCatalogStats()
  };
};