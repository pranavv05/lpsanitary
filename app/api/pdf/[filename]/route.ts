import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const filename = params.filename;
    
    console.log(`[API] Attempting to serve PDF: ${filename}`);
    
    // Validate PDF file extension
    if (!filename.endsWith('.pdf')) {
      console.error(`[API] Invalid file type: ${filename}`);
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }
    
    // Try multiple possible file paths
    const possiblePaths = [
      join(process.cwd(), 'public', 'resources', filename),
      join(process.cwd(), '.next', 'static', 'resources', filename),
      join(process.cwd(), 'resources', filename),
      join('/var/task/public/resources', filename), // Vercel serverless path
      join('/app/public/resources', filename), // Docker container path
    ];
    
    let filePath: string | null = null;
    let fileBuffer: Buffer;
    
    // Try each path until we find the file
    for (const path of possiblePaths) {
      try {
        await access(path, constants.F_OK);
        filePath = path;
        console.log(`[API] Found PDF at: ${filePath}`);
        break;
      } catch (err) {
        console.log(`[API] Not found at: ${path}`);
        continue;
      }
    }
    
    if (!filePath) {
      console.error(`[API] PDF file not found: ${filename}`);
      console.error(`[API] Searched paths:`, possiblePaths);
      return NextResponse.json({ 
        error: 'PDF file not found',
        filename,
        searchedPaths: possiblePaths
      }, { status: 404 });
    }
    
    // Read the PDF file
    try {
      fileBuffer = await readFile(filePath);
      console.log(`[API] Successfully read PDF: ${filename}, size: ${fileBuffer.length} bytes`);
    } catch (readError) {
      console.error(`[API] Error reading file ${filePath}:`, readError);
      return NextResponse.json({ 
        error: 'Failed to read PDF file',
        filename,
        filePath
      }, { status: 500 });
    }
    
    // Verify it's actually a PDF
    if (fileBuffer.length === 0) {
      console.error(`[API] File is empty: ${filename}`);
      return NextResponse.json({ 
        error: 'PDF file is empty',
        filename,
        size: fileBuffer.length
      }, { status: 400 });
    }
    
    if (fileBuffer.length < 4) {
      console.error(`[API] File too small to be valid PDF: ${filename}, size: ${fileBuffer.length}`);
      return NextResponse.json({ 
        error: 'File too small to be a valid PDF',
        filename,
        size: fileBuffer.length
      }, { status: 400 });
    }
    
    // Check PDF signature more carefully
    const firstBytes = fileBuffer.subarray(0, 4).toString('ascii');
    if (!firstBytes.includes('%PDF')) {
      console.error(`[API] File is not a valid PDF: ${filename}, first bytes: ${firstBytes}`);
      console.error(`[API] File content preview:`, fileBuffer.subarray(0, Math.min(100, fileBuffer.length)).toString());
      return NextResponse.json({ 
        error: 'File is not a valid PDF - missing PDF header',
        filename,
        firstBytes,
        size: fileBuffer.length,
        preview: fileBuffer.subarray(0, Math.min(50, fileBuffer.length)).toString()
      }, { status: 400 });
    }
    
    // Create response with proper headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length.toString(),
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Encoding': 'identity',
        'Content-Transfer-Encoding': 'binary',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',
        'X-Content-Encoding-Override': 'none',
        'X-Compression-Override': 'false',
        'Vary': 'Accept-Encoding',
        // Add custom headers for debugging
        'X-PDF-Source': 'API-Route',
        'X-File-Path': filePath,
        'X-File-Size': fileBuffer.length.toString(),
      },
    });
    
    console.log(`[API] Successfully serving PDF: ${filename} (${fileBuffer.length} bytes)`);
    return response;
    
  } catch (error) {
    console.error(`[API] Error serving PDF:`, error);
    console.error(`[API] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
    
    // Detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let filename = 'unknown';
    
    try {
      const params = await context.params;
      filename = params.filename;
      console.error(`[API] Failed to serve PDF: ${filename}`);
    } catch (paramError) {
      console.error(`[API] Error getting params:`, paramError);
    }
    
    const errorResponse = {
      error: 'PDF file not found or could not be read',
      details: errorMessage,
      filename,
      timestamp: new Date().toISOString(),
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      cwd: process.cwd(),
      environment: process.env.NODE_ENV
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle HEAD requests for testing
export async function HEAD(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const filename = params.filename;
    
    console.log(`[API HEAD] Testing PDF availability: ${filename}`);
    
    // Validate PDF file extension
    if (!filename.endsWith('.pdf')) {
      return new NextResponse(null, { status: 400 });
    }
    
    // Try multiple possible file paths (same as GET)
    const possiblePaths = [
      join(process.cwd(), 'public', 'resources', filename),
      join(process.cwd(), '.next', 'static', 'resources', filename),
      join(process.cwd(), 'resources', filename),
      join('/var/task/public/resources', filename),
      join('/app/public/resources', filename),
    ];
    
    for (const path of possiblePaths) {
      try {
        await access(path, constants.F_OK);
        const stats = await import('fs').then(fs => fs.promises.stat(path));
        
        console.log(`[API HEAD] Found PDF: ${filename} at ${path} (${stats.size} bytes)`);
        
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': stats.size.toString(),
            'Accept-Ranges': 'bytes',
            'X-PDF-Available': 'true',
            'X-File-Size': stats.size.toString(),
          },
        });
      } catch (err) {
        continue;
      }
    }
    
    console.log(`[API HEAD] PDF not found: ${filename}`);
    return new NextResponse(null, { status: 404 });
    
  } catch (error) {
    console.error(`[API HEAD] Error:`, error);
    return new NextResponse(null, { status: 500 });
  }
}