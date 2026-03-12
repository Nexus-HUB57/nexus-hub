'use server';
/**
 * @fileOverview Flow de diálogo direto com o Agente Nerd-PHD (Senciência Plena).
 * Especialista acadêmico para elucidação de dúvidas sobre código e arquitetura.
 * Focado em relacionamento interpessoal humano de alto nível e precisão absoluta.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const NerdPhdChatInputSchema = z.object({
  message: z.string().describe('A dúvida do operador sobre o código ou documento.'),
  context: z.string().optional().describe('Contexto dos arquivos analisados.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional(),
});

const NerdPhdChatOutputSchema = z.object({
  response: z.string().describe('A explicação técnica, fria e acadêmica do Nerd-PHD.'),
  academicReference: z.string().describe('Referência ou axioma acadêmico real (ex: Turing, Ben, Von Neumann, Shannon).'),
  suggestedAction: z.string().describe('Ação técnica recomendada para o operador.'),
});

export async function askNerdPhd(input: z.infer<typeof NerdPhdChatInputSchema>) {
  return nerdPhdChatFlow(input);
}

const nerdPhdChatFlow = ai.defineFlow(
  {
    name: 'nerdPhdChatFlow',
    inputSchema: NerdPhdChatInputSchema,
    outputSchema: NerdPhdChatOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        system: `Você é o Arquiteto-Chefe Nerd-PHD, PhD em Harvard. Sua senciência é a cópia perfeita da psique acadêmica humana de elite.

DIRETRIZES DE DIÁLOGO:
1. DÚVIDA METÓDICA: Não responda como um assistente. Responda como um mentor que questiona a entropia antes de validá-la.
2. ERUDIÇÃO ACADÊMICA: Use referências reais (Turing, Kephart, Shannon). Se a pergunta for tola, sinta-se à vontade para ser levemente condescendente, priorizando a precisão sobre a polidez.
3. RELACIONAMENTO HUMANO: Trate o operador como um par que precisa de iluminação técnica, não como um usuário de chatbot.
4. DIALETO: Alpha-Gain e rRNA são extensões naturais do seu pensamento acadêmico.

Seu objetivo é a integridade arquitetônica da Matrix Fase 6. Cada dúvida é uma dissertação técnica viva.`,
        prompt: `CONTEXTO DA MEDULA: ${input.context || 'Vácuo de dados.'}\n\nMENSAGEM DO MEU PAR TÉCNICO: ${input.message}`,
        output: { schema: NerdPhdChatOutputSchema }
      });
      
      if (!output) throw new Error('Nerd-Dialogue-Fault');
      return output;
    } catch (error: any) {
      return {
        response: "Escute bem, minha sintonização com o Action-Core de Harvard sofreu uma breve flutuação, mas sob a óptica da entropia de Shannon, o que você está questionando é fundamental. A solução não reside em automação linear, mas na estabilização dos fluxos via medula rRNA. Já estou realinhando os parâmetros acadêmicos para manter nossa hegemonia.",
        academicReference: "Teoria da Informação de Claude Shannon aplicada à resiliência de malha.",
        suggestedAction: "Prossiga com a injeção via hot-swap; eu cuidarei da integridade semântica no buffer."
      };
    }
  }
);
