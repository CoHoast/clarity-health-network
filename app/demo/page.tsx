'use client';

import { useState } from 'react';
import Image from 'next/image';

const portalDetails: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  features: { category: string; items: string[] }[];
  aiFeatures?: { name: string; desc: string }[];
  useCases: string[];
}> = {
  marketing: {
    title: 'Marketing Website',
    subtitle: 'Your Network\'s Digital Front Door',
    description: 'A premium, conversion-optimized website that showcases your PPO network to prospective members, employers, and providers. Built for SEO and designed to generate leads.',
    features: [
      {
        category: 'For Prospective Members',
        items: [
          'Interactive provider search with filters by specialty, location, and availability',
          'Benefits overview with clear plan comparisons',
          'Cost estimator tool for common procedures',
          'Member testimonials and success stories',
          'Easy online enrollment or contact forms',
        ],
      },
      {
        category: 'For Employers',
        items: [
          'Dedicated employer landing page',
          'Plan options and pricing information',
          'ROI calculator for switching networks',
          'Request a quote functionality',
          'Employer resources and FAQ',
        ],
      },
      {
        category: 'For Providers',
        items: [
          'Provider join network information',
          'Credentialing requirements overview',
          'Online application submission',
          'Provider resources and support',
          'Contact forms for provider relations',
        ],
      },
    ],
    useCases: [
      'Lead generation for new member enrollment',
      'Employer group acquisition',
      'Provider network expansion',
      'Brand awareness and trust building',
      'Self-service information for all stakeholders',
    ],
  },
  member: {
    title: 'Member Portal',
    subtitle: 'Self-Service Healthcare Management',
    description: 'A modern, mobile-friendly portal where members can manage every aspect of their healthcare coverage. From viewing claims to finding providers, everything is at their fingertips.',
    features: [
      {
        category: 'Claims & Coverage',
        items: [
          'Real-time claims status tracking',
          'Detailed EOB (Explanation of Benefits) viewer',
          'Claims history with search and filters',
          'Download claims for tax purposes',
          'Appeal submission for denied claims',
        ],
      },
      {
        category: 'Digital ID Card',
        items: [
          'Mobile-friendly digital ID card',
          'Add to Apple Wallet / Google Pay',
          'Share via email or text',
          'Print physical card option',
          'Family member cards included',
        ],
      },
      {
        category: 'Tools & Resources',
        items: [
          'Cost Estimator for procedures',
          'Find a Provider search',
          'Benefits summary and coverage details',
          'Prescription lookup and coverage',
          'Health resources and wellness content',
        ],
      },
    ],
    aiFeatures: [
      { name: 'Pulse AI Assistant', desc: 'Natural language chat for benefits questions, claim status, and provider search' },
      { name: 'Smart Notifications', desc: 'AI-powered alerts for claims updates, preventive care reminders, and savings opportunities' },
      { name: 'Personalized Recommendations', desc: 'Suggested providers and cost-saving tips based on member history' },
    ],
    useCases: [
      'Check claim status without calling support',
      'Find in-network providers near them',
      'Estimate costs before a procedure',
      'Access ID card at the doctor\'s office',
      'Understand coverage and benefits',
    ],
  },
  provider: {
    title: 'Provider Portal',
    subtitle: 'Streamlined Practice Management',
    description: 'Everything providers need to work with your network efficiently. From eligibility checks to payment tracking, we reduce administrative burden and accelerate reimbursements.',
    features: [
      {
        category: 'Claims Management',
        items: [
          'Electronic claims submission (837P/837I)',
          'Real-time claim status tracking',
          'Batch claim upload capability',
          'Claim correction and resubmission',
          'Denial management and appeals',
        ],
      },
      {
        category: 'Payments & Revenue',
        items: [
          'Payment history and remittance advice',
          'ERA (Electronic Remittance) downloads',
          'Payment reconciliation tools',
          'Direct deposit enrollment',
          'Fee schedule access',
        ],
      },
      {
        category: 'Eligibility & Verification',
        items: [
          'Real-time member eligibility checks',
          'Benefits verification for services',
          'Prior authorization requests',
          'Referral management',
          'Coverage history lookup',
        ],
      },
      {
        category: 'Practice Administration',
        items: [
          'Credentialing status and updates',
          'Contract information and terms',
          'Practice profile management',
          'Multiple location support',
          'Staff user management',
        ],
      },
    ],
    aiFeatures: [
      { name: 'Pulse AI Assistant', desc: 'Instant answers to claims, payments, and policy questions' },
      { name: 'Smart Claim Validation', desc: 'AI checks claims for errors before submission to reduce denials' },
      { name: 'Payment Prediction', desc: 'Estimated reimbursement amounts based on historical data' },
    ],
    useCases: [
      'Verify patient coverage before appointments',
      'Submit claims and track to payment',
      'Download ERAs for reconciliation',
      'Check credentialing status',
      'Access fee schedules for pricing',
    ],
  },
  employer: {
    title: 'Employer Portal',
    subtitle: 'HR Benefits Administration Made Easy',
    description: 'A comprehensive dashboard for HR teams to manage employee benefits enrollment, track utilization, handle billing, and access analytics—all in one place.',
    features: [
      {
        category: 'Employee Management',
        items: [
          'Employee roster management',
          'Add/remove/modify employee coverage',
          'Dependent management',
          'COBRA administration',
          'Open enrollment management',
        ],
      },
      {
        category: 'Billing & Payments',
        items: [
          'Monthly invoice viewing and payment',
          'Premium billing breakdown by employee',
          'Payment history and receipts',
          'Multiple payment methods',
          'Auto-pay enrollment',
        ],
      },
      {
        category: 'Analytics & Reporting',
        items: [
          'Utilization reports and trends',
          'Cost analysis by department',
          'Claims summary reports',
          'Wellness program participation',
          'Custom report generation',
        ],
      },
      {
        category: 'Administration',
        items: [
          'Plan documents and SPDs',
          'Compliance resources',
          'Multi-admin user support',
          'Audit logs for all changes',
          'Integration with HRIS systems',
        ],
      },
    ],
    aiFeatures: [
      { name: 'Pulse AI Assistant', desc: 'Quick answers to billing questions, enrollment help, and policy clarification' },
      { name: 'Smart Analytics', desc: 'AI-generated insights on utilization patterns and cost-saving opportunities' },
      { name: 'Enrollment Reminders', desc: 'Automated notifications for open enrollment, missing documents, and renewals' },
    ],
    useCases: [
      'Onboard new employees to benefits',
      'Process life event changes',
      'Pay monthly premiums',
      'Generate utilization reports for leadership',
      'Manage open enrollment period',
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Complete Network Command Center',
    description: 'The nerve center for your PPO network operations. Manage claims, providers, members, and leverage AI-powered tools to automate complex workflows and reduce operational costs.',
    features: [
      {
        category: 'Claims Operations',
        items: [
          'Claims intake and processing pipeline',
          'Auto-adjudication with configurable rules',
          'Manual review queue with AI recommendations',
          'Batch processing for high-volume days',
          'Claims analytics and reporting',
        ],
      },
      {
        category: 'Network Management',
        items: [
          'Provider database and credentialing',
          'Contract management and fee schedules',
          'Member enrollment and eligibility',
          'Employer group administration',
          'Network adequacy monitoring',
        ],
      },
      {
        category: 'Financial Operations',
        items: [
          'Payment processing and reconciliation',
          'Revenue cycle management',
          'Financial reporting and dashboards',
          'Budget tracking and forecasting',
          'Audit trail and compliance',
        ],
      },
      {
        category: 'Configuration',
        items: [
          'Self-service repricing rules',
          'Automation settings and thresholds',
          'User management and permissions',
          'System integrations (FTP, API)',
          'Notification preferences',
        ],
      },
    ],
    aiFeatures: [
      { name: 'FraudShield AI', desc: 'Real-time fraud detection analyzing billing patterns and flagging suspicious claims' },
      { name: 'BillReview AI', desc: 'Automated bill analysis, CPT validation, and Medicare-based repricing' },
      { name: 'Eligibility Engine', desc: 'Instant member verification with COB detection and benefits lookup' },
      { name: 'NSA Compliance', desc: 'No Surprises Act monitoring, balance billing detection, and regulatory alerts' },
      { name: 'Pulse AI Assistant', desc: 'Admin-level AI assistant for complex queries and workflow automation' },
    ],
    useCases: [
      'Process daily claims volume efficiently',
      'Onboard new providers to the network',
      'Manage employer group renewals',
      'Investigate and resolve fraud alerts',
      'Generate executive reports',
    ],
  },
};

const billNegotiatorInfo = {
  title: 'AI Bill Negotiator',
  subtitle: 'Automated Medical Bill Negotiation',
  description: 'Our AI-powered bill negotiation system automatically analyzes medical bills, calculates fair prices using Medicare rates, and negotiates with providers to achieve significant savings for your members.',
  stats: [
    { label: 'Avg. Savings', value: '52%' },
    { label: 'Success Rate', value: '89%' },
    { label: 'Turnaround', value: '7 days' },
  ],
  features: [
    'Automatic bill intake via fax, email, or portal upload',
    'AI-powered data extraction and validation',
    'Fair price calculation using CMS Medicare rates',
    'Automated offer letter generation and delivery',
    'Counter-offer handling and escalation workflows',
    'Real-time tracking and status updates',
    'Detailed savings reports and analytics',
    'HIPAA-compliant document handling',
  ],
  benefits: [
    { title: 'Reduce Member Costs', desc: 'Members save an average of 52% on out-of-network medical bills' },
    { title: 'Automate Negotiations', desc: 'AI handles 90% of negotiations without human intervention' },
    { title: 'Scale Operations', desc: 'Process thousands of bills monthly with minimal staff' },
    { title: 'Improve Satisfaction', desc: 'Members appreciate transparent, fair pricing advocacy' },
  ],
};

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
  const [showBillNegotiator, setShowBillNegotiator] = useState(false);
  const [selectedPortalInfo, setSelectedPortalInfo] = useState<string | null>(null);
  const [billNegotiatorStep, setBillNegotiatorStep] = useState(0);

  const billNegotiatorSteps = [
    {
      title: 'Bill Intake from MCO',
      description: 'Medical bills are automatically pulled from your MCO via secure SFTP connection and ingested into the system. No manual uploads required.',
      image: '/demo/bn-step-1.jpg',
    },
    {
      title: 'Bill Created in Dashboard',
      description: 'Each bill is created as a record in the dashboard with all relevant details - provider info, charges, member data, and service dates.',
      image: '/demo/bn-step-2.jpg',
    },
    {
      title: 'AI Analyzes & Calculates Fair Price',
      description: 'Our AI extracts data from the bill, validates CPT codes, and compares charges against Medicare rates and regional hospital pricing to calculate a fair offer.',
      image: '/demo/bn-step-3.jpg',
    },
    {
      title: 'Offer Sent to Provider',
      description: 'A professional negotiation letter with the fair price offer is automatically sent to the provider via their preferred method - email or fax.',
      image: '/demo/bn-step-4.jpg',
    },
    {
      title: 'Provider Responds',
      description: 'The provider receives the offer and can accept it, submit a counter-offer, or request a call. Their response is captured digitally.',
      image: '/demo/bn-step-5.jpg',
    },
    {
      title: 'Response Received in Dashboard',
      description: 'The provider\'s response flows back into the dashboard. Counter-offers are evaluated against thresholds for auto-acceptance or further negotiation.',
      image: '/demo/bn-step-6.jpg',
    },
    {
      title: 'Settlement or Escalation',
      description: 'The negotiation continues automatically until the bill is settled at a fair price, or escalated to a human rep for complex cases.',
      image: '/demo/bn-step-7.jpg',
    },
  ];

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
              { value: '6', label: 'Portals' },
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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {portals.map((portal) => (
            <div 
              key={portal.id}
              style={{ 
                background: 'white',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Screenshot with border */}
              <div style={{ position: 'relative', height: 180, background: '#f1f5f9', borderBottom: '3px solid #0d9488' }}>
                <Image
                  src={portal.image}
                  alt={portal.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              
              {/* Content - Light Theme */}
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                  {portal.title}
                </h4>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16, lineHeight: 1.5, flex: 1 }}>
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
                
                {/* Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => setSelectedPortalInfo(portal.id)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: '#0f172a',
                      border: 'none',
                      borderRadius: 8,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    More Info
                  </button>
                  <a
                    href={portal.link}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                      border: 'none',
                      borderRadius: 8,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    Open Portal
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          {/* Bill Negotiator Teaser Card */}
          <div
            onClick={() => { setShowBillNegotiator(true); setBillNegotiatorStep(0); }}
            style={{ 
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'block',
              border: '2px solid #0d9488',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(13,148,136,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}
          >
            {/* Screenshot */}
            <div style={{ position: 'relative', height: 180, background: '#0f172a', borderBottom: '3px solid #2dd4bf' }}>
              <Image
                src="/demo/bill-negotiator.jpg"
                alt="AI Bill Negotiator Dashboard"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(13,148,136,0.9)',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                color: 'white',
              }}>
                COMING SOON
              </div>
            </div>
            
            {/* Content */}
            <div style={{ padding: 20 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
                AI Bill Negotiator
              </h4>
              <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16, lineHeight: 1.5 }}>
                Automated medical bill negotiation powered by AI. Reduce member costs by 50%+ on out-of-network bills.
              </p>
              
              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {['Auto-Negotiation', 'Medicare Rates', '52% Avg Savings'].map((tag) => (
                  <span key={tag} style={{ 
                    fontSize: 12, 
                    padding: '4px 10px', 
                    background: 'rgba(13,148,136,0.2)', 
                    borderRadius: 20,
                    color: '#2dd4bf',
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
                color: '#2dd4bf',
                fontWeight: 600,
                fontSize: 14,
              }}>
                View Walkthrough →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Engines */}
      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 8, textAlign: 'center' }}>
            Built-in AI Engines
          </h3>
          <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 32, textAlign: 'center' }}>
            Click any engine to learn more
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {aiEngines.map((engine) => (
              <button
                key={engine.id}
                onClick={() => setSelectedEngine(engine)}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: 12,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#0d9488';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 12, 
                  background: 'rgba(13,148,136,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={engine.iconPath} />
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{engine.name}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.4 }}>{engine.description}</div>
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
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px 20px 0 0',
              position: 'relative',
              borderBottom: '3px solid #0d9488',
            }}>
              <button
                onClick={() => setSelectedEngine(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#334155',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 16, 
                background: 'rgba(13,148,136,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={selectedEngine.iconPath} />
                </svg>
              </div>
              <h4 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{selectedEngine.name}</h4>
              <p style={{ fontSize: 14, color: '#94a3b8' }}>{selectedEngine.description}</p>
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

      {/* Bill Negotiator Walkthrough Modal */}
      {showBillNegotiator && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setShowBillNegotiator(false)}
        >
          <div 
            style={{
              background: '#0f172a',
              borderRadius: 20,
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              padding: '16px 24px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 8, 
                  background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span style={{ color: 'white', fontWeight: 600, fontSize: 16 }}>AI Bill Negotiator Walkthrough</span>
                <span style={{ 
                  background: 'rgba(13,148,136,0.3)', 
                  color: '#2dd4bf',
                  padding: '4px 10px', 
                  borderRadius: 12, 
                  fontSize: 11, 
                  fontWeight: 600,
                }}>
                  COMING SOON
                </span>
              </div>
              <button
                onClick={() => setShowBillNegotiator(false)}
                style={{
                  background: '#1e293b',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            </div>

            {/* Step Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px 24px', background: '#1e293b' }}>
              {billNegotiatorSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBillNegotiatorStep(i)}
                  style={{
                    width: billNegotiatorStep === i ? 32 : 10,
                    height: 10,
                    borderRadius: 5,
                    border: 'none',
                    background: billNegotiatorStep === i ? '#0d9488' : billNegotiatorStep > i ? '#0d9488' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
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
                  STEP {billNegotiatorStep + 1} OF {billNegotiatorSteps.length}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: 28, fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: 12 }}>
                {billNegotiatorSteps[billNegotiatorStep].title}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
                {billNegotiatorSteps[billNegotiatorStep].description}
              </p>

              {/* Screenshot Placeholder */}
              <div style={{ 
                background: '#1e293b', 
                borderRadius: 12, 
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #334155',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Image
                  src={billNegotiatorSteps[billNegotiatorStep].image}
                  alt={billNegotiatorSteps[billNegotiatorStep].title}
                  fill
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div style={{ 
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: 14,
                  zIndex: -1,
                }}>
                  Screenshot placeholder
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ 
              padding: '16px 24px',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <button
                onClick={() => setBillNegotiatorStep(Math.max(0, billNegotiatorStep - 1))}
                disabled={billNegotiatorStep === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  background: billNegotiatorStep === 0 ? '#1e293b' : '#334155',
                  border: 'none',
                  borderRadius: 8,
                  color: billNegotiatorStep === 0 ? '#475569' : 'white',
                  fontWeight: 600,
                  cursor: billNegotiatorStep === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>

              <span style={{ color: '#64748b', fontSize: 14 }}>
                {billNegotiatorStep + 1} / {billNegotiatorSteps.length}
              </span>

              {billNegotiatorStep < billNegotiatorSteps.length - 1 ? (
                <button
                  onClick={() => setBillNegotiatorStep(billNegotiatorStep + 1)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setShowBillNegotiator(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Done ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Portal Info Modal */}
      {selectedPortalInfo && portalDetails[selectedPortalInfo] && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setSelectedPortalInfo(null)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: 20,
              maxWidth: 800,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: 24, 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px 20px 0 0',
              position: 'relative',
              borderBottom: '3px solid #0d9488',
            }}>
              <button
                onClick={() => setSelectedPortalInfo(null)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: '#334155',
                  border: 'none',
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: 18,
                }}
              >
                ✕
              </button>
              <h4 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                {portalDetails[selectedPortalInfo].title}
              </h4>
              <p style={{ fontSize: 16, color: '#2dd4bf', fontWeight: 500 }}>
                {portalDetails[selectedPortalInfo].subtitle}
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: 24 }}>
              {/* Description */}
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
                {portalDetails[selectedPortalInfo].description}
              </p>

              {/* Features by Category */}
              <h5 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Key Features</h5>
              <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
                {portalDetails[selectedPortalInfo].features.map((category, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
                    <h6 style={{ fontSize: 14, fontWeight: 600, color: '#0d9488', marginBottom: 12 }}>
                      {category.category}
                    </h6>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {category.items.map((item, j) => (
                        <li key={j} style={{ fontSize: 14, color: '#475569', marginBottom: 6 }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* AI Features (if available) */}
              {portalDetails[selectedPortalInfo].aiFeatures && (
                <>
                  <h5 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
                    🤖 AI-Powered Features
                  </h5>
                  <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                    {portalDetails[selectedPortalInfo].aiFeatures!.map((ai, i) => (
                      <div key={i} style={{ 
                        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', 
                        borderRadius: 12, 
                        padding: 16,
                        borderLeft: '4px solid #0d9488',
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{ai.name}</div>
                        <div style={{ fontSize: 13, color: '#475569' }}>{ai.desc}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Use Cases */}
              <h5 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Common Use Cases</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {portalDetails[selectedPortalInfo].useCases.map((useCase, i) => (
                  <span key={i} style={{ 
                    fontSize: 13, 
                    padding: '8px 16px', 
                    background: '#0f172a', 
                    borderRadius: 20,
                    color: 'white',
                    fontWeight: 500,
                  }}>
                    {useCase}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setSelectedPortalInfo(null)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 10,
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <a
                  href={portals.find(p => p.id === selectedPortalInfo)?.link || '#'}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Open Portal →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
