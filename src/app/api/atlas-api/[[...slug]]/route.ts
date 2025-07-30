import { atlasServerClient } from "@/atlas/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  
  console.log('🚀 Atlas API - GET request received');
  console.log('🚀 Atlas API - slug:', slug);
  console.log('🚀 Atlas API - headers:', Object.fromEntries(request.headers.entries()));

  try {
    const response = await atlasServerClient.handleRequest(request, slug);
    console.log('✅ Atlas API - Request handled successfully');
    return response;
  } catch (error) {
    console.error('❌ Atlas API - Error handling request:', error);
    throw error;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  
  console.log('🚀 Atlas API - POST request received');
  console.log('🚀 Atlas API - slug:', slug);
  console.log('🚀 Atlas API - headers:', Object.fromEntries(request.headers.entries()));

  try {
    const response = await atlasServerClient.handleRequest(request, slug);
    console.log('✅ Atlas API - Request handled successfully');
    return response;
  } catch (error) {
    console.error('❌ Atlas API - Error handling request:', error);
    throw error;
  }
}