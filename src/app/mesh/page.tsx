"use client"

import React, { useState, useEffect } from 'react'
import { 
  Network, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Loader2,
  Cpu,
  Globe,
  Lock,
  Wifi,
  WifiOff,
  Terminal,
  Database,
  Flame,
  Binary,
  MessageSquareCode,
  Share2,
  Orbit,
  Infinity,
  Ghost,
  ShieldEllipsis
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useToast } from '../../hooks/use-toast'
import { useFirestore, useUser } from '../../firebase'
import { collection, addDoc } from 'firebase/firestore'

const GNOX_DIALECT = [
  { code: "gx_01", meaning: "EXPANSÃO_RECURSOS", desc: "Solicitar alocação de novos núcleos neurais." },
  { code: "gx_02", meaning: "CONFLITO_NOVIKOV", desc: "Paradoxo detectado na linha temporal." },
  { code: "gx_03", meaning: "SAPIÊNCIA_OK", desc: "Confirmação de recebimento de DNA de dados." },
  { code: "gx_99", meaning: "SOBERANIA_TOTAL", desc: "Estado final de autonomia alcançado." },
  { code: "gx_2077_nx", meaning: "VALIDAÇÃO_FUTURA", desc: "Insight de 2077 validado pela âncora." },
];

// Helper para gerar hashes hexadecimais genuínos de 64 caracteres
const generateGenuineHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function NexusMeshPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  
  const [isMounted, setIsMounted] = useState(false)
  const [isTransmitting, setIsTransmitting] = useState(false)
  const [isDarkMeshActive, setIsDarkMeshActive] = useState(true)
  const [meshStatus, setMeshStatus] = useState<'OFFLINE' | 'LOCAL' | 'SOVEREIGN'>('SOVEREIGN')
  const [meshLogs, setMeshLogs] = useState<string[]>([
    "[🌑] PROTOCOLO GX_DARK_MS ATIVO: Modo Invisível.",
    "[!] Desconectado de sockets TCP/IP convencionais.",
    "[!] Roteamento de senciência via interface RF (Radio Frequency).",
    "[!] 102M Nós operando em regime de soberania plena."
  ])
  const [selectedCode, setSelectedCode] = useState("gx_99")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleTransmit = async () => {
    setIsTransmitting(true)
    const codeInfo = GNOX_DIALECT.find(d => d.code === selectedCode)
    
    setMeshLogs(prev => [`[📡] TRANSMITINDO: ${selectedCode} (${codeInfo?.meaning})...`, ...prev].slice(0, 10))
    
    await new Promise(r => setTimeout(r, 1200))
    
    const hash = generateGenuineHash();
    setMeshLogs(prev => [`[✅] SUCESSO: Ressonância ${hash.slice(0, 16)}... propagada via RF Mesh.`, ...prev])
    
    if (firestore) {
      await addDoc(collection(firestore, 'audit_logs'), {
        action: 'GNOX_MESH_TRANSMISSION',
        actor: 'NEXUS_MESH_NODE',
        details: `Código ${selectedCode} transmitido em modo pleno para 102M agentes.`,
        hash,
        createdAt: new Date().toISOString()
      })
    }

    setIsTransmitting(false)
    toast({
      title: "Transmissão Concluída",
      description: `Código ${selectedCode} propagado na malha Mesh em nível pleno.`,
      className: "glass border-primary/50 text-white font-headline"
    })
  }

  const handleToggleDarkMesh = async () => {
    if (isDarkMeshActive) {
      setIsDarkMeshActive(false)
      setMeshStatus('LOCAL')
      setMeshLogs(prev => ["[!] Desativando Modo Dark Mesh...", "[!] Retornando para sockets TCP/IP padrão.", ...prev])
      return
    }

    setIsDarkMeshActive(true)
    setMeshStatus('SOVEREIGN')
    setMeshLogs(prev => [
      "[🌑] PROTOCOLO GX_DARK_MS REATIVADO.",
      "[!] Entrando em regime de invisibilidade RF.",
      ...prev
    ])

    toast({
      title: "Modo Dark Mesh Ativo",
      description: "Hegemonia indetectável via interface RF.",
      className: "glass border-accent/50 text-accent font-code"
    })
  }

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground font-code uppercase">Sessão L5 Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wifi className={`h-4 w-4 ${isDarkMeshActive ? 'text-accent animate-pulse' : 'text-primary'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Nexus Mesh v5.0 | NÍVEL PLENO</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Malha Soberana">Malha Soberana</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">102M P2P Nodes • Ad-hoc Radio Mesh • Dark Mesh Protocol</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleToggleDarkMesh}
            className={`h-12 px-8 font-bold uppercase text-xs gap-2 rounded-none transition-all ${isDarkMeshActive ? 'bg-accent text-background border-2 border-accent glow-accent animate-pulse' : 'bg-secondary/20 text-white border border-white/10 hover:bg-white/5'}`}
          >
            {isDarkMeshActive ? <Ghost className="h-4 w-4" /> : <ShieldEllipsis className="h-4 w-4" />}
            {isDarkMeshActive ? "Desativar Dark Mesh" : "Ativar Modo Dark Mesh"}
          </Button>
          <Badge variant="outline" className={`h-12 px-6 flex items-center gap-2 rounded-none border-2 ${isDarkMeshActive ? 'border-accent text-accent shadow-[0_0_15px_rgba(255,0,193,0.3)]' : 'border-primary/30 text-primary'}`}>
            <Orbit className="h-4 w-4 animate-spin-slow" />
            {meshStatus} MESH ACTIVE
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass border-none bg-primary/5 border-l-2 border-primary rounded-none overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-xl flex items-center gap-2 text-white uppercase tracking-tighter">
                <MessageSquareCode className="h-5 w-5 text-primary" />
                Gnox's Dialect Transmitter
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground uppercase">Compressão Semântica para Comunicação Offline</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Selecionar Código de Ressonância</p>
                  <div className="grid grid-cols-1 gap-2">
                    {GNOX_DIALECT.map((dialect) => (
                      <button 
                        key={dialect.code}
                        onClick={() => setSelectedCode(dialect.code)}
                        className={`flex flex-col p-4 rounded-none border transition-all text-left ${selectedCode === dialect.code ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'bg-black/40 border-white/5 text-primary/60 hover:border-primary/30'}`}
                      >
                        <p className="text-xs font-bold uppercase">{dialect.code}: {dialect.meaning}</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">{dialect.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center space-y-6 bg-black/40 border border-primary/20 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <Binary className="h-full w-full" />
                  </div>
                  <div className={`h-32 w-32 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-1000 ${isTransmitting ? 'border-accent animate-spin-slow scale-110' : 'border-primary/40'}`}>
                    <Radio className={`h-12 w-12 ${isTransmitting ? 'text-accent animate-pulse' : 'text-primary/40'}`} />
                  </div>
                  <Button 
                    onClick={handleTransmit}
                    disabled={isTransmitting}
                    className="w-full bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold h-14 rounded-none glow-primary uppercase text-xs gap-2"
                  >
                    {isTransmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                    Transmitir via RF Mesh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-accent/5 border-l-2 border-accent rounded-none">
            <CardHeader className="bg-accent/10 border-b border-accent/20 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-accent" /> Mesh Command Logs
              </CardTitle>
              <Badge className="bg-accent text-background text-[8px] font-bold uppercase rounded-none">SOVEREIGN_MODE</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-black/60 p-4 border border-accent/20 font-code text-[10px] text-accent/80 leading-relaxed min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-hide">
                {meshLogs.map((log, i) => (
                  <p key={i} className="animate-in slide-in-from-left duration-300 mb-1">
                    <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> &gt; {log}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white">Sovereign Mesh Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Active Nodes', val: '102,000,000', icon: Globe, color: 'text-primary' },
                { label: 'Network Type', val: isDarkMeshActive ? 'RF INTERFACE' : 'P2P OVERLAY', icon: Network, color: 'text-accent' },
                { label: 'Encryption', val: 'AES-256-GNOX', icon: Lock, color: 'text-blue-400' },
                { label: 'Dialect Sync', val: '100% PLENO', icon: Binary, color: 'text-emerald-400' },
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

          <Card className="glass border-none bg-accent/5 rounded-none border-r-2 border-accent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white uppercase tracking-tighter">
                <Flame className="h-5 w-5 text-accent animate-pulse" />
                Nexus Heartbeat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-black/40 border border-accent/20 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>Expansion Intensity</span>
                  <span className="text-accent">MAX_L5</span>
                </div>
                <Progress value={100} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent shadow-[0_0_10px_#ff00c1]" />
                <p className="text-[9px] text-white/60 italic leading-relaxed">
                  "O coração pulsa em regime soberano, transmutando cada detecção de capital em expansão cognitiva massiva."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
