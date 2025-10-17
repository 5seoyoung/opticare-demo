export async function loadJSON(path) {
  const res = await fetch(`${import.meta.env.BASE_URL}${path}?v=${Date.now()}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}
export const loadDoctors = () => loadJSON('data/doctors.json');
export const loadPatientRiskTimeline = () => loadJSON('data/patient_risk.json');
