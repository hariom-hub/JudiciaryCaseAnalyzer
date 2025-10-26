import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText, getStatusColor, getPriorityColor } from '../../utils/helpers';

const CaseCard = ({ caseData, onDelete, onRefresh }) => {
  const {
    _id,
    title,
    caseNumber,
    caseType,
    status,
    priority,
    court,
    parties,
    dateOfFiling,
    caseText,
    createdAt,
    analysisCount
  } = caseData;

  // Get badge colors
  const statusColor = getStatusColor(status);
  const priorityColor = getPriorityColor(priority);

  // Handle delete click
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(_id);
    }
  };

  return (
    <div className="card h-100 shadow-sm hover-shadow transition">
      <div className="card-body d-flex flex-column">
        {/* Header with badges */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <span className={`badge bg-${statusColor} me-2`}>
              {status}
            </span>
            {priority && (
              <span className={`badge bg-${priorityColor}`}>
                {priority}
              </span>
            )}
          </div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted p-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link to={`/cases/${_id}`} className="dropdown-item">
                  <i className="bi bi-eye me-2"></i>
                  View Details
                </Link>
              </li>
              <li>
                <Link to={`/cases/${_id}/edit`} className="dropdown-item">
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleDeleteClick}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Case Number */}
        {caseNumber && (
          <div className="text-muted small mb-2">
            <i className="bi bi-hash me-1"></i>
            {caseNumber}
          </div>
        )}

        {/* Title */}
        <h5 className="card-title mb-2">
          <Link 
            to={`/cases/${_id}`} 
            className="text-decoration-none text-dark"
            title={title}
          >
            {truncateText(title, 60)}
          </Link>
        </h5>

        {/* Case Type */}
        <div className="mb-2">
          <span className="badge bg-secondary">
            <i className="bi bi-folder me-1"></i>
            {caseType}
          </span>
        </div>

        {/* Parties Information */}
        {parties && (parties.plaintiff || parties.defendant) && (
          <div className="mb-3 small text-muted">
            {parties.plaintiff && (
              <div className="mb-1">
                <i className="bi bi-person me-1"></i>
                <strong>Plaintiff:</strong> {truncateText(parties.plaintiff, 30)}
              </div>
            )}
            {parties.defendant && (
              <div>
                <i className="bi bi-person-fill me-1"></i>
                <strong>Defendant:</strong> {truncateText(parties.defendant, 30)}
              </div>
            )}
          </div>
        )}

        {/* Case Description Preview */}
        {caseText && (
          <p className="card-text text-muted small mb-3">
            {truncateText(caseText, 100)}
          </p>
        )}

        {/* Court Info */}
        {court && (
          <div className="mb-2 small">
            <i className="bi bi-building me-1 text-muted"></i>
            {court}
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="mt-auto">
          {/* Stats */}
          <div className="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
            <div className="small text-muted">
              <i className="bi bi-calendar3 me-1"></i>
              {dateOfFiling ? formatDate(dateOfFiling) : formatDate(createdAt)}
            </div>
            {analysisCount > 0 && (
              <div className="small">
                <span className="badge bg-info">
                  <i className="bi bi-graph-up me-1"></i>
                  {analysisCount} {analysisCount === 1 ? 'Analysis' : 'Analyses'}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="d-grid gap-2">
            <Link 
              to={`/cases/${_id}`} 
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-eye me-2"></i>
              View Details
            </Link>
            <Link 
              to={`/analysis?caseId=${_id}`}
              className="btn btn-sm btn-primary"
            >
              <i className="bi bi-cpu me-2"></i>
              Analyze Case
            </Link>
          </div>
        </div>
      </div>

      {/* Card Footer with metadata */}
      <div className="card-footer bg-light small text-muted">
        <i className="bi bi-clock me-1"></i>
        Added {formatDate(createdAt)}
      </div>
    </div>
  );
};

export default CaseCard;