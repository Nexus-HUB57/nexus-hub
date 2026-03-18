"use client"

import React from 'react'
import { ImpactDashboard } from '../../../components/ImpactDashboard'
import { AppSidebar } from '../../../components/layout/app-sidebar'
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from '../../../components/ui/sidebar'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '../../../components/ui/breadcrumb'
import { Separator } from '../../../components/ui/separator'

export default function ImpactDashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-white/5">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-[10px] uppercase font-bold text-muted-foreground">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[10px] uppercase font-black text-white">Real Impact & RWA</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-8 bg-background relative overflow-hidden">
          <div className="scanline" />
          <ImpactDashboard />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
