'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function SequenceMemoryPage() {
  const router = useRouter()
  const [level, setLevel] = useState(1)
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [showing, setShowing] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bestLevel, setBestLevel] = useState(0)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const gridSize = 3
  const squares = Array.from({ length: gridSize * gridSize }, (_, i) => i)

  const startGame = () => {
    setLevel(1)
    setSequence([])
    setUserSequence([])
    setGameOver(false)
    generateSequence()
  }

  const generateSequence = () => {
    const newSequence = [...sequence]
    const randomSquare = Math.floor(Math.random() * squares.length)
    newSequence.push(randomSquare)
    setSequence(newSequence)
    showSequence(newSequence)
  }

  const showSequence = async (seq: number[]) => {
    setShowing(true)
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const square = document.getElementById(`square-${seq[i]}`)
      if (square) {
        square.classList.add('bg-blue-500')
        setTimeout(() => {
          square.classList.remove('bg-blue-500')
        }, 300)
      }
    }
    setShowing(false)
  }

  const handleSquareClick = (index: number) => {
    if (showing || gameOver) return

    const newUserSequence = [...userSequence, index]
    setUserSequence(newUserSequence)

    const expectedIndex = sequence[userSequence.length]

    if (index !== expectedIndex) {
      // Wrong sequence
      setGameOver(true)
      submitResults(level - 1)
    } else if (newUserSequence.length === sequence.length) {
      // Correct sequence, next level
      setUserSequence([])
      setLevel(level + 1)
      setTimeout(() => {
        generateSequence()
      }, 500)
    }
  }

  const submitResults = async (finalLevel: number) => {
    try {
      if (finalLevel > bestLevel) {
        setBestLevel(finalLevel)
      }
      await api.post('/test/submit', {
        testType: 'sequence_memory',
        score: finalLevel * 10,
        level: finalLevel,
      })
    } catch (error) {
      console.error('Failed to submit results:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Sequence Memory Test
          </h1>

          <div className="text-center mb-8">
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              Level {level}
            </p>
            {bestLevel > 0 && (
              <p className="text-gray-600">Best: Level {bestLevel}</p>
            )}
          </div>

          {!gameOver && sequence.length === 0 && (
            <div className="text-center mb-8">
              <button
                onClick={startGame}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="text-center mb-8">
              <p className="text-xl font-semibold text-red-600 mb-4">
                Game Over! You reached level {level - 1}
              </p>
              <button
                onClick={startGame}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Play Again
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {squares.map((index) => (
              <button
                key={index}
                id={`square-${index}`}
                onClick={() => handleSquareClick(index)}
                disabled={showing || gameOver}
                className="aspect-square bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            ))}
          </div>

          {showing && (
            <p className="text-center mt-4 text-gray-600">
              Watch the sequence...
            </p>
          )}

          {!showing && sequence.length > 0 && !gameOver && (
            <p className="text-center mt-4 text-gray-600">
              Repeat the sequence
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
