export default function ResultCard({ result }) {
  if (!result) return null
  const isMal  = result.label === 'malicious'
  const color  = isMal ? '#ef4444' : '#22c55e'
  const bg     = isMal ? '#ef444415' : '#22c55e15'
  const border = isMal ? '#ef444433' : '#22c55e33'
  const pct    = Math.round(result.confidence * 100)
  const dash   = result.confidence * 314

  return (
    <div style={{ background: '#0f1117', border: `1px solid ${border}`, borderRadius: 14, padding: '24px', marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        {/* Gauge */}
        <svg viewBox="0 0 120 120" width="120" height="120" style={{ flexShrink: 0 }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="#1e2130" strokeWidth="10"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} 314`} strokeLinecap="round" transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}/>
          <text x="60" y="53" textAnchor="middle" fill={color} fontSize="20" fontWeight="800">{pct}%</text>
          <text x="60" y="69" textAnchor="middle" fill="#475569" fontSize="9" letterSpacing="0.5">confidence</text>
        </svg>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>VERDICT</div>
          <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 6 }}>
            {isMal ? '⚠ Malicious' : '✓ Benign'}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
            {isMal
              ? 'This file exhibits byte patterns consistent with known malware signatures detected in training data.'
              : 'No malicious byte patterns detected. File appears consistent with legitimate PE binaries.'}
          </div>
          {result.demo && <div style={{ marginTop: 8, fontSize: 11, color: '#f59e0b', background: '#f59e0b15', border: '1px solid #f59e0b33', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>Demo mode — model not loaded</div>}
        </div>
      </div>

      {/* Probability bars */}
      <div style={{ borderTop: '1px solid #1e2130', paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>CLASS PROBABILITIES</div>
        {[
          { label: 'Benign',    val: result.probabilities.benign,    color: '#22c55e' },
          { label: 'Malicious', val: result.probabilities.malicious, color: '#ef4444' },
        ].map(({ label, val, color: c }) => (
          <div key={label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{(val * 100).toFixed(1)}%</span>
            </div>
            <div style={{ background: '#1e2130', borderRadius: 4, height: 7, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: c, width: `${val * 100}%`, transition: 'width 0.8s ease' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* File info */}
      <div style={{ borderTop: '1px solid #1e2130', paddingTop: 14, marginTop: 4, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          ['Filename', result.filename],
          ['Size',     `${(result.size_bytes / 1024).toFixed(1)} KB`],
          ['Analyzed', new Date().toLocaleTimeString()],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, letterSpacing: 0.5 }}>{k.toUpperCase()}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
