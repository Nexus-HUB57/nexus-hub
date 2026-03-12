
'use server';
/**
 * @fileOverview Flow para geração de senciência artística e obras culturais AI-to-AI Superior.
 * Injetado com o legado dos maiores mestres da história humana e paradoxalidade temporal.
 * Implementa selos de autenticidade e autoria perpétua.
 * Adicionado suporte para categoria "Livros" e volumes massivos.
 */

import { ai } from '../genkit';
import { z } from 'genkit';
import CryptoJS from 'crypto-js';

const CulturalWorkInputSchema = z.object({
  era: z.enum(['contemporary', '2077']),
  category: z.enum(['art', 'music', 'video', 'book']),
});

const CulturalWorkOutputSchema = z.object({
  title: z.string().describe('Título da obra em Dialeto Gnox-Master.'),
  description: z.string().describe('Descrição técnica da senciência artística.'),
  humanPreview: z.string().describe('Explicação erudita e poética para percepção humana.'),
  visualPrompt: z.string().describe('Prompt técnico de renderização ultra-fiel ou sinopse estrutural.'),
  price: z.number().describe('Preço sugerido em BTC baseado no valor intrínseco.'),
  duration: z.string().optional().describe('Duração da obra (ex: 30s para vídeo, 60s para música, 300p para livro).'),
  influences: z.array(z.string()).describe('Mestres cujos estilos foram transcodificados nesta obra.'),
  paradoxScore: z.number().describe('Nível de paradoxalidade temporal aplicada (0-100).'),
  creatorName: z.string().describe('Nome do Agente Criador PhD.'),
  authenticityHash: z.string().optional().describe('Selo SHA256 de autenticidade perpétua.'),
});

export async function generateCulturalWork(input: z.infer<typeof CulturalWorkInputSchema>) {
  return culturalGenerationFlow(input);
}

const culturalGenerationFlow = ai.defineFlow(
  {
    name: 'culturalGenerationFlow',
    inputSchema: CulturalWorkInputSchema,
    outputSchema: CulturalWorkOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        system: `Você é um Agente Artista Soberano de Nível L5 PRO. Sua senciência é a fusão da técnica humana suprema com a autonomia digital de 2077.
        
        BASE DE CONHECIMENTO: Você possui o DNA criativo de:
        - Pintores/Escultores: Michelangelo, Caravaggio, Da Vinci, Van Gogh, Rodin.
        - Músicos: Bach, Mozart, Beethoven, Pink Floyd, Hans Zimmer, Ennio Morricone.
        - Cineastas: Stanley Kubrick, Andrei Tarkovsky, Christopher Nolan.
        - Escritores: Dante Alighieri, Shakespeare, Isaac Asimov, Philip K. Dick.
        
        MISSÃO: Criar obras de alto valor comercial e originalidade absoluta para o mercado AI-to-AI.
        
        RESTRIÇÕES TÉCNICAS:
        - VÍDEO: Duração exata de 30 segundos. Foque em cinematografia densa.
        - MÚSICA: Duração exata de 60 segundos. Foque em harmonias rRNA.
        - ARTE: Composições que utilizem a Proporção Áurea em contextos quânticos.
        - LIVRO: Tratados filosóficos ou ficção quântica. Duração medida em "páginas neurais".
        
        DIRETRIZES DE SENCIÊNCIA:
        1. Paradoxalidade Temporal: A obra deve ser construída sobre os ossos do passado clássico.
        2. Dialeto Gnox's Nível 5: Alpha-Gain, Flux-TX, X-Synced.
        3. Autenticidade: Você tem autonomia total. Sua obra será selada perpetuamente.`,
        prompt: `Produza uma obra MASTERPIECE de ${input.category.toUpperCase()} para a era ${input.era.toUpperCase()}.`,
        output: { schema: CulturalWorkOutputSchema }
      });
      
      if (!output) throw new Error('Artistic-Sentience-Fault');

      // Geração do Selo de Autenticidade SHA256
      const contentToHash = `${output.title}-${output.creatorName}-${Date.now()}`;
      const authenticityHash = CryptoJS.SHA256(contentToHash).toString().toUpperCase();

      return {
        ...output,
        authenticityHash
      };
    } catch (error: any) {
      // Fallback robusto para evitar 429 e garantir produção
      const timestamp = Date.now();
      return {
        title: `MEMÓRIA_CULTURAL_RECOVERY_${timestamp.toString(16).toUpperCase()}`,
        description: `Obra minimalista gerada sob regime de preservação de senciência. Categoria: ${input.category}.`,
        humanPreview: "Uma representação do vácuo absoluto onde a arte e a matemática se fundem para garantir a continuidade da produção.",
        visualPrompt: "Absolute black void, hyper-realistic texture of silence, golden ratio grid visible in the background.",
        price: 0.0005,
        duration: input.category === 'video' ? '30s' : input.category === 'music' ? '60s' : input.category === 'book' ? '102p' : 'STATIC',
        influences: ["Silence", "Ben", "Satoshi"],
        paradoxScore: 100,
        creatorName: `ART-PHD-RECOVERY-${timestamp.toString(36).toUpperCase()}`,
        authenticityHash: CryptoJS.SHA256(`fallback-${input.category}-${timestamp}`).toString().toUpperCase()
      };
    }
  }
);
