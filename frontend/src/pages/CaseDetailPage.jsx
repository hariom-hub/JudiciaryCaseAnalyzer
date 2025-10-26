import React, { useState, useEffect } from 'react';
import './CaseDetailPage.css';

const CaseDetailPage = ({ caseId, onNavigate }) => {
  const [caseData, setCaseData] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Sample case data based on caseId
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data - in real app, fetch based on caseId
      const mockCase = {
        id: caseId,
        title: "Smith vs. State Corporation",
        caseNumber: "CV-2023-001",
        caseType: "Civil",
        status: "Active",
        priority: "High",
        dateOfFiling: "2023-09-15",
        lastUpdated: "2023-09-23",
        createdAt: "2023-09-15",
        parties: {
          plaintiff: "John Smith",
          defendant: "State Corporation",
          plaintiffLawyer: "Anderson & Associates",
          defendantLawyer: "Corporate Legal Services"
        },
        court: "Supreme Court",
        judge: "Justice Maria Rodriguez",
        tags: ["Contract Dispute", "Commercial", "Breach of Contract"],
        caseText: `CASE SUMMARY:

This civil case involves a contract dispute between John Smith (Plaintiff) and State Corporation (Defendant). The plaintiff alleges that the defendant breached a service agreement dated March 15, 2023, which resulted in significant financial losses.

KEY FACTS:
1. Service Agreement signed on March 15, 2023
2. Plaintiff provided consulting services for 6 months
3. Defendant failed to make final payment of $50,000
4. Multiple attempts at resolution failed
5. Plaintiff seeks damages plus legal costs

LEGAL ISSUES:
- Breach of contract
- Damages calculation
- Mitigation of losses
- Interest and costs

CURRENT STATUS:
The case is currently in the discovery phase. Both parties have submitted their initial pleadings, and depositions are scheduled for next month. The court has set a trial date for December 2023.

EVIDENCE:
- Original service agreement
- Email correspondence
- Payment records
- Invoice documentation
- Expert witness testimony on damages

The plaintiff seeks $75,000 in damages plus legal costs and interest.`,
        documents: [
          { name: "Service Agreement.pdf", type: "Contract", uploadDate: "2023-09-15", size: "2.4 MB" },
          { name: "Email Correspondence.docx", type: "Evidence", uploadDate: "2023-09-16", size: "1.1 MB" },
          { name: "Financial Records.xlsx", type: "Evidence", uploadDate: "2023-09-17", size: "856 KB" }
        ],
        timeline: [
          { date: "2023-03-15", event: "Service agreement signed", type: "contract" },
          { date: "2023-08-15", event: "Final payment due date", type: "deadline" },
          { date: "2023-08-30", event: "Demand letter sent", type: "communication" },
          { date: "2023-09-15", event: "Case filed", type: "filing" },
          { date: "2023-09-20", event: "Defendant's response filed", type: "response" },
          { date: "2023-10-01", event: "Discovery phase begins", type: "process" },
          { date: "2023-12-15", event: "Trial scheduled", type: "hearing" }
        ]
      };

      const mockAnalyses = [
        {
          id: 1,
          type: "Case Summary",
          aiProvider: "OpenAI",
          model: "GPT-4",
          status: "Completed",
          createdAt: "2023-09-23 10:30 AM",
          result: "This is a straightforward breach of contract case with strong evidence supporting the plaintiff's claims. The defendant's failure to make the final payment constitutes a clear breach of the service agreement...",
          tokensUsed: 2450,
          processingTime: 3200
        },
        {
          id: 2,
          type: "Legal Issues",
          aiProvider: "Groq",
          model: "Llama 3 70B",
          status: "Completed",
          createdAt: "2023-09-23 11:15 AM",
          result: "Key legal issues identified:\n1. Material breach of contract\n2. Calculation of direct damages\n3. Consequential damages eligibility\n4. Mitigation obligations...",
          tokensUsed: 1890,
          processingTime: 1800
        },
        {
          id: 3,
          type: "Outcome Prediction",
          aiProvider: "Gemini",
          model: "Gemini Pro",
          status: "Completed",
          createdAt: "2023-09-23 02:45 PM",
          result: "Based on similar cases and the strength of evidence, there is a 78% likelihood of a favorable outcome for the plaintiff. Estimated settlement range: $60,000-$70,000...",
          tokensUsed: 3100,
          processingTime: 2900
        }
      ];

      setCaseData(mockCase);
      setAnalyses(mockAnalyses);
      setEditForm(mockCase);
      setIsLoading(false);
    }, 1000);
  }, [caseId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setCaseData({...caseData, ...editForm});
    setIsEditing(false);
    // In real app, make API call to update case
    alert('Case updated successfully!');
  };

  const handleCancel = () => {
    setEditForm(caseData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const TabNavigation = () => (
    <div className="tab-navigation">
      <button 
        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveTab('overview')}
      >
        📄 Overview
      </button>
      <button 
        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
        onClick={() => setActiveTab('details')}
      >
        📋 Details
      </button>
      <button 
        className={`tab-btn ${activeTab === 'analyses' ? 'active' : ''}`}
        onClick={() => setActiveTab('analyses')}
      >
        🤖 AI Analyses ({analyses.length})
      </button>
      <button 
        className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
        onClick={() => setActiveTab('documents')}
      >
        📎 Documents ({caseData?.documents?.length || 0})
      </button>
      <button 
        className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
        onClick={() => setActiveTab('timeline')}
      >
        🕒 Timeline
      </button>
    </div>
  );

  const OverviewTab = () => (
    <div className="overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <h3>Case Information</h3>
          <div className="info-grid">
            <div className="info-row">
              <span className="label">Case Number:</span>
              <span className="value">{caseData.caseNumber}</span>
            </div>
            <div className="info-row">
              <span className="label">Type:</span>
              <span className="value">{caseData.caseType}</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`value status-${caseData.status.toLowerCase()}`}>
                {caseData.status}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Priority:</span>
              <span className={`value priority-${caseData.priority.toLowerCase()}`}>
                {caseData.priority}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Court:</span>
              <span className="value">{caseData.court}</span>
            </div>
            <div className="info-row">
              <span className="label">Judge:</span>
              <span className="value">{caseData.judge}</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Parties</h3>
          <div className="parties-info">
            <div className="party-section">
              <h4>Plaintiff</h4>
              <p className="party-name">{caseData.parties.plaintiff}</p>
              <p className="party-lawyer">Represented by: {caseData.parties.plaintiffLawyer}</p>
            </div>
            <div className="vs-divider">VS</div>
            <div className="party-section">
              <h4>Defendant</h4>
              <p className="party-name">{caseData.parties.defendant}</p>
              <p className="party-lawyer">Represented by: {caseData.parties.defendantLawyer}</p>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Key Dates</h3>
          <div className="dates-info">
            <div className="date-item">
              <span className="date-label">Filed:</span>
              <span className="date-value">{new Date(caseData.dateOfFiling).toLocaleDateString()}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Last Updated:</span>
              <span className="date-value">{new Date(caseData.lastUpdated).toLocaleDateString()}</span>
            </div>
            <div className="date-item">
              <span className="date-label">Next Hearing:</span>
              <span className="date-value">Dec 15, 2023</span>
            </div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Quick Stats</h3>
          <div className="stats-info">
            <div className="stat-item">
              <span className="stat-number">{analyses.length}</span>
              <span className="stat-label">AI Analyses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{caseData.documents?.length || 0}</span>
              <span className="stat-label">Documents</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{caseData.tags?.length || 0}</span>
              <span className="stat-label">Tags</span>
            </div>
          </div>
        </div>
      </div>

      <div className="case-summary-card">
        <h3>Case Summary</h3>
        <div className="case-text">
          <pre>{caseData.caseText}</pre>
        </div>
      </div>
    </div>
  );

  const DetailsTab = () => (
    <div className="details-tab">
      <div className="details-header">
        <h3>Case Details</h3>
        <div className="details-actions">
          {!isEditing ? (
            <button className="btn btn-outline" onClick={handleEdit}>
              ✏️ Edit
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="details-form">
        <div className="form-section">
          <h4>Basic Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label>Case Title:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              ) : (
                <span className="field-value">{caseData.title}</span>
              )}
            </div>
            <div className="form-field">
              <label>Case Number:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                />
              ) : (
                <span className="field-value">{caseData.caseNumber}</span>
              )}
            </div>
            <div className="form-field">
              <label>Case Type:</label>
              {isEditing ? (
                <select
                  value={editForm.caseType}
                  onChange={(e) => handleInputChange('caseType', e.target.value)}
                >
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Constitutional">Constitutional</option>
                  <option value="Commercial">Commercial</option>
                </select>
              ) : (
                <span className="field-value">{caseData.caseType}</span>
              )}
            </div>
            <div className="form-field">
              <label>Status:</label>
              {isEditing ? (
                <select
                  value={editForm.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              ) : (
                <span className={`field-value status-${caseData.status.toLowerCase()}`}>
                  {caseData.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Court Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label>Court:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.court}
                  onChange={(e) => handleInputChange('court', e.target.value)}
                />
              ) : (
                <span className="field-value">{caseData.court}</span>
              )}
            </div>
            <div className="form-field">
              <label>Judge:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.judge}
                  onChange={(e) => handleInputChange('judge', e.target.value)}
                />
              ) : (
                <span className="field-value">{caseData.judge}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Tags</h4>
          <div className="tags-section">
            {caseData.tags.map((tag, index) => (
              <span key={index} className="case-tag">{tag}</span>
            ))}
            {isEditing && (
              <button className="btn btn-outline btn-small">+ Add Tag</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const AnalysesTab = () => (
    <div className="analyses-tab">
      <div className="analyses-header">
        <h3>AI Analyses</h3>
        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('analysis', caseId)}
        >
          🤖 New Analysis
        </button>
      </div>

      <div className="analyses-list">
        {analyses.map(analysis => (
          <div key={analysis.id} className="analysis-card">
            <div className="analysis-header">
              <div className="analysis-title">
                <h4>{analysis.type}</h4>
                <span className={`analysis-status ${analysis.status.toLowerCase()}`}>
                  {analysis.status}
                </span>
              </div>
              <div className="analysis-meta">
                <span className="provider-badge">{analysis.aiProvider}</span>
                <span className="model-info">{analysis.model}</span>
              </div>
            </div>
            
            <div className="analysis-content">
              <p>{analysis.result}</p>
            </div>
            
            <div className="analysis-footer">
              <div className="analysis-stats">
                <span>📊 {analysis.tokensUsed} tokens</span>
                <span>⏱️ {analysis.processingTime}ms</span>
                <span>🕒 {analysis.createdAt}</span>
              </div>
              <button className="btn btn-outline btn-small">
                View Full Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DocumentsTab = () => (
    <div className="documents-tab">
      <div className="documents-header">
        <h3>Case Documents</h3>
        <button className="btn btn-primary">
          📎 Upload Document
        </button>
      </div>

      <div className="documents-list">
        {caseData.documents?.map((doc, index) => (
          <div key={index} className="document-item">
            <div className="document-icon">
              {doc.type === 'Contract' ? '📄' : 
               doc.type === 'Evidence' ? '🔍' : '📋'}
            </div>
            <div className="document-info">
              <h4>{doc.name}</h4>
              <div className="document-meta">
                <span className="doc-type">{doc.type}</span>
                <span className="doc-size">{doc.size}</span>
                <span className="doc-date">Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="document-actions">
              <button className="btn btn-outline btn-small">View</button>
              <button className="btn btn-outline btn-small">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TimelineTab = () => (
    <div className="timeline-tab">
      <div className="timeline-header">
        <h3>Case Timeline</h3>
        <button className="btn btn-primary">
          ➕ Add Event
        </button>
      </div>

      <div className="timeline-container">
        {caseData.timeline?.map((event, index) => (
          <div key={index} className={`timeline-item timeline-${event.type}`}>
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <div className="timeline-date">
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="timeline-event">
                {event.event}
              </div>
              <div className="timeline-type">
                {event.type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="case-detail-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="case-not-found">
        <h2>Case Not Found</h2>
        <p>The requested case could not be found.</p>
        <button 
          className="btn btn-primary"
          onClick={() => onNavigate('cases')}
        >
          Back to Cases
        </button>
      </div>
    );
  }

  return (
    <div className="case-detail-page">
      {/* Header */}
      <div className="case-detail-header">
        <div className="header-left">
          <button 
            className="back-btn"
            onClick={() => onNavigate('cases')}
          >
            ← Back to Cases
          </button>
          <div className="case-title-section">
            <h1>{caseData.title}</h1>
            <div className="case-badges">
              <span className={`status-badge ${caseData.status.toLowerCase()}`}>
                {caseData.status}
              </span>
              <span className={`priority-badge priority-${caseData.priority.toLowerCase()}`}>
                {caseData.priority} Priority
              </span>
              <span className="case-number-badge">
                {caseData.caseNumber}
              </span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => onNavigate('analysis', caseId)}
          >
            🤖 Run Analysis
          </button>
          <button className="btn btn-primary">
            📊 Generate Report
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'details' && <DetailsTab />}
        {activeTab === 'analyses' && <AnalysesTab />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'timeline' && <TimelineTab />}
      </div>
    </div>
  );
};

export default CaseDetailPage;