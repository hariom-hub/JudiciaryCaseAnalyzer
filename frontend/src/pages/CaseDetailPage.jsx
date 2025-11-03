import React, { useState, useEffect } from 'react';
import './CaseDetailPage.css';

const CaseDetailPage = ({ caseId, onNavigate }) => {
  const [caseData, setCaseData] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // ✅ Fetch case details from backend dynamically
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cases/${caseId}`);
        if (!response.ok) throw new Error('Failed to fetch case');
        const data = await response.json();

        // 🧩 Normalize missing fields (safe defaults)
        const normalizedCase = {
          title: data.title || "Untitled Case",
          caseNumber: data.caseNumber || "N/A",
          caseType: data.caseType || "Unknown",
          status: data.status || "Pending",
          priority: data.priority || "Medium",
          court: data.court || "Not Specified",
          judge: data.judge || "Not Assigned",
          dateOfFiling: data.dateOfFiling || new Date().toISOString(),
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          caseText: data.caseText || "No summary available.",
          parties: data.parties || {
            plaintiff: "Unknown",
            defendant: "Unknown",
            plaintiffLawyer: "N/A",
            defendantLawyer: "N/A",
          },
          documents: data.documents || [],
          tags: data.tags || [],
          timeline: data.timeline || [],
        };

        setCaseData(normalizedCase);
        setAnalyses(data.analyses || []);
        setEditForm(normalizedCase);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching case:", error);
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  // --------------------------- HANDLERS ---------------------------

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    setCaseData({ ...caseData, ...editForm });
    setIsEditing(false);
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

  // --------------------------- COMPONENTS ---------------------------

  const TabNavigation = () => (
    <div className="tab-navigation">
      {["overview", "details", "analyses", "documents", "timeline"].map(tab => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab ? "active" : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === "overview" && "📄 Overview"}
          {tab === "details" && "📋 Details"}
          {tab === "analyses" && `🤖 AI Analyses (${analyses.length})`}
          {tab === "documents" && `📎 Documents (${caseData?.documents?.length || 0})`}
          {tab === "timeline" && "🕒 Timeline"}
        </button>
      ))}
    </div>
  );

  const OverviewTab = () => (
    <div className="overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <h3>Case Information</h3>
          <div className="info-grid">
            <div className="info-row"><span className="label">Case Number:</span><span className="value">{caseData.caseNumber}</span></div>
            <div className="info-row"><span className="label">Type:</span><span className="value">{caseData.caseType}</span></div>
            <div className="info-row"><span className="label">Status:</span><span className={`value status-${caseData.status.toLowerCase()}`}>{caseData.status}</span></div>
            <div className="info-row"><span className="label">Priority:</span><span className={`value priority-${caseData.priority.toLowerCase()}`}>{caseData.priority}</span></div>
            <div className="info-row"><span className="label">Court:</span><span className="value">{caseData.court}</span></div>
            <div className="info-row"><span className="label">Judge:</span><span className="value">{caseData.judge}</span></div>
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
            <div className="date-item"><span className="date-label">Filed:</span><span className="date-value">{new Date(caseData.dateOfFiling).toLocaleDateString()}</span></div>
            <div className="date-item"><span className="date-label">Last Updated:</span><span className="date-value">{new Date(caseData.lastUpdated).toLocaleDateString()}</span></div>
            <div className="date-item"><span className="date-label">Next Hearing:</span><span className="date-value">Dec 15, 2023</span></div>
          </div>
        </div>

        <div className="overview-card">
          <h3>Quick Stats</h3>
          <div className="stats-info">
            <div className="stat-item"><span className="stat-number">{analyses.length}</span><span className="stat-label">AI Analyses</span></div>
            <div className="stat-item"><span className="stat-number">{caseData.documents?.length || 0}</span><span className="stat-label">Documents</span></div>
            <div className="stat-item"><span className="stat-number">{caseData.tags?.length || 0}</span><span className="stat-label">Tags</span></div>
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
            <button className="btn btn-outline" onClick={handleEdit}>✏️ Edit</button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-outline" onClick={handleCancel}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
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
                <input type="text" value={editForm.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              ) : (
                <span className="field-value">{caseData.title}</span>
              )}
            </div>
            <div className="form-field">
              <label>Case Number:</label>
              {isEditing ? (
                <input type="text" value={editForm.caseNumber} onChange={(e) => handleInputChange('caseNumber', e.target.value)} />
              ) : (
                <span className="field-value">{caseData.caseNumber}</span>
              )}
            </div>
            <div className="form-field">
              <label>Case Type:</label>
              {isEditing ? (
                <select value={editForm.caseType} onChange={(e) => handleInputChange('caseType', e.target.value)}>
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
                <select value={editForm.status} onChange={(e) => handleInputChange('status', e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              ) : (
                <span className={`field-value status-${caseData.status.toLowerCase()}`}>{caseData.status}</span>
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
                <input type="text" value={editForm.court} onChange={(e) => handleInputChange('court', e.target.value)} />
              ) : (
                <span className="field-value">{caseData.court}</span>
              )}
            </div>
            <div className="form-field">
              <label>Judge:</label>
              {isEditing ? (
                <input type="text" value={editForm.judge} onChange={(e) => handleInputChange('judge', e.target.value)} />
              ) : (
                <span className="field-value">{caseData.judge}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------------- RENDER ---------------------------

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
        <button className="btn btn-primary" onClick={() => onNavigate('cases')}>
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
          <button className="back-btn" onClick={() => onNavigate('cases')}>
            ← Back to Cases
          </button>
          <div className="case-title-section">
            <h1>{caseData.title}</h1>
            <div className="case-badges">
              <span className={`status-badge ${caseData.status.toLowerCase()}`}>{caseData.status}</span>
              <span className={`priority-badge priority-${caseData.priority.toLowerCase()}`}>{caseData.priority} Priority</span>
              <span className="case-number-badge">{caseData.caseNumber}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => onNavigate('analysis', caseId)}>🤖 Run Analysis</button>
          <button className="btn btn-primary">📊 Generate Report</button>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation />

      {/* Content */}
      <div className="tab-content">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "details" && <DetailsTab />}
      </div>
    </div>
  );
};

export default CaseDetailPage;
