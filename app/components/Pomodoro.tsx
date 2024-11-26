'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export default function Pomodoro() {
  const [time, setTime] = useState(WORK_TIME)
  const [isActive, setIsActive] = useState(false)
  const [isWork, setIsWork] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsWork((prevIsWork) => !prevIsWork)
      setTime(isWork ? BREAK_TIME : WORK_TIME)
      setIsActive(false)
    }

    return () => clearInterval(interval)
  }, [isActive, time, isWork])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setTime(WORK_TIME)
    setIsActive(false)
    setIsWork(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">{isWork ? 'Focus' : 'Break Time'}</h2>
      <div className="text-8xl font-bold">{formatTime(time)}</div>
      <div className="flex space-x-2">
        <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
        <Button onClick={resetTimer}>Reset</Button>
      </div>
    </div>
  )
}

