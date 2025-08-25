import { NextRequest, NextResponse } from 'next/server';
import { cloudCatalogs, getConfigStatus } from '@/config/cloudConfig';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const params = await context.params;
    const { filename } = params;
    
    console.log(`🌐 Cloud PDF API request for: ${filename}`);
    
    // Check if cloud storage is configured
    const configStatus = getConfigStatus();
    if (configStatus.status !== 'configured') {
      return NextResponse.json({
        error: 'Cloud storage not configured',
        details: 'Please configure cloud storage in cloudConfig.ts',
        status: configStatus.status,
        message: configStatus.message
      }, { status: 501 });
    }
    
    // Find the catalog entry
    const catalog = cloudCatalogs.find(c => c.filename === filename);
    if (!catalog) {
      return NextResponse.json({
        error: 'Catalog not found',
        details: `No catalog found with filename: ${filename}`,
        availableCatalogs: cloudCatalogs.map(c => c.filename)
      }, { status: 404 });
    }
    
    console.log(`📁 Found catalog: ${catalog.name}, URL: ${catalog.cloudUrl}`);
    
    // Fetch the PDF from cloud storage
    try {
      const cloudResponse = await fetch(catalog.cloudUrl, {
        headers: {
          'Accept': 'application/pdf,*/*',
          'User-Agent': 'Mozilla/5.0 (compatible; LPSanitary-Bot/1.0)',
        },
      });
      
      if (!cloudResponse.ok) {
        throw new Error(`Cloud storage responded with ${cloudResponse.status}: ${cloudResponse.statusText}`);
      }
      
      const contentType = cloudResponse.headers.get('content-type') || 'application/pdf';\n      const contentLength = cloudResponse.headers.get('content-length');\n      \n      console.log(`✅ Successfully fetched ${catalog.name} from cloud storage`);\n      console.log(`📊 Content-Type: ${contentType}, Size: ${contentLength} bytes`);\n      \n      // Get the PDF data\n      const pdfBuffer = await cloudResponse.arrayBuffer();\n      \n      // Basic PDF validation\n      const pdfHeader = new Uint8Array(pdfBuffer.slice(0, 4));\n      const pdfSignature = String.fromCharCode(...pdfHeader);\n      \n      if (!pdfSignature.startsWith('%PDF')) {\n        console.warn(`⚠️ Invalid PDF signature for ${catalog.name}: ${pdfSignature}`);\n        return NextResponse.json({\n          error: 'Invalid PDF file',\n          details: `File does not appear to be a valid PDF (signature: ${pdfSignature})`,\n          catalog: catalog.name,\n          cloudUrl: catalog.cloudUrl\n        }, { status: 422 });\n      }\n      \n      // Return the PDF with proper headers\n      return new NextResponse(pdfBuffer, {\n        status: 200,\n        headers: {\n          'Content-Type': 'application/pdf',\n          'Content-Disposition': `inline; filename=\"${catalog.name}-Catalog.pdf\"`,\n          'Content-Length': pdfBuffer.byteLength.toString(),\n          'Cache-Control': 'public, max-age=31536000, immutable',\n          'Access-Control-Allow-Origin': '*',\n          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',\n          'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',\n          'X-Content-Type-Options': 'nosniff',\n          'Accept-Ranges': 'bytes',\n          'X-PDF-Source': 'cloud-storage',\n          'X-Catalog-Name': catalog.name,\n          'X-File-Size': catalog.size,\n        },\n      });\n      \n    } catch (cloudError) {\n      console.error(`❌ Failed to fetch from cloud storage:`, cloudError);\n      \n      return NextResponse.json({\n        error: 'Cloud storage fetch failed',\n        details: cloudError instanceof Error ? cloudError.message : 'Unknown cloud storage error',\n        catalog: catalog.name,\n        cloudUrl: catalog.cloudUrl,\n        suggestion: 'Please check cloud storage URL and CORS configuration'\n      }, { status: 502 });\n    }\n    \n  } catch (error) {\n    console.error(`❌ Cloud PDF API error:`, error);\n    \n    return NextResponse.json({\n      error: 'Internal server error',\n      details: error instanceof Error ? error.message : 'Unknown error',\n      timestamp: new Date().toISOString()\n    }, { status: 500 });\n  }\n}\n\n// Handle HEAD requests for PDF availability checking\nexport async function HEAD(request: NextRequest, context: { params: Promise<{ filename: string }> }) {\n  try {\n    const params = await context.params;\n    const { filename } = params;\n    \n    // Check if cloud storage is configured\n    const configStatus = getConfigStatus();\n    if (configStatus.status !== 'configured') {\n      return new NextResponse(null, { status: 501 });\n    }\n    \n    // Find the catalog entry\n    const catalog = cloudCatalogs.find(c => c.filename === filename);\n    if (!catalog) {\n      return new NextResponse(null, { status: 404 });\n    }\n    \n    // Quick HEAD request to cloud storage\n    try {\n      const cloudResponse = await fetch(catalog.cloudUrl, { \n        method: 'HEAD',\n        headers: {\n          'User-Agent': 'Mozilla/5.0 (compatible; LPSanitary-Bot/1.0)',\n        },\n      });\n      \n      if (!cloudResponse.ok) {\n        return new NextResponse(null, { status: 502 });\n      }\n      \n      return new NextResponse(null, {\n        status: 200,\n        headers: {\n          'Content-Type': 'application/pdf',\n          'Content-Length': cloudResponse.headers.get('content-length') || '0',\n          'X-PDF-Source': 'cloud-storage',\n          'X-Catalog-Name': catalog.name,\n          'Access-Control-Allow-Origin': '*',\n        },\n      });\n      \n    } catch (cloudError) {\n      return new NextResponse(null, { status: 502 });\n    }\n    \n  } catch (error) {\n    return new NextResponse(null, { status: 500 });\n  }\n}\n\n// Handle CORS preflight requests\nexport async function OPTIONS() {\n  return new NextResponse(null, {\n    status: 200,\n    headers: {\n      'Access-Control-Allow-Origin': '*',\n      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',\n      'Access-Control-Allow-Headers': 'Content-Type, Accept, Range',\n      'Access-Control-Max-Age': '86400',\n    },\n  });\n}