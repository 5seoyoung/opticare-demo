import React, { useMemo } from 'react';
function triageScore({ age, mapMean, spo2, complaint }) {
  let score = 0;
  if (age >= 75) score += 2;
  if (mapMean < 65) score += 3;
  if (spo2 < 90) score += 3;
  if ((complaint || '').toLowerCase().includes('bleeding')) score += 2;
  const unit = score >= 6 ? 'MICU' : score >= 4 ? 'SICU' : 'TSICU';
  const reasons = [
    ...(age >= 75 ? ['고령(≥75)'] : []),
    ...(mapMean < 65 ? ['MAP<65'] : []),
    ...(spo2 < 90 ? ['SpO2<90%'] : []),
    ...((complaint || '').toLowerCase().includes('bleeding') ? ['active bleeding'] : [])
  ];
  return { score, unit, reasons };
}
const TriageCard = ({ sample = { age: 78, sex: 'F', mapMean: 62, spo2: 88, complaint: 'post-op bleeding?' } }) => {
  const { score, unit, reasons } = useMemo(() => triageScore(sample), [sample]);
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">트리아지</h3>
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700">
          점수 {score}
        </span>
      </div>
      <div className="text-sm text-gray-700 mb-3">
        나이 {sample.age}, 성별 {sample.sex}, MAP {sample.mapMean} mmHg, SpO2 {sample.spo2}%
      </div>
      <div className="text-sm text-gray-900 mb-2">추천 병실: <b>{unit}</b></div>
      <div className="text-xs text-gray-600">근거: {reasons.join(' · ') || '안정'}</div>
    </div>
  );
};
export default TriageCard;
