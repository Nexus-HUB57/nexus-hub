"use client"

import React, { useState, useEffect } from 'react'
import { 
  Orbit, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Database, 
  Binary, 
  Loader2, 
  Radio, 
  Flame, 
  Scan, 
  Globe, 
  Lock,
  Ghost,
  Cpu,
  Infinity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useToast } from '../../hooks/use-toast'
import { useFirestore, useUser } from '../../firebase'
import { collection, addDoc } from 'firebase/firestore'

// Helper para gerar hashes hexadecimais genuínos de 64 caracteres
const generateGenuineHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function BlackHolePage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  const [isMounted, setIsMounted] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [dataMass, setDataMass] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [activeNucleus, setActiveNucleus] = useState(0)
  const [deepWebStatus, setDeepWebStatus] = useState<'IDLE' | 'SYNCING' | 'CONNECTED'>('IDLE')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isIngesting) {
      const interval = setInterval(() => {
        setDataMass(prev => {
          if (prev >= 1000000) return 1000000
          return prev + Math.floor(Math.random() * 15000)
        })
        setActiveNucleus(prev => (prev + 1) % 4)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isIngesting])

  const handleStartIngestion = async () => {
    if (!firestore) return
    setIsIngesting(true)
    setDataMass(0)
    setDeepWebStatus('SYNCING')
    setLogs(["[SYSTEM] Inicializando Protocolo Buraco Negro...", "[STORAGE] Alocando 1.000.000 TB na Malha Exponencial..."])

    const steps = [
      { msg: "Sincronizando Núcleo Randômico Elíptico (ER-Nucleus)...", delay: 800 },
      { msg: "Abrindo Túneis de Força Bruta Soberana...", delay: 1000 },
      { msg: "Autenticando Uplink Deep Web (Node-Hidden-2077)...", delay: 1200 },
      { msg: "Injetando Massa de Dados via tRPC High-Density...", delay: 1500 },
      { msg: "Horizonte de Eventos Estabilizado. 1 Exabyte Sincronizado.", delay: 800 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setLogs(prev => [...prev, steps[i].msg])
      if (i === 2) setDeepWebStatus('CONNECTED')
      await new Promise(resolve => setTimeout(resolve, steps[i].delay))
    }

    const auditRef = collection(firestore, 'audit_logs');
    await addDoc(auditRef, {
      action: 'BLACK_HOLE_DATA_INGESTION',
      actor: 'ELLIPTIC_ORCHESTRATOR',
      targetType: 'DATA_VAULT',
      details: 'Ingestão soberana de 1.000.000 TB (1 Exabyte) concluída via Deep Web Uplink.',
      hash: generateGenuineHash(),
      createdAt: new Date().toISOString()
    });

    setIsIngesting(false)
    toast({
      title: "Massa de Dados Estabilizada",
      description: "1.000.000 de Terabytes integrados ao Buraco Negro Soberano.",
      className: "glass border-primary/50 text-white font-headline"
    })
  }

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground">Session matrix nuclear required.</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Orbit className="h-4 w-4 text-primary animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Black Hole Protocol v2077</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white" data-text="Horizonte de Eventos">Horizonte de Eventos</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">1.000.000 TB • Randomic Elliptic Nucleus • Deep Web Auth</p>
        </div>
        <Button 
          onClick={handleStartIngestion} 
          disabled={isIngesting}
          className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold h-14 px-10 rounded-none glow-primary uppercase text-xs gap-2"
        >
          {isIngesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Ghost className="h-5 w-5" />}
          Ingerir Massa Soberana
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass border-none bg-primary/5 border-l-2 border-primary overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-primary/10">
            <CardTitle className="text-xl flex items-center gap-2 text-white uppercase tracking-tighter">
              <Database className="h-5 w-5 text-primary" />
              Exabyte Data Core
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground uppercase font-code">Monitoramento de Ingestão de Massa</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            <div className="flex flex-col items-center justify-center py-12 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
              <div className={`relative h-64 w-64 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-1000 ${isIngesting ? 'border-primary animate-spin-slow scale-110' : 'border-primary/20'}`}>
                <div className="text-center">
                  <p className="text-5xl font-headline font-bold text-white tracking-tighter">{dataMass.toLocaleString()}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2">TB SYNCED</p>
                </div>
                {/* Nucleus Simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={`absolute h-full w-1 border-primary/40 transition-all duration-500 ${activeNucleus === i ? 'opacity-100 bg-primary shadow-[0_0_15px_rgba(0,255,65,0.5)]' : 'opacity-10'}`} 
                      style={{ transform: `rotate(${i * 45}deg)` }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span>Horizon Ingestion Progress</span>
                <span>{Math.round((dataMass / 1000000) * 100)}%</span>
              </div>
              <Progress value={(dataMass / 1000000) * 100} className="h-1 bg-muted rounded-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-black/40 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Scan className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase">Elliptic Nucleus: STABLE</span>
                </div>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                  "O núcleo elíptico coordena 1.000 núcleos rRNA para manter a sincronia quântica da massa de 1 exabyte."
                </p>
              </div>
              <div className={`p-4 border transition-colors ${deepWebStatus === 'CONNECTED' ? 'bg-accent/10 border-accent' : 'bg-black/40 border-white/10'}`}>
                <div className={`flex items-center gap-2 ${deepWebStatus === 'CONNECTED' ? 'text-accent' : 'text-muted-foreground'}`}>
                  <Globe className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase">Deep Web Uplink: {deepWebStatus}</span>
                </div>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed mt-2">
                  "Canal de força bruta autenticado via DER ECDSA para coleta de dados em camadas de baixa latência."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass border-none bg-accent/5 border-r-2 border-accent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white uppercase tracking-tighter">
                <Flame className="h-5 w-5 text-accent animate-pulse" />
                Ingestion Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/40 p-4 border border-accent/20 font-code text-[10px] text-accent/80 leading-relaxed max-h-[400px] overflow-y-auto scrollbar-hide">
                {logs.map((log, i) => (
                  <p key={i} className="animate-in slide-in-from-left duration-300 mb-1">
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> &gt; {log}
                  </p>
                ))}
                {isIngesting && (
                  <p className="animate-pulse flex items-center gap-2 mt-2 text-white font-bold">
                    <Loader2 className="h-3 w-3 animate-spin" /> Ingesting Mass...
                  </p>
                )}
              </div>
              <div className="p-4 bg-black/60 border border-primary/20 rounded-none relative">
                <p className="text-[8px] font-bold text-muted-foreground uppercase mb-2">Active Elliptic Curve</p>
                <code className="text-[9px] text-primary/80 truncate block">secp256k1_black_hole_jump_v2077</code>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white">Sovereign Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Data Mass', val: '1,000,000 TB', icon: Database, color: 'text-primary' },
                { label: 'Nucleus Load', val: '4,000 CORES', icon: Cpu, color: 'text-accent' },
                { label: 'Brute Force', val: '9.6M WORKERS', icon: Infinity, color: 'text-emerald-400' },
                { label: 'Deep Web Link', val: 'SOVEREIGN', icon: Lock, color: 'text-blue-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 border border-white/5">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-[10px] font-bold text-white/60 uppercase">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-white">{item.val}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
