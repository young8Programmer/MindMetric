'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function VerbalMemoryPage() {
  const router = useRouter()
  const [words, setWords] = useState<string[]>([])
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set())
  const [currentWord, setCurrentWord] = useState<string>('')
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    } else {
      loadWords()
    }
  }, [router])

  const loadWords = async () => {
    try {
      const response = await api.get('/test/verbal/words?count=50')
      setWords(response.data)
      if (response.data.length > 0) {
        setCurrentWord(response.data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load words:', error)
      setLoading(false)
    }
  }

  const handleAnswer = (isNew: boolean) => {
    const wordIsNew = !seenWords.has(currentWord)
    const correct = wordIsNew === isNew

    if (correct) {
      setScore(score + 1)
      setSeenWords(new Set([...seenWords, currentWord]))
      nextWord()
    } else {
      setGameOver(true)
      submitResults(score)
    }
  }

  const nextWord = () => {
    const nextIndex = words.indexOf(currentWord) + 1
    if (nextIndex < words.length) {
      setCurrentWord(words[nextIndex])
    } else {
      // Load more words
      loadMoreWords()
    }
  }

  const loadMoreWords = async () => {
    try {
      const response = await api.get('/test/verbal/words?count=20')
      setWords([...words, ...response.data])
      setCurrentWord(response.data[0])
    } catch (error) {
      console.error('Failed to load more words:', error)
    }
  }

  const submitResults = async (finalScore: number) => {
    try {
      await api.post('/test/submit', {
        testType: 'verbal_memory',
        score: finalScore * 10,
        correctAnswers: finalScore,
      })
    } catch (error) {
      console.error('Failed to submit results:', error)
    }
  }

  const restart = () => {
    setScore(0)
    setSeenWords(new Set())
    setGameOver(false)
    loadWords()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading words...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Verbal Memory Test
          </h1>

          <div className="text-center mb-8">
            <p className="text-2xl font-semibold text-gray-900 mb-2">
              Score: {score}
            </p>
            <p className="text-gray-600">
              Have you seen this word before?
            </p>
          </div>

          {gameOver ? (
            <div className="text-center">
              <p className="text-xl font-semibold text-red-600 mb-4">
                Game Over! Your score: {score}
              </p>
              <button
                onClick={restart}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Play Again
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-100 rounded-lg p-12 mb-8 text-center">
                <p className="text-4xl font-bold text-gray-900">
                  {currentWord}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={() => handleAnswer(false)}
                  className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 text-lg"
                >
                  NEW
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 text-lg"
                >
                  SEEN
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
