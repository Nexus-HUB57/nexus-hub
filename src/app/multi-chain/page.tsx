"use client"

import React, { useState } from 'react'
import { Link2, Globe, Database, PlusCircle, Activity, ShieldCheck, ChevronRight, Layers, Terminal, Server } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { useFirestore, useCollection, useMemoFirebase } from '../../firebase'
import { collection, query, orderBy, limit, where } from 'firebase/firestore'

export default function MultiChainPage() {
  const firestore = useFirestore()
  
  const chainsQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'blockchain_configs'), orderBy('createdAt', 'desc'))
  }, [firestore])

  const activityQuery = useMemoFirebase(() => {
    if (!firestore) return null
    return query(collection(firestore, 'audit_logs'), where('targetType', '==', 'chain'), orderBy('createdAt', 'desc'), limit(10))
  }, [firestore])

  const { data: chains, isLoading } = useCollection(chainsQuery)
  const { data: activities } = useCollection(activityQuery)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Multi-Chain Command</h1>
          <p className="text-muted-foreground">Orchestrating assets across L1, L2, and L3 networks</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 glow-primary gap-2 font-bold px-6 border-none">
          <PlusCircle className="h-4 w-4" /> Add Network
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-none bg-primary/5 glow-primary/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Active Networks</p>
            <h3 className="text-3xl font-bold font-headline mt-1 text-white">{chains?.length || 0}</h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-accent/5 glow-accent/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Bridged Value</p>
            <h3 className="text-3xl font-bold font-headline mt-1 text-white">$14.2M</h3>
          </CardContent>
        </Card>
        <Card className="glass border-none bg-emerald-500/5 glow-primary/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Cross-Chain Uptime</p>
            <h3 className="text-3xl font-bold font-headline text-emerald-400 mt-1">99.99%</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-none bg-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white uppercase tracking-tighter">Active Node Clusters</CardTitle>
                <CardDescription className="text-[10px] uppercase font-code">Verified blockchain interface configurations</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary font-bold">L1/L2/L3 MESH</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {isLoading ? (
                <div className="py-24 text-center">
                  <Activity className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Synchronizing network mesh...</p>
                </div>
              ) : chains && chains.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {chains.map((chain) => (
                    <Card key={chain.id} className="glass border-none hover:bg-white/5 transition-all cursor-pointer group border-white/5 border rounded-none">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-none bg-secondary/50 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                            <Globe className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white uppercase tracking-tighter">{chain.chainName}</h3>
                              <Badge variant="secondary" className="text-[8px] uppercase font-bold bg-white/10 rounded-none">{chain.layer}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-code mt-1">{chain.rpcUrl.slice(0, 45)}...</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online</p>
                            <p className="text-[8px] uppercase text-muted-foreground font-code mt-1">Chain ID: {chain.chainId}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center border border-dashed border-white/10 rounded-none bg-secondary/5">
                  <Server className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                  <p className="text-muted-foreground italic text-sm">No active network mesh configured. Initiate deployment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-none bg-accent/5 rounded-none border-r-2 border-accent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white uppercase tracking-tighter">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Interoperability Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-secondary/30 rounded-none border border-white/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
                    <span>Cross-Chain Bridge Liquidity</span>
                    <span className="text-white">84%</span>
                  </div>
                  <Progress value={84} className="h-1 bg-background rounded-none" indicatorColor="bg-accent" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
                    <span>Node Sync Latency</span>
                    <span className="text-emerald-400">140ms</span>
                  </div>
                  <Progress value={92} className="h-1 bg-background rounded-none" />
                </div>
              </div>
              
              <div className="p-4 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase">
                  <Activity className="h-3.5 w-3.5 animate-pulse" /> Recent Network Events
                </div>
                <div className="space-y-3">
                  {activities && activities.length > 0 ? (
                    activities.map((log) => (
                      <div key={log.id} className="text-[10px] leading-relaxed text-muted-foreground border-l-2 border-accent/30 pl-3 py-1 font-code">
                        <span className="text-white font-bold">{log.action}:</span> {log.details}
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted-foreground italic">Network activity stream initializing...</p>
                  )}
                </div>
              </div>
              
              <p className="text-[10px] text-muted-foreground leading-relaxed italic border-t border-white/5 pt-4 font-code">
                "Multi-chain mesh is optimized for high-frequency RWA asset deployment. Nexus Genesis monitoring active."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
