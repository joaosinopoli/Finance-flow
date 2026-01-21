'use client'

import { createClient } from '../../../utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md">
        <h2 className="text-lg font-semibold mb-4">Sessão</h2>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Sair do Sistema (Logout)
        </button>
      </div>
    </div>
  )
}