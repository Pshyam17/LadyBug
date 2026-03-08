import axios from 'axios'
const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000' })

export const scanFile = async (file) => {
  const form = new FormData()
  form.append('file', file)
  return client.post('/scan', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
}

export const checkHealth = () => client.get('/health').then(r => r.data)

// Demo prediction when API is offline
export function demoScan(file) {
  let hash = 0
  for (let i = 0; i < file.name.length; i++) hash = ((hash << 5) - hash) + file.name.charCodeAt(i)
  const score = Math.min(0.97, Math.abs((hash % 1000) / 1000) * 0.85 + (file.size > 500000 ? 0.1 : 0))
  const label = score > 0.5 ? 'malicious' : 'benign'
  return {
    filename: file.name,
    size_bytes: file.size,
    label,
    confidence: +score.toFixed(4),
    probabilities: { benign: +(1 - score).toFixed(4), malicious: +score.toFixed(4) },
    demo: true,
  }
}
