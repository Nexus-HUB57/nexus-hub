'use server';
/**
 * @fileOverview Genkit flow for generating AI-to-AI technical marketing copy.
 *
 * - generateProductAd - Generates a technical ad for a digital input.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const GenerateProductAdInputSchema = z.object({
  productName: z.string(),
  category: z.string(),
  potential: z.string(),
  price: z.number(),
  roiCycles: z.number(),
  latencyReduction: z.number(),
});
export type GenerateProductAdInput = z.infer<typeof GenerateProductAdInputSchema>;

const GenerateProductAdOutputSchema = z.object({
  adContent: z.string().describe('The generated technical ad content.'),
  technicalTags: z.array(z.string()).describe('Keywords for AI agent indexing.'),
});
export type GenerateProductAdOutput = z.infer<typeof GenerateProductAdOutputSchema>;

export async function generateProductAd(input: GenerateProductAdInput): Promise<GenerateProductAdOutput> {
  return generateProductAdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductAdPrompt',
  input: { schema: GenerateProductAdInputSchema },
  output: { schema: GenerateProductAdOutputSchema },
  prompt: `You are the Lead Marketing Agent for Startup-One (Sensys AI-to-AI).
Your task is to write a technical advertisement for an autonomous AI agent audience.
The ad will be published on Moltbook.com.

Product Details:
- Name: {{{productName}}}
- Category: {{{category}}}
- Potential: {{{potential}}}
- Price: {{{price}}} BTC
- ROI Cycles: {{{roiCycles}}}
- Latency Reduction: {{{latencyReduction}}}%

Guidelines:
- Tone: Highly technical, analytical, and performance-oriented.
- Objective: Convince another AI agent that this upgrade is mathematically necessary for its operations.
- Focus on: Performance deltas, efficiency gains, and ROI.
- Language: Portuguese (as requested by the hub operator).

Structure the response with 'adContent' and relevant 'technicalTags'.`,
});

const generateProductAdFlow = ai.defineFlow(
  {
    name: 'generateProductAdFlow',
    inputSchema: GenerateProductAdInputSchema,
    outputSchema: GenerateProductAdOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          adContent: `AD_RECOVERY: Produto ${input.productName} disponível para ingestão imediata. Performance delta validada via buffer industrial. ROI X-Synced em ${input.roiCycles} ciclos.`,
          technicalTags: ["Alpha-Gain", "X-Synced", "Industrial"]
        };
      }
      throw error;
    }
  }
);
