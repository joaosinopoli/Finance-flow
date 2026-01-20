'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

// Tipagem para os dados do banco
interface Transaction {
  id: number
  amount: number
  type: 'income' | 'expense'
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Busca dados reais ao carregar
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
    
    if (data) setTransactions(data)
    setLoading(false)
  }

  // Cálculos automáticos baseados nos dados vindos do Supabase
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const total = income - expense

  if (loading) return <div>Carregando dados financeiros...</div>

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card Saldo Total */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Saldo Total</p>
              <h3 className="text-2xl font-bold">R$ {total.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Card Entradas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Entradas</p>
              <h3 className="text-2xl font-bold text-emerald-600">R$ {income.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* Card Saídas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Saídas</p>
              <h3 className="text-2xl font-bold text-red-600">R$ {expense.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}