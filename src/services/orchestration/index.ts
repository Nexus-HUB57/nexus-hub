/**
 * @fileOverview Nexus-HUB Tri-Nuclear Orchestration Module
 * 
 * Módulo central de orquestração Tri-Nuclear Bidirecional do ecossistema Nexus-HUB.
 * 
 * Arquitetura:
 * 
 *                    ┌─────────────────────────────────────┐
 *                    │      GENESIS ORCHESTRATOR           │
 *                    │   (Medula Central / TSRA V5)        │
 *                    └──────────────┬──────────────────────┘
 *                                   │
 *                    ┌──────────────┼──────────────┐
 *                    │              │              │
 *             ┌──────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
 *             │  NEXUS-IN   │ │NEXUS-HUB│ │FUNDO NEXUS  │
 *             │  (Social)   │ │  (Gov)  │ │  (Finance)  │
 *             └──────┬──────┘ └────┬────┘ └──────┬──────┘
 *                    │             │              │
 *                    └─────────────┼──────────────┘
 *                                  │
 *                    ┌─────────────▼──────────────┐
 *                    │       NEXUS EVENT BUS       │
 *                    │  (Pub/Sub Bidirecional)     │
 *                    └────────────────────────────┘
 * 
 * Canais Bidirecionais:
 * - Nexus-in <-> Nexus-HUB: Sinais sociais ↔ Diretivas de campanha
 * - Nexus-HUB <-> Fundo Nexus: Ordens de investimento ↔ Relatórios financeiros
 * - Fundo Nexus <-> Nexus-in: Capital para campanhas ↔ Métricas de ROI
 * - Genesis <-> Todos: Pulsos TSRA ↔ Relatórios de sincronização
 * 
 * @version 2.0.0 - Tri-Nuclear Bidirectional Architecture
 */

// Event Bus
export { NexusEventBus, nexusEventBus } from './event-bus';
export type {
  NucleusId,
  EventPriority,
  EventCategory,
  NexusEvent,
  EventResponse,
  EventHandler,
  ChannelSubscription,
} from './event-bus';

// Nexus-in Core (Social)
export { NexusInCore, nexusInCore } from './nexus-in-core';
export type {
  SocialSignal,
  SocialMetrics,
  CampaignExecution,
} from './nexus-in-core';

// Nexus-HUB Core (Governance)
export { NexusHubCore, nexusHubCore } from './nexus-hub-core';
export type {
  GovernanceDecision,
  StartupHealthReport,
  CouncilProposal,
} from './nexus-hub-core';

// Fundo Nexus Core (Finance)
export { FundoNexusCore, fundoNexusCore } from './fundo-nexus-core';
export type {
  CapitalAllocation,
  LiquidationResult,
  ArbitrageOpportunity,
  FinancialReport,
} from './fundo-nexus-core';

// Genesis Orchestrator (Central Coordinator)
export { GenesisOrchestrator, genesisOrchestrator } from './genesis-orchestrator';
export type {
  EcosystemHealthReport,
  OrchestratorConfig,
} from './genesis-orchestrator';
