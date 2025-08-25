import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Validate PDF file extension
    if (!filename.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }
    
    // Construct file path
    const filePath = join(process.cwd(), 'public', 'resources', filename);
    
    // Read the PDF file
    const fileBuffer = await readFile(filePath);
    
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
        'X-Content-Encoding-Override': 'none',
        'X-Compression-Override': 'false',
        'Vary': 'Accept-Encoding',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'PDF file not found or could not be read' },
      { status: 404 }
    );
  }
}