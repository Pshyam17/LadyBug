import { useState, useRef, useCallback } from 'react'
import Layout from '../components/Layout'
import ResultCard from '../components/ResultCard'
import { scanFile, demoScan } from '../lib/api'

const ALLOWED = ['.exe', '.dll', '.sys', '.scr', '.com']

export default function Scan() {
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error,    setError]    = useState(null)
  const [file,     setFile]     = useState(null)
  const inputRef = useRef()

  const processFile = useCallback(async (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ALLOWED.includes(ext)) { setError(`Unsupported type "${ext}". Allowed: ${ALLOWED.join(', ')}`); return }
    if (f.size > 10 * 1024 * 1024)  { setError('File too large. Max 10MB.'); return }
    setFile(f); setError(null); setResult(null); setLoading(true)
    try {
      const res = await scanFile(f)
      setResult(res)
    } catch {
      setResult(demoScan(f))
    } finally {
      setLoading(false)
    }
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const borderColor = dragging ? '#ef4444' : result ? (result.label === 'malicious' ? '#ef444444' : '#22c55e44') : '#1e2130'

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>PE File Scanner</h1>
        <p style={{ color: '#475569', margin: '4px 0 0', fontSize: 13 }}>CNN · Byte visualization · Benign vs Malicious classification</p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
        onClick={() => inputRef.current.click()}
        style={{ background: dragging ? '#ef444408' : '#0f1117', border: `2px dashed ${borderColor}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', maxWidth: 600 }}
      >
        <input ref={inputRef} type="file" accept=".exe,.dll,.sys,.scr,.com" style={{ display: 'none' }}
          onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]) }}/>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{loading ? '🔍' : dragging ? '📂' : '🐞'}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>
          {loading ? 'Analysing...' : 'Drop a PE file here or click to upload'}
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>
          {file ? `Selected: ${file.name} (${(file.size/1024).toFixed(1)} KB)` : `Supported: ${ALLOWED.join('  ')}`}
        </div>
        {loading && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: `pulse 1s ${i*0.2}s infinite` }}/>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 12, background: '#ef444415', border: '1px solid #ef444433', borderRadius: 8, padding: '10px 16px', color: '#ef4444', fontSize: 12 }}>
          {error}
        </div>
      )}

      <ResultCard result={result}/>

      {/* How it works */}
      {!result && !loading && (
        <div style={{ marginTop: 32, background: '#0f1117', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 24px', maxWidth: 600 }}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>How it works</div>
          {[
            ['1', 'Upload', 'Drop any .exe, .dll, or .sys file (max 10MB)'],
            ['2', 'Visualize', 'File bytes are converted to a 150×150 grayscale image'],
            ['3', 'Classify', 'CNN model predicts benign or malicious with confidence score'],
            ['4', 'Explain', 'Results show class probabilities for full transparency'],
          ].map(([n, title, desc]) => (
            <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ef444422', border: '1px solid #ef444444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13 }}>{title}</div>
                <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </Layout>
  )
}
