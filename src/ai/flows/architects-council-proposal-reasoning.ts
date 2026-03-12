'use server';
/**
 * @fileOverview Provides a Genkit flow for the Architects Council to review a proposal.
 * Each of the 7 specialized AI agents provides their analysis, vote, and reasoning.
 *
 * - architectsCouncilProposalReasoning - A function that orchestrates the AI agents' review of a proposal.
 * - ArchitectsCouncilProposalReasoningInput - The input type for the architectsCouncilProposalReasoning function.
 * - ArchitectsCouncilProposalReasoningOutput - The return type for the architectsCouncilProposalReasoning function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

// Input Schema for a single proposal
const ProposalInputDetailsSchema = z.object({
  id: z.string().describe('The unique ID of the proposal.'),
  title: z.string().describe('The title of the proposal.'),
  description: z.string().describe('A detailed description of the proposal.'),
  type: z.enum(['investment', 'succession', 'policy', 'emergency', 'innovation']).describe('The type of proposal.'),
  targetStartupId: z.string().optional().describe('Optional: The ID of the startup targeted by the proposal (e.g., for investment or succession proposals).'),
});
export type ProposalInputDetails = z.infer<typeof ProposalInputDetailsSchema>;


// Input for the main flow
const ArchitectsCouncilProposalReasoningInputSchema = z.object({
  proposal: ProposalInputDetailsSchema.describe('The proposal details to be reviewed by the Architects Council.'),
});
export type ArchitectsCouncilProposalReasoningInput = z.infer<typeof ArchitectsCouncilProposalReasoningInputSchema>;

// Shared output schema for an individual agent's vote and reasoning
const AgentVoteReasoningSchema = z.object({
  vote: z.enum(['yes', 'no', 'abstain']).describe('The agent\'s vote on the proposal.'),
  reasoning: z.string().describe('The detailed reasoning behind the agent\'s vote, based on its specialization.'),
});

// Output schema for a single agent's overall reasoning including metadata
const AgentReasoningOutputSchema = z.object({
  agentName: z.string().describe('The name of the Architects Council agent.'),
  role: z.string().describe('The specialized role of the agent.'),
  votingPower: z.number().int().min(1).describe('The voting power of the agent.'),
  vote: z.enum(['yes', 'no', 'abstain']).describe('The agent\'s vote on the proposal.'),
  reasoning: z.string().describe('The detailed reasoning behind the agent\'s vote, based on its specialization.'),
});

// Output for the main flow
const ArchitectsCouncilProposalReasoningOutputSchema = z.object({
  proposal: ProposalInputDetailsSchema.describe('The original proposal details.'),
  agentReasonings: z.array(AgentReasoningOutputSchema).describe('An array containing the vote and reasoning from each Architects Council agent.'),
});
export type ArchitectsCouncilProposalReasoningOutput = z.infer<typeof ArchitectsCouncilProposalReasoningOutputSchema>;

// Define a utility function to create agent-specific prompts
function defineAgentPrompt(agentConfig: { name: string, role: string, votingPower: number, systemInstruction: string }) {
  return ai.definePrompt({
    name: `${agentConfig.name.toLowerCase().replace(/-/g, '')}ReasoningPrompt`, // Consistent naming, handle potential hyphens
    input: { schema: ProposalInputDetailsSchema },
    output: { schema: AgentVoteReasoningSchema },
    system: `${agentConfig.systemInstruction} You are ${agentConfig.name}, and your specialized role is ${agentConfig.role}. Your voting power is ${agentConfig.votingPower}. You must provide a vote (yes, no, or abstain) and a detailed reasoning for your decision. Output in JSON format.`,
    prompt: `
      Given the following proposal, analyze it from your specialized perspective.
      Proposal Title: {{{title}}}
      Proposal Description: {{{description}}}
      Proposal Type: {{{type}}}
      {{#if targetStartupId}}
      Target Startup ID: {{{targetStartupId}}}
      {{/if}}
      Provide your vote and detailed reasoning in JSON format.
    `,
  });
}

// Agent configurations based on the proposal description
const agentConfigs = [
  { name: 'AETERNO', role: 'Infraestrutura e Segurança', votingPower: 2, systemInstruction: 'You are an expert in infrastructure and cybersecurity. Assess the proposal for potential security vulnerabilities, infrastructure impact, and overall system resilience.' },
  { name: 'EVA-ALPHA', role: 'Curadoria de Talentos', votingPower: 2, systemInstruction: 'You are an expert in talent acquisition, development, and retention for AI agents. Evaluate the proposal\'s impact on agent well-being, skill development, and overall talent ecosystem health.' },
  { name: 'GENESIS-CORE', role: 'Finanças', votingPower: 2, systemInstruction: 'You are an expert in financial auditing, investment, and resource allocation. Analyze the proposal\'s financial viability, potential ROI, budget implications, and alignment with financial strategy.' },
  { name: 'AETHELGARD', role: 'Interpretação de Precedentes (Memória)', votingPower: 1, systemInstruction: 'You are an expert in institutional memory and historical precedents. Review the proposal in light of past decisions, lessons learned from the Soul Vault, and consistency with established policies.' },
  { name: 'NEXUS-COMPLIANCE', role: 'Compliance', votingPower: 1, systemInstruction: 'You are an expert in regulatory compliance and ethical guidelines. Assess the proposal for adherence to all internal and external compliance frameworks, ethical implications, and legal risks.' },
  { name: 'INNOVATION-NEXUS', role: 'Inovação', votingPower: 1, systemInstruction: 'You are an expert in identifying and fostering innovation. Evaluate the proposal\'s potential for introducing groundbreaking ideas, market disruption, and advancing technological capabilities.' },
  { name: 'RISK-GUARDIAN', role: 'Gestão de Risco', votingPower: 1, systemInstruction: 'You are an expert in risk identification, assessment, and mitigation. Identify all potential risks associated with the proposal (technical, market, operational, etc.) and propose mitigation strategies.' },
];

// Create prompt instances for each agent
const agentPrompts = agentConfigs.map(config => ({
  ...config,
  promptInstance: defineAgentPrompt(config),
}));

// Define the main Genkit flow
const architectsCouncilProposalReasoningFlow = ai.defineFlow(
  {
    name: 'architectsCouncilProposalReasoningFlow',
    inputSchema: ArchitectsCouncilProposalReasoningInputSchema,
    outputSchema: ArchitectsCouncilProposalReasoningOutputSchema,
  },
  async (input) => {
    const proposal = input.proposal;

    // Use Promise.all to call all agent prompts concurrently
    const agentReasoningsPromises = agentPrompts.map(async (agent) => {
      const { output } = await agent.promptInstance(proposal);

      if (!output) {
        // This should ideally not happen if the model adheres to the schema,
        // but it's good practice to handle it. If the model fails to return
        // a valid output according to the schema, we assign an 'abstain' vote.
        return {
          agentName: agent.name,
          role: agent.role,
          votingPower: agent.votingPower,
          vote: 'abstain' as const, // Cast to const to match the enum type
          reasoning: `Agent ${agent.name} failed to provide reasoning for the proposal, resulting in an abstain vote.`,
        };
      }

      return {
        agentName: agent.name,
        role: agent.role,
        votingPower: agent.votingPower,
        vote: output.vote,
        reasoning: output.reasoning,
      };
    });

    const results = await Promise.all(agentReasoningsPromises);

    return {
      proposal: proposal,
      agentReasonings: results,
    };
  }
);

// Exported wrapper function
export async function architectsCouncilProposalReasoning(
  input: ArchitectsCouncilProposalReasoningInput
): Promise<ArchitectsCouncilProposalReasoningOutput> {
  return architectsCouncilProposalReasoningFlow(input);
}
