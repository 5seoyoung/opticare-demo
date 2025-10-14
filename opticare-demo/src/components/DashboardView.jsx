import React from 'react'
import { Activity, AlertTriangle, Bed, TrendingUp, Clock, Droplets, Heart, Wind } from 'lucide-react'

const getRiskColor = (risk) => {
  if (risk < 0.2) return 'text-gray-600 bg-gray-100'
  if (risk < 0.4) return 'text-green-700 bg-green-100'
  if (risk < 0.6) return 'text-amber-700 bg-amber-100'
  return 'text-red-700 bg-red-100'
}

const getDeviceIcon = (device) => {
  switch (device) {
    case 'vent': return <Wind className="w-4 h-4" />
    case 'crrt': return <Droplets className="w-4 h-4" />
    case 'ecmo': return <Heart className="w-4 h-4" />
    default: return null
  }
}

const DashboardView = ({ patients, onSelectPatient }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">가용 병상</span>
          <Bed className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">12 / 24</div>
        <div className="text-xs text-gray-500 mt-1">50% 점유율</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">평균 LOS</span>
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">3.2일</div>
        <div className="text-xs text-green-600 mt-1">↓ 0.3일 (전주 대비)</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">재전실률 (48h)</span>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">4.2%</div>
        <div className="text-xs text-amber-600 mt-1">목표: &lt;5%</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">알람 PPV</span>
          <Activity className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">78%</div>
        <div className="text-xs text-gray-500 mt-1">민감도: 85%</div>
      </div>
    </div>

    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">환자 우선순위 큐</h2>
        <p className="text-sm text-gray-600 mt-1">위험도 기반 정렬 · 실시간 업데이트</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">환자 ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">군집</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">위험도</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">알람</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">LOS</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">장비</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">추천</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((p) => (
              <tr key={p.id} onClick={() => onSelectPatient(p)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.id}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">{p.cluster}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getRiskColor(p.risk)}`}>
                    {(p.risk * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-3">{p.alert && <AlertTriangle className="w-4 h-4 text-amber-600" />}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{p.los}일</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.devices.map((d, idx) => (
                      <span key={idx} className="text-gray-600">{getDeviceIcon(d)}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{p.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

export default DashboardView
