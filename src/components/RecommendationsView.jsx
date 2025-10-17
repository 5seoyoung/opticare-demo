// src/components/RecommendationsView.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { loadDoctors, loadPatientRiskTimeline } from '../lib/dataLoader';
import { sendAlertEmail } from '../lib/alertClient';

// 간단 색상 유틸
function riskBadge(risk) {
  if (risk >= 0.7) return 'bg-red-100 text-red-700';
  if (risk >= 0.4) return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
}

export default function RecommendationsView() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState(null);

  // 로드: 의사 목록 + 최근 위험도(데모에선 patient_risk.json 재활용)
  useEffect(() => {
    loadDoctors().then((list) => {
      setDoctors(list);
      if (list[0]) setSelectedDoctorId(list[0].id);
    }).catch(console.error);

    loadPatientRiskTimeline()
      .then(setTimeline)
      .catch(console.error);
  }, []);

  // 데모용: 최신 타임스탬프의 레코드들만 추려 “현재 환자 리스트”로 사용
  const latestPerPatient = useMemo(() => {
    const byStay = new Map();
    for (const r of timeline) {
      const prev = byStay.get(r.stay_id);
      if (!prev || new Date(r.timestamp) > new Date(prev.timestamp)) {
        byStay.set(r.stay_id, r);
      }
    }
    // 추천 텍스트(데모)
    return [...byStay.values()].map((r) => ({
      ...r,
      id: r.stay_id,
      recommendation:
        r.risk >= 0.7
          ? '혈압/산소 모니터링 강화 및 혈역학적 재평가'
          : r.risk >= 0.4
          ? '수액/진통 관리 점검 및 12시간 후 재평가'
          : '표준 경과 관찰',
    }));
  }, [timeline]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  async function handleSendEmail(p) {
    if (!selectedDoctor) {
      setToast({ type: 'error', msg: '알림 수신 의사를 먼저 선택하세요.' });
      return;
    }
    try {
      setSendingId(p.id);
      await sendAlertEmail({
        doctorEmail: selectedDoctor.email,
        patientId: p.id,
        unit: 'ICU-1',
        risk: p.risk,
        note: p.recommendation,
      });
      setToast({ type: 'ok', msg: `이메일 전송 완료 → ${selectedDoctor.name}` });
    } catch (e) {
      setToast({ type: 'error', msg: `전송 실패: ${e.message}` });
    } finally {
      setSendingId(null);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">권고 & 알림</h3>
          <p className="text-sm text-gray-600">임계치 초과/우선 케이스에 대해 의사에게 바로 이메일 알림을 보낼 수 있습니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">알림 수신 의사</label>
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 환자 카드 리스트 */}
      <div className="grid md:grid-cols-2 gap-4">
        {latestPerPatient.map((p) => (
          <div key={p.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900">환자 {p.id}</div>
              <div className={`text-xs px-2 py-1 rounded ${riskBadge(p.risk)}`}>
                위험 {(p.risk * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                군집 {p.cluster_id}
              </span>
              <span className="text-xs text-gray-500">{new Date(p.timestamp).toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-800 mb-2">
              <AlertTriangle className="inline -mt-1 mr-1" size={16} />
              권고: {p.recommendation}
            </div>
            <div className="text-xs text-gray-600 mb-3">
              근거 피처: {p.top_features?.slice(0, 3).map((f) => f.name).join(', ')}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">임계치: {p.threshold_used}</div>
              <button
                onClick={() => handleSendEmail(p)}
                disabled={sendingId === p.id}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {sendingId === p.id ? '전송중…' : '의사에게 이메일'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div
          className={`mt-4 text-sm ${
            toast.type === 'ok' ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
