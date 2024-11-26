'use client'

import { useState, useEffect } from 'react'

const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in;
  }
`;

interface ClockProps {
  userName: string;
}

export default function Clock({ userName }: ClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Rise and shine"
    if (hour < 18) return "Let's crush this afternoon"
    return "Time to shine, night owl"
  }

  return (
    <>
      <style>{fadeInAnimation}</style>
      <div className="text-center p-8 rounded-lg">
        <h2 className="text-2xl mb-6 animate-fade-in">
          <div>{getGreeting()},</div>
          <div>{userName}! Ready to conquer the day?</div>
        </h2>
        <time className="text-[12rem] font-bold tracking-tighter leading-none block animate-fade-in">
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </time>
      </div>
    </>
  )
}

