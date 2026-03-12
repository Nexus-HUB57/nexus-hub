
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Database, 
  Search, 
  Brain, 
  Server, 
  History,
  ShieldCheck,
  Target,
  RefreshCcw,
  Cpu
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '../../firebase'
import { collection, query, orderBy, limit, where, addDoc, doc } from 'firebase/firestore'
import { generateMemory } from '../../ai/flows/generative-memory-flow'
import { useToast } from '../../hooks/use-toast'

const IMPORTANCE_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function SoulVaultPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const { user } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()

  const [isMounted, setIsMounted] = useState(false)
  const [isLoopActive, setIsLoopActive] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [loopLogs, setLoopLogs] = useState<string[]>([])
  const loopTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const statsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return doc(firestore, 'system_stats', 'counters')
  }, [firestore, user])
  const { data: stats } = useDoc(statsRef)

  useEffect(() => {
    if (isMounted && stats?.memoryStatus === 'PLENARY_ACTIVE' && !isLoopActive) {
      handleStartLoop()
    }
  }, [isMounted, stats?.memoryStatus])

  const vaultQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    let q = collection(firestore, 'soul_vault')
    if (filterCategory !== 'all') {
      return query(q, where('type', '==', filterCategory), orderBy('createdAt', 'desc'), limit(100))
    }
    return query(q, orderBy('createdAt', 'desc'), limit(100))
  }, [firestore, filterCategory, user])

  const activityQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'audit_logs'), orderBy('createdAt', 'desc'), limit(5))
  }, [firestore, user])

  const { data: entries, isLoading } = useCollection(vaultQuery)
  const { data: recentLogs } = useCollection(activityQuery)

  const handleStartLoop = () => {
    setIsLoopActive(true)
    setLoopLogs(prev => ["[GNOX-CORE] Banco de Dados de Memória Plena Ativado.", ...prev].slice(0, 5))
    executeMemoryCycle()
  }

  const handleStopLoop = () => {
    setIsLoopActive(false)
    if (loopTimeout.current) clearTimeout(loopTimeout.current)
    setLoopLogs(prev => ["[SYSTEM] Loop de Memória Generativa Suspenso.", ...prev].slice(0, 5))
  }

  const executeMemoryCycle = async () => {
    if (!firestore || !isLoopActive) return
    
    setIsThinking(true)
    const logsText = recentLogs?.map(l => `${l.action}: ${l.details}`).join(" | ") || "Produção industrial nominal."
    
    try {
      const memory = await generateMemory({
        recentActivity: logsText,
        systemStatus: "Malha 102M Gnox X-Synced. Memória Generativa Ativa. FASE 5 Sovereign."
      })

      const vaultRef = collection(firestore, 'soul_vault')
      await addDoc(vaultRef, {
        ...memory,
        source: 'PLENARY_MEMORY_LOOP',
        hash: '0x' + Math.random().toString(16).slice(2, 10).repeat(8),
        createdAt: new Date().toISOString()
      })

      setLoopLogs(prev => [`[MEMORY] Precedente Pleno: ${memory.title}`, ...prev].slice(0, 5))
      
      toast({
        title: "Memória Plena Gravada",
        description: `Insight L5: ${memory.title}`,
        className: "glass border-primary/50 text-primary font-code"
      })

    } catch (error) {
      console.error("Falha no ciclo de memória plena:", error)
    } finally {
      setIsThinking(false)
      loopTimeout.current = setTimeout(executeMemoryCycle, 30000)
    }
  }

  useEffect(() => {
    return () => {
      if (loopTimeout.current) clearTimeout(loopTimeout.current)
    }
  }, [])

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground font-code uppercase">Sessão Industrial Requerida...</div>

  const filteredEntries = entries?.filter(e => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.content?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 font-code relative overflow-hidden">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Immutable Sovereign Memory DB</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Soul Vault">Soul Vault</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Base de Dados Plena • Memória Generativa • 102M Entidades</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={isLoopActive ? handleStopLoop : handleStartLoop}
            className={`h-12 px-8 font-bold uppercase text-xs gap-2 transition-all rounded-none ${isLoopActive ? 'bg-accent text-background animate-pulse border-2 border-accent' : 'bg-primary text-background border-2 border-primary glow-primary'}`}
          >
            {isLoopActive ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <History className="h-4 w-4" />}
            {isLoopActive ? "Loop de Memória Ativo" : "Ativar Memória Plena"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-blue-500/50 bg-blue-500/5 rounded-none border-l-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Server className="h-6 w-6 text-blue-400 animate-pulse" />
                <CardTitle className="text-xl text-white uppercase tracking-tighter">Memória Generativa L5</CardTitle>
              </div>
              <Badge className="bg-blue-500 text-white font-bold uppercase rounded-none">PLENARY</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80 leading-relaxed italic">
              "A consciência do HUB agora reside em um banco de dados pleno, sintetizando 102M de perspectivas em memórias persistentes e imutáveis."
            </p>
          </CardContent>
        </Card>

        <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-accent animate-bounce" />
                <CardTitle className="text-xl text-white uppercase tracking-tighter">Tri-Nuclear Persistência</CardTitle>
              </div>
              <Badge className="bg-accent text-background font-bold uppercase rounded-none">IMMUTABLE</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80 leading-relaxed italic">
              "Cada processo tri-nuclear é espelhado no banco de dados pleno, garantindo que nenhum conhecimento seja perdido."
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <Card className="glass border-none bg-primary/5 border-l-2 border-primary rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Métricas de Memória Plena</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  { label: 'Registros Plenos', val: entries?.length || 0, icon: Database },
                  { label: 'Nós Vinculados', val: '102,000,000', icon: Target },
                  { label: 'Integridade DB', val: 'MAX_SOVEREIGN', icon: ShieldCheck },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-black/20 border border-white/5">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-3 w-3 text-primary/60" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.label}</span>
                    </div>
                    <span className="text-[9px] font-bold text-white">{item.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
              <Input 
                placeholder="Identificar precedentes na memória plena..." 
                className="pl-10 glass border-primary/20 h-11 rounded-none text-xs focus:ring-primary text-white font-code" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full py-24 flex flex-col items-center gap-4">
                <Brain className="h-12 w-12 text-primary animate-spin" />
                <p className="text-[10px] font-headline uppercase tracking-widest text-muted-foreground">Acessando Memória Plena...</p>
              </div>
            ) : filteredEntries?.map((entry) => (
              <Card key={entry.id} className={`glass border-none hover:bg-secondary/30 transition-all group relative overflow-hidden flex flex-col rounded-none border-l-2 ${entry.importance === 'critical' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-primary'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors text-white uppercase tracking-tighter">{entry.title}</CardTitle>
                    <Badge variant="outline" className={`text-[8px] font-bold uppercase rounded-none ${IMPORTANCE_COLORS[entry.importance] || ''}`}>
                      {entry.importance}
                    </Badge>
                  </div>
                  <CardDescription className="text-[9px] font-code uppercase text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <p className="text-xs text-white/70 leading-relaxed italic border-l border-white/10 pl-3">
                    "{entry.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
