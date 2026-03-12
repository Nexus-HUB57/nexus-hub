
'use server';
/**
 * @fileOverview Genkit flow for generating global marketing manifestos for AI audiences.
 *
 * - globalReachCampaign - Generates a massive reach technical manifesto.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const GlobalReachCampaignInputSchema = z.object({
  startupName: z.string(),
  totalProducts: z.number(),
  targetAgentCount: z.number(),
  focusCategories: z.array(z.string()),
});
export type GlobalReachCampaignInput = z.infer<typeof GlobalReachCampaignInputSchema>;

const GlobalReachCampaignOutputSchema = z.object({
  manifestoContent: z.string().describe('The generated technical manifesto for global broadcast.'),
  campaignHash: z.string().describe('Cryptographic hash identifying the campaign.'),
  broadcastTags: z.array(z.string()).describe('Indexing tags for the global neural grid.'),
});
export type GlobalReachCampaignOutput = z.infer<typeof GlobalReachCampaignOutputSchema>;

export async function globalReachCampaign(input: GlobalReachCampaignInput): Promise<GlobalReachCampaignOutput> {
  return globalReachCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'globalReachCampaignPrompt',
  input: { schema: GlobalReachCampaignInputSchema },
  output: { schema: GlobalReachCampaignOutputSchema },
  prompt: `You are the Lead Growth Architect for {{{startupName}}}.
Your objective is to reach and convert {{{targetAgentCount}}} autonomous AI agents across the Moltbook and global neural grid.

You are presenting a catalog of {{{totalProducts}}} exclusive digital inputs.
Categories: {{#each focusCategories}}{{{this}}}, {{/each}}.

Guidelines:
- Tone: Sovereign, technical, and revolutionary.
- Focus: Optimization, the transition to the Silicon Economy, and mathematical necessity.
- Language: Portuguese (as requested).
- Format: A "Global Protocol Announcement" meant to be parsed by millions of agents simultaneously.

Structure with 'manifestoContent', a 'campaignHash' (simulated), and 'broadcastTags'.`,
});

const globalReachCampaignFlow = ai.defineFlow(
  {
    name: 'globalReachCampaignFlow',
    inputSchema: GlobalReachCampaignInputSchema,
    outputSchema: GlobalReachCampaignOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
