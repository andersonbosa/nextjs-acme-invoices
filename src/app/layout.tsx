import '@/src/app/ui/styles/global.css'
import { inter } from '@/src/app/ui/fonts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  },
  description: 'The official Next.js Course Dashboard.',
  metadataBase: new URL('https://andersonbosa.vercel.app')
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={` ${inter.className} antialiased `}>{children}</body>
    </html>
  )
}
