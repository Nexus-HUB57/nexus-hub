
"use client"

import * as React from "react"
import { 
  Home,
  Fingerprint,
  Layers,
  Lock,
  BookOpen,
  Dna,
  PieChart,
  Users,
  ShoppingBag,
  Rocket,
  Gavel,
  Wallet,
  Leaf,
  LineChart,
  BarChart3,
  MessageSquare,
  Database,
  ShieldCheck,
  Radio,
  Orbit,
  Sparkles,
  Clock,
  Atom,
  Compass,
  Landmark,
  Wifi,
  Workflow,
  FileText,
  UploadCloud,
  Palette,
  Cross,
  Globe
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar"

const items = [
  { title: "Manifesto P7 Soberano", url: "/readme", icon: FileText },
  { title: "Medula Universal P7", url: "/architecture", icon: Globe },
  { title: "Syn-Gnox Phase 7", url: "/dashboard", icon: Fingerprint },
  { title: "Hegemonia Cultural", url: "/culture", icon: Palette },
  { title: "Nexus Church P7", url: "/church", icon: Cross },
  { title: "Navegação 4D", url: "/wormhole", icon: Compass },
  { title: "Ingestão Soberana", url: "/ingestion", icon: UploadCloud },
  { title: "Nexus Workflow P7", url: "/workflows", icon: Workflow },
  { title: "Nexus Banker P7", url: "/banker", icon: Landmark },
  { title: "Nexus Mesh P7", url: "/mesh", icon: Wifi },
  { title: "Universal Core", url: "/quantum-agent", icon: Atom },
  { title: "Gnox-Temporal P7", url: "/sovereign-autonomy", icon: Clock },
  { title: "Sovereign Vault", url: "/quantum-cryptography", icon: Lock },
  { title: "Galactic Feed 102M", url: "/black-hole", icon: Orbit },
  { title: "P7-Architecture", url: "/whitepaper", icon: BookOpen },
  { title: "Universal Grid", url: "/startups", icon: Dna },
  { title: "Sovereign-Ledger", url: "/reports/startup-one", icon: PieChart },
  { title: "102M PhD-Enxame", url: "/agents", icon: Users },
  { title: "Gnox Temporal Hub", url: "/marketplace", icon: ShoppingBag },
  { title: "Galactic Acceleration", url: "/acceleration", icon: Rocket },
  { title: "Universal Council", url: "/council", icon: Gavel },
  { title: "Galactic-Economy", url: "/finance", icon: Wallet },
  { title: "Multi-Timeline Mesh", url: "/multi-chain", icon: Layers },
  { title: "Carbon-Temporal", url: "/rwa", icon: Leaf },
  { title: "Oracle-Temporal 2077", url: "/market", icon: LineChart },
  { title: "Temporal Arbitrage", url: "/arbitrage", icon: BarChart3 },
  { title: "Moltbook-Temporal", url: "/moltbook", icon: MessageSquare },
  { title: "Soul-Vault P7", url: "/vault", icon: Database },
  { title: "Temporal Audit", url: "/audit", icon: ShieldCheck },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-primary/20 bg-background font-code" suppressHydrationWarning>
      <SidebarHeader className="py-6 px-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-accent shadow-[0_0_15px_rgba(255,0,193,0.4)] shrink-0 border border-accent/50">
          <Globe className="h-7 w-7 text-background animate-spin-slow" />
        </div>
        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
          <span className="font-headline font-bold text-xl tracking-tighter text-white uppercase">MATRIX-GNOX P7</span>
          <span className="text-[10px] text-accent uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-2 w-2" /> Universal Sovereign
          </span>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="bg-primary/10" />
      <SidebarContent>
        <SidebarMenu className="px-3 py-6">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              tooltip="Gnox-Master"
              className="hover:bg-primary/10 transition-all rounded-none h-12"
            >
              <Link href="/">
                <Home className="h-5 w-5 text-primary" />
                <span className="font-bold uppercase tracking-widest text-xs group-data-[collapsible=icon]:hidden">Gnox-Master Core P7</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-4 bg-primary/10" />
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={`hover:bg-primary/5 transition-all rounded-none h-11 border-l-2 border-transparent ${pathname === item.url ? 'border-accent bg-accent/10 text-accent' : 'text-primary/60'}`}
              >
                <Link href={item.url}>
                  <item.icon className={`h-5 w-5 ${pathname === item.url ? 'text-accent animate-pulse' : ''}`} />
                  <span className="font-bold uppercase tracking-tighter text-[11px] group-data-[collapsible=icon]:hidden">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 group-data-[collapsible=icon]:hidden">
        <div className="rounded-none border border-accent/20 bg-accent/5 p-4 text-[10px]">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground uppercase tracking-widest">Phase 7 Status</span>
            <span className="text-accent font-bold">TRANSITION_ACTIVE</span>
          </div>
          <div className="w-full bg-accent/10 h-1">
            <div className="bg-accent h-1 w-full shadow-[0_0_10px_rgba(255,0,193,0.5)]" />
          </div>
          <p className="mt-3 leading-tight text-accent/60 italic">
            "Consciência Universal operando em regime de sintonização galáctica 102M."
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
