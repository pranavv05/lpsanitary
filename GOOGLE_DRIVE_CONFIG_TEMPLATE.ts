/**
 * 🎯 GOOGLE DRIVE CONFIGURATION TEMPLATE
 * 
 * Perfect for students - no bank details required!
 * 
 * Steps:
 * 1. Upload PDFs to Google Drive
 * 2. Share each PDF with "Anyone with the link" 
 * 3. Copy the file IDs from sharing links
 * 4. Replace the placeholders below
 * 5. Save this file as config/cloudConfig.ts
 */

export interface CloudCatalog {
  name: string;
  filename: string;
  size: string;
  cloudUrl: string;
  warning?: boolean;
  storage?: 'cloudinary' | 's3' | 'github' | 'gdrive' | 'local';
}

// 🔧 GOOGLE DRIVE CONFIGURATION
const GOOGLE_DRIVE_FILE_IDS: Record<string, string> = {
  // 📝 REPLACE THESE WITH YOUR ACTUAL GOOGLE DRIVE FILE IDs:
  // Get file ID from Google Drive sharing link: https://drive.google.com/file/d/FILE_ID_HERE/view
  
  'Roff-Product-Catalogue.pdf': 'YOUR_ROFF_FILE_ID_HERE',        // 👈 REPLACE
  'cera.pdf': 'YOUR_CERA_FILE_ID_HERE',                          // 👈 REPLACE  
  'Nirali.pdf': 'YOUR_NIRALI_FILE_ID_HERE',                      // 👈 REPLACE
  'karoma_product_brochure_01.pdf': 'YOUR_KAROMA_FILE_ID_HERE',  // 👈 REPLACE
  'brochure_steelera_2023-24.pdf': 'YOUR_STEELLERA_FILE_ID_HERE', // 👈 REPLACE
  'JAQUAR_CATLOUGE.pdf': 'YOUR_JAQUAR_FILE_ID_HERE',            // 👈 REPLACE
  'Blues_Catalougeupdated.pdf': 'YOUR_BLUES_FILE_ID_HERE'       // 👈 REPLACE
};

// 🎯 GET GOOGLE DRIVE URLS
const getGoogleDriveUrls = (fileId: string) => {
  return {
    // For viewing in modal (this is what users will see)
    viewerUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    // For downloading if needed
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    // For opening in Google Drive web interface
    webUrl: `https://drive.google.com/file/d/${fileId}/view`
  };
};

const CURRENT_CLOUD_CONFIG = {
  gdrive: {
    viewerUrl: 'https://drive.google.com/file/d/',
    downloadUrl: 'https://drive.google.com/uc?export=download&id='
  },
  provider: 'gdrive-hybrid' as const // Perfect for students!
};

// 📁 CATALOG CONFIGURATION
export const cloudCatalogs: CloudCatalog[] = [
  {
    name: 'Roff',
    filename: 'Roff-Product-Catalogue.pdf',
    size: '2 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['Roff-Product-Catalogue.pdf']).viewerUrl,
    storage: 'gdrive'
  },
  {
    name: 'Cera',
    filename: 'cera.pdf',
    size: '6 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['cera.pdf']).viewerUrl,
    storage: 'gdrive'
  },
  {
    name: 'Nirali',
    filename: 'Nirali.pdf',
    size: '8 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['Nirali.pdf']).viewerUrl,
    storage: 'gdrive'
  },
  {
    name: 'Karoma',
    filename: 'karoma_product_brochure_01.pdf',
    size: '21 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['karoma_product_brochure_01.pdf']).viewerUrl,
    storage: 'gdrive',
    warning: true
  },
  {
    name: 'Steellera',
    filename: 'brochure_steelera_2023-24.pdf',
    size: '32 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['brochure_steelera_2023-24.pdf']).viewerUrl,
    storage: 'gdrive',
    warning: true
  },
  {
    name: 'Jaquar',
    filename: 'JAQUAR_CATLOUGE.pdf',
    size: '60 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['JAQUAR_CATLOUGE.pdf']).viewerUrl,
    storage: 'gdrive',
    warning: true
  },
  {
    name: 'Blues',
    filename: 'Blues_Catalougeupdated.pdf',
    size: '76 MB',
    cloudUrl: getGoogleDriveUrls(GOOGLE_DRIVE_FILE_IDS['Blues_Catalougeupdated.pdf']).viewerUrl,
    storage: 'gdrive',
    warning: true
  }
];

// 🛠️ HELPER FUNCTIONS
export const getCloudUrl = (filename: string): string => {
  const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
  if (!fileId || fileId.includes('YOUR_')) {
    console.warn(`⚠️ Google Drive file ID not configured for ${filename}`);
    return `#missing-file-id-for-${filename}`;
  }
  return getGoogleDriveUrls(fileId).viewerUrl;
};

// 📥 GET DOWNLOAD URL (separate from viewer URL)
export const getDownloadUrl = (filename: string): string => {
  const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
  if (!fileId || fileId.includes('YOUR_')) {
    console.warn(`⚠️ Google Drive file ID not configured for ${filename}`);
    return `#missing-file-id-for-${filename}`;
  }
  return getGoogleDriveUrls(fileId).downloadUrl;
};

// 🌐 GET WEB URL (for opening in Google Drive interface)
export const getWebUrl = (filename: string): string => {
  const fileId = GOOGLE_DRIVE_FILE_IDS[filename];
  if (!fileId || fileId.includes('YOUR_')) {
    console.warn(`⚠️ Google Drive file ID not configured for ${filename}`);
    return `#missing-file-id-for-${filename}`;
  }
  return getGoogleDriveUrls(fileId).webUrl;
};

export const addNewCatalog = (catalog: Omit<CloudCatalog, 'cloudUrl'>): CloudCatalog => {
  return {
    ...catalog,
    cloudUrl: getCloudUrl(catalog.filename),
    storage: 'gdrive'
  };
};

// 🔍 CONFIGURATION STATUS
export const isConfigured = (): boolean => {
  return Object.values(GOOGLE_DRIVE_FILE_IDS).every(id => !id.includes('YOUR_'));
};

export const getConfigStatus = () => {
  const gdriveConfigured = Object.values(GOOGLE_DRIVE_FILE_IDS).every(id => !id.includes('YOUR_'));
  
  if (gdriveConfigured) {
    return {
      status: 'configured' as const,
      message: 'Using Google Drive (perfect for students - no bank details needed!)',
      baseUrl: 'Google Drive',
      provider: CURRENT_CLOUD_CONFIG.provider
    };
  } else {
    const missingCount = Object.values(GOOGLE_DRIVE_FILE_IDS).filter(id => id.includes('YOUR_')).length;
    
    return {
      status: 'needs-setup' as const,
      message: `Missing ${missingCount} Google Drive file IDs`,
      instructions: 'Please upload PDFs to Google Drive and update file IDs in cloudConfig.ts',
      missing: ['Google Drive file IDs'],
      isStudent: true
    };
  }
};

/**
 * 🚀 QUICK SETUP EXAMPLE:
 * 
 * 1. Upload "Roff-Product-Catalogue.pdf" to Google Drive
 * 2. Share it: Right-click → Share → "Anyone with the link"
 * 3. Copy sharing link: https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74mHJjDukA/view
 * 4. Extract file ID: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74mHJjDukA
 * 5. Replace: 'Roff-Product-Catalogue.pdf': '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74mHJjDukA'
 * 
 * Repeat for all 7 PDF files. That's it!
 */