'use client'

import { useState, useEffect } from 'react'

const quotes = [
  "Time for yourself is time well spent",
  "Make each moment count",
  "Focus on what matters most",
  "The present is a gift",
  "Now is all we have"
]

export default function Quote() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <p className="text-lg italic">"{quote}"</p>
  )
}

