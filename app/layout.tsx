import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import env from '@/lib/env'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'NutriAthlete AI - Plataforma de Nutrição Esportiva com IA',
  description: 'Plataforma completa para gestão de atletas com dietas personalizadas geradas por inteligência artificial',
  keywords: ['nutrição', 'esporte', 'jiu-jitsu', 'IA', 'dieta', 'saúde'],
  authors: [{ name: 'Jessica Pereira' }],
  creator: 'Jessica Pereira',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: env.NEXT_PUBLIC_APP_URL,
    title: 'NutriAthlete AI',
    description: 'Plataforma de nutrição esportiva com inteligência artificial',
    images: [
      {
        url: `${env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
