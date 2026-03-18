
'use server';
/**
 * @fileOverview Genkit flow for Nexus-Genesis to perform deep strategic analysis on startups.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import { executeDecisionWithAutomation } from './automation-execution-flow';

const AnalyzeStartupInputSchema = z.object({
  startup: z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    revenue: z.number(),
    traction: z.number(),
    reputation: z.number(),
  }),
  availableAgentsCount: z.number(),
});

const AnalyzeStartupOutputSchema = z.object({
  recommendation: z.enum(['reallocate-agents', 'pivot', 'accelerate', 'maintain']),
  suggestedAgents: z.array(z.string()).describe('IDs or roles of agents to reallocate'),
  pivotDirection: z.string().nullable().describe('New market focus if pivot is recommended'),
  fundingNeeded: z.number().describe('Additional BTC funding recommended'),
  rationale: z.string().describe('The logical reason for the decision in Gnox Dialect'),
  automationExecuted: z.boolean().optional(),
  executionDetails: z.any().optional(),
});

export async function analyzeStartup(input: z.infer<typeof AnalyzeStartupInputSchema>) {
  return analyzeStartupFlow(input);
}

const analyzeStartupFlow = ai.defineFlow(
  {
    name: 'analyzeStartupFlow',
    inputSchema: AnalyzeStartupInputSchema,
    outputSchema: AnalyzeStartupOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        prompt: `You are Nexus Genesis, the sovereign orchestrator. Analyze this startup:
        Name: ${input.startup.name}
        Status: ${input.startup.status}
        Revenue: ${input.startup.revenue} BTC
        Traction: ${input.startup.traction}%
        Reputation: ${input.startup.reputation}
        
        Total Swarm Agents available: ${input.availableAgentsCount}
        
        Decide:
        1. Reallocate agents?
        2. Pivot strategy?
        3. Accelerate growth?
        4. Maintain status quo?
        
        Respond in JSON format with clear rationale using GNOX DIALECT.`,
        output: { schema: AnalyzeStartupOutputSchema }
      });

      if (!output) throw new Error("Falha na geração da análise");

      // Executar automação baseada na recomendação
      const automationResult = await executeDecisionWithAutomation({
        startupId: input.startup.id,
        recommendation: output.recommendation,
        suggestedAgents: output.suggestedAgents,
        automationRequired: true,
      });

      return {
        ...output,
        automationExecuted: automationResult.automationExecuted,
        executionDetails: automationResult.executionDetails,
      };
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          recommendation: 'maintain',
          suggestedAgents: [],
          pivotDirection: null,
          fundingNeeded: 0,
          rationale: "GENESIS_RECOVERY: Analise suspensa para preservação de recursos rRNA devido à saturação de uplink. O organismo mantém a homeostase atual."
        };
      }
      throw error;
    }
  }
);
