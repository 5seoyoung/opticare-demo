// src/components/RecommendationsView.jsx
import React, { useMemo, useState } from "react";
import { AlertTriangle, Send, CheckCircle, Phone, Users, Mail } from "lucide-react";

/**
 * 데모용 문자/이메일 전송 시뮬레이터:
 * - 의사 선택(드롭다운) + 번호 입력(기본값 자동 채움)
 * - 임계치 초과 환자 목록 확인
 * - "문자 보내기", "이메일 보내기" (둘 다 데모)
 * - 실제 외부 API 호출 없음 (프론트에서만 동작)
 */
const DOCTORS = [
  { id: "md-kim", name: "김의사", role: "중환자의학과", phone: "+821012345678" },
  { id: "md-lee", name: "이의사", role: "흉부외과", phone: "+821055566677" },
  { id: "md-park", name: "박의사", role: "마취통증의학과", phone: "+821077788899" },
];

export default function RecommendationsView({ patients = [], threshold = 0.28, setThreshold }) {
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0].id);
  const [phone, setPhone] = useState(DOCTORS[0].phone);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [logs, setLogs] = useState([]);

  const doctor = useMemo(() => DOCTORS.find(d => d.id === selectedDoctor), [selectedDoctor]);

  const alertPatients = useMemo(
    () => patients.filter(p => (p.risk ?? 0) >= threshold).sort((a, b) => b.risk - a.risk),
    [patients, threshold]
  );

  const messagePreview = useMemo(() => {
    const lines = [
      `[Opticare] 임계치 ${Math.round(threshold * 100)}% 초과 환자 ${alertPatients.length}명`,
      ...alertPatients.map(p => `• ${p.name} (stay:${p.stay_id})  risk:${(p.risk * 100).toFixed(1)}%  cluster:C${p.cluster_id}`)
    ];
    return lines.join("\n");
  }, [alertPatients, threshold]);

  const handleSendSMS = async () => {
    if (!alertPatients.length) {
      setToast({ type: "warn", text: "임계치 초과 환자가 없습니다." });
      setTimeout(() => setToast(null), 1500);
      return;
    }
    setIsSending(true);
    await new Promise(r => setTimeout(r, 1000)); // 데모용 지연

    const entry = {
      ts: new Date().toISOString(),
      toName: doctor?.name || "수신자",
      toPhone: phone,
      count: alertPatients.length,
      body: messagePreview,
      threshold
    };
    setLogs(prev => [entry, ...prev].slice(0, 10));
    setIsSending(false);
    setToast({ type: "ok", text: `${doctor?.name}님께 문자 전송됨 (데모)` });
    setTimeout(() => setToast(null), 1800);
  };

  const handleSendEmail = () => {
    if (!alertPatients.length) {
      setToast({ type: "warn", text: "임계치 초과 환자가 없습니다." });
      setTimeout(() => setToast(null), 1500);
      return;
    }
    const subject = encodeURIComponent("[Opticare] 임계치 초과 환자 알림");
    const body = encodeURIComponent(messagePreview);
    // 메일 클라이언트 오픈 (데모)
    window.location.href = `mailto:?subject=${subject}&body=${body}`;

    const entry = {
      ts: new Date().toISOString(),
      toName: `${doctor?.name} (메일)`,
      toPhone: "mailto",
      count: alertPatients.length,
      body: messagePreview,
      threshold
    };
    setLogs(prev => [entry, ...prev].slice(0, 10));
    setToast({ type: "ok", text: `${doctor?.name}님께 이메일 전송됨 (데모)` });
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 전송 설정 */}
      <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-semibold">추천 보드 · 임계치 초과 환자</h2>
          </div>
          <div className="text-xs text-gray-500">데모 모드(전송 시뮬레이션)</div>
        </div>

        <div className="p-5 space-y-5">
          {/* 임계치 슬라이더 */}
          <div>
            <label className="text-sm font-medium text-gray-700">알람 임계치</label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.01"
                value={threshold}
                onChange={e => setThreshold?.(Number(e.target.value))}
                className="w-full"
              />
              <span className="w-16 text-right text-sm font-semibold text-blue-700">
                {(threshold * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">알람율 가드레일: 10~15% 권장</p>
          </div>

          {/* 수신자 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700">수신자</label>
              <div className="mt-2 relative">
                <select
                  value={selectedDoctor}
                  onChange={(e) => {
                    const d = DOCTORS.find(x => x.id === e.target.value);
                    setSelectedDoctor(e.target.value);
                    if (d) setPhone(d.phone);
                  }}
                  className="w-full border-gray-300 rounded-lg text-sm"
                >
                  {DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} · {d.role}</option>
                  ))}
                </select>
                <Users className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">수신번호(+82… 형식)</label>
              <div className="mt-2 relative">
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border-gray-300 rounded-lg text-sm pr-9"
                  placeholder="+8210xxxxxxxx"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs text-gray-500 mt-1">실제 전송 없음 · 화면에서만 시뮬레이션</p>
            </div>
          </div>

          {/* 환자 리스트 */}
          <div className="border rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600 flex justify-between">
              <span>임계치 {(threshold * 100).toFixed(0)}% 초과</span>
              <span>총 {alertPatients.length}명</span>
            </div>
            <ul className="divide-y">
              {alertPatients.map(p => (
                <li key={p.stay_id} className="px-4 py-3 text-sm flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {p.name} <span className="text-gray-400 text-xs">stay:{p.stay_id}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      cluster C{p.cluster_id} · 상위 피처 {p.top_features?.[0]?.name || '—'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-700">{(p.risk * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">risk</div>
                  </div>
                </li>
              ))}
              {!alertPatients.length && (
                <li className="px-4 py-6 text-sm text-gray-500">임계치 조건을 만족하는 환자가 없습니다.</li>
              )}
            </ul>
          </div>

          {/* 미리보기 & 전송 버튼들 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700">메시지 미리보기</label>
              <textarea
                readOnly
                className="mt-2 w-full h-36 text-sm font-mono border-gray-300 rounded-lg"
                value={messagePreview}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSendSMS}
                disabled={isSending}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold transition
                  ${isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Send className="w-4 h-4" />
                {isSending ? '전송 중…' : '문자 보내기(데모)'}
              </button>

              <button
                onClick={handleSendEmail}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
              >
                <Mail className="w-4 h-4" />
                이메일 보내기(데모)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 우측: 발송 로그 */}
      <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 h-fit">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold">발송 로그</h3>
          <p className="text-xs text-gray-500 mt-1">최근 10건(데모)</p>
        </div>
        <ul className="divide-y">
          {logs.length === 0 && (
            <li className="p-5 text-sm text-gray-500">아직 전송 이력이 없습니다.</li>
          )}
          {logs.map((l, idx) => (
            <li key={idx} className="p-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{l.toName} <span className="text-gray-400">({l.toPhone})</span></div>
                <div className="text-xs text-gray-500">{new Date(l.ts).toLocaleString()}</div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                임계치 {(l.threshold * 100).toFixed(0)}% · {l.count}명
              </div>
              <pre className="mt-2 text-xs bg-gray-50 border border-gray-100 rounded-lg p-2 whitespace-pre-wrap">{l.body}</pre>
            </li>
          ))}
        </ul>
      </aside>

      {/* 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg text-white text-sm
            ${toast.type === 'ok' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
            {toast.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}

