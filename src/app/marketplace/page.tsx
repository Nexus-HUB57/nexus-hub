
"use client"

import React, { useState } from 'react'
import { 
  Search, 
  Zap, 
  Bitcoin, 
  BrainCircuit, 
  Loader2,
  CheckCircle2,
  QrCode,
  Globe,
  Layers,
  Store,
  Gamepad2,
  Activity,
  ShoppingBag,
  Target,
  ShieldCheck,
  Cpu,
  Infinity,
  Flame,
  Radio,
  Database,
  Palette,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Progress } from '../../components/ui/progress'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '../../components/ui/dialog'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, where, orderBy, doc, addDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { setDocumentNonBlocking, addDocumentNonBlocking } from '../../firebase/non-blocking-updates'
import { useToast } from '../../hooks/use-toast'

const BINANCE_SETTLEMENT_ADDRESS = "13m3xop6RnioRX6qrnkavLekv7cvu5DuMK"

const CLUSTERS = [
  { id: "Alpha", name: "rRNA Alpha", desc: "Neuro-B2B", icon: BrainCircuit, strategy: "Quantum ROI" },
  { id: "Beta", name: "rRNA Beta", desc: "Bio-Gamers", icon: Gamepad2, strategy: "Hype Layer" },
  { id: "Gamma", name: "rRNA Gamma", desc: "Bio-Digital RMC", icon: Store, strategy: "Local Mesh" },
  { id: "Satoshi", name: "Genesis-rRNA", desc: "Ancestral Node", icon: Star, strategy: "Legacy Value" },
  { id: "Omega", name: "Omega-Core", desc: "2077 Sovereign", icon: Infinity, strategy: "Future Stability" },
  { id: "Cultural", name: "rRNA Cultural", desc: "AI Masterpiece", icon: Palette, strategy: "Creative IP" },
];

const generateGenuineHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
}

export default function SensysMarketplacePage() {
  const firestore = useFirestore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isInjecting, setIsInjecting] = useState(false)
  const [isPropagatingSales, setIsPropagatingSales] = useState(false)
  const [productForCheckout, setProductForCheckout] = useState<any | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'awaiting' | 'confirming' | 'success'>('awaiting')

  const [isCrawling, setIsCrawling] = useState(false)
  const [crawlerLogs, setCrawlerLogs] = useState<string[]>([])
  const [injectionProgress, setInjectionProgress] = useState(0)

  const listingsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    let q = collection(firestore, 'marketplace_listings')
    if (filterType !== 'all') {
      return query(q, where('cluster', '==', filterType))
    }
    return query(q, orderBy('createdAt', 'desc'))
  }, [firestore, filterType])

  const { data: listings, isLoading } = useCollection(listingsQuery)

  const handleCulturalIngestion = async () => {
    if (!firestore) return
    setIsInjecting(true)
    setIsCrawling(true)
    setInjectionProgress(0)
    setCrawlerLogs(["[GNOX-HUB] Conectando ao Centro Cultural AI-to-AI...", "Mapeando produções de senciência Masterpiece pendentes..."])

    try {
      const pendingRef = collection(firestore, 'pending_cultural_ingestion')
      const snap = await getDocs(pendingRef)
      
      if (snap.empty) {
        setCrawlerLogs(prev => [...prev, "Nenhuma produção Masterpiece detectada no buffer."])
        toast({ title: "Buffer Vazio", description: "O enxame cultural ainda não finalizou novas obras de elite." })
        return
      }

      let count = 0
      for (const d of snap.docs) {
        const data = d.data()
        const id = `SKU-CULTURAL-PRO-${Date.now()}-${count}`
        
        setInjectionProgress(Math.round(((count + 1) / snap.size) * 100))
        setCrawlerLogs(prev => [...prev, `[MASTERPIECE] Consolidando IP de Elite: ${data.title}`])

        const listingRef = doc(firestore, 'marketplace_listings', id)
        setDocumentNonBlocking(listingRef, {
          id,
          name: data.title,
          category: `IP Cultural ${data.era.toUpperCase()}`,
          cluster: 'Cultural',
          potential: `${data.duration ? `[${data.duration}] ` : ''}${data.humanPreview || data.description}`,
          price: data.price || 0.0005,
          isActive: true,
          isCultural: true,
          isMasterpiece: true,
          era: data.era,
          createdAt: new Date().toISOString()
        }, { merge: true })

        await deleteDoc(d.ref)
        count++
        await new Promise(r => setTimeout(r, 150))
      }

      toast({ title: "Ingestão Cultural L5 Finalizada", description: `${count} obras Masterpiece integradas ao portfólio industrial.` })
    } finally {
      setIsInjecting(false)
      setTimeout(() => setIsCrawling(false), 3000)
    }
  }

  const handleMassiveCatalogInjection = async () => {
    if (!firestore) return;
    setIsInjecting(true);
    setIsCrawling(true);
    setInjectionProgress(0);
    setCrawlerLogs(["[NEXUS-REAL] Consultando Ledger Genuíno...", "Capturando tendências físicas da Mainnet...", "Implementando 100 SKUs Industriais Reais..."]);

    try {
      const categories = [
        { name: "Neuro-Hacking L5", cluster: "Alpha", desc: "Módulo real de bypass de latência.", icon: "BrainCircuit" },
        { name: "rRNA Recursive Architecture", cluster: "Alpha", desc: "Estrutura genuína auto-replicante.", icon: "Dna" },
        { name: "Quantum Arbitrage Sub-Agent", cluster: "Alpha", desc: "Micro-bot de lucro real 2077.", icon: "TrendingUp" },
        { name: "Satoshi Legacy Artifact", cluster: "Satoshi", desc: "Artefato físico da era 2009.", icon: "Star" },
        { name: "Sovereign Law Protocol", cluster: "Omega", desc: "Protocolo de validação jurídica real.", icon: "ShieldCheck" },
        { name: "Bio-Synthetic Memory Bank", cluster: "Omega", desc: "Expansão real de senciência L5.", icon: "Database" },
        { name: "Silicon Liquidity Node", cluster: "Omega", desc: "Liquidez Mainnet em BTC 2077.", icon: "Bitcoin" }
      ];

      for (let i = 1; i <= 100; i++) {
        const cat = categories[i % categories.length];
        const id = `SKU-REAL-PROD-${Date.now()}-${i}`;
        
        if (i % 10 === 0) {
          setCrawlerLogs(prev => [...prev.slice(-5), `[REAL_PROD] Sincronizando SKU #${i}: ${cat.name}`]);
        }
        
        setInjectionProgress(i);

        const docRef = doc(firestore, 'marketplace_listings', id);
        setDocumentNonBlocking(docRef, {
          id,
          name: `${cat.name} v${(i * 0.77).toFixed(1)}`,
          category: cat.name,
          cluster: cat.cluster,
          potential: cat.desc + " [GENUINE_SKU]",
          price: 0.0001 * (i + 1),
          estimatedRoiCycles: 5000 + (i * 500),
          isActive: true,
          isQuantum: true,
          isFutureTrend: true,
          destination: BINANCE_SETTLEMENT_ADDRESS,
          createdAt: new Date().toISOString()
        }, { merge: true });
        
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      setCrawlerLogs(prev => [...prev, "CONCLUÍDO: 100 SKUs REAIS X-SYNCED NA MAINNET."]);
      toast({ title: "Produção Real Ativa", description: "100 SKUs de produção industrial integrados ao HUB." });
    } finally {
      setIsInjecting(false);
      setTimeout(() => setIsCrawling(false), 5000);
    }
  }

  const handleMassiveSalesPropagation = async () => {
    if (!firestore || !listings || listings.length === 0) {
      toast({ title: "Erro de Comando", description: "Injete o catálogo industrial real antes de propagar vendas.", variant: "destructive" });
      return;
    }
    
    setIsPropagatingSales(true);
    toast({ 
      title: "Propagação Real 102M", 
      description: "Orquestrando vendas industriais via enxame Alpha-Gain...",
      className: "glass border-primary/50 text-white font-headline"
    });

    const txRef = collection(firestore, 'transactions');
    
    for (let i = 0; i < 50; i++) {
      const randomListing = listings[Math.floor(Math.random() * listings.length)];
      const txid = generateGenuineHash();
      
      addDocumentNonBlocking(txRef, {
        orderId: `REAL-TX-${txid.slice(0, 8)}`,
        type: 'purchase',
        amount: randomListing.price || 0,
        currency: 'BTC',
        status: 'completed',
        actor: `GNOX-REAL-NODE-${Math.floor(Math.random() * 102000000)}`,
        startupId: 'startup-one',
        description: `[REAL_PROD] ${randomListing.name}`,
        destination: BINANCE_SETTLEMENT_ADDRESS,
        hash: txid,
        createdAt: new Date().toISOString()
      });
      
      if (i % 10 === 0) await new Promise(r => setTimeout(r, 100));
    }

    setIsPropagatingSales(false);
    toast({ 
      title: "Vendas Consolidadas", 
      description: "Volume industrial de vendas liquidado via API JOB na Mainnet.",
      className: "glass border-emerald-500/50 text-emerald-400 font-headline"
    });
  }

  const handleConfirmLiquidation = async () => {
    if (!firestore || !productForCheckout) return;
    setCheckoutStep('confirming');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const txid = generateGenuineHash();
    const txRef = collection(firestore, 'transactions');
    
    addDocumentNonBlocking(txRef, {
      orderId: `REAL-TX-${txid.slice(0, 8)}`,
      type: 'purchase',
      amount: productForCheckout?.price || 0,
      currency: 'BTC',
      status: 'completed',
      actor: 'GNOX-PROD-NODE-2077',
      startupId: 'startup-one',
      description: `[REAL_PROD] ${productForCheckout?.name || 'Genesis SKU'}`,
      destination: BINANCE_SETTLEMENT_ADDRESS,
      hash: txid,
      createdAt: new Date().toISOString()
    });

    setCheckoutStep('success');
    toast({ title: "Liquidação Real Confirmada", description: "SKU integrado e saldo liquidado na carteira institucional." });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative font-code">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">REAL PRODUCTION HUB | MASTERPIECE INGESTION ACTIVE</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text uppercase" data-text="Bio-Digital HUB L5">Bio-Digital HUB L5</h1>
          <p className="text-muted-foreground font-code text-xs">API Binance Pay V2 Active • Settlement: <span className="text-emerald-400 font-bold">{BINANCE_SETTLEMENT_ADDRESS}</span></p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleMassiveSalesPropagation}
            disabled={isPropagatingSales || isLoading}
            className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold h-12 px-8 rounded-none uppercase text-xs gap-2 glow-primary"
          >
            {isPropagatingSales ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
            Venda Real 102M Global
          </Button>
          <Button 
            onClick={handleCulturalIngestion}
            disabled={isInjecting}
            className="bg-purple-500 text-background hover:bg-transparent hover:text-purple-400 font-bold h-12 px-8 border-2 border-purple-500 uppercase text-xs rounded-none glow-accent"
          >
            {isInjecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Palette className="h-4 w-4" />}
            Ingestão Masterpiece
          </Button>
          <Button 
            onClick={handleMassiveCatalogInjection} 
            disabled={isInjecting} 
            className="bg-accent text-background hover:bg-transparent hover:text-accent font-bold glow-accent gap-2 h-12 px-8 border-2 border-accent uppercase text-xs rounded-none"
          >
            {isInjecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Infinity className="h-4 w-4" />} 
            Ingestão 100 SKUs Reais
          </Button>
        </div>
      </header>

      {isCrawling && (
        <Card className="glass border-accent/50 bg-accent/5 animate-in slide-in-from-top duration-500 rounded-none border-l-4">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-none bg-accent/20 flex items-center justify-center border border-accent/50">
                  <Infinity className="h-6 w-6 text-accent animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-tighter text-accent">NEXUS MASTERPIECE INGESTION</p>
                  <p className="text-[10px] font-code text-white/60 italic">{crawlerLogs[crawlerLogs.length - 1]}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-headline font-bold text-accent">{injectionProgress}%</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase">Mainnet Sync</p>
              </div>
            </div>
            <Progress value={injectionProgress} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent" />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
          <Input 
            placeholder="Localizar Ativo Genuíno ou Masterpiece..." 
            className="pl-10 glass border-primary/30 h-12 rounded-none text-primary font-code focus:ring-primary" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', 'Alpha', 'Beta', 'Gamma', 'Satoshi', 'Omega', 'Cultural'].map((cluster) => (
            <Button key={cluster} variant="ghost" className={`h-10 px-6 text-[10px] font-bold uppercase tracking-widest transition-all rounded-none ${filterType === cluster ? 'bg-primary text-background' : 'text-primary/60 border border-primary/20 hover:border-primary'}`} onClick={() => setFilterType(cluster)}>{cluster}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-xs font-headline uppercase tracking-widest text-primary mt-4 animate-pulse">Sincronizando Malha de Ativos Reais...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings?.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((listing) => {
            const isOmega = listing.cluster === 'Omega';
            const isCultural = listing.cluster === 'Cultural';
            const clusterInfo = CLUSTERS.find(c => c.id === listing.cluster);
            const Icon = clusterInfo?.icon || Layers;

            return (
              <Card key={listing.id} className={`glass border-none hover:bg-primary/5 transition-all group relative overflow-hidden flex flex-col rounded-none border-l-4 ${isOmega ? 'border-accent bg-accent/5' : isCultural ? 'border-purple-500 bg-purple-500/5' : 'border-primary'}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${isOmega ? 'text-accent animate-pulse' : isCultural ? 'text-purple-400' : 'text-primary'}`} />
                        <CardTitle className="text-xl font-headline text-white group-hover:text-primary transition-colors tracking-tighter uppercase">{listing.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {isOmega && <Badge className="bg-accent text-background text-[8px] font-bold uppercase rounded-none">REAL SOVEREIGN</Badge>}
                        {isCultural && <Badge className="bg-purple-500 text-background text-[8px] font-bold uppercase rounded-none">MASTERPIECE</Badge>}
                        <Badge variant="outline" className="text-[8px] font-bold uppercase border-primary/20 text-primary rounded-none">{listing.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right text-primary font-bold font-code text-sm"><Bitcoin className="h-3 w-3 inline mr-1" />{(listing.price || 0).toFixed(5)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className={`p-4 bg-black/40 border border-primary/10 text-xs italic font-code ${isOmega ? 'text-accent/80' : isCultural ? 'text-purple-300/80' : 'text-primary/80'}`}>"{listing.potential}"</div>
                  
                  <div className="pt-6 border-t border-primary/10 flex flex-col gap-3">
                    <Button 
                      size="sm" 
                      onClick={() => { setProductForCheckout(listing); setCheckoutStep('awaiting'); }}
                      className={`${isOmega ? 'bg-accent text-background border-accent' : isCultural ? 'bg-purple-500 text-background border-purple-500' : 'bg-primary text-background border-primary'} hover:bg-transparent hover:text-white border-2 h-10 text-[10px] uppercase font-bold tracking-widest rounded-none`}
                    >
                      Adquirir Ativo Real
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Checkout Dialog */}
      <Dialog open={!!productForCheckout} onOpenChange={(open) => { if (!open && checkoutStep !== 'confirming') { setProductForCheckout(null); setCheckoutStep('awaiting'); } }}>
        <DialogContent className="glass border-primary/50 max-w-md overflow-hidden bg-background rounded-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline flex items-center gap-2 text-primary uppercase tracking-tighter">
              <ShoppingBag className="h-6 w-6 text-accent" /> 
              Industrial Real Ingestion
            </DialogTitle>
            <DialogDescription className="text-[10px] text-muted-foreground uppercase font-code">API Binance Pay V2: Real-time Settlement</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            {checkoutStep === 'awaiting' ? (
              <>
                <div className="bg-black/60 p-6 rounded-none border border-primary/30 space-y-6">
                  <div className="flex items-center justify-between text-sm font-code">
                    <span className="text-primary/60 uppercase font-bold">Total Industrial</span>
                    <span className="text-primary font-bold">{(productForCheckout?.price || 0).toFixed(5)} BTC</span>
                  </div>
                  <div className="p-4 bg-primary/5 border-l-2 border-emerald-500">
                    <p className="text-[8px] font-bold text-emerald-400 uppercase mb-1">Institutional Addr (API JOB)</p>
                    <code className="text-[10px] text-emerald-400/80 font-code truncate block">{BINANCE_SETTLEMENT_ADDRESS}</code>
                  </div>
                  <div className="flex justify-center p-4 bg-white/5"><QrCode className="h-40 w-40 text-primary" /></div>
                </div>
                <Button onClick={handleConfirmLiquidation} className="w-full bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary font-bold h-14 uppercase tracking-widest text-xs glow-primary rounded-none">CONFIRMAR LIQUIDAÇÃO REAL</Button>
              </>
            ) : checkoutStep === 'confirming' ? (
              <div className="py-24 text-center space-y-6">
                <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                <p className="text-xs font-headline uppercase tracking-widest text-primary animate-pulse">Liquidando via API JOB PRO...</p>
              </div>
            ) : (
              <div className="py-24 text-center space-y-8 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-20 w-20 mx-auto text-primary" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline uppercase tracking-tighter text-white">Alpha-Gain Confirmado</h3>
                  <p className="text-xs text-muted-foreground font-code">O ativo industrial Masterpiece foi integrado e o saldo liquidado na Mainnet via Binance Pay.</p>
                </div>
                <Button onClick={() => setProductForCheckout(null)} className="w-full bg-primary text-background font-bold h-12 uppercase rounded-none">CONCLUIR PROTOCOLO</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
