
"use client"

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '../components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      <div className="bg-destructive/10 p-6 rounded-full mb-8 glow-destructive/20 border border-destructive/20">
        <AlertTriangle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold font-headline mb-4 tracking-tight">System Fault</h1>
      <p className="max-w-md text-muted-foreground mb-10 leading-relaxed font-code text-sm">
        Error Code: {error.digest || 'UNKNOWN_ANOMALY'}<br />
        Reason: {error.message || 'Quantum instability in core processing.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} className="bg-primary hover:bg-primary/90 glow-primary gap-2">
          <RefreshCcw className="h-4 w-4" /> Reset Subsystems
        </Button>
        <Button asChild variant="outline" className="glass border-white/10 gap-2">
          <Link href="/">
            <Home className="h-4 w-4" /> Genesis Command
          </Link>
        </Button>
      </div>
      <p className="mt-12 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
        Self-repairing protocols initiated...
      </p>
    </div>
  )
}
