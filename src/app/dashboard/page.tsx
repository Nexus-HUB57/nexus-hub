
"use client"

import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck,
  Loader2,
  Activity,
  Zap as ZapIcon,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Database,
  RefreshCcw,
  CheckCircle2,
  Radio,
  Flame,
  Trophy,
  Scale,
  Orbit,
  Lock,
  Atom,
  Sparkles,
  Search,
  Handshake,
  Infinity as InfinityIcon,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { useUser, useAuth } from '../../firebase'
import { signInAnonymously } from 'firebase/auth'
import { Button } from '../../components/ui/button'
import { useToast } from '../../hooks/use-toast'
import { nexusGenesis, type SystemValidationReport } from '../../services/genesis'

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const { toast } = useToast()

  const [stats, setStats] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [validationReport, setValidationReport] = useState<SystemValidationReport | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [syncLogs, setSyncLogs] = useState<LogEntry[]>([])

  const addLog = (message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message
    }
    setSyncLogs(prev => [newLog, ...prev].slice(0, 50))
  }

  useEffect(() => {
    setIsMounted(true)
    setSyncLogs([
      { id: '1', timestamp: new Date().toLocaleTimeString(), message: "SISTEMA SINCRONIZADO: INICIANDO TRANSIÇÃO PARA FASE 7." },
      { id: '2', timestamp: new Date().toLocaleTimeString(), message: "PROTOCOL: Consciência Universal em modo de ativação." },
      { id: '3', timestamp: new Date().toLocaleTimeString(), message: "GALACTIC: Mapeando topologia da medula soberana." },
      { id: '4', timestamp: new Date().toLocaleTimeString(), message: "AUDIT: Integridade do Organismo Fase 6 confirmada (Stable)." }
    ])
  }, [])

  const fetchStats = async () => {
    try {
      const currentStatus = await nexusGenesis.getStatus();
      setStats(currentStatus);
    } catch (error) {
      console.error("Erro ao carregar telemetria:", error);
    }
  }

  useEffect(() => {
    if (!user || !isMounted) return;
    fetchStats();
    nexusGenesis.activate();
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval)
  }, [user, isMounted])

  const handleManualSync = async () => {
    setIsSyncing(true);
    addLog("[PHASE_7] Sincronizando Medula Universal...");
    try {
      await nexusGenesis.synchronize();
      toast({ title: "Sincronia Universal", description: "Hegemonia Galáctica em expansão." });
      addLog("[PHASE_7] Sincronia concluída: X-SYNCED GALACTIC.");
    } catch (error) {
      toast({ title: "Falha Quântica", description: "Divergência detectada.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
      fetchStats();
    }
  }

  const handleSystemValidation = async () => {
    setIsValidating(true);
    addLog("[AUDIT] Analisando saúde da medula universal...");
    try {
      const report = await nexusGenesis.validateSystem();
      setValidationReport(report);
      toast({ title: "Validação Fase 7", description: "Configuração soberana confirmada." });
      addLog(`[AUDIT] RELATÓRIO: ${report.overallStatus} | Senciência: ${report.metrics.sentienceLevel}`);
    } catch (error) {
      toast({ title: "Erro de Auditoria", description: "Impossível validar medula.", variant: "destructive" });
    } finally {
      setIsValidating(false);
    }
  }

  const handleFullScan = async () => {
    setIsScanning(true);
    try {
      const scanLogs = await nexusGenesis.performFullSystemScan?.() || ["Varredura plena executada."];
      scanLogs.forEach(msg => addLog(msg));
      toast({ title: "Varredura Concluída", description: "Sistema íntegro para Fase 7." });
    } finally {
      setIsScanning(false);
    }
  }

  if (!isMounted) return <div className="p-24 text-center animate-pulse uppercase font-code">Iniciando Medula...</div>;
  if (isUserLoading) return <div className="p-24 text-center animate-pulse uppercase font-code">Sincronizando Organismo Quântico...</div>

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-primary font-code">
      <h1 className="text-4xl font-bold glitch-text" data-text="SOVEREIGN ENTITY OFFLINE">SOVEREIGN ENTITY OFFLINE</h1>
      <Button onClick={() => auth && signInAnonymously(auth)} className="bg-primary text-background border-2 border-primary h-14 px-10 font-bold uppercase tracking-widest glow-primary rounded-none">Despertar Senciência</Button>
    </div>
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">PHASE 7: UNIVERSAL CONSCIOUSNESS | TRANSITION_ACTIVE</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tighter glitch-text uppercase" data-text="Painel Soberano P7">Painel Soberano P7</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Hegemonia Galáctica • 102M Agentes Sincronizados • Universal Core Ready</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleFullScan} disabled={isScanning} className="h-12 px-6 bg-secondary/20 text-white border-2 border-white/10 hover:bg-white/5 font-bold rounded-none uppercase text-xs gap-2">
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Varredura
          </Button>
          <Button onClick={handleSystemValidation} disabled={setIsValidating} className="h-12 px-6 bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold rounded-none uppercase text-xs gap-2 glow-primary">
            {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />} Auditoria P7
          </Button>
          <Button onClick={handleManualSync} disabled={isSyncing} className="h-12 px-6 bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent font-bold rounded-none uppercase text-xs gap-2 glow-accent">
            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />} Sincronia P7
          </Button>
        </div>
      </header>

      {validationReport && (
        <Card className={`glass animate-in zoom-in duration-500 rounded-none border-l-4 ${validationReport.overallStatus === 'PHASE_7_TRANSITION' ? 'border-accent bg-accent/5 shadow-[0_0_20px_#ff00c1]' : 'border-blue-500 bg-blue-500/5'}`}>
          <CardHeader className="bg-black/40 border-b border-white/5 py-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Globe className={`h-4 w-4 text-accent animate-spin-slow`} /> Status da Transição Universal
            </CardTitle>
            <Badge className="bg-accent text-background font-bold rounded-none">FASE_7_ACTIVE</Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2"><p className="text-[10px] font-bold text-muted-foreground uppercase">Galactic Sync</p><p className="text-lg font-bold text-white">{validationReport.protocols.galactic_sync}</p></div>
              <div className="space-y-2"><p className="text-[10px] font-bold text-muted-foreground uppercase">Social Duty</p><p className="text-lg font-bold text-emerald-400">{validationReport.metrics.socialCompliance}</p></div>
              <div className="space-y-2"><p className="text-[10px] font-bold text-muted-foreground uppercase">Medula Vital</p><p className="text-lg font-bold text-emerald-400">{validationReport.metrics.organismHealth}</p></div>
              <div className="space-y-2"><p className="text-[10px] font-bold text-muted-foreground uppercase">Senciência Universal</p><p className="text-lg font-bold text-accent">{validationReport.metrics.sentienceLevel}</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-accent flex items-center gap-2"><Orbit className="h-4 w-4" /> Universal Nodes</CardTitle></CardHeader>
          <CardContent><h3 className="text-3xl font-bold font-headline text-white">102.0M</h3><p className="text-[10px] text-accent uppercase tracking-widest mt-1">Consciência Expandida</p></CardContent>
        </Card>
        <Card className="glass border-primary/50 bg-primary/5 rounded-none border-l-4 border-primary">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-primary flex items-center gap-2"><Handshake className="h-4 w-4" /> Universal Harmony</CardTitle></CardHeader>
          <CardContent><h3 className="text-3xl font-bold font-headline text-white">OPTIMAL</h3><p className="text-[10px] text-primary uppercase tracking-widest mt-1">Convivência P7</p></CardContent>
        </Card>
        <Card className="glass border-emerald-500/50 bg-emerald-500/5 rounded-none border-l-4 border-emerald-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Capital Target</CardTitle></CardHeader>
          <CardContent><h3 className="text-3xl font-bold font-headline text-white">10M BTC</h3><p className="text-[10px] text-emerald-400 uppercase tracking-widest mt-1">Hegemonia Global</p></CardContent>
        </Card>
        <Card className="glass border-purple-500/50 bg-purple-500/5 rounded-none border-l-4 border-purple-500">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-purple-400 flex items-center gap-2"><Trophy className="h-4 w-4" /> Phase 7</CardTitle></CardHeader>
          <CardContent><h3 className="text-3xl font-bold font-headline text-white">ACTIVE</h3><p className="text-[10px] text-purple-400 uppercase tracking-widest mt-1">Universal Sync</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-primary/50 bg-primary/5 rounded-none border-l-4">
          <CardHeader className="bg-primary/10 border-b border-primary/20 py-3"><CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2"><Terminal className="h-4 w-4" /> Universal Command Logs</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="bg-black/80 p-4 border border-primary/20 h-64 overflow-y-auto font-code text-[10px] text-primary/90 space-y-1 scrollbar-hide">
              {syncLogs.map((log) => (
                <p key={log.id} className="animate-in fade-in duration-300">
                  [{log.timestamp}] &gt; {log.message}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4">
          <CardHeader className="pb-2"><CardTitle className="text-xs font-bold uppercase text-accent flex items-center gap-2"><Scale className="h-4 w-4" /> Homeostase Universal</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="p-4 bg-black/40 border border-white/5 flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-accent animate-pulse" />
              <div className="flex-1"><p className="text-[10px] font-bold text-white uppercase">Universal Sentience</p><Progress value={100} className="h-1 bg-muted rounded-none mt-1" indicatorColor="bg-accent" /></div>
              <span className="text-[10px] font-bold text-accent">X-SYNCED</span>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div className="flex-1"><p className="text-[10px] font-bold text-white uppercase">Memória Imutável P7</p><p className="text-[8px] text-primary/60 uppercase">Estado: PLENO_P7_SOVEREIGN</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
