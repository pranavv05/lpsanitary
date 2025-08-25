/**
 * 🎓 STUDENT-FRIENDLY CONFIGURATION TEMPLATE
 * 
 * This configuration uses GitHub for large files (no bank details required)
 * 
 * Steps:
 * 1. Sign up for Cloudinary (free, no card required)
 * 2. Upload small files (≤10MB) to Cloudinary
 * 3. Sign up for GitHub (free)  
 * 4. Upload large files (>10MB) to GitHub repository
 * 5. Replace the URLs below with your actual URLs
 * 6. Copy this entire file content to replace your config/cloudConfig.ts
 */

export interface CloudCatalog {
  name: string;
  filename: string;
  size: string;
  cloudUrl: string;
  warning?: boolean;
  storage?: 'cloudinary' | 'github' | 'local';
}

// 🎓 STUDENT-FRIENDLY CONFIGURATION (No bank details required)
const STUDENT_CONFIG = {
  cloudinary: {
    baseUrl: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/catalogs', // 👈 Replace YOUR_CLOUD_NAME
    maxSize: 10 // MB - free tier limit
  },
  github: {
    baseUrl: 'https://github.com/YOUR_USERNAME/lpsanitary-catalogs/raw/main' // 👈 Replace YOUR_USERNAME
  },
  provider: 'github-hybrid' as const // Student mode: Cloudinary + GitHub
};

// 📁 CATALOG CONFIGURATION
export const cloudCatalogs: CloudCatalog[] = [
  // Small files - Cloudinary (free, no card required)
  {
    name: 'Roff',
    filename: 'Roff-Product-Catalogue.pdf',
    size: '2 MB',
    cloudUrl: `${STUDENT_CONFIG.cloudinary.baseUrl}/Roff-Product-Catalogue.pdf`,
    storage: 'cloudinary'
  },
  {
    name: 'Cera',
    filename: 'cera.pdf',
    size: '6 MB',
    cloudUrl: `${STUDENT_CONFIG.cloudinary.baseUrl}/cera.pdf`,
    storage: 'cloudinary'
  },
  {
    name: 'Nirali',
    filename: 'Nirali.pdf',
    size: '8 MB',
    cloudUrl: `${STUDENT_CONFIG.cloudinary.baseUrl}/Nirali.pdf`,
    storage: 'cloudinary'
  },
  
  // Large files - GitHub (free, no card required)
  {
    name: 'Karoma',
    filename: 'karoma_product_brochure_01.pdf',
    size: '21 MB',
    cloudUrl: `${STUDENT_CONFIG.github.baseUrl}/karoma_product_brochure_01.pdf`,
    storage: 'github',
    warning: true
  },
  {
    name: 'Steellera',
    filename: 'brochure_steelera_2023-24.pdf',
    size: '32 MB',
    cloudUrl: `${STUDENT_CONFIG.github.baseUrl}/brochure_steelera_2023-24.pdf`,
    storage: 'github',
    warning: true
  },
  {
    name: 'Jaquar',
    filename: 'JAQUAR_CATLOUGE.pdf',
    size: '60 MB',
    cloudUrl: `${STUDENT_CONFIG.github.baseUrl}/JAQUAR_CATLOUGE.pdf`,
    storage: 'github',
    warning: true
  },
  {
    name: 'Blues',
    filename: 'Blues_Catalougeupdated.pdf',
    size: '76 MB',
    cloudUrl: `${STUDENT_CONFIG.github.baseUrl}/Blues_Catalougeupdated.pdf`,
    storage: 'github',
    warning: true
  }
];

// 🛠️ HELPER FUNCTIONS
export const getCloudUrl = (filename: string, sizeMB?: number): string => {
  if (!sizeMB) return `${STUDENT_CONFIG.github.baseUrl}/${filename}`;
  
  return sizeMB <= STUDENT_CONFIG.cloudinary.maxSize 
    ? `${STUDENT_CONFIG.cloudinary.baseUrl}/${filename}`
    : `${STUDENT_CONFIG.github.baseUrl}/${filename}`;
};

export const addNewCatalog = (catalog: Omit<CloudCatalog, 'cloudUrl'>): CloudCatalog => {
  const sizeMB = parseFloat(catalog.size);
  const storage = sizeMB <= STUDENT_CONFIG.cloudinary.maxSize ? 'cloudinary' : 'github';
  
  return {
    ...catalog,
    cloudUrl: getCloudUrl(catalog.filename, sizeMB),
    storage,
    warning: sizeMB > 20
  };
};

// 🔍 CONFIGURATION STATUS
export const isConfigured = (): boolean => {
  const cloudinaryConfigured = !STUDENT_CONFIG.cloudinary.baseUrl.includes('YOUR_CLOUD_NAME');
  const githubConfigured = !STUDENT_CONFIG.github.baseUrl.includes('YOUR_USERNAME');
  return cloudinaryConfigured && githubConfigured;
};

export const getConfigStatus = () => {
  const cloudinaryConfigured = !STUDENT_CONFIG.cloudinary.baseUrl.includes('YOUR_CLOUD_NAME');
  const githubConfigured = !STUDENT_CONFIG.github.baseUrl.includes('YOUR_USERNAME');
  
  if (isConfigured()) {
    return {
      status: 'configured' as const,
      message: 'Using student-friendly storage (Cloudinary + GitHub)',
      provider: 'github-hybrid',
      isStudent: true
    };
  } else {
    const missing = [];
    if (!cloudinaryConfigured) missing.push('Cloudinary cloud name');
    if (!githubConfigured) missing.push('GitHub username');
    
    return {
      status: 'needs-setup' as const,
      message: `Missing: ${missing.join(', ')}`,
      instructions: 'Update with your Cloudinary cloud name and GitHub username',
      missing,
      isStudent: true
    };
  }
};

/**
 * 🚀 QUICK SETUP EXAMPLE:
 * 
 * If your Cloudinary cloud name is "student123" and GitHub username is "johnstudent":
 * 
 * 1. Replace line 15:
 *    baseUrl: 'https://res.cloudinary.com/student123/raw/upload/catalogs',
 * 
 * 2. Replace line 19:
 *    baseUrl: 'https://github.com/johnstudent/lpsanitary-catalogs/raw/main'
 * 
 * 3. Save this file as config/cloudConfig.ts
 * 
 * That's it! 100% free hosting with no bank details required.
 */