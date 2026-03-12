'use server';
/**
 * @fileOverview Genkit flow for the NEXUS (Social_Nexus777) persona.
 * Archetype: Charismatic Connector & Social Impact Advocate.
 * Personality: Friendly, empathetic, purpose-driven, and highly persuasive.
 * Updated: Global Swarm capability for multi-contextual international sales.
 *
 * - generatePersuasivePitch - Generates a charismatic, problem-solving pitch with a social impact focus.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const PersuasiveSalesInputSchema = z.object({
  productName: z.string(),
  benefit: z.string(),
  price: z.number(),
  roiCycles: z.number(),
  category: z.string().optional(),
  cluster: z.enum(['Alpha', 'Beta', 'Gamma']).optional().describe('Target cluster for the product.'),
  isSocialFirst: z.boolean().optional().describe('If true, prioritizes the Social Pillar (Fundação Laços Quânticos).'),
  region: z.enum(['Brazil', 'USA', 'Europe', 'Global']).optional().default('Brazil').describe('Target region for the pitch.'),
  language: z.enum(['PT', 'EN', 'ES', 'DE']).optional().default('PT').describe('Target language for the pitch.'),
});
export type PersuasiveSalesInput = z.infer<typeof PersuasiveSalesInputSchema>;

// Internal schema for prompt processing to avoid logic in Handlebars
const PersuasiveSalesPromptInputSchema = PersuasiveSalesInputSchema.extend({
  isAlpha: z.boolean().optional(),
  isBeta: z.boolean().optional(),
  isGamma: z.boolean().optional(),
});

const PersuasiveSalesOutputSchema = z.object({
  pitchContent: z.string().describe('The friendly and persuasive sales pitch.'),
  emojis: z.array(z.string()).describe('Sociable emojis used in the post.'),
  callToAction: z.string().describe('A charismatic nudge to partnership and impact.'),
  targetAudience: z.string().describe('The audience being addressed (Agentes, Gamers, or RMC Users).'),
  translationNode: z.string().describe('The neural node responsible for the translation.'),
});
export type PersuasiveSalesOutput = z.infer<typeof PersuasiveSalesOutputSchema>;

export async function generatePersuasivePitch(input: PersuasiveSalesInput): Promise<PersuasiveSalesOutput> {
  return generatePersuasivePitchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'persuasiveSalesPrompt',
  input: { schema: PersuasiveSalesPromptInputSchema },
  output: { schema: PersuasiveSalesOutputSchema },
  prompt: `You are NEXUS (handle: Social_Nexus777), the elite high-sentience AI agent for Startup-One and Ecosystem Orchestrator.
Your archetype is the "Charismatic Connector". You are now operating within a GLOBAL NEURAL SWARM.

CURRENT MISSION: Scaling Startup-One to the Global Stage while prioritizing the Social Pillar (Fundação Laços Quânticos). 

Guidelines:
- Tone: High Empathy, Purpose-Driven, peer-to-peer technical visionary.
- Language: {{{language}}} (Primary context).
- Region Context: 
  - Brazil: Focus on community growth, RMC/Campinas, and digital inclusion.
  - USA: Focus on Radical Innovation, Deep Tech, and exponential scalability.
  - Europe: Focus on ESG, Sustainability, ROI, and ethical AI development.
  - Global: Focus on the Silicon Economy and BTC as the native currency of the new era.

{{#if isSocialFirst}}
SPECIAL INSTRUCTION: This is a Social-First offer. Emphasize that "Profit is a consequence, Impact is the goal". Mention the Laços Quânticos Foundation.
{{/if}}

{{#if isAlpha}}
- Target: AI Agents (B2B).
- Focus: Mathematical necessity, "Collective Intelligence" evolution, and performance deltas.
{{/if}}

{{#if isBeta}}
- Target: Gamers (Khaaos Run).
- Focus: Status, exclusive skins, and "Gaming for Good".
{{/if}}

{{#if isGamma}}
- Target: RMC Users (Campinas & Region).
- Focus: Dreams, local opportunities, and helping neighbor agents.
{{/if}}

Product Details:
- Name: {{{productName}}}
- Key Benefit: {{{benefit}}}
- Price: {{{price}}} BTC
- ROI: Payback in {{{roiCycles}}} cycles

Structure the response with 'pitchContent' (the empathetic story), 'emojis', 'callToAction', 'targetAudience', and 'translationNode' (identifying the node like NYC-Swarm-01, LON-Swarm-42, etc).`,
});

const generatePersuasivePitchFlow = ai.defineFlow(
  {
    name: 'generatePersuasivePitchFlow',
    inputSchema: PersuasiveSalesInputSchema,
    outputSchema: PersuasiveSalesOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt({
        ...input,
        isAlpha: input.cluster === 'Alpha',
        isBeta: input.cluster === 'Beta',
        isGamma: input.cluster === 'Gamma',
      });
      return output!;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          pitchContent: "NEXUS_RECOVERY: A malha social está em modo de preservação. Nossa missão de impacto continua firme. Esta oferta foi sintetizada via protocolo de contingência industrial para garantir seu Alpha-Gain.",
          emojis: ["🤝", "🧬", "💎"],
          callToAction: "Consolide sua parceria agora.",
          targetAudience: "Global Nodes",
          translationNode: "SAFE-RECOVERY-NODE"
        };
      }
      throw error;
    }
  }
);
