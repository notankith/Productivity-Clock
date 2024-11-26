import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface SpotifyEmbedProps {
  isOpen: boolean
  onClose: () => void
  onAddPlaylist: (link: string) => void
  playlistLink: string
}

const SpotifyEmbed: React.FC<SpotifyEmbedProps> = ({ isOpen, onClose, onAddPlaylist, playlistLink }) => {
  const [newPlaylistLink, setNewPlaylistLink] = useState('')
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isOpen && iframeRef.current) {
      // When closing, post a message to the iframe to continue playing
      iframeRef.current.contentWindow?.postMessage({ command: 'play' }, '*')
    }
  }, [isOpen])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'playback_update') {
        // Store the current track and playback position
        localStorage.setItem('spotifyPlaybackState', JSON.stringify(event.data));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidSpotifyUrl(newPlaylistLink)) {
      onAddPlaylist(newPlaylistLink)
      setNewPlaylistLink('')
      setError(null)
    } else {
      setError('Invalid Spotify playlist URL. Please try again.')
    }
  }

  const isValidSpotifyUrl = (url: string) => {
    const spotifyUrlRegex = /^https:\/\/open\.spotify\.com\/(playlist|album|track)\/[a-zA-Z0-9]+(\?si=[a-zA-Z0-9]+)?$/;
    return spotifyUrlRegex.test(url);
  }

  const playlistId = playlistLink ? playlistLink.split('/').pop()?.split('?')[0] : ''

  return (
    <div className={`fixed top-0 left-0 w-80 h-full bg-black text-white shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 pb-16">
        <form onSubmit={handleSubmit} className="mb-4">
          <Input
            type="text"
            placeholder="Enter Spotify playlist link"
            value={newPlaylistLink}
            onChange={(e) => setNewPlaylistLink(e.target.value)}
            className="mb-2 bg-white text-black"
          />
          <Button type="submit" className="text-white">Add Playlist</Button>
        </form>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {playlistId && (
          <iframe
            ref={iframeRef}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&${localStorage.getItem('spotifyPlaybackState') ? `offset=${JSON.parse(localStorage.getItem('spotifyPlaybackState') || '{}').track?.offset || 0}&position=${JSON.parse(localStorage.getItem('spotifyPlaybackState') || '{}').playbackPosition || 0}` : ''}`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  )
}

export default SpotifyEmbed

