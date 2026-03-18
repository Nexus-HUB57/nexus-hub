import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/api/v5/automation/history', {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Falha ao buscar histórico do gateway' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no proxy de histórico de automação:', error);
    return NextResponse.json({ error: 'Erro interno de servidor' }, { status: 500 });
  }
}
