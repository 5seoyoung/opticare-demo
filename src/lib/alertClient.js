export async function sendAlertEmail({ doctorEmail, patientId, unit, risk, note }) {
  const endpoint = import.meta.env.VITE_ALERT_ENDPOINT;
  const token = import.meta.env.VITE_ALERT_TOKEN;
  if (!endpoint) throw new Error('VITE_ALERT_ENDPOINT 미설정');
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-ALERT-TOKEN': token || '' },
    body: JSON.stringify({ doctorEmail, patientId, unit, risk, note, ts: new Date().toISOString() })
  });
  if (!res.ok) throw new Error(`Alert API failed: ${res.status} ${await res.text().catch(()=> '')}`);
  return res.json().catch(() => ({ ok: true }));
}
