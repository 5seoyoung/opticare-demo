import React from 'react';
import Papa from 'papaparse';

export default function CsvUpload({ onPatients }) {
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        // 기대 컬럼: stay_id,name,risk,cluster_id,top_feature
        const cast = data.map(r => ({
          stay_id: r.stay_id,
          name: r.name,
          risk: Number(r.risk),
          cluster_id: Number(r.cluster_id),
          top_features: r.top_feature ? [{ name: r.top_feature }] : []
        })).filter(x => !Number.isNaN(x.risk));
        onPatients?.(cast);
      }
    });
  };
  return (
    <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm cursor-pointer">
      <input type="file" accept=".csv" className="hidden" onChange={onFile} />
      CSV 업로드(데모)
    </label>
  );
}
