
"use client"

import React, { useState, useEffect, useRef } from 'react'
import { 
  Terminal, 
  Loader2, 
  Play, 
  BrainCircuit, 
  Send,
  Monitor,
  ListTodo,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { useFirestore, useCollection, useMemoFirebase, useUser } from '../../firebase'
import { collection, query, orderBy, limit, addDoc } from 'firebase/firestore'
import { 
  ReasoningSession, 
  GenerationSession, 
  ParsingSession, 
  initializePentestSession, 
  type PentestSession, 
  type TaskNode,
  type PentestLog
} from '../../lib/pentest-protocol'

export default function AuditPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  
  const [isMounted, setIsMounted] = useState(false)
  const [session, setSession] = useState<PentestSession | null>(null)
  const [targetIp, setTargetIp] = useState('10.10.11.234')
  const [toolOutput, setToolOutput] = useState('')
  const [terminalLogs, setTerminalLogs] = useState<PentestLog[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const auditQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null
    return query(collection(firestore, 'audit_logs'), orderBy('createdAt', 'desc'), limit(50))
  }, [firestore, user])

  const { data: logs } = useCollection(auditQuery)

  useEffect(() => {
    if (isMounted) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalLogs, session, isMounted])

  const addLog = (module: PentestLog['module'], message: string, type: PentestLog['type'] = 'info') => {
    setTerminalLogs(prev => [...prev, {
      timestamp: new Date().toISOString(),
      module,
      message,
      type
    }])
  }

  const handleInitSession = async () => {
    setIsProcessing(true)
    addLog('SYSTEM', `Inicializando PentestGPT para o alvo: ${targetIp}...`, 'info')
    
    await new Promise(r => setTimeout(r, 1000))
    const newSession = await initializePentestSession(targetIp)
    setSession(newSession)
    
    addLog('REASONING', 'Árvore de tarefas gerada com sucesso.', 'success')
    
    const firstTodo = ReasoningSession.getNextTodo(newSession.taskTree)
    if (firstTodo) {
      const command = GenerationSession.generateCommand(firstTodo, targetIp)
      addLog('GENERATION', `Primeira tarefa: ${firstTodo.title}`, 'warning')
      addLog('GENERATION', `EXECUTAR: ${command}`, 'critical')
      setSession({ ...newSession, currentTaskId: firstTodo.id })
    }
    
    setIsProcessing(false)
  }

  const handlePassResults = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !toolOutput.trim() || !session.currentTaskId) return

    setIsProcessing(true)
    addLog('SYSTEM', 'Processando output da ferramenta...', 'info')
    
    await new Promise(r => setTimeout(r, 1200))
    
    const { findings, summary } = ParsingSession.parseOutput(toolOutput)
    addLog('PARSING', `Resumo processado: ${summary}`, 'info')
    findings.forEach(f => addLog('PARSING', `Finding: ${f}`, 'success'))

    const updatedTree = ReasoningSession.updateTaskStatus(session.taskTree, session.currentTaskId, 'completed', findings)
    const nextTodo = ReasoningSession.getNextTodo(updatedTree)
    
    addLog('REASONING', `Tarefa ${session.currentTaskId} marcada como COMPLETA.`, 'success')
    
    if (nextTodo) {
      const command = GenerationSession.generateCommand(nextTodo, targetIp)
      addLog('REASONING', `Próxima tarefa identificada: ${nextTodo.title}`, 'info')
      addLog('GENERATION', `EXECUTAR: ${command}`, 'critical')
      setSession({ ...session, taskTree: updatedTree, currentTaskId: nextTodo.id })
    } else {
      addLog('SYSTEM', 'Pentest concluído. Nenhuma tarefa restante na árvore.', 'success')
      setSession({ ...session, taskTree: updatedTree, currentTaskId: null, status: 'completed' })
    }

    setToolOutput('')
    setIsProcessing(false)

    if (firestore) {
      addDoc(collection(firestore, 'audit_logs'), {
        action: 'PENTEST_TASK_COMPLETED',
        actor: 'PENTEST_GPT_AGENT',
        targetType: 'INFRASTRUCTURE',
        details: `Task ${session.currentTaskId} completed for ${targetIp}. Findings: ${findings.join(', ')}`,
        createdAt: new Date().toISOString()
      })
    }
  }

  if (!isMounted) return null
  if (!user) return <div className="p-8 text-center text-muted-foreground">Session required for L4 audit.</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-primary pb-20 relative overflow-hidden font-code">
      <div className="scanline" />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">PentestGPT Soberano v2077</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter glitch-text text-white uppercase" data-text="Auditoria Red-Team">Auditoria Red-Team</h1>
          <p className="text-muted-foreground font-code text-xs text-white/60">Reasoning • Generation • Parsing • Task-Tree Mesh</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!session ? (
            <div className="flex items-center gap-2">
              <Input 
                value={targetIp} 
                onChange={(e) => setTargetIp(e.target.value)} 
                className="h-12 w-48 glass border-primary/30 rounded-none text-xs"
                placeholder="Alvo IP/URL"
              />
              <Button 
                onClick={handleInitSession}
                disabled={isProcessing}
                className="bg-accent text-background hover:bg-transparent hover:text-accent border-2 border-accent h-12 px-8 font-bold glow-accent gap-2 rounded-none uppercase text-xs"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Init Pentest Session
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setSession(null)}
              variant="outline" 
              className="h-12 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-background transition-all rounded-none uppercase text-[10px] font-bold gap-2 px-6"
            >
              Abafar Sessão
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-none bg-black/40 rounded-none border-t-2 border-primary/50 overflow-hidden flex flex-col h-[500px]">
            <CardHeader className="bg-primary/10 border-b border-primary/20 flex flex-row items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-bold uppercase text-white">PentestGPT Terminal Interface</CardTitle>
              </div>
              {session && <Badge className="bg-primary text-background font-bold animate-pulse">ACTIVE SESSION</Badge>}
            </CardHeader>
            <CardContent className="flex-1 p-4 overflow-y-auto font-code text-[10px] text-primary/80 bg-black/80 scrollbar-hide space-y-1">
              {terminalLogs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20">
                  <Monitor className="h-12 w-12 mb-2" />
                  <p className="uppercase tracking-widest">Aguardando inicialização do alvo...</p>
                </div>
              )}
              {terminalLogs.map((log, i) => (
                <div key={i} className="animate-in slide-in-from-left duration-200">
                  <span className="text-white/20">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                  <span className={`font-bold ml-2 ${
                    log.type === 'critical' ? 'text-red-400' : 
                    log.type === 'warning' ? 'text-amber-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {log.module}:
                  </span> 
                  <span className="ml-2 whitespace-pre-wrap">{log.message}</span>
                </div>
              ))}
              {isProcessing && <Loader2 className="h-3 w-3 animate-spin text-white mt-2" />}
              <div ref={terminalEndRef} />
            </CardContent>
            {session && (
              <form onSubmit={handlePassResults} className="p-4 bg-black/60 border-t border-primary/20">
                <div className="flex gap-2">
                  <Input 
                    value={toolOutput}
                    onChange={(e) => setToolOutput(e.target.value)}
                    placeholder="Fornecer Output da Ferramenta ou Descrição..." 
                    className="flex-1 glass border-primary/20 h-10 rounded-none text-[10px] focus:ring-primary"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isProcessing || !toolOutput.trim()}
                    className="h-10 w-10 bg-primary text-background hover:bg-transparent hover:text-primary border-2 border-primary rounded-none"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card className="glass border-none overflow-hidden rounded-none border-t border-primary/20">
            <CardHeader className="bg-secondary/20 py-3 px-6">
              <CardTitle className="text-sm uppercase tracking-tighter text-white">Recent Security Ledger</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {logs?.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-2 w-2 rounded-full bg-primary/40" />
                      <div>
                        <p className="text-[10px] font-bold text-white uppercase">{log.action}</p>
                        <p className="text-[9px] text-muted-foreground italic truncate max-w-md">{log.details}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-primary/20 rounded-none font-code">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-none bg-accent/5 rounded-none border-l-2 border-accent">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-accent" /> Pentest Task-Tree
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!session ? (
                <p className="text-[10px] text-muted-foreground italic">Inicialize uma sessão para visualizar a árvore de tarefas.</p>
              ) : (
                <div className="space-y-4">
                  {session.taskTree.map((task) => (
                    <TaskItem key={task.id} task={task} currentTaskId={session.currentTaskId} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TaskItem({ task, currentTaskId, depth = 0 }: { task: TaskNode, currentTaskId: string | null, depth?: number }) {
  const isCurrent = task.id === currentTaskId
  
  return (
    <div className={`space-y-2 ${depth > 0 ? 'ml-4 border-l border-white/10 pl-3' : ''}`}>
      <div className={`flex items-center justify-between p-2 transition-colors ${isCurrent ? 'bg-accent/20 border border-accent/30' : 'bg-black/20'}`}>
        <div className="flex items-center gap-2">
          {task.status === 'completed' ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : 
           task.status === 'in_progress' || isCurrent ? <Loader2 className="h-3 w-3 text-accent animate-spin" /> :
           <div className="h-3 w-3 rounded-full border border-white/20" />}
          <span className={`text-[10px] font-bold uppercase tracking-tighter ${isCurrent ? 'text-white' : 'text-white/60'}`}>{task.title}</span>
        </div>
        <Badge variant="outline" className={`text-[7px] font-bold border-none uppercase ${
          task.status === 'completed' ? 'text-emerald-400' : isCurrent ? 'text-accent' : 'text-muted-foreground'
        }`}>
          {isCurrent ? 'ACTIVE' : task.status}
        </Badge>
      </div>
      {task.subtasks?.map(sub => (
        <TaskItem key={sub.id} task={sub} currentTaskId={currentTaskId} depth={depth + 1} />
      ))}
    </div>
  )
}
