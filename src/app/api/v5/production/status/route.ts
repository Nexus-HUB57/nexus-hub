import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Call the Python backend to get production status
    const backendUrl = process.env.NEXUS_PRODUCTION_API || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v5/production/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching production status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production status' },
      { status: 500 }
    );
  }
}
