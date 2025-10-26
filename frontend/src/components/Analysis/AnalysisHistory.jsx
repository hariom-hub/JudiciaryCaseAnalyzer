import React, { useState } from 'react';
import './AnalysisHistory.css';

const AnalysisHistory = ({ onSelectAnalysis, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Sample analysis history data
  const analysisHistory = [
    {
      id: 1,
      caseTitle: "Smith vs. State Corporation",
      caseNumber: "CV-2023-001",
      analysisType: "Case Summary",
      provider: "OpenAI",
      model: "GPT-4",
      status: "completed",
      createdAt: "2024-09-30T10:30:00",
      duration: "45s",
      tokensUsed: 2456,
      result: "Analysis completed successfully"
    },
    {
      id: 2,
      caseTitle: "Criminal Case - Robbery Investigation",
      caseNumber: "CR-2023-045",
      analysisType: "Legal Issues",
      provider: "Gemini",
      model: "Gemini Pro",
      status: "completed",
      createdAt: "2024-09-30T09:15:00",
      duration: "38s",
      tokensUsed: 1823,
      result: "Analysis completed successfully"
    },
    {
      id: 3,
      caseTitle: "Johnson vs. City Planning Department",
      caseNumber: "AD-2023-012",
      analysisType: "Precedent Analysis",
      provider: "Groq",
      model: "Llama 3 70B",
      status: "failed",
      createdAt: "2024-09-29T16:45:00",
      duration: "12s",
      tokensUsed: 0,
      result: "API timeout error"
    },
    {
      id: 4,
      caseTitle: "Smith vs. State Corporation",
      caseNumber: "CV-2023-001",
      analysisType: "Outcome Prediction",
      provider: "OpenAI",
      model: "GPT-3.5 Turbo",
      status: "completed",
      createdAt: "2024-09-29T14:20:00",
      duration: "32s",
      tokensUsed: 1654,
      result: "Analysis completed successfully"
    },
    {
      id: 5,
      caseTitle: "Patent Infringement Case #234",
      caseNumber: "IP-2023-098",
      analysisType: "Strengths & Weaknesses",
      provider: "Gemini",
      model: "Gemini Pro",
      status: "processing",
      createdAt: "2024-09-30T11:00:00",
      duration: "0s",
      tokensUsed: 0,
      result: "In progress..."
    }
  ];

  const getProviderIcon = (provider) => {
    const icons = {
      'OpenAI': '🧠',
      'Gemini': '💎',
      'Groq': '⚡'
    };
    return icons[provider] || '🤖';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'completed': { text: 'Completed', class: 'status-completed' },
      'processing': { text: 'Processing', class: 'status-processing' },
      'failed': { text: 'Failed', class: 'status-failed' }
    };
    return badges[status] || { text: status, class: 'status-unknown' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredHistory = analysisHistory
    .filter(item => {
      if (filter !== 'all' && item.status !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.caseTitle.toLowerCase().includes(query) ||
          item.caseNumber.toLowerCase().includes(query) ||
          item.analysisType.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const stats = {
    total: analysisHistory.length,
    completed: analysisHistory.filter(a => a.status === 'completed').length,
    processing: analysisHistory.filter(a => a.status === 'processing').length,
    failed: analysisHistory.filter(a => a.status === 'failed').length
  };

  return (
    <div className="analysis-history-container">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <h1>Analysis History</h1>
          <p>View and manage all your AI case analyses</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="history-stats">
        <div className="stat-card" onClick={() => setFilter('all')}>
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Analyses</div>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => setFilter('completed')}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => setFilter('processing')}>
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.processing}</div>
            <div className="stat-label">Processing</div>
          </div>
        </div>
        
        <div className="stat-card" onClick={() => setFilter('failed')}>
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{stats.failed}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="history-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by case title, number, or analysis type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="date">Most Recent</option>
              <option value="case">Case Name</option>
              <option value="provider">AI Provider</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analysis List */}
      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No analyses found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredHistory.map(analysis => (
            <div 
              key={analysis.id} 
              className="history-item"
              onClick={() => onSelectAnalysis(analysis)}
            >
              <div className="item-main">
                <div className="item-header">
                  <div className="item-title-section">
                    <h3 className="item-title">{analysis.caseTitle}</h3>
                    <span className="case-number">{analysis.caseNumber}</span>
                  </div>
                  <div className={`status-badge ${getStatusBadge(analysis.status).class}`}>
                    {getStatusBadge(analysis.status).text}
                  </div>
                </div>

                <div className="item-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Analysis Type:</span>
                      <span className="detail-value">{analysis.analysisType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Provider:</span>
                      <span className="detail-value">
                        <span className="provider-icon">{getProviderIcon(analysis.provider)}</span>
                        {analysis.provider}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Model:</span>
                      <span className="detail-value">{analysis.model}</span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{analysis.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tokens:</span>
                      <span className="detail-value">{analysis.tokensUsed.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(analysis.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item-actions">
                <button 
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAnalysis(analysis);
                  }}
                  title="View Details"
                >
                  <span>👁️</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Download functionality coming soon!');
                  }}
                  title="Download"
                >
                  <span>⬇️</span>
                </button>
                <button 
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Share functionality coming soon!');
                  }}
                  title="Share"
                >
                  <span>📤</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;