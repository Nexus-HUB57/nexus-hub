
"use client"

import React, { useState } from 'react'
import { Leaf, Globe, ShieldCheck, PlusCircle, Filter, Search, BarChart3, TrendingUp, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'

export default function RWAPage() {
  const firestore = useFirestore()
  const creditsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'carbon_credits'), orderBy('createdAt', 'desc'), limit(50))
  }, [firestore])

  const { data: credits, isLoading } = useCollection(creditsQuery)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Carbon Credit RWAs</h1>
          <p className="text-muted-foreground">Tokenizing real-world ecological impact assets</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold glow-primary gap-2">
          <PlusCircle className="h-4 w-4" /> Issue Credits
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-none bg-emerald-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Leaf className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Total Carbon offset</p><p className="text-xl font-headline font-bold">12.4K Tons</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-primary/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><TrendingUp className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Avg. Price / Ton</p><p className="text-xl font-headline font-bold">$24.50</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Globe className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Verification Rate</p><p className="text-xl font-headline font-bold">92%</p></div>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-orange-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400"><History className="h-4 w-4" /></div>
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Retired Credits</p><p className="text-xl font-headline font-bold">1.8K</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div>
                <CardTitle>Asset Registry</CardTitle>
                <CardDescription>Verified ecological impact tokens</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10 glass border-white/10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-muted-foreground font-bold text-[10px] uppercase">
                      <th className="text-left py-4 px-6">Project</th>
                      <th className="text-left py-4 px-2">Type</th>
                      <th className="text-right py-4 px-2">Volume</th>
                      <th className="text-right py-4 px-2">Price</th>
                      <th className="text-right py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {credits?.map((credit) => (
                      <tr key={credit.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="py-4 px-6">
                          <p className="font-bold">{credit.projectName}</p>
                          <p className="text-[10px] text-muted-foreground font-code">{credit.location}</p>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant="secondary" className="text-[10px] bg-secondary border-none">{credit.projectType}</Badge>
                        </td>
                        <td className="py-4 px-2 text-right font-bold">{credit.volumeTons} Tons</td>
                        <td className="py-4 px-2 text-right font-code text-emerald-400">${credit.pricePerTon}</td>
                        <td className="py-4 px-6 text-right">
                          <Badge variant="outline" className={credit.verificationStatus === 'verified' ? 'border-emerald-500 text-emerald-400' : 'border-orange-500 text-orange-400'}>
                            {credit.verificationStatus.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {(!credits || credits.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-24 text-center text-muted-foreground italic">No RWA assets registered in current cycle.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-none bg-emerald-500/5 glow-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-400" />
                Market Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase">Compliance Standard</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30">VERRA</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">GOLD STANDARD</Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">AMERICAN CARBON</Badge>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-secondary/20 border border-white/5">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">RWA Yield Health</p>
                <h4 className="text-2xl font-bold font-headline text-emerald-400">+12.8% <span className="text-xs text-muted-foreground font-normal">APR</span></h4>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
