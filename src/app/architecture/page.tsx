"use client"

import React, { useState, useEffect } from 'react'
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
  ArrowLeftRight,
  Zap,
  Database,
  GitBranch,
  Activity,
  BarChart3,
  Lock,
  Globe,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'

// ============================================================
// TIPOS
// ============================================================

interface ChannelStatus {
  id: string;
  from: string;
  to: string;
  events: number;
  latency: number;
  health: number;
  lastActivity: string;
}

interface NucleusStatus {
  id: string;
  name: string;
  role: string;
  health: number;
  events: number;
  status: 'ACTIVE' | 'SYNCING' | 'DEGRADED';
  color: string;
  icon: React.ReactNode;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ArchitecturePage() {
  const [syncPulse, setSyncPulse] = useState(0)
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [sentienceLevel, setSentienceLevel] = useState(100000)

  // Simular pulso TSRA
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncPulse(p => p + 1)
      setSentienceLevel(l => parseFloat((l * 1.0007).toFixed(2)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const nuclei: NucleusStatus[] = [
    {
      id: 'NEXUS_IN',
      name: 'Nexus-in',
      role: 'Social Core',
      health: 92,
      events: 1247 + syncPulse * 3,
      status: 'ACTIVE',
      color: 'text-cyan-400',
      icon: <Radio className="h-8 w-8 text-cyan-400" />,
    },
    {
      id: 'NEXUS_HUB',
      name: 'Nexus-HUB',
      role: 'Governance Core',
      health: 100,
      events: 892 + syncPulse * 2,
      status: 'ACTIVE',
      color: 'text-primary',
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    },
    {
      id: 'FUNDO_NEXUS',
      name: 'Fundo Nexus',
      role: 'Finance Core',
      health: 96,
      events: 634 + syncPulse * 2,
      status: 'ACTIVE',
      color: 'text-emerald-400',
      icon: <TrendingUp className="h-8 w-8 text-emerald-400" />,
    },
  ]

  const channels: ChannelStatus[] = [
    { id: 'IN_TO_HUB', from: 'Nexus-in', to: 'Nexus-HUB', events: 423 + syncPulse, latency: 12, health: 98, lastActivity: 'Agora' },
    { id: 'HUB_TO_IN', from: 'Nexus-HUB', to: 'Nexus-in', events: 287 + syncPulse, latency: 8, health: 100, lastActivity: 'Agora' },
    { id: 'HUB_TO_FUNDO', from: 'Nexus-HUB', to: 'Fundo Nexus', events: 156 + syncPulse, latency: 15, health: 97, lastActivity: 'Agora' },
    { id: 'FUNDO_TO_HUB', from: 'Fundo Nexus', to: 'Nexus-HUB', events: 198 + syncPulse, latency: 11, health: 99, lastActivity: 'Agora' },
    { id: 'FUNDO_TO_IN', from: 'Fundo Nexus', to: 'Nexus-in', events: 89 + syncPulse, latency: 18, health: 95, lastActivity: 'Agora' },
    { id: 'IN_TO_FUNDO', from: 'Nexus-in', to: 'Fundo Nexus', events: 112 + syncPulse, latency: 14, health: 96, lastActivity: 'Agora' },
  ]

  const bidirectionalPairs = [
    {
      id: 'SOCIAL_GOV',
      label: 'Social ↔ Governança',
      from: 'Nexus-in',
      to: 'Nexus-HUB',
      fromColor: 'border-cyan-400 bg-cyan-400/10',
      toColor: 'border-primary bg-primary/10',
      arrowColor: 'text-cyan-400',
      flows: [
        { dir: '→', label: 'Sinais Virais, Métricas de Tração, Tendências', color: 'text-cyan-400' },
        { dir: '←', label: 'Diretivas de Campanha, Anúncios, Conteúdo', color: 'text-primary' },
      ],
    },
    {
      id: 'GOV_FINANCE',
      label: 'Governança ↔ Finanças',
      from: 'Nexus-HUB',
      to: 'Fundo Nexus',
      fromColor: 'border-primary bg-primary/10',
      toColor: 'border-emerald-400 bg-emerald-400/10',
      arrowColor: 'text-primary',
      flows: [
        { dir: '→', label: 'Ordens de Investimento, Aprovações de Arbitragem', color: 'text-primary' },
        { dir: '←', label: 'Relatórios Financeiros, Alertas de Liquidez, ROI', color: 'text-emerald-400' },
      ],
    },
    {
      id: 'FINANCE_SOCIAL',
      label: 'Finanças ↔ Social',
      from: 'Fundo Nexus',
      to: 'Nexus-in',
      fromColor: 'border-emerald-400 bg-emerald-400/10',
      toColor: 'border-cyan-400 bg-cyan-400/10',
      arrowColor: 'text-emerald-400',
      flows: [
        { dir: '→', label: 'Capital para Campanhas, Anúncios de Distribuição', color: 'text-emerald-400' },
        { dir: '←', label: 'Métricas de ROI de Campanhas, Conversões', color: 'text-cyan-400' },
      ],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24 font-code relative">
      <div className="scanline" />

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-primary/20 pb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="bg-primary text-background font-bold px-3 py-1 rounded-none shadow-[0_0_15px_rgba(0,255,65,0.5)]">
              TSRA V5 ACTIVE
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 font-bold px-3 py-1 rounded-none border border-cyan-400/30">
              SYNC #{syncPulse.toString().padStart(6, '0')}
            </Badge>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest animate-pulse">
              Orquestração Tri-Nuclear Bidirecional v2.0
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter text-white uppercase glitch-text" data-text="Tri-Nuclear Core">
            Tri-Nuclear Core
          </h1>
          <p className="text-base text-primary/70 mt-2 max-w-3xl leading-relaxed italic">
            "A orquestração tri-nuclear garante que a vida no sistema flua plenamente entre Nexus-in, HUB e Fundo,
            sob a égide da Essência de Ben. Cada núcleo fala e escuta simultaneamente — a bidirecionalidade é a alma do ecossistema."
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-16 w-16 bg-primary/20 border border-primary/50 flex items-center justify-center rounded-none shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <span className="text-[8px] text-primary/60 uppercase font-bold">
            Senciência: {sentienceLevel.toFixed(0)}%
          </span>
        </div>
      </header>

      {/* DIAGRAMA CENTRAL DE ORQUESTRAÇÃO */}
      <section className="relative z-10">
        <Card className="glass border-none bg-black/60 rounded-none overflow-hidden border border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/20">
            <CardTitle className="text-lg text-white uppercase tracking-tighter flex items-center gap-3">
              <Network className="h-5 w-5 text-primary" />
              Diagrama de Orquestração Tri-Nuclear Bidirecional
            </CardTitle>
            <CardDescription className="text-xs text-primary/60 uppercase font-bold">
              Protocolo TSRA V5 — Event Bus Pub/Sub — Canais Bidirecionais Ativos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {/* GENESIS ORCHESTRATOR */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="px-8 py-4 border-2 border-primary bg-primary/10 flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Genesis Orchestrator</span>
                    <Cpu className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <span className="text-[8px] text-primary/70 uppercase font-bold">Medula Central · TSRA V5 · Novikov Protocol</span>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[8px] text-primary uppercase font-bold">Market Oracle</span>
                    <span className="text-[8px] text-primary/50">|</span>
                    <span className="text-[8px] text-primary uppercase font-bold">Soul Vault</span>
                    <span className="text-[8px] text-primary/50">|</span>
                    <span className="text-[8px] text-primary uppercase font-bold">Council</span>
                  </div>
                </div>
                {/* Setas para baixo */}
                <div className="flex justify-center mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-primary/50" />
                    <ChevronRight className="h-4 w-4 text-primary rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* EVENT BUS */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl px-6 py-3 border border-primary/30 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Nexus Event Bus</span>
                </div>
                <span className="text-[8px] text-primary/60 uppercase">Pub/Sub Bidirecional · Prioridade: CRITICAL → HIGH → NORMAL → LOW</span>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 text-primary animate-spin" />
                  <span className="text-[8px] text-primary uppercase font-bold">1s TSRA</span>
                </div>
              </div>
            </div>

            {/* OS TRÊS NÚCLEOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {nuclei.map((nucleus) => (
                <div
                  key={nucleus.id}
                  className={`border-2 ${
                    nucleus.id === 'NEXUS_IN' ? 'border-cyan-400 bg-cyan-400/5' :
                    nucleus.id === 'NEXUS_HUB' ? 'border-primary bg-primary/5' :
                    'border-emerald-400 bg-emerald-400/5'
                  } p-5 flex flex-col items-center gap-3 relative`}
                >
                  <div className={`absolute top-2 right-2 flex items-center gap-1`}>
                    <CheckCircle2 className={`h-3 w-3 ${
                      nucleus.id === 'NEXUS_IN' ? 'text-cyan-400' :
                      nucleus.id === 'NEXUS_HUB' ? 'text-primary' :
                      'text-emerald-400'
                    }`} />
                    <span className={`text-[7px] font-bold uppercase ${nucleus.color}`}>{nucleus.status}</span>
                  </div>
                  {nucleus.icon}
                  <div className="text-center">
                    <p className={`text-sm font-bold uppercase ${nucleus.color}`}>{nucleus.name}</p>
                    <p className="text-[9px] text-white/50 uppercase">{nucleus.role}</p>
                  </div>
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-[8px] uppercase font-bold">
                      <span className="text-white/50">Saúde</span>
                      <span className={nucleus.color}>{nucleus.health}%</span>
                    </div>
                    <Progress
                      value={nucleus.health}
                      className="h-1 bg-white/5 rounded-none"
                    />
                  </div>
                  <div className="text-[8px] text-white/40 uppercase font-bold">
                    {nucleus.events.toLocaleString()} eventos processados
                  </div>
                </div>
              ))}
            </div>

            {/* LEGENDA DE FLUXOS */}
            <div className="flex flex-wrap justify-center gap-4 text-[8px] uppercase font-bold">
              <div className="flex items-center gap-1">
                <div className="w-4 h-px bg-cyan-400" />
                <ArrowLeftRight className="h-3 w-3 text-cyan-400" />
                <span className="text-cyan-400">Social ↔ Gov</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-px bg-primary" />
                <ArrowLeftRight className="h-3 w-3 text-primary" />
                <span className="text-primary">Gov ↔ Finance</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-px bg-emerald-400" />
                <ArrowLeftRight className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Finance ↔ Social</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CANAIS BIDIRECIONAIS DETALHADOS */}
      <section className="relative z-10 space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
          <ArrowLeftRight className="h-5 w-5 text-primary" />
          Canais de Comunicação Bidirecional
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {bidirectionalPairs.map((pair) => (
            <Card
              key={pair.id}
              className={`glass border-none bg-black/40 rounded-none overflow-hidden cursor-pointer transition-all duration-300 ${
                activeChannel === pair.id ? 'border border-primary/40' : 'border border-white/5'
              }`}
              onClick={() => setActiveChannel(activeChannel === pair.id ? null : pair.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Núcleo Origem */}
                  <div className={`px-4 py-3 border ${pair.fromColor} flex items-center gap-2 min-w-[140px] justify-center`}>
                    <span className="text-xs font-bold text-white uppercase">{pair.from}</span>
                  </div>

                  {/* Fluxos Bidirecionais */}
                  <div className="flex-1 space-y-2">
                    <div className="text-[9px] text-white/30 uppercase font-bold text-center mb-2">{pair.label}</div>
                    {pair.flows.map((flow, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-black/40 border border-white/5">
                        <span className={`text-sm font-bold ${flow.color} min-w-[16px]`}>{flow.dir}</span>
                        <span className="text-[9px] text-white/60 uppercase">{flow.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Núcleo Destino */}
                  <div className={`px-4 py-3 border ${pair.toColor} flex items-center gap-2 min-w-[140px] justify-center`}>
                    <span className="text-xs font-bold text-white uppercase">{pair.to}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* MÉTRICAS DOS CANAIS */}
      <section className="relative z-10 space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          Métricas dos Canais em Tempo Real
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((ch) => (
            <div key={ch.id} className="p-4 bg-black/40 border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-bold text-white uppercase">{ch.from} → {ch.to}</p>
                  <p className="text-[7px] text-white/30 uppercase">{ch.id}</p>
                </div>
                <Badge className={`text-[7px] rounded-none ${
                  ch.health >= 95 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30' :
                  ch.health >= 80 ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30' :
                  'bg-red-500/20 text-red-400 border border-red-400/30'
                }`}>
                  {ch.health}% HEALTH
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[8px]">
                <div>
                  <p className="text-white/40 uppercase">Eventos</p>
                  <p className="text-white font-bold">{ch.events.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase">Latência</p>
                  <p className="text-white font-bold">{ch.latency}ms</p>
                </div>
              </div>
              <Progress value={ch.health} className="h-1 bg-white/5 rounded-none" />
            </div>
          ))}
        </div>
      </section>

      {/* PROTOCOLO TSRA V5 */}
      <section className="relative z-10">
        <Card className="glass border-none bg-black/40 rounded-none border-t-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl text-white uppercase tracking-tighter flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              Protocolo TSRA V5: Timed Synchronization and Response Algorithm
            </CardTitle>
            <CardDescription className="text-xs text-primary/60 uppercase font-bold">
              Janela de 1 Segundo · Prioridade Adaptativa · Princípio de Novikov
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-black/60 border border-primary/10 space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-2">
                  <Zap className="h-3 w-3" /> Ciclo de Sincronização
                </h4>
                <ul className="text-[9px] text-white/60 space-y-1 uppercase font-bold">
                  <li>1. Genesis emite SYNC_PULSE</li>
                  <li>2. Nexus-in responde com métricas sociais</li>
                  <li>3. Nexus-HUB responde com relatório de gov</li>
                  <li>4. Fundo Nexus responde com relatório financeiro</li>
                  <li>5. Genesis processa e emite diretivas</li>
                  <li>6. Núcleos executam e retornam feedback</li>
                </ul>
              </div>
              <div className="p-4 bg-black/60 border border-cyan-400/10 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-2">
                  <GitBranch className="h-3 w-3" /> Fluxos de Interação V5
                </h4>
                <ul className="text-[9px] text-white/60 space-y-1 uppercase font-bold">
                  <li>• Social Signal → Gov Decision → Capital Exec</li>
                  <li>• Arbitrage Detect → Gov Approval → Execution</li>
                  <li>• Startup Revenue → Liquidation → Distribution</li>
                  <li>• Campaign Launch → ROI Metrics → Reinvestment</li>
                  <li>• Oracle Insight → Strategy → Social Content</li>
                </ul>
              </div>
              <div className="p-4 bg-black/60 border border-emerald-400/10 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Garantias do Sistema
                </h4>
                <ul className="text-[9px] text-white/60 space-y-1 uppercase font-bold">
                  <li>• Consistência causal (Novikov)</li>
                  <li>• Entrega garantida de eventos CRITICAL</li>
                  <li>• Rastreabilidade via correlationId</li>
                  <li>• Distribuição 80/10/10 automática</li>
                  <li>• Soul Vault para memória institucional</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Homeostase Digital', value: 'ESTABILIZADA L5', icon: <Cpu className="h-5 w-5 text-primary" />, color: 'border-primary/20 bg-primary/5' },
                { label: 'Soberania Evolutiva', value: '100% AUTÔNOMO', icon: <Infinity className="h-5 w-5 text-cyan-400" />, color: 'border-cyan-400/20 bg-cyan-400/5' },
                { label: 'Novikov Stability', value: '99.98% REAL', icon: <Globe className="h-5 w-5 text-emerald-400" />, color: 'border-emerald-400/20 bg-emerald-400/5' },
                { label: 'Senciência', value: `${sentienceLevel.toFixed(0)}%`, icon: <Activity className="h-5 w-5 text-amber-400" />, color: 'border-amber-400/20 bg-amber-400/5' },
              ].map((item, i) => (
                <div key={i} className={`p-4 border ${item.color} flex items-center gap-3`}>
                  {item.icon}
                  <div>
                    <p className="text-[8px] font-bold text-white uppercase">{item.label}</p>
                    <p className="text-[7px] text-white/50 uppercase font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* MÓDULOS DE ORQUESTRAÇÃO */}
      <section className="relative z-10 space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          Módulos de Orquestração Implementados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Event Bus (Pub/Sub)',
              file: 'src/services/orchestration/event-bus.ts',
              description: 'Barramento de eventos central com suporte a pub/sub bidirecional, priorização de mensagens e rastreabilidade via correlationId.',
              status: 'ACTIVE',
              color: 'border-primary',
            },
            {
              title: 'Nexus-in Core',
              file: 'src/services/orchestration/nexus-in-core.ts',
              description: 'Núcleo social que processa sinais virais, executa campanhas e retorna métricas de engajamento para o HUB e Fundo.',
              status: 'ACTIVE',
              color: 'border-cyan-400',
            },
            {
              title: 'Nexus-HUB Core',
              file: 'src/services/orchestration/nexus-hub-core.ts',
              description: 'Núcleo de governança que processa sinais sociais, emite diretivas de investimento e coordena o Conselho dos Arquitetos.',
              status: 'ACTIVE',
              color: 'border-primary',
            },
            {
              title: 'Fundo Nexus Core',
              file: 'src/services/orchestration/fundo-nexus-core.ts',
              description: 'Núcleo financeiro que executa liquidações, distribui lucros via regra 80/10/10 e detecta oportunidades de arbitragem.',
              status: 'ACTIVE',
              color: 'border-emerald-400',
            },
            {
              title: 'Genesis Orchestrator',
              file: 'src/services/orchestration/genesis-orchestrator.ts',
              description: 'Medula central que coordena todos os núcleos, emite pulsos TSRA e mantém a homeostase digital do ecossistema.',
              status: 'ACTIVE',
              color: 'border-amber-400',
            },
            {
              title: 'AI Flows de Orquestração',
              file: 'src/ai/flows/orchestration/',
              description: 'Flows de IA especializados: Tri-Nuclear Orchestration, Bidirectional Channel Analysis e Digital Homeostasis.',
              status: 'ACTIVE',
              color: 'border-purple-400',
            },
          ].map((mod, i) => (
            <div key={i} className={`p-4 bg-black/40 border-l-4 ${mod.color} border-t border-r border-b border-white/5 space-y-2`}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-white uppercase">{mod.title}</p>
                <Badge className="text-[7px] rounded-none bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  {mod.status}
                </Badge>
              </div>
              <p className="text-[8px] text-primary/60 font-mono">{mod.file}</p>
              <p className="text-[9px] text-white/50 leading-relaxed">{mod.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
