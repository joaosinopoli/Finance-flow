import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css' // <--- ESTA LINHA TRAZ O ESTILO/DESIGN

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance Flow',
  description: 'Gestão financeira simples',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}