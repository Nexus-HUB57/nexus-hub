import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Call the Python backend to get impact report
    const backendUrl = process.env.NEXUS_PRODUCTION_API || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v5/production/impact-report`, {
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
    console.error('Error fetching impact report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact report' },
      { status: 500 }
    );
  }
}
