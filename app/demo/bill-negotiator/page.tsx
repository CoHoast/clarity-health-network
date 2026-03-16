'use client';

import { useState } from 'react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Bill Intake',
    subtitle: 'Automated bill collection from multiple sources',
    description: 'Medical bills flow into the system automatically from your MCO via SFTP, email parsing, or direct portal upload. No manual data entry required.',
    features: [
      { icon: 'folder', label: 'SFTP Integration', desc: 'Secure file transfer from MCO systems' },
      { icon: 'mail', label: 'Email Parsing', desc: 'AI reads and extracts bills from emails' },
      { icon: 'upload', label: 'Portal Upload', desc: 'Manual upload for edge cases' },
      { icon: 'scan', label: 'Fax Receipt', desc: 'Digital fax integration' },
    ],
    visual: 'intake',
  },
  {
    id: 2,
    title: 'AI Data Extraction',
    subtitle: 'Intelligent document processing',
    description: 'Our AI vision model analyzes each bill, extracting key data points with 99%+ accuracy. Complex bills that need review are flagged for human verification.',
    extractedFields: [
      { label: 'Provider Name', value: 'Cleveland Medical Center' },
      { label: 'NPI', value: '1234567890' },
      { label: 'Service Date', value: '02/15/2026' },
      { label: 'CPT Codes', value: '99213, 85025, 80053' },
      { label: 'Billed Amount', value: '$4,250.00' },
      { label: 'Member ID', value: 'SHN-123456' },
    ],
    confidence: 98.5,
    visual: 'extraction',
  },
  {
    id: 3,
    title: 'Fair Price Calculation',
    subtitle: 'Medicare-based pricing analysis',
    description: 'The system calculates a fair price using CMS Medicare rates, adjusted for geography. This becomes the basis for our negotiation offer.',
    priceBreakdown: [
      { label: 'Original Billed', value: '$4,250.00', color: '#ef4444' },
      { label: 'Medicare Rate', value: '$892.00', color: '#64748b' },
      { label: 'Fair Price (140%)', value: '$1,248.80', color: '#0d9488' },
      { label: 'Potential Savings', value: '$3,001.20', color: '#22c55e' },
    ],
    savingsPercent: 71,
    visual: 'calculation',
  },
  {
    id: 4,
    title: 'Negotiation Letter',
    subtitle: 'Automated offer generation and delivery',
    description: 'A professional negotiation letter is automatically generated and sent to the provider via their preferred contact method - email or fax.',
    letterPreview: {
      to: 'Cleveland Medical Center - Billing Department',
      subject: 'Settlement Offer for Account #CLM-2024-8847',
      body: `Dear Billing Department,

We represent the patient for the above-referenced account. After careful review, we are prepared to offer a fair and reasonable settlement.

Original Billed Amount: $4,250.00
Our Settlement Offer: $1,248.80

This offer is based on 140% of Medicare reimbursement rates for the services rendered and represents fair market value.

This offer is valid for 30 days. To accept, please click the link below or contact us directly.`,
      cta: 'Accept Offer →',
    },
    deliveryMethod: 'Email',
    visual: 'letter',
  },
  {
    id: 5,
    title: 'Provider Response',
    subtitle: 'What the provider sees and how they respond',
    description: 'Providers receive a clear, professional communication with easy response options. They can accept the offer, submit a counter-offer, or request a call.',
    responseOptions: [
      { 
        type: 'accept', 
        label: 'Accept Offer', 
        icon: 'check', 
        color: '#22c55e',
        desc: 'Provider agrees to the settlement amount',
      },
      { 
        type: 'counter', 
        label: 'Counter Offer', 
        icon: 'refresh', 
        color: '#f59e0b',
        desc: 'Provider proposes a different amount',
      },
      { 
        type: 'call', 
        label: 'Request Call', 
        icon: 'phone', 
        color: '#3b82f6',
        desc: 'Provider wants to discuss further',
      },
      { 
        type: 'reject', 
        label: 'Decline', 
        icon: 'x', 
        color: '#ef4444',
        desc: 'Provider rejects negotiation (rare)',
      },
    ],
    visual: 'response',
  },
  {
    id: 6,
    title: 'Counter Offer Flow',
    subtitle: 'AI-powered counter-offer evaluation',
    description: 'When a provider submits a counter-offer, the AI evaluates it against fair price thresholds and either auto-accepts (within range) or escalates for review.',
    counterFlow: [
      { step: 'Counter Received', value: '$1,850.00', status: 'received' },
      { step: 'AI Evaluation', value: 'Within 150% threshold', status: 'processing' },
      { step: 'Auto-Approved', value: 'Savings: $2,400', status: 'approved' },
    ],
    thresholds: [
      { range: '≤ 140% Medicare', action: 'Auto-Accept', color: '#22c55e' },
      { range: '140-160% Medicare', action: 'Manager Review', color: '#f59e0b' },
      { range: '> 160% Medicare', action: 'Counter Again', color: '#ef4444' },
    ],
    visual: 'counter',
  },
  {
    id: 7,
    title: 'Settlement Complete',
    subtitle: 'Final agreement and member notification',
    description: 'Once an agreement is reached, the settlement is recorded, the member is notified of their savings, and payment is processed to the provider.',
    settlement: {
      original: '$4,250.00',
      final: '$1,850.00',
      saved: '$2,400.00',
      percent: '56%',
      status: 'Settled',
      paidDate: 'March 18, 2026',
    },
    notifications: [
      { to: 'Member', message: 'Your bill has been settled! You saved $2,400.00' },
      { to: 'Provider', message: 'Payment of $1,850.00 has been processed' },
      { to: 'MCO', message: 'Claim CLM-2024-8847 resolved - settlement recorded' },
    ],
    visual: 'complete',
  },
];

const icons: Record<string, string> = {
  folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  upload: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  scan: 'M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z',
  check: 'M4.5 12.75l6 6 9-13.5',
  refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  x: 'M6 18L18 6M6 6l12 12',
  arrowLeft: 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18',
  arrowRight: 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3',
};

export default function BillNegotiatorWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
      {/* Header */}
      <header style={{ 
        padding: '16px 24px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link 
          href="/demo" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            color: '#94a3b8', 
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons.arrowLeft} />
          </svg>
          Back to Demo
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ fontWeight: 600 }}>AI Bill Negotiator</span>
        </div>
        <div style={{ width: 100 }} />
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? 32 : 10,
                height: 10,
                borderRadius: 5,
                border: 'none',
                background: i === currentStep ? '#0d9488' : i < currentStep ? '#0d9488' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Step Number */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            color: '#0d9488',
            background: 'rgba(13,148,136,0.2)',
            padding: '4px 12px',
            borderRadius: 20,
          }}>
            STEP {step.id} OF {steps.length}
          </span>
        </div>

        {/* Step Title */}
        <h1 style={{ fontSize: 36, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
          {step.title}
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', textAlign: 'center', marginBottom: 40 }}>
          {step.subtitle}
        </p>

        {/* Step Content */}
        <div style={{ 
          background: '#1e293b', 
          borderRadius: 20, 
          padding: 32,
          marginBottom: 40,
        }}>
          <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 32 }}>
            {step.description}
          </p>

          {/* Step 1: Intake Features */}
          {step.features && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {step.features.map((f) => (
                <div key={f.label} style={{ 
                  background: '#0f172a', 
                  borderRadius: 12, 
                  padding: 20,
                  border: '1px solid #334155',
                }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 10, 
                    background: 'rgba(13,148,136,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icons[f.icon]} />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Extracted Fields */}
          {step.extractedFields && (
            <div>
              <div style={{ 
                background: '#0f172a', 
                borderRadius: 12, 
                padding: 24,
                border: '1px solid #334155',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16, fontWeight: 600 }}>EXTRACTED DATA</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {step.extractedFields.map((f) => (
                    <div key={f.label}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(34,197,94,0.1)', padding: 16, borderRadius: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{step.confidence}%</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>High Confidence Extraction</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>All fields verified - ready for processing</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Price Breakdown */}
          {step.priceBreakdown && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                {step.priceBreakdown.map((p) => (
                  <div key={p.label} style={{ 
                    background: '#0f172a', 
                    borderRadius: 12, 
                    padding: 20,
                    border: '1px solid #334155',
                    borderLeft: `4px solid ${p.color}`,
                  }}>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: p.color }}>{p.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(13,148,136,0.2) 100%)', 
                borderRadius: 12, 
                padding: 24,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: '#22c55e' }}>{step.savingsPercent}%</div>
                <div style={{ color: '#94a3b8' }}>Potential Savings Identified</div>
              </div>
            </div>
          )}

          {/* Step 4: Letter Preview */}
          {step.letterPreview && (
            <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: '#f1f5f9', padding: 16, borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b' }}>To: {step.letterPreview.to}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginTop: 4 }}>{step.letterPreview.subject}</div>
              </div>
              <div style={{ padding: 24 }}>
                <pre style={{ 
                  fontFamily: 'inherit', 
                  fontSize: 14, 
                  color: '#475569', 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {step.letterPreview.body}
                </pre>
                <button style={{
                  marginTop: 24,
                  background: '#0d9488',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  {step.letterPreview.cta}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Response Options */}
          {step.responseOptions && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {step.responseOptions.map((opt) => (
                <div key={opt.type} style={{ 
                  background: '#0f172a', 
                  borderRadius: 12, 
                  padding: 20,
                  border: `2px solid ${opt.color}`,
                  cursor: 'pointer',
                }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20, 
                    background: `${opt.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={opt.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icons[opt.icon]} />
                    </svg>
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>{opt.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Step 6: Counter Flow */}
          {step.counterFlow && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                {step.counterFlow.map((cf, i) => (
                  <div key={cf.step} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ 
                      flex: 1,
                      background: '#0f172a', 
                      borderRadius: 12, 
                      padding: 16,
                      border: '1px solid #334155',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{cf.step}</div>
                      <div style={{ fontWeight: 600, color: cf.status === 'approved' ? '#22c55e' : 'white' }}>{cf.value}</div>
                    </div>
                    {i < step.counterFlow.length - 1 && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                        <path d={icons.arrowRight} />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>Automation Thresholds</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {step.thresholds.map((t) => (
                  <div key={t.range} style={{ 
                    flex: 1,
                    background: `${t.color}15`,
                    borderRadius: 8,
                    padding: 12,
                    borderLeft: `3px solid ${t.color}`,
                  }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{t.range}</div>
                    <div style={{ fontWeight: 600, color: t.color }}>{t.action}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Settlement */}
          {step.settlement && (
            <div>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(13,148,136,0.2) 100%)', 
                borderRadius: 16, 
                padding: 32,
                textAlign: 'center',
                marginBottom: 24,
              }}>
                <div style={{ 
                  display: 'inline-block',
                  background: '#22c55e',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                }}>
                  ✓ SETTLEMENT COMPLETE
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Original</div>
                    <div style={{ fontSize: 24, fontWeight: 700, textDecoration: 'line-through', color: '#ef4444' }}>{step.settlement.original}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Final</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e' }}>{step.settlement.final}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Saved</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{step.settlement.saved}</div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#94a3b8' }}>Notifications Sent</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {step.notifications.map((n) => (
                  <div key={n.to} style={{ 
                    background: '#0f172a', 
                    borderRadius: 8, 
                    padding: 16,
                    border: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 16, 
                      background: 'rgba(13,148,136,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0d9488',
                    }}>
                      {n.to[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{n.to}</div>
                      <div style={{ fontSize: 14 }}>{n.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={goPrev}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: currentStep === 0 ? '#1e293b' : '#334155',
              border: 'none',
              borderRadius: 12,
              color: currentStep === 0 ? '#475569' : 'white',
              fontWeight: 600,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={icons.arrowLeft} />
            </svg>
            Previous
          </button>

          <div style={{ color: '#64748b', fontSize: 14 }}>
            {currentStep + 1} / {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={goNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Next
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={icons.arrowRight} />
              </svg>
            </button>
          ) : (
            <Link
              href="/demo"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: '#22c55e',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Complete
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={icons.check} />
              </svg>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
