'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function ReactionTestPage() {
  const router = useRouter()
  const [waiting, setWaiting] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [trials, setTrials] = useState<number[]>([])
  const [currentTrial, setCurrentTrial] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const maxTrials = 5

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const startTrial = () => {
    setWaiting(true)
    setClicked(false)
    setReactionTime(null)
    setShowResult(false)

    // Random delay between 2-7 seconds
    const delay = Math.random() * 5000 + 2000

    timeoutRef.current = setTimeout(() => {
      setWaiting(false)
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (waiting) {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setWaiting(false)
      setClicked(true)
      setReactionTime(null)
      alert('Too early! Wait for the color to change.')
      setTimeout(() => {
        setClicked(false)
        startTrial()
      }, 2000)
      return
    }

    if (startTime && !reactionTime) {
      const time = Date.now() - startTime
      const newTrials = [...trials, time]
      setReactionTime(time)
      setTrials(newTrials)
      setCurrentTrial(currentTrial + 1)
      setShowResult(true)

      if (currentTrial + 1 < maxTrials) {
        setTimeout(() => {
          startTrial()
        }, 2000)
      } else {
        // Submit all results
        submitResults(newTrials)
      }
    }
  }

  const submitResults = async (finalTrials: number[]) => {
    try {
      const avgTime = finalTrials.reduce((a, b) => a + b, 0) / finalTrials.length
      await api.post('/test/submit', {
        testType: 'reaction_time',
        score: Math.round(10000 / avgTime), // Higher score for faster times
        reactionTime: Math.round(avgTime),
      })
      alert(`Test completed! Average reaction time: ${avgTime.toFixed(0)}ms`)
      router.push('/stats')
    } catch (error) {
      console.error('Failed to submit results:', error)
    }
  }

  const resetTest = () => {
    setTrials([])
    setCurrentTrial(0)
    setReactionTime(null)
    setShowResult(false)
    startTrial()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Reaction Time Test
          </h1>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Trial {currentTrial + 1} of {maxTrials}
            </p>
            {trials.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Previous times:</p>
                <div className="flex justify-center gap-2 mt-2">
                  {trials.map((time, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 px-3 py-1 rounded text-sm"
                    >
                      {time.toFixed(0)}ms
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div
            className={`w-full h-96 rounded-lg flex items-center justify-center text-white text-2xl font-bold cursor-pointer transition-all ${
              waiting
                ? 'bg-red-500 hover:bg-red-600'
                : startTime && !reactionTime
                ? 'bg-green-500 hover:bg-green-600'
                : clicked
                ? 'bg-yellow-500'
                : 'bg-gray-300'
            }`}
            onClick={handleClick}
          >
            {waiting
              ? 'Wait for green...'
              : startTime && !reactionTime
              ? 'CLICK NOW!'
              : clicked
              ? 'Too Early!'
              : reactionTime
              ? `${reactionTime.toFixed(0)}ms`
              : currentTrial === 0
              ? 'Click to start'
              : 'Click to continue'}
          </div>

          {showResult && reactionTime && (
            <div className="mt-8 text-center">
              <p className="text-xl font-semibold text-gray-900">
                Reaction Time: {reactionTime.toFixed(0)}ms
              </p>
            </div>
          )}

          {currentTrial === 0 && !waiting && !startTime && (
            <div className="mt-8 text-center">
              <button
                onClick={startTrial}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Start Test
              </button>
            </div>
          )}

          {currentTrial >= maxTrials && (
            <div className="mt-8 text-center">
              <button
                onClick={resetTest}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 mr-4"
              >
                Retry
              </button>
              <button
                onClick={() => router.push('/stats')}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
