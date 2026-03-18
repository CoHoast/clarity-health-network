-- =====================================================
-- CREDENTIALING MODULE - DATABASE SCHEMA
-- TrueCare PPO Network Platform
-- =====================================================

-- Applications
CREATE TABLE credentialing_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID REFERENCES practices(id),
    provider_id UUID REFERENCES providers(id),
    
    application_type VARCHAR(20) NOT NULL, -- 'initial', 'recredential', 'add_location'
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    -- draft, submitted, verification, review, approved, denied, withdrawn
    
    -- Application data (JSON for flexibility)
    application_data JSONB NOT NULL DEFAULT '{}',
    
    -- Tracking
    submitted_at TIMESTAMPTZ,
    submitted_by_name VARCHAR(200),
    submitted_by_email VARCHAR(200),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Dates
    target_effective_date DATE,
    credential_expires_at DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verifications
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    provider_id UUID REFERENCES providers(id),
    
    verification_type VARCHAR(30) NOT NULL,
    -- nppes, oig, sam, state_license, dea, board_cert, malpractice, npdb
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, in_progress, passed, failed, needs_review, manual_required
    
    source_name VARCHAR(100),
    source_url VARCHAR(500),
    
    verified_at TIMESTAMPTZ,
    expires_at DATE,
    
    match_score INTEGER, -- 0-100
    flags JSONB DEFAULT '[]',
    raw_response JSONB,
    notes TEXT,
    
    -- Manual verification
    verified_by UUID REFERENCES users(id),
    manual_override BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Committee Decisions
CREATE TABLE committee_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    
    decision VARCHAR(30) NOT NULL,
    -- approved, approved_conditions, denied, deferred, request_info, refer_md
    
    conditions TEXT,
    denial_reason TEXT,
    notes TEXT,
    
    decided_by UUID REFERENCES users(id),
    decided_at TIMESTAMPTZ DEFAULT NOW(),
    
    meeting_date DATE,
    vote_count INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sanction Monitoring
CREATE TABLE sanction_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    
    check_type VARCHAR(30) NOT NULL,
    -- oig, sam, state_license, dea, medicare_optout, death_master
    
    check_date DATE NOT NULL,
    result VARCHAR(20) NOT NULL, -- clear, found, error
    
    alert_generated BOOLEAN DEFAULT FALSE,
    alert_id UUID REFERENCES compliance_alerts(id),
    
    details JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Alerts
CREATE TABLE compliance_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id),
    practice_id UUID REFERENCES practices(id),
    
    alert_type VARCHAR(50) NOT NULL,
    -- oig_exclusion, sam_exclusion, license_revoked, license_suspended,
    -- license_expiring, dea_revoked, npi_deactivated, etc.
    
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, acknowledged, resolved, dismissed
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    details JSONB,
    
    -- Response tracking
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Auto-actions taken
    auto_suspended BOOLEAN DEFAULT FALSE,
    auto_terminated BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credentialing Documents
CREATE TABLE credentialing_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES credentialing_applications(id),
    provider_id UUID REFERENCES providers(id),
    
    document_type VARCHAR(30) NOT NULL,
    -- license, dea, board_cert, malpractice_coi, cv, w9, attestation, other
    
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64),
    
    -- Metadata
    issuing_state VARCHAR(2),
    document_number VARCHAR(100),
    issue_date DATE,
    expiration_date DATE,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    
    -- Source tracking
    uploaded_by UUID REFERENCES users(id),
    upload_source VARCHAR(20) DEFAULT 'admin', -- admin, secure_link
    
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Requests (Secure Upload Links)
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) NOT NULL,
    practice_id UUID REFERENCES practices(id),
    
    -- Token for secure link
    token VARCHAR(64) UNIQUE NOT NULL,
    
    -- What's being requested
    requested_documents JSONB NOT NULL, -- Array of document types
    
    -- Recipient
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(200),
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending, partial, complete, expired, cancelled
    
    uploaded_documents JSONB DEFAULT '[]',
    
    -- Timing
    expires_at TIMESTAMPTZ NOT NULL,
    reminder_sent_at TIMESTAMPTZ,
    
    -- Custom message
    custom_message TEXT,
    
    -- Tracking
    sent_by UUID REFERENCES users(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE credentialing_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    application_id UUID,
    provider_id UUID,
    practice_id UUID,
    
    action VARCHAR(100) NOT NULL,
    
    performed_by UUID,
    performed_by_type VARCHAR(20), -- user, system, provider
    
    old_values JSONB,
    new_values JSONB,
    details JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Re-credentialing Schedule
CREATE TABLE recredentialing_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES providers(id) NOT NULL,
    practice_id UUID REFERENCES practices(id),
    
    credential_type VARCHAR(30) NOT NULL, -- initial, recredential
    
    -- Current credential
    current_effective_date DATE,
    current_expiration_date DATE NOT NULL,
    
    -- Re-cred tracking
    recred_due_date DATE NOT NULL,
    reminder_90_sent BOOLEAN DEFAULT FALSE,
    reminder_60_sent BOOLEAN DEFAULT FALSE,
    reminder_30_sent BOOLEAN DEFAULT FALSE,
    reminder_14_sent BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, pending_recred, overdue, completed
    
    -- Link to new application
    recred_application_id UUID REFERENCES credentialing_applications(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_applications_status ON credentialing_applications(status);
CREATE INDEX idx_applications_practice ON credentialing_applications(practice_id);
CREATE INDEX idx_applications_provider ON credentialing_applications(provider_id);
CREATE INDEX idx_applications_type ON credentialing_applications(application_type);

CREATE INDEX idx_verifications_application ON verifications(application_id);
CREATE INDEX idx_verifications_provider ON verifications(provider_id);
CREATE INDEX idx_verifications_type ON verifications(verification_type);
CREATE INDEX idx_verifications_status ON verifications(status);

CREATE INDEX idx_decisions_application ON committee_decisions(application_id);
CREATE INDEX idx_decisions_decision ON committee_decisions(decision);

CREATE INDEX idx_sanction_checks_provider ON sanction_checks(provider_id);
CREATE INDEX idx_sanction_checks_date ON sanction_checks(check_date);
CREATE INDEX idx_sanction_checks_type ON sanction_checks(check_type);

CREATE INDEX idx_alerts_status ON compliance_alerts(status);
CREATE INDEX idx_alerts_severity ON compliance_alerts(severity);
CREATE INDEX idx_alerts_provider ON compliance_alerts(provider_id);

CREATE INDEX idx_documents_provider ON credentialing_documents(provider_id);
CREATE INDEX idx_documents_application ON credentialing_documents(application_id);
CREATE INDEX idx_documents_type ON credentialing_documents(document_type);
CREATE INDEX idx_documents_expiration ON credentialing_documents(expiration_date);

CREATE INDEX idx_doc_requests_token ON document_requests(token);
CREATE INDEX idx_doc_requests_provider ON document_requests(provider_id);
CREATE INDEX idx_doc_requests_status ON document_requests(status);

CREATE INDEX idx_audit_application ON credentialing_audit_log(application_id);
CREATE INDEX idx_audit_provider ON credentialing_audit_log(provider_id);
CREATE INDEX idx_audit_action ON credentialing_audit_log(action);

CREATE INDEX idx_recred_provider ON recredentialing_schedule(provider_id);
CREATE INDEX idx_recred_due_date ON recredentialing_schedule(recred_due_date);
CREATE INDEX idx_recred_status ON recredentialing_schedule(status);
