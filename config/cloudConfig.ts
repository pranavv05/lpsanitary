// Cloud Storage Configuration for PDF Catalogs
// Choose your preferred cloud storage provider and update the base URL

export interface CloudCatalog {
  name: string;
  filename: string;
  size: string;
  cloudUrl: string;
  warning?: boolean;
  storage?: 'cloudinary' | 's3' | 'github' | 'gdrive' | 'local'; // Added Google Drive for students
}

// ========================================
// CLOUD STORAGE OPTIONS
// ========================================

// Option 1: AWS S3 + CloudFront (Recommended for performance)
const AWS_S3_CONFIG = {
  baseUrl: 'https://your-bucket-name.s3.amazonaws.com/catalogs',
  // Alternative with CloudFront CDN for better performance:
  // baseUrl: 'https://your-cloudfront-domain.cloudfront.net/catalogs'
};

// Option 2: Google Cloud Storage
const GOOGLE_CLOUD_CONFIG = {
  baseUrl: 'https://storage.googleapis.com/your-bucket-name/catalogs'
};

// Option 3: Azure Blob Storage
const AZURE_BLOB_CONFIG = {
  baseUrl: 'https://yourstorageaccount.blob.core.windows.net/catalogs'
};

// Option 4: Cloudinary (Easy setup, good for small to medium files)
const CLOUDINARY_BASE_CONFIG = {
  baseUrl: 'https://res.cloudinary.com/your-cloud-name/raw/upload/catalogs',
  maxSize: 10 // MB - free tier limit
  // Alternative with automatic optimization:
  // baseUrl: 'https://res.cloudinary.com/your-cloud-name/image/upload/f_auto,q_auto/catalogs'
};

// Option 5: Firebase Storage
const FIREBASE_CONFIG = {
  baseUrl: 'https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/catalogs'
};

// ========================================
// CURRENT CONFIGURATION
// ========================================

// 🔧 HYBRID CLOUD CONFIGURATION
// Small files (≤10MB): Cloudinary (free tier)
// Large files (>10MB): AWS S3, GitHub, or Google Drive (student-friendly)
const CURRENT_CLOUD_CONFIG = {
  cloudinary: {
    baseUrl: 'https://res.cloudinary.com/your-cloud-name/raw/upload/catalogs',
    maxSize: 10 // MB
  },
  s3: {
    baseUrl: 'https://your-bucket-name.s3.amazonaws.com/catalogs'
    // Alternative: 'https://your-cloudfront-domain.cloudfront.net/catalogs'
  },
  github: {
    baseUrl: 'https://github.com/your-username/lpsanitary-catalogs/raw/main'
    // Student-friendly alternative to S3 (no bank details required)
  },
  gdrive: {
    // Google Drive viewer URLs for inline viewing (no download)
    // Format: https://drive.google.com/file/d/FILE_ID/preview
    viewerUrl: 'https://drive.google.com/file/d/',
    // Alternative download URLs if needed
    downloadUrl: 'https://drive.google.com/uc?export=download&id='
  },
  provider: 'gdrive-hybrid' as 'hybrid' | 'cloudinary-only' | 's3-only' | 'github-hybrid' | 'gdrive-hybrid' // Best for students - no bank details needed!
};

// ========================================
// CATALOG CONFIGURATION
// ========================================

// 🗺 GOOGLE DRIVE FILE ID MAPPING
// Map each filename to its Google Drive file ID for direct viewing
const GOOGLE_DRIVE_FILE_IDS: Record<string, string> = {
  // ✅ CONFIGURED WITH ACTUAL GOOGLE DRIVE FILE IDs:
  // Extract file ID from Google Drive sharing link: https://drive.google.com/file/d/FILE_ID_HERE/view
  
  'Roff-Product-Catalogue.pdf': '1s6Rv4jPIVIb_cVqxR2tkfWcFCBikNHhR',        // ✅ Roff
  'cera.pdf': '1cMH0C-rAOlo6ULexIyhAgIhh5tjEGtIp',                 // ✅ Cera
  'Nirali.pdf': '16nPip-_XEYtOW1fWaAZZXMPZ7nE_i79l',               // ✅ Nirali
  'karoma_product_brochure_01.pdf': '1GOnHG1rNzElbP5M-bb8m0rMVAbwj5GgM',  // ✅ Karoma
  'brochure_steelera_2023-24.pdf': '1qJBB3YbFacMBpGihDHDDFU6ebN-CYDsu', // ✅ Steellera
  'JAQUAR_CATLOUGE.pdf': '1byNkyNTRiHNGXV_jwBXtfxNniwQ6Y_i7',     // ✅ Jaquar
  'Blues_Catalougeupdated.pdf': '1qGSxaHy7yXzyFFsB8olylXgiNMxhMUox'  // ✅ Blues
};

// 🎯 GET GOOGLE DRIVE URLS FOR VIEWING AND DOWNLOADING
const getGoogleDriveUrls = (fileId: string) => {
  return {
    // For inline viewing in iframe (this is what we'll use for the modal)
    viewerUrl: `${CURRENT_CLOUD_CONFIG.gdrive.viewerUrl}${fileId}/preview`,
    // For direct download if needed
    downloadUrl: `${CURRENT_CLOUD_CONFIG.gdrive.downloadUrl}${fileId}`,
    // For opening in Google Drive's web interface
    webUrl: `https://drive.google.com/file/d/${fileId}/view`
  };
};

// 🗺 SMART STORAGE ASSIGNMENT
// All files use Google Drive viewer for inline viewing
const getStorageUrl = (filename: string, sizeMB: number): string => {
  if (CURRENT_CLOUD_CONFIG.provider === 'cloudinary-only') {
    return `${CURRENT_CLOUD_CONFIG.cloudinary.baseUrl}/${filename}`;
  }
  if (CURRENT_CLOUD_CONFIG.provider === 's3-only') {
    return `${CURRENT_CLOUD_CONFIG.s3.baseUrl}/${filename}`;
  }
  if (CURRENT_CLOUD_CONFIG.provider === 'github-hybrid') {
    // GitHub hybrid: small files to Cloudinary, large files to GitHub
    return sizeMB <= CURRENT_CLOUD_CONFIG.cloudinary.maxSize 
      ? `${CURRENT_CLOUD_CONFIG.cloudinary.baseUrl}/${filename}`
      : `${CURRENT_CLOUD_CONFIG.github.baseUrl}/${filename}`;
  }
  if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid') {
    // Google Drive hybrid: all files from Google Drive viewer (perfect for inline viewing)
    const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
    if (!fileId || fileId.includes('YOUR_')) {
      console.warn(`⚠️ Google Drive file ID not configured for ${filename}`);
      return `#missing-file-id-for-${filename}`; // This will help identify missing IDs
    }
    // Return viewer URL for inline viewing in modal
    return getGoogleDriveUrls(fileId).viewerUrl;
  }
  // Default hybrid: use Cloudinary for small files, S3 for large files
  return sizeMB <= CURRENT_CLOUD_CONFIG.cloudinary.maxSize 
    ? `${CURRENT_CLOUD_CONFIG.cloudinary.baseUrl}/${filename}`
    : `${CURRENT_CLOUD_CONFIG.s3.baseUrl}/${filename}`;
};

// 🎯 DETERMINE STORAGE TYPE BASED ON PROVIDER
const getStorageType = (sizeMB: number): 'cloudinary' | 's3' | 'github' | 'gdrive' | 'local' => {
  if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid') {
    return 'gdrive'; // All files from Google Drive
  }
  if (CURRENT_CLOUD_CONFIG.provider === 'github-hybrid') {
    return sizeMB <= CURRENT_CLOUD_CONFIG.cloudinary.maxSize ? 'cloudinary' : 'github';
  }
  if (CURRENT_CLOUD_CONFIG.provider === 'cloudinary-only') {
    return 'cloudinary';
  }
  if (CURRENT_CLOUD_CONFIG.provider === 's3-only') {
    return 's3';
  }
  // Default hybrid (Cloudinary + S3)
  return sizeMB <= CURRENT_CLOUD_CONFIG.cloudinary.maxSize ? 'cloudinary' : 's3';
};

export const cloudCatalogs: CloudCatalog[] = [
  {
    name: 'Roff',
    filename: 'Roff-Product-Catalogue.pdf',
    size: '2 MB',
    cloudUrl: getStorageUrl('Roff-Product-Catalogue.pdf', 2),
    storage: getStorageType(2)
  },
  {
    name: 'Cera',
    filename: 'cera.pdf',
    size: '6 MB',
    cloudUrl: getStorageUrl('cera.pdf', 6),
    storage: getStorageType(6)
  },
  {
    name: 'Nirali',
    filename: 'Nirali.pdf',
    size: '8 MB',
    cloudUrl: getStorageUrl('Nirali.pdf', 8),
    storage: getStorageType(8)
  },
  {
    name: 'Karoma',
    filename: 'karoma_product_brochure_01.pdf',
    size: '21 MB',
    cloudUrl: getStorageUrl('karoma_product_brochure_01.pdf', 21),
    storage: getStorageType(21),
    warning: true
  },
  {
    name: 'Steellera',
    filename: 'brochure_steelera_2023-24.pdf',
    size: '32 MB',
    cloudUrl: getStorageUrl('brochure_steelera_2023-24.pdf', 32),
    storage: getStorageType(32),
    warning: true
  },
  {
    name: 'Jaquar',
    filename: 'JAQUAR_CATLOUGE.pdf',
    size: '60 MB',
    cloudUrl: getStorageUrl('JAQUAR_CATLOUGE.pdf', 60),
    storage: getStorageType(60),
    warning: true
  },
  {
    name: 'Blues',
    filename: 'Blues_Catalougeupdated.pdf',
    size: '76 MB',
    cloudUrl: getStorageUrl('Blues_Catalougeupdated.pdf', 76),
    storage: getStorageType(76),
    warning: true
  }
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getCloudUrl = (filename: string, sizeMB?: number): string => {
  if (!sizeMB) {
    // Default to Google Drive if size unknown and using gdrive-hybrid
    if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid') {
      const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
      if (fileId && !fileId.includes('YOUR_')) {
        return getGoogleDriveUrls(fileId).viewerUrl;
      }
    }
    return `${CURRENT_CLOUD_CONFIG.s3.baseUrl}/${filename}`;
  }
  return getStorageUrl(filename, sizeMB);
};

// 📥 GET DOWNLOAD URL (separate from viewer URL)
export const getDownloadUrl = (filename: string): string => {
  if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid') {
    const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
    if (fileId && !fileId.includes('YOUR_')) {
      return getGoogleDriveUrls(fileId).downloadUrl;
    }
  }
  // Fallback to the same URL for other providers
  return getCloudUrl(filename);
};

// 🌐 GET WEB URL (for opening in Google Drive interface)
export const getWebUrl = (filename: string): string => {
  if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid') {
    const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
    if (fileId && !fileId.includes('YOUR_')) {
      return getGoogleDriveUrls(fileId).webUrl;
    }
  }
  // Fallback to the same URL for other providers
  return getCloudUrl(filename);
};

export const addNewCatalog = (catalog: Omit<CloudCatalog, 'cloudUrl'>): CloudCatalog => {
  const sizeMB = parseFloat(catalog.size);
  const storage = getStorageType(sizeMB);
  
  return {
    ...catalog,
    cloudUrl: getStorageUrl(catalog.filename, sizeMB),
    storage,
    warning: sizeMB > 20
  };
};

// 🔗 ADD GOOGLE DRIVE FILE ID
export const addGoogleDriveFile = (filename: string, fileId: string) => {
  GOOGLE_DRIVE_FILE_IDS[filename] = fileId;
  console.log(`✅ Added Google Drive file ID for ${filename}: ${fileId}`);
};

// ========================================
// CLOUD STORAGE SETUP INSTRUCTIONS
// ========================================

export const SETUP_INSTRUCTIONS = {
  aws: {
    steps: [
      '1. Create an S3 bucket in AWS',
      '2. Upload your PDF files to the bucket',
      '3. Make the bucket publicly readable or set up CloudFront',
      '4. Update CURRENT_CLOUD_CONFIG.baseUrl with your S3/CloudFront URL',
      '5. Set CURRENT_CLOUD_CONFIG.provider to "aws"'
    ],
    example: 'https://my-catalogs.s3.amazonaws.com/catalogs'
  },
  google: {
    steps: [
      '1. Create a Google Cloud Storage bucket',
      '2. Upload your PDF files',
      '3. Make the bucket publicly accessible',
      '4. Update CURRENT_CLOUD_CONFIG.baseUrl with your GCS URL',
      '5. Set CURRENT_CLOUD_CONFIG.provider to "google"'
    ],
    example: 'https://storage.googleapis.com/my-catalogs/catalogs'
  },
  cloudinary: {
    steps: [
      '1. Sign up for Cloudinary account',
      '2. Upload PDFs to a "catalogs" folder',
      '3. Update CURRENT_CLOUD_CONFIG.baseUrl with your Cloudinary URL',
      '4. Set CURRENT_CLOUD_CONFIG.provider to "cloudinary"'
    ],
    example: 'https://res.cloudinary.com/my-account/raw/upload/catalogs'
  }
};

// Current configuration status
export const isConfigured = (): boolean => {
  const cloudinaryConfigured = !CURRENT_CLOUD_CONFIG.cloudinary.baseUrl.includes('your-cloud-name');
  const s3Configured = !CURRENT_CLOUD_CONFIG.s3.baseUrl.includes('your-bucket-name');
  const githubConfigured = !CURRENT_CLOUD_CONFIG.github.baseUrl.includes('your-username');
  const gdriveConfigured = Object.values(GOOGLE_DRIVE_FILE_IDS).every(id => !id.includes('YOUR_'));
  
  switch (CURRENT_CLOUD_CONFIG.provider) {
    case 'cloudinary-only':
      return cloudinaryConfigured;
    case 's3-only':
      return s3Configured;
    case 'github-hybrid':
      return cloudinaryConfigured && githubConfigured; // Student-friendly option
    case 'gdrive-hybrid':
      return gdriveConfigured; // Best for students - no bank details needed
    case 'hybrid':
      return cloudinaryConfigured && s3Configured;
    default:
      return false;
  }
};

export const getConfigStatus = () => {
  const cloudinaryConfigured = !CURRENT_CLOUD_CONFIG.cloudinary.baseUrl.includes('your-cloud-name');
  const s3Configured = !CURRENT_CLOUD_CONFIG.s3.baseUrl.includes('your-bucket-name');
  const githubConfigured = !CURRENT_CLOUD_CONFIG.github.baseUrl.includes('your-username');
  const gdriveConfigured = Object.values(GOOGLE_DRIVE_FILE_IDS).every(id => !id.includes('YOUR_'));
  
  if (isConfigured()) {
    let storageMessage = '';
    switch (CURRENT_CLOUD_CONFIG.provider) {
      case 'github-hybrid':
        storageMessage = 'Using student-friendly storage (Cloudinary + GitHub)';
        break;
      case 'gdrive-hybrid':
        storageMessage = 'Using Google Drive (perfect for students - no bank details needed!)';
        break;
      case 'hybrid':
        storageMessage = 'Using hybrid storage (Cloudinary + S3)';
        break;
      default:
        storageMessage = `Using ${CURRENT_CLOUD_CONFIG.provider} storage`;
    }
    
    return {
      status: 'configured' as const,
      message: storageMessage,
      baseUrl: CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid' 
        ? 'Google Drive' 
        : CURRENT_CLOUD_CONFIG.cloudinary.baseUrl,
      provider: CURRENT_CLOUD_CONFIG.provider
    };
  } else {
    const missing = [];
    
    if (CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid' && !gdriveConfigured) {
      missing.push('Google Drive file IDs');
    } else {
      if (!cloudinaryConfigured) missing.push('Cloudinary cloud name');
      
      if (CURRENT_CLOUD_CONFIG.provider === 'github-hybrid' && !githubConfigured) {
        missing.push('GitHub username');
      } else if (CURRENT_CLOUD_CONFIG.provider === 'hybrid' && !s3Configured) {
        missing.push('S3 bucket');
      }
    }
    
    return {
      status: 'needs-setup' as const,
      message: `Missing: ${missing.join(', ')}`,
      instructions: CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid'
        ? 'Please update Google Drive file IDs in cloudConfig.ts'
        : 'Please update cloudConfig.ts with your cloud storage details',
      missing,
      isStudent: CURRENT_CLOUD_CONFIG.provider === 'github-hybrid' || CURRENT_CLOUD_CONFIG.provider === 'gdrive-hybrid'
    };
  }
};