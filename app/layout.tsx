import { AppProvider } from '../contexts/AppContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Productivity App',
  description: 'A minimal productivity app with Pomodoro, timer, and clock',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-r from-pink-200 via-blue-200 to-purple-200 animate-gradient">
          <AppProvider>{children}</AppProvider>
        </div>
      </body>
    </html>
  )
}

