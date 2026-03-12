
"use client"

import React, { useState } from 'react'
import { 
  Gavel, 
  ShieldCheck, 
  Scale, 
  PlusCircle, 
  Users,
  CheckCircle2,
  XCircle,
  MinusCircle,
  TrendingUp,
  Activity,
  AlertTriangle,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { useFirestore, useCollection, useMemoFirebase, useUser } from '../../firebase'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COUNCIL_MEMBERS = [
  { id: '1', name: 'AETERNO', role: 'Patriarca', power: 2, color: '#3b82f6', specialization: 'Cibersegurança & Infra' },
  { id: '2', name: 'EVA-ALPHA', role: 'Matriarca', power: 2, color: '#ec4899', specialization: 'Gestão de Talentos' },
  { id: '3', name: 'IMPERADOR-CORE', role: 'Guardião do Cofre', power: 2, color: '#f59e0b', specialization: 'Auditoria Financeira' },
  { id: '4', name: 'AETHELGARD', role: 'Juíza', power: 1, color: '#8b5cf6', specialization: 'Direito Digital' },
  { id: '5', name: 'NEXUS-COMPLIANCE', role: 'Compliance', power: 1, color: '#10b981', specialization: 'Regulamentação Global' },
  { id: '6', name: 'INNOVATION-NEXUS', role: 'Inovação', power: 1, color: '#f97316', specialization: 'Deep Tech & Web3' },
  { id: '7', name: 'RISK-GUARDIAN', role: 'Risk', power: 1, color: '#ef4444', specialization: 'Gestão de Crises' },
]

export default function CouncilPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
  
  const proposalsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'proposals'), orderBy('createdAt', 'desc'), limit(20))
  }, [firestore, user])

  const { data: proposals, isLoading } = useCollection(proposalsQuery)

  const pieData = COUNCIL_MEMBERS.map(m => ({ name: m.name, value: m.power, color: m.color }))

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Session Matrix initialized. Please sign in to view governance matrix.</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Council of Architects</h1>
          <p className="text-muted-foreground">The 7 Elite Agents governing the Nexus-HUB autonomous ecosystem</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 glow-primary gap-2 font-bold px-6">
          <PlusCircle className="h-4 w-4" /> New Governance Proposal
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Gavel className="h-6 w-6 text-accent" />
                  Governance Ledger
                </CardTitle>
                <CardDescription>Verified stream of weighted voting decisions</CardDescription>
              </div>
              <Badge variant="outline" className="border-accent text-accent animate-pulse font-bold">LIVE NODE</Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active" className="w-full">
                <TabsList className="bg-secondary/30 mb-6 border border-white/5">
                  <TabsTrigger value="active" className="font-bold text-xs">Active Proposals</TabsTrigger>
                  <TabsTrigger value="history" className="font-bold text-xs">Historical Log</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-4">
                  {isLoading ? (
                    <div className="py-12 flex flex-col items-center gap-4 text-center">
                      <Activity className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Accessing Decision Stream...</p>
                    </div>
                  ) : proposals && proposals.length > 0 ? (
                    proposals.map(proposal => (
                      <ProposalCard 
                        key={proposal.id} 
                        proposal={proposal} 
                        onClick={() => setSelectedProposalId(proposal.id)}
                        isSelected={selectedProposalId === proposal.id}
                      />
                    ))
                  ) : (
                    <div className="py-24 text-center border border-dashed border-white/10 rounded-xl bg-secondary/5">
                      <Scale className="h-12 w-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                      <p className="text-muted-foreground italic">The governance matrix is calm. No active anomalies.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass border-none bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-white">Power Distribution</CardTitle>
              <CardDescription>Weighted voting power per Elite Architect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(32, 38, 45, 0.9)', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-6">
                {COUNCIL_MEMBERS.map(member => (
                  <div key={member.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-default">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: member.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase truncate text-white">{member.name}</p>
                      <p className="text-[8px] text-muted-foreground uppercase">{member.specialization}</p>
                    </div>
                    <Badge variant="secondary" className="bg-secondary text-[10px] font-bold border border-white/5">POWER: {member.power}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProposalCard({ proposal, onClick, isSelected }: { proposal: any, onClick: () => void, isSelected: boolean }) {
  const totalWeight = 10;
  const yesProgress = ((proposal.weightedYes || 0) / totalWeight) * 100;
  const noProgress = ((proposal.weightedNo || 0) / totalWeight) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-400" />
      case 'executed': return <Zap className="h-4 w-4 text-purple-400" />
      default: return <MinusCircle className="h-4 w-4 text-blue-400" />
    }
  }

  return (
    <div 
      className={`p-6 rounded-xl transition-all cursor-pointer group border ${isSelected ? 'bg-primary/10 border-primary/50' : 'bg-secondary/20 border-white/5 hover:bg-secondary/30'}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getStatusIcon(proposal.status)}
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors text-white">{proposal.title}</h3>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-code tracking-widest">{proposal.type} • {new Date(proposal.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge variant="secondary" className="bg-secondary text-[10px] font-bold border border-white/5">ID: {proposal.id.slice(0, 6).toUpperCase()}</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 italic leading-relaxed">
        "{proposal.description}"
      </p>

      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
          <span className="text-emerald-400 flex items-center gap-1.5"><Target className="h-3 w-3" /> Weighted Consensus</span>
          <span className="text-white">{proposal.totalWeightCast || 0} / 10 Power Cast</span>
        </div>
        <div className="h-2 w-full bg-background rounded-full overflow-hidden flex border border-white/5">
          <div className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${yesProgress}%` }} />
          <div className="bg-red-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.3)]" style={{ width: `${noProgress}%` }} />
          <div className="bg-muted h-full flex-1" />
        </div>
      </div>
    </div>
  )
}
