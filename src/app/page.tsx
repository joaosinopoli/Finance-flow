'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase' // Importa do arquivo 1

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Busca a sessão sem travar a tela
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>
            <p className="text-gray-500">Bem-vindo ao seu painel financeiro</p>
          </div>
          <div className="text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
             Status: {session ? '🟢 Online' : '⚪ Visitante'}
          </div>
        </header>
        
        {/* Cards de Resumo */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Saldo Total</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">R$ 0,00</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Entradas</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">R$ 0,00</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Saídas</h3>
              <p className="text-3xl font-bold text-rose-600 mt-2">R$ 0,00</p>
          </div>
        </div>

        {/* Área Principal Vazia */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center h-64 flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-4">Nenhuma transação recente</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              + Nova Transação
            </button>
        </div>
      </div>
    </div>
  )
}