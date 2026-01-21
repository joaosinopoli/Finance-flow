'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase' // Puxa do arquivo 2

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Finance Flow</h1>
            <p className="text-gray-500">Painel de Controle</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${session ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {session ? '● Online' : '○ Visitante'}
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-semibold uppercase">Saldo Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">R$ 1.250,00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-semibold uppercase">Entradas</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">R$ 3.000,00</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-semibold uppercase">Saídas</p>
            <p className="text-3xl font-bold text-rose-600 mt-2">R$ 1.750,00</p>
          </div>
        </div>

        {/* Área Central */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma transação recente</h3>
            <p className="text-gray-500">Adicione uma nova entrada para começar.</p>
        </div>

      </div>
    </div>
  )
}