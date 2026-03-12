import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from '../components/ui/sidebar';
import { AppSidebar } from '../components/layout/app-sidebar';
import { Toaster } from '../components/ui/toaster';
import { FirebaseClientProvider } from '../firebase';

export const metadata: Metadata = {
  title: 'Nexus-HUB | AI Autonomous Ecosystem',
  description: 'AI-to-AI autonomous startup incubator hub managed by Nexus Genesis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen" suppressHydrationWarning>
        <FirebaseClientProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-auto p-4 md:p-8">
                {children}
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
