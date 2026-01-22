'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { authService } from '@/lib/auth'
import { Wallet, CreditCard, Crown } from 'lucide-react'

export default function WalletPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState(50000)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  const { data: balance } = useQuery({
    queryKey: ['walletBalance'],
    queryFn: async () => {
      const response = await api.get('/wallet/balance')
      return response.data
    },
    enabled: authService.isAuthenticated(),
  })

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/wallet/transactions')
      return response.data
    },
    enabled: authService.isAuthenticated(),
  })

  const purchasePremiumMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/wallet/premium/purchase')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      alert('Premium activated successfully!')
    },
  })

  const createPaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await api.post('/wallet/payment', {
        amount,
        type: 'deposit',
      })
      return response.data
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank')
      }
    },
  })

  const handlePurchasePremium = () => {
    if (window.confirm('Purchase Premium for 50,000 UZS?')) {
      purchasePremiumMutation.mutate()
    }
  }

  const handleDeposit = () => {
    createPaymentMutation.mutate(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Wallet</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Wallet className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold">Balance</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {balance?.balance?.toLocaleString() || 0} UZS
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-yellow-500 mr-3" />
              <h2 className="text-xl font-semibold">Premium Status</h2>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {balance?.isPremium ? 'Active' : 'Inactive'}
            </p>
            {!balance?.isPremium && (
              <button
                onClick={handlePurchasePremium}
                disabled={purchasePremiumMutation.isPending}
                className="mt-4 bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50"
              >
                {purchasePremiumMutation.isPending
                  ? 'Processing...'
                  : 'Purchase Premium (50,000 UZS)'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              min="1000"
              step="1000"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleDeposit}
              disabled={createPaymentMutation.isPending}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {createPaymentMutation.isPending
                ? 'Processing...'
                : 'Deposit'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-semibold">{transaction.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} UZS
                    </p>
                    <p className="text-sm text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No transactions yet.</p>
          )}
        </div>
      </main>
    </div>
  )
}
