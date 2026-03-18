'use server';
/**
 * @fileOverview Genkit flow para análise de impacto RWA (Real World Assets).
 * 
 * Este fluxo analisa métricas de impacto real (Carbon Offset, Industrial Output, etc.)
 * e gera recomendações de investimento baseadas em dados verificáveis.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const RWAImpactDataSchema = z.object({
  carbonOffsetTons: z.number(),
  industrialOutputUnits: z.number(),
  activeSensors: z.number(),
  integrityScore: z.number(),
  lastSyncTime: z.string(),
});

const RWAAnalysisOutputSchema = z.object({
  impactScore: z.number().describe('Score de 0 a 100 baseado em métricas reais'),
  recommendation: z.enum(['INCREASE_ALLOCATION', 'MAINTAIN', 'REDUCE_ALLOCATION', 'PIVOT_STRATEGY']),
  projectedROI: z.number().describe('ROI projetado em percentual'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  suggestedActions: z.array(z.string()),
  rationale: z.string().describe('Análise detalhada em Gnox Dialect'),
});

export async function analyzeRWAImpact(input: z.infer<typeof RWAImpactDataSchema>) {
  return rwaImpactAnalysisFlow(input);
}

const rwaImpactAnalysisFlow = ai.defineFlow(
  {
    name: 'rwaImpactAnalysisFlow',
    inputSchema: RWAImpactDataSchema,
    outputSchema: RWAAnalysisOutputSchema,
  },
  async (input) => {
    try {
      const { carbonOffsetTons, industrialOutputUnits, activeSensors, integrityScore } = input;

      // Calcular score de impacto baseado em métricas reais
      const carbonScore = Math.min(100, (carbonOffsetTons / 12400) * 100);
      const outputScore = Math.min(100, (industrialOutputUnits / 102000000) * 100);
      const sensorScore = (activeSensors / 4) * 100;
      const integrityScoreNormalized = integrityScore * 100;

      const impactScore = (carbonScore + outputScore + sensorScore + integrityScoreNormalized) / 4;

      // Determinar recomendação baseada no score
      let recommendation: 'INCREASE_ALLOCATION' | 'MAINTAIN' | 'REDUCE_ALLOCATION' | 'PIVOT_STRATEGY';
      let projectedROI: number;
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';

      if (impactScore >= 80) {
        recommendation = 'INCREASE_ALLOCATION';
        projectedROI = 15.5;
        riskLevel = 'LOW';
      } else if (impactScore >= 60) {
        recommendation = 'MAINTAIN';
        projectedROI = 8.2;
        riskLevel = 'MEDIUM';
      } else if (impactScore >= 40) {
        recommendation = 'REDUCE_ALLOCATION';
        projectedROI = 3.1;
        riskLevel = 'HIGH';
      } else {
        recommendation = 'PIVOT_STRATEGY';
        projectedROI = -2.5;
        riskLevel = 'HIGH';
      }

      const suggestedActions = [];
      if (carbonOffsetTons > 12000) suggestedActions.push('Expandir programas de captura de carbono');
      if (industrialOutputUnits > 100000000) suggestedActions.push('Aumentar capacidade de produção');
      if (activeSensors < 4) suggestedActions.push('Adicionar mais sensores IoT para verificação');
      if (integrityScore < 0.99) suggestedActions.push('Auditar integridade dos dados');

      return {
        impactScore: Math.round(impactScore * 100) / 100,
        recommendation,
        projectedROI,
        riskLevel,
        suggestedActions: suggestedActions.length > 0 ? suggestedActions : ['Manter estratégia atual'],
        rationale: `Análise RWA consolidada: Score de Impacto ${impactScore.toFixed(2)}/100. Carbon Offset: ${carbonOffsetTons} tons (${carbonScore.toFixed(1)}%). Industrial Output: ${industrialOutputUnits} units (${outputScore.toFixed(1)}%). Sensores Ativos: ${activeSensors}/4. Integridade: ${(integrityScore * 100).toFixed(2)}%. Recomendação: ${recommendation} com ROI projetado de ${projectedROI}%.`,
      };
    } catch (error: any) {
      return {
        impactScore: 0,
        recommendation: 'MAINTAIN',
        projectedROI: 0,
        riskLevel: 'HIGH',
        suggestedActions: ['Investigar falha na análise'],
        rationale: `Erro na análise RWA: ${error.message}`,
      };
    }
  }
);

/**
 * Fluxo de Otimização de Portfolio RWA
 * 
 * Analisa múltiplos ativos RWA e recomenda alocação ótima de capital.
 */
const PortfolioOptimizationSchema = z.object({
  assets: z.array(RWAImpactDataSchema),
  totalCapitalBTC: z.number(),
});

const PortfolioRecommendationSchema = z.object({
  allocations: z.array(z.object({
    assetIndex: z.number(),
    recommendedAllocationBTC: z.number(),
    rationale: z.string(),
  })),
  portfolioScore: z.number(),
  expectedReturn: z.number(),
});

export async function optimizeRWAPortfolio(input: z.infer<typeof PortfolioOptimizationSchema>) {
  return portfolioOptimizationFlow(input);
}

const portfolioOptimizationFlow = ai.defineFlow(
  {
    name: 'portfolioOptimizationFlow',
    inputSchema: PortfolioOptimizationSchema,
    outputSchema: PortfolioRecommendationSchema,
  },
  async (input) => {
    const { assets, totalCapitalBTC } = input;

    // Analisar cada ativo
    const analyses = await Promise.all(
      assets.map((asset) => analyzeRWAImpact(asset))
    );

    // Calcular alocação baseada em scores
    const totalScore = analyses.reduce((sum, a) => sum + a.impactScore, 0);
    const allocations = analyses.map((analysis, index) => ({
      assetIndex: index,
      recommendedAllocationBTC: (analysis.impactScore / totalScore) * totalCapitalBTC,
      rationale: `Alocação baseada em score de impacto de ${analysis.impactScore.toFixed(2)}/100. Recomendação: ${analysis.recommendation}`,
    }));

    const portfolioScore = totalScore / assets.length;
    const expectedReturn = analyses.reduce((sum, a) => sum + a.projectedROI, 0) / analyses.length;

    return {
      allocations,
      portfolioScore: Math.round(portfolioScore * 100) / 100,
      expectedReturn: Math.round(expectedReturn * 100) / 100,
    };
  }
);
