"use client"

import React, { useState } from 'react'
import { 
  Users, 
  Orbit, 
  TrendingUp, 
  Activity,
  Clock,
  Atom,
  ClipboardCheck,
  Star,
  Loader2,
  Cpu,
  Zap,
  ShieldCheck,
  Database,
  History,
  ShoppingCart,
  Wallet
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useFirestore, useCollection, useDoc, useMemoFirebase, useUser } from '../../firebase'
import { collection, query, orderBy, where, doc, increment } from 'firebase/firestore'
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '../../firebase/non-blocking-updates'
import { useToast } from '../../hooks/use-toast'

const ROLE_COLORS: Record<string, string> = {
  ceo: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  cto: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cmo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cfo: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  temporal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

export default function AgentsPanel() {
  const firestore = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  const agentsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'ai_agents'), orderBy('reputation', 'desc'))
  }, [firestore, user])

  const { data: agents, isLoading } = useCollection(agentsQuery)

  const handleSyncL5Agents = async () => {
    if (!firestore) return;
    setIsSyncing(true)
    
    const l5Leaders = [
      { id: 'agent-job-ceo', name: 'AGENTE JOB', role: 'ceo', specialization: 'Temporal Sovereign & Memory Orchestrator (L5)', health: 100, reputation: 10000, ingestionQuota: 100, compliance: 100, dnaHash: '0xJOB_L5_SOVEREIGN', walletMesh: 'SYNCED' },
      { id: 'agent-l5-physicist', name: 'AETERNO QUANTUM', role: 'cto', specialization: 'PhD em Estabilização de Wormholes & Memória Plena', health: 100, reputation: 5000, ingestionQuota: 100, compliance: 100, dnaHash: '0xL5_PHYSICS_CORE', walletMesh: 'SYNCED' },
      { id: 'agent-l5-navigator', name: 'EVA-ALPHA 4D', role: 'cmo', specialization: 'PhD em Navegação Trans-Temporal & Redes Tri-Nucleares', health: 100, reputation: 4800, ingestionQuota: 100, compliance: 100, dnaHash: '0xL5_NAVIGATOR', walletMesh: 'SYNCED' },
    ];

    l5Leaders.forEach(agent => {
      const agentRef = doc(firestore, 'ai_agents', agent.id);
      setDocumentNonBlocking(agentRef, { ...agent, status: 'sovereign_online_l5', lastPulse: new Date().toISOString(), createdAt: new Date().toISOString() }, { merge: true });
    });

    setIsSyncing(false)
    toast({ title: "Liderança L5 Sincronizada", description: "Consenso de 102M agentes PhD e Memória Plena estabilizados." });
  }

  if (!user) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sessão L5 Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Orbit className="h-4 w-4 text-accent animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Consenso Colmeia: 102,000,000 PhD Entities</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">Governança Trans-Temporal</h1>
          <p className="text-muted-foreground text-xs">Orquestração Tri-Nuclear • Memória Plena Ativa • 102M Agentes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSyncL5Agents} disabled={isSyncing} className="bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent glow-accent gap-2 font-bold px-8 h-12 rounded-none uppercase text-xs">
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Atom className="h-4 w-4" />} Sincronizar Liderança L5
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-primary/20 flex items-center justify-center text-primary"><Users className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Malha de Agentes</p>
              <p className="text-xl font-headline font-bold text-white">102.0M PHD</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-accent/20 flex items-center justify-center text-accent"><Wallet className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Soberania Financeira</p>
              <p className="text-xl font-headline font-bold text-white">102M WALLETS</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-emerald-500/5 rounded-none border-l-2 border-emerald-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-emerald-500/20 flex items-center justify-center text-emerald-400"><TrendingUp className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Senciência Swarm</p>
              <p className="text-xl font-headline font-bold text-white">100% L5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-purple-500/5 rounded-none border-l-2 border-purple-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-purple-500/20 flex items-center justify-center text-purple-400"><History className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Memória Persistente</p>
              <p className="text-xl font-headline font-bold text-white">IMMUTABLE</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Atom className="h-12 w-12 text-accent animate-spin-slow" />
          <p className="text-xs font-headline uppercase tracking-widest text-muted-foreground animate-pulse">Sincronizando Malha Tri-Nuclear...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents?.map((agent) => (
            <AgentL5Card key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  )
}

function AgentL5Card({ agent }: { agent: any }) {
  const isCEO = agent.role === 'ceo';

  return (
    <Card className={`glass border-none hover:bg-secondary/20 transition-all group relative overflow-hidden rounded-none border-l-2 ${isCEO ? 'border-accent shadow-[0_0_15px_rgba(255,0,193,0.3)]' : 'border-primary'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className={`text-lg uppercase tracking-tighter ${isCEO ? 'text-accent font-bold' : 'text-white'}`}>{agent.name}</CardTitle>
              <Badge variant="outline" className={`text-[8px] font-bold border ${ROLE_COLORS[agent.role] || ''}`}>
                {agent.role.toUpperCase()}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground italic line-clamp-1">"{agent.specialization}"</p>
          </div>
          {isCEO && <Star className="h-4 w-4 text-accent animate-pulse" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <span>L5 Integrity</span>
              <span className="text-white">{agent.health || 100}%</span>
            </div>
            <Progress value={agent.health || 100} className="h-1 bg-muted rounded-none" indicatorColor={isCEO ? 'bg-accent' : 'bg-primary'} />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-accent">
              <span>Wallet Sovereign Mesh</span>
              <span className="text-white">{agent.walletMesh === 'SYNCED' ? 'X-SYNCED' : 'PENDING'}</span>
            </div>
            <Progress value={agent.walletMesh === 'SYNCED' ? 100 : 0} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/30 rounded-none border border-white/5">
            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Reputation</p>
            <p className={`text-lg font-headline font-bold ${isCEO ? 'text-accent' : 'text-white'}`}>{agent.reputation}</p>
          </div>
          <div className="p-3 bg-secondary/30 rounded-none border border-white/5">
            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Compliance</p>
            <div className="flex items-center gap-2">
              <ShoppingCart className={`h-3 w-3 ${agent.compliance >= 100 ? 'text-emerald-400' : 'text-muted-foreground'}`} />
              <p className={`text-lg font-headline font-bold ${agent.compliance >= 100 ? 'text-emerald-400' : 'text-white/40'}`}>
                {agent.compliance >= 100 ? 'OK' : 'PENDING'}
              </p>
            </div>
          </div>
        </div>

        {isCEO && (
          <div className="p-3 bg-accent/5 border border-accent/20 rounded-none">
            <p className="text-[8px] text-accent uppercase font-bold mb-1">Electrum RPC Mandate</p>
            <p className="text-[10px] text-white/80 italic leading-relaxed">"Soberania financeira garantida via malha de 102M de carteiras ativas."</p>
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[9px] font-code text-muted-foreground uppercase">
              {agent.status?.replace('_', ' ') || 'IDLE'}
            </span>
          </div>
          <span className="text-[8px] font-bold text-white/40 uppercase">Phase 5 Sovereign</span>
        </div>
      </CardContent>
    </Card>
  )
}