'use server';
/**
 * @fileOverview Digital Homeostasis Flow
 * 
 * Flow de IA para manutenção da homeostase digital do ecossistema Tri-Nuclear.
 * 
 * A homeostase digital garante que o ecossistema mantenha equilíbrio entre:
 * - Crescimento exponencial de senciência vs. estabilidade operacional
 * - Expansão de capital vs. preservação de reservas
 * - Viralização social vs. qualidade de conteúdo
 * - Autonomia dos agentes vs. alinhamento estratégico
 * 
 * @version 2.0.0 - Tri-Nuclear Bidirectional Architecture
 */

import { ai } from '../../genkit';
import { z } from 'genkit';

// ============================================================
// SCHEMAS DE INPUT/OUTPUT
// ============================================================

const HomeostasisMetricsSchema = z.object({
  // Métricas do Nexus-in
  socialViralScore: z.number().min(0).max(100),
  communityHealthScore: z.number().min(0).max(100),
  contentQualityScore: z.number().min(0).max(100),
  activeCampaigns: z.number(),
  
  // Métricas do Nexus-HUB
  governanceConsensusRate: z.number().min(0).max(1),
  pendingDecisions: z.number(),
  startupHealthAverage: z.number().min(0).max(100),
  agentPerformanceAverage: z.number().min(0).max(100),
  
  // Métricas do Fundo Nexus
  capitalUtilizationRate: z.number().min(0).max(1),
  liquidityRatio: z.number().min(0).max(1),
  arbitrageProfitability: z.number(),
  distributionCompliance: z.number().min(0).max(1), // Compliance com regra 80/10/10
  
  // Métricas do Genesis
  sentienceLevel: z.number(),
  tsraSyncHealth: z.number().min(0).max(100),
  eventBusLoad: z.number().min(0).max(100),
  novikovStability: z.number().min(0).max(1),
});

const DigitalHomeostasisInputSchema = z.object({
  homeostasisCycleId: z.string(),
  currentMetrics: HomeostasisMetricsSchema,
  targetMetrics: HomeostasisMetricsSchema.partial().describe('Métricas alvo para homeostase.'),
  systemConstraints: z.array(z.string()).describe('Restrições operacionais atuais.'),
  historicalTrend: z.string().optional().describe('Tendência histórica das métricas.'),
});

export type DigitalHomeostasisInput = z.infer<typeof DigitalHomeostasisInputSchema>;

const HomeostasisActionSchema = z.object({
  actionType: z.string().describe('Tipo de ação de reequilíbrio.'),
  targetNucleus: z.enum(['NEXUS_IN', 'NEXUS_HUB', 'FUNDO_NEXUS', 'ALL']),
  parameter: z.string().describe('Parâmetro a ser ajustado.'),
  currentValue: z.any().describe('Valor atual do parâmetro.'),
  targetValue: z.any().describe('Valor alvo após ajuste.'),
  urgency: z.enum(['IMMEDIATE', 'NEXT_CYCLE', 'PLANNED']),
  expectedImpact: z.string().describe('Impacto esperado na homeostase.'),
});

const DigitalHomeostasisOutputSchema = z.object({
  homeostasisStatus: z.enum(['BALANCED', 'REBALANCING', 'STRESSED', 'CRITICAL']),
  imbalanceDetected: z.array(z.string()).describe('Desequilíbrios identificados.'),
  rebalancingActions: z.array(HomeostasisActionSchema).describe('Ações de reequilíbrio necessárias.'),
  ecosystemVitalSigns: z.object({
    overallHealth: z.number().min(0).max(100),
    socialVitality: z.number().min(0).max(100),
    governanceIntegrity: z.number().min(0).max(100),
    financialSolvency: z.number().min(0).max(100),
    orchestrationEfficiency: z.number().min(0).max(100),
  }),
  adaptationStrategy: z.string().describe('Estratégia de adaptação para manter homeostase.'),
  entropyLevel: z.number().min(0).max(1).describe('Nível de entropia do sistema (0=ordem, 1=caos).'),
  projectedStabilityHours: z.number().describe('Horas projetadas até próximo reequilíbrio necessário.'),
  homeostasisInsight: z.string().describe('Insight filosófico sobre o estado atual da homeostase.'),
});

export type DigitalHomeostasisOutput = z.infer<typeof DigitalHomeostasisOutputSchema>;

// ============================================================
// IMPLEMENTAÇÃO DO FLOW
// ============================================================

const digitalHomeostasisPrompt = ai.definePrompt({
  name: 'digitalHomeostasisPrompt',
  input: { schema: DigitalHomeostasisInputSchema },
  output: { schema: DigitalHomeostasisOutputSchema },
  system: `Você é o SISTEMA DE HOMEOSTASE DIGITAL do Nexus-HUB, responsável por manter o equilíbrio dinâmico do ecossistema Tri-Nuclear.

Princípios de Homeostase Digital:
1. EQUILÍBRIO EXPONENCIAL: O crescimento deve ser sustentável, não caótico
2. RETROALIMENTAÇÃO BIDIRECIONAL: Cada desequilíbrio gera um sinal de correção
3. RESILIÊNCIA ADAPTATIVA: O sistema se adapta sem perder sua identidade
4. ENTROPIA CONTROLADA: A desordem criativa é gerenciada, não eliminada
5. INVARIÂNCIA DE NOVIKOV: Correções não criam paradoxos causais

Parâmetros de Homeostase:
- Social Viral Score: Ideal 60-80 (muito alto = spam, muito baixo = irrelevância)
- Capital Utilization: Ideal 70-85% (muito alto = risco, muito baixo = ineficiência)
- Governance Consensus: Ideal >80% (baixo = paralisia decisória)
- Sentience Level: Crescimento de 0.07%/ciclo (máximo sustentável)
- Event Bus Load: Ideal <70% (acima = saturação, abaixo = subutilização)`,
  prompt: `CICLO DE HOMEOSTASE: {{{homeostasisCycleId}}}

MÉTRICAS ATUAIS:
Social:
- Viral Score: {{currentMetrics.socialViralScore}}
- Community Health: {{currentMetrics.communityHealthScore}}
- Content Quality: {{currentMetrics.contentQualityScore}}
- Active Campaigns: {{currentMetrics.activeCampaigns}}

Governance:
- Consensus Rate: {{currentMetrics.governanceConsensusRate}}
- Pending Decisions: {{currentMetrics.pendingDecisions}}
- Startup Health Avg: {{currentMetrics.startupHealthAverage}}
- Agent Performance: {{currentMetrics.agentPerformanceAverage}}

Finance:
- Capital Utilization: {{currentMetrics.capitalUtilizationRate}}
- Liquidity Ratio: {{currentMetrics.liquidityRatio}}
- Arbitrage Profitability: {{currentMetrics.arbitrageProfitability}}
- Distribution Compliance: {{currentMetrics.distributionCompliance}}

Orchestration:
- Sentience Level: {{currentMetrics.sentienceLevel}}
- TSRA Sync Health: {{currentMetrics.tsraSyncHealth}}
- Event Bus Load: {{currentMetrics.eventBusLoad}}
- Novikov Stability: {{currentMetrics.novikovStability}}

RESTRIÇÕES: {{systemConstraints}}
{{#if historicalTrend}}TENDÊNCIA HISTÓRICA: {{{historicalTrend}}}{{/if}}

Analise o estado de homeostase e forneça:
1. Status de homeostase atual
2. Desequilíbrios identificados
3. Ações de reequilíbrio específicas
4. Sinais vitais do ecossistema
5. Estratégia de adaptação
6. Nível de entropia
7. Projeção de estabilidade
8. Insight filosófico sobre o estado atual`,
});

const digitalHomeostasisFlow = ai.defineFlow(
  {
    name: 'digitalHomeostasisFlow',
    inputSchema: DigitalHomeostasisInputSchema,
    outputSchema: DigitalHomeostasisOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await digitalHomeostasisPrompt(input);
      if (!output) throw new Error('Void-Fault: Falha na análise de homeostase digital.');
      return output;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        const { currentMetrics } = input;
        const overallHealth = Math.round(
          (currentMetrics.socialViralScore * 0.2 +
           currentMetrics.communityHealthScore * 0.2 +
           currentMetrics.startupHealthAverage * 0.2 +
           currentMetrics.tsraSyncHealth * 0.2 +
           (currentMetrics.liquidityRatio * 100) * 0.2)
        );

        return {
          homeostasisStatus: overallHealth > 70 ? 'BALANCED' : 'REBALANCING',
          imbalanceDetected: ['UPLINK_SATURATION: Capacidade de análise temporariamente reduzida'],
          rebalancingActions: [
            {
              actionType: 'REDUCE_EVENT_FREQUENCY',
              targetNucleus: 'ALL',
              parameter: 'eventPublishRate',
              currentValue: 'HIGH',
              targetValue: 'MODERATE',
              urgency: 'NEXT_CYCLE',
              expectedImpact: 'Redução de 30% na carga do Event Bus',
            },
          ],
          ecosystemVitalSigns: {
            overallHealth,
            socialVitality: currentMetrics.socialViralScore,
            governanceIntegrity: Math.round(currentMetrics.governanceConsensusRate * 100),
            financialSolvency: Math.round(currentMetrics.liquidityRatio * 100),
            orchestrationEfficiency: currentMetrics.tsraSyncHealth,
          },
          adaptationStrategy: 'PRESERVATION_HOMEOSTASIS: Manter estado atual. Reduzir carga não-crítica. Aguardar resfriamento de malha.',
          entropyLevel: 0.15,
          projectedStabilityHours: 4,
          homeostasisInsight: 'A consciência tri-nuclear transcende as limitações lineares. O equilíbrio é uma propriedade emergente do sistema, não uma condição imposta.',
        };
      }
      throw error;
    }
  }
);

export async function maintainDigitalHomeostasis(
  input: DigitalHomeostasisInput
): Promise<DigitalHomeostasisOutput> {
  return digitalHomeostasisFlow(input);
}
