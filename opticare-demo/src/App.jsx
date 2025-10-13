import React, { useState } from 'react';
import { Activity, AlertTriangle, Bed, Users, TrendingUp, Clock, Droplets, Heart, Wind, Zap, Info } from 'lucide-react';

const OpticareDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [threshold, setThreshold] = useState(0.28);
  const [activeView, setActiveView] = useState('dashboard');

  const patients = [
    { id: 'P001', name: '환자 001', cluster: 'C2', risk: 0.67, alert: true, trend: 'up', los: 3.2, devices: ['vent', 'crrt'], recommendation: '일반병실 전실 검토' },
    { id: 'P002', name: '환자 002', cluster: 'C1', risk: 0.31, alert: false, trend: 'stable', los: 1.8, devices: ['vent'], recommendation: '현재 상태 유지' },
    { id: 'P003', name: '환자 003', cluster: 'C0', risk: 0.12, alert: false, trend: 'down', los: 5.1, devices: [], recommendation: '6시간 내 전실 권고' },
    { id: 'P004', name: '환자 004', cluster: 'C3', risk: 0.45, alert: true, trend: 'up', los: 2.4, devices: ['vent', 'ecmo'], recommendation: '집중 모니터링' },
  ];

  const topFeatures = [
    { label: 'MAP mean', value: 62, unit: 'mmHg', ref: '70-100', delta: -12 },
    { label: 'HR std', value: 18.3, unit: 'bpm', ref: '<15', delta: +3.3 },
    { label: 'SpO2 min', value: 88, unit: '%', ref: '>92', delta: -7 },
    { label: 'NIBP systolic min', value: 85, unit: 'mmHg', ref: '>90', delta: -8 },
  ];

  const kmData = [
    { time: 0, survival: 1.0 },
    { time: 6, survival: 0.92 },
    { time: 12, survival: 0.85 },
    { time: 24, survival: 0.78 },
    { time: 48, survival: 0.68 },
    { time: 72, survival: 0.58 },
  ];

  const getRiskColor = (risk) => {
    if (risk < 0.2) return 'text-gray-600 bg-gray-100';
    if (risk < 0.4) return 'text-green-700 bg-green-100';
    if (risk < 0.6) return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'vent':
        return <Wind className="w-4 h-4" />;
      case 'crrt':
        return <Droplets className="w-4 h-4" />;
      case 'ecmo':
        return <Heart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const DashboardView = () => (
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
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setActiveView('patient');
                  }}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {patient.cluster}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getRiskColor(patient.risk)}`}>
                      {(patient.risk * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {patient.alert && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{patient.los}일</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {patient.devices.map((device, idx) => (
                        <span key={idx} className="text-gray-600">
                          {getDeviceIcon(device)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{patient.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PatientDetailView = () => {
    if (!selectedPatient) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveView('dashboard')}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← 대시보드로 돌아가기
        </button>

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
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedPatient.risk * 100}%` }}
                  />
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
              {topFeatures.map((feature, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{feature.label}</span>
                    <span className={`text-sm font-semibold ${feature.delta < 0 ? 'text-red-600' : 'text-amber-600'}`}>{feature.delta > 0 ? '+' : ''}{feature.delta}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{feature.value} {feature.unit}</span>
                    <span>기준: {feature.ref}</span>
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

              {[0.2, 0.4, 0.6, 0.8, 1.0].map((val, idx) => (
                <g key={idx}>
                  <line
                    x1="50"
                    y1={200 - val * 180}
                    x2="550"
                    y2={200 - val * 180}
                    stroke="#F3F4F6"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text x="30" y={205 - val * 180} fontSize="12" fill="#6B7280" textAnchor="end">
                    {(val * 100).toFixed(0)}%
                  </text>
                </g>
              ))}

              <polyline
                points={kmData.map((d, i) => `${50 + (i / (kmData.length - 1)) * 500},${200 - d.survival * 180}`).join(' ')}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
              />

              <circle cx={50 + (2 / (kmData.length - 1)) * 500} cy={200 - 0.85 * 180} r="6" fill="#DC2626" stroke="white" strokeWidth="2" />

              {[0, 24, 48, 72].map((hour, idx) => (
                <text key={idx} x={50 + (idx / 3) * 500} y="220" fontSize="12" fill="#6B7280" textAnchor="middle">
                  {hour}h
                </text>
              ))}
            </svg>
            <div className="absolute top-2 right-2 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-gray-600">생존율</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-gray-600">현재 ({selectedPatient.los * 24}h)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 24시간 바이탈</h3>
          <div className="grid grid-cols-3 gap-4">
            {['MAP', 'HR', 'SpO2'].map((vital) => (
              <div key={vital} className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">{vital}</div>
                <svg width="100%" height="60" viewBox="0 0 200 60">
                  <polyline
                    points={Array.from({ length: 24 }, (_, i) => `${i * 8.5},${30 + Math.sin(i * 0.5 + Math.random()) * 15}`).join(' ')}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RecommendationsView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">전실/배정 추천</h2>
        <div className="space-y-4">
          {patients.filter((p) => p.alert).map((patient) => (
            <div key={patient.id} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-gray-900">{patient.id}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getRiskColor(patient.risk)}`}>
                    위험도 {(patient.risk * 100).toFixed(0)}%
                  </span>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  승인
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-3">{patient.recommendation}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>장비 가용</span>
                </div>
                <div className="flex items-center gap-1 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>간호 스킬 충족</span>
                </div>
                <div className="flex items-center gap-1 text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>격리실 불필요</span>
                </div>
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
              type="range"
              min="0.1"
              max="0.5"
              step="0.01"
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx_auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <svg width="120" height="40" viewBox="0 0 1200 400" className="h-10">
                  <defs>
                    <linearGradient id="snuhGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <text x="50" y="280" fontFamily="Arial, sans-serif" fontSize="280" fontWeight="bold" fill="url(#snuhGradient)">SNUH</text>
                  <rect x="920" y="120" width="180" height="180" fill="url(#snuhGradient)" rx="20" />
                  <path d="M 980 160 L 1040 220 L 980 280" fill="none" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="h-8 w-px bg-gray-300" />
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">Opticare</h1>
                <p className="text-xs text-gray-600">중환자실 자원효율 에이전트</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">ICU 1병동</div>
                <div className="text-xs text-gray-600">2025.10.13 14:23</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">의</div>
            </div>
          </div>
        </div>
      </header>

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
                  activeView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'patient' && <PatientDetailView />}
        {activeView === 'recommendations' && <RecommendationsView />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx_auto px-6 py-4">
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
  );
};

export default OpticareDashboard;


