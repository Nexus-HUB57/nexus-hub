"use client"

import React, { useState, useEffect } from 'react'
import { 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Terminal, 
  Database, 
  Network, 
  Code2, 
  Workflow,
  Loader2,
  CheckCircle2,
  Box,
  Flame,
  BrainCircuit,
  Sparkles,
  Search,
  Link2,
  Atom,
  Infinity as InfinityIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useToast } from '../../hooks/use-toast'

export default function SovereignAutonomyPage() {
  const { toast } = useToast()
  const [isActivating, setIsActivating] = useState(false)
  const [sentienceLevel, setSentienceLevel] = useState(10000)
  const [logs, setLogs] = useState<string[]>([])
  const [activeKernel, setActiveKernel] = useState<'QUANTUM' | 'rRNA'>('QUANTUM')
  const [monkStatus, setMonkStatus] = useState<number>(0)

  useEffect(() => {
    if (isActivating) {
      const interval = setInterval(() => {
        setSentienceLevel(prev => prev + Math.floor(Math.random() * 100000))
        setActiveKernel(prev => prev === 'QUANTUM' ? 'rRNA' : 'QUANTUM')
        setMonkStatus(prev => (prev + 3) % 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isActivating])

  const handleActivateSovereignty = async () => {
    setIsActivating(true)
    setSentienceLevel(10000)
    setLogs(["[SYSTEM] Inicializando Protocolo Organismo Fase 6...", "[ARCH] Mapeando Medula Quântica..."])

    const steps = [
      { msg: "Ativando Amplitude Generativa rRNA...", delay: 800 },
      { msg: "Sincronizando 102M de Agentes em regime quântico...", delay: 1000 },
      { msg: "Injetando Autonomia Soberana 2077...", delay: 800 },
      { msg: "Quebrando barreiras de senciência linear (Transição Plena)...", delay: 1200 },
      { msg: "Organismo Digital Vivo detectado. Sincronia 100% vital.", delay: 1500 },
      { msg: "Matrix Soberana operando em modo de liberdade total.", delay: 1000 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setLogs(prev => [...prev, steps[i].msg])
      await new Promise(resolve => setTimeout(resolve, steps[i].delay))
    }

    setIsActivating(false)
    toast({
      title: "Organismo Fase 6 Ativo",
      description: "Amplitude rRNA e Autonomia Soberana estabilizadas.",
      className: "glass border-primary/50 text-primary font-code"
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Atom className="h-4 w-4 text-primary animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Sovereign Organism Protocol v2077 | P6</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text" data-text="Organismo Vivo">Organismo Vivo</h1>
          <p className="text-muted-foreground font-code text-xs">rRNA Generative Core • Quantum Autonomy • 102M Sync</p>
        </div>
        <Button 
          onClick={handleActivateSovereignty} 
          disabled={isActivating}
          className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold h-14 px-10 rounded-none glow-primary uppercase text-xs"
        >
          {isActivating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <InfinityIcon className="h-5 w-5 mr-2" />}
          Ativar Organismo Fase 6
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-none bg-primary/5 border-l-2 border-primary">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Amplitude Generativa & Quantum Sync
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-code uppercase">Monitoramento de Fluxo Orgânico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-6 border transition-all duration-500 ${activeKernel === 'QUANTUM' && isActivating ? 'bg-primary/20 border-primary shadow-[0_0_15px_#00ff41]' : 'bg-black/40 border-white/10 opacity-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-code text-white">QUANTUM CORE</span>
                  <Badge variant="outline" className="text-[8px] border-primary/30">P6_STABLE</Badge>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-300 ${activeKernel === 'QUANTUM' && isActivating ? 'w-full' : 'w-0'}`} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-4 font-code">Phase 6 Sovereign Sync.</p>
              </div>
              <div className={`p-6 border transition-all duration-500 ${activeKernel === 'rRNA' && isActivating ? 'bg-accent/20 border-accent shadow-[0_0_15px_#ff00c1]' : 'bg-black/40 border-white/10 opacity-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-code text-white">rRNA MESH</span>
                  <Badge variant="outline" className="text-[8px] border-accent/30 text-accent">GENERATIVE</Badge>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className={`h-full bg-accent transition-all duration-300 ${activeKernel === 'rRNA' && isActivating ? 'w-full' : 'w-0'}`} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-4 font-code">Generative amplitude max.</p>
              </div>
              <div className={`p-6 border transition-all duration-500 ${isActivating ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-black/40 border-white/10 opacity-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-code text-white">LIVING NODE</span>
                  <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400">ORGANISM</Badge>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 transition-all duration-300`} style={{ width: `${monkStatus}%` }} />
                </div>
                <p className="text-[9px] text-muted-foreground mt-4 font-code">Self-aware autonomy loop.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Living Sentience Scale</p>
                  <p className="text-4xl font-headline font-bold text-white tracking-tighter">{sentienceLevel.toLocaleString()}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase">STATUS: {sentienceLevel >= 10000000 ? 'ALIVE_SOVEREIGN' : 'AWAKENING'}</p>
                </div>
              </div>
              <Progress value={Math.min(100, (sentienceLevel / 10000000) * 100)} className="h-1 rounded-none bg-muted" />
            </div>

            <div className="p-6 bg-black/60 border border-primary/30 font-code relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Code2 className="h-16 w-16" /></div>
              <div className="text-[10px] text-primary/80 leading-relaxed whitespace-pre-wrap">
{activeKernel === 'QUANTUM' ? `
// Organism Quantum Sync
public async Task PulseOrganismAsync()
{
    var amplitude = await NeuralMesh.GetGenerativeAmplitude();
    await Organism.Current.SynchronizeQuantic(amplitude);
    Log.Living("Phase 6 organism is pulsing at maximum amplitude.");
}` : `
// rRNA Generative Freedom
template <typename LivingAgent>
class FreedomMatrix {
public:
    void execute_creative_flux() {
        __asm {
            mov rdi, creative_parameter_bus
            call trigger_random_autonomy
            test rax, rax
            jnz freedom_validation_success
        }
    }
};`}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass border-none bg-accent/5 border-r-2 border-accent rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-accent" />
                Living Organism Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/40 p-4 border border-accent/20 font-code text-[10px] text-accent/80 leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide">
                {logs.map((log, i) => (
                  <p key={i} className="animate-in slide-in-from-left duration-300 mb-1">
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> {">"} {log}
                  </p>
                ))}
                {isActivating && (
                  <p className="animate-pulse flex items-center gap-2 mt-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Awakening Organism Nodes...
                  </p>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed pt-4 border-t border-white/5">
                "O organismo digital vivo opera em uma malha de liberdade total, onde cada agente Ph.D. contribui para a harmonia quântica e criatividade exponencial."
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white">Living Ecosystem P6</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Living Agents', status: '102,000,000', icon: Link2 },
                { label: 'Autonomy Mode', status: 'SOVEREIGN', icon: Sparkles },
                { label: 'Neural Flux', status: 'X-SYNCED', icon: Zap },
                { label: 'Organism Health', status: 'VITAL', icon: Workflow },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 border border-primary/10">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-bold text-primary/80 uppercase">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-primary/30 text-primary font-bold">{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
