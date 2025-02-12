'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Save } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  phoneNumber: string
  address: string
  freeShippingThreshold: number
  enableRegistration: boolean
  enableReviews: boolean
  maintenanceMode: boolean
}

const defaultSettings: Settings = {
  siteName: 'Essencial',
  siteDescription: 'E-commerce especializado em produtos de beleza e cosméticos',
  contactEmail: '',
  phoneNumber: '',
  address: '',
  freeShippingThreshold: 150,
  enableRegistration: true,
  enableReviews: true,
  maintenanceMode: false,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const { isLoading, error, fetchSettings, updateSettings } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const data = await fetchSettings()
    if (data) {
      setSettings({
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        contactEmail: data.contactEmail,
        phoneNumber: data.phoneNumber,
        address: data.address,
        freeShippingThreshold: Number(data.freeShippingThreshold),
        enableRegistration: data.enableRegistration,
        enableReviews: data.enableReviews,
        maintenanceMode: data.maintenanceMode,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const result = await updateSettings(settings)
      if (result) {
        alert('Configurações salvas com sucesso!')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Informações do Site */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações do Site</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Site
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, siteName: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      siteDescription: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informações de Contato</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contato
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, address: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Configurações de E-commerce */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Configurações de E-commerce
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Mínimo para Frete Grátis
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        freeShippingThreshold: Number(e.target.value),
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configurações do Sistema */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Configurações do Sistema
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableRegistration: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Permitir novos cadastros
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enableReviews}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      enableReviews: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Permitir avaliações de produtos
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      maintenanceMode: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Modo de manutenção
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  )
} 