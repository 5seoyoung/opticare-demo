export const patients = [
  { id: 'P001', name: '환자 001', cluster: 'C2', risk: 0.67, alert: true, trend: 'up', los: 3.2, devices: ['vent', 'crrt'], recommendation: '일반병실 전실 검토' },
  { id: 'P002', name: '환자 002', cluster: 'C1', risk: 0.31, alert: false, trend: 'stable', los: 1.8, devices: ['vent'], recommendation: '현재 상태 유지' },
  { id: 'P003', name: '환자 003', cluster: 'C0', risk: 0.12, alert: false, trend: 'down', los: 5.1, devices: [], recommendation: '6시간 내 전실 권고' },
  { id: 'P004', name: '환자 004', cluster: 'C3', risk: 0.45, alert: true, trend: 'up', los: 2.4, devices: ['vent', 'ecmo'], recommendation: '집중 모니터링' },
]

export const topFeatures = [
  { label: 'MAP mean', value: 62, unit: 'mmHg', ref: '70-100', delta: -12 },
  { label: 'HR std', value: 18.3, unit: 'bpm', ref: '<15', delta: +3.3 },
  { label: 'SpO2 min', value: 88, unit: '%', ref: '>92', delta: -7 },
  { label: 'NIBP systolic min', value: 85, unit: 'mmHg', ref: '>90', delta: -8 },
]

export const kmData = [
  { time: 0, survival: 1.0 },
  { time: 6, survival: 0.92 },
  { time: 12, survival: 0.85 },
  { time: 24, survival: 0.78 },
  { time: 48, survival: 0.68 },
  { time: 72, survival: 0.58 },
]
