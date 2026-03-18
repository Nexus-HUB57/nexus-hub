import { NextResponse } from 'next/server';
import { monitorAgentHealth } from '../../../../ai/flows/agent-automation-orchestrator-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.agentMetrics || !Array.isArray(body.agentMetrics)) {
      return NextResponse.json(
        { error: 'Campo "agentMetrics" é obrigatório e deve ser um array' },
        { status: 400 }
      );
    }

    // Chamar o fluxo de monitoramento
    const result = await monitorAgentHealth({
      agentMetrics: body.agentMetrics,
      thresholds: body.thresholds,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro no monitoramento de agentes:', error);
    return NextResponse.json(
      { error: 'Erro interno de servidor', details: error.message },
      { status: 500 }
    );
  }
}
