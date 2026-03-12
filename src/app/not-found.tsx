
"use client"

import Link from 'next/link'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
        <ShieldAlert className="h-24 w-24 text-primary relative" />
      </div>
      <h1 className="text-6xl font-bold font-headline mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl font-bold mb-6 text-muted-foreground">Anomaly Detected</h2>
      <p className="max-w-md text-muted-foreground mb-10 leading-relaxed italic">
        "The coordinate you are attempting to access does not exist within the Nexus-HUB matrix. 
        Nexus Genesis has rerouted all non-essential queries."
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-primary hover:bg-primary/90 glow-primary gap-2">
          <Link href="/">
            <Home className="h-4 w-4" /> Return to Genesis
          </Link>
        </Button>
        <Button variant="outline" className="glass border-white/10 gap-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" /> Previous Node
        </Button>
      </div>
    </div>
  )
}
