import Layout from '../components/Layout'
const card = { background: '#0f1117', border: '1px solid #1e2130', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }
const STACK = ['Python 3.11', 'TensorFlow 2.15', 'CNN (Keras)', 'FastAPI', 'Pillow', 'Next.js 14', 'Recharts', 'Tailwind CSS', 'Docker']
export default function About() {
  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>About Ladybug</h1>
        <p style={{ color: '#475569', margin: '4px 0 0', fontSize: 13 }}>CNN-based PE malware detection via byte visualization</p>
      </div>
      <div style={{ maxWidth: 740 }}>
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 10 }}>Overview</div>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 10 }}>Ladybug detects malware in Windows PE files (EXE, DLL, SYS) using a <strong style={{ color: '#e2e8f0' }}>Convolutional Neural Network</strong> trained on byte-level visualizations. Each file's raw bytes are reshaped into a grayscale image and fed into the CNN, which learns to distinguish benign and malicious patterns without requiring manual feature engineering.</p>
          <div style={{ background: '#f59e0b15', border: '1px solid #f59e0b33', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#f59e0b' }}>
            For security research and portfolio demonstration only. Do not upload sensitive or production files.
          </div>
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Model Architecture</div>
          {[
            ['Input',       '150×150 grayscale image (PE bytes reshaped)'],
            ['Training data','801 PE files — benign and malicious (80/20 split)'],
            ['Framework',   'TensorFlow / Keras CNN with ImageDataGenerator'],
            ['Output',      'Binary classification: benign / malicious'],
            ['Technique',   'Byte visualization — no manual feature engineering'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2130' }}>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{k}</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 12, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Tech Stack</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STACK.map(t => <span key={t} style={{ background: '#ef444415', color: '#fca5a5', border: '1px solid #ef444430', borderRadius: 6, padding: '4px 12px', fontSize: 12 }}>{t}</span>)}
          </div>
        </div>
      </div>
    </Layout>
  )
}
