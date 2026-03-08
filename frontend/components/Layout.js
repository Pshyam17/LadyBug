import Link from 'next/link'
import { useRouter } from 'next/router'
const NAV = [{ href: '/scan', label: 'File Scanner' }, { href: '/about', label: 'About' }]
export default function Layout({ children }) {
  const { pathname } = useRouter()
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#080a10' }}>
      <aside style={{ width: 220, background: '#0a0d14', borderRight: '1px solid #1e2130', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #1e2130' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#e2e8f0' }}>🐞 Lady<span style={{ color: '#ef4444' }}>bug</span></div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2, letterSpacing: 1 }}>PE MALWARE DETECTION</div>
        </div>
        <div style={{ padding: '8px 10px', borderBottom: '1px solid #1e2130' }}>
          <div style={{ background: '#ef444415', borderRadius: 7, padding: '7px 12px', fontSize: 11 }}>
            <span style={{ color: '#ef4444', fontWeight: 600 }}>Model:</span>
            <span style={{ color: '#475569', marginLeft: 6 }}>CNN · 150×150 byte images</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '10px' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '9px 12px', borderRadius: 8, marginBottom: 2, background: active ? '#ef444415' : 'transparent', color: active ? '#fca5a5' : '#475569', fontWeight: active ? 600 : 400, fontSize: 13, borderLeft: `2px solid ${active ? '#ef4444' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {label}
                </div>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #1e2130', fontSize: 10, color: '#334155' }}>
          For security research only. Do not upload production files.
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>{children}</main>
    </div>
  )
}
