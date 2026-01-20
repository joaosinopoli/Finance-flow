'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, TrendingUp, TrendingDown, Calendar, Search } from 'lucide-react'

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado do formulário
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Data de hoje padrão YYYY-MM-DD

  const supabase = createClient()

  // 1. Busca os dados ao carregar a página
  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false }) // Mais recentes primeiro
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar:', error)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  // 2. Função para Adicionar Transação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description || !amount) return

    setIsSubmitting(true)

    // O user_id é inserido automaticamente pelo Supabase (default auth.uid())
    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          description,
          amount: parseFloat(amount),
          type,
          category: category || 'Outros', // Default se vazio
          date
        }
      ])

    if (error) {
      alert('Erro ao salvar: ' + error.message)
    } else {
      // Limpa o formulário e recarrega a lista
      setDescription('')
      setAmount('')
      setCategory('')
      fetchTransactions()
    }
    setIsSubmitting(false)
  }

  // 3. Função para Deletar Transação
  async function handleDelete(id: number) {
    const confirm = window.confirm('Tem certeza que deseja excluir esta transação?')
    if (!confirm) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar')
    } else {
      // Remove da lista localmente para ser instantâneo (UI otimista)
      setTransactions(transactions.filter(t => t.id !== id))
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transações</h1>
          <p className="text-gray-500">Gerencie suas entradas e saídas</p>
        </div>
      </div>

      {/* --- FORMULÁRIO DE ADIÇÃO RÁPIDA --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Nova Movimentação</h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* Descrição */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
            <input 
              type="text" 
              placeholder="Ex: Recebimento de Projeto"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
            <input 
              type="text" 
              placeholder="Ex: Serviços"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
          </div>

          {/* Valor */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0,00"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

           {/* Data */}
           <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
            <input 
              type="date" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Botão Tipo e Submit */}
          <div className="md:col-span-2 flex gap-2">
             <select 
              className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-medium outline-none border transition-all cursor-pointer ${
                type === 'income' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
              value={type}
              onChange={e => setType(e.target.value as 'income' | 'expense')}
            >
              <option value="expense">Saída</option>
              <option value="income">Entrada</option>
            </select>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-black text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? '...' : <Plus size={20} />}
            </button>
          </div>
        </form>
      </div>

      {/* --- LISTAGEM --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando movimentações...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">Nenhuma transação encontrada</h3>
            <p className="text-gray-500 text-sm">Adicione sua primeira entrada ou saída acima.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <span className="font-medium text-gray-900">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                      {t.category || 'Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400"/>
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}