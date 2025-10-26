import React, { useState, useEffect } from 'react';
// import './Home.css';
import './Cases.css';

const Cases = ({ onNavigate }) => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Sample cases data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const sampleCases = [
        {
          id: 1,
          title: "Smith vs. State Corporation",
          caseNumber: "CV-2023-001",
          caseType: "Civil",
          status: "Active",
          priority: "High",
          dateOfFiling: "2023-09-15",
          lastUpdated: "2023-09-23",
          parties: {
            plaintiff: "John Smith",
            defendant: "State Corporation"
          },
          court: "Supreme Court",
          tags: ["Contract Dispute", "Commercial"],
          analysesCount: 3
        },
        {
          id: 2,
          title: "Criminal Case - Robbery Investigation",
          caseNumber: "CR-2023-045",
          caseType: "Criminal",
          status: "Pending",
          priority: "Medium",
          dateOfFiling: "2023-09-10",
          lastUpdated: "2023-09-22",
          parties: {
            plaintiff: "State",
            defendant: "Mike Johnson"
          },
          court: "District Court",
          tags: ["Robbery", "Investigation"],
          analysesCount: 1
        },
        {
          id: 3,
          title: "Johnson vs. City Planning Department",
          caseNumber: "AD-2023-012",
          caseType: "Administrative",
          status: "Active",
          priority: "Low",
          dateOfFiling: "2023-09-08",
          lastUpdated: "2023-09-21",
          parties: {
            plaintiff: "Sarah Johnson",
            defendant: "City Planning Department"
          },
          court: "Administrative Court",
          tags: ["Planning", "Municipal"],
          analysesCount: 2
        },
        {
          id: 4,
          title: "Brown vs. Insurance Company",
          caseNumber: "CV-2023-089",
          caseType: "Civil",
          status: "Closed",
          priority: "Medium",
          dateOfFiling: "2023-08-15",
          lastUpdated: "2023-09-20",
          parties: {
            plaintiff: "Robert Brown",
            defendant: "XYZ Insurance Co."
          },
          court: "High Court",
          tags: ["Insurance", "Claim Dispute"],
          analysesCount: 5
        },
        {
          id: 5,
          title: "Constitutional Challenge - Privacy Rights",
          caseNumber: "CC-2023-003",
          caseType: "Constitutional",
          status: "Active",
          priority: "High",
          dateOfFiling: "2023-07-20",
          lastUpdated: "2023-09-19",
          parties: {
            plaintiff: "Citizens Rights Group",
            defendant: "Federal Government"
          },
          court: "Supreme Court",
          tags: ["Privacy", "Constitutional", "Rights"],
          analysesCount: 8
        },
        {
          id: 6,
          title: "Wilson vs. Tech Solutions Ltd",
          caseNumber: "CV-2023-156",
          caseType: "Commercial",
          status: "Pending",
          priority: "Medium",
          dateOfFiling: "2023-08-30",
          lastUpdated: "2023-09-18",
          parties: {
            plaintiff: "David Wilson",
            defendant: "Tech Solutions Ltd"
          },
          court: "Commercial Court",
          tags: ["Technology", "Contract"],
          analysesCount: 0
        }
      ];
      
      setCases(sampleCases);
      setFilteredCases(sampleCases);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = cases.filter(case_item => {
      const matchesSearch = searchTerm === '' || 
        case_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.parties.plaintiff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.parties.defendant.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || case_item.status.toLowerCase() === filterStatus;
      const matchesType = filterType === 'all' || case_item.caseType.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort cases
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'oldest':
          return new Date(a.lastUpdated) - new Date(b.lastUpdated);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredCases(filtered);
  }, [cases, searchTerm, filterStatus, filterType, sortBy]);

  const handleCaseClick = (caseId) => {
    onNavigate('case-detail', caseId);
  };

  const CaseCard = ({ case_item, isListView = false }) => (
    <div 
      className={`case-card ${isListView ? 'list-view' : 'grid-view'} priority-${case_item.priority.toLowerCase()}`}
      onClick={() => handleCaseClick(case_item.id)}
    >
      <div className="case-card-header">
        <div className="case-title-section">
          <h3 className="case-title">{case_item.title}</h3>
          <div className="case-badges">
            <span className={`status-badge ${case_item.status.toLowerCase()}`}>
              {case_item.status}
            </span>
            <span className={`priority-badge priority-${case_item.priority.toLowerCase()}`}>
              {case_item.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="case-card-content">
        <div className="case-info-grid">
          <div className="info-item">
            <span className="info-label">Case #:</span>
            <span className="info-value">{case_item.caseNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Type:</span>
            <span className="info-value">{case_item.caseType}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Court:</span>
            <span className="info-value">{case_item.court}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Filed:</span>
            <span className="info-value">{new Date(case_item.dateOfFiling).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="parties-section">
          <div className="party">
            <span className="party-label">Plaintiff:</span>
            <span className="party-name">{case_item.parties.plaintiff}</span>
          </div>
          <div className="party">
            <span className="party-label">Defendant:</span>
            <span className="party-name">{case_item.parties.defendant}</span>
          </div>
        </div>

        <div className="case-tags">
          {case_item.tags.map((tag, index) => (
            <span key={index} className="case-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="case-card-footer">
        <div className="case-stats">
          <span className="stat-item">
            <span className="stat-icon">🤖</span>
            <span className="stat-text">{case_item.analysesCount} analyses</span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">🕒</span>
            <span className="stat-text">Updated {new Date(case_item.lastUpdated).toLocaleDateString()}</span>
          </span>
        </div>
        
        <div className="case-actions">
          <button 
            className="btn btn-outline btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleCaseClick(case_item.id);
            }}
          >
            View Details
          </button>
          <button 
            className="btn btn-primary btn-small"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('analysis', case_item.id);
            }}
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="cases-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cases-page">
      {/* Header */}
      <div className="cases-header">
        <div className="header-left">
          <h1>Legal Cases</h1>
          <p>Manage and analyze your legal case portfolio</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('add-case')}
          >
            <span>➕</span> Add New Case
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="cases-controls">
        <div className="search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search cases by title, number, or parties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="civil">Civil</option>
              <option value="criminal">Criminal</option>
              <option value="administrative">Administrative</option>
              <option value="constitutional">Constitutional</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              ⊞
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          {filteredCases.length} of {cases.length} cases
        </span>
        {searchTerm && (
          <span className="search-indicator">
            Search results for "{searchTerm}"
          </span>
        )}
      </div>

      {/* Cases Grid/List */}
      {filteredCases.length === 0 ? (
        <div className="no-cases">
          <div className="no-cases-illustration">
            <span className="no-cases-icon">📋</span>
          </div>
          <h3>No cases found</h3>
          <p>
            {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first case'
            }
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate('add-case')}
          >
            Add New Case
          </button>
        </div>
      ) : (
        <div className={`cases-container ${viewMode}-view`}>
          {filteredCases.map(case_item => (
            <CaseCard 
              key={case_item.id} 
              case_item={case_item} 
              isListView={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cases;