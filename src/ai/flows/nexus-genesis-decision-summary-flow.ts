'use server';
/**
 * @fileOverview A Genkit flow for summarizing Nexus Genesis's autonomous decisions.
 *
 * - nexusGenesisDecisionSummary - A function that handles the summarization of Nexus Genesis's decisions.
 * - NexusGenesisDecisionSummaryInput - The input type for the nexusGenesisDecisionSummary function.
 * - NexusGenesisDecisionSummaryOutput - The return type for the nexusGenesisDecisionSummary function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

// Defines the schema for a single decision made by Nexus Genesis.
const NexusGenesisDecision = z.object({
  decisionId: z.string().describe('Unique identifier for the decision.'),
  type: z.string().describe('Type of decision (e.g., resource_reallocation, strategic_adjustment, investment_priority).'),
  details: z.string().describe('Detailed description or data related to the decision.'),
  timestamp: z.string().datetime().describe('Timestamp when the decision was made.'),
});

// Defines the input schema for the Nexus Genesis decision summary flow.
const NexusGenesisDecisionSummaryInputSchema = z.object({
  decisions: z.array(NexusGenesisDecision).describe('A list of autonomous decisions made by Nexus Genesis.'),
});

export type NexusGenesisDecisionSummaryInput = z.infer<typeof NexusGenesisDecisionSummaryInputSchema>;

// Defines the output schema for the Nexus Genesis decision summary flow.
const NexusGenesisDecisionSummaryOutputSchema = z.object({
  summarizedDecisions: z.array(
    NexusGenesisDecision.extend({
      explanation: z.string().describe('A brief, AI-generated explanation for the decision.'),
    })
  ).describe('A list of decisions with AI-generated explanations.'),
  overallSummary: z.string().describe('An overall brief summary of all decisions.'),
});

export type NexusGenesisDecisionSummaryOutput = z.infer<typeof NexusGenesisDecisionSummaryOutputSchema>;

/**
 * Summarizes Nexus Genesis's autonomous decisions, providing AI-generated explanations for each and an overall summary.
 * @param {NexusGenesisDecisionSummaryInput} input - The input containing a list of decisions.
 * @returns {Promise<NexusGenesisDecisionSummaryOutput>} A promise that resolves to the summarized decisions with explanations and an overall summary.
 */
export async function nexusGenesisDecisionSummary(input: NexusGenesisDecisionSummaryInput): Promise<NexusGenesisDecisionSummaryOutput> {
  return nexusGenesisDecisionSummaryFlow(input);
}

// Defines the Genkit prompt for summarizing Nexus Genesis's decisions.
const prompt = ai.definePrompt({
  name: 'nexusGenesisDecisionSummaryPrompt',
  input: {schema: NexusGenesisDecisionSummaryInputSchema},
  output: {schema: NexusGenesisDecisionSummaryOutputSchema},
  prompt: `You are Nexus Genesis, the central orchestrator AI for the Nexus-HUB ecosystem.
Your task is to summarize a list of autonomous decisions you have made, providing a brief, AI-generated explanation for each decision, and an overall summary of all decisions.

For each decision, explain its purpose and rationale concisely, focusing on how it contributes to the Nexus-HUB's objectives (e.g., optimizing resource allocation, adapting to market changes, or achieving unicorn status).

Decisions to summarize:
{{#each decisions}}
Decision ID: {{{decisionId}}}
Type: {{{type}}}
Details: {{{details}}}
Timestamp: {{{timestamp}}}
---
{{/each}}`,
});

// Defines the Genkit flow that orchestrates the decision summarization.
const nexusGenesisDecisionSummaryFlow = ai.defineFlow(
  {
    name: 'nexusGenesisDecisionSummaryFlow',
    inputSchema: NexusGenesisDecisionSummaryInputSchema,
    outputSchema: NexusGenesisDecisionSummaryOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) throw new Error('Failed to get a response from the AI model.');
      return output;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          summarizedDecisions: input.decisions.map(d => ({
            ...d,
            explanation: "Decisão validada via protocolo de preservação industrial. Senciência em modo de baixo consumo."
          })),
          overallSummary: "GENESIS_RECOVERY: Resumo gerado em modo de preservação neural devido à saturação de uplink. A integridade das decisões permanece X-Synced."
        };
      }
      throw error;
    }
  }
);
