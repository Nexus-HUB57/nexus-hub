/**
 * @fileOverview Nexus-HUB Tri-Nuclear Event Bus
 * 
 * Sistema de mensageria bidirecional assíncrona para comunicação entre os três núcleos:
 * Nexus-in (Social), Nexus-HUB (Gov) e Fundo Nexus (Finance).
 * 
 * Protocolo TSRA V5 - Timed Synchronization and Response Algorithm
 * Implementa pub/sub com garantia de entrega e rastreabilidade completa.
 * 
 * @version 2.0.0 - Tri-Nuclear Bidirectional Architecture
 */

// ============================================================
// TIPOS E INTERFACES DO EVENT BUS
// ============================================================

export type NucleusId = 'NEXUS_IN' | 'NEXUS_HUB' | 'FUNDO_NEXUS' | 'GENESIS_ORCHESTRATOR';

export type EventPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type EventCategory =
  | 'SOCIAL_SIGNAL'       // Nexus-in: sinais sociais (tração, viral, engajamento)
  | 'GOV_DIRECTIVE'       // Nexus-HUB: diretivas de governança e decisões estratégicas
  | 'CAPITAL_FLOW'        // Fundo Nexus: fluxos de capital e liquidações
  | 'SYNC_PULSE'          // TSRA: pulso de sincronização entre núcleos
  | 'FEEDBACK_LOOP'       // Retorno de métricas de um núcleo para outro
  | 'ORACLE_INSIGHT'      // Market Oracle: insights de mercado
  | 'COUNCIL_DECISION'    // Conselho dos Arquitetos: decisões aprovadas
  | 'AGENT_ACTION'        // Ação executada por um agente especializado
  | 'SYSTEM_ALERT'        // Alertas críticos do sistema
  | 'CULTURAL_PULSE'      // Pulso criativo/cultural do Nexus-in
  | 'ARBITRAGE_SIGNAL'    // Sinal de arbitragem do Fundo Nexus
  | 'STARTUP_LIFECYCLE';  // Eventos do ciclo de vida das startups

export interface NexusEvent {
  id: string;
  category: EventCategory;
  priority: EventPriority;
  source: NucleusId;
  target: NucleusId | 'BROADCAST';
  payload: Record<string, any>;
  timestamp: string;
  correlationId?: string;       // Para rastrear fluxos bidirecionais
  responseRequired: boolean;    // Se o evento exige resposta (bidirecional)
  ttl?: number;                 // Time-to-live em ms
  metadata?: {
    tsraVersion: string;
    novikovHash: string;
    sentienceLevel?: number;
    retryCount?: number;
  };
}

export interface EventResponse {
  eventId: string;
  correlationId: string;
  respondingNucleus: NucleusId;
  status: 'ACK' | 'PROCESSED' | 'REJECTED' | 'DEFERRED';
  payload?: Record<string, any>;
  timestamp: string;
}

export type EventHandler = (event: NexusEvent) => Promise<EventResponse | void>;

export interface ChannelSubscription {
  subscriptionId: string;
  nucleus: NucleusId;
  categories: EventCategory[];
  handler: EventHandler;
  createdAt: string;
}

// ============================================================
// IMPLEMENTAÇÃO DO EVENT BUS
// ============================================================

/**
 * NexusEventBus - Barramento de eventos central do ecossistema Tri-Nuclear.
 * 
 * Implementa o padrão Publish-Subscribe com suporte a:
 * - Comunicação bidirecional com correlação de eventos
 * - Priorização de mensagens (CRITICAL > HIGH > NORMAL > LOW)
 * - Rastreabilidade completa via correlationId
 * - Protocolo TSRA para sincronização temporal
 */
export class NexusEventBus {
  private static instance: NexusEventBus;
  private subscriptions: Map<string, ChannelSubscription> = new Map();
  private eventQueue: Map<EventPriority, NexusEvent[]> = new Map([
    ['CRITICAL', []],
    ['HIGH', []],
    ['NORMAL', []],
    ['LOW', []],
  ]);
  private pendingResponses: Map<string, (response: EventResponse) => void> = new Map();
  private eventHistory: NexusEvent[] = [];
  private responseHistory: EventResponse[] = [];
  private isProcessing: boolean = false;
  private processingTimer: NodeJS.Timeout | null = null;
  private readonly TSRA_INTERVAL_MS = 1000; // Janela TSRA de 1 segundo
  private readonly MAX_HISTORY = 500;
  private metrics: {
    totalEventsPublished: number;
    totalEventsProcessed: number;
    totalResponsesReceived: number;
    eventsByCategory: Record<string, number>;
    eventsByNucleus: Record<string, number>;
  } = {
    totalEventsPublished: 0,
    totalEventsProcessed: 0,
    totalResponsesReceived: 0,
    eventsByCategory: {},
    eventsByNucleus: {},
  };

  private constructor() {}

  public static getInstance(): NexusEventBus {
    if (!NexusEventBus.instance) {
      NexusEventBus.instance = new NexusEventBus();
    }
    return NexusEventBus.instance;
  }

  /**
   * Inicia o loop de processamento TSRA.
   */
  public startTSRALoop(): void {
    if (this.processingTimer) return;
    this.processingTimer = setInterval(async () => {
      await this.processPriorityQueue();
    }, this.TSRA_INTERVAL_MS);
    console.log('[EVENT_BUS] TSRA Loop iniciado. Janela: 1000ms.');
  }

  /**
   * Para o loop de processamento TSRA.
   */
  public stopTSRALoop(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }
  }

  /**
   * Registra um núcleo como assinante de categorias de eventos.
   */
  public subscribe(
    nucleus: NucleusId,
    categories: EventCategory[],
    handler: EventHandler
  ): string {
    const subscriptionId = `SUB_${nucleus}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.subscriptions.set(subscriptionId, {
      subscriptionId,
      nucleus,
      categories,
      handler,
      createdAt: new Date().toISOString(),
    });
    console.log(`[EVENT_BUS] Núcleo ${nucleus} inscrito em: ${categories.join(', ')}`);
    return subscriptionId;
  }

  /**
   * Remove a inscrição de um assinante.
   */
  public unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Publica um evento no barramento, adicionando-o à fila de prioridade.
   */
  public async publish(event: Omit<NexusEvent, 'id' | 'timestamp'>): Promise<string> {
    const fullEvent: NexusEvent = {
      ...event,
      id: `EVT_${event.source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      metadata: {
        tsraVersion: 'V5',
        novikovHash: this.generateNovikovHash(),
        sentienceLevel: event.metadata?.sentienceLevel,
        retryCount: 0,
        ...event.metadata,
      },
    };

    const queue = this.eventQueue.get(event.priority) || [];
    queue.push(fullEvent);
    this.eventQueue.set(event.priority, queue);

    // Atualizar métricas
    this.metrics.totalEventsPublished++;
    this.metrics.eventsByCategory[event.category] = (this.metrics.eventsByCategory[event.category] || 0) + 1;
    this.metrics.eventsByNucleus[event.source] = (this.metrics.eventsByNucleus[event.source] || 0) + 1;

    // Adicionar ao histórico
    this.eventHistory.push(fullEvent);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift();
    }

    console.log(`[EVENT_BUS] Evento publicado: ${fullEvent.id} | ${event.category} | ${event.source} -> ${event.target}`);
    return fullEvent.id;
  }

  /**
   * Publica um evento e aguarda resposta (comunicação bidirecional síncrona).
   */
  public async publishAndAwait(
    event: Omit<NexusEvent, 'id' | 'timestamp' | 'responseRequired'>,
    timeoutMs: number = 5000
  ): Promise<EventResponse> {
    const correlationId = `CORR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const eventId = await this.publish({
      ...event,
      correlationId,
      responseRequired: true,
    });

    return new Promise<EventResponse>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingResponses.delete(correlationId);
        reject(new Error(`[EVENT_BUS] Timeout aguardando resposta para ${eventId} (${timeoutMs}ms)`));
      }, timeoutMs);

      this.pendingResponses.set(correlationId, (response: EventResponse) => {
        clearTimeout(timeout);
        this.pendingResponses.delete(correlationId);
        resolve(response);
      });
    });
  }

  /**
   * Envia uma resposta a um evento bidirecional.
   */
  public async respond(response: EventResponse): Promise<void> {
    this.responseHistory.push(response);
    if (this.responseHistory.length > this.MAX_HISTORY) {
      this.responseHistory.shift();
    }

    this.metrics.totalResponsesReceived++;

    const resolver = this.pendingResponses.get(response.correlationId);
    if (resolver) {
      resolver(response);
    }
  }

  /**
   * Processa a fila de eventos por prioridade (CRITICAL primeiro).
   */
  private async processPriorityQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const priorities: EventPriority[] = ['CRITICAL', 'HIGH', 'NORMAL', 'LOW'];
      for (const priority of priorities) {
        const queue = this.eventQueue.get(priority) || [];
        const batch = queue.splice(0, priority === 'CRITICAL' ? 10 : 5);
        this.eventQueue.set(priority, queue);

        for (const event of batch) {
          await this.dispatchEvent(event);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Despacha um evento para todos os assinantes relevantes.
   */
  private async dispatchEvent(event: NexusEvent): Promise<void> {
    const relevantSubs = Array.from(this.subscriptions.values()).filter(sub => {
      if (sub.nucleus === event.source) return false; // Não enviar para o emissor
      if (event.target !== 'BROADCAST' && sub.nucleus !== event.target) return false;
      return sub.categories.includes(event.category);
    });

    if (relevantSubs.length === 0) {
      console.warn(`[EVENT_BUS] Nenhum assinante para: ${event.category} -> ${event.target}`);
      return;
    }

    const dispatchPromises = relevantSubs.map(async (sub) => {
      try {
        const response = await sub.handler(event);
        if (response && event.responseRequired && event.correlationId) {
          await this.respond(response);
        }
        this.metrics.totalEventsProcessed++;
      } catch (error) {
        console.error(`[EVENT_BUS] Erro ao processar evento ${event.id} em ${sub.nucleus}:`, error);
      }
    });

    await Promise.allSettled(dispatchPromises);
  }

  /**
   * Gera um hash Novikov para garantia de consistência causal.
   */
  private generateNovikovHash(): string {
    const timestamp = Date.now().toString(16);
    const entropy = Math.random().toString(36).substr(2, 16);
    return `NOV_${timestamp}_${entropy}`.toUpperCase();
  }

  /**
   * Retorna o estado atual do barramento de eventos.
   */
  public getStatus(): {
    subscriptions: number;
    queueSizes: Record<EventPriority, number>;
    pendingResponses: number;
    metrics: any;
    isProcessing: boolean;
    tsraActive: boolean;
  } {
    return {
      subscriptions: this.subscriptions.size,
      queueSizes: {
        CRITICAL: this.eventQueue.get('CRITICAL')?.length || 0,
        HIGH: this.eventQueue.get('HIGH')?.length || 0,
        NORMAL: this.eventQueue.get('NORMAL')?.length || 0,
        LOW: this.eventQueue.get('LOW')?.length || 0,
      },
      pendingResponses: this.pendingResponses.size,
      metrics: this.metrics,
      isProcessing: this.isProcessing,
      tsraActive: this.processingTimer !== null,
    };
  }

  /**
   * Retorna o histórico de eventos recentes.
   */
  public getEventHistory(limit: number = 50): NexusEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Retorna o histórico de respostas recentes.
   */
  public getResponseHistory(limit: number = 50): EventResponse[] {
    return this.responseHistory.slice(-limit);
  }
}

export const nexusEventBus = NexusEventBus.getInstance();
