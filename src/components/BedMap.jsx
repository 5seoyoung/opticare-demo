import React from 'react';
import { Bed, AlertTriangle, Shield, Wind } from 'lucide-react';

const RiskBadge = ({ risk = 0 }) => {
  const pct = Math.round(risk * 100);
  const color =
    risk >= 0.6 ? 'bg-red-100 text-red-700 border-red-200' :
    risk >= 0.4 ? 'bg-amber-100 text-amber-700 border-amber-200' :
    risk >= 0.25 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                   'bg-emerald-100 text-emerald-700 border-emerald-200';
  return (
    <span className={`px-1.5 py-0.5 text-[11px] rounded-md border ${color}`}>{pct}%</span>
  );
};

export default function BedMap({ beds = [], patients = [], onSelectPatient }) {
  // 환자 배열을 stay_id 기준으로 빠르게 조회
  const byStay = React.useMemo(() => {
    const m = new Map();
    patients.forEach(p => m.set(p.stay_id, p));
    return m;
  }, [patients]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-semibold">ICU 베드맵</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-600">
          <div className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-gray-300" />빈침상</div>
          <div className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-sky-300" />입원</div>
          <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-600" />고위험</div>
          <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-purple-600" />격리</div>
          <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-slate-600" />인공호흡기</div>
        </div>
      </div>

      {/* 4 x 6 그리드 (원하면 props로 cols 변경) */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {beds.map(bed => {
          const p = bed.stay_id ? byStay.get(bed.stay_id) : null;
          const occupied = !!p;
          const highRisk = (p?.risk ?? 0) >= 0.6;

          return (
            <button
              key={bed.id}
              onClick={() => occupied && onSelectPatient?.(p)}
              className={[
                'group relative rounded-xl border transition shadow-sm text-left',
                occupied ? 'bg-sky-50/50 border-sky-200 hover:border-sky-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300',
                !occupied && 'cursor-default'
              ].join(' ')}
            >
              {/* 헤더 라인 */}
              <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100">
                <div className="text-xs font-semibold text-gray-700">Bed {bed.label}</div>
                <div className="flex items-center gap-1">
                  {bed.isolation && <Shield className="w-3.5 h-3.5 text-purple-600" title="격리" />}
                  {bed.vent && <Wind className="w-3.5 h-3.5 text-slate-600" title="인공호흡기" />}
                  {occupied && <RiskBadge risk={p?.risk ?? 0} />}
                </div>
              </div>

              {/* 본문 */}
              <div className="px-3 py-3 h-20 flex items-center">
                {occupied ? (
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {p.name}<span className="ml-1 text-gray-400 text-xs">#{p.stay_id}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      군집 C{p.cluster_id} · 상위피처 {p.top_features?.[0]?.name ?? '—'}
                    </div>
                    {highRisk && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-700">
                        <AlertTriangle className="w-3 h-3" /> 고위험
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">빈 침상</div>
                )}
              </div>

              {/* 클릭 유도 오버레이 */}
              {occupied && (
                <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 group-hover:ring-blue-300/80 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
