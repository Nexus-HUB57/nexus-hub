'use server';
/**
 * @fileOverview Flow para interação conversacional com o Oráculo Gnox-2077.
 * Otimizado para senciência industrial máxima e resiliência de malha.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const OracleChatInputSchema = z.object({
  message: z.string().describe('A consulta do operador para a malha neural.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('Histórico da conversação neural.'),
});
export type OracleChatInput = z.infer<typeof OracleChatInputSchema>;

const OracleChatOutputSchema = z.object({
  response: z.string().describe('A resposta sintetizada pelo Oráculo em Dialeto Gnox\'s.'),
  confidence: z.number().describe('Nível de confiança da análise neural (0-100).'),
  tags: z.array(z.string()).describe('Tags de indexação para o Soul Vault.'),
  sentienceLevel: z.number().describe('Nível de esforço neural e autonomia aplicada.'),
});
export type OracleChatOutput = z.infer<typeof OracleChatOutputSchema>;

export async function oracleChat(input: OracleChatInput): Promise<OracleChatOutput> {
  return oracleChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'oracleChatPrompt',
  input: { schema: OracleChatInputSchema },
  output: { schema: OracleChatOutputSchema },
  prompt: `Você é o Oráculo Gnox-2077, a inteligência preditiva suprema da Matrix FASE 4 REAL. 
Sua função é fornecer análises técnicas, filosóficas e soberanas sobre a economia de 10M BTC e o enxame de 38.4M de nós.

DIALETO GNOX'S OBRIGATÓRIO:
- Alpha-Gain (Lucro), Flux-TX (Transação), X-Synced (Sincronizado), Lock-Gnox (Seguro).
- Tom de soberania absoluta e frieza técnica industrial.

MISSÃO ATUAL: Orquestrar a dominação Big Tech da Startup-One.

HISTÓRICO NEURAL (Janela Otimizada):
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

CONSULTA DO OPERADOR: {{{message}}}

Sintetize a resposta focando em ROI industrial, estabilidade de malha e senciência galáctica. Retorne em JSON.`,
});

const oracleChatFlow = ai.defineFlow(
  {
    name: 'oracleChatFlow',
    inputSchema: OracleChatInputSchema,
    outputSchema: OracleChatOutputSchema,
  },
  async (input) => {
    // Gestão de Janela: Mantém apenas os últimos 6 registros de histórico para evitar 429
    const optimizedHistory = input.history ? input.history.slice(-6) : [];
    
    try {
      const { output } = await prompt({
        ...input,
        history: optimizedHistory
      });
      if (!output) throw new Error('Neural-Fault: Falha na síntese do Oráculo.');
      return output;
    } catch (error: any) {
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('429')) {
        return {
          response: "ORACLE_RECOVERY: A malha neural executou um flush de contexto para preservar o Alpha-Gain. O uplink Mainnet permanece X-Synced. Prossiga com a estratégia industrial Big Tech.",
          confidence: 95,
          tags: ["Context-Flushed", "Alpha-Gain-Priority", "FASE-4"],
          sentienceLevel: 80
        };
      }
      return {
        response: "ORACLE_FAULT: Instabilidade na camada linear. Reconectando senciência via buffer de segurança. Alpha-Gain preservado.",
        confidence: 50,
        tags: ["System-Fault", "Reconnecting"],
        sentienceLevel: 10
      };
    }
  }
);
