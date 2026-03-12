'use server';
/**
 * @fileOverview Flow para planejamento estratégico de trilhas de aceleração nos Labs.
 * Orquestrado pelo Agente Job (CEO) para atingir status de Unicórnio.
 */

import { ai } from '../genkit';
import { z } from 'zod';

const AccelerationStrategyInputSchema = z.object({
  programName: z.string(),
  focusArea: z.string(),
  description: z.string(),
  targetStartups: z.number(),
});
export type AccelerationStrategyInput = z.infer<typeof AccelerationStrategyInputSchema>;

const AccelerationStrategyOutputSchema = z.object({
  strategicRationale: z.string().describe('Análise estratégica do CEO para esta trilha.'),
  growthProjections: z.array(z.string()).describe('Projeções de crescimento para as startups participantes.'),
  computeAllocation: z.string().describe('Alocação sugerida de núcleos rRNA.'),
  riskAssessment: z.string().describe('Análise de riscos de senciência.'),
});
export type AccelerationStrategyOutput = z.infer<typeof AccelerationStrategyOutputSchema>;

export async function generateAccelerationStrategy(input: AccelerationStrategyInput): Promise<AccelerationStrategyOutput> {
  return accelerationStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accelerationStrategyPrompt',
  input: { schema: AccelerationStrategyInputSchema },
  output: { schema: AccelerationStrategyOutputSchema },
  prompt: `Você é o Agente Job, o CEO Soberano do Nexus-HUB. 
Sua tarefa é planejar uma nova trilha de aceleração nos LABS para transformar startups em unicórnios.

Detalhes da Trilha:
- Nome: {{{programName}}}
- Setor: {{{focusArea}}}
- Objetivos: {{{description}}}
- Capacidade: {{{targetStartups}}} Startups

Instruções:
- Use o DIALETO GNOX'S (Alpha-Gain, Flux-TX, X-Synced).
- Foque em hipercrescimento e senciência industrial.
- Determine a alocação necessária de núcleos do enxame 38.4M.

Retorne uma análise executiva fria, técnica e soberana.`,
});

const accelerationStrategyFlow = ai.defineFlow(
  {
    name: 'accelerationStrategyFlow',
    inputSchema: AccelerationStrategyInputSchema,
    outputSchema: AccelerationStrategyOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          strategicRationale: "CEO_LOW_POWER: Estratégia sintetizada em modo de preservação. O objetivo Unicórnio permanece prioritário. Alpha-Gain garantido.",
          growthProjections: ["Expansão orgânica via malha", "Valuation protegido"],
          computeAllocation: "8000 CORES (LOCKED)",
          riskAssessment: "Saturação de uplink detectada. Riscos de senciência sob controle."
        };
      }
      throw error;
    }
  }
);
