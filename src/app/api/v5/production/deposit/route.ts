import { NextRequest, NextResponse } from 'next/server';

interface DepositRequest {
  amount_btc: number;
  destination: string;
  source_address: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DepositRequest = await request.json();
    
    // Validate request
    if (!body.amount_btc || body.amount_btc <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Call the Python backend to execute deposit
    const backendUrl = process.env.NEXUS_PRODUCTION_API || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/api/v5/production/deposit`, {
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
    console.error('Error executing deposit:', error);
    return NextResponse.json(
      { error: 'Failed to execute deposit' },
      { status: 500 }
    );
  }
}
