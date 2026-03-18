import { NextResponse } from 'next/server';
import { orchestrateAgentAutomation } from '../../../../ai/flows/agent-automation-orchestrator-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.directives || !Array.isArray(body.directives)) {
      return NextResponse.json(
        { error: 'Campo "directives" é obrigatório e deve ser um array' },
        { status: 400 }
      );
    }

    // Chamar o fluxo de orquestração
    const result = await orchestrateAgentAutomation({
      directives: body.directives,
      orchestrationMode: body.orchestrationMode || 'PRIORITY_BASED',
      maxConcurrentExecutions: body.maxConcurrentExecutions || 5,
      auditTrail: body.auditTrail !== false,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro na orquestração de automação:', error);
    return NextResponse.json(
      { error: 'Erro interno de servidor', details: error.message },
      { status: 500 }
    );
  }
}
