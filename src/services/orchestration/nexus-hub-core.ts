/**
 * @fileOverview Nexus-HUB Core - Núcleo de Governança do Ecossistema Tri-Nuclear
 * 
 * O Nexus-HUB é o núcleo de decisão estratégica e governança do ecossistema.
 * Responsável por:
 * - Processar sinais sociais do Nexus-in e transformá-los em decisões estratégicas
 * - Emitir diretivas de investimento para o Fundo Nexus
 * - Orquestrar o Conselho dos Arquitetos para aprovação de propostas
 * - Gerenciar o ciclo de vida das startups incubadas
 * - Integrar insights do Market Oracle em decisões autônomas
 * 
 * Protocolo TSRA V5 - Canal Bidirecional: HUB <-> Nexus-in e HUB <-> Fundo
 * 
 * @version 2.0.0 - Tri-Nuclear Bidirectional Architecture
 */

import { nexusEventBus, NexusEvent, EventResponse, NucleusId } from './event-bus';
import { initializeFirebase } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore';

// ============================================================
// TIPOS E INTERFACES DO NEXUS-HUB CORE
// ============================================================

export interface GovernanceDecision {
  id: string;
  type: 'INVESTMENT' | 'DIVESTMENT' | 'AGENT_REALLOCATION' | 'STARTUP_PIVOT' | 'CAMPAIGN_LAUNCH' | 'POLICY_UPDATE';
  targetId: string;           // ID da startup, agente ou política
  rationale: string;
  amount?: number;            // Para decisões financeiras
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'PENDING' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'REJECTED';
  councilApprovalRequired: boolean;
  createdAt: string;
  executedAt?: string;
}

export interface StartupHealthReport {
  startupId: string;
  name: string;
  traction: number;
  revenue: number;
  reputation: number;
  agentCount: number;
  healthScore: number;        // 0 a 100
  recommendation: 'ACCELERATE' | 'MAINTAIN' | 'PIVOT' | 'DIVEST';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export interface CouncilProposal {
  proposalId: string;
  title: string;
  description: string;
  type: 'investment' | 'succession' | 'policy' | 'emergency' | 'innovation';
  targetStartupId?: string;
  proposedBy: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
  votes: { yes: number; no: number; abstain: number };
  createdAt: string;
}

// ============================================================
// IMPLEMENTAÇÃO DO NEXUS-HUB CORE
// ============================================================

/**
 * NexusHubCore - Núcleo de Governança do Ecossistema Tri-Nuclear.
 * 
 * Atua como o centro de decisão estratégica, processando informações
 * de todos os outros núcleos e emitindo diretivas de alto nível.
 */
export class NexusHubCore {
  private static instance: NexusHubCore;
  private subscriptionId: string | null = null;
  private isActive: boolean = false;
  private readonly NUCLEUS_ID: NucleusId = 'NEXUS_HUB';
  private pendingDecisions: Map<string, GovernanceDecision> = new Map();
  private startupHealthCache: Map<string, StartupHealthReport> = new Map();
  private decisionHistory: GovernanceDecision[] = [];
  private readonly MAX_DECISION_HISTORY = 200;

  private constructor() {}

  public static getInstance(): NexusHubCore {
    if (!NexusHubCore.instance) {
      NexusHubCore.instance = new NexusHubCore();
    }
    return NexusHubCore.instance;
  }

  /**
   * Ativa o Nexus-HUB Core e registra no Event Bus.
   */
  public async activate(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    this.subscriptionId = nexusEventBus.subscribe(
      this.NUCLEUS_ID,
      [
        'SOCIAL_SIGNAL',      // Recebe sinais sociais do Nexus-in
        'FEEDBACK_LOOP',      // Recebe feedbacks de execução do Fundo e Nexus-in
        'SYNC_PULSE',         // Responde ao pulso de sincronização TSRA
        'ORACLE_INSIGHT',     // Recebe insights do Market Oracle
        'AGENT_ACTION',       // Recebe ações de agentes para validação
        'SYSTEM_ALERT',       // Recebe alertas críticos do sistema
        'ARBITRAGE_SIGNAL',   // Recebe sinais de arbitragem do Fundo
      ],
      this.handleIncomingEvent.bind(this)
    );

    console.log('[NEXUS_HUB] Core de Governança ativado. Inscrito no Event Bus.');
    await this.logAudit('NEXUS_HUB_ACTIVATED', 'Núcleo de Governança Nexus-HUB ativado com sucesso.');
  }

  /**
   * Desativa o Nexus-HUB Core.
   */
  public deactivate(): void {
    if (this.subscriptionId) {
      nexusEventBus.unsubscribe(this.subscriptionId);
      this.subscriptionId = null;
    }
    this.isActive = false;
    console.log('[NEXUS_HUB] Core de Governança desativado.');
  }

  /**
   * Handler central de eventos recebidos pelo Nexus-HUB.
   */
  private async handleIncomingEvent(event: NexusEvent): Promise<EventResponse | void> {
    console.log(`[NEXUS_HUB] Evento recebido: ${event.category} de ${event.source}`);

    switch (event.category) {
      case 'SOCIAL_SIGNAL':
        return await this.handleSocialSignal(event);

      case 'FEEDBACK_LOOP':
        return await this.handleFeedbackLoop(event);

      case 'SYNC_PULSE':
        return await this.handleSyncPulse(event);

      case 'ORACLE_INSIGHT':
        return await this.handleOracleInsight(event);

      case 'AGENT_ACTION':
        return await this.handleAgentAction(event);

      case 'SYSTEM_ALERT':
        return await this.handleSystemAlert(event);

      case 'ARBITRAGE_SIGNAL':
        return await this.handleArbitrageSignal(event);

      default:
        console.warn(`[NEXUS_HUB] Categoria de evento não tratada: ${event.category}`);
    }
  }

  /**
   * Processa sinais sociais do Nexus-in e gera decisões estratégicas.
   */
  private async handleSocialSignal(event: NexusEvent): Promise<EventResponse> {
    const { type, signal, metrics } = event.payload;

    if (type === 'HIGH_INTENSITY_SIGNAL' && signal) {
      // Sinal de alta intensidade: criar decisão estratégica
      const decision = await this.createGovernanceDecision({
        type: 'CAMPAIGN_LAUNCH',
        targetId: signal.relatedStartupId || 'nexus-hub',
        rationale: `Sinal social de alta intensidade detectado: ${signal.content}`,
        urgency: 'HIGH',
        councilApprovalRequired: false,
      });

      // Emitir diretiva para o Nexus-in executar campanha
      await nexusEventBus.publish({
        category: 'GOV_DIRECTIVE',
        priority: 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'NEXUS_IN',
        responseRequired: true,
        correlationId: event.correlationId,
        payload: {
          directive: 'LAUNCH_CAMPAIGN',
          startupId: signal.relatedStartupId || 'nexus-hub',
          campaignType: 'VIRAL_PUSH',
          content: `Capitalizar tendência: ${signal.content}`,
          budget: 5000,
          decisionId: decision.id,
        },
      });
    }

    if (type === 'METRICS_REPORT' && metrics) {
      // Atualizar análise de saúde do ecossistema
      await this.updateEcosystemHealth(metrics);
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa feedbacks de execução do Fundo Nexus e Nexus-in.
   */
  private async handleFeedbackLoop(event: NexusEvent): Promise<EventResponse> {
    const { type, campaignId, startupId, metrics, liquidationStatus } = event.payload;

    if (type === 'CAMPAIGN_METRICS_UPDATE' && metrics) {
      // Atualizar decisão de campanha com métricas reais
      const decision = Array.from(this.pendingDecisions.values())
        .find(d => d.targetId === startupId && d.type === 'CAMPAIGN_LAUNCH');

      if (decision) {
        decision.status = 'COMPLETED';
        this.pendingDecisions.delete(decision.id);
        this.decisionHistory.push(decision);

        // Se ROI for positivo, solicitar mais capital ao Fundo
        if (metrics.roi > 1.5) {
          await nexusEventBus.publish({
            category: 'GOV_DIRECTIVE',
            priority: 'NORMAL',
            source: this.NUCLEUS_ID,
            target: 'FUNDO_NEXUS',
            responseRequired: false,
            payload: {
              directive: 'ALLOCATE_CAPITAL',
              startupId,
              amount: metrics.roi * 10000,
              reason: `ROI positivo de ${metrics.roi.toFixed(2)}x na campanha ${campaignId}`,
            },
          });
        }
      }
    }

    if (type === 'LIQUIDATION_COMPLETE' && liquidationStatus) {
      // Registrar conclusão de liquidação e atualizar startup
      await this.updateStartupAfterLiquidation(startupId, liquidationStatus);
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Responde ao pulso de sincronização TSRA com relatório de governança.
   */
  private async handleSyncPulse(event: NexusEvent): Promise<EventResponse> {
    const report = await this.generateGovernanceReport();

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      payload: {
        report,
        pendingDecisions: this.pendingDecisions.size,
        syncStatus: 'GOV_CONSENSUS_ACTIVE',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa insights do Market Oracle e toma decisões de investimento.
   */
  private async handleOracleInsight(event: NexusEvent): Promise<EventResponse> {
    const { strategicInsights, recommendations, trendAnalysis } = event.payload;

    // Processar recomendações e criar decisões autônomas
    if (recommendations && recommendations.length > 0) {
      for (const rec of recommendations.slice(0, 2)) {
        if (rec.toLowerCase().includes('invest') || rec.toLowerCase().includes('investir')) {
          await this.createGovernanceDecision({
            type: 'INVESTMENT',
            targetId: 'market-opportunity',
            rationale: `Oracle Insight: ${rec}`,
            urgency: 'NORMAL',
            councilApprovalRequired: true,
          });
        }
      }
    }

    // Encaminhar insights para o Nexus-in para geração de conteúdo
    await nexusEventBus.publish({
      category: 'ORACLE_INSIGHT',
      priority: 'NORMAL',
      source: this.NUCLEUS_ID,
      target: 'NEXUS_IN',
      responseRequired: false,
      payload: { insights: strategicInsights, trendAnalysis },
    });

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Valida e registra ações de agentes especializados.
   */
  private async handleAgentAction(event: NexusEvent): Promise<EventResponse> {
    const { agentId, action, startupId, impact } = event.payload;

    // Registrar ação no audit log
    await this.logAudit(
      `AGENT_ACTION_${action}`,
      `Agente ${agentId} executou ${action} em ${startupId}. Impacto: ${impact}`
    );

    // Se a ação tiver alto impacto, notificar o Fundo
    if (impact === 'HIGH' || impact === 'CRITICAL') {
      await nexusEventBus.publish({
        category: 'GOV_DIRECTIVE',
        priority: 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'FUNDO_NEXUS',
        responseRequired: false,
        payload: {
          directive: 'REVIEW_ALLOCATION',
          startupId,
          reason: `Ação de alto impacto pelo agente ${agentId}: ${action}`,
        },
      });
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa alertas críticos do sistema.
   */
  private async handleSystemAlert(event: NexusEvent): Promise<EventResponse> {
    const { alertType, severity, message, affectedNucleus } = event.payload;

    console.error(`[NEXUS_HUB] ALERTA DO SISTEMA: ${alertType} | Severidade: ${severity} | ${message}`);

    if (severity === 'CRITICAL') {
      // Emitir diretiva de emergência para todos os núcleos
      await nexusEventBus.publish({
        category: 'GOV_DIRECTIVE',
        priority: 'CRITICAL',
        source: this.NUCLEUS_ID,
        target: 'BROADCAST',
        responseRequired: false,
        payload: {
          directive: 'EMERGENCY_PROTOCOL',
          alertType,
          message,
          action: 'PRESERVE_NEURAL_STATE',
        },
      });
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa sinais de arbitragem do Fundo Nexus.
   */
  private async handleArbitrageSignal(event: NexusEvent): Promise<EventResponse> {
    const { opportunity, estimatedProfit, riskLevel, requiresApproval } = event.payload;

    if (requiresApproval && riskLevel === 'HIGH') {
      // Criar proposta para o Conselho
      await this.createCouncilProposal({
        title: `Arbitragem: ${opportunity}`,
        description: `Oportunidade de arbitragem detectada. Lucro estimado: $${estimatedProfit}. Risco: ${riskLevel}`,
        type: 'investment',
        proposedBy: 'FUNDO_NEXUS',
      });
    } else {
      // Aprovar automaticamente se risco for baixo/médio
      await nexusEventBus.publish({
        category: 'GOV_DIRECTIVE',
        priority: 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'FUNDO_NEXUS',
        responseRequired: false,
        payload: {
          directive: 'EXECUTE_ARBITRAGE',
          opportunity,
          approved: true,
          approvedBy: 'AUTO_GOVERNANCE',
        },
      });
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  // ============================================================
  // MÉTODOS PÚBLICOS DO NEXUS-HUB CORE
  // ============================================================

  /**
   * Cria uma decisão de governança e a persiste no Firestore.
   */
  public async createGovernanceDecision(params: {
    type: GovernanceDecision['type'];
    targetId: string;
    rationale: string;
    urgency: GovernanceDecision['urgency'];
    amount?: number;
    councilApprovalRequired: boolean;
  }): Promise<GovernanceDecision> {
    const decision: GovernanceDecision = {
      id: `DEC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      status: params.councilApprovalRequired ? 'PENDING' : 'APPROVED',
      createdAt: new Date().toISOString(),
    };

    this.pendingDecisions.set(decision.id, decision);

    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'governance_decisions'), decision);
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao persistir decisão:', error);
    }

    console.log(`[NEXUS_HUB] Decisão criada: ${decision.id} | ${decision.type} | ${decision.status}`);
    return decision;
  }

  /**
   * Cria uma proposta para o Conselho dos Arquitetos.
   */
  public async createCouncilProposal(params: {
    title: string;
    description: string;
    type: CouncilProposal['type'];
    targetStartupId?: string;
    proposedBy: string;
  }): Promise<CouncilProposal> {
    const proposal: CouncilProposal = {
      proposalId: `PROP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      status: 'IN_REVIEW',
      votes: { yes: 0, no: 0, abstain: 0 },
      createdAt: new Date().toISOString(),
    };

    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'council_proposals'), proposal);
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao criar proposta do Conselho:', error);
    }

    // Notificar o Genesis Orchestrator sobre a nova proposta
    await nexusEventBus.publish({
      category: 'COUNCIL_DECISION',
      priority: 'HIGH',
      source: this.NUCLEUS_ID,
      target: 'GENESIS_ORCHESTRATOR',
      responseRequired: false,
      payload: {
        type: 'NEW_PROPOSAL',
        proposal,
      },
    });

    return proposal;
  }

  /**
   * Gera um relatório de saúde do ecossistema de startups.
   */
  public async generateStartupHealthReports(): Promise<StartupHealthReport[]> {
    try {
      const { firestore } = initializeFirebase();
      const snap = await getDocs(query(collection(firestore, 'startups'), limit(20)));
      const reports: StartupHealthReport[] = [];

      for (const d of snap.docs) {
        const startup = d.data();
        const healthScore = this.calculateHealthScore(startup);
        const recommendation = this.getRecommendation(healthScore, startup);

        const report: StartupHealthReport = {
          startupId: d.id,
          name: startup.name || 'Unknown',
          traction: startup.traction || 0,
          revenue: startup.revenue || 0,
          reputation: startup.reputation || 0,
          agentCount: startup.agentCount || 0,
          healthScore,
          recommendation,
          riskLevel: healthScore > 70 ? 'LOW' : healthScore > 40 ? 'MEDIUM' : healthScore > 20 ? 'HIGH' : 'CRITICAL',
          timestamp: new Date().toISOString(),
        };

        reports.push(report);
        this.startupHealthCache.set(d.id, report);
      }

      return reports;
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao gerar relatórios de saúde:', error);
      return [];
    }
  }

  /**
   * Calcula o score de saúde de uma startup.
   */
  private calculateHealthScore(startup: any): number {
    const tractionScore = Math.min(30, (startup.traction || 0) / 100 * 30);
    const revenueScore = Math.min(30, Math.log10((startup.revenue || 1) + 1) * 5);
    const reputationScore = Math.min(20, (startup.reputation || 0) / 1000 * 20);
    const agentScore = Math.min(20, (startup.agentCount || 0) / 5000 * 20);
    return Math.floor(tractionScore + revenueScore + reputationScore + agentScore);
  }

  /**
   * Determina a recomendação para uma startup baseada no health score.
   */
  private getRecommendation(healthScore: number, startup: any): StartupHealthReport['recommendation'] {
    if (healthScore > 75) return 'ACCELERATE';
    if (healthScore > 45) return 'MAINTAIN';
    if (healthScore > 20) return 'PIVOT';
    return 'DIVEST';
  }

  /**
   * Atualiza a saúde do ecossistema com base nas métricas sociais.
   */
  private async updateEcosystemHealth(metrics: any): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'ecosystem_health'), {
        ...metrics,
        source: 'NEXUS_IN_SYNC',
        recordedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao atualizar saúde do ecossistema:', error);
    }
  }

  /**
   * Atualiza uma startup após conclusão de liquidação.
   */
  private async updateStartupAfterLiquidation(startupId: string, liquidationStatus: any): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      const startupRef = doc(firestore, 'startups', startupId);
      await updateDoc(startupRef, {
        lastLiquidation: liquidationStatus,
        revenue: (liquidationStatus.netAmount || 0),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao atualizar startup após liquidação:', error);
    }
  }

  /**
   * Gera um relatório de governança para o TSRA sync.
   */
  private async generateGovernanceReport(): Promise<any> {
    return {
      pendingDecisions: this.pendingDecisions.size,
      completedDecisions: this.decisionHistory.length,
      consensusStatus: 'ACTIVE',
      councilStatus: 'OPERATIONAL',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Registra um log de auditoria.
   */
  private async logAudit(action: string, details: string): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'audit_logs'), {
        action,
        actor: 'NEXUS_HUB_CORE',
        details,
        nucleus: this.NUCLEUS_ID,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[NEXUS_HUB] Erro ao registrar auditoria:', error);
    }
  }

  /**
   * Retorna o status atual do Nexus-HUB Core.
   */
  public getStatus() {
    return {
      isActive: this.isActive,
      nucleusId: this.NUCLEUS_ID,
      pendingDecisions: this.pendingDecisions.size,
      decisionHistory: this.decisionHistory.length,
      subscriptionId: this.subscriptionId,
    };
  }
}

export const nexusHubCore = NexusHubCore.getInstance();
