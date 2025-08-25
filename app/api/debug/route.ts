import { NextRequest, NextResponse } from 'next/server';
import { readdir, access, stat } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const debugInfo: {
      timestamp: string;
      cwd: string;
      environment: string | undefined;
      platform: string;
      paths: Record<string, any>;
      files: Record<string, any>;
    } = {
      timestamp: new Date().toISOString(),
      cwd: process.cwd(),
      environment: process.env.NODE_ENV,
      platform: process.platform,
      paths: {},
      files: {}
    };

    // Check various possible paths
    const pathsToCheck = [
      'public/resources',
      '.next/static/resources', 
      'resources',
      '/var/task/public/resources',
      '/app/public/resources'
    ];

    for (const relativePath of pathsToCheck) {
      const fullPath = relativePath.startsWith('/') ? relativePath : join(process.cwd(), relativePath);
      
      try {
        await access(fullPath, constants.F_OK);
        const files = await readdir(fullPath);
        const pdfFiles = files.filter(f => f.endsWith('.pdf'));
        
        debugInfo.paths[relativePath] = {
          exists: true,
          fullPath,
          totalFiles: files.length,
          pdfFiles: pdfFiles.length,
          pdfFilesList: pdfFiles
        };

        // Get file sizes for PDF files
        for (const pdfFile of pdfFiles.slice(0, 3)) { // Limit to first 3 files
          try {
            const filePath = join(fullPath, pdfFile);
            const stats = await stat(filePath);
            debugInfo.files[pdfFile] = {
              size: stats.size,
              path: filePath,
              sizeFormatted: `${(stats.size / 1024 / 1024).toFixed(2)} MB`
            };
          } catch (statError) {
            debugInfo.files[pdfFile] = {
              error: 'Could not get file stats'
            };
          }
        }
      } catch (err) {
        debugInfo.paths[relativePath] = {
          exists: false,
          fullPath,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json(debugInfo, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug API failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}