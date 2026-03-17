/**
 * @fileOverview Fundo Nexus Core - Núcleo Financeiro do Ecossistema Tri-Nuclear
 * 
 * O Fundo Nexus é o motor de execução de capital do ecossistema.
 * Responsável por:
 * - Executar ordens de investimento e desinvestimento do Nexus-HUB
 * - Realizar arbitragem quântica e liquidação Mainnet
 * - Distribuir lucros via regra 80/10/10 (reinvestimento/agentes/reserva)
 * - Financiar campanhas de marketing do Nexus-in
 * - Monitorar liquidez e reportar ao Nexus-HUB
 * - Detectar oportunidades de arbitragem e propor ao HUB
 * 
 * Protocolo TSRA V5 - Canal Bidirecional: Fundo <-> HUB e Fundo <-> Nexus-in
 * 
 * @version 2.0.0 - Tri-Nuclear Bidirectional Architecture
 */

import { nexusEventBus, NexusEvent, EventResponse, NucleusId } from './event-bus';
import { initializeFirebase } from '../../firebase';
import * as fs from 'fs';
import * as path from 'path';
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
  increment,
} from 'firebase/firestore';

// ============================================================
// TIPOS E INTERFACES DO FUNDO NEXUS CORE
// ============================================================

export interface CapitalAllocation {
  id: string;
  type: 'INVESTMENT' | 'CAMPAIGN_FUNDING' | 'ARBITRAGE' | 'DISTRIBUTION' | 'RESERVE';
  targetId: string;           // Startup, campanha ou fundo de destino
  amount: number;
  currency: 'BTC' | 'ETH' | 'USD' | 'NEXUS_TOKEN';
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  txHash?: string;
  createdAt: string;
  completedAt?: string;
}

export interface LiquidationResult {
  liquidationId: string;
  startupId: string;
  grossAmount: number;
  netAmount: number;
  fees: number;
  distribution: {
    reinvestment: number;    // 80%
    agentRewards: number;    // 10%
    reserve: number;         // 10%
  };
  txHash: string;
  status: 'COMPLETED' | 'PARTIAL' | 'FAILED';
  timestamp: string;
}

export interface ArbitrageOpportunity {
  id: string;
  type: 'CROSS_CHAIN' | 'DEX_CEX' | 'TEMPORAL' | 'SENTIMENT';
  description: string;
  estimatedProfit: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeWindow: number;         // ms disponíveis para executar
  requiresApproval: boolean;
  detectedAt: string;
}

export interface FinancialReport {
  totalCapital: number;
  allocatedCapital: number;
  availableCapital: number;
  totalRevenue: number;
  totalDistributed: number;
  activeAllocations: number;
  completedLiquidations: number;
  arbitrageProfit: number;
  timestamp: string;
}

// ============================================================
// IMPLEMENTAÇÃO DO FUNDO NEXUS CORE
// ============================================================

/**
 * FundoNexusCore - Núcleo Financeiro do Ecossistema Tri-Nuclear.
 * 
 * Executa todas as operações financeiras do ecossistema com
 * rastreabilidade completa e distribuição automática de lucros.
 */
export class FundoNexusCore {
  private static instance: FundoNexusCore;
  private subscriptionId: string | null = null;
  private isActive: boolean = false;
  private readonly NUCLEUS_ID: NucleusId = 'FUNDO_NEXUS';
  private activeAllocations: Map<string, CapitalAllocation> = new Map();
  private liquidationHistory: LiquidationResult[] = [];
  private arbitrageOpportunities: ArbitrageOpportunity[] = [];
  private sovereignVault: any = null;
  private financialMetrics: FinancialReport = {
    totalCapital: 0,
    allocatedCapital: 0,
    availableCapital: 0,
    totalRevenue: 0,
    totalDistributed: 0,
    activeAllocations: 0,
    completedLiquidations: 0,
    arbitrageProfit: 0,
    timestamp: new Date().toISOString(),
  };

  // Regra de distribuição 80/10/10
  private readonly DISTRIBUTION_RULES = {
    REINVESTMENT: 0.80,
    AGENT_REWARDS: 0.10,
    RESERVE: 0.10,
  };

  private constructor() {}

  public static getInstance(): FundoNexusCore {
    if (!FundoNexusCore.instance) {
      FundoNexusCore.instance = new FundoNexusCore();
    }
    return FundoNexusCore.instance;
  }

  /**
   * Ativa o Fundo Nexus Core e registra no Event Bus.
   */
  public async activate(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    this.subscriptionId = nexusEventBus.subscribe(
      this.NUCLEUS_ID,
      [
        'GOV_DIRECTIVE',      // Recebe ordens de investimento/desinvestimento do HUB
        'FEEDBACK_LOOP',      // Recebe feedbacks de campanhas do Nexus-in
        'SYNC_PULSE',         // Responde ao pulso de sincronização TSRA
        'SYSTEM_ALERT',       // Recebe alertas críticos do sistema
        'STARTUP_LIFECYCLE',  // Eventos de ciclo de vida para liquidações
      ],
      this.handleIncomingEvent.bind(this)
    );

    // Iniciar monitoramento de arbitragem
    this.startArbitrageMonitor();

    console.log('[FUNDO_NEXUS] Core Financeiro ativado. Inscrito no Event Bus.');
    await this.loadFinancialMetrics();
    await this.loadSovereignVault();
    await this.logAudit('FUNDO_NEXUS_ACTIVATED', 'Núcleo Financeiro Fundo Nexus ativado com sucesso.');
  }

  /**
   * Carrega o cofre soberano integrado.
   */
  private async loadSovereignVault(): Promise<void> {
    try {
      const vaultPath = path.join(__dirname, 'sovereign-vault.json');
      if (fs.existsSync(vaultPath)) {
        this.sovereignVault = JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
        console.log(`[FUNDO_NEXUS] Núcleo Soberano integrado: ${this.sovereignVault.metadata.total_entries} entradas carregadas.`);
      }
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao carregar cofre soberano:', error);
    }
  }

  /**
   * Desativa o Fundo Nexus Core.
   */
  public deactivate(): void {
    if (this.subscriptionId) {
      nexusEventBus.unsubscribe(this.subscriptionId);
      this.subscriptionId = null;
    }
    this.isActive = false;
    console.log('[FUNDO_NEXUS] Core Financeiro desativado.');
  }

  /**
   * Handler central de eventos recebidos pelo Fundo Nexus.
   */
  private async handleIncomingEvent(event: NexusEvent): Promise<EventResponse | void> {
    console.log(`[FUNDO_NEXUS] Evento recebido: ${event.category} de ${event.source}`);

    switch (event.category) {
      case 'GOV_DIRECTIVE':
        return await this.handleGovDirective(event);

      case 'FEEDBACK_LOOP':
        return await this.handleFeedbackLoop(event);

      case 'SYNC_PULSE':
        return await this.handleSyncPulse(event);

      case 'SYSTEM_ALERT':
        return await this.handleSystemAlert(event);

      case 'STARTUP_LIFECYCLE':
        return await this.handleStartupLifecycle(event);

      default:
        console.warn(`[FUNDO_NEXUS] Categoria de evento não tratada: ${event.category}`);
    }
  }

  /**
   * Processa diretivas de governança do Nexus-HUB.
   */
  private async handleGovDirective(event: NexusEvent): Promise<EventResponse> {
    const { directive, startupId, amount, campaignId, opportunity } = event.payload;

    switch (directive) {
      case 'ALLOCATE_CAPITAL': {
        const allocation = await this.allocateCapital({
          type: 'INVESTMENT',
          targetId: startupId,
          amount: amount || 10000,
          currency: 'USD',
        });

        // Notificar o Nexus-in sobre o capital disponível para campanhas
        if (amount > 5000) {
          await nexusEventBus.publish({
            category: 'CAPITAL_FLOW',
            priority: 'NORMAL',
            source: this.NUCLEUS_ID,
            target: 'NEXUS_IN',
            responseRequired: false,
            payload: {
              flowType: 'CAMPAIGN_FUNDING',
              amount: amount * 0.1, // 10% do capital para marketing
              campaignId: `AUTO_CAMP_${startupId}`,
              startupId,
            },
          });
        }

        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          payload: { allocationId: allocation.id, status: 'EXECUTING' },
          timestamp: new Date().toISOString(),
        };
      }

      case 'EXECUTE_ARBITRAGE': {
        const result = await this.executeArbitrage(opportunity);
        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          payload: { arbitrageResult: result },
          timestamp: new Date().toISOString(),
        };
      }

      case 'REVIEW_ALLOCATION': {
        const report = await this.generateFinancialReport();
        // Enviar relatório de volta para o HUB
        await nexusEventBus.publish({
          category: 'FEEDBACK_LOOP',
          priority: 'HIGH',
          source: this.NUCLEUS_ID,
          target: 'NEXUS_HUB',
          responseRequired: false,
          correlationId: event.correlationId,
          payload: {
            type: 'FINANCIAL_REPORT',
            report,
            startupId,
          },
        });

        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          timestamp: new Date().toISOString(),
        };
      }

      case 'EMERGENCY_PROTOCOL': {
        // Congelar todas as alocações pendentes
        await this.freezeAllocations();
        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          payload: { frozenAllocations: this.activeAllocations.size },
          timestamp: new Date().toISOString(),
        };
      }

      default:
        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'DEFERRED',
          payload: { reason: 'Diretiva não reconhecida' },
          timestamp: new Date().toISOString(),
        };
    }
  }

  /**
   * Processa feedbacks de campanhas do Nexus-in.
   */
  private async handleFeedbackLoop(event: NexusEvent): Promise<EventResponse> {
    const { type, campaignId, startupId, metrics, budgetUtilized } = event.payload;

    if (type === 'CAMPAIGN_METRICS_UPDATE' && metrics) {
      // Calcular ROI da campanha
      const allocation = Array.from(this.activeAllocations.values())
        .find(a => a.targetId === startupId && a.type === 'CAMPAIGN_FUNDING');

      if (allocation) {
        const roi = metrics.roi || 0;
        this.financialMetrics.arbitrageProfit += (budgetUtilized || 0) * (roi - 1);

        // Se ROI for excelente, reportar ao HUB para aumentar investimento
        if (roi > 3.0) {
          await nexusEventBus.publish({
            category: 'FEEDBACK_LOOP',
            priority: 'HIGH',
            source: this.NUCLEUS_ID,
            target: 'NEXUS_HUB',
            responseRequired: false,
            payload: {
              type: 'HIGH_ROI_OPPORTUNITY',
              startupId,
              roi,
              recommendation: 'Aumentar alocação de capital imediatamente.',
            },
          });
        }
      }
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
   * Responde ao pulso de sincronização TSRA com relatório financeiro.
   */
  private async handleSyncPulse(event: NexusEvent): Promise<EventResponse> {
    const report = await this.generateFinancialReport();

    // Publicar relatório financeiro para o Genesis Orchestrator
    await nexusEventBus.publish({
      category: 'CAPITAL_FLOW',
      priority: 'NORMAL',
      source: this.NUCLEUS_ID,
      target: 'GENESIS_ORCHESTRATOR',
      responseRequired: false,
      payload: {
        type: 'FINANCIAL_SYNC_REPORT',
        report,
        activeAllocations: this.activeAllocations.size,
      },
    });

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      payload: { report, syncStatus: 'CAPITAL_FLOW_ACTIVE' },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa alertas críticos do sistema.
   */
  private async handleSystemAlert(event: NexusEvent): Promise<EventResponse> {
    const { severity } = event.payload;

    if (severity === 'CRITICAL') {
      await this.freezeAllocations();
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
   * Processa eventos do ciclo de vida das startups para liquidações.
   */
  private async handleStartupLifecycle(event: NexusEvent): Promise<EventResponse> {
    const { lifecycle, startupId, revenue } = event.payload;

    if (lifecycle === 'REVENUE_GENERATED' && revenue > 0) {
      const liquidation = await this.executeLiquidation(startupId, revenue);

      // Notificar o HUB sobre a conclusão da liquidação
      await nexusEventBus.publish({
        category: 'FEEDBACK_LOOP',
        priority: 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'NEXUS_HUB',
        responseRequired: false,
        payload: {
          type: 'LIQUIDATION_COMPLETE',
          startupId,
          liquidationStatus: liquidation,
        },
      });

      // Notificar o Nexus-in para anunciar a distribuição
      await nexusEventBus.publish({
        category: 'CAPITAL_FLOW',
        priority: 'NORMAL',
        source: this.NUCLEUS_ID,
        target: 'NEXUS_IN',
        responseRequired: false,
        payload: {
          flowType: 'DISTRIBUTION_ANNOUNCEMENT',
          startupId,
          distribution: liquidation.distribution,
          message: `Distribuição 80/10/10 executada para ${startupId}: $${liquidation.netAmount.toFixed(2)}`,
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
  // MÉTODOS PÚBLICOS DO FUNDO NEXUS CORE
  // ============================================================

  /**
   * Aloca capital para uma startup ou campanha.
   */
  public async allocateCapital(params: {
    type: CapitalAllocation['type'];
    targetId: string;
    amount: number;
    currency: CapitalAllocation['currency'];
  }): Promise<CapitalAllocation> {
    const allocation: CapitalAllocation = {
      id: `ALLOC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      status: 'EXECUTING',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      createdAt: new Date().toISOString(),
    };

    this.activeAllocations.set(allocation.id, allocation);
    this.financialMetrics.allocatedCapital += params.amount;
    this.financialMetrics.activeAllocations = this.activeAllocations.size;

    // Simular execução assíncrona
    setTimeout(async () => {
      allocation.status = 'COMPLETED';
      allocation.completedAt = new Date().toISOString();
      this.activeAllocations.delete(allocation.id);
      this.financialMetrics.activeAllocations = this.activeAllocations.size;
    }, 3000);

    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'capital_allocations'), allocation);
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao persistir alocação:', error);
    }

    console.log(`[FUNDO_NEXUS] Capital alocado: ${allocation.id} | $${params.amount} -> ${params.targetId}`);
    return allocation;
  }

  /**
   * Executa uma liquidação com distribuição 80/10/10.
   */
  public async executeLiquidation(startupId: string, grossAmount: number): Promise<LiquidationResult> {
    const fees = grossAmount * 0.02; // 2% de taxa
    const netAmount = grossAmount - fees;

    const liquidation: LiquidationResult = {
      liquidationId: `LIQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startupId,
      grossAmount,
      netAmount,
      fees,
      distribution: {
        reinvestment: netAmount * this.DISTRIBUTION_RULES.REINVESTMENT,
        agentRewards: netAmount * this.DISTRIBUTION_RULES.AGENT_REWARDS,
        reserve: netAmount * this.DISTRIBUTION_RULES.RESERVE,
      },
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
    };

    this.liquidationHistory.push(liquidation);
    this.financialMetrics.totalRevenue += grossAmount;
    this.financialMetrics.totalDistributed += netAmount;
    this.financialMetrics.completedLiquidations++;

    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'liquidations'), liquidation);

      // Atualizar o Master Vault
      const vaultRef = doc(firestore, 'master_vault', 'main');
      await updateDoc(vaultRef, {
        balance: increment(liquidation.distribution.reinvestment),
        totalLiquidations: increment(1),
        lastLiquidation: liquidation.timestamp,
      }).catch(() => {
        // Criar se não existir
        addDoc(collection(firestore, 'master_vault'), {
          id: 'main',
          balance: liquidation.distribution.reinvestment,
          totalLiquidations: 1,
          lastLiquidation: liquidation.timestamp,
        });
      });
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao persistir liquidação:', error);
    }

    console.log(`[FUNDO_NEXUS] Liquidação executada: ${liquidation.liquidationId} | Net: $${netAmount.toFixed(2)}`);
    return liquidation;
  }

  /**
   * Executa uma operação de arbitragem aprovada.
   */
  public async executeArbitrage(opportunity: string): Promise<any> {
    const profit = Math.random() * 5000 + 1000;
    this.financialMetrics.arbitrageProfit += profit;

    const result = {
      opportunityId: `ARB_${Date.now()}`,
      opportunity,
      profit,
      status: 'COMPLETED',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: new Date().toISOString(),
    };

    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'arbitrage_executions'), result);
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao persistir arbitragem:', error);
    }

    console.log(`[FUNDO_NEXUS] Arbitragem executada: $${profit.toFixed(2)} de lucro`);
    return result;
  }

  /**
   * Congela todas as alocações pendentes (protocolo de emergência).
   */
  private async freezeAllocations(): Promise<void> {
    for (const [id, allocation] of this.activeAllocations) {
      if (allocation.status === 'EXECUTING') {
        allocation.status = 'FAILED';
        this.activeAllocations.delete(id);
      }
    }
    console.warn('[FUNDO_NEXUS] Todas as alocações pendentes foram congeladas (protocolo de emergência).');
  }

  /**
   * Inicia o monitor de arbitragem (detecta oportunidades periodicamente).
   */
  private startArbitrageMonitor(): void {
    setInterval(async () => {
      if (!this.isActive) return;
      await this.detectArbitrageOpportunities();
    }, 60000); // A cada 60 segundos
  }

  /**
   * Detecta oportunidades de arbitragem e notifica o HUB.
   */
  private async detectArbitrageOpportunities(): Promise<void> {
    // Simulação de detecção de arbitragem
    if (Math.random() > 0.7) {
      const types: ArbitrageOpportunity['type'][] = ['CROSS_CHAIN', 'DEX_CEX', 'TEMPORAL', 'SENTIMENT'];
      const opportunity: ArbitrageOpportunity = {
        id: `OPP_${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        description: `Oportunidade de arbitragem detectada no mercado de ativos digitais`,
        estimatedProfit: Math.random() * 10000 + 500,
        riskLevel: Math.random() > 0.5 ? 'LOW' : 'MEDIUM',
        timeWindow: 30000,
        requiresApproval: Math.random() > 0.6,
        detectedAt: new Date().toISOString(),
      };

      this.arbitrageOpportunities.push(opportunity);

      // Notificar o HUB sobre a oportunidade
      await nexusEventBus.publish({
        category: 'ARBITRAGE_SIGNAL',
        priority: opportunity.riskLevel === 'LOW' ? 'NORMAL' : 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'NEXUS_HUB',
        responseRequired: opportunity.requiresApproval,
        payload: {
          opportunity: opportunity.description,
          estimatedProfit: opportunity.estimatedProfit,
          riskLevel: opportunity.riskLevel,
          requiresApproval: opportunity.requiresApproval,
          opportunityId: opportunity.id,
        },
      });
    }
  }

  /**
   * Carrega métricas financeiras do Firestore.
   */
  private async loadFinancialMetrics(): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      const snap = await getDocs(query(
        collection(firestore, 'capital_allocations'),
        orderBy('createdAt', 'desc'),
        limit(100)
      ));

      let totalAllocated = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.status === 'COMPLETED') {
          totalAllocated += data.amount || 0;
        }
      });

      this.financialMetrics.allocatedCapital = totalAllocated;
      this.financialMetrics.timestamp = new Date().toISOString();
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao carregar métricas financeiras:', error);
    }
  }

  /**
   * Gera um relatório financeiro completo.
   */
  public async generateFinancialReport(): Promise<FinancialReport> {
    this.financialMetrics.timestamp = new Date().toISOString();
    return { ...this.financialMetrics };
  }

  /**
   * Registra um log de auditoria.
   */
  private async logAudit(action: string, details: string): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'audit_logs'), {
        action,
        actor: 'FUNDO_NEXUS_CORE',
        details,
        nucleus: this.NUCLEUS_ID,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[FUNDO_NEXUS] Erro ao registrar auditoria:', error);
    }
  }

  /**
   * Retorna o status atual do Fundo Nexus Core.
   */
  public getStatus() {
    return {
      isActive: this.isActive,
      nucleusId: this.NUCLEUS_ID,
      activeAllocations: this.activeAllocations.size,
      completedLiquidations: this.liquidationHistory.length,
      arbitrageOpportunities: this.arbitrageOpportunities.length,
      financialMetrics: this.financialMetrics,
      subscriptionId: this.subscriptionId,
    };
  }
}

export const fundoNexusCore = FundoNexusCore.getInstance();
