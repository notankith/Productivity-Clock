'use client'

import { useState, useEffect } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Moon, Sun, Settings2, Maximize, Minimize, Music, X } from 'lucide-react'
import Clock from './components/Clock'
import Timer from './components/Timer'
import Pomodoro from './components/Pomodoro'
import Quote from './components/Quote'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import SpotifyEmbed from './components/SpotifyEmbed'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const { theme, toggleTheme } = useAppContext()
  const [mode, setMode] = useState<'clock' | 'timer' | 'pomodoro'>('clock')
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [userName, setUserName] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false)
  const [spotifyPlaylistLink, setSpotifyPlaylistLink] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const startTimer = () => setIsTimerActive(true)
  const resetTimer = () => {
    setIsTimerActive(false)
    setTimerKey(prev => prev + 1)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

  const toggleSpotify = () => {
    setIsSpotifyOpen(!isSpotifyOpen)
  }

  const handleAddPlaylist = (link: string) => {
    setSpotifyPlaylistLink(link)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
  }

  const getBackgroundStyle = () => {
    if (theme === 'dark') {
      return {
        background: '#000000', // Pitch black
      };
    }

    const x = mousePosition.x / window.innerWidth;
    const y = mousePosition.y / window.innerHeight;
    
    return {
      backgroundImage: `linear-gradient(${120 + x * 60}deg, rgba(255, 182, 193, ${0.7 + y * 0.3}), rgba(173, 216, 230, ${0.7 + x * 0.3}))`,
    };
  };

  return (
    <main 
      className={`min-h-screen transition-colors duration-300 reactive-background ${
        theme === 'light' ? 'animate-gradient text-gray-800' : 'text-white'
      }`}
      style={getBackgroundStyle()}
    >
      <div className="container mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold">Flocus</h1>
          <Quote />
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          {mode === 'clock' && <Clock userName={userName} />}
          {mode === 'timer' && (
            <div className="flex flex-col items-center space-y-4">
              <Timer key={timerKey} isActive={isTimerActive} />
              <div className="flex space-x-2">
                <Button onClick={startTimer}>Start</Button>
                <Button onClick={resetTimer}>Reset</Button>
              </div>
            </div>
          )}
          {mode === 'pomodoro' && <Pomodoro />}
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center p-6">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setMode('clock')}>
                  Clock
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setMode('timer')}>
                  Timer
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setMode('pomodoro')}>
                  Pomodoro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={toggleSpotify}>
              <Music className="h-6 w-6" />
            </Button>
            {isSpotifyOpen && (
              <Button variant="ghost" size="icon" onClick={toggleSpotify}>
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>
        </footer>

        {/* Spotify Embed */}
        <SpotifyEmbed
          isOpen={isSpotifyOpen}
          onClose={toggleSpotify}
          onAddPlaylist={handleAddPlaylist}
          playlistLink={spotifyPlaylistLink}
        />

        {/* Name Input Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome to Flocus</DialogTitle>
              <DialogDescription>
                Please enter your name for a personalized experience.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full"
              />
              <DialogFooter>
                <Button type="submit">Get Started</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

