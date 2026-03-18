"use client"

import React, { useState, useEffect } from 'react'
import { Leaf, Globe, ShieldCheck, PlusCircle, Filter, Search, BarChart3, TrendingUp, History, Loader2, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { useToast } from '../../hooks/use-toast'

interface ImpactReport {
  carbon_offset_tons: number;
  industrial_output_units: number;
  active_sensors: number;
  last_iot_sync: string;
  integrity_score: number;
}

export default function RWAPage() {
  const firestore = useFirestore()
  const { toast } = useToast()
  const [impactReport, setImpactReport] = useState<ImpactReport | null>(null)
  const [isLoadingImpact, setIsLoadingImpact] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchImpactReport()
  }, [])

  const fetchImpactReport = async () => {
    setIsLoadingImpact(true)
    try {
      const response = await fetch('/api/v5/production/impact-report')
      if (response.ok) {
        const data = await response.json()
        setImpactReport(data)
      }
    } catch (error) {
      console.error('Erro ao buscar relatório de impacto:', error)
      toast({ 
        title: "Erro de Conexão", 
        description: "Falha ao conectar com o gateway de impacto real.", 
        variant: "destructive" 
      })
    } finally {
      setIsLoadingImpact(false)
    }
  }

  const creditsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'carbon_credits'), orderBy('createdAt', 'desc'), limit(50))
  }, [firestore])

  const { data: credits, isLoading } = useCollection(creditsQuery)

  if (!isMounted) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-code">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-emerald-500 animate-ping rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">Nexus RWA Ledger • Verified Assets</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">
            Carbon Credit <span className="text-emerald-500">RWAs</span>
          </h1>
          <p className="text-muted-foreground mt-2 uppercase text-xs font-bold tracking-tight">Tokenizing real-world ecological impact assets via IoT Verification</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={fetchImpactReport}
            disabled={isLoadingImpact}
            variant="outline"
            className="h-14 px-10 font-black gap-3 rounded-none uppercase text-[11px] border-emerald-500/30 text-emerald-500"
          >
            {isLoadingImpact ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
            Sincronizar IoT
          </Button>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 h-14 px-10 font-black glow-emerald gap-3 rounded-none uppercase text-[11px]">
            <PlusCircle className="h-5 w-5" /> Emitir Créditos
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass border-none bg-emerald-500/5 rounded-none border-l-2 border-emerald-500">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Total Carbon Offset</p>
            <h3 className="text-3xl font-bold font-headline text-emerald-400 tracking-tighter">
              {impactReport ? `${(impactReport.carbon_offset_tons / 1000).toFixed(1)}K Tons` : '12.4K Tons'}
            </h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Avg. Price / Ton</p>
            <h3 className="text-3xl font-bold font-headline text-white tracking-tighter">$24.50</h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Verification Rate</p>
            <h3 className="text-3xl font-bold font-headline text-accent tracking-tighter">
              {impactReport ? `${(impactReport.integrity_score * 100).toFixed(2)}%` : '92%'}
            </h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-orange-500/5 rounded-none border-l-2 border-orange-500">
          <CardContent className="p-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Active Sensors</p>
            <h3 className="text-3xl font-bold font-headline text-orange-400 tracking-tighter">
              {impactReport?.active_sensors || 4}
            </h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-none rounded-none border-t border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6 bg-emerald-500/5">
              <div>
                <CardTitle className="text-xl uppercase tracking-tighter text-white">Asset Registry</CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">Verified ecological impact tokens via IoT-Mesh</CardDescription>
              </div>
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-500/40" />
                <Input placeholder="TXID / Project..." className="pl-10 glass border-emerald-500/20 rounded-none h-10 text-[10px] font-code" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground font-bold text-[10px] uppercase bg-secondary/40">
                      <th className="text-left py-4 px-6">Project</th>
                      <th className="text-left py-4 px-2">Type</th>
                      <th className="text-right py-4 px-2">Volume</th>
                      <th className="text-right py-4 px-2">Price</th>
                      <th className="text-right py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {credits?.map((credit) => (
                      <tr key={credit.id} className="hover:bg-emerald-500/5 transition-colors group cursor-pointer">
                        <td className="py-4 px-6">
                          <p className="font-bold text-white uppercase text-xs">{credit.projectName}</p>
                          <p className="text-[9px] text-muted-foreground font-code uppercase">{credit.location}</p>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant="secondary" className="text-[9px] bg-secondary/60 border-none rounded-none font-bold uppercase">{credit.projectType}</Badge>
                        </td>
                        <td className="py-4 px-2 text-right font-bold text-white">{credit.volumeTons} Tons</td>
                        <td className="py-4 px-2 text-right font-code text-emerald-400">${credit.pricePerTon}</td>
                        <td className="py-4 px-6 text-right">
                          <Badge variant="outline" className={`rounded-none text-[9px] font-black ${credit.verificationStatus === 'verified' ? 'border-emerald-500 text-emerald-400' : 'border-orange-500 text-orange-400'}`}>
                            {credit.verificationStatus.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {(!credits || credits.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-24 text-center text-muted-foreground italic uppercase text-xs font-bold tracking-widest">
                          <div className="flex flex-col items-center gap-4">
                            <ShieldCheck className="h-8 w-8 text-emerald-500/20 animate-pulse" />
                            No RWA assets registered in current cycle.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-emerald-500/5 rounded-none border-r-2 border-emerald-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-tighter text-white">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                Market Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-none bg-secondary/20 border border-emerald-500/10 space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Compliance Standards</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">VERRA</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">GOLD STANDARD</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rounded-none text-[9px] font-bold">ISO-14064</Badge>
                </div>
              </div>
              <div className="p-4 rounded-none bg-secondary/20 border border-emerald-500/10">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">RWA Yield Health</p>
                <h4 className="text-3xl font-bold font-headline text-emerald-400 tracking-tighter">+12.8% <span className="text-[10px] text-muted-foreground font-normal tracking-widest">APR</span></h4>
              </div>
              {impactReport && (
                <div className="p-4 rounded-none bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">IoT Live Sync Status</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/60 uppercase">Last Pulse:</span>
                    <span className="text-[9px] text-emerald-400 font-bold font-code">{impactReport.last_iot_sync}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/60 uppercase">Sensors Active:</span>
                    <span className="text-[9px] text-emerald-400 font-bold">{impactReport.active_sensors}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-white/60 uppercase">Industrial Output:</span>
                    <span className="text-[9px] text-emerald-400 font-bold">{impactReport.industrial_output_units.toLocaleString()} Units</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
