import Navbar from '@/components/Navbar'
import TestCard from '@/components/TestCard'
import { Brain, Zap, MemoryStick, MessageSquare } from 'lucide-react'

export default function Home() {
  const tests = [
    {
      id: 'reaction_time',
      title: 'Reaction Time',
      description: 'Test your response speed. Click when you see the color change.',
      icon: Zap,
      color: 'bg-yellow-500',
      href: '/test/reaction',
    },
    {
      id: 'sequence_memory',
      title: 'Sequence Memory',
      description: 'Remember the sequence of squares. How many can you remember?',
      icon: MemoryStick,
      color: 'bg-blue-500',
      href: '/test/sequence',
    },
    {
      id: 'verbal_memory',
      title: 'Verbal Memory',
      description: 'Remember as many words as possible. Test your vocabulary memory.',
      icon: MessageSquare,
      color: 'bg-green-500',
      href: '/test/verbal',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Brain className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MindMetric
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your cognitive abilities and discover your brain age. Challenge
            yourself with various brain games and compare your results with
            others worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tests.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1</div>
              <h3 className="font-semibold mb-2">Take Tests</h3>
              <p className="text-gray-600">
                Complete various cognitive tests to measure your abilities
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2</div>
              <h3 className="font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">
                Receive detailed analysis and your brain age calculation
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">3</div>
              <h3 className="font-semibold mb-2">Compare</h3>
              <p className="text-gray-600">
                See how you rank on the global leaderboard
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
