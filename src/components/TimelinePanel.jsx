import React, { useEffect, useState } from 'react';
import { loadPatientRiskTimeline } from '../lib/dataLoader';
const TimelinePanel = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => { loadPatientRiskTimeline().then(setRows).catch(console.error); }, []);
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">재평가 타임라인</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">시간</th>
              <th className="px-3 py-2 text-left">환자</th>
              <th className="px-3 py-2 text-left">군집</th>
              <th className="px-3 py-2 text-left">위험도</th>
              <th className="px-3 py-2 text-left">알람</th>
              <th className="px-3 py-2 text-left">상위 피처</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="px-3 py-2">{new Date(r.timestamp).toLocaleString()}</td>
                <td className="px-3 py-2">{r.stay_id}</td>
                <td className="px-3 py-2"><span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{r.cluster_id}</span></td>
                <td className="px-3 py-2">{(r.risk * 100).toFixed(0)}%</td>
                <td className="px-3 py-2">{r.alert_flag ? '⚠️' : '-'}</td>
                <td className="px-3 py-2 text-xs text-gray-600">
                  {r.top_features?.slice(0,3).map(f => f.name).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TimelinePanel;
