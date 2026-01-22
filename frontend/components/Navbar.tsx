'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Trophy, BarChart3, Wallet, LogOut, User } from 'lucide-react'
import { authService } from '@/lib/auth'
import { useQuery } from '@tanstack/react-query'

export default function Navbar() {
  const router = useRouter()
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    enabled: authService.isAuthenticated(),
    retry: false,
  })

  const handleLogout = () => {
    authService.logout()
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">MindMetric</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tests
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Leaderboard
            </Link>
            <Link
              href="/stats"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Stats
            </Link>

            {user ? (
              <>
                <Link
                  href="/wallet"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  {user.balance.toLocaleString()} UZS
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  {user.username || user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
