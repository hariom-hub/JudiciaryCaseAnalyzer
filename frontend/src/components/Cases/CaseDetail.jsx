import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import caseService from '../../services/caseService';
import { formatDate, formatDateTime, getStatusColor, getPriorityColor } from '../../utils/helpers';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaseDetail();
  }, [id]);

  const fetchCaseDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await caseService.getCaseById(id);
      
      if (response.success) {
        setCaseData(response.data);
      } else {
        setError('Case not found');
      }
    } catch (err) {
      console.error('Error fetching case detail:', err);
      setError(err.message || 'Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      return;
    }

    try {
      await caseService.deleteCase(id);
      alert('Case deleted successfully');
      navigate('/cases');
    } catch (err) {
      console.error('Error deleting case:', err);
      alert('Failed to delete case. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format) => {
    try {
      const exported = caseService.exportCase(caseData, format);
      const blob = new Blob([exported], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `case-${caseData.caseNumber || caseData._id}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting case:', err);
      alert('Failed to export case');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
        <Link to="/cases" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Cases
        </Link>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  const statusColor = getStatusColor(caseData.status);
  const priorityColor = getPriorityColor(caseData.priority);

  return (
    <div className="container mt-4 mb-5">
      {/* Header Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/cases" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Cases
        </Link>
        <div className="btn-group">
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print
          </button>
          <button 
            className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" 
            data-bs-toggle="dropdown"
          >
            <span className="visually-hidden">Export options</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={() => handleExport('json')}>
                <i className="bi bi-file-earmark-code me-2"></i>
                Export as JSON
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleExport('txt')}>
                <i className="bi bi-file-earmark-text me-2"></i>
                Export as Text
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-2">{caseData.title}</h2>
              {caseData.caseNumber && (
                <p className="text-muted mb-2">
                  <i className="bi bi-hash me-1"></i>
                  Case Number: <strong>{caseData.caseNumber}</strong>
                </p>
              )}
              <div>
                <span className={`badge bg-${statusColor} me-2`}>
                  {caseData.status}
                </span>
                <span className={`badge bg-${priorityColor} me-2`}>
                  {caseData.priority} Priority
                </span>
                <span className="badge bg-secondary">
                  {caseData.caseType}
                </span>
              </div>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link to={`/cases/${id}/edit`} className="dropdown-item">
                    <i className="bi bi-pencil me-2"></i>
                    Edit Case
                  </Link>
                </li>
                <li>
                  <Link to={`/analysis?caseId=${id}`} className="dropdown-item">
                    <i className="bi bi-cpu me-2"></i>
                    Analyze Case
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleDelete}>
                    <i className="bi bi-trash me-2"></i>
                    Delete Case
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Court Information */}
          {(caseData.court || caseData.judge || caseData.jurisdiction) && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-building me-2"></i>
                Court Information
              </h5>
              <div className="row g-3">
                {caseData.court && (
                  <div className="col-md-4">
                    <strong className="d-block text-muted small">Court</strong>
                    <span>{caseData.court}</span>
                  </div>
                )}
                {caseData.judge && (
                  <div className="col-md-4">
                    <strong className="d-block text-muted small">Judge</strong>
                    <span>{caseData.judge}</span>
                  </div>
                )}
                {caseData.jurisdiction && (
                  <div className="col-md-4">
                    <strong className="d-block text-muted small">Jurisdiction</strong>
                    <span>{caseData.jurisdiction}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parties Information */}
          {caseData.parties && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-people me-2"></i>
                Parties
              </h5>
              <div className="row g-3">
                {caseData.parties.plaintiff && (
                  <div className="col-md-6">
                    <strong className="d-block text-muted small">Plaintiff</strong>
                    <span>{caseData.parties.plaintiff}</span>
                    {caseData.parties.plaintiffLawyer && (
                      <div className="small text-muted mt-1">
                        Lawyer: {caseData.parties.plaintiffLawyer}
                      </div>
                    )}
                  </div>
                )}
                {caseData.parties.defendant && (
                  <div className="col-md-6">
                    <strong className="d-block text-muted small">Defendant</strong>
                    <span>{caseData.parties.defendant}</span>
                    {caseData.parties.defendantLawyer && (
                      <div className="small text-muted mt-1">
                        Lawyer: {caseData.parties.defendantLawyer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Important Dates */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3">
              <i className="bi bi-calendar me-2"></i>
              Important Dates
            </h5>
            <div className="row g-3">
              {caseData.dateOfFiling && (
                <div className="col-md-4">
                  <strong className="d-block text-muted small">Date of Filing</strong>
                  <span>{formatDate(caseData.dateOfFiling)}</span>
                </div>
              )}
              {caseData.dateOfHearing && (
                <div className="col-md-4">
                  <strong className="d-block text-muted small">Next Hearing</strong>
                  <span>{formatDate(caseData.dateOfHearing)}</span>
                </div>
              )}
              {caseData.dateOfDecision && (
                <div className="col-md-4">
                  <strong className="d-block text-muted small">Date of Decision</strong>
                  <span>{formatDate(caseData.dateOfDecision)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          {caseData.claimAmount && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-currency-dollar me-2"></i>
                Financial Information
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <strong className="d-block text-muted small">Claim Amount</strong>
                  <span className="fs-5">
                    {caseData.currency} {caseData.claimAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {caseData.summary && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-file-text me-2"></i>
                Summary
              </h5>
              <p className="text-muted">{caseData.summary}</p>
            </div>
          )}

          {/* Case Details */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3">
              <i className="bi bi-file-earmark-text me-2"></i>
              Full Case Description
            </h5>
            <div className="bg-light p-3 rounded">
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {caseData.caseText}
              </p>
            </div>
          </div>

          {/* Legal Issues */}
          {caseData.legalIssues && caseData.legalIssues.length > 0 && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-journal-text me-2"></i>
                Legal Issues
              </h5>
              <ul className="list-group">
                {caseData.legalIssues.map((issue, index) => (
                  <li key={index} className="list-group-item">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Statutes */}
          {caseData.statutes && caseData.statutes.length > 0 && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-book me-2"></i>
                Relevant Statutes
              </h5>
              <ul className="list-group">
                {caseData.statutes.map((statute, index) => (
                  <li key={index} className="list-group-item">
                    {statute}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {caseData.tags && caseData.tags.length > 0 && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-tags me-2"></i>
                Tags
              </h5>
              <div>
                {caseData.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {caseData.documents && caseData.documents.length > 0 && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-files me-2"></i>
                Documents
              </h5>
              <div className="list-group">
                {caseData.documents.map((doc, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-file-earmark me-2"></i>
                        <strong>{doc.name}</strong>
                        {doc.type && (
                          <span className="badge bg-info ms-2">{doc.type}</span>
                        )}
                      </div>
                      {doc.uploadDate && (
                        <small className="text-muted">
                          {formatDate(doc.uploadDate)}
                        </small>
                      )}
                    </div>
                    {doc.description && (
                      <p className="mb-0 mt-2 small text-muted">{doc.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {caseData.timeline && caseData.timeline.length > 0 && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Timeline
              </h5>
              <div className="timeline">
                {caseData.timeline.map((event, index) => (
                  <div key={index} className="timeline-item mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="timeline-marker bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-circle-fill"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex justify-content-between">
                          <strong>{event.event}</strong>
                          <small className="text-muted">{formatDate(event.date)}</small>
                        </div>
                        {event.type && (
                          <span className="badge bg-secondary mt-1">{event.type}</span>
                        )}
                        {event.description && (
                          <p className="mb-0 mt-2 text-muted small">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outcome */}
          {caseData.outcome && caseData.outcome.result && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-trophy me-2"></i>
                Outcome
              </h5>
              <div className="alert alert-info">
                <strong>Result:</strong> {caseData.outcome.result}
                {caseData.outcome.awardAmount && (
                  <div className="mt-2">
                    <strong>Award Amount:</strong> {caseData.currency} {caseData.outcome.awardAmount.toLocaleString()}
                  </div>
                )}
                {caseData.outcome.description && (
                  <p className="mb-0 mt-2">{caseData.outcome.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {caseData.notes && (
            <div className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-sticky me-2"></i>
                Notes
              </h5>
              <div className="alert alert-warning">
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{caseData.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mb-4">
            <h5 className="border-bottom pb-2 mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Metadata
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <strong className="d-block text-muted small">Created</strong>
                <span>{formatDateTime(caseData.createdAt)}</span>
              </div>
              <div className="col-md-6">
                <strong className="d-block text-muted small">Last Updated</strong>
                <span>{formatDateTime(caseData.updatedAt)}</span>
              </div>
              {caseData.analysisCount > 0 && (
                <div className="col-md-6">
                  <strong className="d-block text-muted small">AI Analyses</strong>
                  <span className="badge bg-info">{caseData.analysisCount}</span>
                </div>
              )}
              {caseData.lastAnalysisDate && (
                <div className="col-md-6">
                  <strong className="d-block text-muted small">Last Analysis</strong>
                  <span>{formatDateTime(caseData.lastAnalysisDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="card-footer bg-white">
          <div className="d-flex gap-2">
            <Link 
              to={`/cases/${id}/edit`}
              className="btn btn-outline-primary"
            >
              <i className="bi bi-pencil me-2"></i>
              Edit Case
            </Link>
            <Link 
              to={`/analysis?caseId=${id}`}
              className="btn btn-primary"
            >
              <i className="bi bi-cpu me-2"></i>
              Analyze with AI
            </Link>
          </div>
        </div>
      </div>

      {/* Analysis History Section */}
      {caseData.analysisCount > 0 && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <i className="bi bi-graph-up me-2"></i>
              Analysis History ({caseData.analysisCount})
            </h5>
          </div>
          <div className="card-body">
            <p className="text-muted">
              This case has been analyzed {caseData.analysisCount} time{caseData.analysisCount !== 1 ? 's' : ''}.
            </p>
            <Link 
              to={`/analysis?caseId=${id}`}
              className="btn btn-primary"
            >
              <i className="bi bi-list me-2"></i>
              View All Analyses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;