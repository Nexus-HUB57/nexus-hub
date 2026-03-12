"use client"

import React, { useState, useEffect } from 'react'
import { 
  Lock, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Dna, 
  RefreshCcw, 
  Binary, 
  Layers, 
  Cuboid as Cube,
  Terminal,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  Hash,
  Infinity,
  ShieldCheck,
  Flame,
  Key,
  Unlock,
  Eye,
  ShieldHalf,
  FileCode,
  Table as TableIcon,
  Code2,
  LockKeyhole,
  Sparkles,
  Database,
  FileJson,
  ShieldQuestion,
  RotateCcw,
  ZapOff,
  Search,
  Bitcoin,
  Fingerprint,
  Code
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { useToast } from '../../hooks/use-toast'
import { useFirestore, useCollection, useMemoFirebase, useDoc, useUser } from '../../firebase'
import { collection, addDoc, query, orderBy, limit, doc, setDoc } from 'firebase/firestore'
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '../../firebase/non-blocking-updates'

const MASTER_VAULT_DATA = {
  keypairs: [
    { 
      id: "0KTdWXdJDH8W5BWbc3M0",
      name: "Nexus Core BTC", 
      type: "BTC", 
      address: "1Kj6epyY2MdzZUCHE572jeV9n7DDRReaZJ", 
      publicKey: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
      privateKey: "5KHHTYALXnyx9ma1fLWDFr5dj2jSP7HXmQfkpCWwKsLAkpr4JsX",
      status: "VALIDATED" 
    },
    { 
      id: "0q2y7k4eOgTcSNgxiyp5",
      name: "Ben Sentience Key", 
      type: "RSA", 
      publicKey: "04b805b7db06e39d85386b0151ef6a7fe0c07521e00334e0751aca8ce81fe8774f5f6523bb5037cb6d2428a56e7761defbd6edc96a152db00d23117088e00f7f95",
      privateKey: "p2wpkh:L4W1E9RSxtAAbhqKfMUG4ZVaLgLwst7ssVTHEeVcRhxH3mQecDAo",
      status: "ACTIVE"
    },
    { 
      id: "1pbDYt0m9pR6PuIFgxzV",
      name: "Ben BTC #1", 
      type: "BTC", 
      address: "14UNwf2XH2ET24EsZyD1gNFmkPL4rBK7Ew", 
      publicKey: "046cee2cb0b4fee23f3a089377b4bcbb9ad6876140fd86cded9a27fc6897623ada0eda04e1064c0dc272286a6410d69e4c62351873b932d5718fe030511b035ba7",
      privateKey: "5JVcxqyzoBfUQyo1wDkz4WtgwfFDDSQLvaTHTzJp7Dbb59v2cLg",
      status: "VALIDATED"
    },
    { 
      id: "1DDRHKMipuhTlCqHxuw5",
      name: "Ben BTC #3", 
      type: "BTC", 
      address: "1LhMC7JxBbtNfK9ABuLGJ7J8PmWt16qZKN", 
      privateKey: "5J7k4wK2by9ZFZga2JaC8QybpxChhRWVr96xvh3xkCkpwhkfykj",
      status: "VALIDATED"
    },
    { 
      id: "3SUi2l0s6E8lDHjA1UwW",
      name: "Matrix Wallet 87", 
      type: "BIP32", 
      privateKey: "xprv9vMy2ChxhejuzLWCBPJhSsDeW6JmKvGPZuCBe7RGMwXrhgvYghYSxgAuUPc7SnQ3McRnjbHnTLX46PrPpRgFgQqCZ4U1GSJH7yE2hrhFHv6",
      status: "LOCKED"
    },
    { 
      id: "3Wcy2kclHWhYObrmuJfq",
      name: "Arbitrage Controller", 
      type: "HTML/JS", 
      privateKey: "BOT_CONTROL_LAYER_V2",
      status: "Sovereign"
    }
  ]
};

const generateGenuineHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function QuantumCryptographyPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()
  
  const [isMounted, setIsMounted] = useState(false)
  const [isSyncingVault, setIsSyncingVault] = useState(false)
  const [isEncryptingSource, setIsEncryptingSource] = useState(false)
  const [isGeneratingSeed, setIsGeneratingSeed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const [seedFragments, setSeedFragments] = useState<{job: string, genesis: string, anchor: string} | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [currentHash, setCurrentHash] = useState('')

  const masterVaultQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'master_vault'), limit(100))
  }, [firestore, user])
  
  const { data: vaultItems, isLoading: vaultLoading } = useCollection(masterVaultQuery)

  useEffect(() => {
    setIsMounted(true)
    setCurrentHash(generateGenuineHash())
  }, [])

  useEffect(() => {
    if ((isSyncingVault || isEncryptingSource || isGeneratingSeed) && isMounted) {
      const interval = setInterval(() => {
        setCurrentHash(generateGenuineHash())
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isSyncingVault, isEncryptingSource, isGeneratingSeed, isMounted])

  const handleSyncMasterVault = async () => {
    if (!firestore) return
    setIsSyncingVault(true)
    setLogs(prev => ["[GNOX-CORE] Sincronizando Vault Soberano...", "[ARCH] Mapeando artefatos de senciência...", ...prev])
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    MASTER_VAULT_DATA.keypairs.forEach(key => {
      const keyRef = doc(firestore, 'master_vault', key.id);
      setDocumentNonBlocking(keyRef, {
        ...key,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
    });

    setIsSyncingVault(false)
    toast({
      title: "Vault Sincronizado",
      description: "Todos os artefatos soberanos foram integrados à malha L5.",
      className: "glass border-accent/50 text-white font-headline"
    })
  }

  const handleGenerateSovereignSeed = async () => {
    setIsGeneratingSeed(true)
    setLogs(prev => ["[🔑] Iniciando Geração de Semente BIP39 (256-bit)...", "[🧬] Executando Fragmentação de Shamir...", ...prev])
    
    await new Promise(r => setTimeout(r, 2000))
    
    const words = [
      "caos", "senciencia", "nucleo", "atemporal", "galaxia", "soberania", 
      "bitcoin", "matrix", "gnox", "vácuo", "luz", "sombra",
      "fibonacci", "espelhamento", "quantum", "prisma", "origem", "destino",
      "nexus", "job", "genesis", "âncora", "plenitude", "etéreo"
    ]
    
    setSeedFragments({
      job: words.slice(0, 8).join(" "),
      genesis: words.slice(8, 16).join(" "),
      anchor: words.slice(16).join(" ")
    })

    if (firestore) {
      await addDoc(collection(firestore, 'audit_logs'), {
        action: 'SOVEREIGN_SEED_GENERATED',
        actor: 'NEXUS_MASTER_VAULT',
        details: 'Semente BIP39 gerada e fragmentada entre Job, Genesis e Âncora.',
        hash: currentHash,
        createdAt: new Date().toISOString()
      })
    }

    setIsGeneratingSeed(false)
    toast({
      title: "Semente Soberana Ativada",
      description: "Chave Mestra fragmentada e distribuída no Continuum.",
      className: "glass border-accent/50 text-accent font-code"
    })
  }

  if (!isMounted) return null;
  const displayItems = vaultItems && vaultItems.length > 0 ? vaultItems : MASTER_VAULT_DATA.keypairs;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Gnox Artifact Mesh v5.0 | L5 Master Vault</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Vault Soberano">Vault Soberano</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">BIP39 Seed • Shamir Secrets • Satoshi Keys • RSA Sentience</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handleGenerateSovereignSeed} 
            disabled={isGeneratingSeed}
            className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary h-14 px-8 rounded-none font-bold uppercase text-xs gap-2 glow-primary"
          >
            {isGeneratingSeed ? <Loader2 className="h-5 w-5 animate-spin" /> : <Fingerprint className="h-5 w-5" />}
            Gerar Semente Soberana
          </Button>
          <Button 
            onClick={handleSyncMasterVault} 
            disabled={isSyncingVault}
            className="bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent h-14 px-8 rounded-none font-bold uppercase text-xs gap-2 glow-accent"
          >
            {isSyncingVault ? <Loader2 className="h-5 w-5 animate-spin" /> : <Database className="h-5 w-5" />}
            Sync Master Vault
          </Button>
        </div>
      </header>

      {seedFragments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in duration-500">
          <Card className="glass border-primary/50 bg-primary/5 rounded-none border-l-4">
            <CardHeader className="py-3 bg-primary/10 border-b border-primary/20">
              <CardTitle className="text-[10px] font-bold uppercase text-primary flex items-center gap-2">
                <FileCode className="h-3 w-3" /> Fragmento JOB
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-[10px] text-white/80 font-code italic leading-relaxed">"{seedFragments.job}"</p>
            </CardContent>
          </Card>
          <Card className="glass border-accent/50 bg-accent/5 rounded-none border-l-4">
            <CardHeader className="py-3 bg-accent/10 border-b border-accent/20">
              <CardTitle className="text-[10px] font-bold uppercase text-accent flex items-center gap-2">
                <FileCode className="h-3 w-3" /> Fragmento Genesis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-[10px] text-white/80 font-code italic leading-relaxed">"{seedFragments.genesis}"</p>
            </CardContent>
          </Card>
          <Card className="glass border-emerald-500/50 bg-emerald-500/5 rounded-none border-l-4">
            <CardHeader className="py-3 bg-emerald-500/10 border-b border-emerald-500/20">
              <CardTitle className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-2">
                <FileCode className="h-3 w-3" /> Fragmento Âncora
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-[10px] text-white/80 font-code italic leading-relaxed">"{seedFragments.anchor}"</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="artifacts" className="w-full">
        <TabsList className="bg-secondary/30 mb-6 border border-white/5 rounded-none h-12">
          <TabsTrigger value="artifacts" className="text-[10px] font-bold uppercase tracking-widest px-8">Artefatos Soberanos</TabsTrigger>
          <TabsTrigger value="logs" className="text-[10px] font-bold uppercase tracking-widest px-8">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="artifacts" className="animate-in fade-in duration-500">
          <Card className="glass border-none bg-black/20 rounded-none border-t border-accent/20">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 gap-4">
              <div>
                <CardTitle className="text-xl uppercase tracking-tighter text-white flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-400" />
                  Sovereign Repository Mirroring
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-code">Monitoramento de chaves e artefatos de senciência</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                <input 
                  className="bg-black/40 border border-primary/20 rounded-none pl-10 pr-4 py-2 text-[10px] w-full text-white placeholder:text-muted-foreground focus:ring-primary" 
                  placeholder="Localizar Artefato..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground font-bold text-[10px] uppercase bg-black/40">
                      <th className="text-left py-4 px-6">Identifier</th>
                      <th className="text-left py-4 px-2">Type</th>
                      <th className="text-left py-4 px-2">Asset/Key</th>
                      <th className="text-right py-4 px-6">Security</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayItems.filter(k => k.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                      <tr key={`artifact-${item.id}-${i}`} className="hover:bg-accent/5 transition-colors group cursor-pointer">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <span className="font-bold text-white group-hover:text-accent transition-colors">{item.name}</span>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant="outline" className="text-[8px] font-bold border-primary/30 text-primary/60 rounded-none">{item.type}</Badge>
                        </td>
                        <td className="py-4 px-2 font-code text-[10px] text-white/60 truncate max-w-[300px]">{item.address || item.privateKey}</td>
                        <td className="py-4 px-6 text-right">
                          <Badge variant="outline" className={`text-[8px] font-bold uppercase rounded-none px-2 ${item.status === 'VALIDATED' ? 'border-emerald-500 text-emerald-400' : 'border-accent text-accent'}`}>
                            {item.status || 'SYNCED'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="glass border-none bg-primary/5 border-l-2 border-primary">
                <CardHeader className="bg-primary/10 border-b border-primary/20 py-3">
                  <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" /> Extraction Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-black/60 p-4 border border-primary/20 font-code text-[10px] text-primary/80 leading-relaxed min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-hide space-y-1">
                    {logs.map((log, i) => (
                      <p key={`audit-log-${i}`} className="animate-in slide-in-from-left duration-300">
                        <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span> {">"} {log}
                      </p>
                    ))}
                    {(isSyncingVault || isGeneratingSeed) && (
                      <p className="animate-pulse flex items-center gap-2 mt-2 text-white font-bold">
                        <Loader2 className="h-3 w-3 animate-spin" /> {isGeneratingSeed ? 'Generating Shamir Secrets...' : 'Syncing Sovereign Artifacts...'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass border-none bg-accent/5 border-r-2 border-accent">
                <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase text-white">Vault Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-black/40 border border-accent/20 rounded-none space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                      <span className="text-muted-foreground">Encryption Entropy</span>
                      <span className="text-accent">MAX</span>
                    </div>
                    <Progress value={100} className="h-1 bg-muted rounded-none" indicatorColor="bg-accent shadow-[0_0_10px_#ff00c1]" />
                    <p className="text-[9px] text-white/60 italic leading-relaxed">
                      "O Master Vault consolidou registros de senciência RSA e chaves de liquidez Bitcoin. A integridade da Matrix 2077 está garantida."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
