'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/lib/auth'
import { User, Brain } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getProfile,
    enabled: authService.isAuthenticated(),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="bg-primary-100 rounded-full p-4 mr-4">
              <User className="h-12 w-12 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.username ||
                  user?.firstName ||
                  user?.email?.split('@')[0] ||
                  'User'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Full Name
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : 'Not set'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Username
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {user?.username || 'Not set'}
              </p>
            </div>

            {user?.brainAge && (
              <div className="bg-primary-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <Brain className="h-6 w-6 text-primary-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-500">
                    Brain Age
                  </h3>
                </div>
                <p className="text-3xl font-bold text-primary-600">
                  {user.brainAge.toFixed(1)} years
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Premium Status
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {user?.isPremium ? (
                  <span className="text-yellow-600">Premium Active</span>
                ) : (
                  <span className="text-gray-600">Free Account</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Member Since
            </h3>
            <p className="text-lg text-gray-900">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
