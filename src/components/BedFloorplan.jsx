import React, { useMemo } from "react";
import { Bed, Shield, Wind, Droplets, Heart } from "lucide-react";

/** 리스크 뱃지 */
const RiskBadge = ({ risk = 0 }) => {
  const pct = Math.round((risk ?? 0) * 100);
  const tone =
    risk >= 0.6
      ? "bg-red-100 text-red-700 border-red-200"
      : risk >= 0.4
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : risk >= 0.25
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";
  return (
    <span className={`px-1.5 py-0.5 text-[11px] rounded-md border ${tone}`}>
      {pct}%
    </span>
  );
};

const DeviceIcons = ({ vent, crrt, ecmo }) => (
  <div className="flex gap-1 text-slate-600">
    {vent && <Wind className="w-3.5 h-3.5" title="Vent" />}
    {crrt && <Droplets className="w-3.5 h-3.5" title="CRRT" />}
    {ecmo && <Heart className="w-3.5 h-3.5" title="ECMO" />}
  </div>
);

/**
 * props:
 * - layout: { cols, rows, beds[], areas[] }
 *   beds:  [{ id,label,x,y,w,h,rotation, patientId,isolation,vent,crrt,ecmo }]
 *   areas: [{ type:'nurse'|'desk'|'entrance'|'clean'|'dirty'|'corridor', x,y,w,h,label,note }]
 * - patients: [{ id, name, risk, cluster, devices, ... }]
 * - onSelectPatient: (patient) => void
 */
export default function BedFloorplan({ layout, patients = [], onSelectPatient }) {
  const { cols = 12, rows = 8, beds = [], areas = [] } = layout || {};

  const pmap = useMemo(() => {
    const m = new Map();
    patients.forEach((p) => m.set(p.id, p));
    return m;
  }, [patients]);

  const areaBaseClass = (type) => {
    switch (type) {
      case "nurse":
        return "bg-amber-50 border-amber-200 text-amber-800";
      case "desk":
        return "bg-sky-50 border-sky-200 text-sky-800";
      case "entrance":
        return "bg-emerald-50 border-emerald-200 text-emerald-800";
      case "clean":
        return "bg-lime-50 border-lime-200 text-lime-800";
      case "dirty":
        return "bg-rose-50 border-rose-200 text-rose-800";
      case "corridor":
        return "bg-gray-200/60 border-gray-300 text-gray-700";
      default:
        return "bg-gray-100 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">ICU 플로어플랜</h2>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300" /> 빈침상
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-300" /> 입원
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-purple-600" /> 격리
          </span>
          <span className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-slate-600" /> Vent
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> 출입구
          </span>
        </div>
      </div>

      {/* 그리드 캔버스 */}
      <div className="p-5">
        <div
          className="relative w-full rounded-xl border border-gray-200"
          style={{
            aspectRatio: `${cols} / ${rows}`,
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: `${100 / cols}% ${100 / rows}%`,
            backgroundColor: "#f8fafc",
          }}
        >
          {/* 영역(간호사실, 데스크, 출입구, 복도 등) */}
          {areas.map((a, i) => (
            <div
              key={`area-${i}`}
              className={`absolute rounded-lg border px-2 py-1 text-[11px] ${areaBaseClass(a.type)} ${
                a.type === "corridor" ? "pointer-events-none" : ""
              }`}
              style={{
                left: `${(a.x / cols) * 100}%`,
                top: `${(a.y / rows) * 100}%`,
                width: `${(a.w / cols) * 100}%`,
                height: `${(a.h / rows) * 100}%`,
              }}
            >
              <div className="font-semibold">{a.label}</div>
              {a.note && <div className="opacity-70">{a.note}</div>}
            </div>
          ))}

          {/* 베드 타일 */}
          {beds.map((b) => {
            const p = b.patientId ? pmap.get(b.patientId) : null;
            const occupied = Boolean(p);
            return (
              <button
                key={b.id}
                onClick={() => occupied && onSelectPatient?.(p)}
                className={[
                  "absolute rounded-lg border text-left shadow-sm transition",
                  occupied
                    ? "bg-white/90 border-sky-200 hover:border-sky-300"
                    : "bg-white/70 border-gray-200 hover:border-gray-300",
                ].join(" ")}
                style={{
                  left: `${(b.x / cols) * 100}%`,
                  top: `${(b.y / rows) * 100}%`,
                  width: `${(b.w / cols) * 100}%`,
                  height: `${(b.h / rows) * 100}%`,
                }}
                title={occupied ? `${p?.name ?? p?.id} · ${(p?.risk * 100).toFixed(0)}%` : "빈 침상"}
              >
                <div className="px-2 py-1 border-b border-gray-100 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-gray-700">Bed {b.label}</div>
                  <div className="flex items-center gap-1">
                    {b.isolation && <Shield className="w-3.5 h-3.5 text-purple-600" title="격리" />}
                    <DeviceIcons vent={b.vent} crrt={b.crrt} ecmo={b.ecmo} />
                    {occupied && <RiskBadge risk={p?.risk ?? 0} />}
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  {occupied ? (
                    <>
                      <div className="text-sm font-medium text-gray-900">
                        {p?.name ?? p?.id}
                        <span className="ml-1 text-gray-400 text-[11px]">#{p?.id}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        군집 {typeof p?.cluster === "string" ? p?.cluster : `C${p?.cluster}`}
                        {p?.devices?.length ? ` · ${p.devices[0].toUpperCase()}` : ""}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">빈 침상</div>
                  )}
                </div>

                {occupied && (
                  <div className="absolute bottom-1 right-1 bg-white/90 text-[10px] px-1 rounded border text-gray-700">
                    {typeof p?.cluster === "string" ? p?.cluster : `C${p?.cluster}`} · {(p?.risk * 100).toFixed(0)}%
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
