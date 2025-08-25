/**
 * 🎯 CLOUDINARY CONFIGURATION TEMPLATE
 * 
 * Copy this configuration and replace 'your-cloud-name' with your actual Cloudinary cloud name.
 * 
 * Steps:
 * 1. Sign up at cloudinary.com
 * 2. Upload PDFs to "catalogs" folder  
 * 3. Get your cloud name from dashboard
 * 4. Replace 'your-cloud-name' below
 * 5. Save this file as config/cloudConfig.ts
 */

export interface CloudCatalog {
  name: string;
  filename: string;
  size: string;
  cloudUrl: string;
  warning?: boolean;
}

// 🔧 CLOUDINARY CONFIGURATION
// Replace 'your-cloud-name' with your actual Cloudinary cloud name
const CURRENT_CLOUD_CONFIG = {
  baseUrl: 'https://res.cloudinary.com/your-cloud-name/raw/upload/catalogs', // 👈 REPLACE 'your-cloud-name'
  provider: 'cloudinary'
};

// 📁 CATALOG CONFIGURATION
export const cloudCatalogs: CloudCatalog[] = [
  {
    name: 'Roff',
    filename: 'Roff-Product-Catalogue.pdf',
    size: '2 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/Roff-Product-Catalogue.pdf`
  },
  {
    name: 'Jaquar',
    filename: 'JAQUAR_CATLOUGE.pdf',
    size: '60 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/JAQUAR_CATLOUGE.pdf`,
    warning: true
  },
  {
    name: 'Blues',
    filename: 'Blues_Catalougeupdated.pdf',
    size: '76 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/Blues_Catalougeupdated.pdf`,
    warning: true
  },
  {
    name: 'Nirali',
    filename: 'Nirali.pdf',
    size: '8 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/Nirali.pdf`
  },
  {
    name: 'Karoma',
    filename: 'karoma_product_brochure_01.pdf',
    size: '21 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/karoma_product_brochure_01.pdf`
  },
  {
    name: 'Cera',
    filename: 'cera.pdf',
    size: '6 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/cera.pdf`
  },
  {
    name: 'Steellera',
    filename: 'brochure_steelera_2023-24.pdf',
    size: '32 MB',
    cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/brochure_steelera_2023-24.pdf`,
    warning: true
  }
  // 👇 ADD NEW CATALOGS HERE:
  // {
  //   name: 'New Brand',
  //   filename: 'new-brand-catalog.pdf',
  //   size: '15 MB',
  //   cloudUrl: `${CURRENT_CLOUD_CONFIG.baseUrl}/new-brand-catalog.pdf`,
  //   warning: false
  // }
];

// 🛠️ HELPER FUNCTIONS
export const getCloudUrl = (filename: string): string => {
  return `${CURRENT_CLOUD_CONFIG.baseUrl}/${filename}`;
};

export const addNewCatalog = (catalog: Omit<CloudCatalog, 'cloudUrl'>): CloudCatalog => {
  return {
    ...catalog,
    cloudUrl: getCloudUrl(catalog.filename)
  };
};

// 🔍 CONFIGURATION STATUS
export const isConfigured = (): boolean => {
  return !CURRENT_CLOUD_CONFIG.baseUrl.includes('your-cloud-name');
};

export const getConfigStatus = () => {
  if (isConfigured()) {
    return {
      status: 'configured' as const,
      message: `Using ${CURRENT_CLOUD_CONFIG.provider} cloud storage`,
      baseUrl: CURRENT_CLOUD_CONFIG.baseUrl
    };
  } else {
    return {
      status: 'needs-setup' as const,
      message: 'Cloudinary not configured yet',
      instructions: 'Please update cloudConfig.ts with your Cloudinary cloud name'
    };
  }
};

/**
 * 🚀 QUICK SETUP EXAMPLE:
 * 
 * If your Cloudinary cloud name is "dk1a2b3c4d", replace line 17 with:
 * baseUrl: 'https://res.cloudinary.com/dk1a2b3c4d/raw/upload/catalogs',
 * 
 * That's it! Your PDFs will be served from Cloudinary's global CDN.
 */