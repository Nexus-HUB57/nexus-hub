
"use client"

import React from 'react'
import { BarChart3, Zap, TrendingUp, AlertTriangle, Play, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, orderBy } from 'firebase/firestore'

export default function ArbitragePage() {
  const firestore = useFirestore()
  const oppsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'arbitrage_opportunities'), orderBy('createdAt', 'desc'))
  }, [firestore])

  const { data: opportunities, isLoading } = useCollection(oppsQuery)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Arbitrage NAC Engine</h1>
          <p className="text-muted-foreground">High-frequency profit identification and execution</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-accent text-accent-foreground font-bold animate-pulse">NAC MOTOR: ONLINE</Badge>
          <Button className="bg-primary hover:bg-primary/90 glow-primary">Deploy Arbitrage Bot</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-none bg-primary/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase">Captured Profit (24h)</p>
            <h3 className="text-3xl font-bold font-headline text-emerald-400">$12,482</h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase">Success Rate</p>
            <h3 className="text-3xl font-bold font-headline">98.2%</h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-purple-500/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase">Active Nodes</p>
            <h3 className="text-3xl font-bold font-headline text-purple-400">14</h3>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-none">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Live Opportunities
          </CardTitle>
          <CardDescription>Detected spread anomalies across distributed networks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">Scanning networks...</div>
            ) : opportunities && opportunities.length > 0 ? (
              opportunities.map((opp) => (
                <div key={opp.id} className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-accent">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{opp.asset} Arbitrage</p>
                      <p className="text-xs text-muted-foreground">{opp.exchangeFrom} → {opp.exchangeTo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">+${opp.profitPotential}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{opp.confidence}% Confidence</p>
                    </div>
                    <Button size="sm" className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50">
                      Execute
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground italic border border-dashed border-white/10 rounded-xl">
                No active arbitrage spreads detected in the current cycle.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
