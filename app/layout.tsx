import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WhatsApp FAQ Bot - Automate Customer Support',
  description: 'AI-powered WhatsApp FAQ bot for Nigerian businesses. Answer customer questions 24/7 automatically.',
  keywords: ['WhatsApp', 'FAQ', 'bot', 'customer support', 'Nigeria', 'automation'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body>{children}</body>
    </html>
  )
}
