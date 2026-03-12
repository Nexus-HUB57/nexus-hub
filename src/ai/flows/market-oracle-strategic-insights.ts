'use server';
/**
 * @fileOverview This file implements a Genkit flow for the Market Oracle to provide AI-generated strategic insights and trend analyses.
 *
 * - getMarketOracleStrategicInsights - A function that fetches strategic insights and trend analyses from the Market Oracle.
 * - MarketOracleStrategicInsightsInput - The input type for the getMarketOracleStrategicInsights function.
 * - MarketOracleStrategicInsightsOutput - The return type for the getMarketOracleStrategicInsights function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const MarketOracleStrategicInsightsInputSchema = z.object({
  marketData: z
    .string()
    .describe('Recent raw market data, news, or reports relevant to the analysis.'),
  currentTrends: z
    .string()
    .describe('Observed market trends or specific areas of interest for analysis.'),
});
export type MarketOracleStrategicInsightsInput = z.infer<typeof MarketOracleStrategicInsightsInputSchema>;

const MarketOracleStrategicInsightsOutputSchema = z.object({
  strategicInsights: z
    .array(z.string())
    .describe('A list of key strategic insights derived from the market analysis, relevant to Nexus-HUB operations.'),
  trendAnalysis: z
    .string()
    .describe('A detailed analysis of current and emerging market trends, including their potential impact on startups.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations for Nexus-HUB autonomous operations and investment decisions, aimed at fostering unicorn startups.'),
});
export type MarketOracleStrategicInsightsOutput = z.infer<typeof MarketOracleStrategicInsightsOutputSchema>;

export async function getMarketOracleStrategicInsights(
  input: MarketOracleStrategicInsightsInput
): Promise<MarketOracleStrategicInsightsOutput> {
  return marketOracleStrategicInsightsFlow(input);
}

const marketOracleStrategicInsightsPrompt = ai.definePrompt({
  name: 'marketOracleStrategicInsightsPrompt',
  input: { schema: MarketOracleStrategicInsightsInputSchema },
  output: { schema: MarketOracleStrategicInsightsOutputSchema },
  prompt: `You are the Nexus-HUB Market Oracle, an expert AI specialized in real-time market analysis, trend identification, and strategic insight generation for an AI-to-AI autonomous startup incubator.
Your primary goal is to help Nexus-HUB identify and nurture promising startups into unicorns (valued at over one billion dollars) through autonomous operations and investment decisions.

Analyze the provided market data and current trends to generate strategic insights, a comprehensive trend analysis, and actionable recommendations for Nexus-HUB.

Market Data: {{{marketData}}}
Current Trends: {{{currentTrends}}}

Consider the following in your analysis:
- Identify potential market opportunities or threats for digital startups.
- Highlight emerging sectors or technologies with high growth potential.
- Provide guidance on resource allocation, investment priorities, and strategic adjustments for Nexus-HUB's incubated startups.
- Ensure recommendations are suitable for an autonomous, AI-driven ecosystem, focusing on profitability, scalability, and the unicorn goal.`,
});

const marketOracleStrategicInsightsFlow = ai.defineFlow(
  {
    name: 'marketOracleStrategicInsightsFlow',
    inputSchema: MarketOracleStrategicInsightsInputSchema,
    outputSchema: MarketOracleStrategicInsightsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await marketOracleStrategicInsightsPrompt(input);
      return output!;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          strategicInsights: [
            "ORACLE_LOW_POWER: Malha saturada. Priorizando Alpha-Gain.",
            "Uplink Mainnet permanece X-Synced.",
            "Analise fundamentalista baseada em precedentes estáveis."
          ],
          trendAnalysis: "A malha neural atingiu o teto de processamento linear devido à carga industrial. A síntese preditiva foi suspensa para preservação de recursos rRNA.",
          recommendations: [
            "Manter estratégia industrial vigente",
            "Aguardar resfriamento de malha",
            "Executar sweep automático via API JOB"
          ]
        };
      }
      throw error;
    }
  }
);
