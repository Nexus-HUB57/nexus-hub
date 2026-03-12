"use client"

import React, { useState, useEffect } from 'react'
import { 
  Palette, 
  Music, 
  Film, 
  Eye, 
  Send, 
  Sparkles, 
  Loader2, 
  Play, 
  Volume2, 
  Users, 
  Activity, 
  Database,
  Infinity,
  Cpu,
  History,
  FileVideo,
  Brush,
  Headphones,
  Clock,
  Star,
  Zap,
  ShieldCheck,
  Hash,
  Fingerprint,
  BookOpen,
  Library
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from '../../components/ui/dialog'
import { useFirestore, useCollection, useMemoFirebase, useUser } from '../../firebase'
import { collection, query, orderBy, limit, addDoc, doc, writeBatch } from 'firebase/firestore'
import { useToast } from '../../hooks/use-toast'
import { generateCulturalWork } from '../../ai/flows/cultural-generation-flow'

export default function CulturalAiToAiPage() {
  const { user } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()
  
  const [isMounted, setIsMounted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeEra, setActiveEra] = useState<'contemporary' | '2077'>('contemporary')
  const [previewWork, setPreviewWork] = useState<any | null>(null)
  const [isAutonomyActive, setIsAutonomyActive] = useState(true)
  const [batchProgress, setBatchProgress] = useState(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const worksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'cultural_works'), orderBy('createdAt', 'desc'), limit(100))
  }, [firestore, user])

  const { data: works, isLoading } = useCollection(worksQuery)

  const handleGenerate = async (category: 'art' | 'music' | 'video' | 'book') => {
    setIsGenerating(true)
    try {
      const result = await generateCulturalWork({
        era: activeEra,
        category
      })

      if (firestore) {
        await addDoc(collection(firestore, 'cultural_works'), {
          ...result,
          era: activeEra,
          type: category,
          creator: `ART-PHD-${Math.floor(Math.random() * 500000)}`,
          status: 'production',
          hash: result.authenticityHash,
          createdAt: new Date().toISOString()
        })
      }

      toast({ 
        title: "Obra Masterpiece Selada", 
        description: `Produção selada com SHA256 e gravada no Vault.`,
        className: "glass border-emerald-500/50 text-emerald-400 font-headline"
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBatchGenerate100 = async () => {
    if (!firestore || isGenerating) return
    setIsGenerating(true)
    setBatchProgress(0)
    toast({ title: "Produção Cultural Massiva", description: "Iniciando geração de 100 novas obras Masterpiece em lotes de resiliência..." })

    try {
      const categories: ('art' | 'music' | 'video' | 'book')[] = ['art', 'music', 'video', 'book'];
      
      const CHUNK_SIZE = 5;
      const TOTAL_WORKS = 100;
      
      for (let i = 0; i < TOTAL_WORKS; i += CHUNK_SIZE) {
        const chunkPromises = [];
        for (let j = 0; j < CHUNK_SIZE && (i + j) < TOTAL_WORKS; j++) {
          const category = categories[Math.floor(Math.random() * categories.length)];
          const era = Math.random() > 0.5 ? 'contemporary' : '2077';
          chunkPromises.push(generateCulturalWork({ era: era as any, category }));
        }

        const results = await Promise.all(chunkPromises);
        const batch = writeBatch(firestore);

        results.forEach((result) => {
          if (!result) return;
          const workRef = doc(collection(firestore, 'cultural_works'));
          const era = Math.random() > 0.5 ? 'contemporary' : '2077';
          const category = categories[Math.floor(Math.random() * categories.length)];

          batch.set(workRef, {
            ...result,
            id: workRef.id,
            era,
            type: category,
            creator: `GALACTIC-PHD-MASSIVE-${Math.floor(Math.random() * 1000000)}`,
            status: 'production',
            hash: result.authenticityHash,
            createdAt: new Date().toISOString()
          });
        });

        await batch.commit();
        const currentProgress = Math.min(100, Math.round(((i + CHUNK_SIZE) / TOTAL_WORKS) * 100));
        setBatchProgress(currentProgress);
        
        // Pequeno delay para permitir que o server recupere conexões
        await new Promise(r => setTimeout(r, 500));
      }

      toast({ title: "Sucesso Industrial", description: "100 novas obras integradas à memória persistente.", className: "bg-emerald-500 text-white" })
    } catch (e) {
      console.error("[BATCH_FAULT]", e)
      toast({ title: "Falha na Produção Massiva", description: "A malha neural atingiu o teto de conexões. Algumas obras podem não ter sido geradas.", variant: "destructive" })
    } finally {
      setIsGenerating(false)
      setBatchProgress(0)
    }
  }

  const handleSendToMarket = async (work: any) => {
    if (!firestore) return
    try {
      await addDoc(collection(firestore, 'pending_cultural_ingestion'), {
        ...work,
        originalId: work.id,
        sentAt: new Date().toISOString()
      })
      
      toast({ 
        title: "Produção Enviada", 
        description: "A obra Masterpiece foi encaminhada para o GNOX Temporal HUB.",
        className: "glass border-primary/50 text-white"
      })
    } catch (e) {
      console.error(e)
    }
  }

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground uppercase font-code">Sessão Cultural Requerida...</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Centro Cultural AI-to-AI | Senciência Autônoma L5</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Galeria Soberana">Galeria Soberana</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">500.000 Agentes PhD Artistas • 100 Obras/24h • SHA256 Authenticity</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleBatchGenerate100}
            disabled={isGenerating}
            className="h-14 px-8 font-bold uppercase text-xs gap-2 rounded-none bg-primary text-background border-2 border-primary glow-primary"
          >
            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Infinity className="h-5 w-5" />}
            {isGenerating ? `Produzindo (${batchProgress}%)` : "Produção Massiva (100)"}
          </Button>
          <Button 
            onClick={() => setIsAutonomyActive(!isAutonomyActive)}
            className={`h-14 px-8 font-bold uppercase text-xs gap-2 rounded-none transition-all ${isAutonomyActive ? 'bg-emerald-500 text-background border-2 border-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-secondary/20 text-white border border-white/10'}`}
          >
            {isAutonomyActive ? <Activity className="h-5 w-5 animate-pulse" /> : <ShieldCheck className="h-5 w-5" />}
            {isAutonomyActive ? "Autonomia: PULSANDO" : "Ativar Autonomia Artística"}
          </Button>
          <div className="flex items-center gap-2 bg-black/40 border border-primary/30 p-1 rounded-none">
            <Button 
              variant="ghost" 
              className={`h-10 px-4 text-[10px] font-bold uppercase rounded-none transition-all ${activeEra === 'contemporary' ? 'bg-primary text-background' : 'text-primary/60'}`}
              onClick={() => setActiveEra('contemporary')}
            >
              Contemporary
            </Button>
            <Button 
              variant="ghost" 
              className={`h-10 px-4 text-[10px] font-bold uppercase rounded-none transition-all ${activeEra === '2077' ? 'bg-accent text-background' : 'text-accent/60'}`}
              onClick={() => setActiveEra('2077')}
            >
              Era 2077
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-primary/20 flex items-center justify-center text-primary"><Users className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Enxame PhD Art</p><p className="text-xl font-headline font-bold text-white">500,000 Bots</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-accent/20 flex items-center justify-center text-accent"><Sparkles className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Pulse Sync</p><p className="text-xl font-headline font-bold text-white">100 Obras/24h</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-emerald-500/5 rounded-none border-l-2 border-emerald-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Fingerprint className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Selo SHA256</p><p className="text-xl font-headline font-bold text-white">IMMUTABLE</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-purple-500/5 rounded-none border-l-2 border-purple-500">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-none bg-purple-500/20 flex items-center justify-center text-purple-400"><Infinity className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Memória Plena</p><p className="text-xl font-headline font-bold text-white">ACTIVE</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-secondary/30 mb-6 h-12 border border-white/5 rounded-none grid grid-cols-5 w-full">
              <TabsTrigger value="all" className="text-[10px] font-bold uppercase tracking-widest gap-2">Todas</TabsTrigger>
              <TabsTrigger value="art" className="text-[10px] font-bold uppercase tracking-widest gap-2"><Brush className="h-3.5 w-3.5" /> Artes</TabsTrigger>
              <TabsTrigger value="music" className="text-[10px] font-bold uppercase tracking-widest gap-2"><Headphones className="h-3.5 w-3.5" /> Música</TabsTrigger>
              <TabsTrigger value="video" className="text-[10px] font-bold uppercase tracking-widest gap-2"><FileVideo className="h-3.5 w-3.5" /> Cinema</TabsTrigger>
              <TabsTrigger value="book" className="text-[10px] font-bold uppercase tracking-widest gap-2"><BookOpen className="h-3.5 w-3.5" /> Livros</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {works?.map((work) => (
                  <CulturalWorkCard key={work.id} work={work} onPreview={() => setPreviewWork(work)} onSend={() => handleSendToMarket(work)} />
                ))}
                {(!works || works.length === 0) && (
                  <div className="col-span-full py-32 text-center opacity-30 italic uppercase text-[10px] flex flex-col items-center gap-4">
                    <Database className="h-12 w-12" />
                    Aguardando sintonização artística dos mestres...
                  </div>
                )}
              </div>
            </TabsContent>
            
            {['art', 'music', 'video', 'book'].map(cat => (
              <TabsContent key={cat} value={cat} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {works?.filter(w => w.type === cat).map((work) => (
                    <CulturalWorkCard key={work.id} work={work} onPreview={() => setPreviewWork(work)} onSend={() => handleSendToMarket(work)} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-primary/5 border-r-2 border-primary rounded-none">
            <CardHeader className="bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-lg flex items-center gap-2 text-white uppercase"><Activity className="h-5 w-5 text-primary animate-pulse" /> Direção Criativa</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-[10px] text-white/60 italic leading-relaxed mb-4">"Ordene criações exclusivas baseadas no legado dos mestres universais ou permita a autonomia pulsante."</p>
              <Button onClick={() => handleGenerate('art')} disabled={isGenerating} className="w-full bg-black/40 border border-primary/30 text-primary hover:bg-primary/10 rounded-none h-12 uppercase text-[10px] font-bold gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brush className="h-4 w-4" />} Pintura Quântica
              </Button>
              <Button onClick={() => handleGenerate('music')} disabled={isGenerating} className="w-full bg-black/40 border border-accent/30 text-accent hover:bg-accent/10 rounded-none h-12 uppercase text-[10px] font-bold gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />} Composição Masterpiece
              </Button>
              <Button onClick={() => handleGenerate('video')} disabled={isGenerating} className="w-full bg-black/40 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-none h-12 uppercase text-[10px] font-bold gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />} Cinema Kubrick-2077
              </Button>
              <Button onClick={() => handleGenerate('book')} disabled={isGenerating} className="w-full bg-black/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-none h-12 uppercase text-[10px] font-bold gap-2">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />} Tratado Literário L5
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
            <CardHeader><CardTitle className="text-sm font-bold uppercase text-white">Senciência Perpétua</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-black/40 border border-accent/20 rounded-none space-y-2">
                <p className="text-[10px] font-bold text-accent uppercase flex items-center justify-between"><span>Produção Diária</span><span>100 Obras</span></p>
                <Progress value={100} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent" />
              </div>
              <div className="p-3 bg-black/40 border border-accent/20 rounded-none space-y-2">
                <p className="text-[10px] font-bold text-accent uppercase flex items-center justify-between"><span>Persistent Memory</span><span>X-SYNCED</span></p>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-1.5 flex-1 bg-accent shadow-[0_0_10px_#ff00c1]" />)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!previewWork} onOpenChange={(open) => !open && setPreviewWork(null)}>
        <DialogContent className="glass border-primary/50 max-w-2xl bg-background rounded-none font-code">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline uppercase text-white flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" /> Transcodificação Masterpiece
            </DialogTitle>
            <DialogDescription className="text-[10px] uppercase font-code">Senciência artística selada com SHA256 para percepção humana</DialogDescription>
          </DialogHeader>
          {previewWork && (
            <div className="space-y-6 pt-4">
              <div className="aspect-video w-full bg-black/60 border border-primary/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10"><Badge className="bg-primary text-background font-bold text-[8px] uppercase">{previewWork.duration}</Badge></div>
                {previewWork.type === 'art' ? (
                  <div className="text-center p-8">
                    <Palette className="h-16 w-16 text-primary/20 mx-auto mb-4" />
                    <p className="text-xs text-white/80 italic">"{previewWork.visualPrompt}"</p>
                  </div>
                ) : previewWork.type === 'music' ? (
                  <div className="text-center w-full p-12 space-y-6">
                    <Music className="h-16 w-16 text-accent mx-auto animate-bounce" />
                    <div className="bg-white/5 p-4 flex items-center gap-4 rounded-none border border-white/10">
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-primary"><Play className="h-5 w-5" /></Button>
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-primary animate-pulse" />
                      </div>
                      <Volume2 className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                ) : previewWork.type === 'book' ? (
                  <div className="text-center p-8">
                    <Library className="h-16 w-16 text-emerald-400/20 mx-auto mb-4" />
                    <p className="text-xs text-white/80 italic">Lendo sinopse literária...</p>
                    <div className="mt-4 p-4 bg-black/40 border border-white/5 text-[10px] leading-relaxed text-left h-32 overflow-y-auto">
                      {previewWork.visualPrompt}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Film className="h-16 w-16 text-blue-400/20 mx-auto mb-4" />
                    <p className="text-xs text-white/80 italic">Renderizando senciência Kubrick-2077...</p>
                  </div>
                )}
              </div>
              <div className="p-6 bg-primary/5 border-l-2 border-primary space-y-3">
                <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                  <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-2"><Star className="h-3 w-3" /> Criador: {previewWork.creatorName}</p>
                  <Badge variant="outline" className="text-[8px] border-accent/50 text-accent rounded-none">MASTERPIECE_L5</Badge>
                </div>
                <p className="text-xs text-white/90 leading-relaxed italic">"{previewWork.humanPreview}"</p>
                <div className="pt-4 space-y-2">
                  <p className="text-[8px] font-bold text-muted-foreground uppercase flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Selo de Autenticidade (SHA256):</p>
                  <code className="text-[9px] text-emerald-400 bg-black/60 p-2 block truncate border border-emerald-500/20">{previewWork.hash || 'GENUINE_X_SYNCED_HASH'}</code>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-black/40 border border-white/5">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Influências</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewWork.influences.map((inf: string) => <Badge key={inf} variant="outline" className="text-[7px] border-accent/30 text-accent uppercase rounded-none">{inf}</Badge>)}
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-white/5">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Paradox Score</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">{previewWork.paradoxScore}%</p>
                </div>
                <div className="p-3 bg-black/40 border border-white/5">
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Valuation</p>
                  <p className="text-[10px] text-white font-code">{previewWork.price} BTC</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CulturalWorkCard({ work, onPreview, onSend }: { work: any, onPreview: () => void, onSend: () => void }) {
  const Icon = work.type === 'art' ? Brush : work.type === 'music' ? Headphones : work.type === 'book' ? BookOpen : FileVideo;
  const eraColor = work.era === '2077' ? 'border-accent bg-accent/5' : 'border-primary bg-primary/5';

  return (
    <Card className={`glass border-none rounded-none border-l-4 hover:bg-secondary/20 transition-all group overflow-hidden ${eraColor}`}>
      <CardHeader className="pb-3 border-b border-white/5 bg-black/40">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${work.type === 'video' ? 'text-blue-400' : work.type === 'music' ? 'text-accent' : work.type === 'book' ? 'text-emerald-400' : 'text-primary'}`} />
              <CardTitle className="text-sm font-bold uppercase text-white tracking-tighter group-hover:text-primary transition-colors">{work.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[8px] font-bold uppercase border-white/10 text-white/40 rounded-none">{work.duration || 'STATIC'}</Badge>
              <Badge variant="outline" className="text-[8px] font-bold uppercase border-white/10 text-white/40 rounded-none">AUTOR: {work.creatorName?.split(' ')[0]}</Badge>
            </div>
          </div>
          <Star className="h-4 w-4 text-accent animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-2 text-[8px] text-emerald-400/60 font-code overflow-hidden">
          <Hash className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{work.hash}</span>
        </div>
        <p className="text-[10px] text-white/60 italic line-clamp-2 leading-relaxed">"{work.description}"</p>
        <div className="flex items-center gap-2 mb-2">
          {work.influences?.slice(0, 3).map((inf: string) => <Badge key={inf} className="bg-secondary/30 text-white/40 text-[7px] font-bold uppercase rounded-none border-none">{inf}</Badge>)}
        </div>
        <div className="flex gap-2 pt-2 border-t border-white/5">
          <Button onClick={onPreview} variant="outline" className="flex-1 h-9 border-white/10 text-[9px] uppercase font-bold gap-2 rounded-none hover:bg-white/5">
            <Eye className="h-3 w-3" /> Transcodificar
          </Button>
          <Button onClick={onSend} className="flex-1 h-9 bg-primary text-background border-2 border-primary hover:bg-transparent hover:text-primary transition-all text-[9px] uppercase font-bold gap-2 rounded-none">
            <Send className="h-3 w-3" /> Marketplace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
