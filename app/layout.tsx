import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Event Newsletter Builder',
  description: 'Create custom event newsletters from TicketWeb API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
