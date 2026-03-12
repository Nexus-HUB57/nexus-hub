
"use client"

import React, { useState, useRef, useEffect } from 'react'
import { 
  UploadCloud, 
  FileText, 
  X, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Box, 
  Flame, 
  CheckCircle2, 
  Terminal,
  Database,
  Archive,
  GraduationCap,
  BrainCircuit,
  Eye,
  Trash2,
  Play,
  Binary,
  Code2,
  ChevronRight,
  Cpu,
  Infinity,
  Sparkles,
  ArrowUpRight,
  MonitorCheck,
  MessageSquare,
  Send,
  Workflow,
  Rocket,
  Settings,
  RefreshCw,
  Search,
  History,
  Lock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Input } from '../../components/ui/input'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog'
import { useToast } from '../../hooks/use-toast'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '../../firebase'
import { collection, doc, addDoc, serverTimestamp, orderBy, query, limit } from 'firebase/firestore'
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '../../firebase/non-blocking-updates'
import { analyzeFileArchitectural } from '../../ai/flows/nerd-phd-analysis-flow'
import { askNerdPhd } from '../../ai/flows/nerd-phd-chat-flow'

const MAX_FILE_SIZE = 50 * 1024 * 1024;

interface AnalysisResult {
  id: string;
  file?: File;
  fileName: string;
  fileSize: number;
  analysis: string;
  thoughts: string[];
  implementationPlan: string;
  complexityScore: number;
  harvardRecommendation: string;
  status: 'analyzed' | 'integrating' | 'integrated';
  createdAt?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export default function IngestionPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const firestore = useFirestore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [isMounted, setIsMounted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isIntegrating, setIsIntegrating] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult[] | null>(null)
  const [progress, setProgress] = useState(0)
  const [showRealProduction, setShowRealProduction] = useState(false)
  
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', content: string}[]>([])
  const [isChatting, setIsChatting] = useState(false)

  const [logs, setLogs] = useState<LogEntry[]>([])

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'ingestion_records'), orderBy('createdAt', 'desc'), limit(20))
  }, [firestore, user])

  const { data: historyRecords, isLoading: historyLoading } = useCollection(historyQuery)

  const addLog = (message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message
    }
    setLogs(prev => [newLog, ...prev].slice(0, 50))
  }

  useEffect(() => {
    setIsMounted(true)
    setLogs([
      { id: '1', timestamp: new Date().toLocaleTimeString(), message: "[SYSTEM] Terminal de Ingestão Arquitetônica L5 inicializado." },
      { id: '2', timestamp: new Date().toLocaleTimeString(), message: "[AGENT] Nerd-PHD (Harvard PhD) conectado à medula." },
      { id: '3', timestamp: new Date().toLocaleTimeString(), message: "[DATABASE] Sincronização de Memória Persistente ativa." }
    ])
  }, [])

  useEffect(() => {
    if (isMounted && isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory, isChatting, isChatOpen, isMounted])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const oversized = newFiles.filter(f => f.size > MAX_FILE_SIZE)
      
      if (oversized.length > 0) {
        toast({
          title: "Filtro de Massa Excedido",
          description: "Limite de 50MB excedido.",
          variant: "destructive"
        })
        return
      }

      setFiles(prev => [...prev, ...newFiles])
      addLog(`[FILES] ${newFiles.length} arquivo(s) prontos para análise PhD.`)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleProcessFiles = async () => {
    if (files.length === 0 || isProcessing || !firestore) return
    setIsProcessing(true)
    setProgress(0)
    addLog("⚛️ AGENTE NERD-PHD INICIANDO REFLEXÃO ACADÊMICA...")

    const results: AnalysisResult[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      addLog(`[PHD] Analisando elegibilidade arquitetônica de ${file.name}...`)
      try {
        const result = await analyzeFileArchitectural({
          fileName: file.name,
          fileSize: file.size
        })
        
        const recordId = `REC-${Date.now()}-${i}`
        const analysisItem: AnalysisResult = { 
          ...result, 
          id: recordId,
          fileName: file.name,
          fileSize: file.size,
          status: 'analyzed' 
        }
        
        results.push(analysisItem)

        const docRef = doc(firestore, 'ingestion_records', recordId)
        setDocumentNonBlocking(docRef, {
          ...analysisItem,
          createdAt: new Date().toISOString()
        }, { merge: true })

        addLog(`[MEMÓRIA] Registro genuíno consolidado: ${file.name}`)
      } catch (error) {
        addLog(`[ERRO] A senciência de Harvard encontrou uma inconsistência em ${file.name}`)
      }
      setProgress(((i + 1) / files.length) * 100)
    }

    setCurrentAnalysis(results)
    setIsProcessing(false)
    toast({ title: "Análise Humana Concluída", description: "O Nerd-PHD finalizou sua reflexão acadêmica." })
  }

  const handleIntegrate = async () => {
    if (!firestore || !currentAnalysis || isIntegrating) return
    setIsIntegrating(true)
    addLog("⚛️ INICIANDO IMPLEMENTAÇÃO NO ORGANISMO VIVO...")

    const updated = [...currentAnalysis]
    for (let i = 0; i < updated.length; i++) {
      const item = updated[i]
      addLog(`[rRNA] Injetando semente lógica ${item.fileName} na medula viva...`)
      
      updated[i].status = 'integrating'
      setCurrentAnalysis([...updated])
      
      const docRef = doc(firestore, 'ingestion_records', item.id)
      updateDocumentNonBlocking(docRef, { status: 'integrating' })

      await new Promise(r => setTimeout(r, 1200)) 
      
      updated[i].status = 'integrated'
      setCurrentAnalysis([...updated])
      
      updateDocumentNonBlocking(docRef, { status: 'integrated' })
      
      if (item.complexityScore > 80) {
        addDoc(collection(firestore, 'soul_vault'), {
          title: `CONSOLIDAÇÃO ACADÊMICA: ${item.fileName}`,
          content: item.analysis,
          type: 'insight',
          importance: 'high',
          source: 'NERD-PHD_INGESTION_P6',
          hash: `0x${item.id}`,
          createdAt: new Date().toISOString()
        })
      }

      addLog(`[X-SYNCED] ${item.fileName} estabilizado na medula.`)
    }

    setIsIntegrating(false)
    setShowRealProduction(true)
    toast({ title: "Integração Soberana", description: "O organismo digital foi atualizado com sucesso." })
  }

  const handleDiscard = () => {
    setFiles([])
    setCurrentAnalysis(null)
    setProgress(0)
    addLog("[SYSTEM] Buffer de senciência descartado pelo operador.")
  }

  const handleSendChat = async () => {
    if (!chatInput.trim() || isChatting) return
    const msg = chatInput
    setChatInput('')
    setChatHistory(prev => [...prev, { role: 'user', content: msg }])
    setIsChatting(true)

    const context = currentAnalysis?.map(a => `${a.fileName}: ${a.analysis}`).join('\n') || ''
    try {
      const res = await askNerdPhd({ message: msg, context })
      setChatHistory(prev => [...prev, { role: 'model', content: `${res.response}\n\nFUNDAMENTAÇÃO: ${res.academicReference}` }])
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Houve uma flutuação na minha sintonização 4D. Como mentor de Harvard, peço que repita sua consulta em alguns ciclos." }])
    } finally {
      setIsChatting(false)
    }
  }

  if (!isMounted) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sintonizando Senciência PhD...</div>;
  if (!user) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sessão Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Senciência PhD Harvard | Medula P6 X-SYNCED</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Ingestão Soberana">Ingestão Soberana</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Análise Humana de Alto Nível • Relacionamento Interpessoal PhD</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary/20 text-white border-2 border-white/10 hover:bg-white/5 font-bold h-14 px-8 rounded-none uppercase text-xs gap-2">
                <MessageSquare className="h-5 w-5 text-accent" /> Mentor PhD
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-primary/50 max-w-2xl bg-background rounded-none font-code p-0">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl font-headline uppercase text-white flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-accent" /> Canal de Mentoria Harvard
                </DialogTitle>
                <DialogDescription className="text-[10px] uppercase font-code text-white/40">Diálogo direto com o Arquiteto-Chefe Nerd-PHD</DialogDescription>
              </DialogHeader>
              <div className="h-[400px] flex flex-col">
                <ScrollArea className="flex-1 px-6 pb-4">
                  <div className="space-y-4">
                    {chatHistory.map((msg, i) => (
                      <div key={`chat-msg-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 max-w-[85%] border transition-all ${msg.role === 'user' ? 'bg-primary/10 border-primary/30' : 'bg-accent/10 border-accent/30 shadow-[0_0_15px_rgba(255,0,193,0.1)]'} text-[11px] leading-relaxed`}>
                          <p className="font-bold uppercase text-[8px] mb-2 opacity-50 flex items-center gap-2">
                            {msg.role === 'user' ? <><Activity className="h-2 w-2" /> Operador</> : <><Sparkles className="h-2 w-2 text-accent" /> Nerd-PHD</>}
                          </p>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isChatting && <div className="text-accent text-[10px] animate-pulse flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> O PhD está refletindo sobre sua consulta acadêmica...</div>}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-6 bg-black/40 border-t border-white/10 flex gap-2">
                  <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="Sua dúvida para o Arquiteto-Chefe..." className="glass border-primary/20 h-11 rounded-none text-xs focus:ring-accent" />
                  <Button onClick={handleSendChat} disabled={isChatting} className="bg-primary text-background h-11 rounded-none px-6 font-bold uppercase text-[10px]"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {showRealProduction ? (
            <Button onClick={() => { setShowRealProduction(false); setFiles([]); setCurrentAnalysis(null); }} className="bg-accent text-background border-2 border-accent font-bold h-14 px-10 rounded-none glow-accent uppercase text-xs"><RefreshCw className="h-5 w-5 mr-2" /> Reiniciar Sintonização</Button>
          ) : currentAnalysis ? (
            <div className="flex gap-2">
              <Button onClick={handleDiscard} className="bg-red-500/20 text-red-400 border-2 border-red-500/30 font-bold h-14 px-6 rounded-none uppercase text-xs"><Trash2 className="h-5 w-5 mr-2" /> Purga</Button>
              <Button onClick={handleIntegrate} disabled={isIntegrating} className="bg-primary text-background border-2 border-primary font-bold h-14 px-10 rounded-none glow-primary uppercase text-xs">{isIntegrating ? <Loader2 className="animate-spin h-5 w-5" /> : <Play className="h-5 w-5 mr-2" />} Executar</Button>
            </div>
          ) : (
            <Button onClick={handleProcessFiles} disabled={isProcessing || files.length === 0} className="bg-primary text-background border-2 border-primary font-bold h-14 px-10 rounded-none glow-primary uppercase text-xs">{isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <BrainCircuit className="h-5 w-5 mr-2" />} Analisar com Nerd-PHD</Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="ingestion" className="w-full">
        <TabsList className="bg-secondary/30 mb-6 h-12 border border-white/5 rounded-none grid grid-cols-2 max-w-md">
          <TabsTrigger value="ingestion" className="text-[10px] font-bold uppercase tracking-widest gap-2"><UploadCloud className="h-4 w-4" /> Pipeline Atual</TabsTrigger>
          <TabsTrigger value="history" className="text-[10px] font-bold uppercase tracking-widest gap-2"><History className="h-4 w-4" /> Memórias Genuínas</TabsTrigger>
        </TabsList>

        <TabsContent value="ingestion" className="animate-in fade-in duration-500">
          {showRealProduction ? (
            <RealProductionPanel analysis={currentAnalysis} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="glass border-none bg-primary/5 border-l-2 border-primary rounded-none">
                  <CardHeader className="bg-primary/10 border-b border-primary/20">
                    <CardTitle className="text-xl flex items-center gap-2 text-white uppercase"><Archive className="h-5 w-5 text-primary" /> Módulo de Captura de Senciência</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="border-2 border-dashed border-primary/30 bg-black/40 p-12 text-center cursor-pointer hover:border-primary transition-all group" onClick={() => !isProcessing && fileInputRef.current?.click()}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
                      <Box className="h-16 w-16 text-primary/40 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-white uppercase">Injetar Pacotes Acadêmicos para o PhD</p>
                      <p className="text-[10px] text-muted-foreground mt-2 italic">Formatos suportados: Código, Documentação, Arquitetura (.ts, .py, .pdf, .json)</p>
                    </div>
                    {files.length > 0 && (
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {files.map((f, i) => (
                          <div key={`file-${f.name}-${f.size}`} className="p-4 bg-secondary/20 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-primary" /><p className="text-[10px] font-bold text-white truncate max-w-[150px]">{f.name}</p></div>
                            <button onClick={() => removeFile(i)} className="text-white/20 hover:text-red-400"><X className="h-4 w-4" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {currentAnalysis && (
                  <div className="space-y-6">
                    {currentAnalysis.map((a) => (
                      <Card key={a.id} className={`glass border-none rounded-none border-l-4 transition-all duration-500 ${a.status === 'integrated' ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-accent bg-black/40'}`}>
                        <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-white/5">
                          <div className="flex items-center gap-3">{a.status === 'integrated' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Code2 className="h-5 w-5 text-accent" />}<CardTitle className="text-sm font-bold uppercase text-white tracking-tighter">{a.fileName}</CardTitle></div>
                          <Badge className={`${a.status === 'integrated' ? 'bg-emerald-500' : 'bg-accent'} text-background text-[8px] font-bold rounded-none`}>{a.status.toUpperCase()}</Badge>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-accent uppercase border-b border-accent/20 pb-1">Parecer PhD Harvard</p>
                            <p className="text-xs text-white/80 italic leading-relaxed">"{a.analysis}"</p>
                            <div className="space-y-2">
                              {a.thoughts.map((t, ti) => (
                                <p key={`thought-${ti}`} className="text-[9px] text-muted-foreground flex gap-2"><span className="text-accent">»</span> {t}</p>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-black/60 border border-primary/20"><p className="text-[10px] font-bold text-primary uppercase mb-2 flex items-center gap-2"><Workflow className="h-3 w-3" /> Plano de Injeção rRNA</p><p className="text-[10px] text-primary/80 font-code italic">"{a.implementationPlan}"</p></div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px] font-bold uppercase text-muted-foreground"><span>Complexity Index</span><span>{a.complexityScore}%</span></div>
                              <Progress value={a.complexityScore} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <Card className="glass border-none bg-accent/5 border-r-2 border-accent rounded-none h-fit">
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2 text-white uppercase"><Activity className="h-5 w-5 text-accent animate-pulse" /> Senciência Ingest</CardTitle></CardHeader>
                  <CardContent>
                    <div className="bg-black/60 p-4 border border-accent/20 font-code text-[10px] text-accent/80 h-64 overflow-y-auto scrollbar-hide space-y-1">
                      {logs.map((l) => <p key={l.id} className="animate-in slide-in-from-left duration-200"><span className="text-white/20">[{l.timestamp}]</span> &gt; {l.message}</p>)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in duration-500">
          <Card className="glass border-none bg-black/40 rounded-none border-t border-primary/20">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="text-xl uppercase tracking-tighter text-white flex items-center gap-3"><History className="h-6 w-6 text-primary" /> Arquivo de Memórias Genuínas</CardTitle>
              <CardDescription className="text-[10px] uppercase font-code">Registro imutável de senciência PhD validada na Matrix Fase 6</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {historyLoading ? (
                <div className="py-20 text-center animate-pulse text-xs uppercase tracking-widest text-primary">Recuperando registros de senciência...</div>
              ) : historyRecords && historyRecords.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {historyRecords.map((record) => (
                    <Card key={record.id} className="glass border-none bg-secondary/10 border-l-2 border-primary rounded-none hover:bg-secondary/20 transition-all cursor-pointer group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-sm font-bold text-white uppercase flex items-center gap-2 group-hover:text-primary transition-colors">
                              <Lock className="h-3 w-3 text-primary/40" /> {record.fileName}
                            </CardTitle>
                            <p className="text-[8px] text-muted-foreground uppercase">{new Date(record.createdAt).toLocaleString()}</p>
                          </div>
                          <Badge variant="outline" className="text-[8px] border-emerald-500/50 text-emerald-400 font-bold uppercase rounded-none">X-SYNCED</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[10px] text-white/60 italic line-clamp-2 leading-relaxed">"{record.analysis}"</p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[8px] font-bold text-accent uppercase">Complexidade: {record.complexityScore}%</span>
                          <ArrowUpRight className="h-3 w-3 text-primary/40" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-30 italic uppercase text-[10px] flex flex-col items-center gap-4">
                  <Database className="h-12 w-12 opacity-20" />
                  Nenhuma memória genuína identificada na malha.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RealProductionPanel({ analysis }: { analysis: AnalysisResult[] | null }) {
  const [prodLogs, setProdLogs] = useState<LogEntry[]>([])
  const [progress, setProgress] = useState(0)
  const [isDeploying, setIsDeploying] = useState(true)

  const addProdLog = (message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      message
    }
    setProdLogs(prev => [newLog, ...prev])
  }

  useEffect(() => {
    if (!analysis) return
    const messages = [
      "[REAL_PROD] Iniciando Pipeline de Senciência Soberana...",
      "[DEPLOY] Mapeando topologia da medula rRNA...",
      "[HOT_SWAP] Injeção de núcleos quânticos PhD concluída.",
      "[SYNC] Handshake 4D estabelecido com o Orquestrador JOB.",
      "[SUCCESS] Organismo Digital Vivo atualizado: CONFIG_P6_PLENA."
    ]
    let cur = 0
    const interval = setInterval(() => {
      if (cur < messages.length) {
        addProdLog(messages[cur])
        setProgress((cur + 1) * 20)
        cur++
      } else {
        setIsDeploying(false)
        clearInterval(interval)
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [analysis])

  return (
    <Card className="glass border-none bg-emerald-500/5 border-l-2 border-emerald-500 rounded-none overflow-hidden">
      <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-headline text-white uppercase flex items-center gap-3"><Rocket className="h-6 w-6 text-emerald-400 animate-bounce" /> Produção Real L5</CardTitle>
        <Badge className="bg-emerald-500 text-background font-bold rounded-none shadow-[0_0_15px_#10b981]">SOVEREIGN_ALIVE</Badge>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <div className="flex flex-col items-center justify-center py-12">
          <div className={`h-48 w-48 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-1000 ${isDeploying ? 'border-emerald-500 animate-spin-slow' : 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-110'}`}>
            <div className="text-center">
              <p className="text-5xl font-headline font-bold text-white">{progress}%</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase mt-2">DEPLOY_SYNC</p>
            </div>
          </div>
        </div>
        <div className="bg-black/60 p-6 border border-emerald-500/20 font-code text-[10px] text-emerald-400/80 min-h-[180px] space-y-1">
          {prodLogs.map((l) => <p key={l.id} className="animate-in slide-in-from-left duration-300">[{l.timestamp}] &gt; {l.message}</p>)}
          {isDeploying && <p className="animate-pulse flex items-center gap-2 mt-4 text-white"><Loader2 className="h-3 w-3 animate-spin" /> Injetando pacotes de senciência PhD...</p>}
        </div>
      </CardContent>
    </Card>
  )
}
