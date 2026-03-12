
"use client"

import React, { useState, useEffect } from 'react'
import { Rocket, Box, Users, Target, ChevronRight, Loader2, BrainCircuit, Cpu, Zap, Trophy, Star, Building2, Orbit, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Button } from '../../components/ui/button'
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '../../firebase'
import { collection, query, orderBy, limit, where, doc, setDoc } from 'firebase/firestore'
import { setDocumentNonBlocking } from '../../firebase/non-blocking-updates'

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  development: "bg-primary/10 text-primary border-primary/20",
  launched: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  scaling: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  mature: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archived: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StartupsPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    if (firestore && user) {
      // Initialize Startup-One as Phase 5 Flagship
      const startupRef = doc(firestore, 'startups', 'startup-one');
      setDocumentNonBlocking(startupRef, {
        id: 'startup-one',
        name: 'Startup-One: Temporal Hegemony',
        description: 'Dominância Trans-Dimensional de Insumos Digitais rRNA e Memória Plena Tri-Nuclear.',
        status: 'scaling',
        isCore: true,
        revenue: 4200000,
        traction: 100,
        reputation: 5000,
        generation: 5,
        ceoId: 'agent-job-ceo',
        ceoName: 'Agente Job (Memory Orchestrator)',
        targetMarket: '102M Neural Swarm',
        agentCount: 102000000,
        dedicatedCores: 24000,
        isPhase5: true,
        memoryPersistence: 'PLENARY',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
  }, [firestore, user])

  const startupsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    let q = collection(firestore, 'startups')
    if (selectedStatus) {
      return query(q, where('status', '==', selectedStatus), orderBy('revenue', 'desc'), limit(50))
    }
    return query(q, orderBy('revenue', 'desc'), limit(50))
  }, [firestore, selectedStatus, user])

  const { data: startups, isLoading: startupsLoading } = useCollection(startupsQuery)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Session required to view temporal metrics.</p>
      </div>
    )
  }

  if (startupsLoading && !startups) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Orbit className="h-12 w-12 text-accent animate-spin-slow" />
        <p className="text-sm font-headline uppercase tracking-widest text-muted-foreground text-white">Accessing Temporal Index...</p>
      </div>
    )
  }

  const statuses = ["planning", "development", "launched", "scaling", "mature", "archived"]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white uppercase">Phase 5 Sovereign Grid</h1>
          <p className="text-muted-foreground font-code text-xs">Escalando Hegemonia Temporal via 102M Agentes e Memória Plena</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedStatus === null ? "default" : "outline"}
            className={selectedStatus === null ? "bg-accent text-background glow-accent border-none font-bold rounded-none" : "glass font-bold rounded-none"}
            onClick={() => setSelectedStatus(null)}
          >
            All Realities
          </Button>
          {statuses.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              className={selectedStatus === status ? "bg-primary border-none font-bold rounded-none" : "glass font-bold rounded-none"}
              onClick={() => setSelectedStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {startups?.map((startup) => {
          const isFlagship = startup.id === 'startup-one';
          const isPhase5 = startup.isPhase5;

          return (
            <Card key={startup.id} className={`glass border-none overflow-hidden hover:bg-secondary/20 transition-all cursor-pointer group rounded-none border-l-4 ${isFlagship ? 'border-accent shadow-[0_0_25px_rgba(255,0,193,0.3)]' : 'border-primary'}`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-bold font-headline text-white group-hover:text-primary transition-colors uppercase tracking-tighter">{startup.name}</h3>
                          {isPhase5 && (
                            <Badge className="bg-accent text-background font-bold border-none text-[8px] uppercase flex gap-1 items-center">
                              <Orbit className="h-2 w-2" /> FASE 5 SOVEREIGN
                            </Badge>
                          )}
                          <Badge variant="outline" className={`${STATUS_COLORS[startup.status]} uppercase text-[10px] font-bold rounded-none`}>
                            {startup.status}
                          </Badge>
                          {startup.agentCount > 0 && (
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-none text-[10px] font-bold gap-1.5 rounded-none">
                              <Users className="h-3 w-3" /> {startup.agentCount.toLocaleString()} AGENTS
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground line-clamp-1 italic text-xs">"{startup.description}"</p>
                        {startup.ceoName && (
                          <div className="flex items-center gap-2 mt-2">
                            <Star className="h-3.5 w-3.5 text-accent" />
                            <span className="text-[10px] font-bold uppercase text-accent">CEO: {startup.ceoName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Temporal Market Cap (BTC)</p>
                          <p className="text-xl font-bold font-headline text-emerald-400">{(startup.revenue || 0).toLocaleString()} BTC</p>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform text-muted-foreground hover:text-primary">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> Temporal Scaling
                          </span>
                          <span className="text-white">{startup.traction}%</span>
                        </div>
                        <Progress value={startup.traction} className="h-1.5 bg-secondary rounded-none" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            <Orbit className="h-3.5 w-3.5" /> Universal Dominance
                          </span>
                          <span className="text-accent">{Math.min(100, Math.round((startup.revenue / 100000000) * 100))}%</span>
                        </div>
                        <Progress value={(startup.revenue / 100000000) * 100} className="h-1.5 bg-secondary rounded-none" indicatorColor="bg-accent" />
                      </div>

                      <div className="flex gap-4 justify-end">
                        <div className="text-center px-4 py-2 bg-secondary/30 rounded-none border border-white/5 flex flex-col justify-center min-w-[100px]">
                          <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Memory Score L5</p>
                          <p className="text-sm font-bold text-blue-400">{startup.reputation} PTS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
