// src/data/mockData.js

/** 환자 목록 (EMR/시뮬레이터 공통) */
export const patients = [
  {
    id: 'P001',
    name: '환자 001',
    cluster: 'C2',
    risk: 0.67,
    alert: true,
    trend: 'up',
    los: 3.2,
    devices: ['vent', 'crrt'],
    recommendation: '일반병실 전실 검토',
    meds: ['Vent', 'CRRT', 'VasoPressor'],
  },
  {
    id: 'P002',
    name: '환자 002',
    cluster: 'C1',
    risk: 0.31,
    alert: false,
    trend: 'stable',
    los: 1.8,
    devices: ['vent'],
    recommendation: '현재 상태 유지',
    meds: ['Vent', 'Antibiotic'],
  },
  {
    id: 'P003',
    name: '환자 003',
    cluster: 'C0',
    risk: 0.12,
    alert: false,
    trend: 'down',
    los: 5.1,
    devices: [],
    recommendation: '6시간 내 전실 권고',
    meds: ['Diuretic'],
  },
  {
    id: 'P004',
    name: '환자 004',
    cluster: 'C3',
    risk: 0.45,
    alert: true,
    trend: 'up',
    los: 2.4,
    devices: ['vent', 'ecmo'],
    recommendation: '집중 모니터링',
    meds: ['Vent', 'ECMO', 'Sedation'],
  },
];

/** 시뮬레이터에서 사용할 약물 목록 */
export const meds = [
  'Vent',
  'CRRT',
  'VasoPressor',
  'Sedation',
  'Steroid',
  'Diuretic',
  'Antibiotic',
];

/** 대시보드 위젯용 예시 지표 */
export const topFeatures = [
  { label: 'MAP mean', value: 62, unit: 'mmHg', ref: '70-100', delta: -12 },
  { label: 'HR std', value: 18.3, unit: 'bpm', ref: '<15', delta: +3.3 },
  { label: 'SpO2 min', value: 88, unit: '%', ref: '>92', delta: -7 },
  { label: 'NIBP systolic min', value: 85, unit: 'mmHg', ref: '>90', delta: -8 },
];

/** 예시 KM 데이터 */
export const kmData = [
  { time: 0, survival: 1.0 },
  { time: 6, survival: 0.92 },
  { time: 12, survival: 0.85 },
  { time: 24, survival: 0.78 },
  { time: 48, survival: 0.68 },
  { time: 72, survival: 0.58 },
];

/** KPI(가용 병상 계산)용 간단 베드 목록 */
export const beds = [
  { id: 'B-01', label: '01', patientId: 'P001', isolation: false, vent: true },
  { id: 'B-02', label: '02', patientId: 'P002', isolation: true, vent: false },
  { id: 'B-03', label: '03', patientId: null, isolation: false, vent: false },
  { id: 'B-04', label: '04', patientId: 'P003', isolation: false, vent: false },
  { id: 'B-05', label: '05', patientId: 'P004', isolation: false, vent: true },
  { id: 'B-06', label: '06', patientId: null, isolation: false, vent: false },
];

/** (선택) 플로어플랜 – 현재 UI에선 미사용.
 *  App에서 더 이상 import하지 않는다면 이 export를 지워도 됩니다.
 */
export const floorplan = {
  cols: 12,
  rows: 8,
  areas: [
    { type: 'entrance', x: 0, y: 7, w: 3, h: 1, label: '출입구', note: 'ER → ICU' },
    { type: 'clean', x: 0, y: 0, w: 2, h: 1, label: 'Clean Utility' },
    { type: 'dirty', x: 2, y: 0, w: 2, h: 1, label: 'Dirty Utility' },
    { type: 'desk', x: 4.2, y: 3.0, w: 1.8, h: 1.2, label: '의사 데스크' },
    { type: 'nurse', x: 6.2, y: 3.0, w: 1.8, h: 1.2, label: '간호사실' },
    { type: 'corridor', x: 0, y: 2, w: 12, h: 0.3, label: '복도' },
  ],
  beds: [
    { id: 'B-01', label: '01', x: 0.5, y: 2.5, w: 2.5, h: 1.2, patientId: 'P001', isolation: false, vent: true },
    { id: 'B-02', label: '02', x: 0.5, y: 4.0, w: 2.5, h: 1.2, patientId: 'P002', isolation: true, vent: false },
    { id: 'B-03', label: '03', x: 0.5, y: 5.5, w: 2.5, h: 1.2, patientId: null },
    { id: 'B-04', label: '04', x: 3.5, y: 2.5, w: 2.5, h: 1.2, patientId: 'P003', vent: false },
    { id: 'B-05', label: '05', x: 3.5, y: 4.0, w: 2.5, h: 1.2, patientId: 'P004', vent: true, ecmo: true },
    { id: 'B-06', label: '06', x: 3.5, y: 5.5, w: 2.5, h: 1.2, patientId: null },
    { id: 'B-07', label: '07', x: 6.5, y: 2.5, w: 2.5, h: 1.2, patientId: null },
    { id: 'B-08', label: '08', x: 6.5, y: 4.0, w: 2.5, h: 1.2, patientId: null },
    { id: 'B-09', label: '09', x: 6.5, y: 5.5, w: 2.5, h: 1.2, patientId: null },
  ],
};
