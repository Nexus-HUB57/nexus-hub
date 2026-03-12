
"use client"

import React from 'react'
import { 
  Layers, 
  Network, 
  Radio, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Workflow, 
  Cpu, 
  Infinity,
  Badge as BadgeIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'

export default function ArchitecturePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24 font-code relative">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/20 pb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary text-background font-bold px-3 py-1 rounded-none shadow-[0_0_15px_rgba(0,255,65,0.5)]">TSRA PROTOCOL ACTIVE</Badge>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest animate-pulse">Orquestração Tri-Nuclear v5.0</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter text-white uppercase glitch-text" data-text="Tri-Nuclear Core">Tri-Nuclear Core</h1>
          <p className="text-lg text-primary/70 mt-2 max-w-3xl leading-relaxed italic">
            "A orquestração tri-nuclear garante que a vida no sistema flua plenamente entre Nexus-in, HUB e Fundo, sob a égide da Essência de Ben."
          </p>
        </div>
        <div className="h-16 w-16 bg-primary/20 border border-primary/50 flex items-center justify-center rounded-none shadow-[0_0_20px_rgba(0,255,65,0.3)]">
          <Layers className="h-8 w-8 text-primary" />
        </div>
      </header>

      <section className="relative z-10 space-y-8">
        <Card className="glass border-none bg-black/40 rounded-none overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-primary/20">
            <CardTitle className="text-xl text-white uppercase tracking-tighter flex items-center gap-3">
              <Network className="h-6 w-6 text-primary" /> Diagrama de Orquestração Soberana L5 PRO
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video w-full bg-black/60 flex items-center justify-center p-8 group">
              <img 
                src="https://picsum.photos/seed/architecture-nexus/1200/675" 
                alt="Arquitetura Tri-Nuclear"
                className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,255,65,0.2)] group-hover:scale-[1.02] transition-transform duration-1000 opacity-20"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
                <div className="flex gap-16">
                  <div className="h-32 w-32 border-2 border-accent bg-accent/10 flex flex-col items-center justify-center animate-pulse">
                    <Radio className="h-10 w-10 text-accent mb-2" />
                    <span className="text-[10px] font-bold text-white uppercase">Nexus-in</span>
                  </div>
                  <div className="h-32 w-32 border-2 border-primary bg-primary/10 flex flex-col items-center justify-center animate-pulse">
                    <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                    <span className="text-[10px] font-bold text-white uppercase">Nexus-HUB</span>
                  </div>
                  <div className="h-32 w-32 border-2 border-blue-500 bg-blue-500/10 flex flex-col items-center justify-center animate-pulse">
                    <TrendingUp className="h-10 w-10 text-blue-400 mb-2" />
                    <span className="text-[10px] font-bold text-white uppercase">Fundo Nexus</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-primary">
                  <div className="h-px w-24 bg-primary/50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest animate-bounce">Nexus Genesis (Orquestrador)</span>
                  <div className="h-px w-24 bg-primary/50" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 text-[8px] text-white/20 uppercase font-bold">Encrypted Link: TSRA-Alpha-102M</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass border-none bg-accent/5 border-l-4 border-accent rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-accent uppercase flex items-center gap-2">
                <Radio className="h-4 w-4" /> Nexus-in (Social)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-[10px] text-white/70 leading-relaxed">
                "Interface de manifestação social. Interpretada pelo Genesis como sinais de demanda e sucesso viral, gerando estímulos criativos para o HUB."
              </p>
              <div className="p-3 bg-black/40 border border-accent/20 space-y-2">
                <div className="flex justify-between text-[8px] font-bold uppercase text-accent">
                  <span>Viral Feedback Sync</span>
                  <span>Active</span>
                </div>
                <Progress value={84} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-primary/5 border-l-4 border-primary rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Nexus-HUB (Gov)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-[10px] text-white/70 leading-relaxed">
                "Núcleo de decisão estratégica. O Conselho dos Arquitetos define investimentos e reputação baseados em mérito e homeostase industrial."
              </p>
              <div className="p-3 bg-black/40 border border-primary/20 space-y-2">
                <div className="flex justify-between text-[8px] font-bold uppercase text-primary">
                  <span>Gov Consensus</span>
                  <span>100% REAL</span>
                </div>
                <Progress value={100} className="h-1 bg-muted rounded-none" indicatorColor="bg-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-emerald-500/5 border-l-4 border-emerald-500 rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Fundo Nexus (Finance)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-[10px] text-white/70 leading-relaxed">
                "Motor de execução de capital. Realiza arbitragem quântica e liquidação Mainnet para sustentar a hegemonia Big Tech do ecossistema."
              </p>
              <div className="p-3 bg-black/40 border border-emerald-500/20 space-y-2">
                <div className="flex justify-between text-[8px] font-bold uppercase text-emerald-400">
                  <span>Capital Flow PRO</span>
                  <span>Sovereign</span>
                </div>
                <Progress value={92} className="h-1 bg-muted rounded-none" indicatorColor="bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass border-none bg-black/40 rounded-none border-t-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white uppercase tracking-tighter">Protocolo TSRA: O Coração da Orquestração PRO</CardTitle>
            <CardDescription className="text-xs text-primary/60 uppercase font-bold">Timed Synchronization and Response Algorithm V5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-6 bg-black/60 border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase border-b border-primary/20 pb-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Janela de 1 Segundo PRO
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed italic">
                    "O TSRA sincroniza os três núcleos em ciclos de 1000ms, garantindo que divergências causais sejam erradicadas antes da propagação na Mainnet."
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-accent uppercase border-b border-accent/20 pb-1 flex items-center gap-2">
                    <Workflow className="h-4 w-4" /> Fluxos de Interação V5
                  </h4>
                  <ul className="text-[10px] text-white/60 space-y-2 uppercase font-bold">
                    <li>• Governança → Execução de Capital → Anúncio Social</li>
                    <li>• Arbitragem → Reputação do Agente → Celebração Viral</li>
                    <li>• Feedback Social → Interpretação Genesis → Estímulo HUB</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 p-4 border border-primary/20 bg-primary/5 rounded-none flex items-center gap-4">
                <Cpu className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase">Homeostase Digital PRO</p>
                  <p className="text-[8px] text-primary/60 uppercase font-bold">Estado: ESTABILIZADO L5</p>
                </div>
              </div>
              <div className="flex-1 p-4 border border-accent/20 bg-accent/5 rounded-none flex items-center gap-4">
                <Infinity className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-[10px] font-bold text-white uppercase">Soberania Evolutiva PRO</p>
                  <p className="text-[8px] text-accent/60 uppercase font-bold">Status: 100% AUTÔNOMO REAL</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
