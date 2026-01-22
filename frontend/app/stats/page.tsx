'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { authService } from '@/lib/auth'
import { Brain, Zap, MemoryStick, MessageSquare } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function StatsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const response = await api.get('/stats/me')
      return response.data
    },
    enabled: authService.isAuthenticated(),
  })

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const response = await api.get('/stats/progress?days=30')
      return response.data
    },
    enabled: authService.isAuthenticated(),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Your Statistics</h1>

        {stats?.brainAge && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Brain className="h-16 w-16 text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {stats.brainAge.toFixed(1)} years
            </h2>
            <p className="text-gray-600">Your Brain Age</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-semibold">Reaction Time</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.bestScores?.reactionTime?.reactionTime
                ? `${stats.bestScores.reactionTime.reactionTime}ms`
                : 'N/A'}
            </p>
            <p className="text-gray-600 mt-2">
              Tests: {stats?.testsByType?.reactionTime || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <MemoryStick className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold">Sequence Memory</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.bestScores?.sequenceMemory?.level
                ? `Level ${stats.bestScores.sequenceMemory.level}`
                : 'N/A'}
            </p>
            <p className="text-gray-600 mt-2">
              Tests: {stats?.testsByType?.sequenceMemory || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold">Verbal Memory</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.bestScores?.verbalMemory?.correctAnswers
                ? `${stats.bestScores.verbalMemory.correctAnswers} words`
                : 'N/A'}
            </p>
            <p className="text-gray-600 mt-2">
              Tests: {stats?.testsByType?.verbalMemory || 0}
            </p>
          </div>
        </div>

        {progress && progress.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Progress (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Tests</h2>
          {stats?.recentTests?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentTests.map((test: any) => (
                <div
                  key={test.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-semibold">{test.testType}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{test.score.toFixed(0)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No tests completed yet.</p>
          )}
        </div>
      </main>
    </div>
  )
}
