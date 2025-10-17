import React, { useMemo, useState } from "react";

/** 그룹 배지 (1~4) - 단색/가독성 우선  */
const groupTone = {
  1: "bg-emerald-50 text-emerald-700 border-emerald-200",
  2: "bg-yellow-50 text-yellow-700 border-yellow-200",
  3: "bg-amber-50 text-amber-700 border-amber-200",
  4: "bg-red-50 text-red-700 border-red-200",
};
const GroupBadge = ({ g }) => (
  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-md border ${groupTone[g] || groupTone[1]}`}>
    Group {g}
  </span>
);

/** 간단 예측 모델(모의): 약물 조합 → 위험도 변화 → 그룹(1~4) 산출 */
const MED_EFFECT = {
  Vent: +0.12,
  CRRT: +0.08,
  VasoPressor: +0.10,
  Sedation: +0.05,
  Steroid: -0.05,
  Diuretic: -0.03,
  Antibiotic: -0.02,
};

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}
function riskToGroup(r) {
  if (r >= 0.60) return 4;
  if (r >= 0.40) return 3;
  if (r >= 0.25) return 2;
  return 1;
}

function simulateRisk(baseRisk, meds = []) {
  const delta = meds.reduce((acc, m) => acc + (MED_EFFECT[m] ?? 0), 0);
  const newRisk = clamp01(baseRisk + delta);
  return { newRisk, delta };
}

/** 막대(그룹 1~4) 중 예측 그룹 강조 */
const GroupBar = ({ predicted }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((g) => (
        <div
          key={g}
          className={[
            "h-2 w-10 rounded",
            g === predicted ? "bg-gray-900" : "bg-gray-300",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/** 메인 패널 */
export default function SimulationPanel({ patients = [], allMeds = [] }) {
  const [selectedId, setSelectedId] = useState(patients[0]?.id);
  const patient = useMemo(() => patients.find(p => p.id === selectedId), [patients, selectedId]);

  // 선택된 환자의 기본 약물(EMR처럼 체크 표시)
  const [meds, setMeds] = useState(patient?.meds ?? []);
  React.useEffect(() => {
    setMeds(patient?.meds ?? []);
  }, [patient]);

  const baseRisk = patient?.risk ?? 0.3;
  const currentGroup = riskToGroup(baseRisk);
  const { newRisk, delta } = simulateRisk(baseRisk, meds);
  const predictedGroup = riskToGroup(newRisk);

  return (
    <section className="bg-white border border-gray-200 rounded-xl">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">시뮬레이션 · 처방 변경 → 모달리티 그룹</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            좌측에서 환자 선택 → 우측에서 약물 조정 → 예측 그룹/위험도 즉시 반영
          </p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌: 환자 목록 (EMR 스타일 테이블) */}
        <div className="lg:col-span-1 border rounded-lg overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-b">환자 목록</div>
          <ul className="divide-y">
            {patients.map(p => {
              const g = riskToGroup(p.risk ?? 0);
              const active = p.id === selectedId;
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedId(p.id)}
                    className={[
                      "w-full text-left px-3 py-2.5 text-sm",
                      active ? "bg-blue-50" : "hover:bg-gray-50"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{p.name} <span className="text-gray-400">#{p.id}</span></div>
                      <GroupBadge g={g} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Cluster {typeof p.cluster === "string" ? p.cluster : `C${p.cluster}`} · Risk {(p.risk * 100).toFixed(0)}%
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 우: 시뮬레이터 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* 약물 체크 */}
          <div className="md:col-span-2 border rounded-lg">
            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-b">약물/처치 선택</div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {(allMeds.length ? allMeds : Object.keys(MED_EFFECT)).map(m => {
                const checked = meds.includes(m);
                return (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={checked}
                      onChange={() => {
                        setMeds(prev =>
                          checked ? prev.filter(x => x !== m) : [...prev, m]
                        );
                      }}
                    />
                    <span>{m}</span>
                  </label>
                );
              })}
            </div>
            <div className="px-3 pb-3">
              <button
                onClick={() => setMeds(patient?.meds ?? [])}
                className="text-xs text-blue-600 hover:underline"
              >
                현재 처방으로 되돌리기
              </button>
            </div>
          </div>

          {/* 결과 카드 */}
          <div className="md:col-span-3 border rounded-lg">
            <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 border-b">예측 결과</div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">현재 그룹</div>
                <GroupBadge g={currentGroup} />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">예측 그룹</div>
                <GroupBadge g={predictedGroup} />
              </div>

              <GroupBar predicted={predictedGroup} />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">현재 위험도</div>
                  <div className="text-lg font-semibold">{(baseRisk * 100).toFixed(0)}%</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-gray-500">예측 위험도</div>
                  <div className="text-lg font-semibold">{(newRisk * 100).toFixed(0)}%</div>
                  <div className={`text-xs mt-1 ${delta >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                    {delta >= 0 ? "▲" : "▼"} {(Math.abs(delta) * 100).toFixed(0)}%p
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="text-xs text-gray-500 mb-1">적용 약물</div>
                {meds.length ? (
                  <div className="flex flex-wrap gap-1">
                    {meds.map(m => (
                      <span key={m} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 border">
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">선택된 약물이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
