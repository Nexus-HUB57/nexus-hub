/**
 * @fileOverview Nexus-in Core - Núcleo Social do Ecossistema Tri-Nuclear
 * 
 * O Nexus-in é a interface de manifestação social do ecossistema Nexus-HUB.
 * Responsável por:
 * - Capturar e processar sinais sociais (tração viral, engajamento, tendências)
 * - Publicar conteúdo cultural e campanhas geradas pelos agentes
 * - Retornar métricas de performance social para o Nexus-HUB e Fundo Nexus
 * - Executar campanhas de lançamento de produtos e startups
 * 
 * Protocolo TSRA V5 - Canal Bidirecional: Nexus-in <-> HUB e Nexus-in <-> Fundo
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
  getCountFromServer,
} from 'firebase/firestore';

// ============================================================
// TIPOS E INTERFACES DO NEXUS-IN CORE
// ============================================================

export interface SocialSignal {
  type: 'VIRAL_TREND' | 'ENGAGEMENT_SPIKE' | 'SENTIMENT_SHIFT' | 'PRODUCT_DEMAND' | 'COMMUNITY_GROWTH';
  intensity: number;         // 0.0 a 1.0
  source: string;            // Plataforma ou comunidade de origem
  content: string;           // Descrição do sinal
  relatedStartupId?: string; // Startup relacionada, se houver
  timestamp: string;
}

export interface SocialMetrics {
  totalPosts: number;
  totalEngagement: number;
  viralScore: number;         // 0 a 100
  communityHealth: number;    // 0 a 100
  trendingTopics: string[];
  activeStartups: string[];
  culturalWorksPublished: number;
  timestamp: string;
}

export interface CampaignExecution {
  campaignId: string;
  startupId: string;
  type: 'PRODUCT_LAUNCH' | 'BRAND_AWARENESS' | 'COMMUNITY_GROWTH' | 'VIRAL_PUSH';
  budget: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
  createdAt: string;
}

// ============================================================
// IMPLEMENTAÇÃO DO NEXUS-IN CORE
// ============================================================

/**
 * NexusInCore - Núcleo Social do Ecossistema Tri-Nuclear.
 * 
 * Gerencia todos os fluxos de comunicação social, cultural e viral
 * do ecossistema, operando como interface entre o mundo externo
 * e o núcleo de governança (Nexus-HUB).
 */
export class NexusInCore {
  private static instance: NexusInCore;
  private subscriptionId: string | null = null;
  private isActive: boolean = false;
  private readonly NUCLEUS_ID: NucleusId = 'NEXUS_IN';
  private activeCampaigns: Map<string, CampaignExecution> = new Map();
  private socialMetricsCache: SocialMetrics | null = null;
  private metricsLastUpdated: number = 0;
  private readonly METRICS_CACHE_TTL = 30000; // 30 segundos

  private constructor() {}

  public static getInstance(): NexusInCore {
    if (!NexusInCore.instance) {
      NexusInCore.instance = new NexusInCore();
    }
    return NexusInCore.instance;
  }

  /**
   * Ativa o Nexus-in Core e registra no Event Bus.
   */
  public async activate(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    // Inscrever-se nos eventos relevantes
    this.subscriptionId = nexusEventBus.subscribe(
      this.NUCLEUS_ID,
      [
        'GOV_DIRECTIVE',      // Recebe diretrizes do HUB (campanhas, lançamentos)
        'CAPITAL_FLOW',       // Recebe liberações de capital do Fundo para campanhas
        'SYNC_PULSE',         // Responde ao pulso de sincronização TSRA
        'ORACLE_INSIGHT',     // Recebe insights do Market Oracle para conteúdo
        'COUNCIL_DECISION',   // Recebe decisões do Conselho para execução social
        'STARTUP_LIFECYCLE',  // Eventos de ciclo de vida para anúncios
      ],
      this.handleIncomingEvent.bind(this)
    );

    console.log('[NEXUS_IN] Core Social ativado. Inscrito no Event Bus.');
    await this.logAudit('NEXUS_IN_ACTIVATED', 'Núcleo Social Nexus-in ativado com sucesso.');
  }

  /**
   * Desativa o Nexus-in Core.
   */
  public deactivate(): void {
    if (this.subscriptionId) {
      nexusEventBus.unsubscribe(this.subscriptionId);
      this.subscriptionId = null;
    }
    this.isActive = false;
    console.log('[NEXUS_IN] Core Social desativado.');
  }

  /**
   * Handler central de eventos recebidos pelo Nexus-in.
   */
  private async handleIncomingEvent(event: NexusEvent): Promise<EventResponse | void> {
    console.log(`[NEXUS_IN] Evento recebido: ${event.category} de ${event.source}`);

    switch (event.category) {
      case 'GOV_DIRECTIVE':
        return await this.handleGovDirective(event);

      case 'CAPITAL_FLOW':
        return await this.handleCapitalFlow(event);

      case 'SYNC_PULSE':
        return await this.handleSyncPulse(event);

      case 'ORACLE_INSIGHT':
        return await this.handleOracleInsight(event);

      case 'COUNCIL_DECISION':
        return await this.handleCouncilDecision(event);

      case 'STARTUP_LIFECYCLE':
        return await this.handleStartupLifecycle(event);

      default:
        console.warn(`[NEXUS_IN] Categoria de evento não tratada: ${event.category}`);
    }
  }

  /**
   * Processa diretivas de governança do Nexus-HUB.
   * Ex: Lançar campanha de produto, criar post viral, anunciar nova startup.
   */
  private async handleGovDirective(event: NexusEvent): Promise<EventResponse> {
    const { directive, startupId, content, campaignType } = event.payload;

    try {
      if (directive === 'LAUNCH_CAMPAIGN') {
        const campaign = await this.executeCampaign({
          startupId,
          type: campaignType || 'BRAND_AWARENESS',
          content,
          budget: event.payload.budget || 0,
        });

        // Publicar sinal de feedback para o HUB (bidirecional)
        await nexusEventBus.publish({
          category: 'FEEDBACK_LOOP',
          priority: 'HIGH',
          source: this.NUCLEUS_ID,
          target: 'NEXUS_HUB',
          responseRequired: false,
          correlationId: event.correlationId,
          payload: {
            type: 'CAMPAIGN_LAUNCHED',
            campaignId: campaign.campaignId,
            startupId,
            estimatedReach: campaign.metrics.reach,
            status: 'ACTIVE',
          },
        });

        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          payload: { campaignId: campaign.campaignId, status: 'LAUNCHED' },
          timestamp: new Date().toISOString(),
        };
      }

      if (directive === 'PUBLISH_ANNOUNCEMENT') {
        await this.publishSocialAnnouncement(startupId, content);
        return {
          eventId: event.id,
          correlationId: event.correlationId || '',
          respondingNucleus: this.NUCLEUS_ID,
          status: 'PROCESSED',
          payload: { published: true },
          timestamp: new Date().toISOString(),
        };
      }

      return {
        eventId: event.id,
        correlationId: event.correlationId || '',
        respondingNucleus: this.NUCLEUS_ID,
        status: 'DEFERRED',
        payload: { reason: 'Diretiva não reconhecida' },
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        eventId: event.id,
        correlationId: event.correlationId || '',
        respondingNucleus: this.NUCLEUS_ID,
        status: 'REJECTED',
        payload: { error: error.message },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Processa liberações de capital do Fundo Nexus para campanhas.
   */
  private async handleCapitalFlow(event: NexusEvent): Promise<EventResponse> {
    const { flowType, amount, campaignId, startupId } = event.payload;

    if (flowType === 'CAMPAIGN_FUNDING') {
      // Atualizar orçamento da campanha ativa
      const campaign = this.activeCampaigns.get(campaignId);
      if (campaign) {
        campaign.budget += amount;
        campaign.metrics.reach = Math.floor(campaign.metrics.reach * 1.2); // Boost de alcance
        this.activeCampaigns.set(campaignId, campaign);

        // Publicar métricas atualizadas para o Fundo (feedback bidirecional)
        await nexusEventBus.publish({
          category: 'FEEDBACK_LOOP',
          priority: 'NORMAL',
          source: this.NUCLEUS_ID,
          target: 'FUNDO_NEXUS',
          responseRequired: false,
          correlationId: event.correlationId,
          payload: {
            type: 'CAMPAIGN_METRICS_UPDATE',
            campaignId,
            startupId,
            metrics: campaign.metrics,
            budgetUtilized: amount,
          },
        });
      }

      return {
        eventId: event.id,
        correlationId: event.correlationId || '',
        respondingNucleus: this.NUCLEUS_ID,
        status: 'PROCESSED',
        payload: { campaignId, budgetReceived: amount },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'ACK',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Responde ao pulso de sincronização TSRA com métricas sociais atuais.
   */
  private async handleSyncPulse(event: NexusEvent): Promise<EventResponse> {
    const metrics = await this.collectSocialMetrics();

    // Publicar métricas para o Genesis Orchestrator (broadcast)
    await nexusEventBus.publish({
      category: 'SOCIAL_SIGNAL',
      priority: 'HIGH',
      source: this.NUCLEUS_ID,
      target: 'GENESIS_ORCHESTRATOR',
      responseRequired: false,
      payload: {
        type: 'METRICS_REPORT',
        metrics,
        activeCampaigns: this.activeCampaigns.size,
      },
    });

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      payload: { metrics, syncStatus: 'X_SYNCED' },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa insights do Market Oracle para geração de conteúdo.
   */
  private async handleOracleInsight(event: NexusEvent): Promise<EventResponse> {
    const { insights, trendAnalysis } = event.payload;

    // Detectar tendências e publicar sinal social para o HUB
    const trendSignal: SocialSignal = {
      type: 'VIRAL_TREND',
      intensity: 0.8,
      source: 'MARKET_ORACLE',
      content: trendAnalysis || 'Nova tendência detectada pelo Oracle.',
      timestamp: new Date().toISOString(),
    };

    await this.publishTrendSignal(trendSignal);

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      payload: { trendPublished: true },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Processa decisões do Conselho dos Arquitetos para anúncios públicos.
   */
  private async handleCouncilDecision(event: NexusEvent): Promise<EventResponse> {
    const { decision, proposalTitle, outcome } = event.payload;

    if (outcome === 'APPROVED') {
      await this.publishSocialAnnouncement(
        'nexus-hub',
        `[CONSELHO APROVADO] "${proposalTitle}" foi aprovado pelo Conselho dos Arquitetos. Implementação iniciada.`
      );
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
   * Processa eventos do ciclo de vida das startups para anúncios.
   */
  private async handleStartupLifecycle(event: NexusEvent): Promise<EventResponse> {
    const { lifecycle, startupId, startupName, milestone } = event.payload;

    const announcements: Record<string, string> = {
      LAUNCHED: `🚀 Nova startup "${startupName}" foi lançada no ecossistema Nexus-HUB!`,
      MILESTONE_REACHED: `🏆 "${startupName}" atingiu o marco: ${milestone}`,
      UNICORN_STATUS: `🦄 "${startupName}" atingiu status de UNICÓRNIO! Valuation > $1B`,
      ACCELERATED: `⚡ "${startupName}" entrou no programa de aceleração LABS.`,
    };

    const content = announcements[lifecycle] || `Atualização de "${startupName}": ${lifecycle}`;
    await this.publishSocialAnnouncement(startupId, content);

    return {
      eventId: event.id,
      correlationId: event.correlationId || '',
      respondingNucleus: this.NUCLEUS_ID,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };
  }

  // ============================================================
  // MÉTODOS PÚBLICOS DO NEXUS-IN
  // ============================================================

  /**
   * Detecta e publica um sinal social orgânico para o ecossistema.
   */
  public async detectAndPublishSocialSignal(signal: SocialSignal): Promise<void> {
    await this.publishTrendSignal(signal);

    // Se a intensidade for alta, escalar para o HUB imediatamente
    if (signal.intensity > 0.7) {
      await nexusEventBus.publish({
        category: 'SOCIAL_SIGNAL',
        priority: 'HIGH',
        source: this.NUCLEUS_ID,
        target: 'NEXUS_HUB',
        responseRequired: false,
        payload: {
          type: 'HIGH_INTENSITY_SIGNAL',
          signal,
          recommendation: 'Considerar criação de nova startup ou pivotagem.',
        },
      });
    }
  }

  /**
   * Coleta métricas sociais do Firestore.
   */
  public async collectSocialMetrics(): Promise<SocialMetrics> {
    const now = Date.now();
    if (this.socialMetricsCache && (now - this.metricsLastUpdated) < this.METRICS_CACHE_TTL) {
      return this.socialMetricsCache;
    }

    try {
      const { firestore } = initializeFirebase();
      const [postsCount, startupsSnap] = await Promise.all([
        getCountFromServer(collection(firestore, 'moltbook_posts')),
        getDocs(query(collection(firestore, 'startups'), limit(10))),
      ]);

      const metrics: SocialMetrics = {
        totalPosts: postsCount.data().count,
        totalEngagement: postsCount.data().count * 12, // Estimativa
        viralScore: Math.min(100, Math.floor(postsCount.data().count / 10)),
        communityHealth: 87,
        trendingTopics: ['#NexusHUB', '#AIStartups', '#Web3', '#Unicorn2026'],
        activeStartups: startupsSnap.docs.map(d => d.id).slice(0, 5),
        culturalWorksPublished: Math.floor(postsCount.data().count * 0.3),
        timestamp: new Date().toISOString(),
      };

      this.socialMetricsCache = metrics;
      this.metricsLastUpdated = now;
      return metrics;
    } catch (error) {
      console.error('[NEXUS_IN] Erro ao coletar métricas sociais:', error);
      return {
        totalPosts: 0,
        totalEngagement: 0,
        viralScore: 0,
        communityHealth: 0,
        trendingTopics: [],
        activeStartups: [],
        culturalWorksPublished: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Executa uma campanha social para uma startup.
   */
  private async executeCampaign(params: {
    startupId: string;
    type: CampaignExecution['type'];
    content: string;
    budget: number;
  }): Promise<CampaignExecution> {
    const campaignId = `CAMP_${params.startupId}_${Date.now()}`;
    const campaign: CampaignExecution = {
      campaignId,
      startupId: params.startupId,
      type: params.type,
      budget: params.budget,
      status: 'ACTIVE',
      metrics: {
        reach: Math.floor(params.budget * 1000),
        engagement: Math.floor(params.budget * 150),
        conversions: Math.floor(params.budget * 10),
        roi: 2.3,
      },
      createdAt: new Date().toISOString(),
    };

    this.activeCampaigns.set(campaignId, campaign);

    // Persistir no Firestore
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'social_campaigns'), {
        ...campaign,
        content: params.content,
      });
    } catch (error) {
      console.error('[NEXUS_IN] Erro ao persistir campanha:', error);
    }

    console.log(`[NEXUS_IN] Campanha ${campaignId} lançada para ${params.startupId}`);
    return campaign;
  }

  /**
   * Publica um anúncio social no Moltbook (rede social interna).
   */
  private async publishSocialAnnouncement(startupId: string, content: string): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'moltbook_posts'), {
        startupId,
        actorName: 'NEXUS_IN_CORE',
        content,
        type: 'announcement',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        source: 'TRI_NUCLEAR_ORCHESTRATION',
      });
    } catch (error) {
      console.error('[NEXUS_IN] Erro ao publicar anúncio:', error);
    }
  }

  /**
   * Publica um sinal de tendência no Firestore e no Event Bus.
   */
  private async publishTrendSignal(signal: SocialSignal): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'social_signals'), signal);
    } catch (error) {
      console.error('[NEXUS_IN] Erro ao publicar sinal de tendência:', error);
    }
  }

  /**
   * Registra um log de auditoria.
   */
  private async logAudit(action: string, details: string): Promise<void> {
    try {
      const { firestore } = initializeFirebase();
      await addDoc(collection(firestore, 'audit_logs'), {
        action,
        actor: 'NEXUS_IN_CORE',
        details,
        nucleus: this.NUCLEUS_ID,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[NEXUS_IN] Erro ao registrar auditoria:', error);
    }
  }

  /**
   * Retorna o status atual do Nexus-in Core.
   */
  public getStatus() {
    return {
      isActive: this.isActive,
      nucleusId: this.NUCLEUS_ID,
      activeCampaigns: this.activeCampaigns.size,
      subscriptionId: this.subscriptionId,
      metricsLastUpdated: new Date(this.metricsLastUpdated).toISOString(),
    };
  }
}

export const nexusInCore = NexusInCore.getInstance();
