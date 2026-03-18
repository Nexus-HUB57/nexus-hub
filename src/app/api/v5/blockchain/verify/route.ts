import { NextRequest, NextResponse } from 'next/server';

interface VerifyRequest {
  address: string;
  verify_transactions: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();
    
    // Call the Python backend to verify blockchain data
    const backendUrl = process.env.NEXUS_PRODUCTION_API || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v5/blockchain/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying blockchain:', error);
    return NextResponse.json(
      { error: 'Failed to verify blockchain data' },
      { status: 500 }
    );
  }
}
