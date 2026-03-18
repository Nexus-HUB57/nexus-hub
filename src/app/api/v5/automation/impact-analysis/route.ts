import { NextResponse } from 'next/server';
import { analyzeAutomationImpact } from '../../../../ai/flows/automation-impact-analysis-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar entrada
    if (!body.executions || !Array.isArray(body.executions)) {
      return NextResponse.json(
        { error: 'Campo "executions" é obrigatório e deve ser um array' },
        { status: 400 }
      );
    }

    // Chamar o fluxo de análise de impacto
    const result = await analyzeAutomationImpact({
      executions: body.executions,
      timeWindowMinutes: body.timeWindowMinutes || 60,
      businessMetrics: body.businessMetrics,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro na análise de impacto de automação:', error);
    return NextResponse.json(
      { error: 'Erro interno de servidor', details: error.message },
      { status: 500 }
    );
  }
}
