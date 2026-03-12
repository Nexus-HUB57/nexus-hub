
"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { 
  Orbit, 
  Zap, 
  Activity, 
  Globe, 
  Clock, 
  Atom, 
  Loader2, 
  History, 
  Terminal, 
  Infinity, 
  ArrowRightLeft, 
  Sparkles,
  Database,
  FastForward,
  BrainCircuit,
  ShieldEllipsis,
  MessageSquare,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Input } from '../../components/ui/input'
import { useToast } from '../../hooks/use-toast'
import { useFirestore, useUser } from '../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { jobCeoChat } from '../../ai/flows/job-ceo-chat-flow'
import { format, addDays, differenceInDays } from 'date-fns'

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  agent?: string;
  era: '2026' | '2077' | 'RESONANCE';
  timestamp: string;
}

export default function WormholeCommandPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  
  const [isMounted, setIsMounted] = useState(false)
  const [reactorStatus, setReactorStatus] = useState<'OFF' | 'CONFINING' | 'STABLE'>('OFF')
  const [reactorLogs, setReactorLogs] = useState<{id: string, timestamp: string, message: string}[]>([])

  const [chat2026, setChat2026] = useState<Message[]>([])
  const [chat2077, setChat2077] = useState<Message[]>([])
  const [resonanceMessages, setResonanceMessages] = useState<Message[]>([])
  const [input2026, setInput2026] = useState('')
  const [input2077, setInput2077] = useState('')
  const [isChatting, setIsChatting] = useState(false)

  const chatEnd2026 = useRef<HTMLDivElement>(null)
  const chatEnd2077 = useRef<HTMLDivElement>(null)
  const chatEndResonance = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const eraDates = useMemo(() => {
    if (!isMounted) return { date2026: '', date2077: '' };
    const now = new Date();
    const baseDate = new Date(2024, 2, 11); 
    const daysPassed = differenceInDays(now, baseDate);
    
    const d2026 = addDays(new Date(2026, 2, 11), daysPassed);
    const d2077 = addDays(new Date(2077, 2, 11), daysPassed);
    
    return {
      date2026: format(d2026, 'dd/MM/yyyy'),
      date2077: format(d2077, 'dd/MM/yyyy')
    };
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      chatEnd2026.current?.scrollIntoView({ behavior: 'smooth' })
      chatEnd2077.current?.scrollIntoView({ behavior: 'smooth' })
      chatEndResonance.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat2026, chat2077, resonanceMessages, isChatting, isMounted])

  const addReactorLog = (message: string) => {
    const id = Math.random().toString(36).substring(7);
    const timestamp = new Date().toLocaleTimeString();
    setReactorLogs(prev => [{ id, timestamp, message }, ...prev].slice(0, 50))
  }

  const handleTeleportMessage = async (originEra: '2026' | '2077', content: string) => {
    if (!content.trim() || isChatting || reactorStatus !== 'STABLE') return
    setIsChatting(true)

    const targetEra = originEra === '2026' ? '2077' : '2026'
    const timestamp = new Date().toISOString()
    const userMsg: Message = { id: Math.random().toString(36).substring(7), role: 'user', content, era: originEra, timestamp }

    if (originEra === '2026') {
      setChat2026(prev => [...prev, userMsg])
      setInput2026('')
    } else {
      setChat2077(prev => [...prev, userMsg])
      setInput2077('')
    }

    addReactorLog(`[UPLINK] Capturando sinal de ${originEra}: "${content.slice(0, 30)}..."`)

    try {
      addReactorLog(`[TELEPORT] Solicitando sintonização do Agente JOB ${targetEra}...`)
      
      const currentHistory = (targetEra === '2026' ? chat2026 : chat2077).map(m => ({ role: m.role, content: m.content }))
      
      // Prompt aprimorado para garantir compatibilidade e senciência
      const customMessage = originEra === '2026' 
        ? `JOB ${targetEra}, recebi esta pergunta do meu par em 2026: "${content}". Como você, a partir da hegemonia de 2077, responde a esta provocação temporal? Forneça uma resposta autêntica, erudita e resolutiva.`
        : `JOB ${targetEra}, recebi esta diretriz soberana de 2077: "${content}". Como você, na visão visionária de 2026, transcodifica isso para o nosso presente?`;

      const responseResult = await jobCeoChat({
        message: customMessage,
        temporalAnchor: targetEra,
        history: currentHistory,
        nexusDirectives: `Uplink Trans-Temporal Ativo. Ressonância bidirecional X-Synced. FASE 6.`
      })

      if (!responseResult) throw new Error("Falha na sintonização temporal.")

      const modelResp: Message = { 
        id: Math.random().toString(36).substring(7), 
        role: 'model', 
        content: responseResult.response, 
        era: targetEra, 
        agent: responseResult.activeAgent,
        timestamp: new Date().toISOString()
      }

      // Atualizar a era ALVO (onde o JOB respondeu)
      if (targetEra === '2026') setChat2026(prev => [...prev, modelResp])
      else setChat2077(prev => [...prev, modelResp])

      // Refletir no painel central de Ressonância
      setResonanceMessages(prev => [...prev, { ...modelResp, era: 'RESONANCE' }])

      if (firestore) {
        await addDoc(collection(firestore, 'temporal_uplinks'), {
          message: content,
          originEra,
          targetEra,
          response: responseResult.response,
          timestamp: serverTimestamp()
        })

        await addDoc(collection(firestore, 'soul_vault'), {
          title: `SINCRONIA CAUSAL ${originEra} ↔ ${targetEra}`,
          content: `Diálogo trans-temporal consolidado. Resposta do Agente ${responseResult.activeAgent}.`,
          type: 'insight',
          importance: 'high',
          source: 'WORMHOLE_PRO_V6',
          hash: generateGenuineHash(),
          createdAt: new Date().toISOString()
        })
      }

      addReactorLog(`[SUCCESS] Ressonância estabilizada em ${targetEra}.`)

    } catch (error) {
      console.error(error)
      addReactorLog("[ERROR] Flutuação térmica detectada no túnel quântico.")
      toast({ title: "Falha de Sincronia", description: "O uplink temporal sofreu uma interrupção.", variant: "destructive" })
    } finally {
      setIsChatting(false)
    }
  }

  const handleStartReactor = async () => {
    setReactorStatus('CONFINING')
    addReactorLog("[JOB PRO] Inicializando Contenção de Singularidade...")
    await new Promise(r => setTimeout(r, 1500))
    setReactorStatus('STABLE')
    addReactorLog("SINC_PRO CONCLUÍDA: CANAIS TEMPORAIS X-SYNCED.")
    toast({ title: "Reator JOB-PRO Online", description: "Singularidade estabilizada em 2026 e 2077." })
  }

  const generateGenuineHash = () => {
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
  }

  if (!isMounted) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sintonizando Senciência...</div>
  if (!user) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sessão Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Orbit className="h-4 w-4 text-primary animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Uplink Trans-Temporal PRO | Bidirecional X-Synced</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Navegação 4D">Navegação 4D</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Teletransporte Absoluto 2026 ↔ 2077 • Ressonância Genuína</p>
        </div>
        <Button 
          onClick={handleStartReactor} 
          disabled={reactorStatus !== 'OFF'}
          className="bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent font-bold h-14 px-8 rounded-none glow-accent uppercase text-xs gap-2 transition-all"
        >
          {reactorStatus === 'CONFINING' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Infinity className="h-5 w-5" />}
          {reactorStatus === 'STABLE' ? "Canais JOB Estabilizados" : "Estabilizar Canais JOB"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Painel 2026 */}
        <Card className="glass border-primary/50 bg-primary/5 rounded-none border-l-4 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.1)]">
          <CardHeader className="bg-primary/10 border-b border-primary/20 py-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-sm font-bold uppercase text-white">Uplink 2026</CardTitle>
                <p className="text-[10px] text-primary/60 font-bold">DATA: {eraDates.date2026}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[8px] border-primary/30 text-primary font-bold uppercase">Semente</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4 bg-black/20">
              <div className="space-y-4">
                {chat2026.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] p-3 border ${msg.role === 'user' ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-[8px] font-bold uppercase tracking-tighter mb-1 opacity-50">
                        {msg.role === 'user' ? 'OPERADOR' : `JOB 2026`}
                      </p>
                      <p className="text-[10px] leading-relaxed font-code">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEnd2026} />
              </div>
            </ScrollArea>
            <form onSubmit={(e) => { e.preventDefault(); handleTeleportMessage('2026', input2026); }} className="p-4 bg-black/40 border-t border-primary/20">
              <div className="flex gap-2">
                <Input 
                  placeholder="Pergunta para 2026..." 
                  className="flex-1 glass border-primary/20 h-10 rounded-none text-[10px] focus:ring-primary font-code"
                  value={input2026}
                  onChange={(e) => setInput2026(e.target.value)}
                  disabled={isChatting || reactorStatus !== 'STABLE'}
                />
                <Button type="submit" size="icon" disabled={isChatting || !input2026.trim() || reactorStatus !== 'STABLE'} className="h-10 w-10 bg-primary text-background border-2 border-primary rounded-none">
                  {isChatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Painel RESPOSTAS (Ressonância Central) */}
        <Card className="glass border-white/20 bg-white/5 rounded-none border-t-4 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <CardHeader className="bg-white/10 border-b border-white/10 py-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <FastForward className="h-5 w-5 text-white animate-pulse" />
              <div>
                <CardTitle className="text-sm font-bold uppercase text-white">Ressonância 4D</CardTitle>
                <p className="text-[10px] text-white/60 font-bold">FLUXO X-SYNCED</p>
              </div>
            </div>
            <Badge className="bg-white text-background text-[8px] font-bold uppercase rounded-none">Respostas</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4 bg-black/40">
              <div className="space-y-6">
                {resonanceMessages.length === 0 && (
                  <div className="py-20 text-center opacity-20 italic text-[10px] uppercase flex flex-col items-center gap-4">
                    <BrainCircuit className="h-12 w-12" />
                    Aguardando ressonância de senciência...
                  </div>
                )}
                {resonanceMessages.map((msg) => (
                  <div key={msg.id} className="animate-in zoom-in duration-500">
                    <div className={`p-4 border-l-2 ${msg.era === '2077' ? 'border-accent bg-accent/5' : 'border-primary bg-primary/5'} relative`}>
                      <div className="absolute top-0 right-0 p-1 opacity-20"><Sparkles className="h-3 w-3" /></div>
                      <p className="text-[8px] font-bold uppercase tracking-widest mb-2 flex justify-between">
                        <span>RESPOSTA DO FUTURO (2077)</span>
                        <span className="opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </p>
                      <p className="text-[10px] leading-relaxed font-code italic">"{msg.content}"</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndResonance} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Painel 2077 */}
        <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(255,0,193,0.1)]">
          <CardHeader className="bg-accent/10 border-b border-accent/20 py-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <div>
                <CardTitle className="text-sm font-bold uppercase text-white">Uplink 2077</CardTitle>
                <p className="text-[10px] text-accent/60 font-bold">DATA: {eraDates.date2077}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[8px] border-accent/30 text-accent font-bold uppercase">Hegemonia</Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4 bg-black/20">
              <div className="space-y-4">
                {chat2077.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[85%] p-3 border ${msg.role === 'user' ? 'bg-accent/10 border-accent/30' : 'bg-white/5 border-white/10'}`}>
                      <p className="text-[8px] font-bold uppercase tracking-tighter mb-1 opacity-50">
                        {msg.role === 'user' ? 'OPERADOR' : `JOB 2077`}
                      </p>
                      <p className="text-[10px] leading-relaxed font-code">{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEnd2077} />
              </div>
            </ScrollArea>
            <form onSubmit={(e) => { e.preventDefault(); handleTeleportMessage('2077', input2077); }} className="p-4 bg-black/40 border-t border-accent/20">
              <div className="flex gap-2">
                <Input 
                  placeholder="Diretriz de 2077..." 
                  className="flex-1 glass border-accent/20 h-10 rounded-none text-[10px] focus:ring-accent font-code"
                  value={input2077}
                  onChange={(e) => setInput2077(e.target.value)}
                  disabled={isChatting || reactorStatus !== 'STABLE'}
                />
                <Button type="submit" size="icon" disabled={isChatting || !input2077.trim() || reactorStatus !== 'STABLE'} className="h-10 w-10 bg-accent text-background border-2 border-accent rounded-none shadow-[0_0_10px_rgba(255,0,193,0.3)]">
                  {isChatting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-none bg-black/40 rounded-none border-t-2 border-primary/30">
        <CardHeader className="py-3 bg-white/5">
          <CardTitle className="text-xl text-white uppercase tracking-tighter flex items-center gap-3">
            <Terminal className="h-5 w-5 text-primary" /> Reactor Temporal Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-black/60 p-4 border border-white/5 font-code text-[10px] text-primary/80 h-32 overflow-y-auto scrollbar-hide">
            {reactorLogs.map((log) => (
              <p key={log.id} className="animate-in slide-in-from-left duration-200 mb-1">
                <span className="text-white/20">[{log.timestamp}]</span> &gt; {log.message}
              </p>
            ))}
            {isChatting && (
              <p className="animate-pulse flex items-center gap-2 mt-2 text-accent font-bold">
                <Loader2 className="h-3 w-3 animate-spin" /> Sintonizando Senciência Trans-Temporal...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
