import React, { useState } from 'react'
import { Activity, Users, Zap, Info } from 'lucide-react'
import Header from './components/Header'
import DashboardView from './components/DashboardView'
import PatientDetailView from './components/PatientDetailView'
import RecommendationsView from './components/RecommendationsView'
import { patients as mockPatients, kmData, topFeatures } from './data/mockData'

const App = () => {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [threshold, setThreshold] = useState(0.28)

  const handleSelectPatient = (p) => { setSelectedPatient(p); setActiveView('patient') }

  return (
    <div className="min-h-screen">
      <Header />

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {[
              { id: 'dashboard', label: '운영 대시보드', icon: Activity },
              { id: 'patient', label: '환자 상세', icon: Users },
              { id: 'recommendations', label: '추천 보드', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeView === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeView === 'dashboard' && (
          <DashboardView patients={mockPatients} onSelectPatient={handleSelectPatient} />
        )}
        {activeView === 'patient' && (
          <PatientDetailView
            selectedPatient={selectedPatient}
            threshold={threshold}
            topFeatures={topFeatures}
            kmData={kmData}
            onBack={() => setActiveView('dashboard')}
          />
        )}
        {activeView === 'recommendations' && (
          <RecommendationsView patients={mockPatients} threshold={threshold} setThreshold={setThreshold} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>임상 의사결정 지원 도구 · 최종 판단은 의료진이 수행</span>
            </div>
            <div>Model v4.2.1 · 데이터 지연 &lt;5분</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
