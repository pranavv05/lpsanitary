/**
 * Cloudinary Configuration Test Utility
 * Use this to verify your Cloudinary setup is working correctly
 */

import { cloudCatalogs, getConfigStatus } from '@/config/cloudConfig';

// Test a single Cloudinary URL
export const testCloudinaryUrl = async (url: string): Promise<{
  success: boolean;
  status?: number;
  size?: number;
  contentType?: string;
  error?: string;
}> => {
  try {
    console.log(`🔍 Testing URL: ${url}`);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'Accept': 'application/pdf,*/*',
      }
    });
    
    const contentType = response.headers.get('content-type') || 'unknown';
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength) : undefined;
    
    console.log(`📊 Response: ${response.status}, Type: ${contentType}, Size: ${size} bytes`);
    
    return {
      success: response.ok,
      status: response.status,
      size,
      contentType
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ URL test failed: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Test all configured catalog URLs
export const testAllCloudinaryCatalogs = async (): Promise<{
  configStatus: string;
  totalCatalogs: number;
  successfulTests: number;
  failedTests: Array<{ name: string; url: string; error: string }>;
  results: Array<{ name: string; success: boolean; size?: number; error?: string }>;
}> => {
  console.log(`🚀 Testing all Cloudinary catalog URLs...`);
  
  const configStatus = getConfigStatus();
  const results = [];
  const failedTests = [];
  let successfulTests = 0;
  
  for (const catalog of cloudCatalogs) {
    console.log(`\n📝 Testing ${catalog.name}...`);
    
    const testResult = await testCloudinaryUrl(catalog.cloudUrl);
    
    results.push({
      name: catalog.name,
      success: testResult.success,
      size: testResult.size,
      error: testResult.error
    });
    
    if (testResult.success) {
      successfulTests++;
      console.log(`✅ ${catalog.name}: SUCCESS (${testResult.size} bytes)`);
    } else {
      failedTests.push({
        name: catalog.name,
        url: catalog.cloudUrl,
        error: testResult.error || `HTTP ${testResult.status}`
      });
      console.log(`❌ ${catalog.name}: FAILED - ${testResult.error || testResult.status}`);
    }
  }
  
  console.log(`\n📊 Test Summary:`);
  console.log(`   Configuration: ${configStatus.message}`);
  console.log(`   Total catalogs: ${cloudCatalogs.length}`);
  console.log(`   Successful: ${successfulTests}`);
  console.log(`   Failed: ${failedTests.length}`);
  
  return {
    configStatus: configStatus.message,
    totalCatalogs: cloudCatalogs.length,
    successfulTests,
    failedTests,
    results
  };
};

// Generate example Cloudinary URLs for your cloud name
export const generateCloudinaryUrls = (cloudName: string): Record<string, string> => {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/catalogs`;
  
  return {
    'Roff': `${baseUrl}/Roff-Product-Catalogue.pdf`,
    'Jaquar': `${baseUrl}/JAQUAR_CATLOUGE.pdf`,
    'Blues': `${baseUrl}/Blues_Catalougeupdated.pdf`,
    'Nirali': `${baseUrl}/Nirali.pdf`,
    'Karoma': `${baseUrl}/karoma_product_brochure_01.pdf`,
    'Cera': `${baseUrl}/cera.pdf`,
    'Steellera': `${baseUrl}/brochure_steelera_2023-24.pdf`
  };
};

// Validate cloud name format
export const validateCloudName = (cloudName: string): { valid: boolean; message: string } => {
  if (!cloudName || cloudName === 'your-cloud-name') {
    return {
      valid: false,
      message: 'Please replace "your-cloud-name" with your actual Cloudinary cloud name'
    };
  }
  
  if (cloudName.length < 3) {
    return {
      valid: false,
      message: 'Cloud name seems too short. Please check your Cloudinary dashboard for the correct cloud name.'
    };
  }
  
  if (cloudName.includes(' ') || cloudName.includes('http')) {
    return {
      valid: false,
      message: 'Cloud name should be just the name, not a full URL. Example: "dk1a2b3c4d"'
    };
  }
  
  return {
    valid: true,
    message: 'Cloud name format looks correct'
  };
};

// Helper function to extract cloud name from current config
export const getCurrentCloudName = (): string | null => {
  const configStatus = getConfigStatus();
  
  if (configStatus.status !== 'configured') {
    return null;
  }
  
  // Extract cloud name from base URL
  const match = cloudCatalogs[0]?.cloudUrl.match(/res\.cloudinary\.com\/([^\/]+)\//);
  return match ? match[1] : null;
};

// Browser-friendly test function (call from console)
export const runCloudinaryTest = async () => {
  console.log(`🔬 Cloudinary Configuration Test`);
  console.log(`==============================`);
  
  const cloudName = getCurrentCloudName();
  
  if (!cloudName) {
    console.log(`❌ Cloudinary not configured yet. Please update config/cloudConfig.ts`);
    return;
  }
  
  console.log(`☁️ Cloud Name: ${cloudName}`);
  
  const validation = validateCloudName(cloudName);
  console.log(`📝 Validation: ${validation.message}`);
  
  if (!validation.valid) {
    return;
  }
  
  console.log(`\n🚀 Testing all catalog URLs...`);
  const results = await testAllCloudinaryCatalogs();
  
  console.log(`\n📋 Final Report:`);
  console.log(`================`);
  console.log(`Configuration Status: ${results.configStatus}`);
  console.log(`Total Catalogs: ${results.totalCatalogs}`);
  console.log(`Successful Tests: ${results.successfulTests}`);
  console.log(`Failed Tests: ${results.failedTests.length}`);
  
  if (results.failedTests.length > 0) {
    console.log(`\n❌ Failed URLs:`);
    results.failedTests.forEach(failed => {
      console.log(`   ${failed.name}: ${failed.error}`);
      console.log(`   URL: ${failed.url}`);
    });
  }
  
  if (results.successfulTests === results.totalCatalogs) {
    console.log(`\n🎉 All tests passed! Your Cloudinary setup is working perfectly.`);
  } else {
    console.log(`\n⚠️ Some tests failed. Please check the URLs and file uploads in Cloudinary.`);
  }
  
  return results;
};

// Export for use in components
export default {
  testCloudinaryUrl,
  testAllCloudinaryCatalogs,
  generateCloudinaryUrls,
  validateCloudName,
  runCloudinaryTest
};