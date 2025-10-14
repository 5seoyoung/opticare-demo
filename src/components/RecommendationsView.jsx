import React from 'react'
import { AlertTriangle } from 'lucide-react'

const getRiskColor = (risk) => {
  if (risk < 0.2) return 'text-gray-600 bg-gray-100'
  if (risk < 0.4) return 'text-green-700 bg-green-100'
  if (risk < 0.6) return 'text-amber-700 bg-amber-100'
  return 'text-red-700 bg-red-100'
}

const RecommendationsView = ({ patients, threshold, setThreshold }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">전실/배정 추천</h2>
      <div className="space-y-4">
        {patients.filter(p => p.alert).map((p) => (
          <div key={p.id} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-gray-900">{p.id}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getRiskColor(p.risk)}`}>위험도 {(p.risk * 100).toFixed(0)}%</span>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">승인</button>
            </div>
            <p className="text-sm text-gray-700 mb-3">{p.recommendation}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-700"><div className="w-2 h-2 rounded-full bg-green-500" /><span>장비 가용</span></div>
              <div className="flex items-center gap-1 text-green-700"><div className="w-2 h-2 rounded-full bg-green-500" /><span>간호 스킬 충족</span></div>
              <div className="flex items-center gap-1 text-green-700"><div className="w-2 h-2 rounded-full bg-green-500" /><span>격리실 불필요</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">알람 임계치 설정</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-700">위험도 임계치</label>
            <span className="text-sm font-semibold text-gray-900">{(threshold * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range" min="0.1" max="0.5" step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-600 mb-1">예상 PPV</div>
            <div className="text-lg font-bold text-gray-900">{(65 + threshold * 50).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">예상 민감도</div>
            <div className="text-lg font-bold text-gray-900">{(95 - threshold * 40).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">예상 알람률</div>
            <div className="text-lg font-bold text-gray-900">{(15 + threshold * 20).toFixed(1)}/h</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default RecommendationsView
