'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [form, setForm] = useState({ description: '', amount: '', type: 'expense' })

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
    
    if (data) setTransactions(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.amount) return

    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          description: form.description,
          amount: parseFloat(form.amount),
          type: form.type,
          date: new Date().toISOString()
        }
      ])

    if (!error) {
      setForm({ description: '', amount: '', type: 'expense' })
      fetchTransactions() // Atualiza a lista automaticamente
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Transações</h2>

      {/* Formulário Simples de Adição */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">Nova Transação</h3>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Descrição</label>
            <input 
              className="w-full border rounded p-2"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Ex: Aluguel"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-600 mb-1">Valor (R$)</label>
            <input 
              type="number" 
              className="w-full border rounded p-2"
              value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})}
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-600 mb-1">Tipo</label>
            <select 
              className="w-full border rounded p-2"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">
            Adicionar
          </button>
        </form>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4">Descrição</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium">{t.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.type === 'income' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                <td className={`p-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}