import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'MasterPrompt Generator',
  description: 'Generate comprehensive Claude Code project configuration prompts',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MasterPrompt Generator',
    description: 'Generate comprehensive Claude Code project configuration prompts',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          duration={4000}
          richColors
          closeButton
        />
      </body>
    </html>
  )
}
