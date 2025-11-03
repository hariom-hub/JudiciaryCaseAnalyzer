import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cases.css';

// 👇 backend URL handle karega from .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Cases = ({ onNavigate }) => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // 🟢 Fetch cases from backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await axios.get(`${API_BASE_URL}/cases`);
        if (response.data && Array.isArray(response.data)) {
          setCases(response.data);
          setFilteredCases(response.data);
        } else if (response.data.cases) {
          // backend response structure = { success: true, cases: [...] }
          setCases(response.data.cases);
          setFilteredCases(response.data.cases);
        } else {
          setError('Unexpected API response structure');
        }
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to fetch cases from backend');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  // 🟡 Filter and search logic
  useEffect(() => {
    let filtered = cases.filter((case_item) => {
      const matchesSearch =
        searchTerm === '' ||
        case_item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.parties?.plaintiff?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_item.parties?.defendant?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' || case_item.status?.toLowerCase() === filterStatus;
      const matchesType =
        filterType === 'all' ||
        case_item.caseType?.toLowerCase() === filterType.toLowerCase();

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
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
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
      className={`case-card ${isListView ? 'list-view' : 'grid-view'} priority-${case_item.priority?.toLowerCase()}`}
      onClick={() => handleCaseClick(case_item._id)}
    >
      <div className="case-card-header">
        <div className="case-title-section">
          <h3 className="case-title">{case_item.title}</h3>
          <div className="case-badges">
            <span className={`status-badge ${case_item.status?.toLowerCase()}`}>
              {case_item.status}
            </span>
            <span className={`priority-badge priority-${case_item.priority?.toLowerCase()}`}>
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
            <span className="info-value">
              {new Date(case_item.dateOfFiling).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="parties-section">
          <div className="party">
            <span className="party-label">Plaintiff:</span>
            <span className="party-name">{case_item.parties?.plaintiff}</span>
          </div>
          <div className="party">
            <span className="party-label">Defendant:</span>
            <span className="party-name">{case_item.parties?.defendant}</span>
          </div>
        </div>

        <div className="case-tags">
          {case_item.tags?.map((tag, index) => (
            <span key={index} className="case-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="case-card-footer">
        <div className="case-stats">
          <span className="stat-item">
            <span className="stat-icon">🤖</span>
            <span className="stat-text">
              {case_item.analysesCount || 0} analyses
            </span>
          </span>
          <span className="stat-item">
            <span className="stat-icon">🕒</span>
            <span className="stat-text">
              Updated {new Date(case_item.lastUpdated).toLocaleDateString()}
            </span>
          </span>
        </div>

        <div className="case-actions">
          <button
            className="btn btn-outline btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleCaseClick(case_item._id);
            }}
          >
            View Details
          </button>
          <button
            className="btn btn-primary btn-small"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('analysis', case_item._id);
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

  if (error) {
    return (
      <div className="no-cases">
        <h3>⚠️ {error}</h3>
        <p>Make sure backend is running and API URL is correct.</p>
      </div>
    );
  }

  return (
    <div className="cases-page">
      <div className="cases-header">
        <div className="header-left">
          <h1>Legal Cases</h1>
          <p>Manage and analyze your legal case portfolio</p>
        </div>
        <div className="header-right">
          <button className="btn btn-primary" onClick={() => onNavigate('add-case')}>
            <span>➕</span> Add New Case
          </button>
        </div>
      </div>

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
              <button className="clear-search" onClick={() => setSearchTerm('')}>
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

      <div className="results-summary">
        <span className="results-count">
          {filteredCases.length} of {cases.length} cases
        </span>
        {searchTerm && (
          <span className="search-indicator">Search results for "{searchTerm}"</span>
        )}
      </div>

      {filteredCases.length === 0 ? (
        <div className="no-cases">
          <div className="no-cases-illustration">
            <span className="no-cases-icon">📋</span>
          </div>
          <h3>No cases found</h3>
          <p>
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first case'}
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('add-case')}>
            Add New Case
          </button>
        </div>
      ) : (
        <div className={`cases-container ${viewMode}-view`}>
          {filteredCases.map((case_item) => (
            <CaseCard
              key={case_item._id}
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
