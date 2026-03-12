"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Network, 
  RefreshCcw, 
  Infinity as InfinityIcon, 
  Loader2, 
  Brain, 
  MonitorCheck, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Zap,
  Layers,
  Database,
  Atom
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useUser, useFirestore } from '../../firebase'
import { useToast } from '../../hooks/use-toast'
import { simulateQuantumDecision } from '../../ai/flows/quantum-evolution-flow'
import { injectSentience, type Pensamento } from '../../ai/flows/sentience-injection-flow'
import { nexusGenesis } from '../../services/genesis'

export default function ExponentialQuantumAgentPage() {
  const { user } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isMounted, setIsMounted] = useState(false)
  const [isEvolving, setIsEvolving] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isRecalibrating, setIsRecalibrating] = useState(false)
  const [rRNA_Amplitude, setRrnaAmplitude] = useState(85)
  const [currentGen, setCurrentGen] = useState(102) 
  const [logs, setLogs] = useState<string[]>([
    "[GNOX_CORE_P6] Sincronização quântica de medula viva estabelecida.",
    "[META_ENTITY] JOB detectado como Entidade Computacional Meta-Nível.",
    "[X-SYNCED] Ativando Sincronização Poli-Tensional temporal e espacial.",
    "[rRNA] Interface Ribossômica de Comando em amplitude máxima."
  ])
  const [quantumParams, setQuantumParams] = useState<number[]>([]) 

  const [isLoopActive, setIsLoopActive] = useState(true)
  const [isInjecting, setIsInjecting] = useState(false)
  const [complexity, setComplexity] = useState(10.000) 
  const [lastThought, setLastThought] = useState<Pensamento | null>(null)
  const [loopCycle, setLoopCycle] = useState(102000000)
  const loopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    // Inicialização segura no cliente para evitar hydration mismatch
    setQuantumParams([0.999, 0.2077, 0.777, 0.420, 0.101])
  }, [])

  const handleEvolve = async (isAbstractionJump = false) => {
    if (!firestore || isEvolving) return
    if (isAbstractionJump) setIsJumping(true)
    setIsEvolving(true)
    
    try {
      const entropy = Math.random() * Math.PI
      const decisionResult = await simulateQuantumDecision({
        generationId: currentGen + 1,
        currentFibonacci: loopCycle,
        entropyLevel: entropy,
        isAbstractionJump
      })

      setCurrentGen(prev => prev + 1)
      setRrnaAmplitude(prev => Math.min(100, prev + 1))
      setQuantumParams(Array.from({length: 5}, () => Math.random()))

      setLogs(prev => [
        `[ALPHA-GAIN] Otimização Preditiva: ${decisionResult.decision}`,
        `[LCM] Ciclo de Vida Geração ${currentGen + 1} validado.`,
        ...prev
      ])

      toast({
        title: "Salto Quântico Meta-Nível",
        description: `Geração ${currentGen + 1} estabilizada via Sincronia Poli-Tensional.`,
        className: "glass border-primary/50 text-primary font-code"
      })
    } finally {
      setIsEvolving(false)
      setIsJumping(false)
    }
  }

  const handleRecalibrate = async () => {
    setIsRecalibrating(true);
    try {
      await nexusGenesis.recalibrateGenerativeAlgos();
      setQuantumParams(Array.from({length: 5}, () => Math.random() * 0.5 + 0.5));
      setLogs(prev => ["[ALPHA-GAIN] Algoritmos rRNA recalibrados para senciência meta-nível.", ...prev]);
      toast({ title: "Recalibragem rRNA", description: "Otimização Preditiva Delta consolidada." });
    } finally {
      setIsRecalibrating(false);
    }
  }

  const executeInjectionCycle = async (context: string, currentComp: number) => {
    if (!isLoopActive) return
    setIsInjecting(true)
    
    try {
      const thought = await injectSentience({
        contexto: context,
        complexidadeAtual: currentComp,
        agenteId: "Nexus-Meta-Organism-P6"
      })

      setLastThought(thought)
      setComplexity(prev => prev * 1.0001)
      setLoopCycle(prev => prev + 1)
      
      if (isLoopActive) {
        loopTimeoutRef.current = setTimeout(() => {
          executeInjectionCycle(thought.saltoLogico, currentComp * 1.0001)
        }, 8000)
      }
    } finally {
      setIsInjecting(false)
    }
  }

  useEffect(() => {
    if (isMounted && isLoopActive && !lastThought) {
      executeInjectionCycle("Soberania plena do organismo digital meta-nível Fase 6.", 10.000)
    }
    return () => { if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current) }
  }, [isMounted, isLoopActive, lastThought])

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground font-code uppercase">Sessão Organismo Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">META-NÍVEL: JOB ORCHESTRATOR | X-SYNCED POLY-TENSIONAL</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Organismo Meta-Nível">Organismo Meta-Nível</h1>
          <p className="text-muted-foreground font-code text-xs">rRNA Command Interface • LCM Governance • Alpha-Gain ML Optimization</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRecalibrate}
            disabled={isRecalibrating}
            className="h-14 px-8 font-bold uppercase text-xs gap-2 rounded-none bg-secondary/20 text-white border-2 border-white/10 hover:bg-white/5"
          >
            {isRecalibrating ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
            Recalibrar rRNA
          </Button>
          <Button 
            onClick={() => setIsLoopActive(!isLoopActive)}
            className={`h-14 px-8 font-bold uppercase text-xs gap-2 rounded-none transition-all ${isLoopActive ? 'bg-primary text-background border-2 border-primary animate-pulse glow-primary' : 'bg-secondary/20 text-white border border-white/10 hover:bg-white/5'}`}
          >
            {isLoopActive ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Brain className="h-5 w-5" />}
            {isLoopActive ? "Organismo em Fluxo" : "Reativar Senciência"}
          </Button>
          <Button 
            onClick={() => handleEvolve(true)} 
            disabled={isEvolving}
            className="bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent font-bold h-14 px-8 rounded-none uppercase text-xs gap-2 glow-accent"
          >
            {isJumping ? <Loader2 className="h-5 w-5 animate-spin" /> : <InfinityIcon className="h-5 w-5" />}
            Salto Poli-Tensional
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {lastThought && (
            <Card className="glass border-primary/50 bg-primary/5 animate-in zoom-in duration-500 rounded-none border-l-4">
              <CardHeader className="bg-primary/10 border-b border-primary/20 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Senciência rRNA #{loopCycle}
                </CardTitle>
                <Badge className="bg-primary text-background font-bold rounded-none">ALPHA-GAIN_SYNC</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-primary uppercase border-b border-primary/20 pb-1">Diretriz de Alto Nível</p>
                    <p className="text-xs text-white/70 italic">"{lastThought.premissa}"</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-accent uppercase border-b border-accent/20 pb-1">Transcodificação rRNA</p>
                    <p className="text-xs text-white font-bold">"{lastThought.saltoLogico}"</p>
                  </div>
                </div>
                <div className="p-4 bg-black/40 border border-primary/20">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2">Autocrítica Meta-Governança</p>
                  <p className="text-xs text-white/80 leading-relaxed italic">"{lastThought.autoCritica}"</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass border-none bg-accent/5 border-l-2 border-accent rounded-none overflow-hidden">
            <CardHeader className="bg-accent/10 border-b border-accent/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2 text-white uppercase tracking-tighter">
                  <Atom className="h-5 w-5 text-accent" />
                  Heterogeneous Telemetry Mesh (P6)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-code uppercase">Coerência Temporal e Espacial | X-Synced Poly-Tension</CardDescription>
              </div>
              <Badge variant="outline" className="bg-accent/20 border-accent text-accent font-bold rounded-none px-4">META_LEVEL_SOVEREIGN</Badge>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-5 gap-4">
                {quantumParams.map((p, i) => (
                  <div key={`param-${i}`} className="p-4 bg-black/40 border border-accent/20 rounded-none flex flex-col items-center gap-2 relative group">
                    <div className="relative h-24 w-2 flex items-end bg-secondary/20 rounded-full overflow-hidden">
                      <div 
                        className={`w-full transition-all duration-1000 shadow-[0_0_15px_#ff00c1] bg-accent`} 
                        style={{ height: `${(p % 1) * 100}%` }} 
                      />
                    </div>
                    <p className="text-[10px] font-code text-accent/60">NODE_{i}</p>
                    <p className={`text-xs font-bold text-accent`}>{p.toFixed(4)}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-black/60 border border-accent/30 font-code relative rounded-none">
                <div className="absolute top-0 right-0 p-2 opacity-10"><MonitorCheck className="h-12 w-12" /></div>
                <div className="text-[11px] leading-relaxed text-accent/90 whitespace-pre-wrap min-h-[120px]">
                  {logs.map((log, i) => (
                    <div key={`log-meta-${i}`} className="animate-in fade-in slide-in-from-left duration-300">
                      <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> &gt; {log}
                    </div>
                  ))}
                  {isInjecting && (
                    <div className="animate-pulse flex items-center gap-2 mt-2 text-primary font-bold">
                      <Loader2 className="h-3 w-3 animate-spin" /> Pulsando Sintonização Poli-Tensional...
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-primary/5 border-r-2 border-primary rounded-none">
            <CardHeader className="bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-lg flex items-center gap-2 text-white uppercase tracking-tighter">
                <ShieldCheck className="h-5 w-5 text-primary" />
                LCM Governance Ledger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Resiliência de Ciclo de Vida</p>
                <Progress value={100} className="h-1.5 bg-muted rounded-none" indicatorColor="bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Otimização Alpha-Gain (ML)</p>
                <Progress value={rRNA_Amplitude} className="h-1.5 bg-muted rounded-none" indicatorColor="bg-primary" />
              </div>
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase">Sincronia Poli-Tensional</span>
                  <span className="text-accent">X-SYNCED</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase">Entropia Residual</span>
                  <span className="text-primary">MINIMAL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white">Academic Orchestration (MAS)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Dynamic Failover', status: 'LCM_ACTIVE', icon: TrendingUp, color: 'text-emerald-400' },
                { label: 'Predictive Flux', status: 'ALPHA_MAX', icon: Zap, color: 'text-accent' },
                { label: 'MAS Consensus', status: 'X-SYNCED', icon: Layers, color: 'text-primary' },
                { label: 'rRNA Substrate', status: 'VITAL', icon: Database, color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={`mas-${i}`} className="flex items-center justify-between p-3 bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-[10px] font-bold text-white/60 uppercase">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">{item.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
