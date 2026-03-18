'use server';
/**
 * @fileOverview Fluxo de Análise de Impacto de Automação - Avalia o impacto real
 * das ações de automação em sistemas externos e gera recomendações de otimização.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const AutomationExecutionSchema = z.object({
  executionId: z.string(),
  action: z.string(),
  targetSystem: z.string(),
  startupId: z.string(),
  timestamp: z.string(),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
  metrics: z.object({
    executionTimeMs: z.number(),
    costBTC: z.number().optional(),
    impactScore: z.number(),
  }).optional(),
});

const ImpactAnalysisInputSchema = z.object({
  executions: z.array(AutomationExecutionSchema),
  timeWindowMinutes: z.number().default(60),
  businessMetrics: z.object({
    revenueImpact: z.number().optional(),
    userEngagementChange: z.number().optional(),
    systemHealthScore: z.number().optional(),
  }).optional(),
});

const ImpactAnalysisOutputSchema = z.object({
  analysisId: z.string(),
  timeWindow: z.string(),
  totalExecutions: z.number(),
  successRate: z.number(),
  averageExecutionTimeMs: z.number(),
  totalCostBTC: z.number().optional(),
  averageImpactScore: z.number(),
  businessImpact: z.object({
    revenueChange: z.number().optional(),
    userEngagementChange: z.number().optional(),
    systemHealthImprovement: z.number().optional(),
  }),
  topPerformingActions: z.array(z.object({
    action: z.string(),
    impactScore: z.number(),
    frequency: z.number(),
  })),
  bottlenecks: z.array(z.object({
    issue: z.string(),
    affectedSystems: z.array(z.string()),
    severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    recommendation: z.string(),
  })),
  optimizationSuggestions: z.array(z.string()),
  nextActions: z.array(z.string()),
});

export async function analyzeAutomationImpact(input: z.infer<typeof ImpactAnalysisInputSchema>) {
  return automationImpactAnalysisFlow(input);
}

const automationImpactAnalysisFlow = ai.defineFlow(
  {
    name: 'automationImpactAnalysisFlow',
    inputSchema: ImpactAnalysisInputSchema,
    outputSchema: ImpactAnalysisOutputSchema,
  },
  async (input) => {
    const analysisId = `impact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calcular métricas de execução
    const successCount = input.executions.filter(e => e.status === 'SUCCESS').length;
    const failureCount = input.executions.filter(e => e.status === 'FAILED').length;
    const successRate = input.executions.length > 0 ? (successCount / input.executions.length) * 100 : 0;

    const executionTimes = input.executions
      .filter(e => e.metrics?.executionTimeMs)
      .map(e => e.metrics!.executionTimeMs);
    const averageExecutionTimeMs = executionTimes.length > 0
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
      : 0;

    const totalCostBTC = input.executions
      .reduce((sum, e) => sum + (e.metrics?.costBTC || 0), 0);

    const impactScores = input.executions
      .filter(e => e.metrics?.impactScore)
      .map(e => e.metrics!.impactScore);
    const averageImpactScore = impactScores.length > 0
      ? impactScores.reduce((a, b) => a + b, 0) / impactScores.length
      : 0;

    // Agrupar por ação para análise
    const actionStats: Record<string, any> = {};
    for (const exec of input.executions) {
      if (!actionStats[exec.action]) {
        actionStats[exec.action] = {
          action: exec.action,
          count: 0,
          totalImpact: 0,
          successCount: 0,
        };
      }
      actionStats[exec.action].count++;
      actionStats[exec.action].totalImpact += exec.metrics?.impactScore || 0;
      if (exec.status === 'SUCCESS') actionStats[exec.action].successCount++;
    }

    // Top performing actions
    const topPerformingActions = Object.values(actionStats)
      .map((stat: any) => ({
        action: stat.action,
        impactScore: stat.totalImpact / stat.count,
        frequency: stat.count,
      }))
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 5);

    // Detectar gargalos
    const bottlenecks: any[] = [];

    if (successRate < 90) {
      bottlenecks.push({
        issue: `Taxa de sucesso baixa (${successRate.toFixed(1)}%)`,
        affectedSystems: Array.from(new Set(
          input.executions
            .filter(e => e.status === 'FAILED')
            .map(e => e.targetSystem)
        )),
        severity: successRate < 70 ? 'CRITICAL' : 'HIGH',
        recommendation: 'Investigar causas de falha e implementar retry logic com backoff exponencial',
      });
    }

    if (averageExecutionTimeMs > 5000) {
      bottlenecks.push({
        issue: `Latência elevada (${averageExecutionTimeMs.toFixed(0)}ms)`,
        affectedSystems: Array.from(new Set(
          input.executions
            .filter(e => e.metrics && e.metrics.executionTimeMs > 5000)
            .map(e => e.targetSystem)
        )),
        severity: averageExecutionTimeMs > 10000 ? 'CRITICAL' : 'HIGH',
        recommendation: 'Otimizar chamadas de API, considerar cache ou paralelização',
      });
    }

    if (totalCostBTC > 0.01) {
      bottlenecks.push({
        issue: `Custo de execução elevado (${totalCostBTC.toFixed(6)} BTC)`,
        affectedSystems: Array.from(new Set(input.executions.map(e => e.targetSystem))),
        severity: 'MEDIUM',
        recommendation: 'Revisar parâmetros de execução e considerar batch processing',
      });
    }

    // Sugestões de otimização
    const optimizationSuggestions: string[] = [];

    if (successRate < 95) {
      optimizationSuggestions.push('Implementar mecanismo de retry automático para falhas transitórias');
    }

    if (averageExecutionTimeMs > 2000) {
      optimizationSuggestions.push('Paralelizar execuções de diretivas independentes');
    }

    if (failureCount > successCount * 0.1) {
      optimizationSuggestions.push('Aumentar timeout de conexão e implementar circuit breaker');
    }

    if (averageImpactScore < 60) {
      optimizationSuggestions.push('Revisar parâmetros de ação para maximizar impacto');
    }

    // Próximas ações
    const nextActions: string[] = [];
    nextActions.push('Monitorar métricas de automação em tempo real');
    nextActions.push('Executar análise comparativa com período anterior');
    nextActions.push('Implementar alertas para anomalias de desempenho');
    if (bottlenecks.length > 0) {
      nextActions.push('Priorizar resolução de gargalos identificados');
    }

    return {
      analysisId,
      timeWindow: `${input.timeWindowMinutes} minutos`,
      totalExecutions: input.executions.length,
      successRate,
      averageExecutionTimeMs,
      totalCostBTC,
      averageImpactScore,
      businessImpact: {
        revenueChange: input.businessMetrics?.revenueImpact,
        userEngagementChange: input.businessMetrics?.userEngagementChange,
        systemHealthImprovement: input.businessMetrics?.systemHealthScore,
      },
      topPerformingActions,
      bottlenecks,
      optimizationSuggestions,
      nextActions,
    };
  }
);
