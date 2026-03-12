"use client"

import React, { useState, useEffect } from 'react'
import { 
  Zap, 
  Search, 
  TrendingUp, 
  Target, 
  Globe,
  Activity,
  ArrowUpRight,
  Sparkles,
  Loader2,
  BrainCircuit,
  Terminal,
  Cpu,
  ShieldCheck,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Progress } from '../../components/ui/progress'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { getMarketOracleStrategicInsights, type MarketOracleStrategicInsightsOutput } from '../../ai/flows/market-oracle-strategic-insights'

export default function MarketOracleV2Page() {
  const firestore = useFirestore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiReport, setAiReport] = useState<MarketOracleStrategicInsightsOutput | null>(null)

  const dataQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'market_data'), orderBy('createdAt', 'desc'), limit(20))
  }, [firestore])

  const insightsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'market_insights'), orderBy('createdAt', 'desc'), limit(15))
  }, [firestore])

  const { data: marketData, isLoading: dataLoading } = useCollection(dataQuery)
  const { data: insights, isLoading: insightsLoading } = useCollection(insightsQuery)

  const filteredMarket = marketData?.filter(d => d.asset.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSynthesizeInsights = async () => {
    setIsGenerating(true)
    try {
      const dataStr = marketData?.map(d => `${d.asset}: $${d.price} (${d.sentiment})`).join(', ') || "Nenhum dado disponível"
      const result = await getMarketOracleStrategicInsights({
        marketData: dataStr,
        currentTrends: "Expansão de RWA, Tokenização de rRNA, Economia de Silício 2077"
      })
      setAiReport(result)
    } catch (error) {
      console.error("Falha ao sintetizar insights:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <Badge className="bg-emerald-500 text-emerald-950 font-bold rounded-none">BULLISH</Badge>
      case 'bearish': return <Badge className="bg-red-500 text-red-950 font-bold rounded-none">BEARISH</Badge>
      default: return <Badge variant="secondary" className="bg-secondary rounded-none">NEUTRAL</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-primary pb-20 font-code relative">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-4 w-4 text-primary animate-spin-slow" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Predictive Neural Mesh Active</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Oracle 2077">Oracle 2077</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60 leading-relaxed max-w-xl">Mapeamento de sentimento global e análise preditiva de ativos bio-digitais via Swarm rRNA.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleSynthesizeInsights}
            disabled={isGenerating || dataLoading}
            className="bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary h-12 px-8 font-bold glow-primary gap-2 rounded-none uppercase text-xs"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Sintetizar Inteligência Oracle
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
          {aiReport && (
            <Card className="glass border-primary/50 bg-primary/5 animate-in zoom-in duration-500 rounded-none border-l-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" /> IA Strategic Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-primary uppercase border-b border-primary/20 pb-1">Insights Estratégicos</p>
                    <ul className="space-y-2">
                      {aiReport.strategicInsights.map((insight, i) => (
                        <li key={i} className="text-xs text-white/80 flex gap-2">
                          <span className="text-primary font-bold">»</span> {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-accent uppercase border-b border-accent/20 pb-1">Análise de Tendência</p>
                    <p className="text-xs text-white/70 italic leading-relaxed">"{aiReport.trendAnalysis}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="intelligence" className="w-full">
            <div className="flex items-center justify-between mb-6 border-b border-primary/10">
              <TabsList className="bg-transparent h-12 gap-8 rounded-none">
                <TabsTrigger value="intelligence" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-[10px] font-bold uppercase tracking-widest h-12">Predictive Intelligence</TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-[10px] font-bold uppercase tracking-widest h-12">Network Data</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="intelligence" className="space-y-8 animate-in fade-in duration-500">
              <Card className="glass border-none overflow-hidden rounded-none border-t border-primary/20">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center gap-2 uppercase tracking-tighter text-sm text-white">
                    <Activity className="h-5 w-5 text-accent" />
                    Asset Performance Command
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-muted-foreground font-bold text-[10px] uppercase bg-black/40">
                          <th className="text-left py-4 px-6">Asset rRNA Node</th>
                          <th className="text-right py-4 px-2">Price (BTC)</th>
                          <th className="text-right py-4 px-2">24h Delta</th>
                          <th className="text-right py-4 px-2">Sentiment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {dataLoading ? (
                          <tr><td colSpan={4} className="py-24 text-center text-xs animate-pulse uppercase tracking-widest text-primary">Sincronizando Malha Oracle...</td></tr>
                        ) : filteredMarket?.map((data) => (
                          <tr key={data.id} className="hover:bg-primary/5 transition-colors group">
                            <td className="py-4 px-6 font-bold text-white group-hover:text-primary transition-colors">{data.asset}</td>
                            <td className="py-4 px-2 text-right font-code text-amber-400">{data.price.toFixed(6)}</td>
                            <td className={`py-4 px-2 text-right font-bold ${data.priceChange24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {data.priceChange24h >= 0 ? "+" : ""}{data.priceChange24h}%
                            </td>
                            <td className="py-4 px-2 text-right">{getSentimentBadge(data.sentiment)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights?.map((insight) => (
                    <Card key={insight.id} className="glass border-none bg-black/20 rounded-none border-l-2 border-accent">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xs font-bold text-white uppercase">{insight.title}</CardTitle>
                          {getSentimentBadge(insight.sentiment)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">"{insight.content}"</p>
                      </CardContent>
                    </Card>
                  ))}
               </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-primary/5 rounded-none border-l-2 border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground">Malha Integrada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Oracle Confidence', val: '98.4%', icon: ShieldCheck, color: 'text-emerald-400' },
                { label: 'Neural Latency', val: '14ms', icon: Cpu, color: 'text-primary' },
                { label: 'Total Scanned', val: '102M Nodes', icon: Target, color: 'text-accent' },
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
