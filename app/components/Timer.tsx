'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface TimerProps {
  isActive: boolean;
}

export default function Timer({ isActive }: TimerProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-[12rem] font-bold tracking-tighter leading-none">
      {formatTime(time)}
    </div>
  )
}

