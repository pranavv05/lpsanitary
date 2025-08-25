/**
 * File Size Analysis Utility
 * Helps analyze PDF catalog sizes and recommend storage solutions
 */

export interface FileAnalysis {
  filename: string;
  size: string;
  sizeMB: number;
  recommendedStorage: 'cloudinary' | 's3' | 'compress';
  reason: string;
  compressionPotential?: string;
}

export interface StorageRecommendation {
  strategy: 'cloudinary-only' | 's3-only' | 'hybrid' | 'compress-first';
  reasoning: string;
  costEstimate: string;
  pros: string[];
  cons: string[];
  setupDifficulty: 'Easy' | 'Medium' | 'Hard';
}

// Cloudinary free tier limits
const CLOUDINARY_FREE_LIMIT = 10; // MB
const LARGE_FILE_THRESHOLD = 20; // MB

// Parse size string to MB
export const parseSizeToMB = (sizeString: string): number => {
  const size = parseFloat(sizeString);
  const unit = sizeString.toUpperCase();
  
  if (unit.includes('GB')) return size * 1024;
  if (unit.includes('KB')) return size / 1024;
  return size; // Assume MB
};

// Analyze individual file
export const analyzeFile = (filename: string, size: string): FileAnalysis => {
  const sizeMB = parseSizeToMB(size);
  
  let recommendedStorage: 'cloudinary' | 's3' | 'compress';
  let reason: string;
  let compressionPotential: string | undefined;
  
  if (sizeMB <= CLOUDINARY_FREE_LIMIT) {
    recommendedStorage = 'cloudinary';
    reason = 'Fits within Cloudinary free tier (≤10MB)';
  } else if (sizeMB <= 50) {
    recommendedStorage = 'compress';
    reason = 'Consider compression to fit Cloudinary free tier';
    compressionPotential = `Could potentially compress from ${size} to ~${Math.round(sizeMB * 0.3)}-${Math.round(sizeMB * 0.7)}MB`;
  } else {
    recommendedStorage = 's3';
    reason = 'Too large for compression, use S3 or premium storage';
  }
  
  return {
    filename,
    size,
    sizeMB,
    recommendedStorage,
    reason,
    compressionPotential
  };
};

// Analyze all catalog files
export const analyzeAllFiles = (catalogs: Array<{ filename: string; size: string }>): {
  files: FileAnalysis[];
  summary: {
    totalFiles: number;
    totalSizeMB: number;
    cloudinaryEligible: number;
    needsS3: number;
    canCompress: number;
    estimatedCost: string;
  };
} => {
  const files = catalogs.map(catalog => analyzeFile(catalog.filename, catalog.size));
  
  const totalSizeMB = files.reduce((sum, file) => sum + file.sizeMB, 0);
  const cloudinaryEligible = files.filter(f => f.recommendedStorage === 'cloudinary').length;
  const needsS3 = files.filter(f => f.recommendedStorage === 's3').length;
  const canCompress = files.filter(f => f.recommendedStorage === 'compress').length;
  
  // Rough cost estimation (AWS S3 pricing)
  const s3StorageCost = (totalSizeMB / 1024) * 0.023; // $0.023 per GB/month
  const s3BandwidthCost = Math.max(0, (totalSizeMB - 1024) / 1024) * 0.09; // First 1GB free, then $0.09/GB
  const estimatedCost = s3StorageCost + s3BandwidthCost < 0.01 
    ? 'Under $0.01/month' 
    : `~$${(s3StorageCost + s3BandwidthCost).toFixed(2)}/month`;
  
  return {
    files,
    summary: {
      totalFiles: files.length,
      totalSizeMB: Math.round(totalSizeMB),
      cloudinaryEligible,
      needsS3,
      canCompress,
      estimatedCost
    }
  };
};

// Get storage strategy recommendation
export const getStorageRecommendation = (analysis: ReturnType<typeof analyzeAllFiles>): StorageRecommendation => {
  const { summary } = analysis;
  
  // All files fit in Cloudinary
  if (summary.needsS3 === 0 && summary.canCompress === 0) {
    return {
      strategy: 'cloudinary-only',
      reasoning: 'All files are ≤10MB and fit within Cloudinary free tier',
      costEstimate: 'Free',
      pros: ['Completely free', 'Easy setup', 'Global CDN'],
      cons: ['Limited to 25GB total storage'],
      setupDifficulty: 'Easy'
    };
  }
  
  // Many files can be compressed
  if (summary.canCompress >= summary.needsS3) {
    return {
      strategy: 'compress-first',
      reasoning: 'Many files could be compressed to fit Cloudinary free tier',
      costEstimate: 'Free (after compression)',
      pros: ['Potentially free', 'Better performance', 'Smaller downloads'],
      cons: ['Quality loss possible', 'Manual work required'],
      setupDifficulty: 'Medium'
    };
  }
  
  // Mix of small and large files
  if (summary.cloudinaryEligible > 0 && summary.needsS3 > 0) {
    return {
      strategy: 'hybrid',
      reasoning: 'Mix of small and large files - use both Cloudinary (free) and S3',
      costEstimate: summary.estimatedCost,
      pros: ['Cost-effective', 'No file size limits', 'Best performance'],
      cons: ['Two services to manage', 'More complex setup'],
      setupDifficulty: 'Medium'
    };
  }
  
  // All files are large
  return {
    strategy: 's3-only',
    reasoning: 'Most files are large - use S3 for everything',
    costEstimate: summary.estimatedCost,
    pros: ['Unlimited size', 'Single service', 'Enterprise-grade'],
    cons: ['Costs money', 'More complex setup than Cloudinary'],
    setupDifficulty: 'Medium'
  };
};

// Generate compression commands
export const generateCompressionCommands = (files: FileAnalysis[]): string[] => {
  const compressibleFiles = files.filter(f => f.recommendedStorage === 'compress');
  
  return compressibleFiles.map(file => 
    `# Compress ${file.filename} (${file.size} → target: <10MB)\n` +
    `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${file.filename.replace('.pdf', '_compressed.pdf')}" "${file.filename}"`
  );
};

// Generate setup instructions based on recommendation
export const generateSetupInstructions = (recommendation: StorageRecommendation, analysis: ReturnType<typeof analyzeAllFiles>): string[] => {
  switch (recommendation.strategy) {
    case 'cloudinary-only':
      return [
        '1. Sign up for Cloudinary free account',
        '2. Create "catalogs" folder',
        '3. Upload all PDF files',
        '4. Update config with your cloud name',
        '5. Set provider to "cloudinary-only"'
      ];
      
    case 'compress-first':
      return [
        '1. Compress large PDFs using ghostscript or online tools',
        '2. Target file sizes under 10MB',
        '3. Sign up for Cloudinary free account',
        '4. Upload compressed PDFs',
        '5. Update config with your cloud name'
      ];
      
    case 'hybrid':
      return [
        '1. Sign up for Cloudinary (for small files)',
        '2. Sign up for AWS free tier (for large files)',
        '3. Upload small files (≤10MB) to Cloudinary',
        '4. Upload large files (>10MB) to S3',
        '5. Update config with both URLs',
        '6. Set provider to "hybrid"'
      ];
      
    case 's3-only':
      return [
        '1. Sign up for AWS free tier',
        '2. Create S3 bucket',
        '3. Upload all PDF files',
        '4. Configure public access',
        '5. Update config with S3 URL',
        '6. Set provider to "s3-only"'
      ];
      
    default:
      return ['Unknown strategy'];
  }
};

// Browser-friendly analysis function
export const runFileSizeAnalysis = (catalogs: Array<{ filename: string; size: string }>) => {
  console.log('📊 File Size Analysis');
  console.log('====================');
  
  const analysis = analyzeAllFiles(catalogs);
  const recommendation = getStorageRecommendation(analysis);
  
  console.log('\n📁 File Analysis:');
  analysis.files.forEach(file => {
    const icon = file.recommendedStorage === 'cloudinary' ? '✅' : 
                 file.recommendedStorage === 'compress' ? '🔄' : '📦';
    console.log(`${icon} ${file.filename} (${file.size}) → ${file.reason}`);
    if (file.compressionPotential) {
      console.log(`   💡 ${file.compressionPotential}`);
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`Total files: ${analysis.summary.totalFiles}`);
  console.log(`Total size: ${analysis.summary.totalSizeMB}MB`);
  console.log(`Cloudinary eligible: ${analysis.summary.cloudinaryEligible}`);
  console.log(`Need S3/compression: ${analysis.summary.needsS3 + analysis.summary.canCompress}`);
  
  console.log('\n🎯 Recommendation:');
  console.log(`Strategy: ${recommendation.strategy}`);
  console.log(`Reasoning: ${recommendation.reasoning}`);
  console.log(`Cost: ${recommendation.costEstimate}`);
  console.log(`Difficulty: ${recommendation.setupDifficulty}`);
  
  console.log('\n👍 Pros:');
  recommendation.pros.forEach(pro => console.log(`  ✅ ${pro}`));
  
  console.log('\n👎 Cons:');
  recommendation.cons.forEach(con => console.log(`  ❌ ${con}`));
  
  console.log('\n📋 Setup Steps:');
  const instructions = generateSetupInstructions(recommendation, analysis);
  instructions.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
  
  if (recommendation.strategy === 'compress-first') {
    console.log('\n🔧 Compression Commands:');
    const commands = generateCompressionCommands(analysis.files);
    commands.forEach(cmd => console.log(cmd));
  }
  
  return { analysis, recommendation };
};