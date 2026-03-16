'use client';

import { useState } from 'react';
import Image from 'next/image';

const portals = [
  {
    id: 'marketing',
    title: 'Marketing Website',
    description: 'Public-facing website showcasing the PPO network, provider search, and member benefits.',
    image: '/demo/marketing-site.jpg',
    link: '/',
    tags: ['Provider Search', 'Benefits Overview', 'Contact Forms'],
  },
  {
    id: 'member',
    title: 'Member Portal',
    description: 'Self-service dashboard for members to view claims, ID cards, and manage their healthcare.',
    image: '/demo/member-dashboard.jpg',
    link: '/member',
    tags: ['Claims History', 'Digital ID Card', 'Cost Estimator'],
  },
  {
    id: 'provider',
    title: 'Provider Portal',
    description: 'Streamlined portal for providers to submit claims, check payments, and manage contracts.',
    image: '/demo/provider-dashboard.jpg',
    link: '/provider',
    tags: ['Claims Submission', 'Payment Status', 'Credentialing'],
  },
  {
    id: 'employer',
    title: 'Employer Portal',
    description: 'HR dashboard for employers to manage employee enrollment, billing, and analytics.',
    image: '/demo/employer-dashboard.jpg',
    link: '/employer',
    tags: ['Employee Roster', 'Billing & Invoices', 'Usage Analytics'],
  },
  {
    id: 'admin',
    title: 'Admin Dashboard',
    description: 'Comprehensive administrative console with AI-powered tools for network management.',
    image: '/demo/admin-dashboard.jpg',
    link: '/admin',
    tags: ['Claims Processing', 'AI Engines', 'Network Analytics'],
  },
];

const aiEngines = [
  {
    id: 'fraudshield',
    name: 'FraudShield AI',
    iconPath: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    color: '#ef4444',
    description: 'Real-time fraud detection and prevention system',
    stats: { detected: '2,847', saved: '$1.2M', accuracy: '99.7%' },
    capabilities: [
      'Pattern recognition across claim submissions',
      'Provider billing anomaly detection',
      'Member identity verification',
      'Cross-reference with known fraud databases',
      'Real-time risk scoring on every claim',
    ],
    benefits: 'Protects the network from fraudulent claims, saving millions annually while maintaining trust with legitimate providers and members.',
  },
  {
    id: 'billreview',
    name: 'BillReview AI',
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    color: '#3b82f6',
    description: 'Automated bill analysis and repricing engine',
    stats: { processed: '45,892', savings: '$3.8M', avgTime: '< 2 sec' },
    capabilities: [
      'Automatic CPT/ICD code validation',
      'Medicare rate comparison and repricing',
      'Duplicate charge detection',
      'Bundling/unbundling analysis',
      'Fair price calculation based on geography',
    ],
    benefits: 'Reduces manual review time by 90% while ensuring accurate, fair pricing for every claim processed.',
  },
  {
    id: 'eligibility',
    name: 'Eligibility Engine',
    iconPath: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#22c55e',
    description: 'Real-time member verification and benefits check',
    stats: { checks: '128K/mo', accuracy: '99.9%', responseTime: '< 500ms' },
    capabilities: [
      'Instant member eligibility verification',
      'Real-time benefits and coverage lookup',
      'Coordination of benefits (COB) detection',
      'Dependent eligibility tracking',
      'Historical eligibility auditing',
    ],
    benefits: 'Eliminates claim denials due to eligibility issues and provides instant verification for providers at point of care.',
  },
  {
    id: 'nsa',
    name: 'NSA Compliance',
    iconPath: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z',
    color: '#f59e0b',
    description: 'No Surprises Act monitoring and compliance',
    stats: { monitored: '12,450', compliant: '100%', alerts: '23' },
    capabilities: [
      'Automatic balance billing detection',
      'Out-of-network cost monitoring',
      'Good faith estimate tracking',
      'Dispute resolution workflow',
      'Regulatory reporting automation',
    ],
    benefits: 'Ensures full compliance with federal No Surprises Act requirements, protecting both members and the organization from penalties.',
  },
  {
    id: 'pulse',
    name: 'Pulse AI Assistant',
    iconPath: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    color: '#8b5cf6',
    description: 'Conversational AI support for all users',
    stats: { conversations: '8,234', resolution: '87%', satisfaction: '4.8/5' },
    capabilities: [
      'Natural language claim status inquiries',
      'Benefit explanation and guidance',
      'Provider search assistance',
      'Appointment scheduling support',
      'Escalation to human agents when needed',
    ],
    benefits: 'Provides 24/7 instant support across all portals, reducing call center volume by 60% while improving user satisfaction.',
  },
];

export default function ProductDemoPage() {
  const [selectedEngine, setSelectedEngine] = useState<typeof aiEngines[0] | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
            Product Demo for Solidarity Health Network
          </h1>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 42, fontWeight: 800, color: '#0f172a', marginBottom: 16, lineHeight: 1.2 }}>
            PPO Network Management Platform
          </h2>
          <p style={{ fontSize: 18, color: '#475569', marginBottom: 40 }}>
            Complete healthcare network administration with AI-powered automation
          </p>
          
          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
            {[
              { value: '5', label: 'Portals' },
              { value: '5', label: 'AI Engines' },
              { value: '50+', label: 'Features' },
              { value: '100%', label: 'Interactive' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0d9488' }}>{stat.value}</div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Cards */}
      <section style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 24, textAlign: 'center' }}>
          Platform Portals
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {portals.map((portal) => (
            <a 
              key={portal.id}
              href={portal.link}
              style={{ 
                textDecoration: 'none',
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
              }}
            >
              {/* Screenshot with border */}
              <div style={{ position: 'relative', height: 200, background: '#f1f5f9', borderBottom: '3px solid #0d9488' }}>
                <Image
                  src={portal.image}
                  alt={portal.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              {/* Content - Light Theme */}
              <div style={{ padding: 20 }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {portal.title}
                </h4>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                  {portal.description}
                </p>
                
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {portal.tags.map((tag) => (
                    <span key={tag} style={{ 
                      fontSize: 12, 
                      padding: '4px 10px', 
                      background: '#f1f5f9', 
                      borderRadius: 20,
                      color: '#475569',
                      fontWeight: 500,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Button */}
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#0d9488',
                  fontWeight: 600,
                  fontSize: 14,
                }}>
                  Open Portal →
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* AI Engines */}
      <section style={{ padding: '60px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8, textAlign: 'center' }}>
            Built-in AI Engines
          </h3>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32, textAlign: 'center' }}>
            Click any engine to learn more
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {aiEngines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                style={{
                  background: 'white',
                  border: `2px solid ${engine.color}`,
                  borderRadius: 12,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${engine.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  background: `${engine.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={engine.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={engine.iconPath} />
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{engine.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, lineHeight: 1.4 }}>{engine.description}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#94a3b8' }}>
          © 2026 Solidarity Health Network. All rights reserved.
        </p>
      </footer>

      {/* Modal */}
      {selectedEngine && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setSelectedEngine(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: 20,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: 24, 
              background: `${selectedEngine.color}10`,
              borderRadius: '20px 20px 0 0',
              position: 'relative',
              borderBottom: `3px solid ${selectedEngine.color}`,
            }}>
              <button
                onClick={() => setSelectedEngine(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 16, 
                background: 'white',
                border: `2px solid ${selectedEngine.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={selectedEngine.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={selectedEngine.iconPath} />
                </svg>
              </div>
              <h4 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{selectedEngine.name}</h4>
              <p style={{ fontSize: 14, color: '#64748b' }}>{selectedEngine.description}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
              {Object.entries(selectedEngine.stats).map(([key, value]) => (
                <div key={key} style={{ flex: 1, padding: 16, textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: 24 }}>
              <h5 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Capabilities</h5>
              <ul style={{ margin: 0, paddingLeft: 20, marginBottom: 24 }}>
                {selectedEngine.capabilities.map((cap, i) => (
                  <li key={i} style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>{cap}</li>
                ))}
              </ul>

              <h5 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>Business Impact</h5>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{selectedEngine.benefits}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
