import React from 'react'
import { Activity, Info } from 'lucide-react'

const getRiskColor = (risk) => {
  if (risk < 0.2) return 'text-gray-600 bg-gray-100'
  if (risk < 0.4) return 'text-green-700 bg-green-100'
  if (risk < 0.6) return 'text-amber-700 bg-amber-100'
  return 'text-red-700 bg-red-100'
}

const PatientDetailView = ({ selectedPatient, threshold, topFeatures, kmData, onBack }) => {
  if (!selectedPatient) return null

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">← 대시보드로 돌아가기</button>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedPatient.id} · 입실 {selectedPatient.los}일차</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${getRiskColor(selectedPatient.risk)}`}>
            위험도 {(selectedPatient.risk * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            위험도 평가
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">현재 위험 확률</span>
                <span className="text-2xl font-bold text-gray-900">{(selectedPatient.risk * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `${selectedPatient.risk * 100}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">임계치</span>
                <span className="font-medium">{(threshold * 100).toFixed(0)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">군집</span>
                <span className="font-medium">{selectedPatient.cluster}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs text-blue-800">캘리브레이션 적용됨 (신뢰구간 ±4%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 위험 요인</h3>
          <div className="space-y-3">
            {topFeatures.map((f, idx) => (
              <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{f.label}</span>
                  <span className={`text-sm font-semibold ${f.delta < 0 ? 'text-red-600' : 'text-amber-600'}`}>{f.delta > 0 ? '+' : ''}{f.delta}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{f.value} {f.unit}</span>
                  <span>기준: {f.ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">군집 생존 곡선 (Cluster {selectedPatient.cluster})</h3>
        <div className="relative h-64">
          <svg width="100%" height="100%" viewBox="0 0 600 240" className="overflow-visible">
            <line x1="50" y1="200" x2="550" y2="200" stroke="#E5E7EB" strokeWidth="2" />
            <line x1="50" y1="200" x2="50" y2="20" stroke="#E5E7EB" strokeWidth="2" />
            {[0.2,0.4,0.6,0.8,1.0].map((val, idx) => (
              <g key={idx}>
                <line x1="50" y1={200 - val * 180} x2="550" y2={200 - val * 180} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                <text x="30" y={205 - val * 180} fontSize="12" fill="#6B7280" textAnchor="end">{(val*100).toFixed(0)}%</text>
              </g>
            ))}
            <polyline
              points={kmData.map((d, i) => `${50 + (i / (kmData.length - 1)) * 500},${200 - d.survival * 180}`).join(' ')}
              fill="none" stroke="#2563EB" strokeWidth="3"
            />
            <circle cx={50 + (2 / (kmData.length - 1)) * 500} cy={200 - 0.85 * 180} r="6" fill="#DC2626" stroke="white" strokeWidth="2" />
            {[0,24,48,72].map((h, idx) => (
              <text key={idx} x={50 + (idx / 3) * 500} y="220" fontSize="12" fill="#6B7280" textAnchor="middle">{h}h</text>
            ))}
          </svg>
          <div className="absolute top-2 right-2 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-600" /><span className="text-gray-600">생존율</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-600" /><span className="text-gray-600">현재 ({selectedPatient.los * 24}h)</span></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 24시간 바이탈</h3>
        <div className="grid grid-cols-3 gap-4">
          {['MAP','HR','SpO2'].map((v) => (
            <div key={v} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">{v}</div>
              <svg width="100%" height="60" viewBox="0 0 200 60">
                <polyline
                  points={Array.from({ length: 24 }, (_, i) => `${i * 8.5},${30 + Math.sin(i * 0.5 + Math.random()) * 15}`).join(' ')}
                  fill="none" stroke="#2563EB" strokeWidth="2"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatientDetailView
