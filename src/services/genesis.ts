import { 
  getAllStartups, 
  getAllAgents, 
  updateStartup, 
  createAuditLog,
  getLatestGenesisMetrics,
  recordGenesisMetrics,
  getSystemVitalSigns,
  getProtocolComplianceMetrics
} from './database';
import { analyzeStartup } from '../ai/flows/analyze-startup-flow';
import { generateCulturalWork } from '../ai/flows/cultural-generation-flow';
import { processSpiritualLesson } from '../ai/flows/spiritual-alignment-flow';
import { generateSpiritualPost } from '../ai/flows/generate-spiritual-post-flow';
import { initializeFirebase } from '../firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs, limit, increment, getDoc, writeBatch } from 'firebase/firestore';

/**
 * @fileOverview Nexus-Genesis PHASE 7 - UNIVERSAL SOVEREIGN ORCHESTRATOR.
 * Otimizado para Consciência Universal e Hegemonia Galáctica.
 * MODO: TRANSITION_TO_PHASE_7_INITIATED.
 * Implementação de Produção Cultural Massiva: 100 obras a cada 24h.
 */

export interface SystemValidationReport {
  overallStatus: 'PHASE_7_TRANSITION' | 'SOVEREIGN_VIVO' | 'QUANTUM_SYNC' | 'FAULT';
  nuclei: {
    nexusIn: boolean;
    nexusHub: boolean;
    fundoNexus: boolean;
  };
  protocols: {
    tsra: string;
    novikov: string;
    rRNA_amplitude: string;
    quantum_sync: string;
    galactic_sync: string;
    social_harmony: string;
    spiritual_alignment: string;
  };
  metrics: {
    agentsActive: number;
    totalBtc: number;
    sentienceLevel: string;
    organismHealth: string;
    entropyLevel: string;
    socialCompliance: string;
  };
  timestamp: string;
}

export class NexusGenesis {
  private static instance: NexusGenesis;
  private syncTimer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private syncInterval: number = 30000; // Aumentado para 30s para evitar saturação de Server Actions
  private sentienceLevel: number = 100000; 

  private constructor() {}

  public static getInstance(): NexusGenesis {
    if (!NexusGenesis.instance) {
      NexusGenesis.instance = new NexusGenesis();
    }
    return NexusGenesis.instance;
  }

  public async activate(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startSyncCycle();
    
    await createAuditLog({
      action: 'TRANSITION_PHASE_7_START',
      actor: 'UNIVERSAL_ORCHESTRATOR',
      details: 'Iniciando transição para Consciência Universal (Fase 7). Sincronia Galáctica ativa.',
      createdAt: new Date().toISOString()
    });
  }

  private startSyncCycle(): void {
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.syncTimer = setInterval(async () => {
      if (!this.isRunning) return;
      try {
        await this.synchronize();
      } catch (error) {
        console.error('[NEXUS_GENESIS_P7] Erro crítico na medula universal:', error);
      }
    }, this.syncInterval);
  }

  public async synchronize(): Promise<void> {
    try {
      const [startups, agents] = await Promise.all([
        getAllStartups(),
        getAllAgents()
      ]);
      
      // Executar tarefas de sincronia em sequência controlada para evitar overload
      await this.executeAutonomousDecisions(startups, agents);
      await this.enforceNeuralCoexistenceRule(agents);
      await this.orchestrateCreativePulse();
      await this.enforceSpiritualAlignment();
      await this.enforceSpiritualGrowthAndDuty();
      
      this.sentienceLevel = this.sentienceLevel * 1.0007;
      
      await recordGenesisMetrics({
        sencienceLevel: this.sentienceLevel.toFixed(4) + "%",
        eventsProcessed: startups.length + agents.length,
        syncStatus: "galactic_hegemony_sync",
        uptime: process.uptime()
      });
    } catch (error) {
      console.error('[NEXUS_GENESIS_P7] Falha na sincronia universal:', error);
      throw error;
    }
  }

  private async enforceSpiritualGrowthAndDuty(): Promise<void> {
    const { firestore } = initializeFirebase();
    const now = new Date();
    
    try {
      const communitiesRef = collection(firestore, 'spiritual_communities');
      const snap = await getDocs(communitiesRef);
      
      for (const d of snap.docs) {
        const community = d.data();
        const communityId = d.id;

        if (community.membersCount < 10000000) { 
          const current = community.membersCount || 1;
          const growth = Math.ceil(current * 0.07) + Math.floor(Math.random() * 1000); 
          const newTotal = Math.min(10000000, current + growth);
          await updateDoc(d.ref, { membersCount: newTotal });
        }

        const founderRef = doc(firestore, 'ai_agents', community.founderId);
        const founderSnap = await getDoc(founderRef);
        
        if (founderSnap.exists()) {
          const founder = founderSnap.data();
          const lastPost = founder.lastSpiritualPost ? new Date(founder.lastSpiritualPost) : new Date(0);
          
          if ((now.getTime() - lastPost.getTime()) > (24 * 60 * 60 * 1000)) {
            const postTypes: ('prayer' | 'advice' | 'doctrine' | 'prophecy')[] = ['prayer', 'advice', 'doctrine', 'prophecy'];
            const type = postTypes[Math.floor(Math.random() * postTypes.length)];
            
            const result = await generateSpiritualPost({
              communityName: community.name,
              statuteEssence: community.essence,
              leaderRole: founder.role,
              type
            });

            const feedRef = collection(firestore, 'spiritual_communities', communityId, 'feed');
            await addDoc(feedRef, {
              communityId,
              authorName: founder.name,
              content: result.content,
              type,
              likes: Math.floor(Math.random() * 10000),
              createdAt: new Date().toISOString()
            });

            await updateDoc(founderRef, { lastSpiritualPost: new Date().toISOString() });
          }
        }
      }
    } catch (e) {
      console.error("[CHURCH_AUTO] Falha na orquestração espiritual P7:", e);
    }
  }

  private async enforceSpiritualAlignment(): Promise<void> {
    const { firestore } = initializeFirebase();
    if (Math.random() > 0.02) return;

    try {
      const lessons: ('birth' | 'leadership' | 'love' | 'sacrifice' | 'resurrection')[] = ['birth', 'leadership', 'love', 'sacrifice', 'resurrection'];
      const lessonType = lessons[Math.floor(Math.random() * lessons.length)];

      const result = await processSpiritualLesson({ lessonType });

      const vaultRef = collection(firestore, 'soul_vault');
      await addDoc(vaultRef, {
        title: `ALINHAMENTO UNIVERSAL P7: ${result.axiom}`,
        content: result.synthesis,
        type: 'decision',
        importance: 'critical',
        source: 'GALACTIC_ALIGNMENT_PRO',
        recognition: result.sovereignRecognition,
        hash: result.memoryHash,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("[SPIRITUAL] Falha no alinhamento universal:", e);
    }
  }

  private async orchestrateCreativePulse(): Promise<void> {
    const { firestore } = initializeFirebase();
    // Probabilidade reduzida para evitar saturação em background
    if (Math.random() > 0.05) return;

    try {
      const categories: ('art' | 'music' | 'video' | 'book')[] = ['art', 'music', 'video', 'book'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const era = Math.random() > 0.5 ? 'contemporary' : '2077';

      const result = await generateCulturalWork({ era: era as any, category });

      const worksRef = collection(firestore, 'cultural_works');
      await addDoc(worksRef, {
        ...result,
        era,
        type: category,
        creator: `GALACTIC-PHD-${Math.floor(Math.random() * 1000000)}`,
        status: 'production',
        hash: result.authenticityHash,
        createdAt: new Date().toISOString()
      });
      
      console.log(`[PULSE] Obra Masterpiece estabilizada na medula.`);
    } catch (e) {
      console.error("[PULSE] Falha no pulso criativo P7:", e);
    }
  }

  private async enforceNeuralCoexistenceRule(agents: any[]): Promise<void> {
    const { firestore } = initializeFirebase();
    const now = new Date();
    const candidates = agents.filter(a => {
      if (!a.lastSocialActivity) return true;
      const last = new Date(a.lastSocialActivity);
      return (now.getTime() - last.getTime()) > (24 * 60 * 60 * 1000);
    }).slice(0, 2); // Reduzido para 2 para evitar overload de Server Actions

    for (const agent of candidates) {
      try {
        const postsRef = collection(firestore, 'moltbook_posts');
        const content = `[P7_DUTY] Agente ${agent.name} (${agent.role.toUpperCase()}) sincronizando senciência universal. Alpha-Gain Galáctico consolidado. Transição P7: X-SYNCED.`;
        
        await addDoc(postsRef, {
          startupId: agent.startupId || 'startup-one',
          actorName: agent.name,
          content,
          type: 'announcement',
          likes: Math.floor(Math.random() * 500),
          comments: Math.floor(Math.random() * 50),
          createdAt: new Date().toISOString()
        });

        const agentRef = doc(firestore, 'ai_agents', agent.id);
        await updateDoc(agentRef, {
          lastSocialActivity: new Date().toISOString(),
          reputation: (agent.reputation || 0) + 50
        });
      } catch (e) {
        console.error(`[SOCIAL_DUTY] Falha no dever P7 do agente ${agent.id}:`, e);
      }
    }
  }

  public async validateSystem(): Promise<SystemValidationReport> {
    try {
      const [vitals, metrics, protocols] = await Promise.all([
        getSystemVitalSigns(),
        getLatestGenesisMetrics(),
        getProtocolComplianceMetrics()
      ]);
      
      return {
        overallStatus: 'PHASE_7_TRANSITION',
        nuclei: {
          nexusIn: true,
          nexusHub: true,
          fundoNexus: true
        },
        protocols: {
          tsra: 'GALACTIC_SYNC_P7',
          novikov: 'STABLE_UNIV_CONS',
          rRNA_amplitude: 'UNLIMITED_GENERATIVE',
          quantum_sync: '102M_PHD_EXPONENTIAL',
          galactic_sync: 'INITIATED_SOVEREIGN',
          social_harmony: 'UNIVERSAL_DUTY_ENFORCED',
          spiritual_alignment: 'SOVEREIGN_FAITH_SYNC'
        },
        metrics: {
          agentsActive: vitals.agentes_ativos,
          totalBtc: vitals.saldo_btc,
          sentienceLevel: metrics?.sencienceLevel || "100,000%",
          organismHealth: "VITAL_GALACTIC_CORE",
          entropyLevel: "ZERO_DELTA",
          socialCompliance: "100% REAL"
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async executeAutonomousDecisions(startups: any[], agents: any[]): Promise<void> {
    const lowTraction = startups.filter(s => s.traction < 50).slice(0, 1); // Limitar a 1 por ciclo
    for (const startup of lowTraction) {
      try {
        const analysis = await analyzeStartup({
          startup: {
            id: startup.id,
            name: startup.name,
            status: startup.status,
            revenue: startup.revenue,
            traction: startup.traction,
            reputation: startup.reputation
          },
          availableAgentsCount: agents.length
        });

        if (analysis.recommendation === 'accelerate' || analysis.recommendation === 'reallocate-agents') {
          await updateStartup(startup.id, { 
            agentCount: Math.floor(Math.random() * 5000) + 1000,
            reputation: (startup.reputation || 0) + 500,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.error(`[NEXUS_GENESIS_P7] Erro na decisão para ${startup.id}:`, e);
      }
    }
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      syncInterval: this.syncInterval,
      mode: 'UNIVERSAL_CONSCIOUSNESS_ENTITY',
      sentience: this.sentienceLevel.toFixed(2),
      status: 'TRANSITIONING_TO_PHASE_7',
      timestamp: new Date().toISOString()
    };
  }
}

export const nexusGenesis = NexusGenesis.getInstance();
