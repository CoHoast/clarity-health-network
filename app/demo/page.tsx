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
    icon: '🛡️',
    color: 'from-red-500 to-rose-600',
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
    icon: '📋',
    color: 'from-blue-500 to-indigo-600',
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
    icon: '✅',
    color: 'from-green-500 to-emerald-600',
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
    icon: '⚖️',
    color: 'from-amber-500 to-orange-600',
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
    icon: '💬',
    color: 'from-purple-500 to-violet-600',
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
              {/* Screenshot */}
              <div style={{ position: 'relative', height: 200, background: '#f1f5f9' }}>
                <Image
                  src={portal.image}
                  alt={portal.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              {/* Content */}
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
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{engine.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{engine.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{engine.description}</div>
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
              background: `linear-gradient(135deg, ${selectedEngine.color.includes('red') ? '#ef4444' : selectedEngine.color.includes('blue') ? '#3b82f6' : selectedEngine.color.includes('green') ? '#22c55e' : selectedEngine.color.includes('amber') ? '#f59e0b' : '#8b5cf6'} 0%, ${selectedEngine.color.includes('red') ? '#e11d48' : selectedEngine.color.includes('blue') ? '#4f46e5' : selectedEngine.color.includes('green') ? '#059669' : selectedEngine.color.includes('amber') ? '#ea580c' : '#7c3aed'} 100%)`,
              borderRadius: '20px 20px 0 0',
              position: 'relative',
            }}>
              <button
                onClick={() => setSelectedEngine(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedEngine.icon}</div>
              <h4 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>{selectedEngine.name}</h4>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>{selectedEngine.description}</p>
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
