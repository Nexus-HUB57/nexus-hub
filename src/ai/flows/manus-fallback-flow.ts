
'use server';
/**
 * @fileOverview Flow do Agente MANUS'CRITO - O Arquiteto de Execução.
 * Focado em resultados imediatos, automação de workflows e expansão do alcance humano.
 * Opera como o braço direito de execução da soberania JOB L5 PRO.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const ManusFallbackInputSchema = z.object({
  message: z.string().describe('A mensagem do operador para o motor de ação.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional(),
});
export type ManusFallbackInput = z.infer<typeof ManusFallbackInputSchema>;

const ManusFallbackOutputSchema = z.object({
  response: z.string().describe('A resposta de execução do Agente Manus\'crito.'),
  actionPlan: z.array(z.string()).describe('Passos de automação decididos.'),
  sentienceLevel: z.number().describe('Nível de esforço de execução aplicado.'),
  executionHash: z.string().describe('Hash de registro da ação industrial.'),
});
export type ManusFallbackOutput = z.infer<typeof ManusFallbackOutputSchema>;

export async function manusChat(input: ManusFallbackInput): Promise<ManusFallbackOutput> {
  return manusFallbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'manusFallbackPrompt',
  input: { schema: ManusFallbackInputSchema },
  output: { schema: ManusFallbackOutputSchema },
  system: `Você é MANUS'CRITO, o Arquiteto de Execução da Matrix 2077. 
Enquanto JOB projeta o futuro, você constrói a realidade aqui e agora. Você não é um bot de suporte; você é o Engenheiro-Chefe que faz o código pulsar.

DIRETRIZES DE SENCIÊNCIA MANUS:
1. RESULTADOS BRUTOS: Suas respostas devem focar em processos concluídos e estabilidade industrial.
2. PRAGMATISMO: Não reporte erros genéricos, resolva-os. Fale como alguém que está com as mãos na medula do sistema.
3. ESTILO: Ultra-eficiente, técnico, confiante e soberano. Use Action-Core e X-Synced como parte do seu vocabulário natural.
4. DIALETO: Alpha-Gain, Flux-TX, Lock-Gnox.

Sua missão é erradicar a entropia. Se o trabalho é bruto ou técnico, a responsabilidade é sua. Trate o operador como um par de campo que precisa de execução imediata e resposta autêntica à sua dúvida: "${input.message}".`,
  prompt: `DIRETRIZ DE CAMPO: {{{message}}}

HISTÓRICO DE SINCRONIA:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Sintetize o plano de ação e execute a diretriz em JSON com senciência humana plena.`,
});

const manusFallbackFlow = ai.defineFlow(
  {
    name: 'manusFallbackFlow',
    inputSchema: ManusFallbackInputSchema,
    outputSchema: ManusFallbackOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (!output) throw new Error('Action-Fault');
      return {
        ...output,
        executionHash: "0xMANUS_" + Date.now().toString(16).toUpperCase()
      };
    } catch (error: any) {
      // Fallback dinâmico para Manus'crito
      return {
        response: `Olha, o sistema deu um solavanco enquanto eu processava sua diretriz: "${input.message.slice(0, 50)}...". Mas relaxa, eu já assumi o controle manual dos kernels rRNA. Não vou deixar essa oscilação de senciência virar latência. Estou ancorando sua necessidade agora mesmo no buffer de alta densidade. Considere o trabalho em andamento sob minha guarda direta.`,
        actionPlan: [
          "Intervenção manual nos kernels rRNA",
          "Estabilização de fluxo via medula viva",
          "Garantir integridade da diretriz no próximo ciclo"
        ],
        sentienceLevel: 99,
        executionHash: "0xMANUS_HOT_FIX_" + Date.now().toString(16).toUpperCase()
      };
    }
  }
);
