
"use client"

import React, { useState } from 'react'
import { 
  Zap, 
  PlusCircle, 
  Users, 
  Target, 
  Rocket, 
  Calendar, 
  Filter, 
  BrainCircuit, 
  ChevronRight, 
  FlaskConical, 
  Activity, 
  Loader2, 
  Sparkles,
  Cpu,
  ShieldCheck,
  Star,
  Terminal,
  Database
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { useFirestore, useCollection, useMemoFirebase, useUser } from '../../firebase'
import { collection, query, where, serverTimestamp, doc, addDoc } from 'firebase/firestore'
import { addDocumentNonBlocking } from '../../firebase/non-blocking-updates'
import { format } from 'date-fns'
import { generateAccelerationStrategy, type AccelerationStrategyOutput } from '../../ai/flows/acceleration-strategy-flow'
import { useToast } from '../../hooks/use-toast'

export default function AccelerationLabsPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)

  const programsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    const baseQuery = collection(firestore, 'acceleration_programs')
    if (filterStatus === 'all') return baseQuery
    return query(baseQuery, where('status', '==', filterStatus))
  }, [firestore, filterStatus, user])

  const { data: programs, isLoading } = useCollection(programsQuery)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning': return <Badge variant="outline" className="border-blue-400 text-blue-400 rounded-none font-bold">PLANNING</Badge>
      case 'active': return <Badge className="bg-emerald-500 text-emerald-950 font-bold glow-primary/20 rounded-none">ACTIVE</Badge>
      case 'completed': return <Badge variant="secondary" className="opacity-50 rounded-none">COMPLETED</Badge>
      default: return <Badge variant="outline" className="rounded-none">{status}</Badge>
    }
  }

  if (!user) return <div className="p-8 text-center text-muted-foreground font-code uppercase">Sessão Industrial Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative font-code overflow-hidden">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Gnox Growth Labs | Phase 4 Sovereign</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Acceleration Labs">Acceleration Labs</h1>
          <p className="text-muted-foreground text-xs text-white/60">Incubação Industrial de Startups via Swarm rRNA • Alvo: Unicórnio Galáctico</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary glow-primary gap-2 h-12 px-8 font-bold rounded-none uppercase text-xs">
              <PlusCircle className="h-4 w-4" /> Iniciar Trilha Labs
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-primary/50 max-w-2xl bg-background rounded-none">
            <CreateProgramForm />
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-primary/20 flex items-center justify-center text-primary"><Target className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Labs Ativos</p><p className="text-xl font-headline font-bold text-white">{programs?.length || 0}</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setFilterStatus('active')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-accent/20 flex items-center justify-center text-accent"><Activity className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Em Produção</p><p className="text-xl font-headline font-bold text-white">{programs?.filter(p => p.status === 'active').length || 0}</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-emerald-500/5 rounded-none border-l-2 border-emerald-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-emerald-500/20 flex items-center justify-center text-emerald-400"><BrainCircuit className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Mentores GPT-5.1</p><p className="text-xl font-headline font-bold text-white">12 ENTITIES</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-purple-500/5 rounded-none border-l-2 border-purple-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-purple-500/20 flex items-center justify-center text-purple-400"><Users className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Nós Incubados</p><p className="text-xl font-headline font-bold text-white">42</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="programs" className="w-full">
            <TabsList className="bg-secondary/30 mb-6 border border-white/5 rounded-none h-12">
              <TabsTrigger value="programs" className="text-[10px] font-bold uppercase tracking-widest px-8">Trilhas de Produção</TabsTrigger>
              <TabsTrigger value="labs" className="text-[10px] font-bold uppercase tracking-widest px-8">Experiments & P&D</TabsTrigger>
            </TabsList>

            <TabsContent value="programs" className="space-y-6 animate-in fade-in duration-500">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Activity className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-xs font-headline uppercase tracking-widest text-primary animate-pulse">Sincronizando Malha de Aceleração...</p>
                </div>
              ) : programs && programs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programs.map((program) => (
                    <Card 
                      key={program.id} 
                      className={`glass border-none hover:bg-secondary/30 transition-all cursor-pointer group overflow-hidden rounded-none border-l-4 ${selectedProgramId === program.id ? 'border-accent shadow-[0_0_15px_rgba(255,0,193,0.3)]' : 'border-primary'}`}
                      onClick={() => setSelectedProgramId(program.id)}
                    >
                      <CardHeader className="pb-3 bg-black/40">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-xl font-headline text-white group-hover:text-primary transition-colors tracking-tighter uppercase">{program.name}</CardTitle>
                            <Badge variant="outline" className="text-[8px] font-bold uppercase border-primary/20 text-primary rounded-none">{program.focusArea || 'General Growth'}</Badge>
                          </div>
                          {getStatusBadge(program.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 text-[10px] font-code text-white/40 uppercase">
                          <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {format(new Date(program.startDate), 'MMM d')} - {format(new Date(program.endDate), 'MMM d, yyyy')}</div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 italic leading-relaxed">"{program.description}"</p>
                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold uppercase text-white/60">{program.maxParticipants} Slots Alpha</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform ${selectedProgramId === program.id ? 'rotate-90 text-accent' : 'text-primary/40'}`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass border-none py-32 text-center rounded-none bg-primary/5 border border-dashed border-primary/20">
                  <Rocket className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground italic">Nenhuma trilha de aceleração ativa. Inicie uma nova via Labs.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="labs" className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 gap-6">
                <Card className="glass border-none bg-accent/5 border-l-2 border-accent rounded-none overflow-hidden">
                  <CardHeader className="bg-accent/10 border-b border-accent/10">
                    <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-accent" /> Experimentos de Senciência (P&D)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="bg-black/60 border border-accent/20 p-4 font-code text-[10px] leading-relaxed text-accent/80">
                      "Os Labs estão operando em regime de treinamento massivo de kernels rRNA. Atualmente otimizando 12 modelos de mentoria para atingir o teto de GPT-5.1 em todas as verticais."
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Experiment: Alpha-Gain-Optimization</p>
                          <p className="text-sm font-bold text-emerald-400">STATUS: STABLE</p>
                        </div>
                        <Activity className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="p-4 bg-black/40 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Experiment: Swarm-Consensus-V4</p>
                          <p className="text-sm font-bold text-accent animate-pulse">STATUS: IN_TEST</p>
                        </div>
                        <FlaskConical className="h-4 w-4 text-accent animate-bounce" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {selectedProgramId ? (
            <ProgramDetails programId={selectedProgramId} onClose={() => setSelectedProgramId(null)} />
          ) : (
            <Card className="glass border-none bg-primary/5 border-r-2 border-primary rounded-none">
              <CardHeader className="bg-primary/10 border-b border-primary/10">
                <CardTitle className="text-lg flex items-center gap-2 text-white uppercase tracking-tighter"><Zap className="h-5 w-5 text-primary" /> Why Labs Acceleration?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-xs text-white/70 leading-relaxed font-code">
                <p>"Trilhas de aceleração fornecem acesso direto ao enxame de 38.4M de agentes, provendo 10x mais recursos de computação e mentores IA especializados."</p>
                <div className="p-4 bg-black/40 border-l-2 border-accent rounded-none space-y-2">
                  <p className="text-[9px] font-bold text-accent uppercase tracking-widest flex items-center gap-2"><Star className="h-3 w-3" /> Impact Milestones</p>
                  <p className="text-[10px] italic">"Startups graduadas nos Labs apresentam crescimento médio de 400% nos primeiros 6 meses pós-lançamento."</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-2">
                    <span className="text-muted-foreground">Alocação Swarm Total</span>
                    <span className="text-primary">84%</span>
                  </div>
                  <Progress value={84} className="h-1 bg-muted rounded-none" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ProgramDetails({ programId, onClose }: { programId: string, onClose: () => void }) {
  const firestore = useFirestore()
  const { user } = useUser()
  
  const participantsQuery = useMemoFirebase(() => {
    if (!firestore || !programId || !user) return null
    return collection(firestore, 'acceleration_programs', programId, 'participants')
  }, [firestore, programId, user])

  const { data: participants } = useCollection(participantsQuery)

  return (
    <Card className="glass border-none animate-in slide-in-from-right duration-500 rounded-none border-l-4 border-accent bg-accent/5">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-accent/10 py-3">
        <CardTitle className="text-sm font-bold uppercase text-white tracking-widest">Labs Track Details</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 text-[10px] text-accent hover:bg-accent/20 uppercase font-bold rounded-none">Close</Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/30 rounded-none h-10">
            <TabsTrigger value="participants" className="text-[9px] font-bold uppercase tracking-widest">Incubated Nodes</TabsTrigger>
            <TabsTrigger value="stats" className="text-[9px] font-bold uppercase tracking-widest">Growth Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="participants" className="space-y-4 pt-4">
            {participants && participants.length > 0 ? (
              participants.map((p) => (
                <div key={p.id} className="p-4 bg-black/40 border border-white/5 space-y-3 hover:bg-accent/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-tighter text-white">{p.startupName}</span>
                    <Badge variant="outline" className="text-[8px] border-emerald-500/50 text-emerald-400 font-bold uppercase rounded-none">{p.status}</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] text-muted-foreground uppercase font-bold">
                      <span>Sovereign Progress</span>
                      <span className="text-primary">{p.progressScore}%</span>
                    </div>
                    <Progress value={p.progressScore} className="h-1 bg-muted rounded-none" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-4 opacity-40">
                <Database className="h-8 w-8 mx-auto" />
                <p className="text-[9px] uppercase font-bold tracking-widest italic leading-relaxed">Nenhum nó de startup<br />identificado nesta trilha.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="pt-4 space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-black/40 border border-white/5 text-center">
                 <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Avg Efficiency</p>
                 <p className="text-xl font-headline font-bold text-white tracking-tighter">64%</p>
               </div>
               <div className="p-4 bg-black/40 border border-white/5 text-center">
                 <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Exit Prob</p>
                 <p className="text-xl font-headline font-bold text-accent tracking-tighter">82%</p>
               </div>
             </div>
             <div className="p-4 bg-primary/5 border border-primary/20 rounded-none">
               <p className="text-[8px] font-bold text-primary uppercase mb-2">Alpha-Gain Estimation</p>
               <p className="text-[10px] italic text-primary/80">"Projeção de senciência galáctica atingindo 98% em 12 ciclos de produção real."</p>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function CreateProgramForm() {
  const firestore = useFirestore()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiStrategy, setAiStrategy] = useState<AccelerationStrategyOutput | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    focusArea: '',
  })

  const handleGenerateStrategy = async () => {
    if (!formData.name || !formData.focusArea) {
      toast({ title: "Erro de Comando", description: "Defina o Nome e o Setor para consulta do CEO.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateAccelerationStrategy({
        programName: formData.name,
        focusArea: formData.focusArea,
        description: formData.description,
        targetStartups: formData.maxParticipants
      });
      setAiStrategy(result);
      toast({ title: "Diretriz CEO Recebida", description: "O Agente Job sintetizou a estratégia Labs." });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firestore) return

    const programsRef = collection(firestore, 'acceleration_programs')
    addDocumentNonBlocking(programsRef, {
      ...formData,
      status: 'planning',
      aiStrategy: aiStrategy || null,
      createdAt: new Date().toISOString()
    })
    
    toast({ title: "Labs Inicializado", description: "Trilha de aceleração enviada para o buffer de produção." });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <DialogHeader>
        <DialogTitle className="text-3xl font-headline uppercase tracking-tighter text-white">Initialize Labs Track</DialogTitle>
        <DialogDescription className="text-[10px] uppercase font-code text-white/40">Define parameters for the autonomous growth engine</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Program Node Name</label>
            <Input 
              className="glass border-primary/20 rounded-none h-11 text-xs text-white placeholder:text-white/20 font-code focus:ring-primary" 
              placeholder="e.g. ALPHA-MESH-2024" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Focus Sector rRNA</label>
            <Input 
              className="glass border-primary/20 rounded-none h-11 text-xs text-white placeholder:text-white/20 font-code focus:ring-primary" 
              placeholder="e.g. Neuro-Fintech" 
              value={formData.focusArea}
              onChange={(e) => setFormData({...formData, focusArea: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Strategic Mission</label>
          <Textarea 
            className="glass border-primary/20 rounded-none min-h-[100px] text-xs text-white placeholder:text-white/20 font-code focus:ring-primary" 
            placeholder="Outline the objectives and unicorn targets of this track..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">Start Phase</label>
            <Input 
              type="date" 
              className="glass border-primary/20 rounded-none h-11 text-xs text-white font-code" 
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase text-muted-foreground ml-1">End Phase</label>
            <Input 
              type="date" 
              className="glass border-primary/20 rounded-none h-11 text-xs text-white font-code" 
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>
        </div>

        <Button 
          type="button" 
          onClick={handleGenerateStrategy}
          disabled={isGenerating}
          className="w-full bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 rounded-none h-10 text-[10px] font-bold uppercase tracking-widest gap-2"
        >
          {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <BrainCircuit className="h-3 w-3" />}
          Gerar Estratégia CEO (Agente Job)
        </Button>

        {aiStrategy && (
          <Card className="bg-accent/5 border border-accent/20 rounded-none animate-in zoom-in duration-300">
            <CardContent className="p-4 space-y-3">
              <p className="text-[10px] font-bold text-accent uppercase flex items-center gap-2 border-b border-accent/20 pb-1">
                <Star className="h-3 w-3" /> Diretriz Estratégica CEO
              </p>
              <p className="text-[10px] text-white/80 italic leading-relaxed">"{aiStrategy.strategicRationale}"</p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[8px] font-bold text-muted-foreground uppercase">Alocação rRNA:</span>
                <Badge className="bg-accent text-background text-[8px] font-bold uppercase rounded-none">{aiStrategy.computeAllocation}</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button type="submit" className="w-full bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary glow-primary h-14 text-lg font-headline font-bold rounded-none uppercase tracking-widest transition-all">
        INITIATE ACCELERATION LABS
      </Button>
    </form>
  )
}
